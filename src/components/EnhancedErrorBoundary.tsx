import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logError } from '@/utils/errorFormatter';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private redirectTimer?: NodeJS.Timeout;
  private isProcessingError = false;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): null {
    // Defer decision to componentDidCatch so we can inspect the error and avoid
    // setting error state for recoverable/known errors.
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Prevent infinite loops - if already processing an error, don't process again
    if (this.isProcessingError) {
      console.warn('Error boundary already processing an error, ignoring additional error:', error.message);
      return;
    }
    this.isProcessingError = true;

    const errorMessage = (error && (error as any).message) || String(error) || '';
    const errorStack = (error && (error as any).stack) || '';
    const errorName = (error && (error as any).name) || '';

    logError('Application error caught by boundary', {
      message: errorMessage,
      stack: errorStack,
      componentStack: errorInfo.componentStack
    });

    // Filter out browser extension errors and other non-critical errors
    const isExtensionError = errorMessage.includes('Cannot redefine property: ethereum') ||
                            errorStack.includes('chrome-extension://') ||
                            errorMessage.includes('ethereum') ||
                            errorMessage.includes('evmAsk') ||
                            errorMessage.includes('ResizeObserver loop limit exceeded') ||
                            errorMessage.includes('Non-Error promise rejection captured');

    // Authentication-related errors that should be handled gracefully
    const isAuthError = errorMessage.includes('Auth') ||
                       errorMessage.includes('supabase') ||
                       errorMessage.includes('session');

    // Route/navigation errors
    const isRouteError = errorMessage.includes('navigate') ||
                        errorMessage.includes('router') ||
                        errorMessage.includes('redirect') ||
                        errorMessage.includes('route');

    // Database/API errors that should not crash the app
    const isDatabaseError = errorMessage.includes('published_blog_posts') ||
                           errorMessage.includes('relation') ||
                           errorMessage.includes('does not exist') ||
                           errorMessage.includes('PGRST') ||
                           errorMessage.includes('422') ||
                           errorMessage.includes('404') ||
                           errorMessage.includes('500') ||
                           errorMessage.includes('cleanup_expired_posts') ||
                           errorMessage.includes('getQuickStatus');

    // Component loading errors (lazy components)
    const isComponentError = errorMessage.includes('Loading chunk') ||
                            errorMessage.includes('is not defined') ||
                            errorMessage.includes('lazy') ||
                            errorMessage.includes('Cannot resolve module') ||
                            errorMessage.includes('Failed to fetch dynamically imported module');

    // Network blocked errors (analytics interference)
    const isNetworkBlockedError = errorName === 'NetworkBlockedError' ||
                                 errorMessage.includes('Network request blocked by browser analytics');

    // Blog system errors
    const isBlogError = errorMessage.includes('blog') ||
                       errorMessage.includes('Blog') ||
                       errorMessage.includes('claim') ||
                       errorStack.includes('blog');

    // For recoverable errors, don't show error state
    if (isExtensionError || isAuthError || isDatabaseError || isComponentError || isRouteError || isBlogError || isNetworkBlockedError) {
      console.warn('Recoverable error - not showing error UI:', error.message);
      this.isProcessingError = false;
      return;
    }

    // For all other errors, set error state
    console.warn('Critical application error - showing fallback UI:', error.message);
    this.setState({ hasError: true, error, errorInfo }, () => {
      this.isProcessingError = false;
    });
  }

  componentWillUnmount() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }

  redirectTo404 = () => {
    // Immediate redirect to 404 instead of showing error page
    this.redirectTimer = setTimeout(() => {
      window.location.href = '/404';
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} />;
      }

      // Show error UI instead of auto-redirecting
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're experiencing a temporary issue. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
