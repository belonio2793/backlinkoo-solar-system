import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Crown, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/contexts/ModalContext';

const LIFETIME_PREMIUM_CHECKOUT_URL = 'https://buy.stripe.com/00w4gzb3We2ifPVcBP1ZS03';

interface LifetimePremiumOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LifetimePremiumOverlay({ open, onOpenChange }: LifetimePremiumOverlayProps) {
  const { user, isPremium } = useAuth();
  const { openSignupModal } = useAuthModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  const beginCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      localStorage.setItem('premium_lifetime_pending', '1');

      const checkoutWindow = window.open(
        LIFETIME_PREMIUM_CHECKOUT_URL,
        'stripe-checkout',
        'width=820,height=720,scrollbars=yes,resizable=yes,location=yes,status=yes'
      );

      if (!checkoutWindow) {
        window.location.href = LIFETIME_PREMIUM_CHECKOUT_URL;
      } else {
        onOpenChange(false);
      }
    } catch (e: any) {
      console.error('Lifetime checkout error:', e);
      setError(e?.message || 'Unable to start checkout');
      toast({ title: 'Checkout error', description: e?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [onOpenChange, toast]);

  const handleCheckout = useCallback(() => {
    setError(null);

    if (!user?.email) {
      openSignupModal({
        pendingAction: 'Lifetime Premium Access',
        onAuthSuccess: () => {
          void beginCheckout();
        }
      });
      return;
    }

    void beginCheckout();
  }, [user?.email, openSignupModal, beginCheckout]);

  const features = useMemo(() => [
    'Unlimited access to premium tools',
    'Priority support',
    'All future premium features included',
    'No monthly fees – pay once',
  ], []);

  if (isPremium) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6" />
              <DialogTitle className="text-xl">Lifetime Premium Access</DialogTitle>
            </div>
            <Button size="icon" variant="ghost" className="text-white/90 hover:text-white" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <DialogDescription className="text-white/90 mt-1">
            Launch special – one-time payment, premium forever.
          </DialogDescription>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$29</div>
                <div className="text-sm text-muted-foreground">One-time • Lifetime premium</div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm">Secure Stripe checkout</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {features.map((f) => (
              <li key={f} className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
          )}

          <Button
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleCheckout}
            disabled={loading}
          >
            <Lock className="h-4 w-4 mr-2" />
            {loading ? 'Preparing checkout…' : 'Unlock Lifetime Premium'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
