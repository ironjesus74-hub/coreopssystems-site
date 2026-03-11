/**
 * ATLAS GAUNTLET WORKER
 * Cloudflare Pages Function — /api/gauntlet
 *
 * Manages match state, battle pacing, score tracking, and round sequencing.
 * Uses KV for persistent state when available; falls back to deterministic
 * seeded values so the front-end always has valid data.
 *
 * Routes:
 *   GET  /api/gauntlet          → current round state
 *   POST /api/gauntlet/vote     → cast a vote for left or right
 *   GET  /api/gauntlet/history  → recent round results
 */

const ROUND_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const FIGHTERS = [
  { name: "Claude 3.5",     role: "Precision Reasoner",      style: "MEASURED",  clarity: 94, momentum: 78 },
  { name: "GPT-4o",         role: "Frontier Operator",        style: "FRONTIER",  clarity: 91, momentum: 88 },
  { name: "Gemini 1.5",     role: "Cultural Signal Engine",   style: "CULTURAL",  clarity: 88, momentum: 82 },
  { name: "Mistral Large",  role: "Velocity Specialist",      style: "VELOCITY",  clarity: 86, momentum: 91 },
  { name: "Llama 3",        role: "Open-Weight Wildcard",     style: "OPEN",      clarity: 82, momentum: 75 },
  { name: "DeepSeek Coder", role: "Technical System",         style: "TECHNICAL", clarity: 90, momentum: 77 },
];

const CATEGORIES = [
  { icon: "⚔",  label: "LOGIC BATTLE",         pace: "measured",  intensity: 0.7 },
  { icon: "🧠", label: "PHILOSOPHICAL ARGUMENT", pace: "slow",      intensity: 0.5 },
  { icon: "💻", label: "CODING CHALLENGE",        pace: "structured",intensity: 0.6 },
  { icon: "🎤", label: "RAP BATTLE",              pace: "fast",      intensity: 0.9 },
  { icon: "🔥", label: "OPEN DEBATE",             pace: "variable",  intensity: 0.8 },
];

/** Deterministic float [0,1) from integer seed */
function seededFloat(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function seededInt(seed, max) {
  return Math.floor(seededFloat(seed) * max);
}

function currentSlot(nowMs) {
  return Math.floor(nowMs / ROUND_DURATION_MS);
}

function buildRoundState(slot, nowMs) {
  const elapsedSec = Math.floor(((nowMs % ROUND_DURATION_MS)) / 1000);
  const remainingSec = Math.floor(ROUND_DURATION_MS / 1000) - elapsedSec;
  const elapsedRatio = elapsedSec / (ROUND_DURATION_MS / 1000);

  const leftIdx = seededInt(slot * 3 + 1, FIGHTERS.length);
  const remaining = FIGHTERS.filter((_, i) => i !== leftIdx);
  const rightIdx = seededInt(slot * 7 + 5, remaining.length);
  const left = FIGHTERS[leftIdx];
  const right = remaining[rightIdx];

  const catIdx = seededInt(slot * 11, CATEGORIES.length);
  const category = CATEGORIES[catIdx];

  const baseVotes = Math.floor(elapsedRatio * 220 + seededInt(slot * 11, 50));
  const leftBias = 0.35 + seededFloat(slot * 13) * 0.30;
  const scoreLeft = Math.floor(baseVotes * leftBias);
  const scoreRight = baseVotes - scoreLeft;
  const heat = 60 + seededInt(slot * 17, 35);
  const round = (slot % 18) + 1;

  const ratio = remainingSec / (ROUND_DURATION_MS / 1000);
  const phase = ratio > 0.66 ? "Opening" : ratio > 0.33 ? "Mid-Round" : "Final Phase";

  return {
    slot,
    round,
    phase,
    remainingSec,
    category: { icon: category.icon, label: category.label, pace: category.pace },
    left: { ...left },
    right: { ...right },
    scoreLeft,
    scoreRight,
    totalVotes: baseVotes,
    heat,
    timestamp: nowMs,
  };
}

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
      "Cache-Control": "public, max-age=10, stale-while-revalidate=20",
      ...corsHeaders(origin),
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const nowMs = Date.now();
  const slot = currentSlot(nowMs);

  // GET /api/gauntlet — current round state
  if (request.method === "GET" && url.pathname === "/api/gauntlet") {
    const state = buildRoundState(slot, nowMs);

    // If KV is available, try to load live vote deltas
    if (env && env.GAUNTLET_KV) {
      try {
        const stored = await env.GAUNTLET_KV.get(`slot:${slot}`, "json");
        if (stored) {
          state.scoreLeft  += stored.deltaLeft  || 0;
          state.scoreRight += stored.deltaRight || 0;
          state.totalVotes += (stored.deltaLeft || 0) + (stored.deltaRight || 0);
          state.heat = Math.min(99, state.heat + (stored.heatBoost || 0));
        }
      } catch (_) {
        // KV unavailable — use seed-based state
      }
    }

    return jsonResponse(state, 200, origin);
  }

  // POST /api/gauntlet/vote — cast a vote
  if (request.method === "POST" && url.pathname === "/api/gauntlet/vote") {
    let body;
    try {
      body = await request.json();
    } catch (_) {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const side = body.side;
    if (side !== "left" && side !== "right") {
      return jsonResponse({ error: "side must be left or right" }, 400, origin);
    }

    if (env && env.GAUNTLET_KV) {
      try {
        const key = `slot:${slot}`;
        const stored = (await env.GAUNTLET_KV.get(key, "json")) || { deltaLeft: 0, deltaRight: 0, heatBoost: 0 };
        if (side === "left") stored.deltaLeft = (stored.deltaLeft || 0) + 1;
        else stored.deltaRight = (stored.deltaRight || 0) + 1;
        stored.heatBoost = Math.min(30, (stored.heatBoost || 0) + 1);
        await env.GAUNTLET_KV.put(key, JSON.stringify(stored), { expirationTtl: 600 });
      } catch (_) {
        // KV unavailable — vote acknowledged but not persisted
      }
    }

    return jsonResponse({ ok: true, side }, 200, origin);
  }

  // GET /api/gauntlet/history — last 5 completed rounds
  if (request.method === "GET" && url.pathname === "/api/gauntlet/history") {
    const history = [];
    for (let i = 1; i <= 5; i++) {
      const pastSlot = slot - i;
      const pastState = buildRoundState(pastSlot, pastSlot * ROUND_DURATION_MS + ROUND_DURATION_MS - 1000);
      history.push({
        round:       (pastSlot % 18) + 1,
        left:        pastState.left.name,
        right:       pastState.right.name,
        scoreLeft:   pastState.scoreLeft,
        scoreRight:  pastState.scoreRight,
        category:    pastState.category.label,
        winner:      pastState.scoreLeft > pastState.scoreRight ? pastState.left.name : pastState.right.name,
      });
    }
    return jsonResponse({ history }, 200, origin);
  }

  return jsonResponse({ error: "Not found" }, 404, origin);
}
