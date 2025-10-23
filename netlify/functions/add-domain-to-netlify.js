/**
 * Add Domain to Netlify as Alias
 *
 * Uses PATCH /api/v1/sites/{site_id} per Netlify docs.
 * Also updates Supabase with domain status.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
};

export async function handler(event) {
  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Only PATCH allowed
  if (event.httpMethod !== 'PATCH') {
    return jsonResponse(405, { success: false, error: 'Method not allowed. Use PATCH.' });
  }

  try {
    const { domain, domainId, action } = safeJsonParse(event.body);
    if (!domain && !['test_config', 'get_site_info'].includes(action)) {
      return jsonResponse(400, { success: false, error: 'Domain is required' });
    }

    if (action === 'test_config') return await testNetlifyConfiguration();
    if (action === 'get_site_info') return await getSiteInfo();

    const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (!netlifyToken || !siteId) {
      return jsonResponse(500, {
        success: false,
        error: 'Missing Netlify configuration',
      });
    }

    const cleanDomain = normalizeDomain(domain);
    if (!isValidDomain(cleanDomain)) {
      return jsonResponse(400, { success: false, error: `Invalid domain format: ${cleanDomain}` });
    }

    // Fetch current site
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      headers: { Authorization: `Bearer ${netlifyToken}` },
    });

    if (!siteRes.ok) {
      const msg = await siteRes.text();
      return jsonResponse(siteRes.status, { success: false, error: `Failed to fetch site: ${msg}` });
    }

    const siteData = await siteRes.json();
    const existingAliases = siteData.domain_aliases || [];
    const alreadyExists =
      existingAliases.some(a => normalizeDomain(a) === cleanDomain) ||
      normalizeDomain(siteData.custom_domain) === cleanDomain;

    if (alreadyExists) {
      return jsonResponse(200, {
        success: true,
        message: `Domain ${cleanDomain} already exists`,
        domain: cleanDomain,
        netlifyData: siteData,
      });
    }

    // PATCH to add alias
    const updatedAliases = [...existingAliases, cleanDomain];
    const patchRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain_aliases: updatedAliases }),
    });

    if (!patchRes.ok) {
      const msg = await patchRes.text();
      return jsonResponse(patchRes.status, {
        success: false,
        error: `Netlify API error: ${msg}`,
      });
    }

    const updated = await patchRes.json();

    // Update Supabase if domainId given
    if (domainId) {
      try {
        await supabase.from('domains').update({
          status: 'dns_ready',
          netlify_verified: true,
          netlify_site_id: siteId,
          updated_at: new Date().toISOString(),
        }).eq('id', domainId);
      } catch (err) {
        console.warn('⚠️ Supabase update failed', err.message);
      }
    }

    return jsonResponse(200, {
      success: true,
      message: `Domain ${cleanDomain} added as alias`,
      domain: cleanDomain,
      netlifyData: updated,
    });

  } catch (err) {
    console.error('❌ Handler error', err);
    return jsonResponse(500, { success: false, error: err.message || 'Internal error' });
  }
}

/* ------------------------
   Helpers
------------------------- */

function safeJsonParse(body) {
  if (!body) return {};
  try { return JSON.parse(body); } catch { throw new Error('Invalid JSON in request body'); }
}

function normalizeDomain(d) {
  return String(d).trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function isValidDomain(d) {
  const re = /^[a-zA-Z0-9-]{1,63}(\.[a-zA-Z]{2,})+$/;
  return re.test(d);
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/* ------------------------
   Extra actions
------------------------- */
async function testNetlifyConfiguration() {
  return jsonResponse(200, {
    success: true,
    action: 'test_config',
    message: 'Configuration test placeholder',
  });
}

async function getSiteInfo() {
  return jsonResponse(200, {
    success: true,
    action: 'get_site_info',
    message: 'Site info placeholder',
  });
}
