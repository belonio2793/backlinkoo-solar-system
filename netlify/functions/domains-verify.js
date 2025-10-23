const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

async function logDomainsVerifyEvent(level, operation, message, data) {
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE) return;
    const payload = [{
      session_id: `netlify_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      component: 'domains_verify_function',
      operation,
      message,
      data,
      context: { function: 'domains-verify' }
    }];
    await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_debug_logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch {}
}

function ok(res) { return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify(res) }; }
function err(status, res) { return { statusCode: status, headers: corsHeaders(), body: JSON.stringify(res) }; }
function corsHeaders() {
  return { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey' };
}

exports.handler = async function(event) {
  await logDomainsVerifyEvent('info', 'invoke', 'domains-verify called', { method: event.httpMethod });
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ success: true });
    if (event.httpMethod !== 'POST') return err(405, { success: false, error: 'Method not allowed' });
    if (!SUPABASE_URL || !SERVICE_ROLE) return err(500, { success: false, error: 'Supabase not configured' });

    const payload = JSON.parse(event.body || '{}');

    // Quick local Netlify check: if Netlify token/site configured and domains provided, attempt to short-circuit
    const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
    const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';
    if (NETLIFY_TOKEN && NETLIFY_SITE_ID && Array.isArray(payload && payload.domains) && payload.domains.length) {
      try {
        await logDomainsVerifyEvent('info', 'local_check', 'Attempting Netlify site check before forwarding', { domainCount: payload.domains.length });
        const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}`, 'Content-Type': 'application/json' } });
        if (siteRes.ok) {
          const siteData = await siteRes.json();
          const aliases = siteData.domain_aliases || [];
          const primary = (siteData.custom_domain || '').toLowerCase();
          const found = [];
          for (const d of payload.domains) {
            const clean = String(d || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'');
            if (aliases.map(a=>String(a||'').toLowerCase().replace(/^www\./,'')).includes(clean) || primary.replace(/^www\./,'') === clean) {
              found.push({ domain: d, present: true });
            } else {
              found.push({ domain: d, present: false });
            }
          }
          // If all domains are present on Netlify, return success quickly
          if (found.every(f => f.present)) {
            await logDomainsVerifyEvent('info', 'local_check_success', 'All domains present on Netlify', { found });
            return ok({ success: true, verified: true, details: found });
          }
        }
      } catch (e) {
        console.warn('Netlify quick-check failed, will forward to Supabase:', e && (e.message || e));
      }
    }

    const targetUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/domains-verify`;

    // Forward to Supabase Edge Function using service role to avoid browser CORS
    await logDomainsVerifyEvent('info', 'forward', 'Forwarding to Supabase domains-verify', { domains: Array.isArray(payload.domains) ? payload.domains.length : undefined });
    const res = await fetch(targetUrl, { method: 'POST', headers: { Authorization: `Bearer ${SERVICE_ROLE}`, apikey: SERVICE_ROLE, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      await logDomainsVerifyEvent('error', 'forward_failed', `Supabase domains-verify returned ${res.status}`, { body: text });
      return err(res.status, { success: false, error: text });
    }
    await logDomainsVerifyEvent('info', 'forward_success', 'domains-verify succeeded');
    return ok(JSON.parse(text || '{}'));
  } catch (e) {
    console.error('domains-verify proxy error', e);
    try { await logDomainsVerifyEvent('error', 'handler_exception', e?.message || String(e), { stack: e?.stack }); } catch {}
    return err(500, { success: false, error: String(e) });
  }
};
