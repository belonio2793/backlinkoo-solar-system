/**
 * Payment API safety patch
 *
 * Disable or stub PaymentRequest API in preview/iframe environments where
 * Permissions-Policy may disallow 'payment' and cause console violations.
 * Prevents all payment-related API calls that could trigger permissions policy violations.
 */
export function installSafePaymentPatch(): void {
  if (typeof window === 'undefined') return;

  try {
    const inIframe = window.self !== window.top;
    const host = window.location.host || '';
    const previewHosts = ['fly.dev', 'builder.io', 'netlify.app', 'backlinkoo.netlify.app', 'localhost'];
    const isPreviewHost = previewHosts.some(h => host.includes(h));

    // Only apply the patch in iframes or preview hosts to avoid breaking real payments
    if (!inIframe && !isPreviewHost) return;

    // Preserve original if present
    if (!(window as any).__originalPaymentRequest__) {
      (window as any).__originalPaymentRequest__ = (window as any).PaymentRequest;
    }

    // Stub PaymentRequest to a safe no-op implementation that won't trigger Permissions Policy
    (window as any).PaymentRequest = function PaymentRequestStub(methodData: any, details: any, options: any) {
      return {
        canMakePayment: async () => false,
        show: async () => { throw new Error('PaymentRequest disabled in preview/iframe environment'); },
        abort: async () => { throw new Error('PaymentRequest disabled'); },
        complete: async () => {},
        retry: async () => { throw new Error('PaymentRequest disabled'); }
      } as any;
    } as any;

    // Stub Payment Handler API if present
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).serviceWorker) {
        const originalRegister = (navigator as any).serviceWorker.register;
        (navigator as any).serviceWorker.register = function(scriptURL: string, options?: any) {
          // Block payment handler registration in preview
          if (scriptURL && scriptURL.includes('payment')) {
            return Promise.resolve({});
          }
          return originalRegister.call(this, scriptURL, options);
        };
      }
    } catch (e) {
      // ignore
    }

    // Some libs call navigator.canMakePayment directly on an instance; provide a safe global helper
    try {
      if (typeof navigator !== 'undefined' && !(navigator as any).canMakePayment) {
        (navigator as any).canMakePayment = async () => false;
      }
    } catch {}

    // Intercept any direct payment API calls to prevent violations
    const handler = {
      get: function(target: any, prop: string) {
        if (prop === 'PaymentRequest' || prop === 'paymentHandler') {
          return null;
        }
        return target[prop];
      }
    };

    try {
      // Create a proxy around window to intercept payment property access
      // This prevents payment-related code from triggering violations
      const windowProxy = new Proxy(window, handler);
      Object.defineProperty(globalThis, 'window', {
        value: windowProxy,
        writable: true,
        configurable: true
      });
    } catch (e) {
      // Proxy creation might fail in some contexts, that's okay
    }

    // Small debug, limited to DEV
    if (import.meta.env.DEV) {
      console.debug('🔒 PaymentRequest API stubbed for preview/iframe');
    }
  } catch (e) {
    // swallow any errors
    if (import.meta.env.DEV) console.warn('Failed to install payment patch', e);
  }
}
