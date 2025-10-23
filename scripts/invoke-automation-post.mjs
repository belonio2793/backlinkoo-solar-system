#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

(async () => {
  const campaignId = process.argv[2] || '50282ae6-72c4-43e3-bfc2-4e2b402d2eac';
  console.log('Invoking automation-post for campaign', campaignId);
  try {
    const res = await supabase.functions.invoke('automation-post', { body: { campaign_id: campaignId } });
    console.log('Function response:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Invocation error:', e);
    process.exit(2);
  }
})();
