#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\_ ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

(async () => {
  const campaignId = '50282ae6-72c4-43e3-bfc2-4e2b402d2eac';
  const domainName = 'kyliecosmetics.org';
  const title = 'Kylie Cosmetics Soft Glam Look — Dynamic Supabase Render';
  const now = new Date().toISOString();

  try {
    // find domain
    const { data: domainRow, error: domainErr } = await supabase
      .from('domains')
      .select('*')
      .ilike('domain', `%${domainName}%`)
      .limit(1)
      .maybeSingle();

    if (domainErr) throw domainErr;
    if (!domainRow) {
      console.error('Domain not found; please add the domain first');
      process.exit(2);
    }

    const domainId = domainRow.id;
    const domainHost = String(domainRow.domain).replace(/^https?:\/\//, '').replace(/\/$/, '');

    // resolve theme key
    let themeKey = domainRow.blog_theme_template_key || domainRow.selected_theme || null;
    if (!themeKey && domainRow.blog_theme_id) {
      const { data: themeRow } = await supabase.from('blog_themes').select('template_key').eq('id', domainRow.blog_theme_id).maybeSingle();
      if (themeRow && themeRow.template_key) themeKey = themeRow.template_key;
    }
    if (!themeKey) themeKey = 'minimal';
    themeKey = String(themeKey).toLowerCase();

    const base = slugify(title);
    const rand = Math.random().toString(36).slice(2, 8);
    const slug = `${themeKey}/${base}-${rand}`;
    const url = `https://${domainHost}/themes/${slug}`;

    const content = `
<article class="${themeKey}">
  <h1>${title}</h1>
  <p>This is a dynamically rendered Supabase post for campaign ${campaignId} on ${domainHost}. It is stored in the automation_posts table and served dynamically by the domain-blog-server (no static Netlify deploy).</p>
  <p>Anchor example: <a href="${String('https://example.com')}">Example Link</a></p>
</article>
`;

    const payload = {
      automation_id: campaignId,
      domain_id: domainId,
      user_id: domainRow.user_id || null,
      slug,
      title,
      content,
      url,
      status: 'published',
      published_at: now,
      blog_theme: themeKey,
      keywords: ['kylie', 'cosmetics', 'soft glam'],
      anchor_texts: ['Kylie Cosmetics']
    };

    console.log('Inserting automation_posts row with slug:', slug, 'url:', url);
    const { data, error } = await supabase.from('automation_posts').insert(payload).select().maybeSingle();
    if (error) {
      console.error('Insert error:', error.message || error);
      process.exit(3);
    }

    console.log('✅ Inserted post id:', data?.id || '(no id returned)');
    console.log('URL:', url);
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error:', e?.message || e);
    process.exit(4);
  }
})();
