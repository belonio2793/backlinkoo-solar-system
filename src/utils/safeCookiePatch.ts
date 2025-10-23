// Try to patch document.cookie accessors to avoid security exceptions in sandboxed iframes
// Non-fatal: if browser disallows redefining cookie property, we silently skip
export function installSafeCookiePatch() {
  if (typeof document === 'undefined') return;

  try {
    // Preserve original behavior via closures
    const originalGetter = () => (document as any).__original_cookie_getter__ ? (document as any).__original_cookie_getter__() : (function(){ try { return (document as any).__original_cookie_value__ || (document as any).cookie } catch (e) { return ''; } })();
    // Attempt to store original descriptor value by reading once
    try {
      (document as any).__original_cookie_value__ = (document as any).cookie;
    } catch (e) {
      // ignore
    }

    // Define safe getter/setter
    const safeGet = function() {
      try {
        return (document as any).__original_cookie_value__ !== undefined ? (document as any).__original_cookie_value__ : window?.document?.cookie || '';
      } catch (e) {
        return '';
      }
    };

    const safeSet = function(val: string) {
      try {
        // attempt real set
        (window as any).document.cookie = val;
        try { (document as any).__original_cookie_value__ = (document as any).cookie; } catch (_) {}
      } catch (e) {
        // ignore failures silently
      }
      return val;
    };

    // Try to redefine property on Document.prototype then fallback to document
    try {
      const proto = Document.prototype as any;
      Object.defineProperty(proto, 'cookie', {
        configurable: true,
        enumerable: true,
        get: safeGet,
        set: safeSet
      });
      console.log('Installed safe cookie patch on Document.prototype');
    } catch (e) {
      try {
        Object.defineProperty(document, 'cookie', {
          configurable: true,
          enumerable: true,
          get: safeGet,
          set: safeSet
        });
        console.log('✅ Installed safe cookie patch on document');
      } catch (err) {
        console.warn('⚠️ Unable to install safe cookie patch (browser may disallow):', err?.message || err);
      }
    }
  } catch (error) {
    console.warn('⚠️ Safe cookie patch failed:', (error as any).message || error);
  }
}
