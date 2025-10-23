#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

function env(key, fallback = '') {
  return process.env[key] || fallback;
}

const SUPABASE_URL = env('SUPABASE_PROJECT_URL', env('SUPABASE_URL', env('VITE_SUPABASE_URL')));
const SERVICE_KEY = env('SUPABASE_SERVICE_ROLE_KEY', env('SERVICE_ROLE_SECRET', env('SUPABASE_KEY')));

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase configuration. Set SUPABASE_PROJECT_URL and SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_SECRET).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\_ ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadMaps() {
  const domRes = await supabase.from('domains').select('id, domain, blog_theme_template_key, selected_theme');
  if (domRes.error) throw new Error(domRes.error.message);
  const domainMap = new Map();
  for (const d of domRes.data || []) domainMap.set(d.id, d);
  return { domainMap };
}

async function ensureUniqueSlug(domain_id, candidate, selfId) {
  let attempt = 0;
  let slug = candidate;
  while (true) {
    const [{ data: a }, { data: b }] = await Promise.all([
      supabase.from('automation_posts').select('id').eq('domain_id', domain_id).eq('slug', slug).maybeSingle(),
      supabase.from('blog_posts').select('id').eq('domain_id', domain_id).eq('slug', slug).maybeSingle(),
    ]);
    const aId = a?.id || null;
    if ((!aId || aId === selfId) && !b) return slug;
    attempt++;
    slug = `${candidate}-${attempt}`;
    if (attempt > 10) {
      slug = `${candidate}-${Date.now().toString(36)}`;
      return slug;
    }
  }
}

async function migrate({ dryRun = false } = {}) {
  const { domainMap } = await loadMaps();
  let from = 0;
  const size = 1000;
  let updated = 0, skipped = 0, processed = 0;

  while (true) {
    const { data: rows, error } = await supabase
      .from('automation_posts')
      .select('id, domain_id, slug, url, title')
      .order('id', { ascending: true })
      .range(from, from + size - 1);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) break;

    for (const p of rows) {
      processed++;
      if (!p?.domain_id) { skipped++; continue; }
      const dom = domainMap.get(p.domain_id);
      if (!dom) { skipped++; continue; }

      let raw = String(p.slug || '').trim();
      if (!raw) { skipped++; continue; }
      raw = raw.replace(/^\/+/, '').replace(/^themes\//i, '');

      const host = String(dom.domain || '').replace(/^https?:\/\//,'').replace(/\/$/,'');
      const themed = raw.includes('/');

      if (themed) {
        // leave slug as-is but ensure URL has /themes/ prefix
        const needsUrlFix = !p.url || !String(p.url).includes('/themes/');
        if (needsUrlFix) {
          const newUrl = host ? `https://${host}/themes/${raw}` : null;
          if (dryRun) { updated++; continue; }
          const { error: upErr } = await supabase
            .from('automation_posts')
            .update({ ...(newUrl ? { url: newUrl } : {}) })
            .eq('id', p.id);
          if (!upErr) updated++; else skipped++;
        } else {
          skipped++;
        }
        continue;
      }

      let themeKey = String(dom.blog_theme_template_key || dom.selected_theme || '');
      if (!themeKey) themeKey = 'minimal';
      themeKey = themeKey.toLowerCase();
      if (themeKey === 'random-ai-generated') themeKey = 'random';

      const inner = slugify(raw || p.title || 'post');
      if (!inner) { skipped++; continue; }

      const candidateBase = `${themeKey}/${inner}`;
      const unique = await ensureUniqueSlug(p.domain_id, candidateBase, p.id);

      const newUrl = host ? `https://${host}/themes/${unique}` : null;

      if (dryRun) { updated++; continue; }

      const { error: upErr } = await supabase
        .from('automation_posts')
        .update({ slug: unique, ...(newUrl ? { url: newUrl } : {}) })
        .eq('id', p.id);
      if (!upErr) updated++; else skipped++;
    }

    from += size;
  }

  return { updated, skipped, processed };
}

(async () => {
  const dry = process.argv.includes('--dry-run');
  try {
    const res = await migrate({ dryRun: dry });
    console.log(JSON.stringify({ success: true, ...res, dryRun: dry }));
  } catch (e) {
    console.error(JSON.stringify({ success: false, error: e && e.message ? e.message : String(e) }));
    process.exit(1);
  }
})();
