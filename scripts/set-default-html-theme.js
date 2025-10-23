/*
Set HTML as the default (and only) theme across domains table.
Usage:
  node scripts/set-default-html-theme.js
Requires env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or falls back to VITE_* for local)
*/

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  console.log('Fetching domains...');
  const { data: rows, error } = await sb.from('domains').select('id, selected_theme, blog_theme_template_key').limit(5000);
  if (error) {
    console.error('Failed to fetch domains:', error.message || error);
    process.exit(1);
  }
  if (!rows || rows.length === 0) {
    console.log('No domains found');
    return;
  }

  let updated = 0;
  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const ops = batch.map(r => sb.from('domains').update({ selected_theme: 'HTML' }).eq('id', r.id));
    const res = await Promise.all(ops);
    res.forEach((r, idx) => {
      if (r.error) {
        console.warn('Update failed for', batch[idx].id, r.error.message || r.error);
      } else {
        updated++;
      }
    });
    console.log(`Processed ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
  }
  console.log(`Done. Updated ${updated} domains to selected_theme = 'HTML'.`);
}

main().catch(e => { console.error('Fatal:', e && (e.message || e)); process.exit(1); });
