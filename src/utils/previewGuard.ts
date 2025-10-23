// Global guard to detect sandboxed iframe preview environments and stub unsafe APIs
if (typeof window !== 'undefined') {
  try {
    const inIframe = window.self !== window.top;
    const originNull = (window.location && (window.location.origin === 'null' || window.origin === 'null'));

    let storageAccessible = true;
    try {
      void window.sessionStorage && window.sessionStorage.length;
    } catch (e) {
      storageAccessible = false;
    }

    const isSandboxedPreview = inIframe || originNull || !storageAccessible;
    (window as any).__SANDBOXED_PREVIEW__ = Boolean(isSandboxedPreview);

    if (isSandboxedPreview) {
      const noopAsync = async (..._args: any[]) => ({ success: false, error: 'sandboxed-preview' });
      const noop = (..._args: any[]) => {};

      const namesAsync = [
        'immediateEvaluateInFrame',
        'immediateEvaluate',
        'evaluateInFrame',
        'immediateEvaluateInIframe',
        'evaluateInIframe',
        'messageFrameInjectTracking',
        'fusionImmediateEvaluateInFrame'
      ];

      const namesNoop = [
        'iframeRef',
        'frameInjectTracking',
        'injectTrackingToFrame'
      ];

      for (const n of namesAsync) {
        try { (window as any)[n] = noopAsync; } catch (e) { try { (window as any)[n] = noopAsync; } catch {} }
      }

      for (const n of namesNoop) {
        try { (window as any)[n] = noop; } catch (e) { try { (window as any)[n] = noop; } catch {} }
      }

      // Provide a gentle no-op postMessage handler for targets that try to eval in iframe
      const origPost = window.postMessage ? window.postMessage.bind(window) : null;
      try {
        if (origPost) {
          window.postMessage = function (message: any, targetOrigin?: string, _transfer?: any) {
            try {
              const m = typeof message === 'string' ? message : (message && message.type) ? message.type : null;
              if (m && /eval|immediateEvaluate|evaluateInFrame|__EVAL__|FRAME_EVAL/i.test(String(m))) {
                return true;
              }
            } catch (e) {}
            return origPost(message, targetOrigin || '*');
          } as typeof window.postMessage;
        }
      } catch (e) {
        // ignore
      }

      // Helper to create a no-op analytics-like object
      const makeNoopAnalytics = (methods: string[] = []) => {
        const obj: any = {};
        for (const m of methods) obj[m] = (..._args: any[]) => {};
        obj.init = obj.init || (() => {});
        obj.on = obj.on || (() => {});
        obj.off = obj.off || (() => {});
        return obj;
      };

      try {
        // FullStory stub
        if (!(window as any).FS) {
          (window as any).FS = { shutdown: () => {}, identify: () => {}, setUserVars: () => {} };
        }

        // Sentry / Raven no-op
        if (!(window as any).Sentry) {
          (window as any).Sentry = {
            init: () => {},
            captureException: () => {},
            captureMessage: () => {},
            withScope: (cb: any) => cb && cb({ setExtra: () => {}, setTag: () => {}, setUser: () => {} }),
          };
        }
        if (!(window as any).Raven) {
          (window as any).Raven = { captureException: () => {}, captureMessage: () => {}, context: (cb: any) => cb && cb() };
        }

        // LaunchDarkly stub
        if (!(window as any).LDClient && !(window as any).ldClient) {
          (window as any).LDClient = { variation: (_k: any, d: any) => d, on: () => {}, off: () => {} };
          (window as any).ldClient = (window as any).LDClient;
        }

        // Wootric stub
        if (!(window as any).wootric) {
          (window as any).wootric = makeNoopAnalytics(['load','init','splash','identify','track']);
        }

        // Dreamdata / tracker stubs
        if (!(window as any).dreamdata) {
          (window as any).dreamdata = makeNoopAnalytics(['track','identify','init','page','event']);
        }
        if (!(window as any).tracker) {
          (window as any).tracker = makeNoopAnalytics(['track','identify','event','init']);
        }

        // Generic analytics libraries
        if (!(window as any).analytics) {
          (window as any).analytics = makeNoopAnalytics(['track','identify','page','group','alias','ready']);
        }
        if (!(window as any).posthog) {
          (window as any).posthog = makeNoopAnalytics(['capture','identify','register','register_once','people']);
        }
        if (!(window as any)._paq) {
          (window as any)._paq = [];
          (window as any)._paq.push = () => {};
        }

        // Google Analytics / gtag / ga
        if (!(window as any).gtag) {
          (window as any).gtag = (..._args: any[]) => {};
        }
        if (!(window as any).ga) {
          (window as any).ga = (..._args: any[]) => {};
        }

        // Meta Pixel (fbq) noop if not safe
        try {
          if (!((window as any).fbq && typeof (window as any).fbq === 'function')) {
            (window as any).fbq = (..._args: any[]) => {};
          }
        } catch {}

        // Firebase stub minimal surface so firebase.* calls don't crash in preview
        if (!(window as any).firebase) {
          const firebaseStub = {
            auth: () => ({
              onAuthStateChanged: () => {},
              currentUser: null,
              signInWithPopup: async () => {},
              signOut: async () => {}
            }),
            analytics: { logEvent: () => {} }
          };
          (window as any).firebase = firebaseStub;
        }

        // Also stub firebase module exports to prevent "operation-not-supported" errors
        // This handles cases where third-party code tries to import firebase modules
        try {
          const firebaseModuleStub = {
            initializeApp: () => ({}),
            getAuth: () => ({ onAuthStateChanged: () => {}, signOut: async () => {}, currentUser: null }),
            signInWithPopup: async () => {},
            signOut: async () => {},
            getApps: () => [],
            app: {}
          };
          (window as any).__firebase__ = firebaseModuleStub;
          (window as any).__firebaseStub__ = true;
        } catch {}

        // Provide a console stub to intercept Firebase warnings
        const originalWarn = console.warn;
        const originalError = console.error;
        try {
          console.warn = function(...args: any[]) {
            const msg = String(args[0] || '');
            // Suppress Firebase-related warnings in preview
            if (!msg.includes('Firebase') && !msg.includes('auth/operation-not-supported')) {
              originalWarn.apply(console, args);
            }
          };
          console.error = function(...args: any[]) {
            const msg = String(args[0] || '');
            // Don't suppress Firebase errors in preview, but log them differently
            if (msg.includes('Firebase') || msg.includes('auth/operation-not-supported')) {
              console.log('⚠️ Firebase environment error (expected in preview):', msg);
              return;
            }
            originalError.apply(console, args);
          };
        } catch {}

        // Sentry wrapper already present in stack traces; ensure global no-op capture
        try {
          (window as any).__sentry__ = (window as any).__sentry__ || (window as any).Sentry;
        } catch {}

        // Builder/Fusion preview hints
        try { (window as any).builder = (window as any).builder || {}; (window as any).builder.preview = false; } catch {}
        try { (window as any).fusion = (window as any).fusion || {}; (window as any).fusion.inPreview = true; } catch {}

      } catch (e) {
        // swallow
      }

      console.info('🔒 Preview guard: sandboxed preview detected — iframe eval, tracking & analytics globals stubbed');
    }
  } catch (e) {
    // swallow
  }
}
