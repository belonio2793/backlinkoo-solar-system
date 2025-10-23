import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { PremiumCheckoutModal } from "@/components/PremiumCheckoutModal";
import { EmbeddedAutomationLite } from "@/components/EmbeddedAutomationLite";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { PremiumService } from "@/services/premiumService";

interface LinkBuildingAutomationSectionProps {
  user: User | null;
}

export function LinkBuildingAutomationSection({ user: _user }: LinkBuildingAutomationSectionProps) {
  const { isPremium: authIsPremium } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();
  const [isPremiumResolved, setIsPremiumResolved] = useState(false);
  const [isPremiumEffective, setIsPremiumEffective] = useState<boolean>(!!authIsPremium);

  // Resolve premium once per mount and cache to avoid flicker
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (authIsPremium) {
          if (active) {
            setIsPremiumEffective(true);
            setIsPremiumResolved(true);
            try { localStorage.setItem('premium:active', '1'); } catch {}
          }
          return;
        }
        const cached = (() => { try { return localStorage.getItem('premium:active'); } catch { return null; } })();
        if (cached === '1') {
          if (active) { setIsPremiumEffective(true); setIsPremiumResolved(true); }
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        const uid = session?.user?.id;
        if (!uid) {
          if (active) { setIsPremiumEffective(false); setIsPremiumResolved(true); }
          return;
        }
        const isPrem = await PremiumService.checkPremiumStatus(uid);
        try { localStorage.setItem('premium:active', isPrem ? '1' : '0'); } catch {}
        if (active) { setIsPremiumEffective(isPrem); setIsPremiumResolved(true); }
      } catch {
        if (active) { setIsPremiumEffective(!!authIsPremium); setIsPremiumResolved(true); }
      }
    })();
    return () => { active = false; };
  }, [authIsPremium]);

  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handlePremiumSuccess = () => {
    toast({
      title: "Premium activated",
      description: "Link Building Automation unlocked.",
    });
    if (pendingAction) {
      setPendingAction(null);
    }
  };

  const handleUpgradeClick = (context?: string) => {
    if (context) setPendingAction(context);
    setIsCheckoutOpen(true);
  };

  const BlockingOverlay = ({ title, description }: { title: string; description?: string }) => (
    <div className="w-full min-h-[320px] flex items-center justify-center">
      <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-sm border max-w-sm w-full">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-semibold">{title}</span>
          {!isPremiumEffective && (
            <Badge variant="outline" className="border-yellow-300 text-yellow-700">Premium</Badge>
          )}
        </div>
        {description ? (
          <p className="text-gray-600 text-sm">{description}</p>
        ) : null}
        <Button onClick={() => handleUpgradeClick('overlay-upgrade')} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );

  // Premium users get the embedded automation experience
  if ((isPremiumEffective || authIsPremium) && EmbeddedAutomationLite) {
    return <EmbeddedAutomationLite />;
  }

  // Non-premium: show only blocking overlay (no filler content)
  return (
    <div className="space-y-6">
      <BlockingOverlay title="Link Building Automation is Premium" description="Upgrade to access this feature." />
      <PremiumCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePremiumSuccess}
      />
    </div>
  );
}
