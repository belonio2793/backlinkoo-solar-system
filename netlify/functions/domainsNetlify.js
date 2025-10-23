const ALLOWED_ORIGINS = [
  'https://backlinkoo.netlify.app',
  'https://backlinkoo.com'
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^https?:\/\/([a-z0-9-]+\.)?fly\.dev$/i.test(origin);
}

function corsHeaders(origin) {
  const allowedOrigin =
    process.env.NODE_ENV === 'development' ? (origin || '*') : (isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0]);
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-supabase-access-token, x-supabase-auth, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };
}

function ok(body, origin) { 
  return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify(body) }; 
}

function err(status, body, origin) { 
  return { statusCode: status, headers: corsHeaders(origin), body: JSON.stringify(body) }; 
}

exports.handler = async function(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  const method = event.httpMethod || 'GET';
  if (method !== 'POST' && method !== 'PATCH') {
    return err(405, { success: false, error: 'Only POST/PATCH allowed' }, origin);
  }

  try {
    const token = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN || '';
    const siteId = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID || '';
    
    if (!token || !siteId) {
      return err(500, { success: false, error: 'Netlify credentials missing' }, origin);
    }

    const body = JSON.parse(event.body || '{}');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Accept { domain } or { domains: [] }
    let domains = [];
    if (Array.isArray(body.domains)) {
      domains = body.domains;
    } else if (typeof body.domain === 'string' && body.domain.trim()) {
      domains = [body.domain.trim()];
    }

    // Enhanced domain validation
    const normalize = (d) => String(d || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'').trim();
    const valid = (d) => {
      const domain = String(d || '');
      // More comprehensive domain validation
      return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(domain) && 
             domain.length >= 4 && domain.length <= 253;
    };
    
    domains = domains
      .map(normalize)
      .filter(valid)
      .filter((domain, index, self) => self.indexOf(domain) === index); // Remove duplicates
    
    console.log('Normalized domains:', domains);
    
    if (domains.length === 0) {
      return err(400, { success: false, error: 'No valid domains provided' }, origin);
    }

    // Step 1: Get current site config with better error handling
    console.log('Fetching site config for:', siteId);
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });

    console.log('Site GET status:', siteRes.status);
    
    if (!siteRes.ok) {
      const errorText = await siteRes.text();
      console.error('Site GET error:', errorText);
      return err(siteRes.status, { 
        success: false, 
        error: `Failed to fetch site: ${siteRes.status} - ${errorText}` 
      }, origin);
    }

    let current;
    try {
      const currentText = await siteRes.text();
      console.log('Site response text:', currentText.substring(0, 500)); // Log first 500 chars
      current = JSON.parse(currentText);
    } catch (parseError) {
      console.error('Failed to parse site response:', parseError);
      return err(500, { 
        success: false, 
        error: 'Invalid response from Netlify API' 
      }, origin);
    }

    const currentPrimary = normalize(current?.custom_domain || '');
    const currentAliases = Array.isArray(current?.domain_aliases) 
      ? current.domain_aliases.map(normalize).filter(Boolean) 
      : [];
    
    console.log('Current config:', { currentPrimary, currentAliases });

    // Step 2: Determine primary domain strategy
    let nextPrimary = currentPrimary;
    let toAddAsAliases = domains;

    // If no primary domain set, promote the first valid domain to primary
    if (!nextPrimary && domains.length > 0) {
      nextPrimary = domains[0];
      toAddAsAliases = domains.slice(1);
    }

    // Remove any domains that would be the primary from the alias list
    toAddAsAliases = toAddAsAliases.filter(d => d !== nextPrimary);

    // Merge new aliases with existing ones (remove duplicates)
    const mergedAliases = Array.from(new Set([
      ...currentAliases,
      ...toAddAsAliases
    ])).filter(Boolean);

    console.log('Next config:', { nextPrimary, mergedAliases });

    // Step 3: Update site configuration with individual domain additions
    const payload = {
      custom_domain: nextPrimary || undefined,
      domain_aliases: mergedAliases.length > 0 ? mergedAliases : undefined
    };

    // Remove undefined values from payload
    Object.keys(payload).forEach(key => 
      payload[key] === undefined && delete payload[key]
    );

    console.log('PATCH payload:', JSON.stringify(payload, null, 2));

    const patchRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    console.log('PATCH status:', patchRes.status);
    
    let patchData;
    let patchText;
    try {
      patchText = await patchRes.text();
      console.log('PATCH response text:', patchText.substring(0, 500));
      
      // Try to parse as JSON, but handle non-JSON responses
      if (patchText.trim().startsWith('{')) {
        patchData = JSON.parse(patchText);
      } else {
        patchData = { 
          raw_response: patchText,
          status: patchRes.status,
          statusText: patchRes.statusText 
        };
      }
    } catch (parseError) {
      console.error('PATCH parse error:', parseError);
      patchData = { 
        error: 'Failed to parse response',
        raw_response: patchText,
        status: patchRes.status 
      };
    }

    if (!patchRes.ok) {
      console.error('PATCH failed:', { status: patchRes.status, data: patchData });
      return err(patchRes.status, { 
        success: false, 
        error: `Netlify API Error: ${patchRes.status} - ${patchData.error || patchData.message || patchText || 'Unknown error'}`,
        debug: {
          site_id: siteId,
          payload: payload,
          response: patchText?.substring(0, 200)
        }
      }, origin);
    }

    console.log('PATCH successful:', patchData);

    // Return the updated configuration
    return ok({
      success: true,
      custom_domain: patchData.custom_domain || nextPrimary,
      domain_aliases: patchData.domain_aliases || mergedAliases,
      site_id: siteId,
      added_domains: domains,
      total_domains: [nextPrimary, ...mergedAliases].filter(Boolean).length,
      debug: {
        current_primary: currentPrimary,
        current_aliases: currentAliases.length,
        new_aliases_added: toAddAsAliases.length
      }
    }, origin);

  } catch (e) {
    console.error('Handler error:', e);
    return err(500, { 
      success: false, 
      error: `Internal server error: ${e.message}`,
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, origin);
  }
};
