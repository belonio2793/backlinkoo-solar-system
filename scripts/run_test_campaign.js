#!/usr/bin/env node
import('node:process');
import { createClient } from '@supabase/supabase-js';

(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Diagnostic: list columns in automation_campaigns
    try {
      const { data: cols } = await supabase.rpc('exec_sql', { sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'automation_campaigns' AND table_schema = 'public' ORDER BY ordinal_position` }).catch(() => ({ data: null }));
      console.log('automation_campaigns columns (via exec_sql rpc if available):', cols);
    } catch (e) {
      console.warn('Could not list columns via rpc, trying direct query...');
      try {
        const { data: cols2 } = await supabase.from('automation_campaigns').select('*').limit(0);
        console.log('automation_campaigns sample select result columns:', cols2);
      } catch {}
    }

    // Create a random campaign in automation_campaigns
    // Find an existing user to satisfy FK constraint: prefer env override, then domains.user_id
    let userId = process.env.SUPABASE_TEST_USER_ID || null;
    if (!userId) {
      try {
        const { data: domainRow } = await supabase.from('domains').select('user_id').limit(1).maybeSingle();
        if (domainRow && domainRow.user_id) userId = domainRow.user_id;
      } catch (e) {
        // ignore
      }
    }
    if (!userId) {
      try {
        const { data: users } = await supabase.from('auth.users').select('id').limit(1).catch(() => ({ data: null }));
        if (users && users.length) userId = users[0].id;
      } catch {}
    }

    if (!userId) {
      console.error('No user id available via domains or auth.users - set SUPABASE_TEST_USER_ID env to a valid user id');
      process.exit(1);
    }

    const campaignPayload = {
      user_id: userId,
      name: 'Test Campaign ' + Date.now(),
      target_url: 'https://example.com',
      status: 'active'
    };

    console.log('Inserting campaign...', campaignPayload);
    const { data: campaign, error: insertErr } = await supabase.from('automation_campaigns').insert(campaignPayload).select().maybeSingle();
    if (insertErr) {
      console.error('Failed inserting campaign:', insertErr.message || insertErr);
      process.exit(1);
    }
    console.log('Inserted campaign id=', campaign.id);

    // Invoke automation function
    console.log('Invoking automation function for campaign id', campaign.id);

    // If NETLIFY_FUNCTIONS_URL is provided in environment, prefer calling Netlify functions directly
    const netlifyBase = process.env.VITE_NETLIFY_FUNCTIONS_URL || process.env.NETLIFY_FUNCTIONS_URL || process.env.VITE_BASE_URL || '';
    let fnRes = null;

    if (netlifyBase) {
      try {
        const cleanBase = String(netlifyBase).replace(/\/$/, '');
        const functionsUrl = `${cleanBase}/automation`;
        console.log('Calling Netlify function at', functionsUrl);
        const directRes = await fetch(functionsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'automation-post', campaign_id: campaign.id })
        });
        const json = await directRes.json().catch(async () => {
          const t = await directRes.text().catch(() => '');
          try { return JSON.parse(t); } catch { return { success: false, error: t }; }
        });
        fnRes = { data: json, error: null, response: { status: directRes.status, statusText: directRes.statusText } };

        // If remote Netlify site does not have this function deployed (404), try invoking local function file directly
        if (directRes.status === 404) {
          try {
            console.log('Remote Netlify function returned 404 — attempting to invoke local function file netlify/functions/automation.js');
            const mod = await import('../netlify/functions/automation.js');
            const localModule = (mod && (mod.handler || mod.default && mod.default.handler)) ? mod : (mod && mod.default ? mod.default : mod);
            const localHandler = localModule.handler || (localModule.default && localModule.default.handler) || localModule.default || localModule;
            const localEvent = { httpMethod: 'POST', body: JSON.stringify({ action: 'automation-post', campaign_id: campaign.id }), headers: { 'Content-Type': 'application/json' } };
            const localRes = await localHandler(localEvent, {});
            fnRes = { data: (localRes && localRes.body) ? JSON.parse(localRes.body) : localRes, error: null, response: { status: localRes.statusCode || 200 } };
          } catch (localErr) {
            console.warn('Invoking local function failed:', localErr);
          }
        }
      } catch (e) {
        console.warn('Netlify function direct call failed:', e);
        fnRes = { data: null, error: e, response: {} };
      }
    } else {
      try {
        fnRes = await supabase.functions.invoke('automation', {
          body: { action: 'automation-post', campaign_id: campaign.id }
        });
      } catch (e) {
        fnRes = { data: null, error: e, response: {} };
      }
    }

    console.log('Function response:', JSON.stringify(fnRes, null, 2));

    // Also try direct REST call to the Supabase Functions endpoint for more diagnostic info
    try {
      const projectHost = SUPABASE_URL.replace(/^https?:\/\//, '').split('.')[0];
      const functionsHost = `${projectHost}.functions.supabase.co`;
      const functionsUrl = `https://${functionsHost}/automation`;
      console.log('Attempting direct REST call to', functionsUrl);
      const directRes = await fetch(functionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ action: 'automation-post', campaign_id: campaign.id })
      });
      const text = await directRes.text().catch(() => '');
      console.log('Direct REST call status:', directRes.status, 'body:', text.substring(0, 2000));
    } catch (e) {
      console.warn('Direct REST call failed:', e);
    }

    // If function returns results, print summary
    if (fnRes?.data) {
      console.log('Function data keys:', Object.keys(fnRes.data));
    }

    process.exit(0);
  } catch (e) {
    console.error('Error running test campaign:', e);
    process.exit(1);
  }
})();
