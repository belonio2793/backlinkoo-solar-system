import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class DomainErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Domain Error Boundary caught an error:', error, errorInfo);

    const msg = String(error?.message || '');
    // Soft-recover from known dev-mode module conflicts (e.g., duplicate React identifier)
    if (/Identifier 'React' has already been declared/i.test(msg)) {
      console.warn('Soft-recovering from React identifier redeclare; skipping overlay.');
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  private autoResetTimer: any = null;

  componentWillUnmount(): void {
    if (this.autoResetTimer) {
      clearTimeout(this.autoResetTimer);
      this.autoResetTimer = null;
    }
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || '';
      const isNetworkError = /Failed to fetch|NetworkError|timeout|ERR_NETWORK/i.test(msg);
      const isSupabaseError = /supabase|database|postgrest|net::ERR/i.test(msg);

      // Soft-handle transient network hiccups: show a small banner and auto-retry
      if (isNetworkError) {
        if (!this.autoResetTimer) {
          this.autoResetTimer = setTimeout(() => {
            this.autoResetTimer = null;
            this.handleReset();
          }, 1200);
        }
        return (
          <>
            {this.props.children}
            <div className="fixed bottom-4 right-4 z-50 max-w-sm">
              <div className="border rounded-md p-3 bg-orange-50 border-orange-200 shadow text-orange-800 text-sm">
                Temporary network issue detected. Retrying...
              </div>
            </div>
          </>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-lg border bg-white text-gray-900 shadow-sm">
            <div className="text-center p-6 pb-2">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">⚠️</div>
              <h3 className="text-2xl font-bold">Something went wrong</h3>
              <p className="text-gray-600 mt-2">An error occurred while loading the domain management page</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {isSupabaseError && (
                <div className="border rounded-md p-4 bg-blue-50 border-blue-200 text-blue-800">
                  <div className="font-medium mb-1">Database Connection Issue</div>
                  <p className="text-sm">There's a problem connecting to the database.</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium">Possible causes:</p>
                    <ul className="text-xs list-disc list-inside space-y-1 mt-1">
                      <li>Temporary database maintenance</li>
                      <li>Network connectivity issues</li>
                      <li>Authentication problems</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Error Details</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>
                    <span className="font-medium">Error:</span> {this.state.error?.message || 'Unknown error'}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {new Date().toLocaleString()}
                  </div>
                  {this.state.error?.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-gray-600">Technical Details (Click to expand)</summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-32">{this.state.error.stack}</pre>
                    </details>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={this.handleReset} className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-6 text-sm font-medium">
                  Try Again
                </button>
                <button onClick={this.handleReload} className="flex-1 inline-flex items-center justify-center rounded-md border h-10 px-6 text-sm font-medium">
                  Reload Page
                </button>
                <button onClick={() => (window.location.href = '/dashboard')} className="flex-1 inline-flex items-center justify-center rounded-md border h-10 px-6 text-sm font-medium">
                  Back to Dashboard
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p>If this problem persists, please contact support with the error details above.</p>
                <p className="mt-1">
                  <a href="mailto:support@backlinkoo.com" className="text-blue-600 hover:text-blue-800">support@backlinkoo.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DomainErrorBoundary;
