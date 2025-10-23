/* Script: add-css-url-column.js

Run with:
  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/add-css-url-column.js

This will attempt to add a text column css_url to automation_posts if it does not exist.
*/

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars required');
    process.exit(1);
  }

  const sql = `ALTER TABLE IF EXISTS automation_posts ADD COLUMN IF NOT EXISTS css_url text;`;

  const res = await fetch(`${String(url).replace(/\/$/, '')}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ sql }),
  }).catch(err => ({ ok: false, err }));

  console.log('Migration request sent. If your Supabase instance supports SQL RPC endpoint, column should be created.');
}

main().catch(e => { console.error(e); process.exit(1); });
