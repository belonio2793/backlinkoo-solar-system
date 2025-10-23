import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NETLIFY_API = "https://api.netlify.com/api/v1";
// Support multiple env names for flexibility across environments
const NETLIFY_SITE_ID =
  Deno.env.get("NETLIFY_SITE_ID") ||
  Deno.env.get("VITE_NETLIFY_SITE_ID") ||
  undefined;
const NETLIFY_ACCESS_TOKEN =
  Deno.env.get("NETLIFY_API_TOKEN") ||
  Deno.env.get("NETLIFY_ACCESS_TOKEN") ||
  Deno.env.get("VITE_NETLIFY_ACCESS_TOKEN") ||
  undefined;
const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL") ||
  Deno.env.get("PROJECT_URL") ||
  Deno.env.get("VITE_SUPABASE_URL") ||
  undefined;
const SUPABASE_SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
  Deno.env.get("SERVICE_ROLE_SECRET") ||
  undefined;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn("Supabase environment variables missing for domains function");
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

function cors(origin?: string | null) {
  const allowed = origin || "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  } as Record<string, string>;
}

function requireNetlify(): { ok: boolean; error?: string } {
  if (!NETLIFY_SITE_ID || !NETLIFY_ACCESS_TOKEN) {
    return { ok: false, error: "NETLIFY_SITE_ID or NETLIFY_ACCESS_TOKEN missing" };
  }
  return { ok: true };
}

function nfHeaders() {
  return {
    Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

function normalizeDomain(d: string) {
  return String(d || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

// --- helpers for Netlify site config ---
async function getSiteConfig() {
  const res = await fetch(`${NETLIFY_API}/sites/${NETLIFY_SITE_ID}`, {
    method: "GET",
    headers: nfHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch Netlify site config: ${res.status} ${await res.text()}`);
  return res.json();
}

async function patchAliases(updatedAliases: string[]) {
  const res = await fetch(`${NETLIFY_API}/sites/${NETLIFY_SITE_ID}`, {
    method: "PATCH",
    headers: nfHeaders(),
    body: JSON.stringify({ domain_aliases: updatedAliases }),
  });
  if (!res.ok) throw new Error(`Failed to update aliases: ${res.status} ${await res.text()}`);
  return res.json();
}

// Ensure the domain is ready for blogs: enable blog_enabled and assign a default theme
async function ensureBlogSetup(cleanDomain: string) {
  try {
    const nowIso = new Date().toISOString();
    const { data: row } = await supabase
      .from('domains')
      .select('id, blog_enabled, selected_theme, theme_name')
      .eq('domain', cleanDomain)
      .single();
    if (!row) return;

    const updates: Record<string, any> = { blog_enabled: true, updated_at: nowIso };
    if (!row.selected_theme) {
      updates.selected_theme = 'HTML';
      updates.theme_name = 'HTML';
    }
    await supabase.from('domains').update(updates).eq('id', row.id);

    // Try to ensure an active theme row exists; ignore if table missing
    try {
      const { data: active } = await supabase
        .from('domain_blog_themes')
        .select('id')
        .eq('domain_id', row.id)
        .eq('is_active', true)
        .limit(1);
      if (!active || active.length === 0) {
        await supabase.from('domain_blog_themes').insert({
          domain_id: row.id,
          theme_id: 'minimal',
          theme_name: 'Minimal Clean',
          is_active: true,
        });
      }
    } catch (_e) {
      // Table may not exist; fallback to domain fields only
      console.warn('domain_blog_themes table not available; using domain.selected_theme only');
    }
  } catch (e: any) {
    console.warn('ensureBlogSetup error:', e?.message || String(e));
  }
}

// --- Cloudflare helper for creating Custom Hostnames (best-effort)
async function createCloudflareCustomHostname(hostname: string, origin: string = 'domains.backlinkoo.com') {
  try {
    const ZONE_ID = Deno.env.get('CLOUDFLARE_DOMAIN_ZONE_ID') || Deno.env.get('CF_ZONE_ID') || '';
    const API_TOKEN = Deno.env.get('CLOUDFLARE_WORKERS_API') || Deno.env.get('CLOUDFLARE_API_TOKEN') || Deno.env.get('CF_API_TOKEN') || '';
    if (!ZONE_ID || !API_TOKEN) {
      console.warn('Cloudflare not configured for custom hostnames');
      return { success: false, error: 'Cloudflare not configured' };
    }
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/custom_hostnames`;
    const payload = {
      hostname,
      ssl: { method: 'http', type: 'dv' },
      custom_origin_server: origin,
      custom_origin_sni: origin
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.warn('Cloudflare create custom hostname failed', resp.status, data?.errors || data);
      return { success: false, status: resp.status, error: data?.errors || data };
    }
    console.log('Cloudflare custom hostname created', hostname);
    return { success: true, result: data.result || data };
  } catch (e) {
    console.warn('Cloudflare create custom hostname exception', e?.message || e);
    return { success: false, error: String(e) };
  }
}

async function addDomain(domain: string, userId?: string) {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };

  const clean = normalizeDomain(domain);
  if (!clean) return { success: false, error: "Invalid domain" };

  console.log(JSON.stringify({ event: 'domains:add:start', siteId: NETLIFY_SITE_ID || null, domain: clean, userId: userId || null }));

  const site = await getSiteConfig();
  const currentAliases: string[] = site.domain_aliases || [];
  console.log(JSON.stringify({ event: 'domains:add:aliases_before', count: currentAliases.length }));

  // If already present as alias or primary domain, upsert and ensure blog setup
  const alreadyPresent = (site.custom_domain && normalizeDomain(site.custom_domain) === clean) || currentAliases.includes(clean);
  if (alreadyPresent) {
    console.log(JSON.stringify({ event: 'domains:add:already_present', domain: clean }));
    await supabase.from("domains").upsert({ domain: clean, user_id: userId || null, netlify_site_id: NETLIFY_SITE_ID || null });
    await ensureBlogSetup(clean);
    // Best-effort: create Cloudflare Custom Hostname
    try { await createCloudflareCustomHostname(clean); } catch (e) { console.warn('CF create attempt failed', e?.message || e); }
    return { success: true, message: `Domain ${clean} already present`, updatedAliases: currentAliases };
  }

  const isSub = clean.split('.').length > 2;

  // For apex/root domains, prefer to set as custom_domain (primary) via PATCH
  if (!isSub) {
    try {
      console.log(JSON.stringify({ event: 'domains:add:attempt_set_custom', domain: clean }));
      const res = await fetch(`${NETLIFY_API}/sites/${NETLIFY_SITE_ID}`, {
        method: 'PATCH',
        headers: nfHeaders(),
        body: JSON.stringify({ custom_domain: clean }),
      });
      const text = await res.text().catch(() => '');
      if (res.ok) {
        const data = text ? JSON.parse(text) : {};
        console.log(JSON.stringify({ event: 'domains:add:custom_set', data }));
        await supabase.from("domains").upsert({ domain: clean, user_id: userId || null, netlify_site_id: NETLIFY_SITE_ID || null });
        await ensureBlogSetup(clean);
        // Best-effort: create Cloudflare Custom Hostname
        try { await createCloudflareCustomHostname(clean); } catch (e) { console.warn('CF create attempt failed', e?.message || e); }
        return { success: true, message: `Primary domain set to ${clean}`, data };
      } else {
        console.warn(JSON.stringify({ event: 'domains:add:custom_failed', status: res.status, text }));
        // If ownership issues or other errors, fall through to alias path
        if (/owned by another account/i.test(text)) {
          return { success: false, error: 'Domain is owned by another Netlify account' };
        }
      }
    } catch (e: any) {
      console.warn(JSON.stringify({ event: 'domains:add:custom_exception', message: e?.message || String(e) }));
      // continue to alias fallback
    }
  }

  // Fallback: add as alias (suitable for subdomains and when primary setting fails)
  try {
    const updated = await patchAliases([...currentAliases, clean]);
    console.log(JSON.stringify({ event: 'domains:add:patched', newCount: (updated?.domain_aliases || []).length }));
    await supabase.from("domains").upsert({ domain: clean, user_id: userId || null, netlify_site_id: NETLIFY_SITE_ID || null });
    await ensureBlogSetup(clean);
    // Best-effort: create Cloudflare Custom Hostname
    try { await createCloudflareCustomHostname(clean); } catch (e) { console.warn('CF create attempt failed', e?.message || e); }
    return { success: true, updatedAliases: updated.domain_aliases, site_url: updated.ssl_url || updated.url };
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.warn(JSON.stringify({ event: 'domains:add:error', domain: clean, message: msg }));
    if (/owned by another account/i.test(msg)) {
      return { success: false, error: "Domain is owned by another Netlify account" };
    }
    return { success: false, error: msg };
  }
}

async function removeDomain(domain: string) {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };

  const clean = normalizeDomain(domain);
  if (!clean) return { success: false, error: "Invalid domain" };

  const site = await getSiteConfig();
  const currentAliases: string[] = site.domain_aliases || [];

  if (!currentAliases.includes(clean)) {
    // Ensure DB cleanup anyway
    await supabase.from("domains").delete().eq("domain", clean);
    return { success: true, message: `Domain ${clean} not in aliases`, updatedAliases: currentAliases };
  }

  try {
    const updated = await patchAliases(currentAliases.filter((d: string) => d !== clean));
    await supabase.from("domains").delete().eq("domain", clean);
    return { success: true, updatedAliases: updated.domain_aliases, site_url: updated.ssl_url || updated.url };
  } catch (e: any) {
    return { success: false, error: String(e?.message || e) };
  }
}

async function listDomains() {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };
  const site = await getSiteConfig();
  return { success: true, aliases: site.domain_aliases || [], site_id: site.id };
}

async function syncAliases(domains: string[] = [], userId?: string) {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };
  const site = await getSiteConfig();
  const currentAliases: string[] = site.domain_aliases || [];
  const incoming = (domains || []).map(normalizeDomain).filter(Boolean);
  const next = Array.from(new Set([...currentAliases, ...incoming]));

  console.log(JSON.stringify({ event: 'domains:sync_aliases:start', incomingCount: incoming.length, currentCount: currentAliases.length }));

  try {
    const updated = await patchAliases(next);
    // best-effort DB upserts and blog setup
    for (const d of incoming) {
      await supabase.from("domains").upsert({ domain: d, user_id: userId || null, netlify_site_id: NETLIFY_SITE_ID || null });
      await ensureBlogSetup(d);
    }
    console.log(JSON.stringify({ event: 'domains:sync_aliases:patched', finalCount: (updated?.domain_aliases || []).length }));
    return { success: true, updatedAliases: updated.domain_aliases, added: incoming.filter(d => !currentAliases.includes(d)).length };
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.warn(JSON.stringify({ event: 'domains:sync_aliases:error', message: msg }));
    return { success: false, error: msg };
  }
}

async function pushToHost(payload: any) {
  return { pushed: true, payload };
}

async function checkDomain(domain: string) {
  const clean = normalizeDomain(domain);
  const res = await fetch(`https://${clean}`, { method: "HEAD" }).catch(() => null as any);
  return { domain: clean, status: res ? res.status : "unreachable" };
}

async function syncFromDb() {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };

  const site = await getSiteConfig();
  const currentAliases: string[] = site.domain_aliases || [];

  // Read all domains from Supabase and normalize
  const { data, error } = await supabase.from("domains").select("domain");
  if (error) return { success: false, error: `Supabase read failed: ${error.message}` } as any;

  const dbDomains = (data || []).map((d: any) => normalizeDomain(d.domain)).filter(Boolean);
  const next = Array.from(new Set([...currentAliases, ...dbDomains]));

  try {
    const updated = await patchAliases(next);
    // Ensure DB rows have netlify_site_id populated
    const updates = dbDomains.map((d: string) => ({ domain: d, netlify_site_id: NETLIFY_SITE_ID || null }));
    if (updates.length) {
      await supabase.from("domains").upsert(updates);
    }
    return { success: true, updatedAliases: updated.domain_aliases, added: dbDomains.filter(d => !currentAliases.includes(d)).length };
  } catch (e: any) {
    return { success: false, error: String(e?.message || e) };
  }
}

// --- Cron sync function ---
async function cronSyncDomains() {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };

  // 1️⃣ Fetch current Netlify site aliases
  const site = await getSiteConfig();
  const netlifyAliases: string[] = site.domain_aliases || [];

  // 2️⃣ Fetch all domains from Supabase
  const { data: dbData, error: dbError } = await supabase.from("domains").select("domain");
  if (dbError) return { success: false, error: dbError.message } as any;

  const dbDomains = (dbData || []).map((d: any) => normalizeDomain(d.domain)).filter(Boolean);

  // 3️⃣ Update all Supabase rows with the hard-coded site ID
  const updates = dbDomains.map((domain: string) => ({ domain, netlify_site_id: NETLIFY_SITE_ID || null }));
  if (updates.length) {
    await supabase.from("domains").upsert(updates);
  }

  // 4️⃣ Determine which domains are missing on Netlify
  const missingOnNetlify = dbDomains.filter((d: string) => !netlifyAliases.includes(d));
  const nextAliases = Array.from(new Set([...netlifyAliases, ...missingOnNetlify]));

  // 5️⃣ Patch Netlify site if needed
  let updatedAliases = netlifyAliases;
  if (missingOnNetlify.length) {
    const updated = await patchAliases(nextAliases);
    updatedAliases = updated.domain_aliases || [];
  }

  return {
    success: true,
    totalDomains: dbDomains.length,
    updatedNetlifyAliases: updatedAliases,
    syncedDomains: missingOnNetlify.length,
  };
}

async function checkAll() {
  const site = await getSiteConfig();
  const domains = site.domain_aliases || [];
  return Promise.all(domains.map((d: string) => checkDomain(d)));
}

// --- bulk add helper ---
async function addBulk(domainsList = [], userId) {
  const check = requireNetlify();
  if (!check.ok) return { success: false, error: check.error };

  const incoming = Array.from(new Set((domainsList || []).map(normalizeDomain).filter(Boolean)));
  if (!incoming.length) return { success: false, error: 'No valid domains provided' };

  // Prepare supabase upsert rows
  const nowIso = new Date().toISOString();
  const upserts = incoming.map(d => ({ domain: d, user_id: userId || null, status: 'pending', created_at: nowIso, netlify_site_id: NETLIFY_SITE_ID || null }));

  // Retry helper for Netlify API calls
  async function retryFetch(url, opts, attempts = 3) {
    let i = 0;
    while (i < attempts) {
      try {
        const res = await fetch(url, opts);
        if (res.ok) return res;
        // retry on 5xx or rate limit
        if (res.status >= 500 || res.status === 429) {
          await new Promise(r => setTimeout(r, Math.pow(2, i) * 500));
          i++;
          continue;
        }
        return res;
      } catch (e) {
        if (i === attempts - 1) throw e;
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 500));
        i++;
      }
    }
    throw new Error('retryFetch exhausted');
  }

  // Start Supabase upsert and Netlify patch in parallel
  const supabasePromise = (async () => {
    try {
      const res = await supabase.from('domains').upsert(upserts);
      return { ok: true, result: res };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  })();

  const netlifyPromise = (async () => {
    try {
      const site = await getSiteConfig();
      const currentAliases = site.domain_aliases || [];

      // Split apex vs subdomains
      const apex = incoming.filter(d => d.split('.').length === 2);
      const subdomains = incoming.filter(d => d.split('.').length > 2);

      const result: any = { patchedAliases: null, customSet: null, attempts: [] };

      // If there is at least one apex, attempt to set the first apex as custom_domain
      if (apex.length) {
        try {
          const custom = apex[0];
          const patchUrl = `${NETLIFY_API}/sites/${NETLIFY_SITE_ID}`;
          const patchRes = await retryFetch(patchUrl, { method: 'PATCH', headers: nfHeaders(), body: JSON.stringify({ custom_domain: custom }) });
          const patchText = await patchRes.text().catch(() => '');
          if (patchRes.ok) {
            result.customSet = custom;
            // After setting primary, refresh site info
            const refreshed = await getSiteConfig();
            currentAliases.splice(0, currentAliases.length, ...(refreshed.domain_aliases || []));
          } else {
            result.attempts.push({ action: 'set_custom', status: patchRes.status, text: patchText });
          }
        } catch (e) {
          result.attempts.push({ action: 'set_custom_exception', error: String(e) });
        }
      }

      // Compute next alias list and send a single PATCH if needed
      const next = Array.from(new Set([...currentAliases, ...incoming]));
      const toAdd = next.filter(a => !currentAliases.includes(a));
      if (toAdd.length) {
        try {
          const patched = await patchAliases(next);
          result.patchedAliases = patched.domain_aliases || [];
        } catch (e) {
          result.attempts.push({ action: 'patch_aliases_failed', error: String(e) });
        }
      }

      return { ok: true, result };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  })();

  const [sRes, nRes] = await Promise.allSettled([supabasePromise, netlifyPromise]);

  const summary: any = { domains: incoming, supabase: null, netlify: null };
  if (sRes.status === 'fulfilled') summary.supabase = sRes.value; else summary.supabase = { ok: false, error: sRes.reason || (sRes as any).value };
  if (nRes.status === 'fulfilled') summary.netlify = nRes.value; else summary.netlify = { ok: false, error: nRes.reason || (nRes as any).value };

  // Post-process: mark DNS-ready/netlify_verified for rows that were successfully patched
  try {
    const successful = Array.isArray(incoming) ? incoming : [];
    if (summary.netlify && summary.netlify.ok && summary.netlify.result) {
      const updates = successful.map(d => ({ domain: d, status: 'dns_ready', netlify_verified: true, updated_at: new Date().toISOString() }));
      await supabase.from('domains').upsert(updates);
    }
  } catch (e) {
    // non-critical
    console.warn('Post-update DB marking failed', e);
  }

  return { success: true, summary };
}


// --- main router ---
serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { headers });

  const url = new URL(req.url);
  // Support both local /domains/* and Supabase /functions/v1/domains/* paths
  const path = url.pathname.replace(/.*\/domains/, "");

  const disabled = new Set(["/env-check","/check","/sync","/sync-from-db","/cron-sync","/check-all","/push"]);
  if (disabled.has(path)) {
    return new Response(JSON.stringify({ success: false, error: 'Disabled' }), { status: 404, headers });
  }

  try {
    console.log(JSON.stringify({ event: 'domains:request', method: req.method, path, raw: url.pathname }));
    // Support root GET -> list
    if (req.method === "GET" && (path === "" || path === "/")) {
      return new Response(JSON.stringify(await listDomains()), { status: 200, headers });
    }

    if (req.method === "GET" && path === "/env-check") {
      return new Response(
        JSON.stringify({
          NETLIFY_SITE_ID: !!NETLIFY_SITE_ID,
          NETLIFY_ACCESS_TOKEN: !!NETLIFY_ACCESS_TOKEN,
          SUPABASE_URL: !!SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_KEY,
          sources: {
            siteIdFrom: NETLIFY_SITE_ID ? (Deno.env.get("NETLIFY_SITE_ID") ? "NETLIFY_SITE_ID" : (Deno.env.get("VITE_NETLIFY_SITE_ID") ? "VITE_NETLIFY_SITE_ID" : null)) : null,
            tokenFrom: NETLIFY_ACCESS_TOKEN ? (Deno.env.get("NETLIFY_API_TOKEN") ? "NETLIFY_API_TOKEN" : (Deno.env.get("NETLIFY_ACCESS_TOKEN") ? "NETLIFY_ACCESS_TOKEN" : (Deno.env.get("VITE_NETLIFY_ACCESS_TOKEN") ? "VITE_NETLIFY_ACCESS_TOKEN" : null))) : null,
            supabaseUrlFrom: SUPABASE_URL ? (Deno.env.get("SUPABASE_URL") ? "SUPABASE_URL" : (Deno.env.get("PROJECT_URL") ? "PROJECT_URL" : (Deno.env.get("VITE_SUPABASE_URL") ? "VITE_SUPABASE_URL" : null))) : null,
            hasServiceRole: !!SUPABASE_SERVICE_KEY,
          }
        }),
        { status: 200, headers },
      );
    }

    if (req.method === "GET" && path === "/list") {
      const list = await listDomains();
      console.log(JSON.stringify({ event: 'domains:list', count: Array.isArray((list as any)?.aliases) ? (list as any).aliases.length : null }));
      return new Response(JSON.stringify(list), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/add") {
      const { domain, user_id } = await req.json();
      return new Response(JSON.stringify(await addDomain(domain, user_id)), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/add_bulk") {
      const { domains, user_id } = await req.json().catch(() => ({}));
      return new Response(JSON.stringify(await addBulk(domains || [], user_id)), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/remove") {
      const { domain } = await req.json();
      return new Response(JSON.stringify(await removeDomain(domain)), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/sync_aliases") {
      const { domains, user_id } = await req.json();
      return new Response(JSON.stringify(await syncAliases(domains, user_id)), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/push") {
      const body = await req.json();
      return new Response(JSON.stringify(await pushToHost(body)), { status: 200, headers });
    }

    if (req.method === "POST" && (path === "/sync" || path === "/sync-from-db")) {
      return new Response(JSON.stringify(await syncFromDb()), { status: 200, headers });
    }
    if (req.method === "GET" && (path === "/sync" || path === "/sync-from-db")) {
      return new Response(JSON.stringify(await syncFromDb()), { status: 200, headers });
    }

    if (req.method === "POST" && path === "/cron-sync") {
      return new Response(JSON.stringify(await cronSyncDomains()), { status: 200, headers });
    }
    if (req.method === "GET" && path === "/cron-sync") {
      return new Response(JSON.stringify(await cronSyncDomains()), { status: 200, headers });
    }

    if ((req.method === "POST" || req.method === "GET") && path === "/check") {
      let domain = "";
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        domain = body?.domain || "";
      } else {
        const u = new URL(req.url);
        domain = u.searchParams.get("domain") || "";
      }
      return new Response(JSON.stringify(await checkDomain(domain)), { status: 200, headers });
    }

    if (req.method === "GET" && path === "/check-all") {
      return new Response(JSON.stringify(await checkAll()), { status: 200, headers });
    }

    // Root POST router (when calling functions.invoke('domains', { body: { action } }))
    if (req.method === "POST" && (path === "" || path === "/")) {
      const body = await req.json().catch(() => ({}));
      const action = String(body?.action || '').toLowerCase();
      if (action === 'add' && body?.domain) return new Response(JSON.stringify(await addDomain(body.domain, body.user_id)), { status: 200, headers });
      if (action === 'add_bulk' && Array.isArray(body?.domains)) return new Response(JSON.stringify(await addBulk(body.domains, body.user_id)), { status: 200, headers });
      if (action === 'remove' && body?.domain) return new Response(JSON.stringify(await removeDomain(body.domain)), { status: 200, headers });
      if (action === 'sync_aliases' && Array.isArray(body?.domains)) return new Response(JSON.stringify(await syncAliases(body.domains, body.user_id)), { status: 200, headers });
      if (action === 'list') return new Response(JSON.stringify(await listDomains()), { status: 200, headers });
      if (action === 'validate' && body?.domain) return new Response(JSON.stringify({ success: false, error: 'Disabled' }), { status: 404, headers });
      if (action === 'sync_from_db' || action === 'sync') return new Response(JSON.stringify({ success: false, error: 'Disabled' }), { status: 404, headers });
      if (action === 'cron_sync') return new Response(JSON.stringify({ success: false, error: 'Disabled' }), { status: 404, headers });
      return new Response(JSON.stringify({ success: false, error: 'Unknown or invalid action' }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ error: "Not found", path }), { status: 404, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || String(e) }), { status: 500, headers });
  }
});
