import React, { startTransition } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Loading component (kept for backward compatibility but no longer used)
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrapper component - now just passes through without Suspense
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Enhanced BrowserRouter that handles transitions
export const TransitionBrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Enhanced Route component - no longer uses Suspense
export const TransitionRoute: React.FC<{
  path: string;
  element: React.ReactElement;
}> = ({ path, element }) => {
  return (
    <Route
      path={path}
      element={
        <RouteWrapper>
          {element}
        </RouteWrapper>
      }
    />
  );
};

// Export the wrapper for easy use
export { RouteWrapper, LoadingFallback };
