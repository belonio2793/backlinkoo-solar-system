import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function run() {
  try {
    const file = path.join(process.cwd(), 'supabase', 'migrations', '20251001_add_domain_favicon.sql');
    const sql = await fs.readFile(file, 'utf8');
    console.log('Running SQL from', file);
    const { data, error } = await sb.rpc('exec_sql', { sql });
    if (error) {
      console.error('RPC exec_sql failed:', error.message || error);
      process.exit(1);
    }
    console.log('RPC succeeded:', data);
  } catch (e) {
    console.error('Migration failed:', e?.message || e);
    process.exit(1);
  }
}

run();
