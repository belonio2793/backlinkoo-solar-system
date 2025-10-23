import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders } from '../_cors.ts';

function normalizeUrl(u: string) {
  try { return new URL(u).toString(); } catch { try { return new URL('https://' + u).toString(); } catch { return u; } }
}

function computeRankFromIndex(index: number) {
  const page = Math.floor(index / 10) + 1;
  const position = (index % 10) + 1;
  const rank = index + 1;
  return { page, position, rank };
}

async function fetchGoogleSERP(keyword: string) {
  const q = encodeURIComponent(keyword);
  const url = `https://www.google.com/search?q=${q}&num=100`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal, headers: { 'User-Agent': 'backlinkoo-rank-worker/1.0' } });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, status: res.status };
    const text = await res.text();
    return { ok: true, text };
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, error: String(e) };
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const cors = getCorsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRole) {
    return new Response(JSON.stringify({ error: 'Missing supabase config' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  try {
    const raw = await req.text();
    let body: { job_id?: string } = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch {}

    // Select candidate jobs: either single job_id, or jobs active and not run recently
    if (body.job_id) {
      const { data: jobs } = await supabase.from('rank_jobs').select('*').eq('id', body.job_id).limit(1);
      if (!jobs || jobs.length === 0) return new Response(JSON.stringify({ error: 'job not found' }), { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } });
      await processJobs(supabase, jobs);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // regular run: find jobs where status='active' and (last_run_at is null or older than 14 minutes)
    const { data: candidates, error } = await supabase.rpc('pg_sleep', { seconds: 0 }).then(() => supabase.from('rank_jobs').select('*').eq('status', 'active').or('last_run_at.is.null,last_run_at.lt.now() - interval \"14 minutes\"').limit(50));
    // Note: not all Supabase installations accept the or() clause above; fallback to simple query
    let jobs = candidates || [];
    if (error) {
      const { data: fallback } = await supabase.from('rank_jobs').select('*').eq('status', 'active').order('last_run_at', { ascending: true }).limit(50);
      jobs = fallback || [];
    }

    await processJobs(supabase, jobs);

    return new Response(JSON.stringify({ success: true, processed: jobs.length }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('rank-worker error', err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ error: 'Unhandled error', details: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});

async function processJobs(supabase: any, jobs: any[]) {
  for (const job of jobs || []) {
    try {
      // Mark last_run_at immediately to avoid duplicates
      await supabase.from('rank_jobs').update({ last_run_at: new Date().toISOString() }).eq('id', job.id);

      const serp = await fetchGoogleSERP(job.keyword);
      if (!serp.ok) {
        await supabase.from('rank_results').insert([{ job_id: job.id, run_at: new Date().toISOString(), raw_response: JSON.stringify({ error: serp.error || serp.status }) }]);
        continue;
      }

      // extract links from SERP
      const hrefRe = /href\s*=\s*(?:\"|\')([^\"\']+)(?:\"|\')/gi;
      let m;
      const links: string[] = [];
      while ((m = hrefRe.exec(serp.text)) !== null) {
        try {
          const candidate = new URL(m[1], 'https://www.google.com').toString();
          links.push(candidate);
        } catch { }
        if (links.length >= 100) break;
      }

      // find first occurrence where hostname matches job.url hostname
      let foundIndex = -1;
      const targetHost = (() => { try { return new URL(job.url).hostname.replace(/^www\./, ''); } catch { return job.url.replace(/^https?:\/\//, '').replace(/^www\./, '') } })();
      for (let i = 0; i < links.length; i++) {
        try {
          const h = new URL(links[i]).hostname.replace(/^www\./, '');
          if (h === targetHost) { foundIndex = i; break; }
        } catch { }
      }

      if (foundIndex === -1) {
        // not found within top results
        await supabase.from('rank_results').insert([{ job_id: job.id, run_at: new Date().toISOString(), page: null, position: null, rank: null, raw_response: JSON.stringify({ checked: links.length }) }]);
        continue;
      }

      const { page, position, rank } = computeRankFromIndex(foundIndex);
      await supabase.from('rank_results').insert([{ job_id: job.id, run_at: new Date().toISOString(), page, position, rank, raw_response: JSON.stringify({ found_at_index: foundIndex }) }]);

    } catch (e) {
      console.error('process job error', e);
    }
  }
}
