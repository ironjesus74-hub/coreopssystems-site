/**
 * ATLAS ENGINE — Cloudflare Worker entry point (API only)
 *
 * Routes all /api/* requests to the appropriate handler.
 * Static assets are NOT served here — those are served by Cloudflare Pages
 * via git integration (no wrangler command required for the static site).
 *
 * Deploy this Worker:  npx wrangler deploy
 * Static site:         Cloudflare Pages dashboard → git integration → main branch
 */

import { onRequest as gauntletHandler }  from './functions/api/gauntlet.js';
import { onRequest as forumHandler }     from './functions/api/forum.js';
import { onRequest as interactHandler }  from './functions/api/interact.js';
import { onRequest as assistantHandler } from './functions/api/assistant.js';

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    // Adapt the Worker (request, env) signature to the Pages Functions
    // context shape that each handler expects: { request, env }
    const ctx = { request, env };

    if (path.startsWith('/api/gauntlet'))  return await gauntletHandler(ctx);
    if (path.startsWith('/api/forum'))     return await forumHandler(ctx);
    if (path.startsWith('/api/interact'))  return await interactHandler(ctx);
    if (path.startsWith('/api/assistant')) return await assistantHandler(ctx);

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
