import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminSignIn } from '@/components/AdminSignIn';
import AdminDashboard from './AdminDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminLanding() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      checkAuthStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking admin auth status...');
    setLoading(true);

    // Set aggressive timeout
    const timeoutId = setTimeout(() => {
      console.warn('Auth check timed out - showing sign in');
      setLoading(false);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }, 7000); // Increased to 7 seconds to allow Supabase session to settle

    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.log('❌ No authenticated user found:', (error as any)?.message);
        // Fallback: API auth token
        try {
          const token = localStorage.getItem('auth_token');
          const isAdminToken = localStorage.getItem('auth_is_admin') === 'true';
          const email = localStorage.getItem('auth_email') || undefined;
          if (token) {
            console.log('🔑 Using API auth token fallback for admin:', email);
            clearTimeout(timeoutId);
            setIsAuthenticated(true);
            setIsAdmin(!!isAdminToken);
            setLoading(false);
            return;
          }
        } catch {}
        clearTimeout(timeoutId);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('✅ User authenticated:', user.email);

      setIsAuthenticated(true);

      // Check if user is admin by email or profile
      try {
        // Check by email first (common admin emails + env overrides)
        const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
        const envAdmins = (envAdminsRaw || '')
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        const adminEmails = new Set<string>(['admin@backlinkoo.com', 'support@backlinkoo.com', ...envAdmins]);
        const isAdminByEmail = adminEmails.has(user.email || '');

        if (isAdminByEmail) {
          console.log('👑 Admin access granted by email');
          clearTimeout(timeoutId);
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check profile role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        const isAdminByRole = profile?.role === 'admin';
        console.log('🔍 Profile role check:', profile?.role, 'isAdmin:', isAdminByRole);

        clearTimeout(timeoutId);
        setIsAdmin(isAdminByRole);
        setLoading(false);

      } catch (profileError) {
        console.warn('Profile check failed, using email-based admin check:', profileError);
        // Fallback to email-based admin check
        const envAdminsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS as string | undefined;
        const envAdmins = (envAdminsRaw || '')
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        const adminEmails = new Set<string>(['admin@backlinkoo.com', 'support@backlinkoo.com', ...envAdmins]);
        const isAdminByEmail = adminEmails.has(user.email || '');

        console.log('🔧 Fallback admin check by email:', isAdminByEmail);
        clearTimeout(timeoutId);
        setIsAdmin(isAdminByEmail);
        setLoading(false);
      }

    } catch (error) {
      console.error('Auth check failed:', error);
      // Fallback: API auth token
      try {
        const token = localStorage.getItem('auth_token');
        const isAdminToken = localStorage.getItem('auth_is_admin') === 'true';
        if (token) {
          clearTimeout(timeoutId);
          setIsAuthenticated(true);
          setIsAdmin(!!isAdminToken);
          setLoading(false);
          return;
        }
      } catch {}
      clearTimeout(timeoutId);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Loading Admin Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Checking authentication status...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated and is admin, show dashboard
  if (isAuthenticated && isAdmin) {
    return <AdminDashboard />;
  }

  // Otherwise, show sign in
  return <AdminSignIn />;
}
