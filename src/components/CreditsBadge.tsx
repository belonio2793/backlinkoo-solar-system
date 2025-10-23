import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { calculateBalance, CREDITS_QUERY_FIELDS } from '@/utils/creditsCalculation';

interface Props {
  className?: string;
}

export function CreditsBadge({ className }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = React.useState<number>(0);
  const [syncing, setSyncing] = React.useState<boolean>(false);

  const fetchCredits = React.useCallback(async () => {
    if (!user?.id) { setCredits(0); return; }
    try {
      const { data } = await supabase
        .from('credits')
        .select(CREDITS_QUERY_FIELDS)
        .eq('user_id', user.id)
        .maybeSingle();

      // Use centralized balance calculation (like Excel formula)
      const calculatedBalance = calculateBalance(data);
      setCredits(calculatedBalance);
    } catch {
      setCredits(0);
    }
  }, [user?.id]);

  const refreshCredits = React.useCallback(async () => {
    if (!user?.id) return;
    try {
      setSyncing(true);
      await fetchCredits();
      toast({ title: 'Credits Updated', description: 'Balance refreshed from credits table' });
    } catch (e: any) {
      toast({ title: 'Refresh Failed', description: e?.message || 'Unable to refresh credits', variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  }, [user?.id, toast, fetchCredits]);

  React.useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  React.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => fetchCredits());
    return () => { sub.subscription.unsubscribe(); };
  }, [fetchCredits]);

  // Realtime subscriptions to reflect DB changes immediately
  React.useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`credits-updates-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'credits', filter: `user_id=eq.${user.id}` }, () => fetchCredits())
      .subscribe();
    const onLocal = () => fetchCredits();
    window.addEventListener('credits:changed', onLocal as any);
    return () => {
      try { supabase.removeChannel(ch); } catch {}
      window.removeEventListener('credits:changed', onLocal as any);
    };
  }, [user?.id, fetchCredits]);

  return (
    <Badge
      onClick={refreshCredits}
      role="button"
      tabIndex={0}
      title={syncing ? 'Refreshing…' : 'Click to refresh credits'}
      variant="outline"
      className={(className ? className : 'gap-1 text-xs sm:text-sm') + ' cursor-pointer select-none'}
    >
      <CreditCard className="h-3 w-3" />
      {credits}
      <span className="hidden sm:inline">Credits</span>
    </Badge>
  );
}

export default CreditsBadge;
