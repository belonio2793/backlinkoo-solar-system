// Cloudflare KV Upsert Function
// Adds or updates a KV entry mapping domain => target (default: api.backlinkoo.com)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };

  const method = event.httpMethod || 'GET';

  // Support both provided env names and common alternates
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;
  const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_USER_DOMAINS || process.env.CF_KV_NAMESPACE_ID;
  const API_TOKEN = process.env.CLOUDFLARE_WORKERS_API || process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;

  if (!ACCOUNT_ID || !NAMESPACE_ID || !API_TOKEN) {
    return json(500, { success: false, error: 'Cloudflare not configured', missing: {
      account: !!ACCOUNT_ID, namespace: !!NAMESPACE_ID, token: !!API_TOKEN
    }});
  }

  try {
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

    if (method === 'POST') {
      let payload = {};
      try { payload = JSON.parse(event.body || '{}'); } catch {}
      const domain = String(payload.domain || payload.key || '').trim().toLowerCase();
      const target = String(payload.target || payload.value || 'api.backlinkoo.com');
      if (!domain) return json(400, { success: false, error: 'domain (key) is required' });

      const resp = await fetch(`${baseUrl}/values/${encodeURIComponent(domain)}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'text/plain' },
        body: target
      });
      const ok = resp.ok;
      const text = await resp.text().catch(()=> '');
      if (!ok) return json(resp.status, { success: false, error: text || `HTTP ${resp.status}` });
      return json(200, { success: true, key: domain, value: target });
    }

    if (method === 'DELETE') {
      const qs = new URLSearchParams(event.queryStringParameters || {});
      const key = (qs.get('key') || qs.get('domain') || '').trim().toLowerCase();
      if (!key) return json(400, { success: false, error: 'key/domain is required' });
      const resp = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      const ok = resp.ok;
      const text = await resp.text().catch(()=> '');
      if (!ok) return json(resp.status, { success: false, error: text || `HTTP ${resp.status}` });
      return json(200, { success: true, removed: key });
    }

    if (method === 'GET') {
      const qs = new URLSearchParams(event.queryStringParameters || {});
      const key = (qs.get('key') || qs.get('domain') || '').trim().toLowerCase();
      if (!key) return json(400, { success: false, error: 'key/domain is required' });
      const resp = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      const ok = resp.ok;
      const text = await resp.text().catch(()=> '');
      if (!ok) return json(resp.status, { success: false, error: text || `HTTP ${resp.status}` });
      return json(200, { success: true, key, value: text });
    }

    return json(405, { success: false, error: 'Method not allowed. Use GET, POST or DELETE.' });
  } catch (e) {
    return json(500, { success: false, error: e?.message || 'Internal error' });
  }
};
