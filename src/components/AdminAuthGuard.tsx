import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminSignIn } from '@/components/AdminSignIn';
import { Loader2 } from 'lucide-react';
import { SafeAuth } from '@/utils/safeAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      await checkAuthStatus();
    };
    run();

    // Listen for auth changes and token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('🔄 Admin auth state changed:', event);
      // On SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED re-check
      await checkAuthStatus();
    });

    // Keep session fresh on focus and periodically
    const onFocus = async () => {
      try {
        await supabase.auth.refreshSession();
      } catch {}
      await checkAuthStatus();
    };
    window.addEventListener('focus', onFocus);
    const interval = setInterval(() => {
      supabase.auth.refreshSession().catch(() => {});
    }, 10 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      console.warn('Auth check timed out - falling back');
      setIsLoading(false);
    }, 3000);

    try {
      // Prefer session API (more reliable than getUser)
      const { data: { session } } = await supabase.auth.getSession();
      const hasSession = !!session?.user;

      // Fallback: allow previously verified admin while session refreshes
      const instantAdmin = sessionStorage.getItem('instant_admin') === 'true';
      const localAdmin = localStorage.getItem('auth_is_admin') === 'true';

      setIsAuthenticated(hasSession || instantAdmin || localAdmin);

      // Check admin via SafeAuth (email whitelist + fallbacks)
      const adminCheck = await SafeAuth.isAdmin();
      setIsAdmin(adminCheck.isAdmin || instantAdmin || localAdmin);

    } catch (error) {
      console.error('Auth check failed:', error);
      const instantAdmin = sessionStorage.getItem('instant_admin') === 'true';
      const localAdmin = localStorage.getItem('auth_is_admin') === 'true';
      setIsAuthenticated(instantAdmin || localAdmin);
      setIsAdmin(instantAdmin || localAdmin);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Verifying admin credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <AdminSignIn />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
