/**
 * Utility for handling Netlify function calls gracefully in development
 */

export interface NetlifyFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isLocal?: boolean;
}

import { safeFetch, isFullStoryError, getFullStoryErrorMessage } from './fullstoryWorkaround';

const NETLIFY_FUNCTION_SEGMENT = '/.netlify/functions';

function normalizeFunctionBaseCandidate(candidate: unknown): string | null {
  if (!candidate) return null;
  const trimmed = String(candidate).trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const isRelative = trimmed.startsWith('/');
  const isHttp = /^https?:\/\//.test(trimmed);

  let host = '';
  if (isHttp) {
    try {
      host = new URL(trimmed).hostname || '';
    } catch {
      host = trimmed.replace(/^https?:\/\//, '').split('/')[0];
    }
  }

  const hasFunctionsSegment = lower.includes(NETLIFY_FUNCTION_SEGMENT);
  const isLocalHost = lower.includes('localhost') || lower.includes('127.0.0.1') || lower.includes('::1');
  const isIpHost = host ? /^\d{1,3}(\.\d{1,3}){3}$/.test(host) : false;
  const isNetlifyHost = host ? (host.includes('netlify.app') || host.includes('netlify.com')) : (lower.includes('netlify.app') || lower.includes('netlify.com'));

  if (!isRelative && !isHttp) return null;
  if (!hasFunctionsSegment && !isLocalHost && !isNetlifyHost && !isIpHost) {
    return null;
  }

  let normalized = trimmed.replace(/\/+$/, '');
  if (!normalized.includes(NETLIFY_FUNCTION_SEGMENT)) {
    normalized = `${normalized}${NETLIFY_FUNCTION_SEGMENT}`;
  }
  return normalized;
}

function collectFunctionBaseCandidates(): string[] {
  const env: Record<string, any> = (import.meta as any)?.env || {};
  const w: any = typeof window !== 'undefined' ? window : undefined;

  const rawCandidates: unknown[] = [
    env?.VITE_NETLIFY_FUNCTIONS_URL,
    env?.NETLIFY_FUNCTIONS_URL,
    env?.VITE_NETLIFY_DEV_FUNCTIONS,
    env?.NETLIFY_DEV_FUNCTIONS,
    env?.VITE_NETLIFY_DEV_URL,
    env?.NETLIFY_DEV_URL,
    w?.VITE_NETLIFY_FUNCTIONS_URL,
    w?.NETLIFY_FUNCTIONS_URL,
    w?.VITE_NETLIFY_DEV_FUNCTIONS,
    w?.NETLIFY_DEV_FUNCTIONS,
    w?.VITE_NETLIFY_DEV_URL,
    w?.NETLIFY_DEV_URL,
    w?.ENV?.VITE_NETLIFY_FUNCTIONS_URL,
    w?.ENV?.NETLIFY_FUNCTIONS_URL,
    w?.ENV?.VITE_NETLIFY_DEV_FUNCTIONS,
    w?.ENV?.NETLIFY_DEV_FUNCTIONS,
    env?.VITE_BASE_URL,
    env?.BASE_URL
  ];

  const bases: string[] = [];
  const seen = new Set<string>();

  for (const candidate of rawCandidates) {
    const normalized = normalizeFunctionBaseCandidate(candidate);
    if (!normalized || seen.has(normalized)) continue;
    bases.push(normalized);
    seen.add(normalized);
  }

  return bases;
}

function buildFunctionUrl(base: string, functionPath: string): string {
  const trimmed = String(base || '').trim();
  if (!trimmed) {
    return `${NETLIFY_FUNCTION_SEGMENT}/${functionPath}`;
  }
  const withoutTrailing = trimmed.replace(/\/+$/, '');
  if (withoutTrailing.includes(NETLIFY_FUNCTION_SEGMENT)) {
    return `${withoutTrailing}/${functionPath}`;
  }
  return `${withoutTrailing}${NETLIFY_FUNCTION_SEGMENT}/${functionPath}`;
}

/**
 * Safe fetch wrapper for Netlify functions that handles development mode gracefully
 * - In local dev, if
 *   VITE_NETLIFY_FUNCTIONS_URL/VITE_BASE_URL/BASE_URL is provided, try that first
 *   so we can hit the deployed Functions instead of the missing local proxy.
 */
export async function safeNetlifyFetch<T = any>(
  functionPath: string,
  options?: RequestInit
): Promise<NetlifyFunctionResponse<T>> {
  try {
    const explicitBases = collectFunctionBaseCandidates();
    const onNetlify = isNetlifyEnvironment();

    const bases: string[] = [];
    const pushBase = (value: string) => {
      if (value && !bases.includes(value)) {
        bases.push(value);
      }
    };

    explicitBases.forEach(pushBase);

    const hostname = (typeof window !== 'undefined' && window.location) ? (window.location.hostname || '') : '';
    // Only try production Netlify functions if explicitly allowed
    const allowProd = ((import.meta as any)?.env?.VITE_ALLOW_PROD_FUNCTIONS === 'true');
    if (!onNetlify && allowProd) {
      pushBase('https://backlinkoo.netlify.app/.netlify/functions');
    }

    const isFlyHost = typeof hostname === 'string' && hostname.includes('fly.dev');
    if (!isFlyHost) {
      // Only try relative functions path when not on Fly.dev (which doesn't serve Netlify functions)
      pushBase(NETLIFY_FUNCTION_SEGMENT);
    }

    let lastError: any = null;

    for (const base of bases) {
      try {
        const url = buildFunctionUrl(base, functionPath);
        const response = await safeFetch(url, options);
        if (!response.ok) {
          try { console.debug('[safeNetlifyFetch] Attempt', { url, status: response.status, statusText: response.statusText }); } catch {}
        }

        // Check if response is HTML (likely a 404 page when hitting wrong origin)
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/html')) {
          lastError = new Error('Function not available in this environment');
          continue; // try next base
        }

        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        return { success: true, data };
      } catch (e) {
        lastError = e;
        continue;
      }
    }

    // If we got here, all attempts failed — optionally try server-side forward proxy ONLY when running on Netlify dev
    try {
      const onNetlify = isNetlifyEnvironment();
      const forwardEnabled = (import.meta as any)?.env?.VITE_USE_LOCAL_FORWARD === 'true';
      if (onNetlify || forwardEnabled) {
        const forwardBase = bases.find(base => /^https?:\/\//.test(base)) || '';
        if (forwardBase) {
          const fullUrl = buildFunctionUrl(forwardBase, functionPath);
          try {
            const proxyRes = await safeFetch('/.netlify/functions/forward', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: fullUrl, method: options?.method || 'GET', headers: options?.headers || {}, body: options?.body || null })
            });
            if (proxyRes && proxyRes.ok) {
              const j = await proxyRes.json().catch(() => null);
              if (j && typeof j === 'object' && j.body) {
                try {
                  const parsed = JSON.parse(j.body);
                  return { success: true, data: parsed };
                } catch {
                  return { success: true, data: j.body };
                }
              }
            }
          } catch {
            // Ignore forward failures to avoid console noise outside Netlify dev
          }
        }
      }
    } catch {
      // ignore
    }

    // If we got here, all attempts failed
    const message = (lastError instanceof Error ? lastError.message : String(lastError)) || 'Unknown error';

    // Granular guidance for common local failures
    let guidance = '';
    if (/Network request failed/.test(message) || /unreachable/.test(message)) {
      guidance = ' This often means Netlify Dev is not running, the local functions port is blocked, or CORS headers are missing on the function responses.';
    }

    // If running in development, provide dev-only mock fallbacks for common functions
    const isLocal = !onNetlify;
    try {
      if (import.meta.env.DEV) {
        const MOCK_RESPONSES: Record<string, any> = {
          'api-status': { online: true, message: 'Mocked API status (dev)' },
          'openai-status': { online: true, message: 'Mocked OpenAI status (dev)' },
          'automation-generate-openai': { ok: true, message: 'Mocked generate-openai response (dev)' },
          'automation-publish-post': { ok: true, message: 'Mocked publish-domain-post (dev)' },
          'automation-post': { ok: true, message: 'Mocked automation-post (dev)' },
          'working-campaign-processor': { ok: true, message: 'Mocked working-campaign-processor (dev)' },
          'chatgpt': { ok: true, message: 'Mocked chatgpt (dev)' },
          // Domain management mocks to avoid CORS/Netlify dev issues in local environments
          'domains': { results: [], message: 'Mocked domains list (dev)', ok: true },
          'domains-verify': { results: [], message: 'Mocked domains-verify (dev)', ok: true },
          // domainsNetlify and domainsSupabase mocks help local dev flows for adding domains
          'domainsNetlify': { success: true, data: { message: 'Mocked domainsNetlify (dev)', ok: true } },
          'domainsSupabase': { success: true, data: { success: true, supabase: [] } },
          'automation-cloudflare-kv': { success: true, key: 'example.com', value: 'api.backlinkoo.com' },
          'domainsCloudflare': { success: true, key: 'example.com', value: 'api.backlinkoo.com' },
          // Forward proxy mock simply returns the proxied payload shape when present
          'forward': { ok: true, message: 'Mocked forward proxy (dev)' }
        };
        if ((MOCK_RESPONSES as any)[functionPath]) {
          return { success: true, data: (MOCK_RESPONSES as any)[functionPath], isLocal: true };
        }
      }
    } catch (e) {
      // ignore and fall through to returning the failure
    }

    return { success: false, error: isLocal ? `Development mode: ${message}.${guidance}` : `${message}${guidance}`, isLocal };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if this is FullStory interference
    if (isFullStoryError(error)) {
      return {
        success: false,
        error: getFullStoryErrorMessage('Netlify function call blocked by third-party script'),
        isLocal: true
      };
    }

    return {
      success: false,
      error: errorMessage,
      isLocal: true
    };
  }
}

/**
 * Check if we're running in a Netlify environment
 */
export function isNetlifyEnvironment(): boolean {
  return typeof window !== 'undefined' &&
    (window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('netlify.com') ||
      // Check for Netlify dev mode
      window.location.port === '8888');
}

/**
 * Get appropriate error message for development vs production
 */
export function getEnvironmentErrorMessage(error: string, isLocal?: boolean): string {
  if (isLocal || !isNetlifyEnvironment()) {
    return `Development mode: ${error}. This function requires Netlify deployment or 'npm run dev:netlify'.`;
  }
  return error;
}
