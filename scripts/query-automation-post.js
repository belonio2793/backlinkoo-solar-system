#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing SUPABASE_URL or SERVICE_ROLE in env'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

(async function(){
  const slug = process.argv[2] || 'test-testcom-rzwv9';
  console.log('Querying automation_posts for slug like', slug);
  const { data, error } = await supabase.from('automation_posts').select('*').ilike('slug', `%${slug}%`).limit(20);
  if (error) { console.error('Query error:', error); process.exit(1); }
  console.log('Found rows:', (data||[]).length);
  console.dir(data, { depth: 4 });
  // Check storage existence for any candidate paths
  const bucket = process.env.SUPABASE_NEWS_BUCKET || process.env.SUPABASE_THEMES_BUCKET || 'themes';
  const base = SUPABASE_URL.replace(/\/$/, '') + `/storage/v1/object/public/${bucket}`;
  for (const row of (data||[])){
    const theme = row.blog_theme || row.blog_theme_id || 'minimal';
    const slugVal = String(row.slug || '').replace(/^\/+/, '');
    const parts = slugVal.split('/');
    const inner = parts.length>1 && parts[0] === theme ? parts.slice(1).join('/') : slugVal;
    const paths = [
      `${base}/${encodeURIComponent(theme)}/${encodeURIComponent(inner)}/post.html`,
      `${base}/${encodeURIComponent(theme)}/${encodeURIComponent(inner)}.html`,
      `${base}/${encodeURIComponent(theme)}/${encodeURIComponent(inner)}/index.html`,
      `${base}/${encodeURIComponent(theme)}/${encodeURIComponent(inner)}.html`
    ];
    console.log('Checking storage for theme', theme, 'inner', inner);
    for (const p of paths) {
      try {
        const r = await fetch(p);
        console.log(p, '->', r.status);
      } catch (e) { console.log(p, '-> fetch error', e.message); }
    }
  }
})();
