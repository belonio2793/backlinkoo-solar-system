(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_SECRET;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      process.exit(2);
    }

    const url = SUPABASE_URL.replace(/\/$/, '') + '/functions/v1/netlify-domains-proxy';
    console.log('POST', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SERVICE_KEY
      },
      body: JSON.stringify({ action: 'add', domains: ['test-supabase-proxy.example.com'] })
    });

    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
  } catch (err) {
    console.error('error:', err.message || err);
    process.exit(2);
  }
})();
