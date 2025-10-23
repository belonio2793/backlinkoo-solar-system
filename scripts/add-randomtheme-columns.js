/*
Run with:
  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/add-randomtheme-columns.js

Adds html_url and css_storage_url columns to automation_posts if missing.
*/

const { createClient } = require('@supabase/supabase-js');

async function run() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars required');
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const sql = `
    ALTER TABLE IF EXISTS public.automation_posts
      ADD COLUMN IF NOT EXISTS html_url text,
      ADD COLUMN IF NOT EXISTS css_storage_url text;
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) throw error;
    console.log('✅ Columns html_url and css_storage_url ensured on automation_posts');
  } catch (e) {
    console.warn('⚠️ exec_sql RPC failed or not available:', e && (e.message || e));
    console.log('\nPlease run this SQL manually in Supabase SQL editor:\n');
    console.log(sql);
    process.exit(2);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
