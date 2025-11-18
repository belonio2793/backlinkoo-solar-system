import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Map of route patterns to lazy-loaded page components
const pageModules = import.meta.glob('/src/pages/**/*.tsx', { import: 'default' });

// Build a map of routes to lazy components
const routeMap = new Map<string, any>();
const debugLog: any[] = [];

// Populate route map from discovered page modules
Object.entries(pageModules).forEach(([filePath, moduleImport]) => {
  const withoutExt = filePath.replace('/src/pages', '').replace(/\.tsx$/i, '');
  
  let route = withoutExt;
  if (route.endsWith('/index')) {
    route = route.replace(/\/index$/, '');
  }
  
  const normalized = (route === '' ? '/' : route).toLowerCase();
  
  const segments = route.split('/').filter(Boolean);
  const last = segments.length > 0 ? segments[segments.length - 1] : '';
  const kebabFromPascal = last
    ? '/' + segments.slice(0, -1).concat([last
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase()]).join('/')
    : null;

  routeMap.set(normalized, true);
  if (normalized !== '/' && !normalized.startsWith('/')) {
    routeMap.set('/' + normalized, true);
  }

  if (kebabFromPascal) {
    const kebabNormalized = kebabFromPascal.toLowerCase();
    if (kebabNormalized !== normalized) {
      routeMap.set(kebabNormalized, true);
      if (!kebabNormalized.startsWith('/')) routeMap.set('/' + kebabNormalized, true);
    }
  }

  // Log the mapping
  debugLog.push({
    filePath,
    route,
    normalized,
    kebabFromPascal,
    routes: [normalized, kebabFromPascal].filter(Boolean)
  });
});

export const DynamicPageLoaderDebug: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const matchResult = useMemo(() => {
    let normalized = pathname.replace(/\/$/, '').toLowerCase() || '/';
    if (normalized === '') normalized = '/';

    let found = routeMap.has(normalized);
    let matchedRoute = found ? normalized : null;

    if (!found && normalized.startsWith('/')) {
      found = routeMap.has(normalized.slice(1));
      matchedRoute = found ? normalized.slice(1) : null;
    }

    if (!found && !normalized.startsWith('/')) {
      found = routeMap.has('/' + normalized);
      matchedRoute = found ? '/' + normalized : null;
    }

    return {
      pathname,
      normalized,
      found,
      matchedRoute,
      suggestions: debugLog
        .filter(log => log.routes.some(r => r && r.toLowerCase().includes(pathname.toLowerCase().slice(1))))
        .map(log => ({ filePath: log.filePath, routes: log.routes }))
    };
  }, [pathname]);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold">Dynamic Page Loader Debug</h3>
      <p><strong>Requested:</strong> {pathname}</p>
      <p><strong>Normalized:</strong> {matchResult.normalized}</p>
      <p><strong>Found:</strong> {matchResult.found ? 'YES ✓' : 'NO ✗'}</p>
      {matchResult.matchedRoute && <p><strong>Matched Route:</strong> {matchResult.matchedRoute}</p>}
      
      {matchResult.suggestions.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">Suggestions:</p>
          {matchResult.suggestions.map((sugg, i) => (
            <div key={i} className="text-sm">
              <p className="font-mono">{sugg.filePath}</p>
              <p className="text-gray-600">Routes: {sugg.routes.filter(Boolean).join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      <details className="mt-4 text-xs">
        <summary>Show all routes ({routeMap.size})</summary>
        <div className="mt-2 max-h-96 overflow-y-auto">
          {Array.from(routeMap.keys()).sort().map((route, i) => (
            <div key={i} className={`font-mono ${route === matchResult.normalized ? 'bg-green-200' : ''}`}>
              {route}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};
