import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from '../_cors.ts';

const NETLIFY_DOH = 'https://cloudflare-dns.com/dns-query';
const NETLIFY_IPS = [
  '75.2.60.5',
  '99.83.190.102',
  '104.198.14.52'
];

async function queryDnsRecords(name: string, type: string) {
  try {
    const url = `${NETLIFY_DOH}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('DoH query failed', e);
    return null;
  }
}

async function checkHttps(domain: string) {
  try {
    // Try a HEAD request first; follow redirects but do not throw on non-2xx
    const res = await fetch(`https://${domain}`, { method: 'HEAD', redirect: 'follow', cache: 'no-store' });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: null };
  }
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json().catch(() => ({}));
    const domains: string[] = Array.isArray(body.domains) ? body.domains.map(String) : [];
    const user_id = body.user_id || null;
    const site_id = body.site_id || Deno.env.get('VITE_NETLIFY_SITE_ID') || Deno.env.get('NETLIFY_SITE_ID');

    const NETLIFY_TOKEN = Deno.env.get('NETLIFY_ACCESS_TOKEN') || Deno.env.get('VITE_NETLIFY_ACCESS_TOKEN') || '';
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY') || '';

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ success: false, error: 'Supabase service role or URL not configured' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (!NETLIFY_TOKEN) {
      return new Response(JSON.stringify({ success: false, error: 'Netlify access token not configured' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Timestamp for updates used across branches
    const nowIso = new Date().toISOString();

    // If the caller requests to force-validate all domains, perform a bulk update.
    // This allows the refresh button to mark domains as active/netlify_verified/ssl issued.
    if (body.force_all === true) {
      try {
        // Ensure we don't update example domains or the example placeholder
        const { error: bulkErr } = await sb
          .from('domains')
          .update({ status: 'active', ssl_status: 'issued', updated_at: nowIso })
          .not('domain', 'eq', 'backlinkoo.com');
        if (bulkErr) {
          console.warn('Bulk force update failed', bulkErr);
          return new Response(JSON.stringify({ success: false, error: bulkErr.message || bulkErr }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ success: true, forced: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
      } catch (e) {
        console.error('Bulk force update error:', e);
        return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
      }
    }

    // If no domains provided, load from DB (optionally filter by user_id)
    let domainRows: any[] = [];
    if (domains.length === 0) {
      const q = sb.from('domains').select('id,domain,user_id').order('created_at', { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      domainRows = (data || []).map((r: any) => ({ id: r.id, domain: r.domain }));
    } else {
      // Map provided domain names to ids if present in DB
      const { data: dbRows, error } = await sb.from('domains').select('id,domain').in('domain', domains);
      if (!error && dbRows && dbRows.length > 0) {
        // Use db ids when available and include provided domains not in DB
        const found = new Map(dbRows.map((r: any) => [r.domain, r.id]));
        domainRows = domains.map(d => ({ id: found.get(d) || null, domain: d }));
      } else {
        domainRows = domains.map(d => ({ id: null, domain: d }));
      }
    }

    const results: any[] = [];

    for (const dr of domainRows) {
      const domain = dr.domain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
      const rowId = dr.id || null;
      const result: any = { domain, id: rowId, netlify: false, dns: false, ssl: false, details: {} };

      try {
        // 1) Netlify domain info
        let netlifyData: any = null;
        try {
          const netRes = await fetch(`https://api.netlify.com/api/v1/sites/${site_id}/domains/${encodeURIComponent(domain)}`, { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } });
          if (netRes.ok) {
            netlifyData = await netRes.json();
            result.netlify = true;
            result.details.netlify = netlifyData;
          } else if (netRes.status === 404) {
            // Domain not in Netlify site domains list
            result.netlify = false;
          } else {
            // Fallback: try listing and searching
            const listRes = await fetch(`https://api.netlify.com/api/v1/sites/${site_id}/domains`, { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } });
            if (listRes.ok) {
              const listJson = await listRes.json();
              const found = (listJson || []).find((d: any) => (d.domain || '').toLowerCase() === domain.toLowerCase());
              if (found) {
                result.netlify = true;
                result.details.netlify = found;
                netlifyData = found;
              }
            }
          }
        } catch (e) {
          console.warn('Netlify API failed for', domain, e);
        }

        // 2) DNS checks via DoH
        const aRes = await queryDnsRecords(domain, 'A');
        const cnameRes = await queryDnsRecords(domain, 'CNAME');
        result.details.dns = { A: aRes, CNAME: cnameRes };

        // Interpret DNS: check for CNAME pointing to netlify or A records pointing to known Netlify IPs
        let dnsOk = false;
        try {
          if (cnameRes && cnameRes.Answer && Array.isArray(cnameRes.Answer) && cnameRes.Answer.length > 0) {
            const cnames = cnameRes.Answer.map((a: any) => String(a.data || '').toLowerCase());
            // Accept explicit apex-loadbalancer netlify target or general netlify hosts
            if (cnames.some((c: string) => c.includes('apex-loadbalancer.netlify.com') || c.includes('netlify') || c.includes('netlify.app'))) dnsOk = true;
          }
          if (!dnsOk && aRes && aRes.Answer && Array.isArray(aRes.Answer) && aRes.Answer.length > 0) {
            const as = aRes.Answer.map((a: any) => String(a.data || ''));
            if (as.some((ip: string) => NETLIFY_IPS.includes(ip))) dnsOk = true;
          }
        } catch (_) { dnsOk = false; }

        result.dns = dnsOk;

        // 3) SSL check: prefer Netlify ssl state if available
        let sslOk = false;
        let sslStatus: string | null = null;
        if (netlifyData && netlifyData.ssl && netlifyData.ssl.state) {
          sslStatus = netlifyData.ssl.state;
          sslOk = sslStatus === 'ready' || sslStatus === 'issued' || sslStatus === 'active';
        } else {
          const httpsResult = await checkHttps(domain);
          sslOk = !!httpsResult.ok;
          sslStatus = httpsResult.status ? String(httpsResult.status) : null;
        }
        result.ssl = sslOk;
        // Normalize SSL status: when SSL OK, store as 'issued' to match frontend expectations
        result.details.ssl_status = sslOk ? 'issued' : (sslStatus || null);

        // Prepare upsert payload
        const updatePayload: any = {
          netlify_verified: result.netlify,
          netlify_last_checked: nowIso,
          ssl_status: result.details.ssl_status,
          dns_verified: dnsOk,
          dns_records: result.details.dns,
          updated_at: nowIso
        };
        // If Netlify indicates the domain exists, promote to active status
        if (result.netlify) updatePayload.status = 'active';

        // If domain is not in DB, upsert will create it; include domain and user_id when available
        if (!rowId) updatePayload.domain = domain;
        if (user_id) updatePayload.user_id = user_id;

        // Respect example flag: if the existing DB row has is_example true, skip updates
        if (rowId) {
          const { data: existing } = await sb.from('domains').select('is_example').eq('id', rowId).maybeSingle();
          if (existing?.is_example) {
            // Skip updating example domains
            result.skipped = true;
            results.push(result);
            continue;
          }
        }

        // Upsert: if id present, update by id; otherwise upsert by domain
        if (rowId) {
          const { error: upErr } = await sb.from('domains').update(updatePayload).eq('id', rowId);
          if (upErr) {
            console.warn('Failed to update domain row', rowId, upErr);
            result.updated = false;
            result.error = upErr.message || upErr;
          } else result.updated = true;
        } else {
          // try insert on conflict domain
          const { data: upData, error: upErr } = await sb.from('domains').upsert(updatePayload, { onConflict: ['domain'] }).select().maybeSingle();
          if (upErr) {
            console.warn('Failed to upsert domain', domain, upErr);
            result.updated = false;
            result.error = upErr.message || upErr;
          } else {
            result.updated = true;
            if (upData && upData.id) result.id = upData.id;
          }
        }

      } catch (e) {
        console.warn('Domain verify error for', domain, e);
        result.error = e instanceof Error ? e.message : String(e);
      }

      results.push(result);
    }

    return new Response(JSON.stringify({ success: true, results }), { headers: { ...cors, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('domains-verify error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
