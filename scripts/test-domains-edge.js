(async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Invoking functions.invoke("netlify-domains", { action: "list" })');
    // First, try GET (list aliases)
    const { data, error } = await supabase.functions.invoke('netlify-domains', { method: 'GET' });
    if (error) {
      console.error('Function invocation error (GET):', error);
      process.exit(2);
    }
    console.log('List returned:', data);

    // Then, attempt POST add for an existing primary domain (safe test)
    console.log('Attempting to POST add backlinkoo.com');
    const { data: addData, error: addError } = await supabase.functions.invoke('netlify-domains', { method: 'POST', body: { domain: 'backlinkoo.com' } });
    if (addError) {
      console.error('Function invocation error (POST):', addError);
      process.exit(2);
    }
    console.log('Add returned:', addData);
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(3);
  }
})();
