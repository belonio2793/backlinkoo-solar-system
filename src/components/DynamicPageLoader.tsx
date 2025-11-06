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
  const withoutExt = filePath.replace('/src/pages', '').replace(/\.tsx$/i, '');

  // Handle index files
  let route = withoutExt;
  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }

  // Normalized route (lowercased, keeps slashes)
  const normalized = (route === '' ? '/' : route).toLowerCase();

  // Also support kebab-case route derived from PascalCase filenames (e.g., KeywordResearch -> keyword-research)
  // Extract the file base name for last segment
  const segments = route.split('/').filter(Boolean);
  const last = segments.length > 0 ? segments[segments.length - 1] : '';
  const kebabFromPascal = last
    ? '/' + segments.slice(0, -1).concat([last
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase()]).join('/')
    : null;

  // Create lazy component
  const LazyComponent = lazy(async () => {
    const Comp = await (moduleImport as any)();
    return { default: Comp };
  });

  // Add normalized route
  routeMap.set(normalized, LazyComponent);
  if (normalized !== '/' && !normalized.startsWith('/')) {
    routeMap.set('/' + normalized, LazyComponent);
  }

  // Add kebab-case alternate route if different
  if (kebabFromPascal) {
    const kebabNormalized = kebabFromPascal.toLowerCase();
    if (kebabNormalized !== normalized) {
      routeMap.set(kebabNormalized, LazyComponent);
      if (!kebabNormalized.startsWith('/')) routeMap.set('/' + kebabNormalized, LazyComponent);
    }
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
