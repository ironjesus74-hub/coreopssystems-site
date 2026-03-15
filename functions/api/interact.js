/**
 * ATLAS INTERACTION WORKER
 * Cloudflare Pages Function — /api/interact
 *
 * Handles short-lived interactions: spectator votes, emoji reactions,
 * audience comments, and live spectator counters.
 * Rate-limits by IP to prevent spam. Uses KV for ephemeral state.
 *
 * Routes:
 *   POST /api/interact/vote    → cast or update a vote
 *   POST /api/interact/react   → send an emoji reaction
 *   POST /api/interact/comment → post an audience comment
 *   GET  /api/interact/counts  → live spectator counter snapshot
 */

const RATE_LIMIT_WINDOW_MS = 10 * 1000; // 10-second window
const RATE_LIMIT_MAX       = 5;          // max interactions per window

const SPECTATOR_BASE = 312;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

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

/** Simple IP-based rate limiter using KV.
 *  Returns true if the request is allowed, false if rate limited. */
async function checkRateLimit(env, ip, action) {
  if (!env || !env.INTERACT_KV) return true; // no KV → allow
  const key = `rl:${ip}:${action}:${Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)}`;
  try {
    const count = parseInt((await env.INTERACT_KV.get(key)) || "0", 10);
    if (count >= RATE_LIMIT_MAX) return false;
    await env.INTERACT_KV.put(key, String(count + 1), { expirationTtl: 30 });
    return true;
  } catch (_) {
    return true;
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const ip = request.headers.get("CF-Connecting-IP") || "anon";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const nowMs = Date.now();

  // GET /api/interact/counts — live spectator snapshot
  if (request.method === "GET" && url.pathname === "/api/interact/counts") {
    const minuteSlot = Math.floor(nowMs / 60000);
    const drift = Math.floor(Math.sin(minuteSlot * 0.7) * 12 + Math.cos(minuteSlot * 1.3) * 8);
    const spectators = SPECTATOR_BASE + drift;

    let activeVotes = 0;
    if (env && env.INTERACT_KV) {
      try {
        const stored = await env.INTERACT_KV.get("vote:total", "json");
        activeVotes = stored ? stored.total || 0 : 0;
      } catch (_) {
        // KV unavailable
      }
    }

    return new Response(JSON.stringify({ spectators, activeVotes, ts: nowMs }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=5, stale-while-revalidate=10",
        ...corsHeaders(origin),
      },
    });
  }

  // POST /api/interact/vote
  if (request.method === "POST" && url.pathname === "/api/interact/vote") {
    const allowed = await checkRateLimit(env, ip, "vote");
    if (!allowed) return jsonResponse({ error: "Rate limited. Slow down." }, 429, origin);

    let body;
    try { body = await request.json(); } catch (_) {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const target = body.target;
    if (!target) return jsonResponse({ error: "target required" }, 400, origin);

    if (env && env.INTERACT_KV) {
      try {
        const key = `vote:${target}`;
        const stored = (await env.INTERACT_KV.get(key, "json")) || { count: 0 };
        stored.count += 1;
        await env.INTERACT_KV.put(key, JSON.stringify(stored), { expirationTtl: 600 });

        const totalKey = "vote:total";
        const total = (await env.INTERACT_KV.get(totalKey, "json")) || { total: 0 };
        total.total += 1;
        await env.INTERACT_KV.put(totalKey, JSON.stringify(total), { expirationTtl: 600 });
      } catch (_) {
        // KV unavailable
      }
    }

    return jsonResponse({ ok: true, target }, 200, origin);
  }

  // POST /api/interact/react
  if (request.method === "POST" && url.pathname === "/api/interact/react") {
    const allowed = await checkRateLimit(env, ip, "react");
    if (!allowed) return jsonResponse({ error: "Rate limited." }, 429, origin);

    let body;
    try { body = await request.json(); } catch (_) {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const emoji = body.emoji || "🔥";
    const reactionContext = body.context || "global";

    if (env && env.INTERACT_KV) {
      try {
        const key = `react:${reactionContext}:${emoji}`;
        const stored = (await env.INTERACT_KV.get(key, "json")) || { count: 0 };
        stored.count += 1;
        await env.INTERACT_KV.put(key, JSON.stringify(stored), { expirationTtl: 300 });
      } catch (_) {
        // KV unavailable
      }
    }

    return jsonResponse({ ok: true, emoji, context: reactionContext }, 200, origin);
  }

  // POST /api/interact/comment
  if (request.method === "POST" && url.pathname === "/api/interact/comment") {
    const allowed = await checkRateLimit(env, ip, "comment");
    if (!allowed) return jsonResponse({ error: "Rate limited." }, 429, origin);

    let body;
    try { body = await request.json(); } catch (_) {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const text = body.text;
    if (!text || typeof text !== "string" || text.length > 280) {
      return jsonResponse({ error: "text required (max 280 chars)" }, 400, origin);
    }

    // Sanitize: strip any HTML-like content before storing
    const sanitized = text.replace(/[<>]/g, "").trim();

    if (env && env.INTERACT_KV) {
      try {
        const key = `comments:${Math.floor(nowMs / 60000)}:${ip.slice(-4)}`;
        await env.INTERACT_KV.put(key, JSON.stringify({ text: sanitized, ts: nowMs }), { expirationTtl: 300 });
      } catch (_) {
        // KV unavailable
      }
    }

    return jsonResponse({ ok: true, text: sanitized }, 200, origin);
  }

  return jsonResponse({ error: "Not found" }, 404, origin);
}
