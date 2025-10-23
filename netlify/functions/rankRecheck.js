const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let admin = null;
function getAdminClient() {
  if (admin) return admin;
  if (!SERVICE_KEY || !SUPABASE_URL) return null;
  admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  return admin;
}

async function getUserFromHeader(adminClient, headers) {
  const authHeader = headers.authorization || headers.Authorization || '';
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  try {
    const { data, error } = await adminClient.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch (e) {
    console.error('auth.getUser error', e);
    return null;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const job_id = String(body.job_id || '').trim();
    if (!job_id) return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'job_id required' }) };

    const adminClient = getAdminClient();
    if (!adminClient) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Server not configured' }) };

    const user = await getUserFromHeader(adminClient, event.headers || {});
    if (!user) return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Unauthorized' }) };

    // verify ownership
    const { data: job, error: jerr } = await adminClient.from('rank_jobs').select('*').eq('id', job_id).maybeSingle();
    if (jerr || !job) return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Job not found' }) };
    if (job.user_id !== user.id) return { statusCode: 403, headers, body: JSON.stringify({ success: false, error: 'Forbidden' }) };

    // call rank-tracker-worker function internally via HTTP using service role (since this function runs with service role it can call worker directly)
    const workerUrl = `${process.env.SUPABASE_URL.replace(/^https?:\/\//, 'https://')}/functions/v1/rank-tracker-worker`;
    try {
      const res = await fetch(workerUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job_id }) });
      const text = await res.text();
      return { statusCode: res.status, headers, body: text };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: String(e) }) };
    }

  } catch (err) {
    console.error('rankRecheck error', err?.stack || err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Internal error' }) };
  }
};
