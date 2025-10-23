import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error('Missing env'); process.exit(1); }
const client = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

(async ()=>{
  const domain = process.argv[2] || 'leadpages.org';
  const title = process.argv[3] || 'Test campaign post';
  const content = process.argv[4] || '<p>Test content</p>';
  try {
    const { data: domainRow, error: dErr } = await client.from('domains').select('id,domain,user_id').eq('domain', domain).maybeSingle();
    if (dErr) { console.error('domain lookup error', dErr); process.exit(1); }
    if (!domainRow) { console.error('Domain not found'); process.exit(1); }
    const userId = domainRow.user_id || null;
    if (!userId) { console.error('Domain has no user_id; cannot create campaign'); process.exit(1); }
    const camp = { user_id: userId, name: `auto-campaign-${Date.now()}`, target_url: '/', status: 'draft' };
    const { data: created, error: cErr } = await client.from('automation_campaigns').insert(camp).select('id').maybeSingle();
    if (cErr) { console.error('Failed to create campaign', cErr); process.exit(1); }
    console.log('Created campaign id:', created?.id);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,120);
    const insert = await client.from('automation_posts').insert({ automation_id: created.id, domain_id: domainRow.id, user_id: userId, slug, title, content, status: 'published' }).select('id').maybeSingle();
    if (insert.error) { console.error('Insert automation_posts failed:', insert.error); process.exit(1); }
    console.log('Inserted automation_posts id:', insert.data?.id);
  } catch (e) {
    console.error('Exception:', e);
    process.exit(1);
  }
})();
