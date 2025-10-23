import React from 'react';

export default function AutomationDisabled() {
  React.useEffect(() => {
    console.warn('Automation feature disabled in this build to avoid calling deleted edge functions.');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-4">Automation Temporarily Disabled</h1>
        <p className="text-gray-600 mb-6">The link-building automation features have been disabled in this environment because corresponding server-side functions were removed. Visit the Dashboard or contact an administrator to re-enable.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded">Go to Dashboard</a>
          <a href="/" className="px-4 py-2 border rounded">Return Home</a>
        </div>
      </div>
    </div>
  );
}
