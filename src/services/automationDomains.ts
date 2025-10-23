import { supabase } from '@/integrations/supabase/client';

export type DomainRow = {
  id: string;
  domain: string;
  user_id?: string;
  dns_verified?: boolean;
  netlify_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

export async function fetchUserDomains(userId?: string, opts?: { validatedOnly?: boolean }) {
  // If userId not provided, try to get it from the Supabase client auth
  let resolvedUserId = userId;
  if (!resolvedUserId) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      resolvedUserId = data?.user?.id;
    } catch (e) {
      return { data: [] as DomainRow[], error: e };
    }
  }

  if (!resolvedUserId) {
    return { data: [] as DomainRow[], error: new Error('No user id available') };
  }

  try {
    let query = supabase
      .from<DomainRow>('domains')
      .select('*')
      .eq('user_id', resolvedUserId)
      .order('created_at', { ascending: false });

    if (opts?.validatedOnly ?? true) {
      query = query.eq('dns_verified', true) as any;
    }

    const { data, error } = await query;
    return { data: data || [], error };
  } catch (error) {
    return { data: [] as DomainRow[], error };
  }
}
