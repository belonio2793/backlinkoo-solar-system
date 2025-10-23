import { useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Infinity, Star, Menu, Home, BookOpen, Search, LineChart, LogIn, UserPlus } from 'lucide-react';
import { usePremiumModal } from '@/contexts/ModalContext';
import { useAuth } from '@/hooks/useAuth';

export default function RankHeader({ showTabs = true, ctaMode = 'premium' }: { showTabs?: boolean; ctaMode?: 'premium' | 'navigation' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { openPremiumModal } = usePremiumModal();
  const { user } = useAuth();
  const defaultTab = useMemo(() => (location.pathname.endsWith('/premium') ? 'premium' : 'rank'), [location.pathname]);
  const [tab, setTab] = useState<string>(defaultTab);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <header className="border-b border-border/10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => navigate('/')}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); } }}
              className="flex items-center gap-3"
              aria-label="Backlinkoo home"
            >
              <div className="p-1.5 rounded-lg">
                <Infinity className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Backlink ∞</h1>
            </div>
          </div>

          {showTabs && (
            <div className="flex-1 flex justify-center">
              <Tabs value={tab} onValueChange={(v) => { setTab(v); if (v === 'rank') navigate('/rank-tracker'); else navigate('/rank-tracker/premium'); }}>
                <TabsList className="bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="rank" className="data-[state=active]:bg-background">Rank Tracker</TabsTrigger>
                  <TabsTrigger value="premium" className="data-[state=active]:bg-background">Premium</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <div className="flex items-center gap-2">
            {ctaMode === 'navigation' ? (
              <button
                onClick={() => {
                  setMenuOpen((v) => {
                    const next = !v;
                    if (next) setTimeout(() => triggerRef.current?.focus(), 0);
                    return next;
                  });
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden md:inline">Navigation</span>
              </button>
            ) : (
              <button
                onClick={() => openPremiumModal ? openPremiumModal() : null}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Star className="h-4 w-4" />
                <span className="hidden md:inline">Go Premium</span>
              </button>
            )}

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button ref={triggerRef} variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/') }>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openPremiumModal ? openPremiumModal() : null}>
                  <Star className="mr-2 h-4 w-4" />
                  Go Premium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Infinity className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/blog')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Blog
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/keyword-research')}>
                  <Search className="mr-2 h-4 w-4" />
                  Keyword Research
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/rank-tracker')}>
                  <LineChart className="mr-2 h-4 w-4" />
                  Rank Tracker
                </DropdownMenuItem>
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/login')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/register')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </DropdownMenuItem>
                </>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
