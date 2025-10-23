import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserPlus, CreditCard, X, Crown, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: 'registration' | 'purchase' | 'premium' | 'transaction';
  displayName: string;
  country: string;
  countryFlag: string;
  amount?: number;
  plan?: string;
  description?: string;
  timestamp: string;
}

export const GlobalNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const channel = supabase.channel('global-notifications', { config: { broadcast: { self: true } } });

    const add = (n: Notification) => {
      setNotifications(prev => [n, ...prev.slice(0, 4)]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(x => x.id !== n.id));
      }, 5000);
    };

    channel
      .on('broadcast', { event: 'new-user' }, (payload: any) => {
        add({
          id: `user-${Date.now()}`,
          type: 'registration',
          displayName: payload.displayName || 'Anonymous',
          country: payload.country,
          countryFlag: payload.countryFlag,
          timestamp: new Date().toISOString()
        });
      })
      .on('broadcast', { event: 'credit-purchase' }, (payload: any) => {
        add({
          id: `purchase-${Date.now()}`,
          type: 'purchase',
          displayName: payload.displayName || 'Anonymous',
          country: payload.country,
          countryFlag: payload.countryFlag,
          amount: payload.amount,
          timestamp: new Date().toISOString()
        });
      })
      .on('broadcast', { event: 'premium-upgrade' }, (payload: any) => {
        add({
          id: `premium-${Date.now()}`,
          type: 'premium',
          displayName: payload.displayName || 'Anonymous',
          country: payload.country,
          countryFlag: payload.countryFlag,
          plan: payload.plan,
          timestamp: new Date().toISOString()
        });
      })
      .on('broadcast', { event: 'transaction' }, (payload: any) => {
        add({
          id: `txn-${Date.now()}`,
          type: 'transaction',
          displayName: payload.displayName || 'Anonymous',
          country: payload.country,
          countryFlag: payload.countryFlag,
          description: payload.description,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  const iconFor = (type: Notification['type']) => {
    switch (type) {
      case 'registration': return (
        <div className="p-1 bg-green-100 rounded-full"><UserPlus className="h-4 w-4 text-green-600" /></div>
      );
      case 'purchase': return (
        <div className="p-1 bg-blue-100 rounded-full"><CreditCard className="h-4 w-4 text-blue-600" /></div>
      );
      case 'premium': return (
        <div className="p-1 bg-purple-100 rounded-full"><Crown className="h-4 w-4 text-purple-600" /></div>
      );
      default: return (
        <div className="p-1 bg-slate-100 rounded-full"><Receipt className="h-4 w-4 text-slate-600" /></div>
      );
    }
  };

  const textFor = (n: Notification) => {
    if (n.type === 'registration') return 'just signed up!';
    if (n.type === 'purchase') return `purchased ${n.amount} credits!`;
    if (n.type === 'premium') return `upgraded to Premium${n.plan ? ` (${n.plan})` : ''}!`;
    return n.description || 'completed a transaction';
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm" role="region" aria-label="Site notifications">
      {notifications.map((n) => (
        <Card key={n.id} className="p-3 bg-white/95 backdrop-blur-sm border shadow-lg animate-slide-in-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {iconFor(n.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{n.displayName}</span>
                  <span className="text-lg" aria-hidden>{n.countryFlag}</span>
                  <Badge variant="outline" className="text-xs">{n.country}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{textFor(n)}</div>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeNotification(n.id)} aria-label="Dismiss notification">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
