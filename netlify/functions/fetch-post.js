const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function normalizeHost(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .split(',')[0]
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split(':')[0];
}

const SPA_FALLBACK_HOSTS = (() => {
  const raw = process.env.SPA_FALLBACK_HOSTS || 'backlinkoo.com,www.backlinkoo.com';
  return new Set(
    raw
      .split(',')
      .map((entry) => normalizeHost(entry))
      .filter(Boolean)
  );
})();

let cachedSpaIndexHtml;

function isSpaFallbackHost(host) {
  const normalized = normalizeHost(host);
  return Boolean(normalized) && SPA_FALLBACK_HOSTS.has(normalized);
}

function loadSpaIndexHtml() {
  if (cachedSpaIndexHtml !== undefined) return cachedSpaIndexHtml;
  const candidates = [
    path.join(__dirname, '..', '..', 'dist', 'index.html'),
    path.join(__dirname, '..', '..', 'index.html'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        cachedSpaIndexHtml = fs.readFileSync(candidate, 'utf8');
        break;
      }
    } catch (_) { }
  }
  if (cachedSpaIndexHtml === undefined) {
    cachedSpaIndexHtml = null;
  }
  return cachedSpaIndexHtml;
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    // 🔒 Skip for main Backlinkoo domain — handle only user custom domains
    const reqHeaders = event.headers || {};
    const hostHeader =
      reqHeaders['x-forwarded-host'] ||
      reqHeaders['host'] ||
      reqHeaders['x-forwarded-server'] ||
      '';
    const normalizedHost = String(hostHeader)
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .trim()
      .toLowerCase();

    if (['backlinkoo.com', 'www.backlinkoo.com'].includes(normalizedHost)) {
      // Option 1: serve SPA for Backlinkoo
      const spaIndex = loadSpaIndexHtml();
      if (spaIndex) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
          body: spaIndex,
        };
      }
      // Option 2: fallback to JSON 404 if no index found
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'Skipped on main domain' }),
      };
    }

    const query =
      event.httpMethod === 'GET'
        ? event.queryStringParameters || {}
        : JSON.parse(event.body || '{}') || {};
    const hasExplicitSlugParam = Boolean(query && (query.slug || query.s));
    let slugRaw = (query.slug || query.s || '').toString().trim();

    // Fallback 1: support calling the function as /.netlify/functions/fetch-post/<slug>
    if (!slugRaw && event.path) {
      const m = String(event.path).match(/\.netlify\/functions\/fetch-post\/?(.+)?$/);
      if (m && m[1]) slugRaw = decodeURIComponent(m[1]);
    }

    // Fallback 2: parse event.rawUrl for path-based rewrites
    if (!slugRaw && event.rawUrl) {
      try {
        const u = new URL(event.rawUrl);
        const segments = u.pathname.split('/').filter(Boolean);
        const fnIdx = segments.findIndex((p) => p === 'functions');
        const isFunctionPath =
          fnIdx >= 0 && segments[fnIdx + 1] === 'fetch-post';
        if (isFunctionPath && segments.length > fnIdx + 2) {
          slugRaw = decodeURIComponent(segments.slice(fnIdx + 2).join('/'));
        } else if (segments.length) {
          slugRaw = decodeURIComponent(segments[segments.length - 1]);
        }
      } catch (e) { }
    }

    // Fallback 3: attempt to read original requested URL headers
    if (!slugRaw) {
      const h = event.headers || {};
      const headerCandidates = [
        h['x-original-path'],
        h['x-forwarded-uri'],
        h['x-nf-original-path'],
        h['x-nf-original-request-uri'],
        h['x-rewrite-url'],
        h['x-original-url'],
        h['referer'],
      ].filter(Boolean);
      for (const original of headerCandidates) {
        if (typeof original === 'string') {
          const parts = original.split('?')[0].split('/').filter(Boolean);
          if (parts.length) {
            slugRaw = decodeURIComponent(parts[parts.length - 1]);
            break;
          }
        }
      }
    }

    if (!slugRaw)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing slug' }),
      };

    const SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    const THEME_BUCKET =
      process.env.SUPABASE_THEMES_BUCKET ||
      process.env.SUPABASE_THEMES_BUCKET ||
      'themes';
    if (!SUPABASE_URL || !SERVICE_ROLE)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing supabase config',
        }),
      };

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // Detect request host and try to resolve domain row (for custom domains)
    const host = normalizeHost(hostHeader);
    let domainRow = null;
    try {
      if (host) {
        const { data: d } = await supabase
          .from('domains')
          .select(
            'id, domain, selected_theme, blog_theme, blog_theme_template_key, user_id, dns_verified, netlify_verified'
          )
          .ilike('domain', `%${host}%`)
          .limit(1);
        if (Array.isArray(d) && d.length) domainRow = d[0];
      }
    } catch (e) {
      // ignore domain lookup errors
    }

    // --- Remainder of your function logic unchanged ---
    // (post lookup, theme fallback, AI generation, HTML embedding, etc.)

    // ... rest of your original function code here ...
    // (No edits below this point needed)
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: err.message || String(err),
      }),
    };
  }
};
