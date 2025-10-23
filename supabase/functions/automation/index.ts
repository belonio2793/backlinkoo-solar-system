import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeContent as formatNormalize, titleCase as formatTitleCase, extractTitleFromContent, fetchExternalPageTitle } from "../_shared/format-post.ts";

// --- Post-processing helpers: grammar/style correction and paragraph normalization ---
async function aiProofreadHtml(html: string, apiKey: string): Promise<string | null> {
  try {
    if (!apiKey) return null;
    const system = "You are an expert copy editor. You will receive an HTML article. Return only valid HTML.\nRules:\n- Correct grammar, spelling, and punctuation.\n- Do not change meaning.\n- Preserve structure and tags.\n- Keep a single <h1> as the title if present; use <h2>/<h3> for subsections.\n- Keep all links and hrefs. Do not add scripts or styles.\n- Split overly long paragraphs into multiple <p> blocks of 120-180 words each.\n- Ensure paragraphs and headings are consistently formatted.\n- Do not wrap output in backticks.";
    const user = `Clean and normalize this blog HTML for publication.\n\n${html}`;
    const body = {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.2,
      max_tokens: 3000
    } as const;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      // Fallback to gpt-3.5-turbo if 4.1-mini is unavailable
      const alt = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, model: "gpt-3.5-turbo" })
      });
      if (!alt.ok) return null;
      const j2 = await alt.json();
      const out2 = j2?.choices?.[0]?.message?.content?.trim();
      return out2 && out2.length > 10 ? out2 : null;
    }
    const j = await res.json();
    const out = j?.choices?.[0]?.message?.content?.trim();
    return out && out.length > 10 ? out : null;
  } catch (_) {
    return null;
  }
}

function splitOverlongParagraphs(html: string, maxChars = 900): string {
  let out = String(html || "");
  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    if (text.length <= maxChars) return `<p>${inner}</p>`;
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let buf: string[] = [];
    let len = 0;
    for (const s of sentences) {
      const add = s.trim();
      const addLen = add.length + 1;
      if (len + addLen > maxChars && buf.length) {
        chunks.push(buf.join(" "));
        buf = [add];
        len = addLen;
      } else {
        buf.push(add);
        len += addLen;
      }
    }
    if (buf.length) chunks.push(buf.join(" "));
    return chunks.map(c => `<p>${c}</p>`).join("\n");
  });
  return out;
}

function ensureParagraphs(html: string): string {
  // If body lacks <p>, convert double newlines into paragraphs inside article
  if (!/<p\b/i.test(html)) {
    return html.replace(/<article[^>]*>([\s\S]*?)<\/article>/i, (_m, body) => {
      const parts = String(body).replace(/\r\n?/g, "\n").split(/\n\n+/).map(s => s.trim()).filter(Boolean);
      const rebuilt = parts.map(p => `<p>${p}</p>`).join("\n");
      return `<article>${rebuilt}</article>`;
    });
  }
  return html;
}

function slugify(text: string) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\_ ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function sha1Hex(bytes: Uint8Array) {
  const hashBuf = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getCors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

serve(async (req) => {
  const corsHeaders = getCors();
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = (body.action || body.type || "").toString().trim().toLowerCase()
      || (body.campaign_id ? "automation-post" : "");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("VITE_SERVICE_ROLE_KEY") ?? "";
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ success: false, error: "Supabase not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    async function readSecret(key: string) {
      try {
        const { data } = await sb.from("secrets").select("value").eq("key", key).maybeSingle();
        return data?.value ?? "";
      } catch {
        return "";
      }
    }

    async function publishStaticToNetlify(siteId: string, token: string, host: string, themeFromSlug: string, innerSlug: string, title: string, contentHtml: string) {
      // Try new root format first, then legacy /themes/ path for backward compatibility
      const pathA = `/${themeFromSlug}/${innerSlug}/index.html`;
      const pathB = `/${themeFromSlug}/${innerSlug}.html`;

      // Attempt to load a theme post template from Supabase storage
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("VITE_SUPABASE_URL") || "";

      function altThemeKeys(key: string): string[] {
        const orig = String(key || '');
        const k = orig.toLowerCase();
        const variants = new Set<string>([k, orig]);
        variants.add(k.replace(/-/g, '_'));
        variants.add(k.replace(/_/g, '-'));
        if (k === 'seo-optimized') variants.add('seo_optimized');
        if (k === 'tech-blog') variants.add('techblog');
        if (k === 'custom-layout') variants.add('custom_layout');
        if (k === 'elegant-editorial') { variants.add('eleganteditorial'); variants.add('elegant_editorial'); }
        if (k === 'ecommerce') variants.add('e-commerce');
        if (k === 'html') variants.add('HTML');
        return Array.from(variants);
      }

      async function fetchTemplate(themeKey: string, name: 'index.html' | 'post.html'): Promise<string | null> {
        if (!SUPABASE_URL) return null;
        const candidates = altThemeKeys(themeKey).map(k => `${SUPABASE_URL}/storage/v1/object/public/themes/${encodeURIComponent(k)}/${name}`);
        for (const url of candidates) {
          try {
            const res = await fetch(url, { method: 'GET' });
            if (res.ok && /text\/(html|plain)/i.test(res.headers.get('content-type') || '')) {
              return await res.text();
            }
          } catch (_) {}
        }
        return null;
      }

      function replaceTokens(tpl: string, tokens: Record<string, string | null | undefined>) {
        let out = tpl;
        for (const [k, v] of Object.entries(tokens)) {
          const val = v == null ? '' : String(v);
          const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}}`, 'gi');
          out = out.replace(re, val);
        }
        return out;
      }

      let finalHtml = null as string | null;
      // Try to fetch post.html from the theme; inject content
      try {
        const tpl = await fetchTemplate(themeFromSlug, 'post.html');
        if (tpl) {
          finalHtml = replaceTokens(tpl, {
            SITE_TITLE: `${title} — ${host}`,
            TITLE: title,
            DESCRIPTION: title,
            OG_IMAGE: '',
            PUBLISHED: new Date().toLocaleString(),
            CONTENT: contentHtml,
            CANONICAL: `/${themeFromSlug}/${innerSlug}`
          });
        }
      } catch (e) {
        console.warn('Error fetching theme template:', e);
      }

      // Fallback simple wrapper if theme template not found
      if (!finalHtml) {
        finalHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} - ${host}</title>
<meta name="description" content="${title}">
<meta name="robots" content="index,follow">
</head>
<body>
<main style="max-width:900px;margin:0 auto;padding:24px;font:18px/1.8 ui-serif,Georgia,serif;color:#111827">
<a href="/${themeFromSlug}/" style="color:#2563eb;text-decoration:none">← Back</a>
<h1 style="font-weight:800;line-height:1.15">${title}</h1>
<div style="color:#6b7280;font-size:14px;margin-bottom:14px">Published ${new Date().toLocaleString()}</div>
<div>${contentHtml}</div>
</main>
</body>
</html>`;
      }

      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(finalHtml);
      const sha = await sha1Hex(dataBytes);

      const filesManifest: Record<string, any> = {};
      filesManifest[pathA] = { sha, size: dataBytes.length };
      filesManifest[pathB] = { sha, size: dataBytes.length };

      // Create deploy (draft) on Netlify
      const createRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ draft: true, files: filesManifest })
      });

      if (!createRes.ok) {
        const bodyTxt = await createRes.text().catch(() => "<no body>");
        throw new Error(`Netlify create deploy failed: ${createRes.status} ${bodyTxt}`);
      }

      const deploy = await createRes.json();
      console.log('Netlify create deploy response:', JSON.stringify(deploy));
      const deployId: string = deploy.id;
      const required: string[] = Array.isArray(deploy.required) ? deploy.required : [];

      const uploadedPaths: string[] = [];

      // Upload file bytes for any required paths
      for (const p of [pathA, pathB]) {
        const pathKey = p.startsWith("/") ? p.substring(1) : p;
        if (required.includes(p) || required.includes(pathKey)) {
          const uploadUrl = `https://api.netlify.com/api/v1/deploys/${deployId}/files/${encodeURIComponent(pathKey)}`;
          const up = await fetch(uploadUrl, { method: "PUT", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "text/html" }, body: dataBytes });
          if (!up.ok) {
            const upTxt = await up.text().catch(() => "<no body>");
            console.warn(`Netlify upload error for ${p}:`, up.status, upTxt);
            throw new Error(`Upload failed for ${p}: ${up.status} ${upTxt}`);
          }
          uploadedPaths.push(p);
        } else {
          // Netlify already has the file
          uploadedPaths.push(p);
        }
      }

      // Wait for deploy to become ready/published (poll)
      let finalDeploy: any = deploy;
      try {
        const maxAttempts = 20;
        for (let i = 0; i < maxAttempts; i++) {
          const check = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
          if (!check.ok) break;
          const json = await check.json();
          finalDeploy = json;
          const state = String(json.state || "").toLowerCase();
          if (state === "ready" || state === "published") break;
          // small delay
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (e) {
        // ignore polling errors, we'll still try to verify public urls
      }

      // Determine a public base URL to verify against. Prefer deploy.deploy_ssl_url or deploy.deploy_url
      const publicBase = (finalDeploy && (finalDeploy.deploy_ssl_url || finalDeploy.deploy_url)) ? String(finalDeploy.deploy_ssl_url || finalDeploy.deploy_url).replace(/\/$/, "") : `https://${host}`;

      // Verify public URLs are accessible
      const available: string[] = [];
      for (const p of uploadedPaths) {
        const publicUrl = `${publicBase}${p}`;
        try {
          const v = await fetch(publicUrl, { method: "GET" });
          if (v.ok) available.push(publicUrl);
        } catch (e) {
          // ignore
        }
      }

      if (!available.length) {
        // still return info but indicate failure to verify public page
        console.warn('No available public URLs for deploy', deployId, 'public_base', publicBase, 'uploadedPaths', uploadedPaths);
        return { deploy_id: deployId, paths: uploadedPaths, draft: true, verified: false, public_base: publicBase, deploy };
      }

      return { deploy_id: deployId, paths: uploadedPaths, draft: true, verified: true, public_base: publicBase, urls: available, deploy };
    }

    async function generateContent(opts: { keyword: string; anchorText?: string; url?: string; wordCount?: number; domainId?: string; domain?: string; }): Promise<{ content: string; slug?: string }> {
      const { keyword, anchorText, url, wordCount = 800, domainId, domain } = opts;
      // Prefer Netlify generate-openai function if configured
      try {
        const base = Deno.env.get('NETLIFY_FUNCTIONS_URL') || Deno.env.get('VITE_NETLIFY_FUNCTIONS_URL') || '';
        if (base) {
          const endpoint = `${base.replace(/\/$/, '')}/generate-openai`;
          const payload = { keyword, anchorText, url, wordCount: Math.max(1200, Number(wordCount) || 2000), domain_id: domainId, domain } as any;
          const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const j = await res.json().catch(() => ({}));
          if (res.ok && j && (j.html || j.content)) {
            return { content: String(j.html || j.content), slug: j.slug };
          }
        }
      } catch (e) {
        console.warn('Netlify generate-openai not available:', e && (e.message || e));
      }
      const openAiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("VITE_OPENAI_KEY") || await readSecret("OPENAI_API_KEY") || await readSecret("VITE_OPENAI_KEY") || "";
      if (openAiKey) {
        try {
          const messages = [
            { role: "system", content: "You are an expert SEO content writer. Output HTML content only, with a single <h1> title." },
            { role: "user", content: `Write a ${Math.max(200, Math.min(3000, wordCount))} word HTML blog post about "${keyword}". Include the anchor text "${anchorText || keyword}" linking to ${url}. Use paragraphs and headings, output only HTML.` }
          ];
          const res = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Authorization": `Bearer ${openAiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-3.5-turbo", messages, max_tokens: Math.min(3000, Math.floor(wordCount * 1.6)) }) });
          if (!res.ok) {
            const errTxt = await res.text().catch(() => "<no body>");
            console.warn("OpenAI generate failed:", res.status, errTxt);
            throw new Error("OpenAI generation failed");
          }
          const j = await res.json();
          const content = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || "";
          if (!content || String(content).trim().length < 50) throw new Error("OpenAI returned empty content");
          return { content: String(content) };
        } catch (e) {
          console.warn("OpenAI generation error:", e);
        }
      }
      const title = `${keyword || "Article"} — ${new URL(url || "https://example.com").hostname}`;
      return { content: `<article><h1>${title}</h1><p>This is a short fallback article about ${keyword || "the topic"}. <a href="${url}" rel="nofollow">${anchorText || keyword || url}</a></p></article>` };
    }

    async function ensureUniqueSlug(sbClient: any, domain_id: string, baseSlug: string, themePrefix?: string) {
      const ts = Date.now().toString(36);
      const r1 = Math.random().toString(36).slice(2, 6);
      const r2 = Math.random().toString(36).slice(2, 6);
      let slug = `${baseSlug}-${ts}-${r1}-${r2}`;
      slug = slug.replace(/\/\/+/g, "/");
      let attempt = 0;
      while (true) {
        const [{ data: a }, { data: b }] = await Promise.all([
          sbClient.from("automation_posts").select("id").eq("domain_id", domain_id).eq("slug", slug).maybeSingle(),
          sbClient.from("blog_posts").select("id").eq("domain_id", domain_id).eq("slug", slug).maybeSingle()
        ]);
        if (!a && !b) break;
        attempt++;
        const suffix = attempt <= 10 ? `-${attempt}` : `-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        slug = `${baseSlug}-${ts}-${r1}-${r2}${suffix}`.replace(/\/\/+/g, "/");
        if (attempt > 20) break;
      }
      return slug;
    }

    async function roundRobin(user_id: string) {
      const { data: domains } = await sb.from("domains").select("id, domain, selected_theme, user_id, dns_verified, post_count, last_posted_at").eq("user_id", user_id).eq("dns_verified", true).order("created_at", { ascending: false });
      const domainRows = (domains || []).filter(Boolean);
      if (!domainRows.length) return null;
      const stats = domainRows.map((d: any) => ({ row: d, count: Number(d.post_count || 0), lastPosted: d.last_posted_at ? new Date(d.last_posted_at).getTime() : 0 }));
      stats.sort((a: any, b: any) => (a.count - b.count) || (a.lastPosted - b.lastPosted));
      return stats[0].row;
    }

    async function actionPublishBlog(params: any) {
      const { automation_id, domain_id, user_id, title, content, publish_static = false } = params || {};
      if (!automation_id || !domain_id || !user_id || !title || !content) return { status: 400, body: { success: false, error: "Missing required fields" } };

      const { data: domainData, error: domainErr } = await sb.from("domains").select("id, domain, blog_theme_template_key, selected_theme, user_id, dns_verified").eq("id", domain_id).maybeSingle();
      if (domainErr || !domainData) return { status: 404, body: { success: false, error: "Domain not found" } };

      let themePrefix = (domainData as any).blog_theme_template_key || "";
      if (!themePrefix && domainData.blog_theme_id) {
        try { const { data: themeRow } = await sb.from("blog_themes").select("template_key").eq("id", domainData.blog_theme_id).maybeSingle(); if (themeRow && (themeRow as any).template_key) themePrefix = (themeRow as any).template_key; } catch {}
      }

      const baseSlug = slugify(title);
      const host = String(domainData.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

      let finalUrl = "";
      let staticInfo: any = null;

      // Initial normalize
      let workingTitle = formatTitleCase(extractTitleFromContent(content) || title);
      let workingContent = formatNormalize(workingTitle, content);

      // Non-AI normalization: ensure paragraphs and split long ones
      workingContent = ensureParagraphs(workingContent);
      workingContent = splitOverlongParagraphs(workingContent);

      // Optional AI grammar/style correction pass
      const openAiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("VITE_OPENAI_KEY") || await readSecret("OPENAI_API_KEY") || await readSecret("VITE_OPENAI_KEY") || "";
      const aiCleaned = await aiProofreadHtml(workingContent, openAiKey);
      if (aiCleaned) {
        const t = extractTitleFromContent(aiCleaned) || workingTitle;
        workingTitle = formatTitleCase(t);
        workingContent = formatNormalize(workingTitle, aiCleaned);
      }

      const insertPayload: any = { automation_id, domain_id, user_id, title: workingTitle, content: workingContent, status: "published", blog_theme_id: domainData.blog_theme_id };
      let chosenThemeForSlug = (themePrefix || String(domainData.selected_theme || "minimal")).toLowerCase();
      if (chosenThemeForSlug === 'random-ai-generated') chosenThemeForSlug = 'random';
      const uniqueSlug = await ensureUniqueSlug(sb, domain_id, baseSlug, chosenThemeForSlug);
      insertPayload.slug = uniqueSlug;
      finalUrl = `https://${host}/${uniqueSlug}`;
      insertPayload.url = finalUrl;

      if (false) {
        let token = Deno.env.get("NETLIFY_API_TOKEN") || Deno.env.get("NETLIFY_ACCESS_TOKEN") || Deno.env.get("VITE_NETLIFY_ACCESS_TOKEN") || "";
        let siteId = Deno.env.get("NETLIFY_SITE_ID") || Deno.env.get("VITE_NETLIFY_SITE_ID") || "";
        if (!token || !siteId) { token = token || await readSecret("NETLIFY_API_TOKEN"); siteId = siteId || await readSecret("NETLIFY_SITE_ID"); }
        if (token && siteId) {
          const slugParts = String(uniqueSlug).split("/").filter(Boolean);
          const themeFromSlug = slugParts.length > 1 ? slugParts[0] : chosenThemeForSlug;
          const innerSlug = slugParts.length > 1 ? slugParts.slice(1).join("/") : slugParts[0] || baseSlug;
          try {
            const info = await publishStaticToNetlify(siteId, token, host, themeFromSlug, innerSlug, title, content);
            staticInfo = info;
          } catch (e) {
            console.warn("publishStaticToNetlify failed:", e);
          }
        }
      }

      const { data: inserted, error: insertErr } = await sb.from("automation_posts").insert(insertPayload).select().maybeSingle();
      if (insertErr) return { status: 500, body: { success: false, error: insertErr.message } };
      return { status: 200, body: { success: true, post: inserted, static: staticInfo } };
    }

    async function actionPublishStaticOnly(params: any) {
      const { domain_id, title, content, slug: providedSlug } = params || {};
      if (!domain_id || !title || !content) return { status: 400, body: { success: false, error: "Missing required fields" } };
      const { data: domainData } = await sb.from("domains").select("id, domain, blog_theme_template_key, selected_theme, user_id, dns_verified").eq("id", domain_id).maybeSingle();
      if (!domainData) return { status: 404, body: { success: false, error: "Domain not found" } };
      let themePrefix = domainData.blog_theme_template_key || "";
      if (!themePrefix && domainData.blog_theme_id) { try { const { data: themeRow } = await sb.from("blog_themes").select("template_key").eq("id", domainData.blog_theme_id).maybeSingle(); if (themeRow && themeRow.template_key) themePrefix = themeRow.template_key; } catch {} }
      const baseSlug = providedSlug ? slugify(providedSlug) : slugify(title);
      const host = String(domainData.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
      let token = Deno.env.get("NETLIFY_API_TOKEN") || Deno.env.get("NETLIFY_ACCESS_TOKEN") || Deno.env.get("VITE_NETLIFY_ACCESS_TOKEN") || "";
      let siteId = Deno.env.get("NETLIFY_SITE_ID") || Deno.env.get("VITE_NETLIFY_SITE_ID") || "";
      if (!token || !siteId) { token = token || await readSecret("NETLIFY_API_TOKEN"); siteId = siteId || await readSecret("NETLIFY_SITE_ID"); }
      if (!token || !siteId) return { status: 502, body: { success: false, error: "Netlify credentials not available" } };
      const slugCandidate = await ensureUniqueSlug(sb, domain_id, baseSlug, themePrefix || String(domainData.selected_theme || "minimal").toLowerCase());
      const parts = String(slugCandidate).split("/").filter(Boolean);
      const themeFromSlug = parts.length > 1 ? parts[0] : themePrefix || String(domainData.selected_theme || "minimal").toLowerCase();
      const inner = parts.length > 1 ? parts.slice(1).join("/") : parts[0] || baseSlug;
      try { const info = await publishStaticToNetlify(siteId, token, host, themeFromSlug, inner, title, content); const finalUrl = `https://${host}/${themeFromSlug}/${inner}`; return { status: 200, body: { success: true, static: info, url: finalUrl } }; } catch (e) { return { status: 502, body: { success: false, error: String(e) } }; }
    }

    async function actionAutomationPost(params: any) {
      const campaignId = params.campaign_id || params.campaignId || params.campaign || null;
      if (!campaignId) return { status: 400, body: { success: false, error: "Missing campaign_id" } };
      let campaign: any = null;
      let campaignSource = "automation";
      const { data: campaigns, error: cErr } = await sb.from("automation").select("*").eq("id", campaignId).maybeSingle();
      if (!campaigns || cErr) {
        const { data: alt, error: altErr } = await sb.from("automation_campaigns").select("*").eq("id", campaignId).maybeSingle();
        if (altErr || !alt) return { status: 404, body: { success: false, error: "Campaign not found" } };
        campaignSource = "automation_campaigns";
        campaign = { ...alt, id: alt.id, user_id: alt.user_id, target_url: alt.target_url || alt.targetUrl || "", keyword: alt.keyword || (Array.isArray(alt.keywords) ? alt.keywords[0] : ""), anchor_text: alt.anchor_text || alt.anchorText || "", model: alt.model || "gpt-3.5-turbo", theme: alt.theme || null };
      } else { campaign = campaigns; }
      const chosenDomain = await roundRobin(campaign.user_id);
      if (!chosenDomain) return { status: 400, body: { success: false, error: "No eligible domains for user" } };
      let domainTemplateKey = null;
      try { const domainTheme = chosenDomain.blog_theme || chosenDomain.selected_theme || null; if (domainTheme) { if (typeof domainTheme === "string") domainTemplateKey = domainTheme; else { const { data: themeRow } = await sb.from("blog_themes").select("template_key").eq("id", domainTheme).maybeSingle(); if (themeRow && (themeRow as any).template_key) domainTemplateKey = (themeRow as any).template_key; } } } catch {}
      const keyword = campaign.keyword || campaign.keywords?.[0] || campaign.name || "blog post";
      const anchor = campaign.anchor_text || campaign.anchor_texts?.[0] || keyword;
      const targetUrl = campaign.target_url || campaign.targetUrl || "";
      const generated = await generateContent({ keyword, anchorText: anchor, url: targetUrl, wordCount: params.wordCount || 800, domainId: chosenDomain.id, domain: chosenDomain.domain });
      if (!generated || !generated.content) return { status: 500, body: { success: false, error: "Content generation failed" } };
      const generatedHtml = String(generated.content);
      let title = "";
      try { const m = generatedHtml.match(/<h1[^>]*>(.*?)<\/h1>/i); if (m) title = m[1].trim(); } catch {}
      if (!title) { const firstLine = generatedHtml.split("\n").find((l: string) => l.trim().length > 0) || ""; title = String(firstLine).replace(/<[^>]+>/g, "").replace(/^#+\s*/, '').slice(0, 120) || `post-${Date.now()}`; }
      // Try to fetch a precise page title from the target URL (og:title/title/h1)
      try {
        if (targetUrl) {
          const ext = await fetchExternalPageTitle(targetUrl);
          if (ext) title = ext;
        }
      } catch {}
      let formattedContent = generatedHtml;
      if (!formattedContent.match(/<h1>/i)) formattedContent = `<article><h1>${formatTitleCase(title)}</h1>${formattedContent}</article>`;
      const baseInnerSlug = slugify(title);
      const themeSegment = (domainTemplateKey || String(chosenDomain.selected_theme || "minimal")).toLowerCase();
      const slug = await ensureUniqueSlug(sb, chosenDomain.id, baseInnerSlug, themeSegment);
      const host = String(chosenDomain.domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
      let finalUrl = `https://${host}/${slug}`;
      let staticInfo = null;
      // Initial normalize (prefer external/explicit title to avoid picking attributes)
      let workingTitle2 = formatTitleCase(title || extractTitleFromContent(formattedContent));
      let workingContent2 = formatNormalize(workingTitle2, formattedContent);

      // Non-AI normalization
      workingContent2 = ensureParagraphs(workingContent2);
      workingContent2 = splitOverlongParagraphs(workingContent2);

      // Optional AI grammar/style correction pass
      const openAiKey2 = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("VITE_OPENAI_KEY") || await readSecret("OPENAI_API_KEY") || await readSecret("VITE_OPENAI_KEY") || "";
      const aiCleaned2 = await aiProofreadHtml(workingContent2, openAiKey2);
      if (aiCleaned2) {
        const t2 = title || extractTitleFromContent(aiCleaned2) || workingTitle2;
        workingTitle2 = formatTitleCase(t2);
        workingContent2 = formatNormalize(workingTitle2, aiCleaned2);
      }

      const insertPayload: any = { automation_id: campaign.id, domain_id: chosenDomain.id, user_id: campaign.user_id, slug, title: workingTitle2, content: workingContent2, status: "published", blog_theme_id: chosenDomain.blog_theme_id, url: finalUrl, blog_theme: themeSegment, keywords: (Array.isArray(campaign.keywords) ? campaign.keywords : (campaign.keyword ? [String(campaign.keyword)] : [])), anchor_texts: (Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts : (campaign.anchor_text ? [String(campaign.anchor_text)] : [])) };
      const { data: insertedPost, error: insertErr } = await sb.from("automation_posts").insert(insertPayload).select().maybeSingle();
      if (insertErr) return { status: 500, body: { success: false, error: insertErr.message } };
      try { await sb.from("domains").update({ post_count: (chosenDomain.post_count || 0) + 1, last_posted_at: new Date().toISOString() }).eq("id", chosenDomain.id); } catch {}
      try { await sb.from(campaignSource).update({ last_posted_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", campaign.id); } catch {}
      return { status: 200, body: { success: true, published_url: insertedPost?.url || finalUrl || "", post: insertedPost, domain: chosenDomain, static: staticInfo } };
    }

    async function actionGenerateContent(params: any) {
      const { keyword, anchorText, url, wordCount = 800 } = params || {};
      if (!keyword) return { status: 400, body: { success: false, error: "Missing keyword" } };
      try { const content = await generateContent({ keyword, anchorText, url, wordCount }); return { status: 200, body: { success: true, content } }; } catch (e) { return { status: 500, body: { success: false, error: String(e) } }; }
    }

    async function actionRoundRobin(params: any) {
      const { campaign_id, user_id } = params || {};
      const uid = user_id || (campaign_id ? await (async () => { const { data } = await sb.from("automation_campaigns").select("user_id").eq("id", campaign_id).maybeSingle(); return data?.user_id; })() : null);
      if (!uid) return { status: 400, body: { success: false, error: "Missing user_id or campaign_id" } };
      const chosen = await roundRobin(uid);
      return { status: 200, body: { success: true, selected: chosen } };
    }

    async function actionMigrateUrlsToThemes(params: any) {
      const { user_id, domain_id } = params || {};
      try {
        let query = sb
          .from('automation_posts')
          .select('id, slug, url, domain_id, user_id')
          .not('slug', 'is', null);
        if (user_id) query = query.eq('user_id', user_id);
        if (domain_id) query = query.eq('domain_id', domain_id);
        const { data: posts, error } = await query.limit(10000);
        if (error) return { status: 500, body: { success: false, error: error.message } };
        let updated = 0;
        for (const p of posts || []) {
          if (!p?.domain_id || !p?.slug) continue;
          if (p?.url && (String(p.url).includes('/themes/') || (p.slug && String(p.url).includes(`/${String(p.slug).replace(/^\/+/, '')}`)))) continue;
          const { data: dom } = await sb.from('domains').select('domain').eq('id', p.domain_id).maybeSingle();
          if (!dom?.domain) continue;
          const host = String(dom.domain).replace(/^https?:\/\//, '').replace(/\/$/, '');
          const newUrl = `https://${host}/${String(p.slug).replace(/^\/+/, '')}`;
          const { error: upErr } = await sb.from('automation_posts').update({ url: newUrl }).eq('id', p.id);
          if (!upErr) updated++;
        }
        return { status: 200, body: { success: true, updated } };
      } catch (e) {
        return { status: 500, body: { success: false, error: String(e) } };
      }
    }

    async function actionSeedThemesPreview(params: any) {
      const { user_id, domain_id } = params || {};
      const THEME_KEYS = ['business','custom-layout','ecommerce','elegant-editorial','lifestyle','magazine','minimal','modern','portfolio','seo-optimized','tech-blog'];
      try {
        let dq = sb
          .from('domains')
          .select('id, domain')
          .eq('dns_verified', true)
;
        if (user_id) dq = dq.eq('user_id', user_id);
        if (domain_id) dq = dq.eq('id', domain_id);
        const { data: domains, error: dErr } = await dq;
        if (dErr) return { status: 500, body: { success: false, error: dErr.message } };
        let created = 0, skipped = 0;
        for (const d of domains || []) {
          const host = String(d.domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
          for (const theme of THEME_KEYS) {
            const inner = `preview-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
            const slug = `${theme}/${inner}`;
            const { data: existing } = await sb.from('automation_posts').select('id').eq('domain_id', d.id).eq('slug', slug).maybeSingle();
            if (existing) { skipped++; continue; }
            const title = `Preview: ${theme}`;
            const html = `<article><h1>${title}</h1><p>This is a preview post for the ${theme} theme. Content is generated for visual testing.</p></article>`;
            const url = `https://${host}/${slug}`;
            const now = new Date().toISOString();
            const { error: insErr } = await sb.from('automation_posts').insert({ domain_id: d.id, slug, title, content: html, url, status: 'published', published_at: now });
            if (!insErr) created++;
          }
        }
        return { status: 200, body: { success: true, created, skipped, themes: THEME_KEYS.length } };
      } catch (e) {
        return { status: 500, body: { success: false, error: String(e) } };
      }
    }

    async function actionMigrateSlugsToThemes(params: any) {
      const { user_id, domain_id, dry_run } = params || {};
      try {
        let q = sb.from('automation_posts').select('id, slug, url, domain_id, user_id, blog_theme_id');
        if (user_id) q = q.eq('user_id', user_id);
        if (domain_id) q = q.eq('domain_id', domain_id);
        const { data: posts, error } = await q.limit(20000);
        if (error) return { status: 500, body: { success: false, error: error.message } };

        let updated = 0, skipped = 0;
        for (const p of posts || []) {
          if (!p?.domain_id) { skipped++; continue; }
          let slug = String(p.slug || '').trim();
          if (!slug) { skipped++; continue; }

          // Normalize slug: remove leading slashes and any accidental 'themes/' prefix
          slug = slug.replace(/^\/+/, '').replace(/^themes\//i, '');

          // Already themed (contains '/'): skip
          if (slug.includes('/')) { skipped++; continue; }

          // Resolve theme key
          let themeKey = '';
          try {
            if (p.blog_theme_id) {
              const { data: t } = await sb.from('blog_themes').select('template_key').eq('id', p.blog_theme_id).maybeSingle();
              if (t?.template_key) themeKey = String(t.template_key);
            }
            if (!themeKey) {
              const { data: d } = await sb.from('domains').select('blog_theme_template_key, selected_theme, domain').eq('id', p.domain_id).maybeSingle();
              themeKey = String(d?.blog_theme_template_key || d?.selected_theme || 'minimal');
            }
          } catch {}
          themeKey = (themeKey || 'minimal').toLowerCase();

          // Slugify inner part
          const inner = String(slug)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\-\_ ]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

          if (!inner) { skipped++; continue; }

          // Build candidate and ensure uniqueness across automation_posts + blog_posts for this domain
          let candidate = `${themeKey}/${inner}`;
          let attempt = 0;
          while (true) {
            const [{ data: a }, { data: b }] = await Promise.all([
              sb.from('automation_posts').select('id').eq('domain_id', p.domain_id).eq('slug', candidate).maybeSingle(),
              sb.from('blog_posts').select('id').eq('domain_id', p.domain_id).eq('slug', candidate).maybeSingle(),
            ]);
            if ((!a || a.id === p.id) && !b) break;
            attempt++;
            candidate = `${themeKey}/${inner}-${attempt}`;
            if (attempt > 10) { candidate = `${themeKey}/${inner}-${Date.now().toString(36)}`; break; }
          }

          if (dry_run) { updated++; continue; }

          const { data: dom } = await sb.from('domains').select('domain').eq('id', p.domain_id).maybeSingle();
          const host = dom?.domain ? String(dom.domain).replace(/^https?:\/\//,'').replace(/\/$/,'') : '';
          const newUrl = host ? `https://${host}/themes/${candidate}` : null;

          const { error: upErr } = await sb.from('automation_posts').update({ slug: candidate, ...(newUrl ? { url: newUrl } : {}) }).eq('id', p.id);
          if (!upErr) updated++; else skipped++;
        }

        return { status: 200, body: { success: true, updated, skipped, dry_run: !!dry_run } };
      } catch (e) {
        return { status: 500, body: { success: false, error: String(e) } };
      }
    }

    switch (action) {
      case "publish-blog":
      case "publish-domain-post": {
        const res = await actionPublishBlog(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "publish-static-only":
      case "static-only": {
        const res = await actionPublishStaticOnly(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "automation-post":
      case "automation_post": {
        const res = await actionAutomationPost(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "generate-content":
      case "generate-content-openai": {
        const res = await actionGenerateContent(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "round-robin":
      case "roundrobin": {
        const res = await actionRoundRobin(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "migrate-urls-to-themes":
      case "migrate-automation-posts-urls": {
        const res = await actionMigrateUrlsToThemes(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "migrate-slugs-to-themed":
      case "migrate-automation-posts-slugs": {
        const res = await actionMigrateSlugsToThemes(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case "seed-themes-preview":
      case "seed-themes": {
        const res = await actionSeedThemesPreview(body);
        return new Response(JSON.stringify(res.body), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      default:
        return new Response(JSON.stringify({ success: false, error: "Unknown action. Provide `action` in body (automation-post | publish-blog | generate-content | round-robin | migrate-urls-to-themes | migrate-slugs-to-themed | seed-themes-preview)" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (err) {
    console.error("automation edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
});
