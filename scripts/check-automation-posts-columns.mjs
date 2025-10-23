import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing env'); process.exit(1); }
const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
(async ()=>{
  try {
    const query = `SELECT column_name,is_nullable,data_type FROM information_schema.columns WHERE table_name='automation_posts' AND table_schema='public';`;
    const res = await client.rpc('exec_sql', { query });
    console.log('exec_sql returned:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('exec_sql failed:', e.message || e);
  }
})();
