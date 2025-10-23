import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
(async ()=>{
  try {
    const domain = process.argv[2] || 'backlinkoo.com';
    const { data, error } = await client.from('domains').select('*').eq('domain', domain).maybeSingle();
    if (error) { console.error('DB error:', error); process.exit(1); }
    if (!data) { console.log('Not found in domains table:', domain); process.exit(0); }
    console.log('Domain row:');
    console.log(JSON.stringify(data, null, 2));

    // Check related automation/posts counts
    const { data: posts } = await client.from('automation_posts').select('id,slug,published_at').eq('domain_id', data.id).limit(5);
    console.log('Sample automation_posts (up to 5):', posts || []);

    process.exit(0);
  } catch (e) { console.error('Exception:', e); process.exit(1); }
})();
