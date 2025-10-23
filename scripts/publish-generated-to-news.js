#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function simpleWrapHtml(title, content) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${String(title || '').replace(/</g,'&lt;')}</title>
<link rel="stylesheet" href="/styles/beautiful-blog.css">
</head>
<body>
<main>
${content}
</main>
</body>
</html>`;
}

(async function(){
  try {
    const campaignId = process.argv[2];
    if (!campaignId) { console.error('Usage: node scripts/publish-generated-to-news.js <campaignId>'); process.exit(1); }

    // Load campaign
    const { data: campaign } = await sb.from('automation_campaigns').select('*').eq('id', campaignId).maybeSingle();
    if (!campaign) { console.error('Campaign not found:', campaignId); process.exit(1); }

    const keyword = (campaign.keyword || (Array.isArray(campaign.keywords) ? campaign.keywords[0] : '') || campaign.name || 'post') ;
    const anchorText = campaign.anchor_text || (Array.isArray(campaign.anchor_texts) ? campaign.anchor_texts[0] : '') || keyword;
    const targetUrl = campaign.target_url || campaign.targetUrl || campaign.target || '';

    console.log('Generating content for', keyword, targetUrl);
    const { data: genRes, error: genErr } = await sb.functions.invoke('generate-content-openai', { body: { keyword, anchorText, url: targetUrl, wordCount: 800, save: true, campaignId } });
    if (genErr || !genRes) { console.error('Generation failed', genErr); process.exit(1); }
    const gen = genRes;
    if (!gen || !gen.content) { console.error('No generated content returned'); console.dir(gen); process.exit(1); }

    const content = gen.content;
    const slug = (gen.slug || gen.title || keyword).toString().replace(/[^a-z0-9\-]/gi,'-').replace(/-+/g,'-').replace(/(^-|-$)/g,'').toLowerCase();
    console.log('Slug:', slug);

    // Determine domain - use first eligible domain for campaign owner
    const { data: domains } = await sb.from('domains').select('id, domain, selected_theme').eq('user_id', campaign.user_id).eq('dns_verified', true).eq('netlify_verified', true).order('created_at',{ascending:false}).limit(1);
    const domainRow = domains && domains[0];
    const domainHost = domainRow ? String(domainRow.domain).replace(/^https?:\/+/, '').replace(/\/$/, '') : null;

    const themeKey = (domainRow && (domainRow.selected_theme || domainRow.blog_theme_template_key)) || 'minimal';

    const html = await simpleWrapHtml(gen.title || keyword, content);

    // upload to bucket
    const bucket = process.env.SUPABASE_NEWS_BUCKET || process.env.SUPABASE_THEMES_BUCKET || 'news';
    const key = `${themeKey}/${slug}/post.html`;
    console.log('Uploading to', bucket, key);
    const buffer = Buffer.from(html, 'utf8');
    const { error: upErr } = await sb.storage.from(bucket).upload(key, buffer, { contentType: 'text/html; charset=utf-8', upsert: true });
    if (upErr) { console.error('Upload failed:', upErr); process.exit(1); }

    // public URL
    const publicBase = SUPABASE_URL.replace(/\/$/, '') + `/storage/v1/object/public/${bucket}`;
    const publicPath = `${publicBase}/${encodeURIComponent(themeKey)}/${encodeURIComponent(slug)}/post.html`;
    console.log('Public path:', publicPath);

    // Insert or update automation_posts record
    // Check existing row for campaign+domain
    let insertPayload = {
      automation_id: campaign.id,
      domain_id: domainRow ? domainRow.id : null,
      user_id: campaign.user_id,
      slug,
      title: gen.title || keyword,
      content: html,
      url: domainHost ? `https://${domainHost}/${encodeURIComponent(slug)}` : publicPath,
      status: 'published',
      blog_theme: themeKey,
      published_at: new Date().toISOString()
    };

    console.log('Upserting automation_posts...');
    const { data: upserted, error: upsertErr } = await sb.from('automation_posts').upsert(insertPayload, { onConflict: ['domain_id','slug'] }).select().maybeSingle();
    if (upsertErr) { console.error('Upsert failed:', upsertErr); }
    console.log('Result:', upserted);

    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e && (e.message || e));
    process.exit(1);
  }
})();
