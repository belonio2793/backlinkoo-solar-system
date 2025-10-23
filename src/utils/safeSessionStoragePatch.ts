export function installSafeSessionStoragePatch() {
  if (typeof window === 'undefined') return;

  try {
    // Check if accessing sessionStorage throws
    let accessible = true;
    try {
      // Access property (may throw in sandboxed iframe)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      window.sessionStorage;
    } catch (e) {
      accessible = false;
    }

    if (!accessible) {
      const stub: any = {
        getItem: (_key: string) => null,
        setItem: (_key: string, _val: string) => {},
        removeItem: (_key: string) => {},
        clear: () => {},
        key: (_i: number) => null,
        get length() { return 0; }
      };

      try {
        Object.defineProperty(Window.prototype, 'sessionStorage', {
          configurable: true,
          enumerable: true,
          get() {
            return stub;
          }
        });
        console.log('✅ Installed safe sessionStorage stub on Window.prototype');
      } catch (e) {
        try {
          (window as any).sessionStorage = stub;
          console.log('✅ Installed safe sessionStorage stub on window');
        } catch (err) {
          console.warn('⚠️ Unable to install safe sessionStorage stub:', err);
        }
      }

      return;
    }

    // If accessible, wrap methods to guard against runtime exceptions
    try {
      const s = window.sessionStorage;
      const methods = ['getItem', 'setItem', 'removeItem', 'clear', 'key'] as const;
      for (const m of methods) {
        const orig = (s as any)[m];
        if (typeof orig === 'function') {
          (s as any)[m] = function (...args: any[]) {
            try {
              return orig.apply(s, args);
            } catch (err) {
              console.warn(`⚠️ sessionStorage.${m} failed:`, err?.message || err);
              return null;
            }
          };
        }
      }
    } catch (e) {
      // swallow
    }
  } catch (error) {
    console.warn('⚠️ Safe sessionStorage patch failed:', (error as any).message || error);
  }
}
