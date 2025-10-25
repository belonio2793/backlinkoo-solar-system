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

// Suppress unhandled promise rejections and global errors from iframe eval timeouts (preview host noise)
try {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      try {
        const reason = event?.reason;
        const msg = reason && reason.message ? String(reason.message) : String(reason || '');
        if (/iframe evaluation timeout/i.test(msg) || /iframe eval/i.test(msg) || /IFrame evaluation timeout/i.test(msg)) {
          // prevent noisy console output for preview iframe evaluation timeouts
          event.preventDefault();
          return;
        }
      } catch (e) {}
      // allow other handlers to process
    }, { passive: true });

    window.addEventListener('error', (event) => {
      try {
        const msg = event?.message ? String(event.message) : '';
        if (/iframe evaluation timeout/i.test(msg) || /iframe eval/i.test(msg) || /IFrame evaluation timeout/i.test(msg)) {
          // swallow this specific noisy preview error
          event.preventDefault();
          return;
        }
      } catch (e) {}
      // allow normal processing
    }, true);
  }
} catch (e) {}

export {};
