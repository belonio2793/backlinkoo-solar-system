const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Simple helper to return JSON with CORS headers
function okResponse(bodyObj) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey', 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
    body: JSON.stringify(bodyObj)
  };
}

function errorResponse(statusCode, bodyObj) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey', 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
    body: JSON.stringify(bodyObj)
  };
}

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === 'OPTIONS') return okResponse({ success: true });
    if (event.httpMethod !== 'POST') return errorResponse(405, { error: 'Method not allowed' });
    const payload = JSON.parse(event.body || '{}');
    const { url, method = 'GET', headers = {}, body } = payload;
    if (!url || !SUPABASE_URL || !String(url).startsWith(SUPABASE_URL)) {
      return errorResponse(400, { error: 'Invalid or missing SUPABASE_URL in server config' });
    }

    // Prepare headers, prefer server-side key for Supabase
    const outHeaders = Object.assign({}, headers || {});
    if (SUPABASE_KEY) {
      outHeaders['Authorization'] = `Bearer ${SUPABASE_KEY}`;
      outHeaders['apikey'] = SUPABASE_KEY;
    }

    const res = await fetch(url, { method, headers: outHeaders, body });
    const text = await res.text().catch(() => '');

    const response = {
      status: res.status,
      statusText: res.statusText || '',
      headers: {},
      body: text
    };
    // copy some headers
    res.headers.forEach((v, k) => { response.headers[k] = v; });

    return okResponse(response);
  } catch (e) {
    console.error('supabase-proxy error', e);
    return errorResponse(500, { error: String(e) });
  }
};
