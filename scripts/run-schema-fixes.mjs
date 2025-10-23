import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function run() {
  const statements = [
    // Make automation_id nullable so ad-hoc posts can be inserted
    `ALTER TABLE IF EXISTS public.automation_posts ALTER COLUMN automation_id DROP NOT NULL;`,
    // Ensure created_at/updated_at exist on automation_posts
    `ALTER TABLE IF EXISTS public.automation_posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`,
    `ALTER TABLE IF EXISTS public.automation_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
    // Add missing post_count on domain_blog_categories to satisfy triggers
    `ALTER TABLE IF EXISTS public.domain_blog_categories ADD COLUMN IF NOT EXISTS post_count INTEGER DEFAULT 0;`,
    // Add missing post_count on domain_blog_posts? (not necessary)
  ];

  try {
    for (const sql of statements) {
      console.log('Executing:', sql);
      const res = await supabase.rpc('exec_sql', { query: sql });
      console.log('Result:', res);
    }
    console.log('✅ Attempted schema fixes via exec_sql RPC.');
  } catch (e) {
    console.error('❌ exec_sql RPC failed or not available:', e?.message || e);
    console.log('\nPlease run the following SQL manually in Supabase SQL editor:\n');
    statements.forEach(s => console.log(s + '\n'));
    process.exit(1);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
