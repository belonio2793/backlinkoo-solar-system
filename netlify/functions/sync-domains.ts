import { schedule } from '@netlify/functions';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SERVICE_ROLE_KEY || '';

async function runSync() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      status: 500,
      body: { success: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
    };
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/domains`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ action: 'cron_sync' }),
  });

  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  return { ok: res.ok, status: res.status, body: data };
}

export const handler = schedule('*/15 * * * *', async () => {
  try {
    const result = await runSync();
    return {
      statusCode: result.ok ? 200 : result.status || 500,
      body: JSON.stringify(result.body),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: e?.message || String(e) }),
    };
  }
});

// Allow manual trigger for testing without schedule (/.netlify/functions/sync-domains)
export const manual = async () => {
  const result = await runSync();
  return {
    statusCode: result.ok ? 200 : result.status || 500,
    body: JSON.stringify(result.body),
  };
};
