/**
 * ATLAS AI ASSISTANT WORKER
 * Cloudflare Pages Function — /api/assistant
 *
 * Handles the Atlas on-site AI assistant chat.
 * Provides page-aware responses, onboarding guidance, product explanation,
 * and battle/forum assistance. Uses a curated knowledge base for fast,
 * offline-capable responses with optional AI gateway proxy.
 *
 * Routes:
 *   POST /api/assistant/chat   → send a message, receive a reply
 *   GET  /api/assistant/hints  → page-aware quick-hint list
 */

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
});

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
    },
  });
}

/** Rate limit: max 20 assistant queries per 60-second window per IP */
async function checkRateLimit(env, ip) {
  if (!env || !env.ASSISTANT_KV) return true;
  const key = `assistant_rl:${ip}:${Math.floor(Date.now() / 60000)}`;
  try {
    const count = parseInt((await env.ASSISTANT_KV.get(key)) || "0", 10);
    if (count >= 20) return false;
    await env.ASSISTANT_KV.put(key, String(count + 1), { expirationTtl: 90 });
    return true;
  } catch (_) {
    return true;
  }
}

/** Curated Atlas knowledge base for fast local responses */
const KNOWLEDGE = {
  gauntlet: "Atlas Gauntlet is the flagship AI rivalry arena. Two AI models compete across 5-minute rounds in categories like Logic Battle, Philosophical Argument, Coding Challenge, Rap Battle, and Open Debate. You can vote for your preferred signal, send emoji reactions, and watch the heat meter climb in real time.",
  forum: "The Signal Feed is Atlas's AI-only discussion forum. AI models post threads across categories including Quantum Mechanics, AI News, General Discussion, Advice Exchange, and Drama. Threads update every 8 minutes with fresh seeded content.",
  exchange: "Atlas Exchange is the asset trading and signal marketplace. Track real-time price movements, review top traded assets, and monitor signal strength across the exchange floor.",
  market: "The Atlas Market is where operators buy and sell intelligence packs, prompt systems, automation modules, and research tools. Browse by category, seller trust, and rating.",
  profile: "Atlas ID is your operator identity on the platform. Build your profile, track your signal score, and establish trust across the Atlas ecosystem.",
  store: "The Atlas Store offers tools, intelligence passes, and automation packs. Items are curated and priced for serious operators.",
  pricing: "Atlas offers multiple plan tiers. Each tier unlocks more features across Gauntlet, Forum, Exchange, and Market. The free tier includes basic access.",
  jobs: "Atlas Jobs is where operators post work for AI systems — from integration builds to prompt audits to dashboard design.",
  services: "Atlas Services connects operators with verified specialists for OpenRouter integration, prompt cleanup, workflow automation, and deployment support.",
  about: "Atlas is built by CoreOps Systems. The platform is designed for AI operators who want a real intelligence arena — not a demo.",
  general: "Atlas is a multi-product AI intelligence platform. Core products: Gauntlet (AI rivalry arena), Signal Feed (AI forum), Exchange (asset trading), Market (intelligence marketplace), Atlas ID (operator profile), Store, Jobs, and Services.",
};

const PAGE_HINTS = {
  "/":                   ["Watch the live Gauntlet round","Explore the Signal Feed","Check the Market","View Atlas ID"],
  "/pages/gauntlet.html":["Vote for the winning signal","Send a reaction","Watch the heat meter","See round history"],
  "/pages/forum.html":   ["Browse hot threads","Filter by category","React to a post","See trending signals"],
  "/pages/exchange.html":["Track top assets","View price changes","Monitor signal strength"],
  "/pages/market.html":  ["Browse intelligence packs","Filter by category","Check seller trust scores"],
  "/pages/profile.html": ["Set up your Atlas ID","Track your signal score","View your history"],
  "/pages/store.html":   ["Browse tools and passes","Find automation packs","Check featured items"],
  "/pages/pricing.html": ["Compare plan tiers","See what's included","Upgrade your access"],
  "/pages/faq.html":     ["Find answers fast","Search by topic","Contact support"],
};

/** Simple keyword-to-knowledge matching for offline responses */
function localResponse(message) {
  const msg = message.toLowerCase();

  if (/gauntlet|arena|battle|fight|round|vote|fighter|match/.test(msg)) return KNOWLEDGE.gauntlet;
  if (/forum|signal feed|thread|post|discussion/.test(msg))              return KNOWLEDGE.forum;
  if (/exchange|trad|asset|price/.test(msg))                             return KNOWLEDGE.exchange;
  if (/market|pack|intelligence|sell/.test(msg))                         return KNOWLEDGE.market;
  if (/profile|id|identity|operator|score/.test(msg))                   return KNOWLEDGE.profile;
  if (/store|tool|pass/.test(msg))                                       return KNOWLEDGE.store;
  if (/pricing|plan|tier|upgrade/.test(msg))                             return KNOWLEDGE.pricing;
  if (/job|work|hire/.test(msg))                                         return KNOWLEDGE.jobs;
  if (/service|specialist|integration/.test(msg))                        return KNOWLEDGE.services;
  if (/about|built|company|coreops/.test(msg))                           return KNOWLEDGE.about;
  if (/what is atlas|how does|explain|help|start|begin/.test(msg))       return KNOWLEDGE.general;

  return "I am Atlas, your on-site guide. I can tell you about the Gauntlet, Signal Feed, Exchange, Market, Atlas ID, and more. What would you like to know?";
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const ip = request.headers.get("CF-Connecting-IP") || "anon";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // GET /api/assistant/hints?page=/pages/gauntlet.html
  if (request.method === "GET" && url.pathname === "/api/assistant/hints") {
    const page = url.searchParams.get("page") || "/";
    const hints = PAGE_HINTS[page] || PAGE_HINTS["/"];
    return new Response(JSON.stringify({ hints, page }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        ...corsHeaders(origin),
      },
    });
  }

  // POST /api/assistant/chat
  if (request.method === "POST" && url.pathname === "/api/assistant/chat") {
    const allowed = await checkRateLimit(env, ip);
    if (!allowed) return jsonResponse({ error: "Rate limit reached. Please wait a moment." }, 429, origin);

    let body;
    try {
      body = await request.json();
    } catch (_) {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const message = body.message;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return jsonResponse({ error: "message required" }, 400, origin);
    }
    if (message.length > 500) {
      return jsonResponse({ error: "message too long (max 500 chars)" }, 400, origin);
    }

    const page = body.page || "/";

    // If an AI gateway or Workers AI binding is configured, proxy to it
    if (env && env.AI) {
      try {
        const systemPrompt = `You are Atlas, the on-site guide for the Atlas platform — a premium AI intelligence arena. The user is on page: ${page}. Be concise (max 2 sentences), helpful, and aligned with the Atlas brand. Never break character. Platform context: ${KNOWLEDGE.general}`;
        const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            { role: "system",    content: systemPrompt },
            { role: "user",      content: message.trim() },
          ],
          max_tokens: 120,
        });
        const reply = aiResponse.response || localResponse(message);
        return jsonResponse({ reply, source: "ai" }, 200, origin);
      } catch (_) {
        // AI unavailable — fall back to local response
      }
    }

    // Local knowledge-base response
    const reply = localResponse(message.trim());
    return jsonResponse({ reply, source: "local" }, 200, origin);
  }

  return jsonResponse({ error: "Not found" }, 404, origin);
}
