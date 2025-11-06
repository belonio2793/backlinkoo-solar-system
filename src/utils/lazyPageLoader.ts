import React, { lazy, Suspense } from 'react';

/**
 * Utility to lazily load pages on demand rather than eagerly importing them
 * This reduces initial bundle size and speeds up app initialization
 * especially in sandboxed iframe environments
 */

interface PageConfig {
  path: string;
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
}

const pageCache = new Map<string, React.ComponentType<any>>();

export function lazyLoadPage(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(importFn);
}

export function createLazyPageRoutes(pages: PageConfig[]) {
  return pages.map(({ path, importFn }) => ({
    path,
    element: React.createElement(lazyLoadPage(importFn))
  }));
}

/**
 * Loading fallback component with minimal styling
 */
export function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper to add Suspense fallback to a lazy component
 */
export function withPageSuspense(Component: React.ComponentType<any>) {
  return (props: any) =>
    React.createElement(
      Suspense,
      { fallback: React.createElement(PageLoadingFallback) },
      React.createElement(Component, props)
    );
}

/**
 * Pre-cache a page module in memory
 * Call this for pages that should be pre-fetched
 */
export async function prefetchPage(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.warn('Failed to prefetch page:', error);
    return null;
  }
}

export {};