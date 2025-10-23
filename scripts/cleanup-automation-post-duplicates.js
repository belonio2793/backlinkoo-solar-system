#!/usr/bin/env node
/*
  Cleanup duplicate automation_posts entries keeping the earliest created row per (automation_id, domain_id).
  Usage:
    node scripts/cleanup-automation-post-duplicates.js           # dry-run
    node scripts/cleanup-automation-post-duplicates.js --apply   # actually delete duplicates

  Requires env:
    SUPABASE_URL (e.g. https://xxx.supabase.co)
    SUPABASE_SERVICE_ROLE_KEY (service role key)

  This script uses the Supabase JS client with the service role key to perform deletions.
*/

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function run() {
  const apply = process.argv.includes('--apply');
  console.log('Connecting to Supabase at', SUPABASE_URL);

  // Fetch all relevant rows (id, automation_id, domain_id, created_at)
  console.log('Fetching automation_posts rows...');
  const batchSize = 10000;
  let offset = 0;
  const allRows = [];

  while (true) {
    const { data, error } = await supabase
      .from('automation_posts')
      .select('id, automation_id, domain_id, created_at')
      .order('created_at', { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error('Failed fetching automation_posts:', error.message || error);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    allRows.push(...data);
    offset += data.length;
    if (data.length < batchSize) break;
  }

  console.log(`Fetched ${allRows.length} automation_posts rows.`);

  // Find duplicates
  const map = new Map(); // key -> { keepId, keepCreatedAt, duplicates: [ids] }
  for (const r of allRows) {
    const aid = String(r.automation_id || '');
    const did = String(r.domain_id || '');
    const key = `${aid}||${did}`;
    const created = r.created_at ? new Date(r.created_at).getTime() : 0;
    if (!map.has(key)) {
      map.set(key, { keepId: r.id, keepCreatedAt: created, duplicates: [] });
    } else {
      const entry = map.get(key);
      // keep earliest by created_at (or lowest id if created_at equal)
      if (created < entry.keepCreatedAt || (created === entry.keepCreatedAt && String(r.id) < String(entry.keepId))) {
        entry.duplicates.push(entry.keepId);
        entry.keepId = r.id;
        entry.keepCreatedAt = created;
      } else {
        entry.duplicates.push(r.id);
      }
    }
  }

  // Collect ids to delete
  const toDelete = [];
  for (const [k, v] of map.entries()) {
    if (v.duplicates && v.duplicates.length) toDelete.push(...v.duplicates);
  }

  console.log(`Found ${toDelete.length} duplicate row(s) across ${map.size} (automation_id,domain_id) groups.`);

  if (toDelete.length === 0) {
    console.log('No duplicates found. Exiting.');
    process.exit(0);
  }

  if (!apply) {
    console.log('Dry run mode. Use --apply to delete duplicates. Sample of IDs to delete (first 200):');
    console.log(toDelete.slice(0, 200).join(', '));
    console.log('\nPreview rows to be deleted:');
    const { data: previewRows } = await supabase.from('automation_posts').select('id, automation_id, domain_id, created_at, url, title').in('id', toDelete.slice(0, 200));
    console.table(previewRows || []);
    process.exit(0);
  }

  console.log('Applying deletions...');
  // Delete in chunks
  const chunkSize = 200;
  for (let i = 0; i < toDelete.length; i += chunkSize) {
    const chunk = toDelete.slice(i, i + chunkSize);
    console.log(`Deleting chunk ${i / chunkSize + 1}: ${chunk.length} rows...`);
    const { error } = await supabase.from('automation_posts').delete().in('id', chunk);
    if (error) {
      console.error('Failed deleting chunk:', error.message || error);
      process.exit(1);
    }
  }

  console.log('Deletion completed successfully. You should now create a unique index to prevent future duplicates:');
  console.log("Run in Supabase SQL editor (not inside a transaction):\nCREATE UNIQUE INDEX CONCURRENTLY ux_automation_posts_automation_domain_idx ON automation_posts (automation_id, domain_id);");
  console.log('Optional: VACUUM ANALYZE automation_posts;');
  process.exit(0);
}

run().catch(err => { console.error('Script failed:', err); process.exit(1); });
