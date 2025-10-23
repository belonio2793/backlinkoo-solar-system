(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.VITE_NETLIFY_ACCESS_TOKEN;
    const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || process.env.VITE_NETLIFY_SITE_ID;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
    if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
      console.error('Missing Netlify configuration. Set NETLIFY_ACCESS_TOKEN and NETLIFY_SITE_ID');
      process.exit(1);
    }

    const normalize = (s) => String(s || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    const PRIMARY = 'backlinkoo.com';

    console.log('Fetching domains from Supabase...');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/domains?select=id,domain`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch domains: ${res.status} - ${text}`);
    }

    const rows = await res.json();
    console.log(`Found ${rows.length} domain rows.`);

    const toRemove = rows.filter(r => normalize(r.domain) !== PRIMARY);
    console.log(`Preparing to remove ${toRemove.length} domains (all except ${PRIMARY}).`);

    let removedCount = 0;
    for (const row of toRemove) {
      try {
        const del = await fetch(`${SUPABASE_URL}/rest/v1/domains?id=eq.${encodeURIComponent(row.id)}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=representation'
          }
        });
        if (!del.ok) {
          const t = await del.text();
          console.error(`Failed to delete ${row.domain} (${row.id}): ${del.status} - ${t}`);
        } else {
          removedCount++;
          console.log(`Deleted ${row.domain} (${row.id})`);
        }
      } catch (e) {
        console.error(`Error deleting ${row.domain} (${row.id}):`, e.message || e);
      }
    }

    console.log(`Deleted ${removedCount}/${toRemove.length} domains from Supabase.`);

    // Update Netlify site aliases to keep only primary (and www.primary if present)
    console.log('Fetching Netlify site info...');
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      headers: { 'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}` }
    });
    if (!siteRes.ok) {
      const t = await siteRes.text();
      throw new Error(`Failed to fetch Netlify site: ${siteRes.status} - ${t}`);
    }
    const site = await siteRes.json();
    const aliases = Array.isArray(site.domain_aliases) ? site.domain_aliases : [];
    console.log(`Netlify reported ${aliases.length} domain aliases.`);
    const wanted = aliases.filter(a => {
      const n = normalize(a);
      return n === PRIMARY || n === `www.${PRIMARY}`;
    });

    // Ensure primary is present in wanted (if not, do not add it automatically)
    console.log('Updating Netlify aliases to keep only primary aliases:', wanted);

    const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
      },
      body: JSON.stringify({ domain_aliases: wanted })
    });

    if (!updateRes.ok) {
      const t = await updateRes.text();
      throw new Error(`Failed to update Netlify aliases: ${updateRes.status} - ${t}`);
    }

    const updated = await updateRes.json();
    console.log('Netlify aliases updated. Current aliases count:', (updated.domain_aliases || []).length);

    console.log('Prune operation completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Prune operation failed:', err.message || err);
    process.exit(2);
  }
})();
