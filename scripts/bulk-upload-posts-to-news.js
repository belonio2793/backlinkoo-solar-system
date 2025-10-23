#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_NEWS_BUCKET || process.env.SUPABASE_THEMES_BUCKET || 'news';
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function run() {
  console.log('Bulk upload posts to bucket:', BUCKET);
  const batchSize = 200;
  let offset = 0;
  while (true) {
    const { data: rows, error } = await sb.from('automation_posts').select('id,slug,content,blog_theme,domain_id,title').order('created_at', { ascending: true }).range(offset, offset + batchSize - 1);
    if (error) { console.error('Failed to fetch automation_posts:', error); process.exit(1); }
    if (!rows || rows.length === 0) break;
    console.log(`Processing ${rows.length} posts (offset ${offset})`);
    for (const r of rows) {
      try {
        if (!r || !r.slug) continue;
        const themeKey = r.blog_theme || 'minimal';
        const slug = String(r.slug).replace(/^\/+/, '').replace(/\s+/g, '-');
        const key = `${themeKey}/${slug}/post.html`;
        const html = r.content || (`<article><h1>${r.title || slug}</h1><div>${r.content || ''}</div></article>`);
        const buffer = Buffer.from(String(html), 'utf8');
        // upload
        const { error: upErr } = await sb.storage.from(BUCKET).upload(key, buffer, { contentType: 'text/html; charset=utf-8', upsert: true });
        if (upErr) {
          console.warn('Upload failed for', slug, upErr.message || upErr);
          continue;
        }
        const publicBase = SUPABASE_URL.replace(/\/$/, '') + `/storage/v1/object/public/${BUCKET}`;
        const publicPath = `${publicBase}/${encodeURIComponent(themeKey)}/${encodeURIComponent(slug)}/post.html`;
        // prefer domain-root permalink if domain exists
        let permalink = publicPath;
        try {
          const { data: dom } = await sb.from('domains').select('domain').eq('id', r.domain_id).maybeSingle();
          if (dom && dom.domain) permalink = `https://${String(dom.domain).replace(/\/$/, '')}/${encodeURIComponent(slug)}`;
        } catch (e) {}
        // update automation_posts.url
        try {
          const { data: updated, error: updErr } = await sb.from('automation_posts').update({ url: permalink }).eq('id', r.id).select().maybeSingle();
          if (updErr) console.warn('Failed to update url for', r.id, updErr.message || updErr);
          else console.log('Uploaded & updated:', slug);
        } catch (e) { console.warn('Update exception for', r.id, e && e.message); }
      } catch (e) {
        console.warn('Exception processing row', e && e.message);
      }
    }
    offset += rows.length;
    if (rows.length < batchSize) break;
  }
  console.log('Bulk upload complete');
}

run().catch(e => { console.error('Script failed:', e && e.message); process.exit(1); });
