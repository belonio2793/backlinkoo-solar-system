/**
 * FullStory Interference Workaround Utilities
 * 
 * FullStory can interfere with fetch requests by modifying the window.fetch function.
 * This module provides utilities to detect and work around such interference.
 */

/**
 * Detect if FullStory is present and potentially interfering
 */
export function isFullStoryPresent(): boolean {
  if (typeof window === 'undefined') return false;

  // Be STRICT: only consider explicit FullStory globals or script URLs.
  // Do NOT inspect window.fetch contents to avoid false positives.
  try {
    const hasGlobal = !!((window as any).FS || (window as any)._fs);
    if (hasGlobal) return true;
    const hasScript = !!(
      document.querySelector('script[src*="fullstory"]') ||
      document.querySelector('script[src*="edge.fullstory.com"]')
    );
    return hasScript;
  } catch {
    return false;
  }
}

/**
 * Detect if fetch has been modified by third-party scripts (development helper)
 */
function isLikelyThirdPartyFetchInterference(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const fetchStr = window.fetch.toString();

    // Native fetch usually contains specific browser signatures
    const nativePatterns = ['[native code]', 'function fetch()'];
    const isNative = nativePatterns.some(pattern => fetchStr.includes(pattern));

    if (isNative) return false;

    // If it's not native and very short, it's likely been wrapped
    if (fetchStr.length < 100) {
      console.warn('🔍 Fetch appears to be wrapped by third-party script (length:', fetchStr.length, ')');
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Check if an error is likely caused by FullStory interference
 */
export function isFullStoryError(error: any): boolean {
  if (!error) return false;

  const message = error.message || '';
  const stack = error.stack || '';

  // Only consider it a FullStory error if there's explicit evidence
  return stack.includes('fullstory') ||
         stack.includes('fs.js') ||
         stack.includes('edge.fullstory.com') ||
         // Vite client specific patterns when FullStory interferes (very specific)
         (message.includes('Failed to fetch') &&
          stack.includes('@vite/client') &&
          stack.includes('connectWebSocket') &&
          (stack.includes('/@vite/client') || stack.includes('/__vite_ping')));
}

/**
 * Create a fetch function that bypasses FullStory interference
 */
export function createBypassFetch(): typeof fetch {
  // Try to get the original fetch before FullStory modified it
  const originalFetch = (globalThis as any).__originalFetch__ ||
                       (window as any).__originalFetch__;

  // If we have an unmodified original fetch and FullStory isn't interfering badly, try it first
  if (originalFetch && !isFullStoryPresent()) {
    return originalFetch;
  }

  console.log('🔧 Creating FullStory bypass fetch using XMLHttpRequest');

  // Create XMLHttpRequest-based fetch replacement
  return async function bypassFetch(url: string | URL, init?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const urlString = url.toString();
      const method = init?.method || 'GET';

      try {
        xhr.open(method, urlString);

        // Don't send credentials by default to avoid CORS failures unless explicitly requested
        xhr.withCredentials = !!(init && (init as any).credentials === 'include');

        // Set headers safely
        if (init?.headers) {
          try {
            const headers = new Headers(init.headers);
            headers.forEach((value, key) => {
              // Skip headers that XMLHttpRequest handles automatically
              if (!['host', 'user-agent', 'content-length'].includes(key.toLowerCase())) {
                try {
                  xhr.setRequestHeader(key, value);
                } catch (hErr) {
                  // Some headers are forbidden by XHR; ignore failures
                }
              }
            });
          } catch (headerError) {
            console.warn('Failed to set request headers:', headerError);
          }
        }

        // Handle response
        xhr.onload = () => {
          try {
            // Parse response headers safely
            const headers = new Headers();
            try {
              const responseHeaders = xhr.getAllResponseHeaders();
              if (responseHeaders) {
                responseHeaders
                  .split('\r\n')
                  .forEach(line => {
                    const colonIndex = line.indexOf(': ');
                    if (colonIndex > 0) {
                      const key = line.substring(0, colonIndex).toLowerCase();
                      const value = line.substring(colonIndex + 2);
                      if (key && value) {
                        // Normalize common CORS headers
                        headers.set(key, value);
                      }
                    }
                  });
              }
            } catch (headerError) {
              console.warn('Failed to parse response headers:', headerError);
            }

            // Handle different response types
            let responseBody = null;
            if (xhr.status !== 204 && xhr.status !== 205 && xhr.status !== 304) {
              responseBody = xhr.responseText;
            }

            // Create Response object
            const response = new Response(responseBody, {
              status: xhr.status || 200,
              statusText: xhr.statusText || 'OK',
              headers
            });

            resolve(response);
          } catch (responseError) {
            reject(new Error(`Failed to create response: ${responseError}`));
          }
        };

        xhr.onerror = (e:any) => {
          // Provide richer message for debugging
          const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
          const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
          const targetHost = (urlString || '').replace(/https?:\/\//, '').split('/')[0];
          const err = new Error(
            `Network request failed for ${urlString}. origin=${origin} target=${targetHost} online=${online}. This can be caused by: missing CORS headers (Access-Control-Allow-Origin), Netlify Dev not running on the target port, or third-party script interference.`
          );
          (err as any).originalEvent = e;
          reject(err);
        };

        xhr.ontimeout = () => {
          reject(new Error(`Request timeout for ${urlString} (exceeded 30 seconds).`));
        };

        xhr.onabort = () => {
          reject(new Error(`Request aborted for ${urlString}`));
        };

        // Set timeout
        xhr.timeout = 30000;

        // Send request (stringify body when it's an object)
        const bodyToSend = (init && init.body && typeof init.body !== 'string') ? JSON.stringify(init.body) : init?.body;
        try {
          xhr.send(bodyToSend as any);
        } catch (sendErr) {
          reject(new Error(`XHR send failed: ${sendErr}`));
        }

      } catch (setupError) {
        reject(new Error(`Failed to setup request: ${setupError}`));
      }
    });
  };
}

/**
 * Enhanced error message for FullStory interference
 */
export function getFullStoryErrorMessage(originalError: string): string {
  if (isFullStoryPresent()) {
    return `${originalError} (FullStory interference detected - using fallback method)`;
  }
  return originalError;
}

/**
 * Store original fetch before any third-party modifications
 */
export function preserveOriginalFetch(): void {
  if (typeof window !== 'undefined') {
    // Store original fetch if not already stored
    if (!(globalThis as any).__originalFetch__) {
      (globalThis as any).__originalFetch__ = window.fetch.bind(window);
    }

    // Also store it in window for fallback access
    if (!(window as any).__originalFetch__) {
      (window as any).__originalFetch__ = window.fetch.bind(window);
    }

    // Store the original XMLHttpRequest as well in case we need it
    if (!(globalThis as any).__originalXHR__) {
      (globalThis as any).__originalXHR__ = window.XMLHttpRequest;
    }
  }
}

/**
 * Safe wrapper for any fetch request that automatically handles FullStory interference
 */
export async function safeFetch(url: string | URL, init?: RequestInit): Promise<Response> {
  try {
    // Try normal fetch first
    return await window.fetch(url, init);
  } catch (error) {
    // Use bypass if FullStory is likely or fetch is clearly wrapped
    const shouldBypass = (isFullStoryError(error) && isFullStoryPresent()) || isLikelyThirdPartyFetchInterference();
    if (shouldBypass) {
      console.log('🔄 Fetch appears compromised - attempting safer fallbacks for:', String(url));

      // First try preserved original fetch (if any)
      try {
        const orig = (globalThis as any).__originalFetch__ || (window as any).__originalFetch__;
        if (orig && typeof orig === 'function') {
          try {
            const res = await orig(url, init);
            return res;
          } catch (origErr) {
            console.warn('Preserved original fetch failed:', origErr);
          }
        }
      } catch (e) {}

      // Next, try XHR bypass
      try {
        const bypassFetch = createBypassFetch();
        return await bypassFetch(url, init);
      } catch (bypassError) {
        console.error('❌ Bypass fetch failed:', bypassError);

        // If this was a Supabase functions URL, try server-side proxy to avoid CORS/interference
        try {
          const supabaseHost = ((import.meta as any).env?.VITE_SUPABASE_URL || '').replace(/https?:\/\//, '').replace(/\/$/, '');
          const targetHost = (typeof url === 'string' ? url : url.toString()).replace(/https?:\/\//, '').split('/')[0];
          // Normalize detection: account for project.functions.supabase.co and project.supabase.co variants
          const supabaseProject = supabaseHost ? supabaseHost.split('.')[0] : '';
          const isSameSupabaseHost = supabaseHost && targetHost && (
            targetHost === supabaseHost ||
            targetHost.includes(`.${supabaseHost}`) ||
            (supabaseProject && targetHost.includes(supabaseProject) && targetHost.includes('.supabase.co'))
          );
          if (isSameSupabaseHost) {
            console.log('➡️ Attempting server-side proxy for Supabase URL via /.netlify/functions/supabase-proxy');
            try {
              // Ensure headers are plain object serializable
              const headersObj: Record<string,string> = {};
              try {
                if (init?.headers) {
                  const h = new Headers(init.headers as any);
                  h.forEach((v: string, k: string) => { headersObj[k] = v; });
                }
              } catch (hErr) {
                // ignore header normalization errors
              }

              const proxyRes = await window.fetch('/.netlify/functions/supabase-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.toString(), method: init?.method || 'GET', headers: headersObj, body: init?.body || null })
              });
              if (proxyRes.ok) {
                const j = await proxyRes.json();
                // Reconstruct Response
                const resp = new Response(j.body || '', { status: j.status || 200, statusText: j.statusText || '', headers: j.headers || {} });
                return resp;
              }
            } catch (proxyErrInner) {
              console.warn('Supabase proxy fetch failed:', proxyErrInner);
            }
          }
        } catch (proxyError) {
          console.warn('Supabase proxy attempt failed:', proxyError);
        }

        // Final fallback: throw a detailed NetworkInterferenceError with both errors attached
        const contextualError = new Error(
          `Network request failed after multiple fallbacks. Original error: ${(error as any)?.message}. Bypass error: ${(bypassError as any)?.message}`
        );
        (contextualError as any).original = error;
        (contextualError as any).bypass = bypassError;
        contextualError.name = 'NetworkInterferenceError';
        throw contextualError;
      }
    }

    // Re-throw the original error for most cases
    throw error;
  }
}

// Text fetch via pure XHR to avoid Response body reuse issues
export async function fetchTextByXHR(url: string, init?: RequestInit): Promise<{ status: number; ok: boolean; statusText: string; text: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    try {
      xhr.open((init?.method || 'GET').toUpperCase(), url);
      // headers
      if (init?.headers) {
        try {
          const headers = new Headers(init.headers as any);
          headers.forEach((v, k) => {
            if (!['host','user-agent','content-length'].includes(k.toLowerCase())) xhr.setRequestHeader(k, v);
          });
        } catch {}
      }
      xhr.onload = () => {
        resolve({ status: xhr.status, ok: xhr.status >= 200 && xhr.status < 300, statusText: xhr.statusText || 'OK', text: xhr.responseText || '' });
      };
      xhr.onerror = () => reject(new Error('XHR network error'));
      xhr.ontimeout = () => reject(new Error('XHR timeout'));
      xhr.timeout = 30000;
      xhr.send(init?.body as any);
    } catch (e) {
      reject(e);
    }
  });
}

// Initialize on module load
if (typeof window !== 'undefined') {
  preserveOriginalFetch();
}
