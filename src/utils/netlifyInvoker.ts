// Map Supabase Edge Function names to Netlify Function endpoints

type InvokeResult<T = any> = { data: T | null; error: Error | null; triedUrls?: string[]; chosenUrl?: string | null };
const FUNCTION_MAP: Record<string, string> = {
  // Content generation
  'generate-content-openai': 'automation-generate-openai',
  // Publishing to a specific domain
  'automation-blog': 'automation-publish-post',
  // Single end-to-end campaign publish (rotation-based or generic)
  // Use the domain-aware automation function which inserts into automation_posts
  'automation-post': 'automation-post-background',
  // Payments
  'create-payment': 'create-payment',
  'create-subscription': 'create-subscription',
  'verify-payment': 'verify-payment',
  // Domains
  'domains': 'sync-domains',
  'push-to-host': 'automation-publish-post',
};

async function postJson(path: string, body?: any): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function normalizeOkJson(json: any) {
  // Try to standardize various shapes to a common structure when possible
  return json;
}

export const netlifyInvoker = {
  async invoke<T = any>(name: string, opts?: { body?: any }): Promise<InvokeResult<T>> {
    const mapped = FUNCTION_MAP[name] || name;

    // Resolve configured explicit Netlify functions bases (from env or window) and build candidate list
    const envWindow = (typeof window !== 'undefined') ? (window as any) : {};
    const candidatesRaw: string[] = [];

    // Vite injected envs
    const viteNetlify = ((import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL as string | undefined) || '';
    const viteNetlifyDev = ((import.meta as any)?.env?.VITE_NETLIFY_DEV_FUNCTIONS as string | undefined) || '';
    const viteBase = ((import.meta as any)?.env?.VITE_BASE_URL as string | undefined) || '';

    // Window globals that may be set by hosting environment
    const winNetlify = envWindow?.NETLIFY_FUNCTIONS_URL || envWindow?.VITE_NETLIFY_FUNCTIONS || envWindow?.VITE_NETLIFY_FUNCTIONS_URL || envWindow?.VITE_NETLIFY_DEV_FUNCTIONS || '';

    if (viteNetlify) candidatesRaw.push(viteNetlify);
    if (viteNetlifyDev) candidatesRaw.push(viteNetlifyDev);
    if (viteBase) candidatesRaw.push(viteBase);
    if (winNetlify) candidatesRaw.push(winNetlify as string);

    // Always include canonical same-origin deployed site as a safe fallback
    const fallbackDeployed = 'https://backlinkoo.com/.netlify/functions';
    candidatesRaw.push(fallbackDeployed);

    // Normalize and dedupe
    const normalized = Array.from(new Set(candidatesRaw.filter(Boolean).map(s => String(s).replace(/\/$/, ''))));

    // Prefer same-origin first to avoid CORS and redirects
    const localUrl = `/.netlify/functions/${mapped}`;

    // Filter out obvious cross-origin Netlify subdomain when on custom domain to avoid CORS/301 preflight issues
    const currentHost = (typeof window !== 'undefined' && window.location?.hostname) ? window.location.hostname : '';
    const isOnCustomDomain = currentHost && !/localhost|127\.|::1|netlify\.app$/.test(currentHost);

    const safeBases = normalized.filter(base => {
      try {
        const u = new URL(base.includes('://') ? base : (base.startsWith('/') ? (typeof window !== 'undefined' ? window.location.origin + base : 'https://backlinkoo.com' + base) : `https://${base}`));
        const host = u.hostname;
        // If we're on a custom domain (e.g., backlinkoo.com), avoid hitting *.netlify.app directly
        if (isOnCustomDomain && /netlify\.app$/.test(host)) return false;
        return true;
      } catch {
        return false;
      }
    });

    // Build explicit urls for each candidate
    const explicitUrls: string[] = safeBases.map(base => {
      const hasFunctionsSuffix = /\/\.netlify\/functions\/?$/.test(base);
      return hasFunctionsSuffix ? `${base}/${mapped}` : `${base}/.netlify/functions/${mapped}`;
    });

    // Decide preferred order: try local same-origin first, then explicit candidates
    const attemptFetch = async (tryUrl: string) => {
      try {
        if (process.env.NODE_ENV !== 'production') {
          try { console.debug(`[netlifyInvoker] invoking ${mapped} -> ${tryUrl}`); } catch {}
        }
        const res = await postJson(tryUrl, opts?.body || {});
        // Read body text once to avoid "body stream already read" errors and then parse if JSON
        // Attempt to read body safely. If body has already been consumed elsewhere, skip reading.
        let raw: string | null = null;
        try {
          if (!res.bodyUsed) {
            raw = await res.text();
          } else {
            raw = null;
          }
        } catch (readErr) {
          // Reading failed; we'll proceed without the body
          raw = null;
        }

        if (res.ok) {
          try {
            const data = raw ? JSON.parse(raw) : null;
            return { data: normalizeOkJson(data) as T, error: null };
          } catch (e: any) {
            return { data: (raw as unknown) as T, error: null };
          }
        }

        let message = `HTTP ${res.status}`;
        try {
          const errJson = raw ? JSON.parse(raw) : null;
          message = (errJson && (errJson.error || errJson.message)) || message;
        } catch {
          if (raw) message = `${message}: ${raw}`;
        }
        return { data: null, error: new Error(message) };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    };

    // Build attempt order: local same-origin first, then explicit candidates
    const attemptOrder = [localUrl, ...explicitUrls.filter(u => u !== localUrl)];

    const tried: string[] = [];
    let lastResult: any = null;
    for (const tryUrl of attemptOrder) {
      tried.push(tryUrl);
      const result = await attemptFetch(tryUrl);
      if (!result.error && result.data) return { ...(result as any), triedUrls: tried, chosenUrl: tryUrl } as InvokeResult<T>;
      lastResult = result;
    }

    // include tried URLs in the returned error result for debugging
    const fallback = lastResult || { data: null, error: new Error('Failed to invoke netlify function') };
    return { ...(fallback as any), triedUrls: tried, chosenUrl: null } as InvokeResult<T>;
  }
};
