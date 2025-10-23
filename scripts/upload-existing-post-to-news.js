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

(async function(){
  try {
    const slug = process.argv[2];
    if (!slug) { console.error('Usage: node scripts/upload-existing-post-to-news.js <slug>'); process.exit(1); }
    const { data: posts } = await sb.from('automation_posts').select('*').eq('slug', slug).limit(1).maybeSingle();
    const post = posts || null;
    if (!post) { console.error('Post not found for slug', slug); process.exit(1); }
    const themeKey = post.blog_theme || post.blog_theme_id || 'minimal';
    const bucket = process.env.SUPABASE_NEWS_BUCKET || process.env.SUPABASE_THEMES_BUCKET || 'news';
    const key = `${themeKey}/${slug}/post.html`;
    const html = post.content || (`<article><h1>${post.title || slug}</h1><div>${post.content || ''}</div></article>`);
    const buffer = Buffer.from(html, 'utf8');
    console.log('Uploading to', bucket, key);
    const { error: upErr } = await sb.storage.from(bucket).upload(key, buffer, { contentType: 'text/html; charset=utf-8', upsert: true });
    if (upErr) { console.error('Upload failed', upErr); process.exit(1); }
    const publicBase = SUPABASE_URL.replace(/\/$/, '') + `/storage/v1/object/public/${bucket}`;
    const publicPath = `${publicBase}/${encodeURIComponent(themeKey)}/${encodeURIComponent(slug)}/post.html`;
    // prefer domain-root permalink if domain exists
    let permalink = publicPath;
    try { const { data: dom } = await sb.from('domains').select('domain').eq('id', post.domain_id).maybeSingle(); if (dom && dom.domain) permalink = `https://${String(dom.domain).replace(/\/$/, '')}/${encodeURIComponent(slug)}`; } catch (e) {}
    console.log('Public path:', publicPath, 'permalink:', permalink);
    const { data: updated, error: updErr } = await sb.from('automation_posts').update({ url: permalink }).eq('id', post.id).select().maybeSingle();
    if (updErr) { console.error('Update URL failed', updErr); process.exit(1); }
    console.log('Updated post:', updated);
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
})();
