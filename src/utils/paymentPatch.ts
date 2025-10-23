/**
 * Payment API safety patch
 *
 * Disable or stub PaymentRequest API in preview/iframe environments where
 * Permissions-Policy may disallow 'payment' and cause console violations.
 * Only applies when running inside an iframe or on known preview hosts.
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
        abort: async () => { throw new Error('PaymentRequest disabled'); }
      } as any;
    } as any;

    // Some libs call navigator.canMakePayment directly on an instance; provide a safe global helper
    try {
      if (typeof navigator !== 'undefined' && !(navigator as any).canMakePayment) {
        (navigator as any).canMakePayment = async () => false;
      }
    } catch {}

    // Small debug, limited to DEV
    if (import.meta.env.DEV) {
      console.debug('🔒 PaymentRequest API stubbed for preview/iframe');
    }
  } catch (e) {
    // swallow any errors
    if (import.meta.env.DEV) console.warn('Failed to install payment patch', e);
  }
}
