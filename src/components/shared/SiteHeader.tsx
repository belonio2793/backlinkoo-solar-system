import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Infinity, Menu, Home, Star, CreditCard, Search, LineChart } from 'lucide-react';
import { usePremiumModal, useModal } from '@/contexts/ModalContext';

export function SiteHeader() {
  const go = (path: string) => { window.location.href = path; };
  const { openPremiumModal } = usePremiumModal() || {};

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => go('/')}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Backlink</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => go('/') }>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openPremiumModal ? openPremiumModal() : null}>
                  <Star className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go('/pricing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Credits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go('/keyword-research')}>
                  <Search className="mr-2 h-4 w-4" />
                  Keyword Research
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go('/rank-tracker')}>
                  <LineChart className="mr-2 h-4 w-4" />
                  Rank Tracker
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => go('/dashboard')}>
                  <Infinity className="mr-2 h-4 w-4 text-blue-600" />
                  Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
