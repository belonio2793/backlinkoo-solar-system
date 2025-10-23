import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function run() {
  try {
    console.log('Updating all domains.selected_theme to "HTML"...');
    const { error: updErr } = await sb
      .from('domains')
      .update({ selected_theme: 'HTML' })
      .neq('selected_theme', 'HTML');
    if (updErr && !/no rows/.test(String(updErr.message || ''))) throw updErr;
    console.log('✅ Updated existing rows (or already set)');

    // Best-effort: set DB default to 'HTML' for new rows, via exec_sql RPC if available
    try {
      const { error: rpcErr } = await sb.rpc('exec_sql', {
        sql: "ALTER TABLE public.domains ALTER COLUMN selected_theme SET DEFAULT 'HTML';"
      });
      if (rpcErr) console.warn('Could not set DB default (non-fatal):', rpcErr.message);
      else console.log('✅ Set DB default for selected_theme to HTML');
    } catch (e) {
      console.warn('exec_sql not available to set default (non-fatal)');
    }

    // Verify sample
    const { data, error } = await sb.from('domains').select('id, domain, selected_theme').limit(3);
    if (error) console.warn('Verification read failed:', error.message);
    else console.log('Sample:', data);

    console.log('🎉 Completed.');
  } catch (e) {
    console.error('Failed:', e.message || e);
    process.exit(1);
  }
}

run();
