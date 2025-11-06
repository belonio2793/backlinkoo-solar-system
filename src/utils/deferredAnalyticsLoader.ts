/**
 * Deferred analytics loader
 * Delays initialization of non-critical analytics until after app is interactive
 * Prevents DreamData, Amplitude, FullStory from blocking initial load
 */

type AnalyticsLoader = () => void | Promise<void>;

interface DeferredAnalyticsConfig {
  name: string;
  loader: AnalyticsLoader;
  delay?: number; // ms to wait before loading
  retries?: number; // number of retries on failure
}

const loaders: Map<string, AnalyticsLoader> = new Map();
const loaded: Set<string> = new Set();

/**
 * Register an analytics service for deferred loading
 */
export function registerDeferredAnalytics(
  name: string,
  loader: AnalyticsLoader,
  delay = 3000,
) {
  // Store the loader for later execution
  loaders.set(name, () => {
    if (loaded.has(name)) return;

    console.log(`📊 Loading ${name} analytics...`);
    loaded.add(name);

    try {
      const result = loader();
      if (result instanceof Promise) {
        result.catch((error) => {
          console.warn(`Failed to load ${name}:`, error);
        });
      }
    } catch (error) {
      console.warn(`Failed to initialize ${name}:`, error);
    }
  });

  // Schedule for deferred load
  scheduleLoad(name, delay);
}

/**
 * Load an analytics service immediately or after delay
 */
function scheduleLoad(name: string, delay: number) {
  if (delay <= 0) {
    // Load immediately
    const loader = loaders.get(name);
    if (loader) {
      loader();
    }
  } else {
    // Defer load
    if (document.readyState === 'loading') {
      // App not ready, wait for interactive
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          setTimeout(() => {
            const loader = loaders.get(name);
            if (loader) loader();
          }, delay);
        },
        { once: true },
      );
    } else {
      // App already ready, just delay
      setTimeout(() => {
        const loader = loaders.get(name);
        if (loader) loader();
      }, delay);
    }
  }
}

/**
 * Load all registered analytics services
 */
export async function loadAllDeferredAnalytics() {
  const promises: Promise<void>[] = [];

  for (const [name, loader] of loaders) {
    if (loaded.has(name)) continue;

    const promise = Promise.resolve()
      .then(() => {
        console.log(`🔄 Loading ${name}...`);
        return loader();
      })
      .catch((error) => {
        console.warn(`Failed to load ${name}:`, error);
      });

    promises.push(promise);
  }

  await Promise.all(promises);
}

/**
 * Check if an analytics service has been loaded
 */
export function isAnalyticsLoaded(name: string): boolean {
  return loaded.has(name);
}

/**
 * Suppress analytics initialization in preview mode
 */
export function shouldSkipAnalytics(): boolean {
  return (window as any).__SANDBOXED_PREVIEW__ || (window as any).__ANALYTICS_DISABLED__;
}

/**
 * Deferred DreamData loader
 */
export function setupDeferredDreamData() {
  if (shouldSkipAnalytics()) return;

  registerDeferredAnalytics('DreamData', () => {
    // DreamData script loads asynchronously
    const scriptId = 'dreamdata-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.dreamdata.cloud/analytics.js';
    script.async = true;
    document.head.appendChild(script);
  }, 5000); // Delay 5 seconds
}

/**
 * Deferred Amplitude loader
 */
export function setupDeferredAmplitude(amplitudeKey?: string) {
  if (shouldSkipAnalytics() || !amplitudeKey) return;

  registerDeferredAnalytics('Amplitude', () => {
    if ((window as any).amplitude) return; // Already loaded

    const script = document.createElement('script');
    script.src = 'https://cdn.amplitude.com/libs/amplitude-8.5.0-min.js.gz';
    script.async = true;
    script.onload = () => {
      try {
        (window as any).amplitude?.init(amplitudeKey);
      } catch (error) {
        console.warn('Failed to initialize Amplitude:', error);
      }
    };
    document.head.appendChild(script);
  }, 4000); // Delay 4 seconds
}

/**
 * Deferred FullStory loader with namespace conflict prevention
 * Note: FullStory is already stubbed in previewGuard.ts for preview environments
 */
export function setupDeferredFullStory(fullstoryOrgId?: string) {
  if (shouldSkipAnalytics() || !fullstoryOrgId) return;

  registerDeferredAnalytics('FullStory', () => {
    if ((window as any).FS || (window as any)._fs) return; // Already loaded

    try {
      // Set custom namespace BEFORE loading script to prevent conflicts
      // FullStory will use window._fs instead of window.FS to avoid namespace pollution
      (window as any)._fs_namespace = '_fs';

      const script = document.createElement('script');
      script.src = `https://edge.fullstory.com/s/fs.js`;
      script.async = true;

      script.onload = () => {
        try {
          // Access via the custom namespace
          const FS = (window as any)._fs || (window as any).FS;
          if (FS && typeof FS.init === 'function') {
            FS.init({ orgId: fullstoryOrgId });
          }
        } catch (error) {
          console.warn('Failed to initialize FullStory:', error);
        }
      };

      script.onerror = () => {
        console.warn('Failed to load FullStory script');
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('Failed to setup FullStory:', error);
    }
  }, 6000); // Delay 6 seconds
}

/**
 * Create safe wrappers for analytics that might not be loaded yet
 */
export function createAnalyticsProxy(name: string) {
  return new Proxy(
    {},
    {
      get() {
        // Return no-op functions
        return (..._args: any[]) => {
          if (isAnalyticsLoaded(name)) {
            console.warn(
              `${name} is loaded but not properly configured`,
            );
          }
        };
      },
    },
  );
}

/**
 * Initialize all deferred analytics loaders
 */
export function initializeDeferredAnalytics() {
  if (shouldSkipAnalytics()) {
    console.log('📊 Analytics disabled in preview mode');
    return;
  }

  // Setup all deferred loaders
  setupDeferredDreamData();
  setupDeferredAmplitude(import.meta.env.VITE_AMPLITUDE_KEY as string);
  setupDeferredFullStory(import.meta.env.VITE_FULLSTORY_ORG_ID as string);

  console.log('✅ Deferred analytics initialized');
}
