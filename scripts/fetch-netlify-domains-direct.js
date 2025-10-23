(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
    const url = `${SUPABASE_URL}/functions/v1/netlify-domains`;
    console.log('POST', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ domains: ['backlinkoo.com'] })
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log(text);
    process.exit(0);
  } catch (err) {
    console.error('Error', err);
    process.exit(2);
  }
})();
