const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

function corsHeaders(origin) {
  const allowedOrigin = origin || '*';
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, Prefer, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    'Permissions-Policy': 'browsing-topics=()'
  };
}

exports.handler = async function (event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '*';
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true }) };
    }

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ error: 'Missing Supabase env vars' }) };
    }

    // Normalize incoming domain to avoid case/protocol/www mismatches
    const normalize = (d) => String(d || '').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/$/,'');

    // Support DELETE to remove domain rows
    if (event.httpMethod === 'DELETE') {
      const qs = new URLSearchParams(event.queryStringParameters || {});
      let d = (qs.get('domain') || qs.get('key') || '').trim();
      if (!d && event.body) {
        try { const b = JSON.parse(event.body || '{}'); d = b.domain || b.key || ''; } catch {}
      }
      const norm = normalize(d);
      if (!norm) return { statusCode: 400, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: 'Missing domain' }) };
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supa = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
        const { error } = await supa.from('domains').delete().eq('domain', norm);
        if (error) return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: error.message || 'Delete failed' }) };
        return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, removed: norm }) };
      } catch (e) {
        return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ success: false, error: e.message || 'Delete failed' }) };
      }
    }

    const body = JSON.parse(event.body || '{}');
    const { domain, user_id, debug } = body;
    if (!domain) {
      return { statusCode: 400, headers: corsHeaders(origin), body: JSON.stringify({ error: 'Missing domain' }) };
    }

    const normDomain = normalize(domain);

    // Helper: generate TXT verification token
    function generateTxtToken() {
      try {
        const crypto = require('crypto');
        return `blkoo-${crypto.randomBytes(8).toString('hex')}-${Date.now().toString(36)}`;
      } catch {
        return `blkoo-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`;
      }
    }

    function duplicateOwnershipResponse() {
      const token = generateTxtToken();
      const response = {
        success: false,
        reason: 'duplicate_domain',
        error: `Domain ${normDomain} already exists in our database`,
        message: `${normDomain} (domain) already exists in our database. Please email support@backlinkoo.com with the domain name and temporarily add a TXT DNS record so we can delete or transfer it. Include TXT/DNS record value: ${token}`,
        s: `- ${normDomain} (domain) already exists in our database. Please email support@backlinkoo.com with the domain name with a TXT RECORD ${token} so we can delete it. Include TXT/DNS record: ${token}`,
        domain: normDomain,
        support_email: 'support@backlinkoo.com',
        txt_record: {
          type: 'TXT',
          name: `_backlinkoo-verify.${normDomain}`,
          value: token,
          ttl: 300
        }
      };
      return { statusCode: 409, headers: corsHeaders(origin), body: JSON.stringify(response) };
    }

    // Debug log of incoming request
    console.log('[domainsSupabase] incoming domain:', domain, 'normalized:', normDomain, 'user_id:', user_id);

    // Pre-check: look for existing row by exact match or case-insensitive match to avoid 409 from unique/index differences
    const headers = { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` };

    try {
      // Exact match
      let lookup = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/domains?select=id,domain,user_id&domain=eq.${encodeURIComponent(normDomain)}`, { headers });
      let found = [];
      if (lookup.ok) found = await lookup.json().catch(() => []);

      // If not found, try ilike (case-insensitive) match
      if ((!found || found.length === 0)) {
        lookup = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/domains?select=id,domain,user_id&domain=ilike.${encodeURIComponent(normDomain)}`, { headers });
        if (lookup.ok) found = await lookup.json().catch(() => []);
      }

      if (found && found.length > 0) {
        const existing = found[0];
        // If domain appears owned by another user, return 409 with verification instructions
        if (existing.user_id && user_id && existing.user_id !== user_id) {
          return duplicateOwnershipResponse();
        }
        if (existing.user_id && !user_id) {
          return duplicateOwnershipResponse();
        }

        // Otherwise, patch the first matching row to update status/timestamps for same owner or unowned
        console.log('[domainsSupabase] found existing row, patching id=', existing.id);
        const patchRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/domains?id=eq.${encodeURIComponent(existing.id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SERVICE_ROLE,
            Authorization: `Bearer ${SERVICE_ROLE}`,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ domain: normDomain, status: 'pending', updated_at: new Date().toISOString() })
        });
        const patchedText = await patchRes.text().catch(() => '');
        if (patchRes.ok) {
          return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, supabase: JSON.parse(patchedText || '[]') }) };
        }
        // If patch failed, continue to POST attempt below
        console.warn('[domainsSupabase] patch existing failed', patchRes.status, patchedText);
      }
    } catch (e) {
      console.warn('[domainsSupabase] pre-check lookup failed:', e.message || e);
      // proceed to POST attempt below
    }

    // Use server-side supabase client to upsert reliably
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supa = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
      const payload = {
        domain: normDomain,
        user_id: user_id || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data: inserted, error: insertError } = await supa
        .from('domains')
        .insert([{ ...payload, updated_at: new Date().toISOString() }])
        .select('*');

      if (insertError) {
        console.warn('[domainsSupabase] insert error:', insertError.message || insertError);

        // If duplicate/unique violation -> return 409 with verification instructions
        const msg = String(insertError.message || '').toLowerCase();
        if (insertError.code === '23505' || msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('unique')) {
          return duplicateOwnershipResponse();
        }

        // Attempt to return existing rows instead of failing (handles missing unique constraints)
        try {
          const { data: existing } = await supa
            .from('domains')
            .select('*')
            .or(`domain.eq.${normDomain},domain.ilike.${normDomain}`)
            .limit(1);
          if (existing && existing.length > 0) {
            return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, supabase: existing }) };
          }
        } catch (ee) {
          console.warn('[domainsSupabase] fetch existing after insert failed:', ee.message || ee);
        }
        return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ error: insertError.message || 'Insert failed' }) };
      }

      return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ success: true, supabase: inserted || [] }) };

    } catch (e) {
      console.warn('[domainsSupabase] supabase-js upsert exception:', e.message || e);
      return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ error: e.message || String(e) }) };
    }
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ error: err.message }) };
  }
};
