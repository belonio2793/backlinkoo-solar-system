/*
Remove duplicate automation_posts by normalized title or content.
- Scans all rows in batches, grouped per domain_id
- Normalizes title (lowercase, collapse whitespace, strip punctuation)
- Normalizes content by stripping HTML tags to text, collapsing whitespace
- Computes hashes to detect duplicates within the same domain
- Default is DRY RUN (no changes). Pass --apply to modify data.
- Action mode (env or flag):
  --mode=archive  -> set status='archived' on duplicates (default)
  --mode=delete   -> hard-delete duplicates

Environment variables (same convention as other scripts):
- SUPABASE_URL or VITE_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY

Usage examples:
  node scripts/remove-duplicate-automation-posts.mjs           # dry run
  node scripts/remove-duplicate-automation-posts.mjs --apply   # archive duplicates
  node scripts/remove-duplicate-automation-posts.mjs --apply --mode=delete
*/

import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  console.error('Missing Supabase env. Set SUPABASE_URL/VITE_SUPABASE_URL and a key (SERVICE_ROLE or ANON).');
  process.exit(1);
}

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const MODE = (args.find(a => a.startsWith('--mode=')) || '').split('=')[1] || 'archive'; // 'archive' | 'delete'

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' '); }
function collapseWs(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
function normTitle(t) {
  return collapseWs(String(t || '').toLowerCase().replace(/[\p{P}\p{S}]+/gu, ' '));
}
function normContent(html) {
  const txt = stripTags(String(html || ''))
    .replace(/https?:\/\/\S+/g, '') // ignore URLs for content-duplicate detection
    .replace(/\[*\s*\*{0,2}[^\]]+\*{0,2}\]?:?\s*/g, ' '); // drop markdown-like labels
  return collapseWs(txt.toLowerCase());
}
function hash(s) { return crypto.createHash('sha256').update(String(s || '')).digest('hex'); }

async function fetchBatch(offset, limit) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?select=id,domain_id,title,content,slug,status,created_at,published_at&order=created_at.asc&offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Fetch batch failed ${res.status}`);
  return res.json();
}

async function archiveIds(ids) {
  if (!ids.length) return { updated: 0 };
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?id=in.(${ids.map(encodeURIComponent).join(',')})`;
  const body = { status: 'archived', updated_at: new Date().toISOString() };
  const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Archive failed ${res.status} ${await res.text().catch(()=> '')}`);
  const data = await res.json().catch(()=>[]);
  return { updated: Array.isArray(data) ? data.length : ids.length };
}

async function deleteIds(ids) {
  if (!ids.length) return { deleted: 0 };
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts?id=in.(${ids.map(encodeURIComponent).join(',')})`;
  const res = await fetch(url, { method: 'DELETE', headers });
  if (!res.ok) throw new Error(`Delete failed ${res.status} ${await res.text().catch(()=> '')}`);
  return { deleted: ids.length };
}

function pickKeeper(a, b) {
  // Prefer published over non-published, then earliest published_at/created_at
  const rank = r => ({
    published: String(r.status || '').toLowerCase() === 'published' ? 1 : 0,
    when: Date.parse(r.published_at || r.created_at || 0) || 0
  });
  const ra = rank(a), rb = rank(b);
  if (ra.published !== rb.published) return ra.published > rb.published ? a : b;
  if (ra.when !== rb.when) return ra.when <= rb.when ? a : b;
  return a; // stable
}

async function run() {
  console.log(`Starting duplicate scan (mode=${MODE}, apply=${APPLY})...`);
  const pageSize = 500;
  let offset = 0; let batch = 0;
  const dupByTitle = []; // {domain_id, titleKey, keepId, dropIds[]}
  const dupByContent = []; // {domain_id, contentKey, keepId, dropIds[]}

  // Per-domain maps
  const seenTitle = new Map(); // key: `${domain_id}:${titleHash}` -> row
  const seenContent = new Map(); // key: `${domain_id}:${contentHash}` -> row

  while (true) {
    batch++;
    const rows = await fetchBatch(offset, pageSize);
    if (!rows.length) break;

    for (const r of rows) {
      const tKey = `${r.domain_id}:${hash(normTitle(r.title))}`;
      const cKey = `${r.domain_id}:${hash(normContent(r.content))}`;

      // Title duplicates
      if (!seenTitle.has(tKey)) {
        seenTitle.set(tKey, r);
      } else {
        const keep = pickKeeper(seenTitle.get(tKey), r);
        const drop = keep === r ? seenTitle.get(tKey) : r;
        seenTitle.set(tKey, keep);
        const group = dupByTitle.find(g => g.domain_id === r.domain_id && g.titleKey === tKey);
        if (group) { group.dropIds.push(drop.id); group.keepId = keep.id; }
        else { dupByTitle.push({ domain_id: r.domain_id, titleKey: tKey, keepId: keep.id, dropIds: [drop.id] }); }
      }

      // Content duplicates
      if (!seenContent.has(cKey)) {
        seenContent.set(cKey, r);
      } else {
        const keep = pickKeeper(seenContent.get(cKey), r);
        const drop = keep === r ? seenContent.get(cKey) : r;
        seenContent.set(cKey, keep);
        const group = dupByContent.find(g => g.domain_id === r.domain_id && g.contentKey === cKey);
        if (group) { group.dropIds.push(drop.id); group.keepId = keep.id; }
        else { dupByContent.push({ domain_id: r.domain_id, contentKey: cKey, keepId: keep.id, dropIds: [drop.id] }); }
      }
    }

    console.log(`Scanned batch ${batch} (${rows.length} rows)`);
    offset += pageSize;
  }

  // Build final drop list (union of duplicates by title and content)
  const dropSet = new Set();
  dupByTitle.forEach(g => g.dropIds.forEach(id => dropSet.add(id)));
  dupByContent.forEach(g => g.dropIds.forEach(id => dropSet.add(id)));

  const dropIds = Array.from(dropSet);
  console.log(`\nSummary:`);
  console.log(`  Title duplicate groups: ${dupByTitle.length}`);
  console.log(`  Content duplicate groups: ${dupByContent.length}`);
  console.log(`  Total duplicate rows to remove: ${dropIds.length}`);

  if (!APPLY || dropIds.length === 0) {
    console.log('Dry run complete. Use --apply to modify data.');
    return;
  }

  const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i*size, (i+1)*size));
  const chunks = chunk(dropIds, 200);
  let total = 0;
  for (let i = 0; i < chunks.length; i++) {
    const ids = chunks[i];
    if (MODE === 'delete') {
      const { deleted } = await deleteIds(ids);
      total += deleted;
      console.log(`Deleted ${deleted} rows (chunk ${i+1}/${chunks.length})`);
    } else {
      const { updated } = await archiveIds(ids);
      total += updated;
      console.log(`Archived ${updated} rows (chunk ${i+1}/${chunks.length})`);
    }
  }

  console.log(`Done. ${MODE === 'delete' ? 'Deleted' : 'Archived'} ${total} duplicate rows.`);
}

run().catch(err => { console.error('Duplicate removal failed:', err); process.exit(1); });
