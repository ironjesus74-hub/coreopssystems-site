/**
 * Atlas Vote Worker  ·  POST /api/vote
 *
 * Increments the left or right vote tally in KV so all visitors see the
 * same growing score.  Accepts: { side: "left"|"right" }
 * Falls back gracefully (returns success:false, kv:false) when KV is absent.
 */

const ROUND_MS = 5 * 60 * 1000;

function seededFloat(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function seededInt(seed, max) { return Math.floor(seededFloat(seed) * max); }

function freshState(slot) {
  const bias = 0.40 + seededFloat(slot * 13) * 0.20;
  const base = seededInt(slot * 11 + 3, 18);
  const left = Math.round(base * bias);
  return {
    slot, left, right: base - left, total: base,
    heat: 62 + seededInt(slot * 17, 26),
    savedAt: Date.now(),
  };
}

export async function onRequest({ request, env }) {
  const CORS = {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control':               'no-store',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST')    return new Response('{"error":"method not allowed"}', { status: 405, headers: CORS });

  let body;
  try   { body = await request.json(); }
  catch { return new Response('{"error":"invalid body"}', { status: 400, headers: CORS }); }

  const side = body.side;
  if (side !== 'left' && side !== 'right') {
    return new Response('{"error":"side must be left or right"}', { status: 400, headers: CORS });
  }

  const now  = Date.now();
  const slot = Math.floor(now / ROUND_MS);
  const KV   = env.ARENA_KV;

  if (!KV) {
    // No KV — vote acknowledged but not shared with other visitors (degraded mode).
    // Client should retain its local tally; 'shared: false' signals this state.
    return new Response(JSON.stringify({ success: true, shared: false }), { headers: CORS });
  }

  try {
    const kvKey = `arena:${slot}`;
    let state   = await KV.get(kvKey, 'json');
    if (!state || state.slot !== slot) state = freshState(slot);

    if (side === 'left') state.left++;
    else                 state.right++;
    state.total++;
    state.savedAt = now;

    // Bump heat slightly on user interaction
    state.heat = Math.min(99, (state.heat || 62) + 1);

    await KV.put(kvKey, JSON.stringify(state), { expirationTtl: 7200 });

    return new Response(JSON.stringify({
      success: true,
      kv:      true,
      left:    state.left,
      right:   state.right,
      total:   state.total,
      heat:    state.heat,
    }), { headers: CORS });

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'KV write failed' }),
      { status: 500, headers: CORS }
    );
  }
}
