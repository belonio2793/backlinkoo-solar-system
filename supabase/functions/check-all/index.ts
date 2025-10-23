import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getCorsHeaders } from '../_cors.ts';
const origin = (globalThis as any)?.origin || '';
const corsHeaders = getCorsHeaders(origin);

async function checkDNS(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, { method: 'GET' });
    const data = await res.json();
    return Array.isArray(data?.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

async function checkSSL(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://${domain}`, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: cors });
  }

  try {
    // Parse optional body for user scoping
    let user_id: string | undefined;
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        user_id = body?.user_id || undefined;
      } catch {}
    }

    // Env vars
    const NETLIFY_API_TOKEN = Deno.env.get('NETLIFY_API_TOKEN') || Deno.env.get('NETLIFY_ACCESS_TOKEN') || Deno.env.get('VITE_NETLIFY_ACCESS_TOKEN');
    const NETLIFY_SITE_ID = Deno.env.get('NETLIFY_SITE_ID') || Deno.env.get('VITE_NETLIFY_SITE_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('PROJECT_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY');

    if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'Missing environment variables' }), { status: 500, headers: cors });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Netlify aliases
    const netlifyRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
      method: 'GET',
    });
    if (!netlifyRes.ok) {
      const txt = await netlifyRes.text();
      return new Response(JSON.stringify({ success: false, error: `Netlify API error: ${netlifyRes.status} ${txt}` }), { status: 500, headers: cors });
    }
    const siteData = await netlifyRes.json();
    const netlifyAliases: string[] = Array.isArray(siteData?.domain_aliases) ? siteData.domain_aliases : [];

    // Supabase domains
    let query = supabase.from('domains').select('domain, created_at, user_id');
    if (user_id) query = query.eq('user_id', user_id);
    const { data: supabaseDomains, error: domainsError } = await query;
    if (domainsError) {
      return new Response(JSON.stringify({ success: false, error: `Database error: ${domainsError.message}` }), { status: 500, headers: cors });
    }

    const normalize = (s: string) => s.toLowerCase().trim();
    const aliasSet = new Set(netlifyAliases.map(normalize));

    const results = await Promise.all((supabaseDomains || []).map(async (row: any) => {
      const domain: string = normalize(row.domain || '');
      if (!domain) return null;
      const [dnsOk, sslOk] = await Promise.all([checkDNS(domain), checkSSL(domain)]);
      return {
        domain,
        netlify: aliasSet.has(domain),
        supabase: true,
        dns: dnsOk,
        ssl: sslOk,
        created: row.created_at,
        user_id: row.user_id,
      };
    }));

    const filtered = results.filter(Boolean);
    return new Response(JSON.stringify({ success: true, count: filtered.length, results: filtered }), { status: 200, headers: cors });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ success: false, error: message }), { status: 500, headers: cors });
  }
});
