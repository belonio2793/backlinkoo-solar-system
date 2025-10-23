export const ALLOWED_ORIGINS = [
  'https://backlinkoo.com',
  'https://www.backlinkoo.com',
  'https://backlinkoo.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001',
  /\.fly\.dev$/
];

export function getCorsHeaders(origin?: string) {
  let allowedOrigin = '*';
  if (origin) {
    const matched = ALLOWED_ORIGINS.some((o) => typeof o === 'string' ? o === origin : o.test(origin));
    if (matched) allowedOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-BYPASS-NETLIFY-SHIM, apikey, x-client-info',
  } as Record<string,string>;
}
