import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\_ ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json();
    const { automation_id, domain_id, user_id, title, content, slug: providedSlug, static_only } = body || {};

    if (!automation_id || !domain_id || !user_id || !title || !content) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("VITE_SERVICE_ROLE_KEY") ?? "";
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ success: false, error: "Supabase not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // Fetch domain row (try to get theme info)
    const { data: domainRow, error: domainErr } = await sb.from("domains").select("id, domain, blog_theme_id, blog_theme_template_key, selected_theme").eq("id", domain_id).maybeSingle();
    if (domainErr || !domainRow) {
      return new Response(JSON.stringify({ success: false, error: "Domain not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Idempotency: if this campaign already published to this domain, return existing post
    try {
      const { data: existing } = await sb
        .from('automation_posts')
        .select('*')
        .eq('automation_id', automation_id)
        .eq('domain_id', domain_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ success: true, post: existing, deduped: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } catch {}

    // Determine template/key prefix
    let themePrefix = (domainRow as any).blog_theme_template_key || "";
    if (!themePrefix && (domainRow as any).blog_theme_id) {
      try {
        const { data: themeRow } = await sb.from("blog_themes").select("template_key").eq("id", (domainRow as any).blog_theme_id).maybeSingle();
        if (themeRow && (themeRow as any).template_key) themePrefix = (themeRow as any).template_key;
      } catch (e) { console.warn("Failed to load blog_themes", e); }
    }

    const baseSlug = slugify(title);
    const themeKeyForSlug = themePrefix || String((domainRow as any).selected_theme || "minimal").toLowerCase();
    // Generate a slug WITHOUT theme segment; include timestamp+random for uniqueness
    let slug = providedSlug ? String(providedSlug).replace(/^\/+/, '').replace(/^themes\//i, '') : `${baseSlug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

    // If not static_only, ensure uniqueness across automation_posts + blog_posts
    if (!static_only) {
      let attempt = 0;
      while (true) {
        const [{ data: a }, { data: b }] = await Promise.all([
          sb.from("automation_posts").select("id").eq("domain_id", domain_id).eq("slug", slug).maybeSingle(),
          sb.from("blog_posts").select("id").eq("domain_id", domain_id).eq("slug", slug).maybeSingle(),
        ]);
        if (!a && !b) break;
        attempt++;
        const suffix = attempt <= 10 ? `-${attempt}` : `-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
        slug = `${baseSlug}${suffix}`;
        if (attempt > 20) break;
      }
    }

    const host = String((domainRow as any).domain).replace(/^https?:\/\//, "").replace(/\/$/, "");
    const finalUrl = `https://${host}/${slug}`;

    // Use provided title/content as-is (no formatting or normalization)
    const finalTitle = String(title || '');
    const finalContent = String(content || '');

    // Load campaign arrays (keywords, anchor_texts)
    let keywords: string[] | null = Array.isArray(body?.keywords) ? body.keywords.map((s: any) => String(s)) : null;
    let anchor_texts: string[] | null = Array.isArray(body?.anchor_texts) ? body.anchor_texts.map((s: any) => String(s)) : null;
    if (!keywords || !anchor_texts) {
      try {
        const { data: camp } = await sb.from('automation_campaigns').select('keywords, anchor_texts').eq('id', automation_id).maybeSingle();
        if (camp) {
          if (!keywords && Array.isArray((camp as any).keywords)) keywords = (camp as any).keywords.map((s: any) => String(s));
          if (!anchor_texts && Array.isArray((camp as any).anchor_texts)) anchor_texts = (camp as any).anchor_texts.map((s: any) => String(s));
        }
      } catch {}
    }
    if (!keywords) keywords = [String(body?.keyword || finalTitle)].filter(Boolean);
    if (!anchor_texts) anchor_texts = [String(body?.anchor_text || finalTitle)].filter(Boolean);

    // Build insert payload
    const insertPayload: any = {
      automation_id,
      domain_id,
      user_id,
      slug,
      title: finalTitle,
      content: finalContent,
      status: 'published',
      blog_theme_id: (domainRow as any).blog_theme_id,
      blog_theme: themeKeyForSlug,
      url: finalUrl,
      keywords,
      anchor_texts,
    };

    // Attempt insert with safe fallback (drop unknown columns if schema lacks them)
    async function insertWithFallback(payload: Record<string, unknown>) {
      try {
        const res = await sb.from('automation_posts').insert(payload).select().maybeSingle();
        if (res.error) throw res.error;
        return res.data;
      } catch (e) {
        const msg = String((e as any).message || e).toLowerCase();
        const clean: any = { ...payload };
        if (msg.includes('column') && msg.includes('blog_theme')) delete clean.blog_theme;
        if (msg.includes('column') && msg.includes('keywords')) delete clean.keywords;
        if (msg.includes('column') && msg.includes('anchor_texts')) delete clean.anchor_texts;
        if (msg.includes('column') && msg.includes('blog_theme_id')) delete clean.blog_theme_id;
        if (JSON.stringify(clean) !== JSON.stringify(payload)) {
          const retry = await sb.from('automation_posts').insert(clean).select().maybeSingle();
          if (retry.error) throw retry.error;
          return retry.data;
        }
        throw e;
      }
    }

    const inserted = await insertWithFallback(insertPayload);

    return new Response(JSON.stringify({ success: true, post: inserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("publish-domain-post error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
});
