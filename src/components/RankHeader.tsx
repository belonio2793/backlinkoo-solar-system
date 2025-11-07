import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';

export default function RankHeader(props: { showTabs?: boolean; ctaMode?: 'premium' | 'navigation'; logoSrc?: string; logoAlt?: string }) {
  const location = useLocation();
  const path = location.pathname || '';

  // The global Header is rendered by HeaderWrapper for most pages.
  // Render a local Header only on routes where the global header is intentionally hidden
  // (e.g. /dashboard and /admin) to avoid duplicate headers.
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    return <Header variant="translucent" />;
  }

  // For all other routes, rely on the global Header to render once.
  return null;
}
