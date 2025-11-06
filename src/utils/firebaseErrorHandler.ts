/**
 * Firebase initialization error handler
 * Wraps Firebase operations with try-catch to handle sandbox errors gracefully
 * Prevents "auth/operation-not-supported-in-this-environment" errors in iframes
 */

/**
 * Check if we're in a sandboxed environment where Firebase won't work
 */
export function isFirebaseUnavailable(): boolean {
  try {
    // Check for sandboxed iframe
    if (window.self !== window.top) return true;

    // Check for null origin (sandboxed)
    if (window.location.origin === 'null' || window.origin === 'null') return true;

    // Check if localStorage is blocked
    try {
      const test = '__firebase_test_' + Date.now();
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
    } catch (e) {
      return true;
    }

    return false;
  } catch (error) {
    return true;
  }
}

/**
 * Safe wrapper for Firebase initialization
 */
export function safeFirebaseInit(initFn: () => any): any {
  if (isFirebaseUnavailable()) {
    console.log(
      '⚠️ Firebase unavailable in sandboxed environment - using stubs',
    );
    return null;
  }

  try {
    return initFn();
  } catch (error) {
    const message = (error as any).message || String(error);
    if (message.includes('operation-not-supported')) {
      console.log(
        '⚠️ Firebase not supported in this environment (expected in preview):',
        message,
      );
      return null;
    }

    console.error('Firebase initialization error:', error);
    return null;
  }
}

/**
 * Create a no-op Firebase stub for preview environments
 */
export function createFirebaseStub() {
  return {
    auth: () => ({
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signOut: async () => {},
      signInWithEmailAndPassword: async () => ({ user: null }),
      createUserWithEmailAndPassword: async () => ({ user: null }),
      getUser: () => null,
    }),
    firestore: () => ({}),
    storage: () => ({}),
    database: () => ({}),
    messaging: () => ({
      getToken: async () => '',
      onMessage: () => () => {},
    }),
    analytics: () => ({}),
    initializeApp: () => ({}),
    getApps: () => [],
    getApp: () => ({ auth: () => ({}) }),
  };
}

/**
 * Safe wrapper for Firebase async operations
 */
export async function safeFirebaseAsync<T>(
  operation: () => Promise<T>,
  fallback?: T,
): Promise<T | null> {
  if (isFirebaseUnavailable()) {
    return fallback ?? null;
  }

  try {
    return await operation();
  } catch (error) {
    const message = (error as any).message || String(error);
    if (message.includes('operation-not-supported')) {
      console.log(
        '⚠️ Firebase operation not supported in this environment',
      );
      return fallback ?? null;
    }

    console.error('Firebase operation error:', error);
    return fallback ?? null;
  }
}

/**
 * Suppress Firebase-specific console warnings in preview mode
 */
export function suppressFirebaseWarnings() {
  const originalWarn = console.warn.bind(console);

  console.warn = (...args: any[]) => {
    const message = String(args[0] || '');

    // Suppress Firebase warnings only in preview mode
    if ((window as any).__SANDBOXED_PREVIEW__) {
      if (
        message.includes('Firebase') ||
        message.includes('auth/operation-not-supported') ||
        message.includes('auth_error')
      ) {
        return;
      }
    }

    originalWarn(...args);
  };
}

/**
 * Redirect Firebase auth state changes in preview mode
 */
export function handleFirebaseAuthStateChange(callback: (user: any) => void) {
  if (isFirebaseUnavailable()) {
    // In preview, just call callback with null
    callback(null);
    return () => {};
  }

  try {
    return callback;
  } catch (error) {
    console.warn('Firebase auth state listener failed:', error);
    return () => {};
  }
}
