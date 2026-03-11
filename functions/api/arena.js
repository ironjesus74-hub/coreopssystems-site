/**
 * Atlas Arena State Worker  ·  GET /api/arena
 *
 * Returns the current 5-minute slot's battle state: vote tallies, heat,
 * spectator count, and round metadata.
 *
 * When the ARENA_KV binding is configured every visitor shares the same live
 * numbers.  Without KV the response is fully deterministic from the wall clock
 * so it is still stable across refreshes — just local to each browser.
 *
 * KV setup (Cloudflare dashboard → Workers & Pages → KV):
 *   1. Create a namespace called "atlas-arena"
 *   2. Copy the namespace ID into wrangler.jsonc  kv_namespaces[].id
 *   3. Re-deploy — votes will now be shared across all visitors
 */

const ROUND_MS      = 5 * 60 * 1000;   // 5-minute slots
const VOTES_PER_SEC = 3 / 60;           // ambient crowd rate ≈ 3 votes/min

// ── Deterministic seeded RNG (mirrors client-side gauntlet.js) ──────────────
function seededFloat(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function seededInt(seed, max) { return Math.floor(seededFloat(seed) * max); }

/** Build a fresh baseline state for a new slot — deterministic, no Date.now() */
function freshState(slot) {
  const bias = 0.40 + seededFloat(slot * 13) * 0.20; // 40 – 60 % left bias
  const base = seededInt(slot * 11 + 3, 18);          // 0 – 17 opening votes
  const left = Math.round(base * bias);
  return {
    slot,
    left,
    right:   base - left,
    total:   base,
    heat:    62 + seededInt(slot * 17, 26),  // 62 – 87
    savedAt: Date.now(),
  };
}

// ── Request handler ──────────────────────────────────────────────────────────
export async function onRequest({ request, env }) {
  const CORS = {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control':               'no-store',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET')     return new Response('{"error":"method not allowed"}', { status: 405, headers: CORS });

  const now     = Date.now();
  const slot    = Math.floor(now / ROUND_MS);
  const elapsed = Math.floor((now % ROUND_MS) / 1000); // seconds into current slot
  const KV      = env.ARENA_KV;
  const kvKey   = `arena:${slot}`;

  let state;

  // ── Try KV (shared real-time state) ─────────────────────────────────────
  if (KV) {
    try {
      state = await KV.get(kvKey, 'json');

      if (!state || state.slot !== slot) {
        // New slot — seed fresh and persist
        state = freshState(slot);
        await KV.put(kvKey, JSON.stringify(state), { expirationTtl: 7200 });
      } else {
        // Project forward: add votes that would have accumulated since last write
        const gapSec   = Math.max(0, (now - (state.savedAt || now)) / 1000);
        const newVotes = Math.floor(gapSec * VOTES_PER_SEC);
        if (newVotes > 0) {
          const bias   = state.total > 0 ? state.left / state.total : 0.5;
          const addL   = Math.round(newVotes * bias);
          state.left  += addL;
          state.right += newVotes - addL;
          state.total += newVotes;
        }
      }
    } catch (_) {
      state = freshState(slot);
    }
  } else {
    // ── KV not configured — wall-clock deterministic fallback ─────────────
    state = freshState(slot);
    const addVotes = Math.floor(elapsed * VOTES_PER_SEC);
    const bias     = 0.40 + seededFloat(slot * 13) * 0.20;
    const addL     = Math.round(addVotes * bias);
    state.left    += addL;
    state.right   += addVotes - addL;
    state.total   += addVotes;
  }

  // Derived live metrics
  const spectators = 195 + Math.floor(elapsed * 0.40) + seededInt(slot * 31, 55);
  const heat       = Math.min(99, state.heat + Math.floor(elapsed * 0.012));

  return new Response(JSON.stringify({
    slot,
    left:       state.left,
    right:      state.right,
    total:      state.total,
    heat,
    spectators,
    elapsed,
    round:      (slot % 18) + 1,
  }), { headers: CORS });
}
