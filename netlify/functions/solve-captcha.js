// Capsolver proxy - solves common CAPTCHA types via server to bypass browser CORS
// Expects env.CAPSOLVER (Capsolver API key)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders, body: '' };
  const headers = { 'Content-Type': 'application/json', ...corsHeaders };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.CAPSOLVER || process.env.CAPSOLVER_API_KEY || process.env.CAP_SOLVER_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'CAPSOLVER key not configured' }) };
  }

  try {
    const { type, sitekey, url, action, enterprise, invisible, pageAction, pageData } = JSON.parse(event.body || '{}');
    if (!type || !sitekey || !url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: type, sitekey, url' }) };
    }

    const taskTypeMap = {
      recaptcha_v2: 'ReCaptchaV2TaskProxyLess',
      recaptcha_v3: 'ReCaptchaV3TaskProxyLess',
      recaptcha_enterprise: 'ReCaptchaEnterpriseTaskProxyLess',
      hcaptcha: 'HCaptchaTaskProxyLess',
      turnstile: 'TurnstileTaskProxyLess',
      funcaptcha: 'FunCaptchaTaskProxyLess'
    };

    const taskType = taskTypeMap[type];
    if (!taskType) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unsupported captcha type' }) };
    }

    const createPayload = {
      clientKey: apiKey,
      task: {
        type: taskType,
        websiteURL: url,
        websiteKey: sitekey
      }
    };

    if (type === 'recaptcha_v3') {
      createPayload.task.minScore = 0.3;
      if (action || pageAction) createPayload.task.pageAction = action || pageAction;
    }
    if (type === 'recaptcha_v2' && typeof invisible === 'boolean') {
      createPayload.task.isInvisible = invisible;
    }
    if (type === 'recaptcha_enterprise') {
      if (enterprise && enterprise.projectNumber) createPayload.task.enterprisePayload = { projectNumber: enterprise.projectNumber };
      if (action || pageAction) createPayload.task.pageAction = action || pageAction;
    }

    // Create task
    const createRes = await fetch('https://api.capsolver.com/createTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    }).then((r) => r.json());

    if (!createRes || createRes.errorId) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'createTask failed', details: createRes }) };
    }

    const taskId = createRes.taskId;

    // Poll for result
    let token = null;
    for (let i = 0; i < 40; i++) {
      await wait(1500);
      const res = await fetch('https://api.capsolver.com/getTaskResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientKey: apiKey, taskId })
      }).then((r) => r.json());

      if (res && res.status === 'ready') {
        const solution = res.solution || {};
        token = solution.gRecaptchaResponse || solution.token || solution.captchaKey || solution.response || null;
        if (!token && solution.userAgent) token = solution.userAgent; // fallback
        break;
      }
      if (res && res.errorId) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'getTaskResult failed', details: res }) };
      }
    }

    if (!token) {
      return { statusCode: 504, headers, body: JSON.stringify({ error: 'Captcha solve timeout' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ token, taskId }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e && e.message ? e.message : e) }) };
  }
};
