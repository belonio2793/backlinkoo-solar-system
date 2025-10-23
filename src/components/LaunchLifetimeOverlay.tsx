import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown } from 'lucide-react';

interface LaunchLifetimeOverlayProps {
  className?: string;
  onCheckoutStart?: () => void;
  onCheckoutComplete?: () => void;
}

export default function LaunchLifetimeOverlay({ className, onCheckoutStart, onCheckoutComplete }: LaunchLifetimeOverlayProps) {
  const [loading, setLoading] = useState(false);

  const startLifetimeCheckout = () => {
    try {
      setLoading(true);
      onCheckoutStart?.();
      window.open('https://buy.stripe.com/00w4gzb3We2ifPVcBP1ZS03', '_blank', 'noopener,noreferrer');
      onCheckoutComplete?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={[
      'relative w-full rounded-md overflow-hidden border mb-4',
      'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200',
      className || ''
    ].join(' ')}>
      <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-amber-900 font-semibold">
          <Crown className="h-5 w-5 text-amber-600" />
          <span>Launch Special</span>
        </div>
        <div className="flex-1 text-amber-900 text-sm">
          <span className="font-bold">Lifetime Premium — $29 one-time</span>
          <span className="ml-2">Limited-time launch offer. Pricing will return to monthly or annual plans soon.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            onClick={startLifetimeCheckout}
            disabled={loading}
          >
            {loading ? 'Opening…' : (
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                Unlock Lifetime $29
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
