const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let admin = null;
function getAdminClient() {
  if (admin) return admin;
  if (!SERVICE_KEY || !SUPABASE_URL) return null;
  admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  return admin;
}

function sanitizeUrl(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  try {
    const normalized = new URL(trimmed);
    if (!['http:', 'https:'].includes(normalized.protocol)) return null;
    return normalized.toString();
  } catch {
    try {
      const attempt = new URL(`https://${trimmed}`);
      if (!['http:', 'https:'].includes(attempt.protocol)) return null;
      return attempt.toString();
    } catch {
      return null;
    }
  }
}

async function fetchHtml(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { method: 'GET', signal: controller.signal, headers: { 'User-Agent': 'backlinkoo-simple-bot/1.0' } });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, status: res.status };
    const text = await res.text();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function extractLinks(baseUrl, html, limit = 50) {
  const hrefRe = /href\s*=\s*(['"])(.*?)\1/gi;
  const links = new Set();
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    let href = m[2].trim();
    if (!href) continue;
    if (/^(mailto:|javascript:|#)/i.test(href)) continue;
    try {
      const abs = new URL(href, baseUrl).toString();
      links.add(abs);
      if (links.size >= limit) break;
    } catch (e) { continue; }
  }
  return Array.from(links);
}

function domainOf(u) {
  try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; }
}

async function getUserFromHeader(adminClient, headers) {
  const authHeader = headers.authorization || headers.Authorization || '';
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  try {
    const { data, error } = await adminClient.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch (e) {
    console.error('auth.getUser error', e);
    return null;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const action = String(body.action || '').trim();
    if (!action) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Action is required' }) };

    const adminClient = getAdminClient();
    if (!adminClient) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Server not configured (missing SUPABASE_SERVICE_ROLE_KEY)' }) };

    const user = await getUserFromHeader(adminClient, event.headers || {});
    const userId = user?.id || null;

    if (action === 'start_scan') {
      const urlRaw = String(body.url || '').trim();
      const url = sanitizeUrl(urlRaw);
      if (!url) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Valid URL is required' }) };

      let campaign_id = body.campaign_id || null;
      if (!campaign_id) {
        const nowIso = new Date().toISOString();
        const insertRow = { target_url: url, status: 'draft', created_at: nowIso };
        if (userId) insertRow.user_id = userId;
        const { data: cdata, error: cerr } = await adminClient.from('simple_campaigns').insert([insertRow]).select().maybeSingle();
        if (cerr) {
          campaign_id = null;
        } else {
          campaign_id = cdata?.id || null;
        }
      } else {
        // verify ownership if user present
        if (userId) {
          const { data: existing } = await adminClient.from('simple_campaigns').select('user_id').eq('id', campaign_id).maybeSingle();
          if (existing && existing.user_id && existing.user_id !== userId) {
            return { statusCode: 403, headers, body: JSON.stringify({ success: false, error: 'Forbidden' }) };
          }
        }
      }

      const fetched = await fetchHtml(url);
      if (!fetched.ok) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Failed to fetch URL', detail: fetched.error || fetched.status, campaign_id }) };
      }

      const links = extractLinks(url, fetched.text, 30);
      const discovered = links.map((p) => ({ url: p, domain: domainOf(p) }));

      if (campaign_id) {
        try {
          const rows = discovered.map((d) => ({ campaign_id, event_type: 'discovered', payload: JSON.stringify({ page: d.url, domain: d.domain }), created_at: new Date().toISOString() }));
          await adminClient.from('simple_campaign_events').insert(rows).catch(console.error);
        } catch (e) { console.error('store discovered error', e); }
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, url, discovered, campaign_id }) };
    }

    if (action === 'start_campaign') {
      const campaign_id = body.campaign_id;
      if (!campaign_id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'campaign_id required' }) };
      if (userId) {
        const { data: existing } = await adminClient.from('simple_campaigns').select('user_id').eq('id', campaign_id).maybeSingle();
        if (existing && existing.user_id && existing.user_id !== userId) {
          return { statusCode: 403, headers, body: JSON.stringify({ success: false, error: 'Forbidden' }) };
        }
      }
      const { error } = await adminClient.from('simple_campaigns').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', campaign_id);
      if (error) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Failed to start campaign', detail: error }) };
      await adminClient.from('simple_campaign_events').insert([{ campaign_id, event_type: 'campaign_started', payload: JSON.stringify({}), created_at: new Date().toISOString() }]).catch(console.error);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaign_id }) };
    }

    if (action === 'pause_campaign') {
      const campaign_id = body.campaign_id;
      if (!campaign_id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'campaign_id required' }) };
      if (userId) {
        const { data: existing } = await adminClient.from('simple_campaigns').select('user_id').eq('id', campaign_id).maybeSingle();
        if (existing && existing.user_id && existing.user_id !== userId) {
          return { statusCode: 403, headers, body: JSON.stringify({ success: false, error: 'Forbidden' }) };
        }
      }
      const { error } = await adminClient.from('simple_campaigns').update({ status: 'paused', paused_at: new Date().toISOString() }).eq('id', campaign_id);
      if (error) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Failed to pause campaign', detail: error }) };
      await adminClient.from('simple_campaign_events').insert([{ campaign_id, event_type: 'campaign_paused', payload: JSON.stringify({}), created_at: new Date().toISOString() }]).catch(console.error);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, campaign_id }) };
    }

    if (action === 'report') {
      const campaign_id = body.campaign_id;
      if (!campaign_id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'campaign_id required' }) };
      if (userId) {
        const { data: existing } = await adminClient.from('simple_campaigns').select('user_id').eq('id', campaign_id).maybeSingle();
        if (existing && existing.user_id && existing.user_id !== userId) {
          return { statusCode: 403, headers, body: JSON.stringify({ success: false, error: 'Forbidden' }) };
        }
      }
      const { data, error } = await adminClient.from('simple_campaign_events').select('id, campaign_id, event_type, payload, created_at, processed, processed_at, result').eq('campaign_id', campaign_id).order('created_at', { ascending: false }).limit(200);
      if (error) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Failed to fetch report', detail: error }) };
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, events: data }) };
    }

    if (action === 'create_event') {
      const campaign_id = body.campaign_id || null;
      const event_type = String(body.event_type || 'note');
      const payload = body.payload || {};
      try {
        const row = { campaign_id, event_type, payload: JSON.stringify(payload), created_at: new Date().toISOString() };
        if (userId) row.user_id = userId;
        const { error } = await adminClient.from('simple_campaign_events').insert([row]);
        if (error) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Failed to create event', detail: error }) };
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
      } catch (e) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: String(e) }) };
      }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Unknown action' }) };
  } catch (err) {
    console.error('homeSimple error', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
