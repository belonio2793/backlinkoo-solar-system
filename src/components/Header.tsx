import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserFlow } from '@/contexts/UserFlowContext';
import { useState, useCallback } from 'react';
import { Infinity, Home, CreditCard, Menu, LogOut, BookOpen, Star, Search, LineChart, Target, Wand2, Sparkles } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { AuthService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { navigateToSection, NAVIGATION_CONFIGS } from '@/utils/navigationUtils';
import { ModernCreditPurchaseModal } from '@/components/ModernCreditPurchaseModal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PremiumCheckoutModal } from '@/components/PremiumCheckoutModal';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

interface HeaderProps {
  showHomeLink?: boolean;
  variant?: 'default' | 'translucent';
  onPremiumClick?: () => void;
  onBuyCredits?: () => void;
}

export function Header({
  showHomeLink = true,
  variant = 'default',
  onPremiumClick,
  onBuyCredits
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const {
    showSignInModal,
    setShowSignInModal,
    defaultAuthTab,
    setDefaultAuthTab,
    pendingAction,
    setPendingAction
  } = useUserFlow();

  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Control the navigation dropdown (toggled by the blue "Open Navigation" button)
  const [navOpen, setNavOpen] = useState(false);

  const handlePremiumClick = useCallback(() => {
    if (onPremiumClick) {
      onPremiumClick();
      return;
    }

    // If user not signed in, prompt login and set pending action so we can resume
    if (!user) {
      setDefaultAuthTab('login');
      setPendingAction && setPendingAction('open_premium');
      setShowSignInModal(true);
      return;
    }

    setShowPremiumModal(true);
  }, [onPremiumClick, user, setDefaultAuthTab, setPendingAction, setShowSignInModal]);

  const handleBuyCreditsClick = useCallback(() => {
    if (onBuyCredits) {
      onBuyCredits();
      return;
    }
    setShowCreditModal(true);
  }, [onBuyCredits]);

  // Debug logging for header authentication state
  console.log('🎯 Header: User authentication state:', {
    userEmail: user?.email,
    isAuthenticated: !!user,
    isLoading,
    userId: user?.id,
    currentPath: location.pathname
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      }
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const handleSignInClick = () => {
    setDefaultAuthTab('login');
    setShowSignInModal(true);
  };

  const handleCreateAccountClick = () => {
    setDefaultAuthTab('signup');
    setShowSignInModal(true);
  };

  const handleAuthSuccess = (user: any) => {
    setShowSignInModal(false);

    // If a pending action exists for opening premium, do so now
    try {
      if (pendingAction === 'open_premium') {
        setPendingAction && setPendingAction(null);
        setShowPremiumModal(true);
        return;
      }
    } catch (e) { /* ignore */ }

    // Don't navigate away from certain pages that should preserve user flow
    const preserveRoutePages = ['/blog', '/ranking', '/automation', '/domains'];
    const shouldPreserveRoute = preserveRoutePages.some(page =>
      location.pathname.startsWith(page)
    );

    if (shouldPreserveRoute) {
      console.log('🎯 Header: Preserving route after auth:', location.pathname);
      // Stay on current page - individual pages will handle restoration
      toast({
        title: "Welcome back!",
        description: "You can now access all features on this page.",
        duration: 3000
      });
    } else {
      // Navigate to dashboard for other pages
      navigate('/dashboard');
    }
  };


  const isWhiteBg = typeof location?.pathname === 'string' && (
    location.pathname.startsWith('/keyword-research') ||
    location.pathname.startsWith('/rank-tracker') ||
    location.pathname.startsWith('/kiboui') ||
    location.pathname.startsWith('/zippcall') ||
    location.pathname.startsWith('/claude')
  );

  return (
    <header
      className={cn(
        'border-b border-border/50 sticky top-0 z-[10001] section-ambient bg-white',
        isWhiteBg ? 'bg-white' : (variant === 'translucent' ? 'bg-white' : 'bg-white')
      )}
    >
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {showHomeLink ? (
              <div
                onClick={() => navigate('/')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
                className="flex items-center gap-2 sm:gap-3"
                aria-label="Go to homepage"
                style={{ cursor: 'pointer', textDecoration: 'none', background: 'none', border: 'none', padding: 0 }}
              >
                <div className="flex items-center justify-center p-1.5 rounded-lg">
                  <Infinity className="h-6 w-6 text-primary flex-shrink-0" />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Backlink ∞</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap justify-end">
            {/* Logged-in quick nav buttons (visible on sm+) */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <Button variant="ghost" size="sm" className="px-3 inline-flex items-center" onClick={() => navigate('/dashboard')}>
                  <Infinity className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="hidden sm:inline">Campaigns</span>
                </Button>
                <Button variant="ghost" size="sm" className="px-3 inline-flex items-center" onClick={handleBuyCreditsClick}>
                  <CreditCard className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span className="hidden sm:inline">Buy Credits</span>
                </Button>
                <Button variant="ghost" size="sm" className="px-3 inline-flex items-center" onClick={handlePremiumClick}>
                  <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
                  <span className="hidden sm:inline">Premium</span>
                </Button>
              </div>
            )}

            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex bg-blue-600 text-white hover:bg-blue-700 h-8 rounded-full px-3"
              onClick={() => setNavOpen((v) => !v)}
              aria-expanded={navOpen}
            >
              Open Navigation
            </Button>

            <DropdownMenu open={navOpen} onOpenChange={setNavOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4 text-slate-600 flex-shrink-0" />
                  <span>Home</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePremiumClick}>
                  <Star className="mr-2 h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Upgrade to Premium</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBuyCreditsClick}>
                  <CreditCard className="mr-2 h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>Buy Credits</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Infinity className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/keyword-research')}>
                  <Search className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>Keyword Research</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/rank-tracker')}>
                  <LineChart className="mr-2 h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <span>Rank Tracker</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.dispatchEvent(new Event('open-ask-ai'))}>
                  <Target className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Ask Backlink ∞ AI</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <div className="text-xs text-muted-foreground mb-1">Language</div>
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator />
                {isLoading ? (
                  <DropdownMenuItem>
                    Loading...
                  </DropdownMenuItem>
                ) : user ? (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4 text-rose-500 flex-shrink-0" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleSignInClick}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCreateAccountClick}>
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={defaultAuthTab}
        pendingAction={pendingAction}
      />

      {/* Buy Credits Modal */}
      <ModernCreditPurchaseModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onSuccess={() => {
          setShowCreditModal(false);
          toast({
            title: "Payment Successful",
            description: "Your credits have been added to your account.",
          });
        }}
      />

      {/* Premium Plan Modal (dashboard modal) */}
      <PremiumCheckoutModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSuccess={() => setShowPremiumModal(false)}
      />
    </header>
  );
}
