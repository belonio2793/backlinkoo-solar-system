#!/usr/bin/env node
/*
  Grant credits to a user (by email) in the credits table.
  Usage:
    node scripts/grant-credits.js add support@backlinkoo.com 10000
  If args omitted, defaults to: email=support@backlinkoo.com, amount=10000
  Notes:
    - balance is a generated field; update amount/total_purchased instead.
*/

import { createClient } from '@supabase/supabase-js';

async function main() {
  const args = process.argv.slice(2);
  const action = (args[0] || 'add').toLowerCase();
  const email = (args[1] || 'support@backlinkoo.com').toLowerCase();
  const amountArg = args[2];
  const delta = Number.isFinite(Number(amountArg)) ? Number(amountArg) : 10000;

  if (!['add','set'].includes(action)) {
    console.error('Action must be "add" or "set"');
    process.exit(1);
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_SECRET;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing Supabase envs: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  console.log(`Looking up user by email: ${email}`);
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, email')
    .eq('email', email)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to query profiles:', profileError.message);
    process.exit(1);
  }
  if (!profile) {
    console.error(`No profile found for email: ${email}`);
    process.exit(1);
  }

  const userId = profile.user_id;
  console.log(`User id: ${userId}`);

  const { data: existing, error: creditFetchError } = await supabase
    .from('credits')
    .select('id, amount, total_purchased, total_used, balance')
    .eq('user_id', userId)
    .maybeSingle();

  if (creditFetchError) {
    console.error('Failed to fetch credits:', creditFetchError.message);
    process.exit(1);
  }

  if (existing) {
    const currentAmount = Number(existing.amount || 0);
    const currentPurchased = Number(existing.total_purchased || 0);
    const targetAmount = action === 'add' ? currentAmount + delta : delta;
    const targetPurchased = action === 'add' ? currentPurchased + delta : currentPurchased;

    console.log(`Updating credits amount from ${currentAmount} -> ${targetAmount}`);

    const { error: updErr } = await supabase
      .from('credits')
      .update({ amount: targetAmount, total_purchased: targetPurchased, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (updErr) {
      console.error('Update failed:', updErr.message);
      process.exit(1);
    }
    console.log('✅ Credits updated successfully');
  } else {
    const targetAmount = delta; // for new row
    console.log(`No credits row found. Creating with amount=${targetAmount}`);

    const { error: insErr } = await supabase
      .from('credits')
      .insert({ user_id: userId, amount: targetAmount, total_purchased: targetAmount, total_used: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });

    if (insErr) {
      console.error('Insert failed:', insErr.message);
      process.exit(1);
    }
    console.log('✅ Credits row created successfully');
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e?.message || e);
  process.exit(1);
});
