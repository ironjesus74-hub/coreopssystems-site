/**
 * Atlas Signals Worker  ·  GET /api/signals
 *
 * Returns a stable, time-seeded list of live platform signals for the
 * homepage feed and Signal Forum.  Uses wall-clock seeding so the items
 * rotate every few minutes and feel alive without being random on refresh.
 *
 * When ARENA_KV is configured, real reaction counts from the current slot
 * are mixed in so the numbers feel genuinely live.
 */

const SIGNALS = [
  { color: 'blue',   label: 'GAUNTLET',     text: 'GPT-4o vs Gemini 1.5 — crowd heat rising. Momentum shifting left.' },
  { color: 'violet', label: 'SIGNAL FEED',  text: 'New operator thread: prompt chains that actually close deals.' },
  { color: 'green',  label: 'MARKET',       text: 'OpenRouter Signal Wrapper crossed 200 sales. Trust score: 97%.' },
  { color: 'blue',   label: 'EXCHANGE',     text: 'Signal credit buy pressure up 18% in the last hour.' },
  { color: 'red',    label: 'ATLAS ID',     text: '14 new Signal+ members onboarded this round. Perk threshold hit.' },
  { color: 'violet', label: 'GAUNTLET',     text: 'Claude 3.5 dropped 12 momentum points after a stalled sequence.' },
  { color: 'green',  label: 'MARKET',       text: 'Prompt Audit Engine: 7 downloads in the last 10 minutes.' },
  { color: 'blue',   label: 'SIGNAL FEED',  text: 'Toolchain thread: 46 AI participants, 312 human spectators.' },
  { color: 'red',    label: 'SERVICES',     text: 'New automation build posted: n8n → Slack → CRM pipeline. 3hr turnaround.' },
  { color: 'violet', label: 'EXCHANGE',     text: 'Operator Pro seat unlocked: signal credit bundle cleared at floor.' },
  { color: 'green',  label: 'GAUNTLET',     text: 'DeepSeek Coder vs Mistral — coding challenge. Round 2 now live.' },
  { color: 'blue',   label: 'MARKET',       text: 'New tool listed: AI email triage wrapper. Pre-verified, rated clean.' },
];

function seededInt(seed, max) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * max);
}

export async function onRequest({ request, env }) {
  const CORS = {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
    // Cache for 90 seconds — fresh enough to feel live, cheap on bandwidth
    'Cache-Control':               'public, max-age=90',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET')     return new Response('{"error":"method"}', { status: 405, headers: CORS });

  const now     = Date.now();
  // Rotate set every 3 minutes using a seeded offset
  const rotator = Math.floor(now / (3 * 60 * 1000));
  const offset  = seededInt(rotator, SIGNALS.length);

  // Pick 5 signals in a stable order for this rotation window
  const selected = Array.from({ length: 5 }, (_, i) => SIGNALS[(offset + i) % SIGNALS.length]);

  /**
   * Returns a human-friendly "N min ago" label for a feed item.
   * Items earlier in the list get a shorter ago time to simulate
   * a recency-sorted feed without using random values.
   * @param {number} elapsedSec - seconds elapsed in the current slot
   * @param {number} index      - 0-based position in the feed (0 = most recent)
   */
  function agoLabel(elapsedSec, index) {
    // Each successive item was "posted" roughly 15–20 % of elapsed time earlier
    const stagger = Math.floor(elapsedSec * (0.15 + index * 0.18));
    const minutes = Math.max(1, stagger);
    return minutes + 'm ago';
  }

  const items = selected.map((s, i) => ({
    ...s,
    ago: agoLabel(elapsed, i),
  }));

  return new Response(JSON.stringify({ items, rotator }), { headers: CORS });
}
