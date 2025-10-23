#!/usr/bin/env node
// Invoke Supabase edge function (domains) using anon key to sync/list Netlify aliases
const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !ANON_KEY) {
      console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      process.exit(1);
    }
    const functionUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/domains`;

    const call = async (body) => {
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`
        },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
      return { status: res.status, ok: res.ok, data: json };
    };

    console.log('🔍 Listing aliases via edge function...');
    const listRes = await call({ action: 'list' });
    console.log('LIST STATUS:', listRes.status, listRes.ok);
    console.log(JSON.stringify(listRes.data, null, 2));

    console.log('\n🔄 Syncing aliases via edge function...');
    const syncRes = await call({ action: 'sync' });
    console.log('SYNC STATUS:', syncRes.status, syncRes.ok);
    console.log(JSON.stringify(syncRes.data, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error', err?.message || err);
    process.exit(2);
  }
})();
