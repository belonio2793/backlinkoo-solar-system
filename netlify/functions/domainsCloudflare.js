// Netlify Function: domainsCloudflare.js
// Manages Cloudflare KV keypairs for custom domains

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function normalizeDomain(d) {
  return String(d || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };

  const method = event.httpMethod || 'GET';

  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  // Unified Cloudflare API token used for both KV and Custom Hostnames
  const API_TOKEN = process.env.CLOUDFLARE_API;
  const ZONE_ID = process.env.CLOUDFLARE_DOMAIN_ZONE_ID;

  const qs = new URLSearchParams(event.queryStringParameters || {});
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const op = (qs.get('op') || body.op || '').toLowerCase();

  // Construct Cloudflare auth headers using CLOUDFLARE_API as Bearer token
  const cfHeaders = API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {};

  // Handle Cloudflare Custom Hostnames API operations when requested
  if (op && op.startsWith('ch_')) {
    if (!ZONE_ID || !API_TOKEN) {
      return json(500, { success: false, error: 'Cloudflare Custom Hostnames not configured', missing: { zone: !!ZONE_ID, token: !!API_TOKEN } });
    }
    const chBase = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/custom_hostnames`;

    if (op === 'ch_create' && method === 'POST') {
      const hostname = String(body.hostname || body.domain || '').trim().toLowerCase();
      if (!hostname) return json(400, { success: false, error: 'hostname is required' });
      const origin = String(body.origin || 'domains.backlinkoo.com');
      const payload = {
        hostname,
        ssl: body.ssl || { method: 'http', type: 'dv' },
        custom_origin_server: origin,
        custom_origin_sni: origin,
      };
      const resp = await fetch(chBase, { method: 'POST', headers: { ...cfHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) return json(resp.status, { success: false, error: data?.errors || data?.message || `HTTP ${resp.status}` });
      return json(200, { success: true, result: data.result || data });
    }

    // Create a DNS record for ACME DCV Delegation (CNAME) for a hostname
    if (op === 'ch_add_dns' && method === 'POST') {
      const hostname = String(body.hostname || body.domain || '').trim().toLowerCase();
      if (!hostname) return json(400, { success: false, error: 'hostname is required' });
      // Allow passing explicit name and target (for flexibility) or derive _acme-challenge.<hostname>
      const name = String(body.name || `_acme-challenge.${hostname}`).trim();
      const target = String(body.target || body.value || (body.record && body.record.target) || body.content || '').trim();
      if (!target) return json(400, { success: false, error: 'target is required' });
      try {
        const payload = { type: 'CNAME', name, content: target, ttl: 120, proxied: false };
        const dnsResp = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`, { method: 'POST', headers: { ...cfHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const dnsData = await dnsResp.json().catch(()=>({}));
        if (!dnsResp.ok) return json(dnsResp.status, { success: false, error: dnsData?.errors || dnsData?.message || `HTTP ${dnsResp.status}` });
        return json(200, { success: true, result: dnsData.result || dnsData });
      } catch (e) {
        return json(500, { success: false, error: (e && e.message) || e || 'Failed to create DNS record' });
      }
    }

    if (op === 'ch_list' && method === 'GET') {
      const search = qs.get('hostname');
      const url = new URL(chBase);
      if (search) url.searchParams.set('hostname', search);
      const resp = await fetch(url.toString(), { headers: { ...cfHeaders } });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) return json(resp.status, { success: false, error: data?.errors || data?.message || `HTTP ${resp.status}` });
      return json(200, { success: true, result: data.result || [] });
    }

    if (op === 'ch_get' && method === 'GET') {
      const id = qs.get('id') || body.id;
      if (!id) return json(400, { success: false, error: 'id is required' });
      const resp = await fetch(`${chBase}/${encodeURIComponent(id)}`, { headers: { ...cfHeaders } });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) return json(resp.status, { success: false, error: data?.errors || data?.message || `HTTP ${resp.status}` });
      return json(200, { success: true, result: data.result || data });
    }

    if (op === 'ch_update' && (method === 'PATCH' || method === 'POST')) {
      const id = qs.get('id') || body.id;
      if (!id) return json(400, { success: false, error: 'id is required' });
      const patchBody = body.patch || body.payload || {};
      const resp = await fetch(`${chBase}/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { ...cfHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(patchBody) });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) return json(resp.status, { success: false, error: data?.errors || data?.message || `HTTP ${resp.status}` });
      return json(200, { success: true, result: data.result || data });
    }

    if (op === 'ch_delete' && method === 'DELETE') {
      const id = qs.get('id') || body.id;
      if (!id) return json(400, { success: false, error: 'id is required' });
      const resp = await fetch(`${chBase}/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { ...cfHeaders } });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok) return json(resp.status, { success: false, error: data?.errors || data?.message || `HTTP ${resp.status}` });
      return json(200, { success: true, result: data.result || data });
    }

    return json(405, { success: false, error: 'Unsupported operation for custom hostnames' });
  }

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
      const domain = normalizeDomain(payload.domain || payload.key || '');
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

      // Also create Cloudflare Custom Hostname when configured
      try {
        const ZONE_ID = process.env.CLOUDFLARE_DOMAIN_ZONE_ID || process.env.CF_ZONE_ID;
        if (ZONE_ID && API_TOKEN) {
          const chBase = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/custom_hostnames`;
          const cfResp = await fetch(chBase, {
            method: 'POST',
            headers: { ...cfHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ hostname: domain, ssl: { method: 'http', type: 'dv' }, custom_origin_server: target, custom_origin_sni: target })
          });
          // Note: Do not fail the whole request if this step fails
          await cfResp.text().catch(()=> '');
        }
      } catch {}

      return json(200, { success: true, key: domain, value: target });
    }

    if (method === 'DELETE') {
      const qs = new URLSearchParams(event.queryStringParameters || {});
      let key = normalizeDomain(qs.get('key') || qs.get('domain') || '');
      if (!key && event.body) {
        try { const b = JSON.parse(event.body || '{}'); key = normalizeDomain(b.domain || b.key || ''); } catch {}
      }
      if (!key) return json(400, { success: false, error: 'key/domain is required' });
      const resp = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      const ok = resp.ok;
      const text = await resp.text().catch(()=> '');
      if (!ok) return json(resp.status, { success: false, error: text || `HTTP ${resp.status}` });

      // Try to delete corresponding Custom Hostname(s)
      try {
        const ZONE_ID = process.env.CLOUDFLARE_DOMAIN_ZONE_ID || process.env.CF_ZONE_ID;
        if (ZONE_ID && API_TOKEN) {
          const base = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/custom_hostnames`;
          const listUrl = `${base}?hostname=${encodeURIComponent(key)}`;
          const list = await fetch(listUrl, { headers: { ...cfHeaders } }).then(r => r.json()).catch(()=>({ result: [] }));
          const items = Array.isArray(list.result) ? list.result : [];
          for (const item of items) {
            if (item?.id) {
              await fetch(`${base}/${encodeURIComponent(item.id)}`, { method: 'DELETE', headers: { ...cfHeaders } }).catch(()=>{});
            }
          }
        }
      } catch {}

      return json(200, { success: true, removed: key });
    }

    if (method === 'GET') {
      const qs = new URLSearchParams(event.queryStringParameters || {});
      const key = normalizeDomain(qs.get('key') || qs.get('domain') || '');
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
