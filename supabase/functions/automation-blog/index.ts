import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent } from "../_shared/format-post.ts";

// Helper: slugify title → slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // spaces + non-word → hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await req.json();
    const { automation_id, domain_id, user_id, title, content } = body;

    if (!automation_id || !domain_id || !user_id || !title || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Supabase setup
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(
        JSON.stringify({ success: false, error: "Supabase not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // --- Fetch domain info (domain + theme) ---
    const { data: domainData, error: domainError } = await sb
      .from("domains")
      .select("id, domain, selected_theme, blog_theme_template_key, user_id, dns_verified")
      .eq("id", domain_id)
      .maybeSingle();

    if (domainError || !domainData) {
      return new Response(
        JSON.stringify({ success: false, error: "Domain not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Determine theme prefix (template key) — prefer domain row, fall back to blog_themes lookup
    let themePrefix = (domainData as any).blog_theme_template_key || "";
    if (!themePrefix && domainData.blog_theme_id) {
      try {
        const { data: themeRow, error: themeErr } = await sb
          .from("blog_themes")
          .select("template_key")
          .eq("id", domainData.blog_theme_id)
          .maybeSingle();
        if (!themeErr && themeRow && (themeRow as any).template_key) themePrefix = (themeRow as any).template_key;
      } catch (e) {
        console.warn("Failed to read blog_themes for template_key:", e);
      }
    }
    let themeKeyForSlug = (themePrefix || String((domainData as any).selected_theme || "minimal")).toLowerCase();
    if (themeKeyForSlug === 'random-ai-generated') themeKeyForSlug = 'random';

    // --- Slugify + enforce uniqueness with theme prefix ---
    const baseSlug = slugify(title);
    let slug = `${baseSlug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
    let attempt = 0;

    while (true) {
      const [{ data: existingAuto, error: autoErr }, { data: existingBlog, error: blogErr }] =
        await Promise.all([
          sb.from("automation_posts")
            .select("id")
            .eq("domain_id", domain_id)
            .eq("slug", slug)
            .maybeSingle(),
          sb.from("blog_posts")
            .select("id")
            .eq("domain_id", domain_id)
            .eq("slug", slug)
            .maybeSingle(),
        ]);

      if (autoErr || blogErr) {
        console.warn("Warning checking slug uniqueness:", autoErr || blogErr);
        break; // don’t block publishing if DB error
      }

      if (!existingAuto && !existingBlog) {
        break; // ✅ slug is unique
      }

      attempt++;
      slug = `${baseSlug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}-${attempt}`;
      if (attempt > 10) {
        // fallback: unique hash
        slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
        break;
      }
    }

    // Decide if we should create static first (validate it exists before inserting URL)
    let staticInfo: any = null;
    const host = String((domainData as any).domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
    const finalUrl = host ? `https://${host}/${slug}` : "";

    // Normalize content and title
    const finalTitle = formatTitleCase(extractTitleFromContent(content) || title);
    const finalContent = formatNormalize(finalTitle, content);

    // Now insert post (include computed URL)
    const insertPayload: any = {
      automation_id,
      domain_id,
      user_id,
      slug,
      title: finalTitle,
      content: finalContent,
      status: "published",
      blog_theme_id: domainData.blog_theme_id,
      blog_theme: themeKeyForSlug,
      ...(finalUrl ? { url: finalUrl } : {}),
    };

    const { data, error } = await sb
      .from("automation_posts")
      .insert(insertPayload)
      .select()
      .maybeSingle();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, post: data, static: staticInfo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("automation-blog error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
