import { supabase } from "@/integrations/supabase/client";
import { getCountryFlag, getCountryName } from "@/utils/countryFlags";
import { getDisplayIdentity } from "@/utils/privacy";

// Utility to get user's country from IP
const getUserCountry = async (): Promise<{ country: string; countryCode: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: getCountryName(data.country_code || 'US'),
      countryCode: data.country_code || 'US'
    };
  } catch (error) {
    console.error('Error getting user country:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return {
      country: 'United States',
      countryCode: 'US'
    };
  }
};

export const useGlobalNotifications = () => {
  const buildBasePayload = async () => {
    const { country, countryCode } = await getUserCountry();
    const countryFlag = getCountryFlag(countryCode);
    return { country, countryFlag };
  };

  const broadcastNewUser = async (options: { name?: string; email?: string }) => {
    try {
      const { country, countryFlag } = await buildBasePayload();
      const displayName = getDisplayIdentity({ name: options.name, email: options.email });

      await supabase.channel('global-notifications').send({
        type: 'broadcast',
        event: 'new-user',
        payload: { displayName, country, countryFlag }
      });
    } catch (error) {
      console.error('Error broadcasting new user:', error);
    }
  };

  const broadcastCreditPurchase = async (options: { name?: string; email?: string; amount: number }) => {
    try {
      const { country, countryFlag } = await buildBasePayload();
      const displayName = getDisplayIdentity({ name: options.name, email: options.email });

      await supabase.channel('global-notifications').send({
        type: 'broadcast',
        event: 'credit-purchase',
        payload: { displayName, country, countryFlag, amount: options.amount }
      });
    } catch (error) {
      console.error('Error broadcasting credit purchase:', error);
    }
  };

  const broadcastPremiumUpgrade = async (options: { name?: string; email?: string; plan?: string }) => {
    try {
      const { country, countryFlag } = await buildBasePayload();
      const displayName = getDisplayIdentity({ name: options.name, email: options.email });

      await supabase.channel('global-notifications').send({
        type: 'broadcast',
        event: 'premium-upgrade',
        payload: { displayName, country, countryFlag, plan: options.plan }
      });
    } catch (error) {
      console.error('Error broadcasting premium upgrade:', error);
    }
  };

  const broadcastTransaction = async (options: { name?: string; email?: string; description?: string }) => {
    try {
      const { country, countryFlag } = await buildBasePayload();
      const displayName = getDisplayIdentity({ name: options.name, email: options.email });

      await supabase.channel('global-notifications').send({
        type: 'broadcast',
        event: 'transaction',
        payload: { displayName, country, countryFlag, description: options.description }
      });
    } catch (error) {
      console.error('Error broadcasting transaction:', error);
    }
  };

  return {
    broadcastNewUser,
    broadcastCreditPurchase,
    broadcastPremiumUpgrade,
    broadcastTransaction,
  };
};
