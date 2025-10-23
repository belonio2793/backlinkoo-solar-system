// Netlify Function: automation (proxy)
// Delegates to automation-post to avoid duplicate logic and conflicts

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'automation proxy OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Only supported action is automation-post; also support direct campaign invocation without action
    if (payload.action && payload.action !== 'automation-post' && payload.action !== 'automation_post') {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Unsupported action' }) };
    }

    // Strip action when forwarding
    const forwardBody = JSON.stringify({ ...payload, action: undefined });
    const forwardEvent = { ...event, body: forwardBody };

    try {
      const base = (process.env.URL || '').replace(/\/$/, '') || '';
      const path = `${base}/.netlify/functions/automation-post-background`;
      await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: forwardBody });
    } catch {}
    return { statusCode: 202, headers, body: JSON.stringify({ success: true, message: 'automation queued' }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message || 'Internal error' }) };
  }
};
