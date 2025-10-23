(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) { console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
    const email = 'support@backlinkoo.com';
    const url = `${SUPABASE_URL}/rest/v1/profiles?select=user_id,email&email=eq.${encodeURIComponent(email)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY } });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
    process.exit(0);
  } catch (err) { console.error(err); process.exit(2); }
})();
