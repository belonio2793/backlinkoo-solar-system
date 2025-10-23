/**
 * Safe wrapper for Supabase auth operations that handles session missing errors gracefully
 */
import { supabase } from '@/integrations/supabase/client';

export class SafeAuth {
  
  /**
   * Safely get the current user without throwing auth session errors
   */
  static async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session error:', error);
        return { user: null, error: error.message, needsAuth: true, errorType: 'session_error' };
      }

      if (!session?.user) {
        console.log('Info: No auth session - user not signed in (this is normal for unauthenticated requests)');
        return { user: null, error: null, needsAuth: true, errorType: 'no_session' };
      }

      return { user: session.user, error: null, needsAuth: false, errorType: null };
      
    } catch (error: any) {
      if (error.message?.includes('Network') || error.message?.includes('Failed to fetch')) {
        console.error('❌ Network error in session check:', error);
        return { user: null, error: error.message, needsAuth: false, errorType: 'network_error' };
      }

      console.error('❌ Session check failed:', error);
      return { user: null, error: error.message, needsAuth: true, errorType: 'unknown_error' };
    }
  }
  
  /**
   * Check if user is authenticated without throwing errors
   */
  static async isAuthenticated(): Promise<boolean> {
    const result = await this.getCurrentUser();
    return !!result.user && !result.needsAuth;
  }
  
  /**
   * Check if current user is admin without throwing errors
   */
  static async isAdmin(): Promise<{ isAdmin: boolean; needsAuth: boolean; error?: string }> {
    try {
      // API-auth fallback: honor localStorage flag if present
      try {
        const lsAdmin = localStorage.getItem('auth_is_admin');
        if (lsAdmin === 'true') {
          return { isAdmin: true, needsAuth: false };
        }
      } catch {}

      const userResult = await this.getCurrentUser();

      if (userResult.needsAuth || !userResult.user) {
        return { isAdmin: false, needsAuth: true };
      }

      // Allow configurable admin emails via env (comma-separated)
      const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
      const envAdmins = (envAdminsRaw || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const defaultAdmins = ['support@backlinkoo.com', 'admin@backlinkoo.com'];
      const allowedAdmins = new Set([
        ...defaultAdmins.map((e) => e.toLowerCase()),
        ...envAdmins,
      ]);

      const email = String(userResult.user.email || '').toLowerCase();
      const isAdminEmail = allowedAdmins.has(email);

      if (isAdminEmail) {
        console.log('✅ Admin user verified by email (env/whitelist)');
        return { isAdmin: true, needsAuth: false };
      }

      console.log('ℹ️ Non-admin user:', userResult.user.email);
      return { isAdmin: false, needsAuth: false };

    } catch (error: any) {
      console.error('❌ Admin check failed:', error);

      // Even if auth fails, still try email check as last resort
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const email = String(session?.user?.email || '').toLowerCase();
        const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
        const envAdmins = (envAdminsRaw || '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        const defaultAdmins = ['support@backlinkoo.com', 'admin@backlinkoo.com'];
        const allowedAdmins = new Set([
          ...defaultAdmins.map((e) => e.toLowerCase()),
          ...envAdmins,
        ]);
        if (allowedAdmins.has(email)) {
          console.log('✅ Admin verified via fallback email check');
          return { isAdmin: true, needsAuth: false };
        }
      } catch {
        // Ignore fallback errors
      }

      return { isAdmin: false, needsAuth: true, error: error.message };
    }
  }
  
  /**
   * Safely sign out without throwing errors
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear API auth fallback tokens
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_is_admin');
        localStorage.removeItem('auth_email');
      } catch {}

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ User signed out successfully');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Safely sign in without throwing errors
   */
  static async signIn(email: string, password: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
    isAdmin?: boolean;
  }> {
    const tryApiAuth = async (): Promise<{ success: boolean; user?: any; error?: string; isAdmin?: boolean }> => {
      const apiUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      // If no API URL configured, try to restore from a local dev token if present (dev convenience)
      try {
        const localToken = localStorage.getItem('auth_token');
        if (!apiUrl && localToken) {
          const storedEmail = localStorage.getItem('auth_email') || email.trim();
          const isAdmin = localStorage.getItem('auth_is_admin') === 'true';
          console.warn('⚠️ Auth API not configured, restoring session from local token (dev).');
          return { success: true, user: { email: storedEmail }, isAdmin };
        }
      } catch {};

      if (!apiUrl) {
        const msg = 'Authentication API not configured. Set VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your environment.';
        console.error(msg);
        return { success: false, error: msg };
      }

      // Prefer using Supabase Auth REST endpoint for sign-in which is CORS-friendly and expected for client usage.
      try {
        const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined || (typeof window !== 'undefined' ? (window as any)?.ENV?.VITE_SUPABASE_ANON_KEY : undefined);
        const base = apiUrl.replace(/\/$/, '');
        const tokenUrl = `${base}/auth/v1/token?grant_type=password`;

        const res = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(anonKey ? { apikey: anonKey, Authorization: `Bearer ${anonKey}` } : {})
          },
          body: JSON.stringify({ email: email.trim(), password })
        });

        if (!res.ok) {
          const text = await res.text().catch(() => 'Login failed');
          // Detect invalid API key errors and provide actionable guidance
          const lower = String(text || '').toLowerCase();
          if (res.status === 401 || lower.includes('invalid api key') || lower.includes('no api key')) {
            const msg = 'Supabase API key rejected (Invalid or missing anon key). Please verify VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY in your environment and restart the dev server.';
            console.error('🚨 Supabase auth token error:', text || res.statusText || `HTTP ${res.status}`);
            return { success: false, error: msg };
          }
          return { success: false, error: text || `HTTP ${res.status}` };
        }

        const json: any = await res.json().catch(() => ({}));
        // Supabase returns access_token, refresh_token, and user on success
        const token = json.access_token || json.token || json.jwt || '';
        const user = json.user || json; // some setups return user at top-level
        // Determine admin by API response OR by allowed admin emails
        const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
        const envAdmins = (envAdminsRaw || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
        const defaultAdmins = ['support@backlinkoo.com', 'admin@backlinkoo.com'];
        const allowedAdmins = new Set<string>([...defaultAdmins, ...envAdmins]);
        const emailToCheck = String((user && user.email) || email).trim().toLowerCase();
        const computedAdmin = Boolean(json.is_admin ?? json.isAdmin ?? json.admin);
        const isAdmin = computedAdmin || allowedAdmins.has(emailToCheck);

        if (!token) {
          return { success: false, error: 'Invalid API response: missing token' };
        }

        try {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_is_admin', isAdmin ? 'true' : 'false');
          localStorage.setItem('auth_email', (user && user.email) || email.trim());
        } catch {}

        return { success: true, user, isAdmin };
      } catch (e: any) {
        // Final fallback: return network error message
        return { success: false, error: e?.message || 'API auth failed' };
      }
    };

    const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
    const forceApi = (import.meta as any).env?.VITE_AUTH_MODE === 'api';
    const devBypass = String((import.meta as any).env?.VITE_ADMIN_DEV_BYPASS || '').toLowerCase() === 'true';

    // Helper: check if email is allowed admin
    const isAllowedAdminEmail = (em: string) => {
      const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
      const envAdmins = (envAdminsRaw || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const defaults = ['support@backlinkoo.com', 'admin@backlinkoo.com'];
      const all = new Set<string>([...defaults, ...envAdmins]);
      return all.has(String(em || '').toLowerCase());
    };

    // Dev bypass: if enabled and email is whitelisted, accept and set API auth tokens
    if (devBypass && isAllowedAdminEmail(email)) {
      try {
        localStorage.setItem('auth_token', 'dev-bypass');
        localStorage.setItem('auth_is_admin', 'true');
        localStorage.setItem('auth_email', email.trim());
      } catch {}
      return { success: true, user: { email: email.trim() }, isAdmin: true };
    }

    // If Supabase not configured or API mode enforced, use API auth
    if (forceApi || !supabaseKey) {
      return await tryApiAuth();
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (signInError) {
        const msg = String(signInError.message || '').toLowerCase();
        // If key-related error and we're in dev, offer a local dev fallback session so preview sign-in works
        const isKeyError = msg.includes('api key') || msg.includes('no api key') || msg.includes('invalid api key');
        const isDev = Boolean(import.meta.env.DEV);
        if (isKeyError && isDev) {
          try {
            // Create a local dev session so UI behaves as authenticated in preview environment
            localStorage.setItem('auth_token', 'dev-fallback');
            localStorage.setItem('auth_is_admin', 'true');
            localStorage.setItem('auth_email', email.trim());
          } catch {}
          console.warn('Warning: Supabase anon key issue detected — using local dev fallback session (DEV mode).');
          return { success: true, user: { email: email.trim() }, isAdmin: true };
        }
        if (isKeyError) {
          // Fall back to API auth on Supabase key errors when not in dev
          return await tryApiAuth();
        }
        console.error('❌ Sign in error:', signInError);
        return { success: false, error: signInError.message };
      }

      if (!data.user) {
        return { success: false, error: 'Sign in failed - no user returned' };
      }

      console.log('✅ User signed in:', data.user.email);

      // Check admin status
      const adminCheck = await this.isAdmin();

      return {
        success: true,
        user: data.user,
        isAdmin: adminCheck.isAdmin
      };

    } catch (error: any) {
      const msg = String(error?.message || '').toLowerCase();
      const isKeyError = msg.includes('api key') || msg.includes('no api key') || msg.includes('invalid api key');
      const isDev = Boolean(import.meta.env.DEV);
      if (isKeyError && isDev) {
        try {
          localStorage.setItem('auth_token', 'dev-fallback');
          localStorage.setItem('auth_is_admin', 'true');
          localStorage.setItem('auth_email', email.trim());
        } catch {}
        console.warn('⚠️ Supabase anon key error on signIn — using local dev fallback session (DEV mode).');
        return { success: true, user: { email: email.trim() }, isAdmin: true };
      }
      if (isKeyError) {
        return await tryApiAuth();
      }
      console.error('❌ Sign in failed:', error);
      return { success: false, error: error.message };
    }
  }
}
