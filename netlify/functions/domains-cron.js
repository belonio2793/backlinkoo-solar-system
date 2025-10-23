export const config = { schedule: '0 * * * *' }; // hourly

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event, context) {
  // Allow manual trigger (POST) and scheduled invocations
  if (event.httpMethod && !['POST', 'OPTIONS'].includes(event.httpMethod)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, message: 'Use POST to trigger; runs hourly via schedule' }) };
  }
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' })
    };
  }

  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/domains-verify`;
    // No domains in body -> the edge function loads all domains from DB and verifies them
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_KEY}` },
      body: JSON.stringify({})
    });

    const data = await res.json().catch(() => ({}));
    const results = Array.isArray(data?.results) ? data.results : [];

    const summary = {
      ok: res.ok,
      status: res.status,
      total: results.length,
      netlify_ok: results.filter(r => r && r.netlify === true).length,
      dns_ok: results.filter(r => r && r.dns === true).length,
      ssl_ok: results.filter(r => r && (r.details?.ssl_status === 'issued' || r.ssl === true)).length
    };

    console.log('[domains-cron] verification summary:', summary);

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Domains verified', summary, results: results.slice(0, 25) }) };
  } catch (e) {
    console.error('[domains-cron] error:', e?.message || e);
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: e?.message || String(e) }) };
  }
}
