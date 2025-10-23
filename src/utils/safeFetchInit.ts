import { preserveOriginalFetch, createBypassFetch, isFullStoryPresent } from './fullstoryWorkaround';

// Initialize early to protect Vite client and critical requests from FullStory or other wrappers
export function initSafeFetch() {
  if (typeof window === 'undefined') return;

  try {
    // Preserve original fetch reference
    preserveOriginalFetch();

    const originalFetch = (globalThis as any).__originalFetch__ || window.fetch.bind(window);

    // Install protective wrapper only once
    if ((window as any).__SAFE_FETCH_INSTALLED__) return;
    (window as any).__SAFE_FETCH_INSTALLED__ = true;

    const safeFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      let url = typeof input === 'string' ? input : (input as URL).toString();

      // If this is a Netlify function request, resolve to a reachable host depending on environment
      try {
        const fnPrefix = '/.netlify/functions/';
        const hasFn = String(url).includes(fnPrefix);
        if (hasFn) {
          // Extract function path after the prefix
          const idx = String(url).indexOf(fnPrefix);
          const fnPath = String(url).slice(idx + fnPrefix.length);

          // Resolve configured explicit Netlify functions base (from env or global)
          const w: any = (typeof window !== 'undefined') ? window : {};
          const explicitRaw = ((import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL as string | undefined)
            || w?.NETLIFY_FUNCTIONS_URL || ((import.meta as any)?.env?.VITE_BASE_URL as string | undefined) || '';
          const explicitBase = explicitRaw ? String(explicitRaw).replace(/\/$/, '') : '';

          const devLocalRaw = ((import.meta as any)?.env?.VITE_NETLIFY_DEV_URL as string | undefined) || '';
          const devLocal = devLocalRaw ? String(devLocalRaw).replace(/\/$/, '') : '';

          const isDev = ((import.meta as any)?.env?.MODE !== 'production');
          const hostname = (typeof window !== 'undefined' && (window as any).location && (window as any).location.hostname) ? (window as any).location.hostname : '';

          // Prefer explicit deployed functions URL when running against production origin
          let resolved = '';

          if (isDev) {
            // If running on localhost or preview hosts (like fly.dev) prefer local dev Netlify functions host
            const runningLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
            const runningPreview = hostname.includes('fly.dev') || hostname.includes('vercel') || hostname.includes('preview');
            if (runningLocal || runningPreview) {
              if (devLocal) {
                resolved = `${devLocal}${fnPrefix}${fnPath}`;
              } else if (explicitBase) {
                const hasFuncs = /\/\.netlify\/functions\/?$/.test(explicitBase);
                resolved = hasFuncs ? `${explicitBase}/${fnPath}` : `${explicitBase}${fnPrefix}${fnPath}`;
              } else {
                resolved = `/.netlify/functions/${fnPath}`;
              }
            } else if (explicitBase) {
              // If explicit base is configured, use it
              const hasFuncs = /\/\.netlify\/functions\/?$/.test(explicitBase);
              resolved = hasFuncs ? `${explicitBase}/${fnPath}` : `${explicitBase}${fnPrefix}${fnPath}`;
            } else {
              // fallback to original relative path
              resolved = `/.netlify/functions/${fnPath}`;
            }
          } else {
            // Production: prefer explicit base if available
            if (explicitBase) {
              const hasFuncs = /\/\.netlify\/functions\/?$/.test(explicitBase);
              resolved = hasFuncs ? `${explicitBase}/${fnPath}` : `${explicitBase}${fnPrefix}${fnPath}`;
            } else {
              resolved = `/.netlify/functions/${fnPath}`;
            }
          }

          // Preserve query string if present in original url
          try {
            const originalUrl = new URL(url, window.location.origin);
            if (originalUrl.search) resolved += originalUrl.search;
          } catch {}

          url = resolved;
        }
      } catch (e) {
        // ignore resolver errors and use original url
      }

      // Normalize URL for detection
      let parsed: URL | null = null;
      try {
        parsed = new URL(url, window.location.origin);
      } catch {}
      const path = parsed ? parsed.pathname : String(url);

      // Determine environment
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
      const isPreviewHost = !isLocalHost && (
        hostname.includes('fly.dev') ||
        hostname.includes('netlify.app') ||
        hostname.includes('vercel.app') ||
        hostname.includes('preview')
      );

      // Protect Vite client assets and ping endpoints from being intercepted
      const isViteClientRequest = path.includes('/@vite/client') || path.includes('/__vite_ping') || path.includes('/@vite/hmr');

      // If this is a Vite client request on a non-local host (preview/prod), return a safe stub to avoid executing Vite dev-client overlay code
      if (isViteClientRequest && !isLocalHost) {
        const contentType = path.includes('/@vite/client') || path.includes('/@vite/hmr') ? 'application/javascript' : 'text/plain';
        try {
          // Provide a minimal no-op script for Vite client/HMR requests so the runtime doesn't execute the dev overlay
          if (path.includes('/@vite/client') || path.includes('/@vite/hmr')) {
            const stub = `/* Vite client stub - no-op in preview/prod */\n(function(){try{self.__vite_client_stub = true; /* prevent Vite dev-client actions */}catch(e){}})();`;
            return new Response(stub, { status: 200, statusText: 'OK', headers: { 'Content-Type': contentType } });
          }

          // For other ping endpoints, return a harmless OK text
          return new Response('OK', { status: 200, statusText: 'OK', headers: { 'Content-Type': contentType } });
        } catch (e) {
          // Fallback to an empty response if something unexpected happens
          return new Response('', { status: 200, statusText: 'OK', headers: { 'Content-Type': contentType } });
        }
      }

      // If FullStory detected or it's a Vite client request (local dev), prefer XHR bypass proactively
      if (isViteClientRequest || isFullStoryPresent()) {
        try {
          // Try original fetch first if it exists and appears native
          if (originalFetch) {
            try {
              return await originalFetch(url as any, init as any);
            } catch (err) {
              // fallthrough to bypass
              console.warn('🔧 Original fetch failed for', url, ' — falling back to XHR bypass');
            }
          }

          const bypass = createBypassFetch();
          return await bypass(url as any, init as any);
        } catch (bypassError) {
          console.error('❌ Safe fetch bypass failed for', url, bypassError);
          // If this was a Vite client request, avoid bubbling a network error which breaks HMR in some preview hosts
          try {
            const isViteClientRequestLocal = path.includes('/@vite/client') || path.includes('/__vite_ping') || path.includes('/@vite/hmr');
            const isDev = ((import.meta as any)?.env?.MODE !== 'production');
            if (isViteClientRequestLocal && (isDev || isPreviewHost)) {
              try {
                const contentType = path.includes('/@vite/client') || path.includes('/@vite/hmr') ? 'application/javascript' : 'text/plain';
                // Return a harmless empty response so dev client doesn't spam console with Failed to fetch
                return new Response('', { status: 200, statusText: 'OK', headers: { 'Content-Type': contentType } });
              } catch (respErr) {
                // ignore and fallthrough
              }
            }
          } catch {}

          // As a last resort, try the current window.fetch (may throw)
          return (window as any).__originalFetch__ ? (window as any).__originalFetch__(url as any, init as any) : Promise.reject(bypassError);
        }
      }

      // Non-protected requests - use native fetch (may be wrapped)
      try {
        return await originalFetch(url as any, init as any);
      } catch (err) {
        // If native fetch fails and FullStory seems present, attempt bypass
        if (isFullStoryPresent()) {
          try {
            const bypass = createBypassFetch();
            return await bypass(url as any, init as any);
          } catch (bypassError) {
            throw bypassError;
          }
        }
        throw err;
      }
    };

    // Install wrapper
    try {
      (window as any).fetch = safeFetch as any;
      console.log('✅ Safe fetch wrapper installed');
    } catch (e) {
      console.warn('⚠️ Failed to install safe fetch wrapper:', e);
    }
  } catch (error) {
    console.warn('⚠️ initSafeFetch failed:', (error as any).message || error);
  }
}

// Auto-init on import
initSafeFetch();
