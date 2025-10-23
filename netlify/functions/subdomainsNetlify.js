/**
 * Subdomains Netlify Manager
 * Auto-detects subdomain inputs and uses Netlify's /sites/:site_id/domains endpoints
 * Falls back to alias flow for apex domains.
 */

const NETLIFY_API = 'https://api.netlify.com/api/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
  'Content-Type': 'application/json'
};

function getNetlifyToken() {
  return (
    process.env.NETLIFY_ACCESS_TOKEN ||
    process.env.NETLIFY_AUTH_TOKEN ||
    process.env.NETLIFY_API_TOKEN ||
    ''
  );
}

function normalizeDomain(d) {
  return String(d || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function isValidDomain(d) {
  const re = /^[a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{1,63})+(\.[a-zA-Z]{2,})?$/;
  return re.test(d);
}

function isSubdomain(d) {
  // sub.domain.tld -> at least 3 labels
  return d.split('.').length >= 3;
}

function jsonResponse(statusCode, body) {
  return { statusCode, headers: corsHeaders, body: JSON.stringify(body) };
}

function safeJsonParse(body) {
  if (!body) return {};
  try { return JSON.parse(body); } catch { throw new Error('Invalid JSON in request body'); }
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export default async function updateSubdomain(siteId, subdomain, updates = {}) {
  const token = getNetlifyToken();
  if (!token) throw new Error('Missing Netlify access token');

  // 1) Get current site domains
  const existingDomains = await fetchJson(`${NETLIFY_API}/sites/${siteId}/domains`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const match = existingDomains.find(d => d.domain === subdomain);
  if (!match) {
    throw new Error(`Subdomain ${subdomain} not found on site ${siteId}. Try POST instead.`);
  }

  // 2) Patch the existing domain alias
  const data = await fetchJson(`${NETLIFY_API}/sites/${siteId}/domains/${encodeURIComponent(subdomain)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates || {})
  });

  return data;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (!['POST', 'PATCH'].includes(event.httpMethod)) {
    return jsonResponse(405, { success: false, error: 'Method not allowed. Use POST or PATCH.' });
  }

  try {
    const { domain, updates } = safeJsonParse(event.body);
    const siteId = process.env.NETLIFY_SITE_ID;
    const token = getNetlifyToken();

    if (!siteId || !token) {
      return jsonResponse(500, { success: false, error: 'Missing Netlify configuration' });
    }

    if (!domain) {
      return jsonResponse(400, { success: false, error: 'Domain is required' });
    }

    const cleanDomain = normalizeDomain(domain);
    if (!isValidDomain(cleanDomain)) {
      return jsonResponse(400, { success: false, error: `Invalid domain format: ${cleanDomain}` });
    }

    // Subdomain flow uses /domains endpoints
    if (isSubdomain(cleanDomain)) {
      try {
        const result = await updateSubdomain(siteId, cleanDomain, updates || {});
        return jsonResponse(200, {
          success: true,
          mode: 'subdomain_patch',
          message: `Subdomain ${cleanDomain} updated on site ${siteId}`,
          result
        });
      } catch (err) {
        // If not found, try to create via POST
        if (String(err.message || '').includes('not found')) {
          const created = await fetchJson(`${NETLIFY_API}/sites/${siteId}/domains`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain: cleanDomain, ...(updates || {}) })
          });
          return jsonResponse(200, {
            success: true,
            mode: 'subdomain_create',
            message: `Subdomain ${cleanDomain} created on site ${siteId}`,
            result: created
          });
        }
        throw err;
      }
    }

    // Apex domain flow: add as domain alias on the site
    const siteData = await fetchJson(`${NETLIFY_API}/sites/${siteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const aliases = Array.isArray(siteData.domain_aliases) ? siteData.domain_aliases : [];
    const already = aliases.some(a => normalizeDomain(a) === cleanDomain) || normalizeDomain(siteData.custom_domain) === cleanDomain;

    if (already) {
      return jsonResponse(200, {
        success: true,
        mode: 'alias_exists',
        message: `Domain ${cleanDomain} already present`,
        result: siteData
      });
    }

    const updated = await fetchJson(`${NETLIFY_API}/sites/${siteId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain_aliases: [...aliases, cleanDomain] })
    });

    return jsonResponse(200, {
      success: true,
      mode: 'alias_add',
      message: `Domain ${cleanDomain} added as alias`,
      result: updated
    });

  } catch (err) {
    console.error('subdomainsNetlify error:', err);
    return jsonResponse(err.status || 500, { success: false, error: err.message || 'Internal error', details: err.body });
  }
}

// CLI helper (optional): node netlify/functions/subdomainsNetlify.js blog.example.com '{"branch":"main"}'
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('subdomainsNetlify.js') && process.argv[2]) {
  const siteId = process.env.NETLIFY_SITE_ID;
  const subdomain = process.argv[2];
  const updates = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  updateSubdomain(siteId, normalizeDomain(subdomain), updates).then(r => {
    console.log('CLI success:', r);
  }).catch(e => {
    console.error('CLI error:', e);
    process.exitCode = 1;
  });
}
