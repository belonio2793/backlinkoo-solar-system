import React from 'react';
import NotFound from '@/pages/NotFound';

// Eager-load all pages so Vite includes them in the client bundle
// and map file paths to route paths.
const modules = import.meta.glob('/src/pages/**/*.tsx', { eager: true }) as Record<string, any>;

const pagesMap: Record<string, React.ComponentType<any>> = {};

Object.entries(modules).forEach(([filePath, mod]) => {
  // filePath example: '/src/pages/userp.tsx' or '/src/pages/blog/index.tsx'
  let route = filePath.replace('/src/pages', '').replace(/\.tsx$/i, '');
  // Normalize index files to their directory path
  route = route.replace(/\/index$/i, '');
  if (route === '' || route === '/index') {
    pagesMap['/'] = (mod && mod.default) || null;
    pagesMap['/index'] = (mod && mod.default) || null;
    return;
  }
  // Lowercase route for case-insensitive matching
  const normalized = route.toLowerCase();
  pagesMap[normalized] = (mod && mod.default) || null;
  // Also add without leading slash variant just in case
  if (!normalized.startsWith('/')) pagesMap['/' + normalized] = (mod && mod.default) || null;
});

const DynamicPageLoader: React.FC = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const normalized = pathname.replace(/\/$/, '').toLowerCase() || '/';

  // Try exact match
  let Comp = pagesMap[normalized];
  // If not found, try with/without leading slash
  if (!Comp) Comp = pagesMap['/' + normalized.replace(/^\//, '')];
  // If still not found, try first segment (e.g., /blog/slug -> /blog)
  if (!Comp) {
    const first = '/' + normalized.replace(/^\//, '').split('/')[0];
    Comp = pagesMap[first];
  }

  if (!Comp) {
    // If nothing matches, render the NotFound page if available
    return <NotFound />;
  }

  const Page = Comp as React.ComponentType<any>;
  return <Page />;
};

export default DynamicPageLoader;
