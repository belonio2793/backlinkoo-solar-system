#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(url, key);

const campaignId = '50282ae6-72c4-43e3-bfc2-4e2b402d2eac';
const title = 'How Kylie Cosmetics Boosted Soft Glam Looks';
const slugBase = 'kyliecosmetics-soft-glam-' + Math.random().toString(36).slice(2,8);
const postUrl = `https://kyliecosmetics.org/${slugBase}`;
const now = new Date().toISOString();
const content = `<article class="minimal"><h1>${title}</h1><p>This is a sample published post generated for campaign ${campaignId} on kyliecosmetics.org. It demonstrates published content for testing and UI validation.</p><p>Example content generated automatically.</p></article>`;

// Ensure domain exists and get its id
const domainName = 'kyliecosmetics.org';
let domainId = null;
try {
  const { data: domainRows, error: domainErr } = await supabase
    .from('domains')
    .select('id')
    .eq('domain', domainName)
    .limit(1)
    .maybeSingle();

  if (domainErr) throw domainErr;
  if (domainRows && domainRows.id) {
    domainId = domainRows.id;
  } else {
    // Insert domain
    const { data: insDomain, error: insErr } = await supabase
      .from('domains')
      .insert({ domain: domainName, dns_verified: true, netlify_verified: true, user_id: null })
      .select()
      .single();
    if (insErr) throw insErr;
    domainId = insDomain.id;
  }
} catch (dErr) {
  console.error('Domain lookup/insert failed:', dErr?.message || dErr);
  process.exit(4);
}

// Try to get the campaign's user_id
let userId = null;
try {
  const { data: campaignRow, error: campErr } = await supabase
    .from('automation_campaigns')
    .select('user_id')
    .eq('id', campaignId)
    .limit(1)
    .maybeSingle();
  if (campErr) throw campErr;
  if (campaignRow && campaignRow.user_id) {
    userId = campaignRow.user_id;
  } else {
    // Fallback: try to find a user by email or take any user
    const { data: userByEmail, error: userErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'support@backlinkoo.com')
      .limit(1)
      .maybeSingle();
    if (userErr) throw userErr;
    if (userByEmail && userByEmail.id) {
      userId = userByEmail.id;
    } else {
      const { data: anyUser, error: anyUserErr } = await supabase
        .from('users')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (anyUserErr) throw anyUserErr;
      if (anyUser && anyUser.id) userId = anyUser.id;
    }
  }
} catch (uErr) {
  console.error('User lookup (from campaign) failed:', uErr?.message || uErr);
  process.exit(5);
}

const payload = {
  automation_id: campaignId,
  user_id: userId,
  domain_id: domainId,
  slug: slugBase,
  title,
  content,
  status: 'published',
  published_at: now,
  url: postUrl
};

(async () => {
  try {
    console.log('Inserting example published post for campaign', campaignId);
    const { data, error } = await supabase
      .from('automation_posts')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error.message || error);
      process.exit(2);
    }

    console.log('✅ Inserted post id:', data?.id || '(no id returned)');
    console.log('URL:', postUrl);
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error:', e?.message || e);
    process.exit(3);
  }
})();
