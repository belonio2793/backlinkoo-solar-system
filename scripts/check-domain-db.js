(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !ANON_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
      process.exit(1);
    }
    const domain = 'backlinkoo.com';
    const url = `${SUPABASE_URL}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}&select=*`;
    const res = await fetch(url, { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } });
    console.log('STATUS', res.status);
    const text = await res.text();
    console.log(text);
    process.exit(0);
  } catch (err) { console.error(err); process.exit(2); }
})();
