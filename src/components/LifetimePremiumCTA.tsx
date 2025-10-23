import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LifetimePremiumOverlay from './LifetimePremiumOverlay';
import { Button } from '@/components/ui/button';
import { Crown, ChevronDown, ChevronUp } from 'lucide-react';

export default function LifetimePremiumCTA() {
  const { isPremium } = useAuth();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(() => {
    try { return localStorage.getItem('lifetime_cta_hidden') !== '1'; } catch { return true; }
  });
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('lifetime_cta_collapsed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    (window as any).openLifetimeCheckout = () => setOpen(true);
    return () => { delete (window as any).openLifetimeCheckout; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem('lifetime_cta_collapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  if (isPremium) return null;

  // If the CTA is hidden entirely, render a small reveal button so users can re-open it
  if (!visible) {
    return (
      <>
        <div className="fixed bottom-5 right-5 z-50">
          <button
            aria-label="Show lifetime offer"
            title="Show lifetime offer"
            onClick={() => {
              try { localStorage.setItem('lifetime_cta_hidden', '0'); } catch {}
              setVisible(true);
            }}
            className="inline-flex items-center justify-center rounded-full p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
          >
            <Crown className="h-4 w-4" />
          </button>
        </div>
        <LifetimePremiumOverlay open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex items-end">
        {collapsed ? (
          // Collapsed state: small pill with crown and expand icon
          <button
            aria-label="Expand lifetime offer"
            title="Expand lifetime offer"
            onClick={() => setCollapsed(false)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
          >
            <Crown className="h-4 w-4" />
            <ChevronUp className="h-4 w-4" />
          </button>
        ) : (
          // Expanded state: full CTA with a collapse control
          <div className="relative">
            <Button
              onClick={() => setOpen(true)}
              className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-3 pr-10"
            >
              <Crown className="h-4 w-4" />
              <span className="font-semibold">Premium Lifetime Only $29</span>
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                Limited Time
              </span>
            </Button>

            {/* Collapse button */}
            <button
              aria-label="Collapse lifetime offer"
              title="Collapse"
              onClick={() => setCollapsed(true)}
              className="absolute right-1 top-1 inline-flex items-center justify-center rounded-full p-1 bg-white/20 text-white hover:bg-white/30"
              style={{ transform: 'translateY(-50%)' }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>

          </div>
        )}
      </div>
      <LifetimePremiumOverlay open={open} onOpenChange={setOpen} />
    </>
  );
}
