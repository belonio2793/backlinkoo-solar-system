(async function(){
  try {
    const DOMAIN = process.argv[2] || 'kyliecosmetics.org';
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    const FUNC_URL = process.env.FUNC_URL || 'http://localhost:3001/.netlify/functions/automation';

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
      process.exit(1);
    }

    console.log('Fetching domain row for', DOMAIN);
    const domainRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/domains?domain=eq.${encodeURIComponent(DOMAIN)}&select=id,domain,user_id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!domainRes.ok) {
      const t = await domainRes.text().catch(()=>'<no body>');
      console.error('Failed to fetch domain:', domainRes.status, t);
      process.exit(1);
    }
    const domains = await domainRes.json();
    if (!Array.isArray(domains) || domains.length === 0) {
      console.error('Domain not found in Supabase:', DOMAIN);
      process.exit(1);
    }
    const domain = domains[0];
    const domain_id = domain.id;
    const user_id = domain.user_id || null;
    console.log('Found domain id=', domain_id, 'user_id=', user_id);

    const TITLE = 'Test post from automation';
    const KEYWORD = 'The power of leadpages: testing theme post';
    const ANCHOR = 'Backlink';
    const TARGET_URL = 'https://backlinkoo.com';

    console.log('Generating content via local automation function (if available)...');
    let content = '';
    try {
      const genRes = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-content-openai', keyword: KEYWORD, anchorText: ANCHOR, url: TARGET_URL, wordCount: 300 })
      });
      if (genRes.ok) {
        const j = await genRes.json().catch(()=>null);
        if (j && j.content) content = String(j.content);
        if (!content && j && j.body && j.body.content) content = String(j.body.content);
      }
    } catch (e) {
      console.warn('Local generation failed:', e && e.message);
    }

    if (!content) {
      console.log('Using fallback content');
      content = `<article><h1>${TITLE}</h1><p>This is a test post generated for ${DOMAIN} by the automation test. It demonstrates insertion into automation_posts and theme rendering.</p></article>`;
    }

    // slugify
    const slug = String(TITLE).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
    const nowIso = (new Date()).toISOString();

    // Ensure there's an automation campaign to attach this post to
    console.log('Creating a temporary automation campaign for this test post...');
    const autoPayload = {
      user_id: user_id,
      name: `Test automation ${Date.now()}`,
      target_url: TARGET_URL,
      keyword: KEYWORD,
      anchor_text: ANCHOR,
      model: 'gpt-3.5-turbo'
    };
    const createAutoRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(autoPayload)
    });
    const createText = await createAutoRes.text();
    if (!createAutoRes.ok) {
      console.error('Failed to create automation campaign:', createAutoRes.status, createText);
      process.exit(1);
    }
    const createdAuto = JSON.parse(createText);
    const automation_id = createdAuto[0] && createdAuto[0].id ? createdAuto[0].id : (createdAuto.id || null);
    if (!automation_id) {
      console.error('Could not determine automation id from create response:', createText);
      process.exit(1);
    }
    console.log('Created automation id=', automation_id);

    const payload = {
      automation_id: automation_id,
      domain_id,
      user_id,
      title: TITLE,
      content,
      slug,
      status: 'published'
    };

    console.log('Inserting into automation_posts...');
    const insertRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/automation_posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const text = await insertRes.text();
    if (insertRes.status === 201 || insertRes.status === 200) {
      console.log('Post created successfully for', DOMAIN);
      console.log('Slug:', slug);
      console.log('You can view at: https://' + DOMAIN + '/' + encodeURIComponent(slug));
      console.log('Insert response:', text);
      process.exit(0);
    } else {
      console.error('Insert failed:', insertRes.status, text);
      process.exit(1);
    }

  } catch (err) {
    console.error('Unexpected error:', err && err.stack || err);
    process.exit(1);
  }
})();
