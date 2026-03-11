/**
 * Atlas Platform Middleware
 * Runs on every request before route handlers.
 * Adds security headers to /api/* responses and handles OPTIONS pre-flight.
 */
export async function onRequest(context) {
  const { request, next } = context;

  // Handle CORS pre-flight for all API routes
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const response = await next();

  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return response;

  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!headers.has('Access-Control-Allow-Origin')) {
    headers.set('Access-Control-Allow-Origin', '*');
  }

  return new Response(response.body, { status: response.status, headers });
}
