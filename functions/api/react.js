/**
 * Atlas Reactions Worker  ·  GET + POST /api/react
 *
 * Low-latency emoji reaction tracking per slot.
 * POST { emoji: "⚡"|"🔥"|"💀"|"◎"|"✦" }  — increments count in KV
 * GET                                        — returns current counts for this slot
 *
 * Realism pacing: the response is instant so the UI stays snappy.
 * KV persists counts across all visitors when configured.
 */

const ROUND_MS    = 5 * 60 * 1000;
const VALID       = new Set(['⚡', '🔥', '💀', '◎', '✦']);

export async function onRequest({ request, env }) {
  const CORS = {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control':               'no-store',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const slot  = Math.floor(Date.now() / ROUND_MS);
  const KV    = env.ARENA_KV;
  const kvKey = `reactions:${slot}`;

  // ── GET: return current reaction counts ──────────────────────────────────
  if (request.method === 'GET') {
    let counts = {};
    if (KV) {
      try { counts = (await KV.get(kvKey, 'json')) || {}; } catch (_) {}
    }
    return new Response(JSON.stringify({ counts, slot }), { headers: CORS });
  }

  // ── POST: record a reaction ───────────────────────────────────────────────
  if (request.method === 'POST') {
    let body;
    try   { body = await request.json(); }
    catch { return new Response('{"error":"invalid body"}', { status: 400, headers: CORS }); }

    const emoji = body.emoji;
    if (!VALID.has(emoji)) {
      return new Response('{"error":"invalid emoji"}', { status: 400, headers: CORS });
    }

    if (KV) {
      try {
        const counts       = (await KV.get(kvKey, 'json')) || {};
        counts[emoji]      = (counts[emoji] || 0) + 1;
        await KV.put(kvKey, JSON.stringify(counts), { expirationTtl: 7200 });
        return new Response(JSON.stringify({ success: true, counts }), { headers: CORS });
      } catch (_) { /* fall through to ack */ }
    }

    // No KV or KV error — acknowledge without persisting
    return new Response(JSON.stringify({ success: true }), { headers: CORS });
  }

  return new Response('{"error":"not found"}', { status: 404, headers: CORS });
}
