import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface EndpointStatus {
  url: string;
  status: 'checking' | 'success' | 'error';
  statusCode?: number;
  error?: string;
}

export function RankTrackerDiagnostics() {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkEndpoints = async () => {
      setChecking(true);
      const envAny: any = (import.meta as any)?.env || {};
      
      const candidates = [
        '/api/homeFeaturedSearchRank',
        '/.netlify/functions/homeFeaturedSearchRank',
        envAny?.VITE_NETLIFY_FUNCTIONS_URL ? `${envAny.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/homeFeaturedSearchRank` : null,
        'https://backlinkoo.netlify.app/.netlify/functions/homeFeaturedSearchRank'
      ].filter(Boolean) as string[];

      const results: EndpointStatus[] = [];

      for (const endpoint of candidates) {
        try {
          const res = await fetch(endpoint, { 
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          });
          results.push({
            url: endpoint,
            status: res.ok ? 'success' : 'error',
            statusCode: res.status
          });
        } catch (err: any) {
          results.push({
            url: endpoint,
            status: 'error',
            error: err?.message || 'Failed to connect'
          });
        }
      }

      setEndpoints(results);
      setChecking(false);
    };

    checkEndpoints();
  }, []);

  if (checking) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking ranking service endpoints...
        </CardContent>
      </Card>
    );
  }

  const hasWorking = endpoints.some(e => e.status === 'success');

  return (
    <Card className={hasWorking ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {hasWorking ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600" />
          )}
          Ranking Service Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {endpoints.map((ep, i) => (
          <div key={i} className="text-sm flex items-start gap-2">
            {ep.status === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-600 break-all">{ep.url}</div>
              {ep.statusCode && (
                <div className="text-xs text-slate-500">Status: {ep.statusCode}</div>
              )}
              {ep.error && (
                <div className="text-xs text-amber-700">{ep.error}</div>
              )}
            </div>
          </div>
        ))}
        
        {!hasWorking && (
          <div className="mt-4 p-3 bg-white rounded border border-amber-200 text-xs text-slate-700">
            <strong>Setup required:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Ensure <code className="bg-slate-100 px-1 rounded">X_API</code> environment variable is set on Netlify</li>
              <li>For fly.dev deployment, set <code className="bg-slate-100 px-1 rounded">VITE_NETLIFY_FUNCTIONS_URL</code> to your Netlify functions URL</li>
              <li>Or run <code className="bg-slate-100 px-1 rounded">netlify dev</code> for local development</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
