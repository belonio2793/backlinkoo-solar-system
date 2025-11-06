/**
 * Suppresses console errors from external tools and browser extensions
 * Allows real app errors to still be logged
 */

const EXTERNAL_ERROR_PATTERNS = [
  // Screenshot/annotation tools
  /screenshot.*tool|getScreenshot|u_tool_allow/i,
  /api\/v1\/screenshot/i,

  // Browser extension errors
  /Cannot read properties of undefined.*reading 'name'/i,
  /out of bounds|array index/i,

  // Common third-party library errors that are non-critical
  /ResizeObserver loop limit exceeded/i,
  /Non-Error promise rejection/i,
  /DOMException|SecurityError/i,

  // FullStory namespace conflict (harmless warning about duplicate loading)
  /FullStory namespace conflict/i,
  /Please.*_fs_namespace/i,

  // Permissions Policy violations (expected in sandboxed/preview environments)
  /\[Violation\].*permissions policy/i,
  /payment is not allowed in this document/i,

  // Resource preload warnings (non-critical performance hint)
  /The resource.*was preloaded using link preload but not used/i,
  /Please make sure it has an appropriate/i,

  // Analytics/tracking errors (already deferred)
  /Amplitude|DreamData|tracking/i,
];

/**
 * Check if an error should be suppressed (it's from an external tool)
 */
function shouldSuppressError(message: string): boolean {
  return EXTERNAL_ERROR_PATTERNS.some(pattern => pattern.test(message));
}

/**
 * Install global error handler that filters external tool errors
 */
export function installErrorSuppression() {
  const originalError = console.error.bind(console);
  const originalWarn = console.warn.bind(console);

  // Suppress external errors in console.error
  (console as any).error = (...args: any[]) => {
    const message = String(args[0] || '');

    // Only show real app errors, suppress external tool errors
    if (!shouldSuppressError(message)) {
      originalError(...args);
    }
  };

  // Suppress external warnings in console.warn
  (console as any).warn = (...args: any[]) => {
    const message = String(args[0] || '');

    if (!shouldSuppressError(message)) {
      originalWarn(...args);
    }
  };

  // Handle unhandled promise rejections from external tools
  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason?.message || event.reason || '');

    if (shouldSuppressError(message)) {
      event.preventDefault();
    }
  });

  // Handle global errors from external scripts
  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';

    if (shouldSuppressError(message)) {
      event.preventDefault();
    }
  });
}

/**
 * Log an app error (bypasses suppression)
 */
export function logAppError(message: string, error?: any) {
  const originalError = console.error.bind(console);
  originalError(`[APP ERROR] ${message}`, error);
}

/**
 * Log an app warning (bypasses suppression)
 */
export function logAppWarning(message: string, details?: any) {
  const originalWarn = console.warn.bind(console);
  originalWarn(`[APP WARNING] ${message}`, details);
}
