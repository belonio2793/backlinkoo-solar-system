import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase API: Initializing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfhanacsmsvvkpunurnp.supabase.co';
// Prefer VITE_ key (exposed to client). Also support window.ENV or non-VITE fallbacks for dev environments.
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseKey && typeof window !== 'undefined') {
  const win = window as any;
  supabaseKey = win?.ENV?.VITE_SUPABASE_ANON_KEY || win?.ENV?.SUPABASE_ANON_KEY || undefined;
}

// Treat placeholder tokens (REPLACE_ENV.*) as missing keys to avoid confusing runtime errors
if (supabaseKey && String(supabaseKey).startsWith('REPLACE_ENV')) {
  console.warn('⚠️ Detected placeholder VITE_SUPABASE_ANON_KEY (REPLACE_ENV). Treating as missing key for safety.');
  supabaseKey = undefined;
}

console.log('🔧 Supabase configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyPreview: supabaseKey ? `${String(supabaseKey).slice(0, 8)}...` : 'missing'
});

let supabaseClient: any = null;

if (supabaseKey) {
  try {
    // Check if storage is accessible before using it
    let storageAvailable = false;
    try {
      if (typeof window !== 'undefined') {
        const test = '__supabase_storage_test__';
        localStorage.setItem(test, 'test');
        localStorage.removeItem(test);
        storageAvailable = true;
      }
    } catch (e) {
      console.warn('⚠️ localStorage not available, auth session will not persist');
      storageAvailable = false;
    }

    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        // Only use localStorage if it's actually accessible
        storage: storageAvailable && typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: storageAvailable,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'backlinkoo@1.0.0'
        }
      }
    });
  } catch (e: any) {
    console.error('❌ Failed to initialize Supabase client:', e?.message || e);
    supabaseClient = null;
  }
} else {
  console.warn('⚠️ Supabase anon key missing (VITE_SUPABASE_ANON_KEY). Running in limited mode.');
}

// Fallback stub to avoid runtime crashes — methods throw informative errors
const MISSING_KEY_ERR = new Error('Supabase anon key missing. Set VITE_SUPABASE_ANON_KEY in environment variables.');

function makeThrower() {
  return new Proxy({}, {
    get() {
      return () => { throw MISSING_KEY_ERR; };
    }
  });
}

if (!supabaseClient) {
  // Provide minimal surface used by the app: from(...), functions.invoke, auth.getSession, channel, removeChannel
  const makeBuilder = () => {
    const builder: any = {};
    const methods = ['select','order','limit','maybeSingle','single','eq','neq','lt','lte','gt','gte','is','in','insert','update','delete','upsert','range','order'];
    for (const m of methods) {
      builder[m] = () => builder;
    }
    // Make the builder thenable so awaiting it rejects with MISSING_KEY_ERR
    builder.then = (onFulfilled: any, onRejected: any) => Promise.reject(MISSING_KEY_ERR).then(onFulfilled, onRejected);
    builder.catch = (onRejected: any) => Promise.reject(MISSING_KEY_ERR).catch(onRejected);
    return builder;
  };

  const stub = {
    from: (_table: string) => makeBuilder(),
    // Provide rpc method used throughout the codebase. Returns standardized shape { data, error }
    rpc: async (_fn: string, _params?: any) => ({ data: null, error: MISSING_KEY_ERR }),
    functions: { invoke: async () => ({ data: null, error: MISSING_KEY_ERR }) },
    auth: {
        // Return shape compatible with supabase-js v2 getSession — do NOT surface an error so callers treat this as unauthenticated rather than a config failure
      getSession: async () => ({ data: { session: null }, error: null }),
      // Provide getUser for older callers
      getUser: async () => ({ data: { user: null }, error: null }),
      // Sign in helpers used by UI — return generic failure without throwing to avoid noisy logs
      signInWithPassword: async (_creds: any) => ({ data: null, error: new Error('Supabase not configured in client build') }),
      signIn: async (_creds: any) => ({ data: null, error: new Error('Supabase not configured in client build') }),
      signOut: async () => ({ error: null }),
      // Minimal no-op listener compatible with supabase-js v1/v2 usage in app code
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    // Provide a non-throwing channel shim so UI components that subscribe to realtime broadcasts do not crash in limited mode.
    channel: (_name?: string, _opts?: any) => {
      const ch: any = {
        on: () => ch,
        subscribe: async () => ({ data: { status: 'SUBSCRIBED' }, error: null, unsubscribe: () => {} }),
        unsubscribe: () => {},
        send: async () => ({ error: new Error('Supabase not configured in client build') }),
      };
      return ch;
    },
    removeChannel: () => {},
  } as any;
  supabaseClient = stub;
}

// Test connection in development (only if key is present)
if (import.meta.env.DEV && !!supabaseKey) {
  setTimeout(async () => {
    try {
      console.log('🔍 Testing Supabase connection...');
      const { data, error } = await supabaseClient
        .from('domains')
        .select('id')
        .limit(1);

      if (error) {
        console.warn('��️ Database connection test failed:', error?.message || error);
      } else {
        console.log('✅ Supabase connection test successful');
      }
    } catch (testError: any) {
      console.warn('⚠️ Skipping connection test (no key or limited mode):', testError?.message || testError);
    }
  }, 1000);
}

// Keep a reference to the original Supabase invoke (if available) for fallback to Edge Functions
const __originalSupabaseInvoke = (supabaseClient && (supabaseClient as any).functions && (supabaseClient as any).functions.invoke)
  ? (supabaseClient as any).functions.invoke.bind((supabaseClient as any).functions)
  : null;

// Create an invoke override that routes edge function calls to Netlify functions by default,
// but gracefully falls back to Supabase Edge Functions when no corresponding Netlify function exists.
// We must not assign to `supabaseClient.functions` when that property is a getter-only (readonly).
async function netlifyInvoke(functionName: string, options?: any) {
  try {
    const mod = await import('@/utils/netlifyFunctionHelper');
    const safeNetlifyFetch = mod.safeNetlifyFetch as typeof mod.safeNetlifyFetch;

    // Normalize function name (strip leading slashes)
    const fn = String(functionName || '').replace(/^\/+/, '');

    const method = (options && options.method) || 'POST';
    let bodyForNetlify: any = options && options.body;

    // If body is a plain object, stringify it for fetch (Netlify expects string body)
    if (bodyForNetlify && typeof bodyForNetlify !== 'string') {
      try {
        bodyForNetlify = JSON.stringify(bodyForNetlify);
      } catch (_e) {}
    }

    const headers = (options && options.headers) || { 'Content-Type': 'application/json' };
    const init: RequestInit = { method, headers, body: bodyForNetlify };

    // Try Netlify first
    const res = await safeNetlifyFetch(fn, init);
    if (res.success) return { data: res.data, error: null };

    // Fallback: call Supabase Edge function directly if available
    if (__originalSupabaseInvoke) {
      try {
        const edgeRes = await __originalSupabaseInvoke(fn, options || {});
        return edgeRes;
      } catch (edgeErr: any) {
        return { data: null, error: edgeErr };
      }
    }

    return { data: null, error: new Error(res.error || 'Netlify function call failed') };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// Safely expose a supabase object that uses the Netlify invoke override without attempting to reassign
// a readonly `functions` property on the original client instance.
let exportedSupabase: any = supabaseClient;

try {
  const desc = Object.getOwnPropertyDescriptor(supabaseClient, 'functions')
    || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(supabaseClient), 'functions');

  const originalFunctions = (supabaseClient as any).functions || {};

  // If the property appears writable or has a setter, we can attempt to replace it directly.
  if (!desc || desc.writable || typeof desc.set === 'function') {
    try {
      (supabaseClient as any).functions = { ...originalFunctions, invoke: netlifyInvoke };
      exportedSupabase = supabaseClient;
    } catch (e) {
      // Fall back to proxy below
      exportedSupabase = new Proxy(supabaseClient, {
        get(target, prop, receiver) {
          if (prop === 'functions') {
            const orig = (target as any).functions || {};
            return { ...orig, invoke: netlifyInvoke };
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
  } else {
    // Read-only getter-only property: create a proxy that overrides the functions getter result
    exportedSupabase = new Proxy(supabaseClient, {
      get(target, prop, receiver) {
        if (prop === 'functions') {
          const orig = (target as any).functions || {};
          return { ...orig, invoke: netlifyInvoke };
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
} catch (e) {
  // On any error creating descriptors/proxy, fall back to a minimal wrapper that preserves original client
  exportedSupabase = new Proxy(supabaseClient, {
    get(target, prop, receiver) {
      if (prop === 'functions') {
        const orig = (target as any).functions || {};
        return { ...orig, invoke: netlifyInvoke };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

export const supabase = exportedSupabase;
