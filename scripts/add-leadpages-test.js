(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    const domain = 'leadpages.org';
    console.log('Adding domain via netlify-domains edge function:', domain);

    const addRes = await fetch(`${SUPABASE_URL}/functions/v1/netlify-domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ domains: [domain] })
    });

    console.log('Add status', addRes.status);
    const addText = await addRes.text();
    console.log('Add response:', addText);

    if (!addRes.ok) {
      throw new Error(`Add failed: ${addRes.status} - ${addText}`);
    }

    // Poll validation via the edge function (POST validate)
    console.log('Polling for validation (up to 60s)...');
    const start = Date.now();
    let validated = false;
    let validationResp = null;
    while (Date.now() - start < 60000) {
      const vRes = await fetch(`${SUPABASE_URL}/functions/v1/netlify-domains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({ domains: [domain], _validate: true })
      });
      const txt = await vRes.text();
      try { validationResp = JSON.parse(txt); } catch { validationResp = txt; }
      if (vRes.ok) {
        // heuristic: if returned object contains validated or success or validation
        if (typeof validationResp === 'object' && (validationResp.validated === true || (validationResp.validation && validationResp.validation.validation_status === 'valid') || validationResp.success)) {
          validated = true;
          console.log('Validation response:', JSON.stringify(validationResp));
          break;
        }
      }
      // wait
      await new Promise(r => setTimeout(r, 3000));
    }

    if (!validated) {
      console.warn('Domain added but not validated within timeout. You may need to retry later. Validation response:', validationResp);
    }

    // Check Supabase DB for domain row
    console.log('Checking Supabase domains table for row...');
    const restUrl = `${SUPABASE_URL}/rest/v1/domains?domain=eq.${encodeURIComponent(domain)}&select=*`;
    const dbRes = await fetch(restUrl, {
      headers: {
        apikey: ANON_KEY || '',
        Authorization: `Bearer ${SERVICE_KEY}`
      }
    });
    const dbText = await dbRes.text();
    console.log('DB query status', dbRes.status);
    console.log('DB rows:', dbText);

    let rows = [];
    try { rows = JSON.parse(dbText || '[]'); } catch { rows = []; }
    if (rows.length === 0) {
      console.log('No DB row found — determining admin user_id to insert under');
      // Fetch admin user id from profiles
      const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=user_id,email&email=eq.${encodeURIComponent('support@backlinkoo.com')}`, {
        headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: ANON_KEY || '' }
      });
      const profileText = await profileRes.text();
      let adminId = null;
      try {
        const parsed = JSON.parse(profileText || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) adminId = parsed[0].user_id;
      } catch {}

      if (!adminId) {
        console.error('Could not determine admin user_id - aborting insert to satisfy FK');
      } else {
        console.log('Inserting domain row under admin user:', adminId);
        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/domains`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            'apikey': ANON_KEY || '',
            'Authorization': `Bearer ${SERVICE_KEY}`
          },
          body: JSON.stringify([{ domain: domain, user_id: adminId, status: 'active', netlify_verified: true, dns_verified: true, custom_domain: true, ssl_status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        });
        console.log('Insert status', insertRes.status);
        const insertText = await insertRes.text();
        console.log('Insert response:', insertText);
      }
    } else {
      console.log('DB row already present.');
    }

    process.exit(0);

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message || err);
    process.exit(2);
  }
})();
