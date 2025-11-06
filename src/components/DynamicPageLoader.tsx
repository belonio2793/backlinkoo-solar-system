import React, { Suspense, lazy, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoadingFallback } from '@/utils/lazyPageLoader';
import NotFound from '@/pages/NotFound';

// Map of route patterns to lazy-loaded page components
// This dynamically discovers pages but lazy-loads them on demand
const pageModules = import.meta.glob('/src/pages/**/*.tsx', { import: 'default' });

// Build a map of routes to lazy components
const routeMap = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

// Populate route map from discovered page modules
Object.entries(pageModules).forEach(([filePath, moduleImport]) => {
  // Convert file path to route
  // e.g., '/src/pages/Blog.tsx' -> '/blog'
  //       '/src/pages/blog/Index.tsx' -> '/blog'
  let route = filePath
    .replace('/src/pages', '')
    .replace(/\.tsx$/i, '')
    .toLowerCase();

  // Handle index files
  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }

  // Add both with and without leading slash
  const withSlash = route === '' ? '/' : route;
  const normalized = withSlash === '/' ? '/' : withSlash;

  // Create lazy component
  const LazyComponent = lazy(async () => {
    const Comp = await (moduleImport as any)();
    return { default: Comp };
  });

  routeMap.set(normalized, LazyComponent);
  if (normalized !== '/' && !normalized.startsWith('/')) {
    routeMap.set('/' + normalized, LazyComponent);
  }
});

const DynamicPageLoader: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const Component = useMemo(() => {
    // Normalize pathname
    let normalized = pathname.replace(/\/$/, '').toLowerCase() || '/';
    if (normalized === '') normalized = '/';

    // Try exact match
    let Comp = routeMap.get(normalized);

    // Try without leading slash
    if (!Comp && normalized.startsWith('/')) {
      Comp = routeMap.get(normalized.slice(1));
    }

    // Try adding leading slash
    if (!Comp && !normalized.startsWith('/')) {
      Comp = routeMap.get('/' + normalized);
    }

    // Try first segment (e.g., /blog/slug -> /blog)
    if (!Comp && normalized.includes('/')) {
      const firstSegment = '/' + normalized.split('/')[1];
      Comp = routeMap.get(firstSegment);
    }

    return Comp;
  }, [pathname]);

  if (!Component) {
    return <NotFound />;
  }

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export default DynamicPageLoader;
