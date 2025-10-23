import { supabase } from '@/integrations/supabase/client';

interface CheckoutResult {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

// Starts a one-time Stripe Checkout for Lifetime Premium ($29)
// Uses existing Supabase Edge Function: create-payment (mode: payment)
export async function startLifetimeCheckout(): Promise<CheckoutResult> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const payload = {
      amount: 29,
      credits: 1,
      productName: 'Lifetime Premium (Lifetime Access)',
      isGuest: false
    };

    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: payload,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });

    if (error || !data?.url) {
      return { success: false, error: error?.message || 'Failed to create checkout session' };
    }

    return { success: true, url: data.url, sessionId: data.sessionId };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unexpected error' };
  }
}
