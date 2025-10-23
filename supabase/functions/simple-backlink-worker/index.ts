import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders } from '../_cors.ts';

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  // This function is intended to be run with the service role key (server-side worker)
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRole) {
    return new Response(JSON.stringify({ error: 'Service configuration missing' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  try {
    // Find running campaigns
    const { data: campaigns, error: campErr } = await supabase.from('simple_campaigns').select('id, target_url, user_id').eq('status', 'running').limit(20);
    if (campErr) {
      return new Response(JSON.stringify({ error: 'Failed to fetch campaigns', details: campErr }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const results: any[] = [];

    for (const camp of campaigns || []) {
      // For each campaign, pick unprocessed discovered events
      const { data: events, error: evErr } = await supabase.from('simple_campaign_events').select('id, payload, created_at').eq('campaign_id', camp.id).eq('event_type', 'discovered').eq('processed', false).limit(20);
      if (evErr) {
        console.error('fetch events error', evErr);
        continue;
      }

      for (const ev of events || []) {
        let payload = ev.payload;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch { }
        }
        const pageUrl = payload?.page || payload?.url || null;
        if (!pageUrl) {
          // mark processed as malformed
          await supabase.from('simple_campaign_events').update({ processed: true, processed_at: new Date().toISOString(), result: JSON.stringify({ success: false, reason: 'no_page' }) }).eq('id', ev.id);
          results.push({ event: ev.id, success: false, reason: 'no_page' });
          continue;
        }

        // Fetch the discovered page and check if it already contains the target URL (simple verification)
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          const resp = await fetch(pageUrl, { method: 'GET', signal: controller.signal, headers: { 'User-Agent': 'backlinkoo-worker/1.0' } });
          clearTimeout(timeout);
          const text = resp.ok ? await resp.text() : '';

          const found = text && String(text).includes(camp.target_url);

          const resultPayload = { success: !!found, status: resp.status || null, checked_at: new Date().toISOString() };

          // Mark this discovered event as processed and record result
          await supabase.from('simple_campaign_events').update({ processed: true, processed_at: new Date().toISOString(), result: resultPayload }).eq('id', ev.id);

          // Insert a placement result event for campaign history
          await supabase.from('simple_campaign_events').insert([{ campaign_id: camp.id, event_type: 'placement_result', payload: JSON.stringify({ event_id: ev.id, page: pageUrl, result: resultPayload }), created_at: new Date().toISOString() }]).catch(console.error);

          results.push({ event: ev.id, page: pageUrl, success: !!found });
        } catch (e) {
          console.error('worker fetch error', e);
          // Leave unprocessed for retry; optionally record an error event
          await supabase.from('simple_campaign_events').insert([{ campaign_id: camp.id, event_type: 'placement_error', payload: JSON.stringify({ event_id: ev.id, error: String(e) }), created_at: new Date().toISOString() }]).catch(console.error);
          results.push({ event: ev.id, page: pageUrl, success: false, error: String(e) });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results.length, details: results }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('worker error', err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ error: 'Unhandled worker error', details: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
