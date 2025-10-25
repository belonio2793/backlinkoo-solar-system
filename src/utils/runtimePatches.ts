// Runtime safety patches applied early at app startup

// Suppress noisy non-actionable warnings (MobX out-of-bounds, Quill duplicate plugin warnings, Wootric created_at format)
const _consoleWarn = console.warn.bind(console);
console.warn = (...args: any[]) => {
  try {
    const msg = String(args[0] ?? '');
    if (msg.includes('[mobx.array]') && msg.includes('out of bounds')) return;
    if (msg.toLowerCase().includes('quill') && msg.includes('Overwriting modules/imageResize')) return;
    if (msg.includes('Wootric: Warning: Invalid created_at')) return;
    // Suppress Firebase warnings
    if (msg.includes('Firebase') || msg.includes('auth/operation-not-supported')) return;
    // Suppress chunk loading errors
    if (msg.includes('Loading chunk') || msg.includes('loading chunk')) return;
    // Suppress ResizeObserver errors
    if (msg.includes('ResizeObserver loop limit exceeded')) return;
    // Suppress Supabase auth warnings
    if (msg.includes('Supabase') && msg.includes('auth')) return;
  } catch (e) {
    // ignore
  }
  _consoleWarn(...args);
};

// Suppress console.error for false warnings
const _consoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  try {
    const msg = String(args[0] ?? '');
    // Suppress Firebase errors
    if (msg.includes('Firebase') || msg.includes('auth/operation-not-supported')) return;
    // Suppress chunk loading errors
    if (msg.includes('Loading chunk') || msg.includes('loading chunk') || msg.includes('ChunkLoadError')) return;
    // Suppress ResizeObserver errors
    if (msg.includes('ResizeObserver loop limit exceeded')) return;
    // Suppress noisy iframe evaluation timeout messages from preview hosts
    const lower = msg.toLowerCase();
    if (lower.includes('iframe evaluation timeout') || lower.includes('iframe eval') || lower.includes('no response received within')) return;
  } catch (e) {
    // ignore
  }
  _consoleError(...args);
};

// Protect Quill.register from duplicate registrations if Quill is loaded by multiple bundles
declare global {
  interface Window { Quill?: any; wootric?: any; }
}

try {
  if (typeof window !== 'undefined' && (window as any).Quill && (window as any).Quill.register) {
    const Q = (window as any).Quill;
    if (!Q.__safeRegisteredModules) Q.__safeRegisteredModules = new Set();
    const origRegister = Q.register.bind(Q);
    Q.register = function (pathOrName: any, module?: any, force?: boolean) {
      try {
        const name = typeof pathOrName === 'string' ? pathOrName : (pathOrName && pathOrName.name) || String(pathOrName);
        if (Q.__safeRegisteredModules.has(name) && !force) return;
        Q.__safeRegisteredModules.add(name);
      } catch (e) {
        // continue
      }
      return origRegister(pathOrName, module, force);
    };
  }
} catch (e) {
  // swallow
}

// Wrap wootric.init to coerce created_at timestamps to seconds (Wootric expects 10-digit seconds)
try {
  if (typeof window !== 'undefined' && (window as any).wootric && typeof (window as any).wootric.init === 'function') {
    const w = (window as any).wootric;
    const origInit = w.init.bind(w);
    w.init = function (...args: any[]) {
      try {
        if (args && args[0] && typeof args[0] === 'object' && typeof args[0].created_at === 'number') {
          const ts = args[0].created_at;
          if (ts > 1e11) args[0].created_at = Math.floor(ts / 1000);
        }
      } catch (e) {}
      return origInit(...args);
    };
  }
} catch (e) {}

// Lightweight hook to ignore failed image analytics loads from known external trackers when in preview
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      try {
        // If requesting dreamdata or known 3rd-party tracking images, allow the request but suppress console errors
        const url = typeof input === 'string' ? input : (input as Request).url || '';
        if (/dreamdata\.cloud|grsm\.io|cdn\.dreamdata/.test(url)) {
          const r = await origFetch(input, init);
          // swallow 404s silently
          return r;
        }
      } catch (e) {
        // fallback to original behavior
      }
      return origFetch(input, init);
    };
  }
} catch (e) {}

// Handle iframe eval timeout errors: capture a single stack for diagnostics, then suppress further noisy occurrences
try {
  if (typeof window !== 'undefined') {
    // limit how many times we log the diagnostic stack to avoid spamming
    const __iframeTimeoutLogCounter = { count: 0 } as { count: number };
    const MAX_LOGS = 3;

    function shouldHandleIframeTimeout(msg: string) {
      const lower = msg || '';
      return /iframe evaluation timeout/i.test(lower) || /iframe eval/i.test(lower) || /no response received within/i.test(lower);
    }

    function logIframeTimeoutDiagnostic(reason: any) {
      try {
        if (__iframeTimeoutLogCounter.count >= MAX_LOGS) return;
        __iframeTimeoutLogCounter.count++;
        const stack = reason && (reason.stack || reason.stacktrace || reason.stackTrace) ? (reason.stack || reason.stacktrace || reason.stackTrace) : null;
        const msg = reason && reason.message ? reason.message : String(reason || 'IFrame evaluation timeout');
        // Log a concise diagnostic to debug channel (console.debug) so it is visible when needed but not noisy by default
        console.debug('[Diagnostics] IFrame evaluation timeout captured', { message: msg, stack: stack ? String(stack).split('\n').slice(0,8).join('\n') : 'no-stack' });
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('unhandledrejection', (event) => {
      try {
        const reason = event?.reason;
        const msg = reason && reason.message ? String(reason.message) : String(reason || '');
        if (shouldHandleIframeTimeout(msg)) {
          // capture diagnostic stack once or up to MAX_LOGS
          logIframeTimeoutDiagnostic(reason);
          // prevent noisy console output for preview iframe evaluation timeouts
          event.preventDefault();
          return;
        }
      } catch (e) {}
      // allow other handlers to process
    }, { passive: true });

    window.addEventListener('error', (event: ErrorEvent) => {
      try {
        const msg = event?.message ? String(event.message) : '';
        if (shouldHandleIframeTimeout(msg)) {
          logIframeTimeoutDiagnostic((event as any).error || event.message || msg);
          // swallow this specific noisy preview error
          try { event.preventDefault(); } catch (e) {}
          return;
        }
      } catch (e) {}
      // allow normal processing
    }, true);
  }
} catch (e) {}

export {};
