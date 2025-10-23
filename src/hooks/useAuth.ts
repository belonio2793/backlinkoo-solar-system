import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { NetworkErrorHandler } from '@/utils/networkErrorHandler';
import { useSupabaseErrorHandler } from '@/components/SupabaseErrorBoundary';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  subscriptionTier: string | null;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false for instant auth
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const { handleSupabaseError } = useSupabaseErrorHandler();

  // Optimized function to check premium status - runs async without blocking auth
  const checkPremiumStatusAsync = async (authUser: User) => {
    try {
      console.log('🔍 Async premium check for:', authUser.email);

      // Check profile for subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, role')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Profile query error (non-blocking):', profileError.message);
        return;
      }

      // Check if user has premium tier
      const hasPremiumTier = profile?.subscription_tier === 'premium' ||
                            profile?.subscription_tier === 'monthly';

      if (hasPremiumTier) {
        console.log('✅ Premium status updated:', profile.subscription_tier);
        setIsPremium(true);
        setSubscriptionTier(profile.subscription_tier);
        return;
      }

      // Optional: Check premium_subscriptions table (async, non-blocking)
      try {
        const { data: subsData, error: subError } = await supabase
          .from('premium_subscriptions')
          .select('status, plan_type, current_period_end')
          .eq('user_id', authUser.id)
          .eq('status', 'active')
          .gte('current_period_end', new Date().toISOString());

        if (!subError && subsData && subsData.length > 0) {
          setIsPremium(true);
          setSubscriptionTier(profile?.subscription_tier || 'premium');
          return;
        }
      } catch (error: any) {
        console.warn('⚠️ Premium subscription check skipped:', error.message);
      }

      // Also check subscribers table (webhook-driven)
      try {
        const { count, error: subsErr } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('email', authUser.email)
          .eq('subscribed', true);
        if (!subsErr && (count || 0) > 0) {
          setIsPremium(true);
          setSubscriptionTier('premium');
        }
      } catch (e: any) {
        console.warn('⚠️ Subscribers check skipped:', e.message);
      }

    } catch (error: any) {
      console.error('❌ Async premium check failed (non-critical):', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Instant session check - no loading state
    const getInstantSession = async () => {
      try {
        // Use existing session if available, no loading
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error && !NetworkErrorHandler.isThirdPartyInterference(error)) {
          console.warn('Auth error (continuing):', error.message);
        }

        if (isMounted) {
          let user = session?.user || null;

          // Fallback: check localStorage for dev-fallback session (when Supabase key is missing)
          if (!user) {
            try {
              const authToken = localStorage.getItem('auth_token');
              const authEmail = localStorage.getItem('auth_email');
              const authId = localStorage.getItem('auth_id');

              if (authToken && authEmail) {
                console.log('✅ Using dev-fallback auth from localStorage:', authEmail);
                user = {
                  id: authId || 'dev-fallback-' + Date.now(),
                  email: authEmail,
                  email_confirmed_at: new Date().toISOString(),
                } as any;
              }
            } catch (e) {
              console.warn('Could not read auth from localStorage:', e);
            }
          }

          setUser(user);

          // Start premium check async (non-blocking)
          if (user) {
            checkPremiumStatusAsync(user);
          } else {
            setIsPremium(false);
            setSubscriptionTier(null);
          }
        }
      } catch (error: any) {
        console.warn('Session check failed:', error.message);
        if (isMounted) {
          setUser(null);
          setIsPremium(false);
          setSubscriptionTier(null);
        }
      }
    };

    getInstantSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (isMounted) {
            let user = session?.user || null;

            // Fallback: check localStorage for dev-fallback session on auth state change
            if (!user && event === 'SIGNED_IN') {
              try {
                const authToken = localStorage.getItem('auth_token');
                const authEmail = localStorage.getItem('auth_email');
                const authId = localStorage.getItem('auth_id');

                if (authToken && authEmail) {
                  console.log('✅ Using dev-fallback auth from localStorage on state change:', authEmail);
                  user = {
                    id: authId || 'dev-fallback-' + Date.now(),
                    email: authEmail,
                    email_confirmed_at: new Date().toISOString(),
                  } as any;
                }
              } catch (e) {
                console.warn('Could not read auth from localStorage on state change:', e);
              }
            }

            setUser(user);

            // Start async premium check if user signed in
            if (user && event === 'SIGNED_IN') {
              console.log('🔄 User signed in - async premium check for:', user.email);
              checkPremiumStatusAsync(user);
            } else if (!user) {
              setIsPremium(false);
              setSubscriptionTier(null);
            }
          }
        } catch (error: any) {
          console.warn('Auth state change error:', error.message);
          if (isMounted) {
            setUser(session?.user || null);
            if (!session?.user) {
              setIsPremium(false);
              setSubscriptionTier(null);
            }
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading, // Always false now for instant auth
    isAuthenticated: !!user,
    isPremium,
    subscriptionTier
  };
}

// Optimized helper hook for authentication checks
export function useAuthStatus() {
  const { user, isLoading, isAuthenticated, isPremium, subscriptionTier } = useAuth();

  return {
    currentUser: user,
    isCheckingAuth: false, // Never checking for instant experience
    isLoggedIn: isAuthenticated,
    isGuest: !isAuthenticated,
    authChecked: true, // Always checked for instant experience
    isPremium,
    subscriptionTier,
    userPlan: isPremium ? 'Premium Plan' : 'Free Plan'
  };
}

// Hook for instant auth decisions
export function useInstantAuth() {
  const { user, isAuthenticated, isPremium, subscriptionTier } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isGuest: !isAuthenticated,
    isPremium,
    subscriptionTier,
    isAdmin: user?.email === 'support@backlinkoo.com',
    needsSignIn: !isAuthenticated,
    ready: true // Always ready for instant experience
  };
}
