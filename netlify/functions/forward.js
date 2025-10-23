const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const NETLIFY_BASE = process.env.VITE_NETLIFY_FUNCTIONS_URL || '';

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

exports.handler = async function(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return okResponse({ success: true });
    if (event.httpMethod !== 'POST') return errorResponse(405, { error: 'Method not allowed' });
    const payload = JSON.parse(event.body || '{}');
    const { url, method = 'GET', headers = {}, body } = payload;
    if (!url) return errorResponse(400, { error: 'Missing url' });

    // Only allow forwarding to configured supabase or our netlify functions host
    const allowedHosts = [];
    try {
      if (SUPABASE_URL) allowedHosts.push(new URL(SUPABASE_URL).host);
    } catch (e) { if (SUPABASE_URL) allowedHosts.push(SUPABASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')); }
    try {
      if (NETLIFY_BASE) allowedHosts.push(new URL(NETLIFY_BASE).host);
    } catch (e) { if (NETLIFY_BASE) allowedHosts.push(NETLIFY_BASE.replace(/^https?:\/\//, '').replace(/\/$/, '')); }

    let targetHost = null;
    try { targetHost = new URL(url).host; } catch { targetHost = String(url).replace(/^https?:\/\//, '').split('/')[0]; }

    if (!allowedHosts.some(h => targetHost === h || targetHost.endsWith('.' + h) || h.endsWith('.' + targetHost))) {
      return errorResponse(403, { error: 'Forwarding to this host is not allowed' });
    }

    const outHeaders = Object.assign({}, headers || {});
    // If calling Supabase, use service role if available
    if (SUPABASE_URL && targetHost.includes(SUPABASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      outHeaders['Authorization'] = `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;
      outHeaders['apikey'] = process.env.SUPABASE_SERVICE_ROLE_KEY;
    }

    const res = await fetch(url, { method, headers: outHeaders, body });
    const text = await res.text().catch(() => '');
    const response = { status: res.status, statusText: res.statusText || '', headers: {}, body: text };
    res.headers.forEach((v, k) => { response.headers[k] = v; });
    return okResponse(response);
  } catch (e) {
    console.error('forward error', e);
    return errorResponse(500, { error: String(e) });
  }
};
