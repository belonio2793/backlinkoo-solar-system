#!/usr/bin/env node
/*
  Backfill script: populate domains.blog_theme_id using blog_themes.template_key

  Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/backfill-blog-themes.js

  If SUPABASE_SERVICE_ROLE_KEY is not provided, the script will fall back to VITE_SUPABASE_ANON_KEY but updates may be rejected by RLS. Prefer a service role key.
*/

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  console.log('Fetching blog_themes...');
  const { data: themes, error: themesErr } = await supabase.from('blog_themes').select('id, template_key');
  if (themesErr) {
    console.error('Failed to fetch blog_themes:', themesErr.message || themesErr);
    process.exit(1);
  }
  if (!themes || themes.length === 0) {
    console.log('No blog_themes found. Exiting.');
    return;
  }

  const themeByKey = {};
  themes.forEach(t => {
    if (t && t.template_key) themeByKey[String(t.template_key).toLowerCase()] = t.id;
  });

  console.log('Found themes:', Object.keys(themeByKey).length);

  console.log('Fetching domains...');
  const { data: domains, error: domainsErr } = await supabase
    .from('domains')
    .select('id, theme, blog_theme_id')
    .limit(1000);

  if (domainsErr) {
    console.error('Failed to fetch domains:', domainsErr.message || domainsErr);
    process.exit(1);
  }

  if (!domains || domains.length === 0) {
    console.log('No domains to process.');
    return;
  }

  const updates = [];
  for (const d of domains) {
    try {
      const current = d.blog_theme_id;
      if (current) {
        // already set, skip
        continue;
      }

      const themeField = d.theme || d.template_key || null;
      if (!themeField) continue;

      const key = String(themeField).toLowerCase();
      const themeId = themeByKey[key];
      if (!themeId) continue;

      updates.push({ id: d.id, blog_theme_id: themeId });
    } catch (e) {
      console.warn('Skipping domain due to error parsing:', d && d.id, e && e.message);
    }
  }

  console.log(`Will update ${updates.length} domains.`);
  if (updates.length === 0) return;

  // Apply updates in batches of 50
  const BATCH = 50;
  let updatedCount = 0;
  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    // perform individual updates as parallel Promises
    const promises = batch.map(u => 
      supabase.from('domains').update({ blog_theme_id: u.blog_theme_id }).eq('id', u.id)
    );
    const results = await Promise.all(promises);
    results.forEach((res, idx) => {
      const { error } = res;
      if (error) {
        console.warn('Update failed for', batch[idx].id, error.message || error);
      } else {
        updatedCount++;
      }
    });
    console.log(`Processed ${Math.min(i + BATCH, updates.length)} / ${updates.length}`);
  }

  console.log(`Backfill complete. Updated domains: ${updatedCount}/${updates.length}`);
}

main().catch(e => {
  console.error('Fatal error:', e && (e.message || e));
  process.exit(1);
});
