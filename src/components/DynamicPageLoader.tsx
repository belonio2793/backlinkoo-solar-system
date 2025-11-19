import React, { Suspense, lazy, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoadingFallback } from '@/utils/lazyPageLoader';
import NotFound from '@/pages/NotFound';

// Map of route patterns to lazy-loaded page components
// This dynamically discovers pages but lazy-loads them on demand
const pageModules = import.meta.glob('../pages/**/*.tsx', { import: 'default' });

// Build a map of routes to lazy components
const routeMap = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

// Helper function to convert PascalCase to kebab-case
function pascalToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Populate route map from discovered page modules
Object.entries(pageModules).forEach(([filePath, moduleImport]) => {
  // Convert file path to route
  // e.g., '../pages/Blog.tsx' -> 'Blog'
  //       '../pages/blog/Index.tsx' -> 'Index'
  const withoutExt = filePath.replace(/^\.\.\/pages/, '').replace(/\.tsx$/i, '');

  // Handle index files
  let route = withoutExt;
  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }

  // Extract the file base name
  const segments = route.split('/').filter(Boolean);
  const last = segments.length > 0 ? segments[segments.length - 1] : '';
  const parentPath = segments.length > 1 ? '/' + segments.slice(0, -1).join('/') : '';

  // Create lazy component
  const LazyComponent = lazy(async () => {
    const Comp = await (moduleImport as any)();
    return { default: Comp };
  });

  // Generate all possible route variations
  const routes = new Set<string>();

  // 1. Full path lowercase (e.g., RoosterMeReview -> /roostermeview)
  if (route) {
    routes.add('/' + route.toLowerCase());
    routes.add(route.toLowerCase());
  }

  // 2. Kebab-case conversion (e.g., RoosterMeReview -> /rooster-me-review)
  if (last) {
    const kebab = pascalToKebab(last);
    const kebabRoute = parentPath ? parentPath + '/' + kebab : '/' + kebab;
    routes.add(kebabRoute);
    if (!kebabRoute.startsWith('/')) routes.add('/' + kebabRoute);
  }

  // 3. Add all variations to the map
  routes.forEach(r => {
    routeMap.set(r, LazyComponent);
  });
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

    // Try fuzzy match: convert visited path to kebab-case and search
    // e.g., /roostermeview can be converted to /rooster-me-view and matched against /rooster-me-review
    if (!Comp && normalized.length > 0) {
      const pathSegment = normalized.startsWith('/') ? normalized.slice(1) : normalized;
      const candidates = Array.from(routeMap.keys()).filter(route => {
        const routeSegment = route.startsWith('/') ? route.slice(1) : route;
        // Check if routes are similar (allow for slight variations in hyphenation)
        return routeSegment.replace(/-/g, '') === pathSegment.replace(/-/g, '');
      });

      if (candidates.length > 0) {
        Comp = routeMap.get(candidates[0])!;
      }
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
