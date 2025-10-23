// Allowed origins
const ALLOWED_ORIGINS = [
  'https://backlinkoo.netlify.app',
  'https://backlinkoo.com'
];

// Check if origin is allowed (including *.fly.dev)
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^https?:\/\/([a-z0-9-]+\.)?fly\.dev$/i.test(origin);
}

// Build CORS headers
function corsHeaders(origin) {
  // Reflect the requesting origin to avoid CORS mismatches across preview/dev hosts
  const allowedOrigin = origin || '*';

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, apikey, x-supabase-auth, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

exports.handler = async function (event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '*';

  try {
    // Handle OPTIONS preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true }) };
    }

    const method = event.httpMethod;
    const path = (event.path || '').replace(/.*\/domains/, '') || '/';

    // POST/PATCH /add: merge domains using Netlify API (GET + PATCH)
    // Reference: https://developers.netlify.com/guides/adding-your-domain-using-netlify-api/
    if ((method === 'PATCH' || method === 'POST') && path === '/add') {
      const body = JSON.parse(event.body || '{}');
      let input = [];
      if (Array.isArray(body.domains)) input = body.domains;
      else if (typeof body.domain === 'string' && body.domain.trim()) input = [body.domain];

      const normalize = (d) => String(d || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'');
      const valid = (d) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(String(d || ''));
      const domains = input.map(normalize).filter(valid);

      if (!domains.length) {
        return { statusCode: 400, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: 'No domains provided' }) };
      }

      const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
      const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';

      if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
        return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: 'Netlify credentials missing' }) };
      }

      // 1) Get current site configuration
      const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      });
      const siteData = await siteRes.json().catch(() => ({}));

      const currentPrimary = normalize(siteData?.custom_domain || '');
      const currentAliases = Array.isArray(siteData?.domain_aliases) ? siteData.domain_aliases.map(normalize).filter(Boolean) : [];

      // 2) Decide primary: keep existing if present, else use first provided
      const nextPrimary = currentPrimary || domains[0];

      // 3) Merge aliases: existing + input (excluding primary)
      const mergedAliases = Array.from(new Set([
        ...currentAliases,
        ...domains.filter((d) => d && d !== nextPrimary),
      ]));

      // 4) PATCH site with merged configuration
      const payload = { custom_domain: nextPrimary || undefined, domain_aliases: mergedAliases };
      const netlifyRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const netlifyText = await netlifyRes.text().catch(()=> '');
      let netlifyData; try { netlifyData = JSON.parse(netlifyText); } catch { netlifyData = netlifyText; }

      if (!netlifyRes.ok) {
        return { statusCode: netlifyRes.status, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: netlifyData }) };
      }

      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, added: domains, primary: nextPrimary, aliases: mergedAliases, netlifyData }) };
    }

    // GET /list: return aliases from Netlify site (compat with existing UI)
    if (method === 'GET' && path === '/list') {
      const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
      const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';

      if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
        return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, aliases: [], site_id: NETLIFY_SITE_ID || null }) };
      }

      const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      });
      const siteData = await siteRes.json().catch(() => ({}));
      const aliases = [];
      if (siteData && siteData.custom_domain) aliases.push(siteData.custom_domain);
      if (siteData && Array.isArray(siteData.domain_aliases)) aliases.push(...siteData.domain_aliases);
      const unique = [...new Set(aliases.map(String))];
      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, aliases: unique, site_id: NETLIFY_SITE_ID }) };
    }

    // POST /sync_aliases: echo back list (compat)
    if (method === 'POST' && path === '/sync_aliases') {
      const body = JSON.parse(event.body || '{}');
      const domains = Array.isArray(body.domains) ? body.domains : [];
      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, updatedAliases: domains }) };
    }

    // Legacy idle stubs for other routes
    if (method === 'POST' && path === '/remove') {
      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, message: 'domains function is idle' }) };
    }

    // Default idle
    return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, idle: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: err.message }) };
  }
};
