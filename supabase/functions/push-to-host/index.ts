import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getCorsHeaders } from '../_cors.ts';

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: cors,
      });
    }

    // Parse body with safe fallbacks
    let user_id: string | undefined;
    let extraDomains: string[] = [];
    let diagnose = false;
    let overrideToken: string | undefined = undefined;
    let overrideSiteId: string | undefined = undefined;
    let overrideSupabaseUrl: string | undefined = undefined;
    let overrideServiceRole: string | undefined = undefined;

    try {
      const body = await req.json().catch(() => ({}));
      user_id = body?.user_id ? String(body.user_id) : undefined;
      diagnose = Boolean(body?.diagnose);
      // Do not accept sensitive overrides from client; use server env only
      if (Array.isArray(body?.domains)) {
        extraDomains = body.domains
          .map((d: unknown) => String(d || '').trim().toLowerCase())
          .filter((d: string) => !!d);
      }
    } catch {}

    // Environment variables (allow body overrides for local testing)
    const NETLIFY_API_TOKEN = Deno.env.get("NETLIFY_API_TOKEN")
      || Deno.env.get("NETLIFY_ACCESS_TOKEN")
      || '';

    const NETLIFY_SITE_ID = Deno.env.get("NETLIFY_SITE_ID")
      || '';

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
      || Deno.env.get("PROJECT_URL")
      || '';

    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      || Deno.env.get("SERVICE_ROLE_KEY")
      || '';

    // Diagnostic response only (no failure) to help configure secrets
    if (diagnose) {
      const sources = {
        netlifyTokenSource: (Deno.env.get("NETLIFY_API_TOKEN") ? "NETLIFY_API_TOKEN"
          : (Deno.env.get("NETLIFY_ACCESS_TOKEN") ? "NETLIFY_ACCESS_TOKEN" : null)),
        netlifySiteIdSource: (Deno.env.get("NETLIFY_SITE_ID") ? "NETLIFY_SITE_ID" : null),
        supabaseUrlSource: (Deno.env.get("SUPABASE_URL") ? "SUPABASE_URL"
          : (Deno.env.get("PROJECT_URL") ? "PROJECT_URL" : null)),
        supabaseServiceKeySource: (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "SUPABASE_SERVICE_ROLE_KEY"
          : (Deno.env.get("SERVICE_ROLE_KEY") ? "SERVICE_ROLE_KEY" : null))
      };

      return new Response(
        JSON.stringify({
          success: true,
          diagnostics: {
            hasNetlifyToken: !!NETLIFY_API_TOKEN,
            hasNetlifySiteId: !!NETLIFY_SITE_ID,
            hasSupabaseUrl: !!SUPABASE_URL,
            hasSupabaseServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
            sources
          }
        }),
        { status: 200, headers: cors }
      );
    }

    if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID) {
      return new Response(JSON.stringify({ error: "Missing Netlify configuration (token/site id)" }), {
        status: 500,
        headers: cors,
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing Supabase configuration (url/service key)" }), {
        status: 500,
        headers: cors,
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Fetch active/verified domains from Supabase (optionally scoped by user)
    let query = supabase
      .from("domains")
      .select("domain, status, netlify_verified")
      .order("created_at", { ascending: false });

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    const { data: domainRows, error: domainsError } = await query;

    if (domainsError) {
      return new Response(JSON.stringify({ error: `Error fetching domains: ${domainsError.message}` }), {
        status: 500,
        headers: cors,
      });
    }

    // Build the list of apex domains we want to process (from DB + any explicit body.domains)
    const apexFromDb = (domainRows || [])
      .filter((d: any) => d?.status === "active" || d?.netlify_verified === true)
      .map((d: any) => String(d.domain || '').trim().toLowerCase())
      .filter(Boolean);
    const apexExplicit = extraDomains;
    const apexWanted = Array.from(new Set<string>([...apexFromDb, ...apexExplicit]));

    // Helper to normalize aliases
    const norm = (s: string) => String(s || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.$/, '');
    const toAliasSet = (arr: string[]) => new Set<string>(arr.map(norm));

    // Expand wanted set to include both apex and www forms for each domain
    const expandAliasForms = (d: string) => {
      const clean = norm(d).replace(/^www\./, '');
      return [clean, clean.startsWith('www.') ? clean : `www.${clean}`];
    };

    // Step 2: Fetch current Netlify site aliases
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!siteRes.ok) {
      const txt = await siteRes.text();
      return new Response(JSON.stringify({ error: `Failed to fetch Netlify site: ${siteRes.status} ${txt}` }), {
        status: 500,
        headers: cors,
      });
    }

    const siteData = await siteRes.json();
    const currentAliases: string[] = Array.isArray(siteData.domain_aliases) ? siteData.domain_aliases : [];
    const currentAliasSet = toAliasSet(currentAliases);

    // Build final desired alias list
    const wantedAliasSet = new Set<string>();
    apexWanted.forEach((d) => expandAliasForms(d).forEach((x) => wantedAliasSet.add(x)));

    // Compute what is truly being added (for user-visible count):
    // We count an apex domain as "added" if neither its apex nor its www existed previously
    const previouslyPresentApex = new Set<string>();
    apexWanted.forEach((d) => {
      const base = norm(d).replace(/^www\./, '');
      if (currentAliasSet.has(base) || currentAliasSet.has(`www.${base}`)) previouslyPresentApex.add(base);
    });

    const toAddAliases: string[] = Array.from(wantedAliasSet).filter((a) => !currentAliasSet.has(a));

    const updatedAliases = Array.from(new Set<string>([...currentAliasSet, ...wantedAliasSet]));

    // Step 3: PATCH updated aliases back to Netlify (full replacement via PATCH)
    const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain_aliases: updatedAliases }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return new Response(JSON.stringify({ error: `Failed to update Netlify: ${updateRes.status} ${err}` }), {
        status: 500,
        headers: cors,
      });
    }

    // Step 4: Update Supabase rows to reflect Netlify verification
    try {
      const batchSize = 10;
      for (let i = 0; i < apexWanted.length; i += batchSize) {
        const batch = apexWanted.slice(i, i + batchSize);
        await Promise.all(batch.map(async (d) => {
          const base = norm(d).replace(/^www\./, '');
          await supabase
            .from("domains")
            .update({
              netlify_verified: true,
              status: 'active',
              updated_at: new Date().toISOString(),
              last_sync: new Date().toISOString()
            })
            .in('domain', [base, `www.${base}`]);
        }));
      }
    } catch (_) {}

    // Compute added count by apex domain
    const addedApexCount = apexWanted.filter((d) => {
      const base = norm(d).replace(/^www\./, '');
      return !previouslyPresentApex.has(base);
    }).length;

    return new Response(JSON.stringify({
      success: true,
      approach: 'domain_aliases_put',
      processed: apexWanted.length,
      added: addedApexCount,
      total_domains: updatedAliases.length,
      previousAliases: Array.from(currentAliasSet),
      updatedAliases,
      ensured: Array.from(wantedAliasSet),
    }), {
      status: 200,
      headers: cors,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: cors,
    });
  }
});
