import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Database,
  Globe,
  Shield,
  Zap,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';
type DomainError = {
  domain: string;
  domain_id?: string;
  source: 'database' | 'dns' | 'host' | 'ssl' | 'edge_function';
  validation_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  success: boolean;
  message: string;
  timestamp: string;
  error_code?: string;
  recommendations?: string[];
  details?: any;
};

type ErrorAggregationResult = {
  success: boolean;
  domain_errors: DomainError[];
  total_errors: number;
  error_summary: { critical: number; high: number; medium: number; low: number };
  system_errors: string[];
  timestamp: string;
};
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';

interface DomainErrorsTabProps {
  domains: any[];
  isMaster?: boolean;
  onCountChange?: (count: number) => void;
}

const DomainErrorsTab: React.FC<DomainErrorsTabProps> = ({ domains, isMaster = false, onCountChange }) => {
  const { user } = useAuthState();
  const [errorData, setErrorData] = useState<ErrorAggregationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshingDomain, setRefreshingDomain] = useState<string | null>(null);
  const [troubleshooting, setTroubleshooting] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);
  const [pushDiag, setPushDiag] = useState<null | {
    secrets: { hasToken: boolean; hasSiteId: boolean; hasSupabaseUrl: boolean; hasServiceKey: boolean; sources?: any };
    aliases: string[];
    missing: string[];
  }>(null);

  const computeRedCheckErrors = (): DomainError[] => {
    const now = new Date().toISOString();
    const errs: DomainError[] = [];
    (domains || []).forEach((d: any) => {
      const netlifyOk = d.netlify_verified === true;
      const supabaseOk = d.status === 'active' || d.netlify_verified === true;
      const sslOk = d.ssl_status === 'issued' || d.ssl_enabled === true;
      const dnsOk = d.dns_verified === true || d.custom_dns_configured === true;
      if (!netlifyOk) errs.push({ domain: d.domain, domain_id: d.id, source: 'host', validation_type: 'netlify_alias', severity: 'high', success: false, message: 'Netlify alias missing', timestamp: now });
      if (!supabaseOk) errs.push({ domain: d.domain, domain_id: d.id, source: 'database', validation_type: 'status', severity: 'medium', success: false, message: 'Supabase record inactive', timestamp: now });
      if (!sslOk) errs.push({ domain: d.domain, domain_id: d.id, source: 'ssl', validation_type: 'certificate', severity: 'medium', success: false, message: 'SSL not issued', timestamp: now });
      if (!dnsOk) errs.push({ domain: d.domain, domain_id: d.id, source: 'dns', validation_type: 'records', severity: 'high', success: false, message: 'DNS not configured', timestamp: now });
    });
    return errs;
  };

  useEffect(() => {
    loadErrors();
  }, [domains, user?.id]);

  // Notify parent of current error count (runs after each update)
  useEffect(() => {
    try {
      const base = errorData?.domain_errors?.length || 0;
      const red = computeRedCheckErrors().length;
      onCountChange?.(base + red);
    } catch {}
  }, [errorData, domains, onCountChange]);

  const loadErrors = async () => {
    if (!user?.id || domains.length === 0) {
      setErrorData({
        success: true,
        domain_errors: [],
        total_errors: 0,
        error_summary: { critical: 0, high: 0, medium: 0, low: 0 },
        system_errors: [],
        timestamp: new Date().toISOString()
      });
      return;
    }

    setLoading(true);
    try {
      const red = computeRedCheckErrors();
      const errorSummary = red.reduce(
        (acc, e) => {
          acc[e.severity] = (acc as any)[e.severity] + 1;
          return acc;
        },
        { critical: 0, high: 0, medium: 0, low: 0 } as any
      );
      setErrorData({
        success: true,
        domain_errors: [],
        total_errors: red.length,
        error_summary: errorSummary,
        system_errors: [],
        timestamp: new Date().toISOString()
      });
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('Failed to load domain errors:', error);
      toast.error(`Failed to load domain errors: ${error.message}`);
      setErrorData({
        success: false,
        domain_errors: [],
        total_errors: 0,
        error_summary: { critical: 0, high: 0, medium: 0, low: 0 },
        system_errors: [`Failed to load errors: ${error.message}`],
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshDomainErrors = async (domainId: string, domainName: string) => {
    setRefreshingDomain(domainId);
    try {
      await loadErrors();
      toast.success(`Refreshed errors for ${domainName}`);
    } catch (error: any) {
      console.error('Failed to refresh domain errors:', error);
      toast.error(`Failed to refresh errors for ${domainName}: ${error.message}`);
    } finally {
      setRefreshingDomain(null);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}
      >
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'dns':
        return <Globe className="h-4 w-4" />;
      case 'host':
        return <ExternalLink className="h-4 w-4" />;
      case 'ssl':
        return <Shield className="h-4 w-4" />;
      case 'edge_function':
        return <Zap className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const groupErrorsByDomain = (errors: DomainError[]) => {
    return errors.reduce((acc, error) => {
      if (!acc[error.domain]) {
        acc[error.domain] = [];
      }
      acc[error.domain].push(error);
      return acc;
    }, {} as Record<string, DomainError[]>);
  };

  const runPushDiagnostics = async () => {
    if (!user?.id) {
      toast.error('Sign in to run diagnostics');
      return;
    }
    setDiagLoading(true);
    try {
      const { data: diag } = await supabase.functions.invoke('push-to-host', { body: { diagnose: true } });
      const d = (diag as any)?.diagnostics || {};
      const secrets = {
        hasToken: !!d.hasNetlifyToken,
        hasSiteId: !!d.hasNetlifySiteId,
        hasSupabaseUrl: !!d.hasSupabaseUrl,
        hasServiceKey: !!d.hasSupabaseServiceKey,
        sources: d.sources || null
      };

      // Server-side listing of aliases (no client secrets)
      const listRes: any = await (await import('@/utils/domainsApiHelper')).DomainsApiHelper.invokeEdgeFunction('domains', { action: 'list', user_id: user.id });
      const aliasesRaw: string[] = (listRes as any)?.aliases || (listRes as any)?.synced_domains || [];
      const norm = (s: string) => String(s || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\.$/, '').replace(/^www\./, '');
      const aliasSet = new Set<string>();
      (aliasesRaw || []).forEach(a => { const n = norm(a); if (n) { aliasSet.add(n); aliasSet.add(`www.${n}`); }});
      const aliases = Array.from(new Set(Array.from(aliasSet)));

      const expected = domains
        .filter((d: any) => d.status === 'active' || d.netlify_verified === true)
        .map((d: any) => d.domain?.toLowerCase())
        .filter(Boolean);
      const missing = expected.filter((d: string) => {
        const apex = norm(d);
        return !(aliasSet.has(apex) || aliasSet.has(`www.${apex}`));
      });

      setPushDiag({ secrets, aliases, missing });
      if (!secrets.hasToken || !secrets.hasSiteId) {
        toast.error('Missing Netlify token/site (using client or edge)');
      } else if (missing.length > 0) {
        toast.warning(`${missing.length} domain(s) not in Netlify aliases`);
      } else {
        toast.success('Diagnostics OK: secrets present and aliases match');
      }
    } catch (e: any) {
      toast.error(e.message || 'Diagnostics failed');
    } finally {
      setDiagLoading(false);
    }
  };

  const attemptAliasMerge = async () => {
    if (!user?.id) return;
    setDiagLoading(true);
    try {
      // Preferred: use Edge helper (server-side secrets only)
      try {
        const { data, error } = await supabase.functions.invoke('push-to-host', { body: { user_id: user.id } });
        if (error) throw error;
        toast.success(`Merged aliases (${(data as any)?.count || (data as any)?.updatedAliases?.length || 0})`);
      } catch {
        // Fallback: call netlify-domains sync (server-side)
        const data: any = await (await import('@/utils/domainsApiHelper')).DomainsApiHelper.invokeEdgeFunction('domains', { action: 'sync', user_id: user.id });
        toast.success(`Synced aliases (${(data as any)?.count || (data as any)?.updatedAliases?.length || 0})`);
      }
      await runPushDiagnostics();
    } catch (e: any) {
      toast.error(e.message || 'Alias merge failed');
    } finally {
      setDiagLoading(false);
    }
  };

  const handleTroubleshootAll = async () => {
    try {
      setTroubleshooting(true);
      await attemptAliasMerge();
      await loadErrors();
      toast.success('Troubleshoot complete');
    } catch (err: any) {
      console.error('Troubleshoot failed:', err);
      toast.error(err.message || 'Troubleshoot failed');
    } finally {
      setTroubleshooting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Scanning domains for errors...</p>
      </div>
    );
  }

  if (!errorData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to load error data
        </h3>
        <Button onClick={loadErrors}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const redCheckErrors = computeRedCheckErrors();
  const combinedErrors = [...(errorData.domain_errors || []), ...redCheckErrors];

  const errorSummary = combinedErrors.reduce(
    (acc, error) => { acc[error.severity] = (acc as any)[error.severity] + 1; return acc; },
    { critical: 0, high: 0, medium: 0, low: 0 } as any
  );
  const groupedErrors = groupErrorsByDomain(combinedErrors);

  return (
    <div className="space-y-6">
      {/* Errors across Netlify • Supabase • SSL • DNS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-6 w-6 text-gray-600 mr-3" />
            <div>
              <p className="text-xl font-bold text-gray-900">{combinedErrors.length}</p>
              <p className="text-sm text-gray-600">Total Errors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="text-xl font-bold text-gray-900">{errorSummary.critical}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <AlertCircle className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <p className="text-xl font-bold text-gray-900">{errorSummary.high}</p>
              <p className="text-sm text-gray-600">High</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Info className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <p className="text-xl font-bold text-gray-900">{errorSummary.medium}</p>
              <p className="text-sm text-gray-600">Medium</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="text-xl font-bold text-gray-900">{errorSummary.low}</p>
              <p className="text-sm text-gray-600">Low</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="text-sm text-gray-500">
          {lastRefresh && `Last scanned: ${lastRefresh.toLocaleTimeString()}`}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={runPushDiagnostics} disabled={diagLoading} variant="outline">
            {diagLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            Push-To-Host Diagnostics
          </Button>
          <Button onClick={attemptAliasMerge} disabled={diagLoading}>
            {diagLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ExternalLink className="h-4 w-4 mr-2" />}
            Attempt Fix
          </Button>
          <Button onClick={handleTroubleshootAll} disabled={troubleshooting}>
            {troubleshooting ? (
              <Wrench className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wrench className="h-4 w-4 mr-2" />
            )}
            Troubleshoot
          </Button>
          <Button onClick={loadErrors} disabled={loading} variant="outline">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh All
          </Button>
        </div>
      </div>

      {/* Push-To-Host Diagnostics Panel */}
      {pushDiag && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" /> Push-To-Host Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded">
                <div className="text-sm font-medium mb-1">Secrets</div>
                <ul className="text-xs space-y-1">
                  <li className={pushDiag.secrets.hasToken ? 'text-green-700' : 'text-red-700'}>Netlify Token: {pushDiag.secrets.hasToken ? 'OK' : 'Missing'}</li>
                  <li className={pushDiag.secrets.hasSiteId ? 'text-green-700' : 'text-red-700'}>Site ID: {pushDiag.secrets.hasSiteId ? 'OK' : 'Missing'}</li>
                  <li className={pushDiag.secrets.hasSupabaseUrl ? 'text-green-700' : 'text-red-700'}>SUPABASE_URL/PROJECT_URL: {pushDiag.secrets.hasSupabaseUrl ? 'OK' : 'Missing'}</li>
                  <li className={pushDiag.secrets.hasServiceKey ? 'text-green-700' : 'text-red-700'}>SERVICE_ROLE_KEY: {pushDiag.secrets.hasServiceKey ? 'OK' : 'Missing'}</li>
                </ul>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm font-medium mb-1">Current Netlify Aliases</div>
                <div className="text-xs text-gray-700">{pushDiag.aliases.length} total</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm font-medium mb-1">Missing Aliases</div>
                {pushDiag.missing.length === 0 ? (
                  <div className="text-xs text-green-700">None</div>
                ) : (
                  <ul className="text-xs text-red-700 list-disc list-inside">
                    {pushDiag.missing.map((m) => (<li key={m}>{m}</li>))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Errors */}
      {errorData.system_errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">System Errors Detected:</div>
            <ul className="list-disc list-inside space-y-1">
              {errorData.system_errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Domain Errors */}
      {combinedErrors.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No errors detected
          </h3>
          <p className="text-gray-500">
            All domains are properly configured and functioning.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Errors — Netlify • Supabase • SSL • DNS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedErrors).map(([domain, errors]) => (
                <AccordionItem key={domain} value={domain}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{domain}</span>
                        <Badge variant="destructive" className="text-xs">
                          {errors.length} error{errors.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...new Set(errors.map(e => e.severity))].map(severity => (
                          <div key={severity} className="flex items-center gap-1">
                            {getSeverityIcon(severity)}
                            <span className="text-xs">{errors.filter(e => e.severity === severity).length}</span>
                          </div>
                        ))}
                        <Button asChild variant="ghost" size="sm" disabled={refreshingDomain === domains.find(d => d.domain === domain)?.id}>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              const domainData = domains.find(d => d.domain === domain);
                              if (domainData) {
                                refreshDomainErrors(domainData.id, domain);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                const domainData = domains.find(d => d.domain === domain);
                                if (domainData) {
                                  refreshDomainErrors(domainData.id, domain);
                                }
                              }
                            }}
                          >
                            {refreshingDomain === domains.find(d => d.domain === domain)?.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {errors.map((error, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getSourceIcon(error.source)}
                              <div>
                                <div className="font-medium text-sm">{error.validation_type}</div>
                                <div className="text-xs text-gray-500">{error.source.toUpperCase()}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSeverityBadge(error.severity)}
                              <span className="text-xs text-gray-500">
                                {new Date(error.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-800">{error.message}</p>
                            {error.error_code && (
                              <p className="text-xs text-gray-500 mt-1">Error Code: {error.error_code}</p>
                            )}
                          </div>

                          {error.recommendations && error.recommendations.length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                              <div className="text-xs font-medium text-blue-800 mb-2">Recommendations:</div>
                              <ul className="text-xs text-blue-700 space-y-1">
                                {error.recommendations.map((rec, recIndex) => (
                                  <li key={recIndex} className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {error.details && (
                            <details className="mt-3">
                              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                Show technical details
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                                {JSON.stringify(error.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainErrorsTab;
