/*
 * Purge unverified Netlify domains (no Supabase)
 *
 * Usage:
 *  - GET /.netlify/functions/prune-unverified-domains?dry_run=1    -> preview candidates
 *  - POST /.netlify/functions/prune-unverified-domains             -> delete candidates
 *  - To force a dry run on POST: body { dryRun: true }
 *
 * Safety:
 *  - Never deletes the site's custom_domain
 *  - Never deletes the Netlify default *.netlify.app hostname
 *  - Skips any domains that appear verified/issued
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'Method not allowed. Use GET or POST.' });
  }

  const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
  const siteId = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';
  if (!token || !siteId) {
    return json(500, { success: false, error: 'Netlify credentials missing (NETLIFY_ACCESS_TOKEN/NETLIFY_SITE_ID).' });
  }

  try {
    const dryRun = getDryRun(event);
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Fetch site info and domains
    const [siteRes, domainsRes] = await Promise.all([
      fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, { headers }),
      fetch(`https://api.netlify.com/api/v1/sites/${siteId}/domains`, { headers })
    ]);

    if (!siteRes.ok) return relay(siteRes);
    if (!domainsRes.ok) return relay(domainsRes);

    const site = await siteRes.json();
    const domains = await domainsRes.json();

    const primary = normalize(site.custom_domain || '');
    const defaultNetlify = new URL(site.ssl_url || site.url || `https://${site.name}.netlify.app`).hostname;

    const candidates = (Array.isArray(domains) ? domains : []).filter((d) => shouldDelete(d, primary, defaultNetlify));

    if (event.httpMethod === 'GET' || dryRun) {
      return json(200, {
        success: true,
        dry_run: true,
        site_id: siteId,
        primary_domain: primary || null,
        default_hostname: defaultNetlify,
        total_domains: domains.length || 0,
        candidates: candidates.map(summarizeDomain)
      });
    }

    // Delete candidates
    const results = [];
    for (const d of candidates) {
      const name = getDomainName(d);
      const url = `https://api.netlify.com/api/v1/sites/${siteId}/domains/${encodeURIComponent(name)}`;
      try {
        const del = await fetch(url, { method: 'DELETE', headers });
        const text = await del.text().catch(() => '');
        results.push({ domain: name, status: del.status, ok: del.ok, response: text.substring(0, 500) });
      } catch (e) {
        results.push({ domain: name, ok: false, error: e.message || String(e) });
      }
    }

    return json(200, {
      success: true,
      deleted_count: results.filter(r => r.ok).length,
      attempted: results.length,
      results
    });
  } catch (err) {
    console.error('❌ prune-unverified-domains error:', err);
    return json(500, { success: false, error: err.message || 'Internal error' });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function relay(res) {
  return res.text().then((t) => json(res.status, { success: false, error: `Netlify API ${res.status}`, details: t }));
}

function normalize(d) {
  return String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

function getDomainName(d) {
  return normalize(d?.hostname || d?.domain || d?.name || '');
}

function summarizeDomain(d) {
  return {
    domain: getDomainName(d),
    state: (d?.state || d?.status || d?.ssl_status || null),
    verified: coalesceBool(d?.verified, d?.verification_status === 'verified', d?.checks?.dns?.status === 'verified'),
    ssl_issued: getSslIssued(d),
    managed_dns: !!(d?.managed || d?.managed_dns || d?.dns_zone_id),
  };
}

function coalesceBool(...vals) {
  for (const v of vals) if (typeof v === 'boolean') return v; 
  return false;
}

function getSslIssued(d) {
  const s = d?.ssl_status;
  if (!s) return false;
  if (typeof s === 'string') return s.toLowerCase() === 'issued';
  if (typeof s === 'object' && typeof s.state === 'string') return s.state.toLowerCase() === 'issued';
  return false;
}

function isAwaiting(d) {
  const s = String(d?.state || d?.status || d?.ssl_status || '').toLowerCase();
  return s.includes('await') || s.includes('pending') || s.includes('checking');
}

function shouldDelete(d, primary, defaultHost) {
  const name = getDomainName(d);
  if (!name) return false;
  // Never delete primary or default Netlify hostname
  if (name === normalize(primary)) return false;
  if (name === normalize(defaultHost)) return false;

  const verified = coalesceBool(d?.verified, d?.verification_status === 'verified', d?.checks?.dns?.status === 'verified');
  const sslIssued = getSslIssued(d);

  // Unverified heuristics
  if (!verified && !sslIssued) return true;
  if (isAwaiting(d)) return true;

  return false;
}
