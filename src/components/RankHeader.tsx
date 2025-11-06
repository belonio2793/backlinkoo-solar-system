import { useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Infinity, Star, Menu, Home, BookOpen, Search, LineChart, LogIn, UserPlus } from 'lucide-react';
import { usePremiumModal } from '@/contexts/ModalContext';
import { useAuth } from '@/hooks/useAuth';

import { Header } from '@/components/Header';
import { useLocation } from 'react-router-dom';

export default function RankHeader(props: { showTabs?: boolean; ctaMode?: 'premium' | 'navigation'; logoSrc?: string; logoAlt?: string }) {
  // Delegate to the main Header to keep one navigation template across the app.
  // Preserve location-dependent behavior by rendering Header as-is; pages that relied on RankHeader's tabs should still work via Header dropdown links.
  return <Header variant="translucent" />;
}
