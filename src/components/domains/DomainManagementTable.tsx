import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Settings,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import NetlifyApiService from '@/services/netlifyApiService';
import { DomainsApiHelper } from '@/utils/domainsApiHelper';
import useDomainRealTimeSync from '@/hooks/useDomainRealTimeSync';

const DomainPreviewFrame: React.FC<{ domain: string; onStatusChange?: (status: 'loading'|'ready'|'failed', seed?: string) => void }> = ({ domain, onStatusChange }) => {
  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const domainKey = String(domain).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  const storageUrl = supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/themes/${encodeURIComponent(domainKey)}/post.html` : null;
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setFailed(false);
    setLoading(true);
    setSrcUrl(null);
    const tryFetch = async () => {
      try {
        if (!supabaseUrl) return;

        // Resolve preferredTheme for domain
        let preferredTheme = null;
        try {
          const { data: row } = await supabase.from('domains').select('selected_theme, blog_theme_template_key').eq('domain', domainKey).maybeSingle();
          preferredTheme = (row && (row.selected_theme || row.blog_theme_template_key)) || null;
        } catch (e) {}

        // If preferredTheme is random-ai-generated, request preview HTML directly and return
        try {
          const norm = String(preferredTheme || '').toLowerCase().replace(/_/g,'-').trim();
          if (norm === 'random-ai-generated') {
            const fallback = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/themes/random/index.html`;
            setSrcUrl(fallback);
            const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
            const base = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || (import.meta as any).env?.NETLIFY_FUNCTIONS_URL || '';
            const cleanBase = String(base || '').replace(/\/$/, '');
            const fnBase = /\/\.netlify\/functions\/?$/.test(cleanBase) ? cleanBase : `${cleanBase}/.netlify/functions`;
            const fnUrl = cleanBase ? `${fnBase.replace(/\/$/, '')}/randomthemePreview` : '/.netlify/functions/randomthemePreview';
            try {
              const r2 = await fetch(`${fnUrl}?domain=${encodeURIComponent(domainKey)}&seed=${encodeURIComponent(seed)}`);
              if (r2.ok) {
                const html2 = await r2.text();
                if (cancelled) return;
                setHtml(html2);
                setLoading(false);
                try { onStatusChange?.('ready', seed); } catch {}
                try { toast.success('Random preview updated'); } catch {}
                return;
              }
            } catch (e) { console.warn('randomthemePreview fetch failed', e && (e.message || e)); }
          }
        } catch (e) {}

        // Map known special theme keys to storage folders
        const normPreferred = String(preferredTheme || '').toLowerCase().replace(/_/g,'-').trim();
        const mappedPreferred = normPreferred === 'random-ai-generated' ? 'random' : preferredTheme;
        // If HTML is selected, use domain folder for preview; otherwise use mapped theme or domainKey
        const useTheme = normPreferred === 'html' ? domainKey : (mappedPreferred ? mappedPreferred : domainKey);
        const fetchUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/themes/${encodeURIComponent(useTheme)}/post.html`;
        setSrcUrl(fetchUrl);

        const res = await fetch(fetchUrl, { headers: { 'Accept': 'text/html' } });
        const text = await res.text();
        if (!cancelled) {
          if (/<!DOCTYPE|<html[\s>]/i.test(text)) {
            let processed = text;

            setHtml(processed);
            setLoading(false);
            try { onStatusChange?.('ready'); } catch {}
          } else {
            setFailed(true);
            setLoading(false);
            try { onStatusChange?.('failed'); } catch {}
          }
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          setLoading(false);
        }
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [storageUrl, domain]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-pulse text-sm text-muted-foreground">Generating preview…</div>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <svg className="w-6 h-6 animate-spin text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
          </div>
        </div>
      </div>
    );
  }

  if (html) {
    return (
      <iframe
        title={`preview-${domain}`}
        srcDoc={html}
        className="w-full h-full border"
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    );
  }
  const directUrl = `https://${domain}`;
  const src = srcUrl || (failed || !storageUrl ? directUrl : storageUrl);
  return (
    <iframe
      title={`preview-${domain}`}
      src={src}
      className="w-full h-full border"
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

interface Domain {
  id: string;
  domain: string;
  status?: 'pending' | 'validating' | 'validated' | 'error' | 'dns_ready' | 'theme_selection' | 'active';
  netlify_verified?: boolean;
  dns_verified?: boolean;
  created_at: string;
  updated_at?: string;
  error_message?: string;
  dns_records?: DNSRecord[];
  selected_theme?: string;
  theme_name?: string;
  blog_enabled?: boolean;
  user_id?: string;
  ssl_status?: 'none' | 'pending' | 'issued' | 'error';
  custom_domain?: boolean;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  status: 'pending' | 'verified' | 'error';
}

interface NetlifyDomain {
  domain: string;
  isCustomDomain: boolean;
  isAlias: boolean;
  sslStatus?: string;
}

const DomainManagementTable = () => {
  const { user } = useAuthState();
  const {
    domains,
    syncStatus,
    isLoading,
    actions: { triggerSync, loadDomains, checkNetlifySync }
  } = useDomainRealTimeSync(user?.id);

  const [netlifyDomains, setNetlifyDomains] = useState<NetlifyDomain[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingDomain, setDeletingDomain] = useState<string | null>(null);
  const [previewDomain, setPreviewDomain] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSeed, setPreviewSeed] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [addToNetlify, setAddToNetlify] = useState(true);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadAllDomains();
    }
  }, [user]);

  const loadAllDomains = async () => {
    try {
      // Load domains from Netlify
      await loadNetlifyDomains();

      // Trigger sync (domains are loaded via hook)
      await triggerSync();
    } catch (error: any) {
      console.error('Error loading domains:', error);
      const { formatErrorForUI } = await import('@/utils/errorUtils');
      toast.error(`Failed to load domains: ${formatErrorForUI(error)}`);
    }
  };

  const loadNetlifyDomains = async () => {
    try {
      const siteInfo = await NetlifyApiService.getSiteInfo();
      
      if (siteInfo.success && siteInfo.data) {
        const netlifyDomainList: NetlifyDomain[] = [];
        
        // Add custom domain if exists
        if (siteInfo.data.custom_domain) {
          netlifyDomainList.push({
            domain: siteInfo.data.custom_domain,
            isCustomDomain: true,
            isAlias: false
          });
        }
        
        // Add domain aliases
        if (siteInfo.data.domain_aliases) {
          siteInfo.data.domain_aliases.forEach(domain => {
            netlifyDomainList.push({
              domain,
              isCustomDomain: false,
              isAlias: true
            });
          });
        }
        
        setNetlifyDomains(netlifyDomainList);
      } else {
        console.warn('Could not load Netlify domains:', siteInfo.error);
        setNetlifyDomains([]);
      }
    } catch (error: any) {
      console.error('Error loading Netlify domains:', error);
      setNetlifyDomains([]);
    }
  };

  const performTwoWaySync = async () => {
    if (!user) return;

    setSyncing(true);
    try {
      const dbDomainNames = new Set(domains.map(d => d.domain));
      const netlifyDomainNames = new Set(netlifyDomains.map(d => d.domain));
      
      let syncUpdates = 0;

      // Sync domains from Netlify to database (if missing)
      for (const netlifyDomain of netlifyDomains) {
        if (!dbDomainNames.has(netlifyDomain.domain)) {
          const { error } = await supabase
            .from('domains')
            .insert({
              domain: netlifyDomain.domain,
              user_id: user.id,
              netlify_verified: true,
              status: 'active',
              custom_domain: netlifyDomain.isCustomDomain
            });

          if (!error) {
            syncUpdates++;
            toast.success(`Added ${netlifyDomain.domain} from Netlify to database`);
          }
        }
      }

      // Update database domains that exist in Netlify
      for (const domain of domains) {
        const netlifyDomain = netlifyDomains.find(nd => nd.domain === domain.domain);
        
        if (netlifyDomain && !domain.netlify_verified) {
          const { error } = await supabase
            .from('domains')
            .update({
              netlify_verified: true,
              status: 'active',
              error_message: null,
              custom_domain: netlifyDomain.isCustomDomain
            })
            .eq('id', domain.id);

          if (!error) {
            syncUpdates++;
          }
        } else if (!netlifyDomain && domain.netlify_verified) {
          // Domain was removed from Netlify
          const { error } = await supabase
            .from('domains')
            .update({
              netlify_verified: false,
              status: 'error',
              error_message: 'Domain not found in Netlify site'
            })
            .eq('id', domain.id);

          if (!error) {
            syncUpdates++;
          }
        }
      }

      if (syncUpdates > 0) {
        toast.success(`Synchronized ${syncUpdates} domain(s)`);
        await loadDatabaseDomains(); // Refresh database domains
      }

    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const addDomain = async () => {
    if (!newDomain.trim() || !user) return;

    const cleanedDomain = newDomain.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    setProcessingActions(prev => new Set(prev).add('add'));

    try {
      // Call the edge function which will add to Netlify and upsert into Supabase on success
      const siteId = (import.meta as any).env?.VITE_NETLIFY_SITE_ID as string | undefined;
      const token = (import.meta as any).env?.VITE_NETLIFY_ACCESS_TOKEN as string | undefined;

      const data: any = await DomainsApiHelper.addDomain(cleanedDomain);

      if (!data || data.success === false) {
        const msg = data?.error || data?.message || 'Failed to add domain via edge function';
        throw new Error(msg);
      }

      toast.success(`Domain ${cleanedDomain} added and verified with Netlify & Supabase`);

      // Ensure a DB row exists for this user (claim or insert if missing)
      try {
        // Try to claim an unowned row
        const { data: existingRows } = await supabase
          .from('domains')
          .select('id, user_id, netlify_verified')
          .eq('domain', cleanedDomain)
          .limit(3);

        const owned = (existingRows || []).find(r => r.user_id === user.id);
        if (!owned) {
          // If a row exists without user_id, claim it; otherwise insert a new one
          const unowned = (existingRows || []).find(r => !r.user_id);
          if (unowned) {
            await supabase
              .from('domains')
              .update({ user_id: user.id, netlify_verified: true, status: 'active', selected_theme: 'HTML' })
              .eq('id', unowned.id);
          } else {
            await supabase
              .from('domains')
              .insert({ domain: cleanedDomain, user_id: user.id, netlify_verified: true, status: 'active', selected_theme: 'HTML' });
          }
        }
      } catch {}

      // Refresh data
      setNewDomain('');
      setAddDialogOpen(false);
      await loadDomains();

    } catch (error: any) {
      console.error('Add domain error:', error);
      const { formatErrorForUI } = await import('@/utils/errorUtils');
      toast.error(`Failed to add domain: ${formatErrorForUI(error)}`);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete('add');
        return newSet;
      });
    }
  };

  const editDomain = async (domainId: string, oldDomain: string, newDomainName: string) => {
    if (!user || !newDomainName.trim()) return;

    const cleanedDomain = newDomainName.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    setProcessingActions(prev => new Set(prev).add(domainId));

    try {
      // Update in database
      const { error: dbError } = await supabase
        .from('domains')
        .update({
          domain: cleanedDomain,
          updated_at: new Date().toISOString()
        })
        .eq('id', domainId)
        .eq('user_id', user.id);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Handle Netlify updates
      const domain = domains.find(d => d.id === domainId);
      if (domain?.netlify_verified) {
        try {
          // Note: Domain removal from Netlify requires manual action in dashboard
          console.log(`⚠️ Manual removal required: ${oldDomain} from Netlify site`);
          toast.warning(`Please manually remove ${oldDomain} from Netlify dashboard`, {
            duration: 5000
          });

          // Add new domain to Netlify
          const netlifyResult = await NetlifyApiService.addDomainAlias(cleanedDomain);
          
          if (!netlifyResult.success) {
            toast.warning(`Database updated but Netlify update failed: ${netlifyResult.error}`);
            
            // Update database to reflect Netlify status
            await supabase
              .from('domains')
              .update({
                netlify_verified: false,
                error_message: netlifyResult.error
              })
              .eq('id', domainId);
          }
        } catch (netlifyError: any) {
          toast.warning(`Database updated but Netlify update failed: ${netlifyError.message}`);
        }
      }

      toast.success(`Domain updated: ${oldDomain} → ${cleanedDomain}`);
      setEditingDomain(null);
      await loadDomains();

    } catch (error: any) {
      console.error('Edit domain error:', error);
      toast.error(`Failed to edit domain: ${error.message}`);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainId);
        return newSet;
      });
    }
  };

  const deleteDomain = async (domainId: string, domainName: string) => {
    if (!user) return;

    setProcessingActions(prev => new Set(prev).add(domainId));

    try {
      const domain = domains.find(d => d.id === domainId);

      // Remove from Netlify if it exists there
      if (domain?.netlify_verified) {
        // Note: Domain removal from Netlify requires manual action in dashboard
        console.log(`⚠️ Manual removal required: ${domainName} from Netlify site`);
        toast.info(`Domain will be removed from database. Please also remove ${domainName} from Netlify dashboard if needed.`, {
          duration: 5000
        });
      }

      // Remove from database
      const { error: dbError } = await supabase
        .from('domains')
        .delete()
        .eq('id', domainId)
        .eq('user_id', user.id);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast.success(`Domain ${domainName} deleted successfully`);
      setDeletingDomain(null);
      await loadDomains();

    } catch (error: any) {
      console.error('Delete domain error:', error);
      toast.error(`Failed to delete domain: ${error.message}`);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (domain: Domain) => {
    const netlifyDomain = netlifyDomains.find(nd => nd.domain === domain.domain);
    
    if (netlifyDomain && domain.netlify_verified) {
      return <Badge className="bg-green-600">Synced</Badge>;
    } else if (domain.netlify_verified) {
      return <Badge variant="default" className="bg-blue-600">In Netlify</Badge>;
    } else if (netlifyDomain) {
      return <Badge variant="outline" className="border-orange-400 text-orange-600">Netlify Only</Badge>;
    } else if (domain.error_message) {
      return <Badge variant="destructive">Error</Badge>;
    } else {
      return <Badge variant="secondary">Database Only</Badge>;
    }
  };

  const getSyncStatus = (domain: Domain) => {
    const netlifyDomain = netlifyDomains.find(nd => nd.domain === domain.domain);
    
    if (netlifyDomain && domain.netlify_verified) {
      return { status: 'synced', icon: CheckCircle2, color: 'text-green-600' };
    } else if (domain.error_message) {
      return { status: 'error', icon: AlertTriangle, color: 'text-red-600' };
    } else if (!netlifyDomain && domain.netlify_verified) {
      return { status: 'missing_netlify', icon: AlertTriangle, color: 'text-orange-600' };
    } else if (netlifyDomain && !domain.netlify_verified) {
      return { status: 'missing_db', icon: AlertTriangle, color: 'text-blue-600' };
    } else {
      return { status: 'pending', icon: AlertTriangle, color: 'text-gray-400' };
    }
  };

  if (!user) {
    return (
      <Alert className="border-gray-200">
        <Globe className="h-4 w-4" />
        <AlertDescription>
          Please sign in to manage your domains.
        </AlertDescription>
      </Alert>
    );
  }

  // Derive issue counts for alert banner
  const issues = domains.filter(d => (d.netlify_verified === false) || (d.dns_verified === false) || d.status === 'error');
  const issueCount = issues.length;

  async function reverifyAll() {
    if (!user) return;
    try {
      const names = domains.map(d => d.domain);
      const { data, error } = await supabase.functions.invoke('domains-verify', { body: { domains: names, user_id: user.id } });
      if (error) throw error;
      toast.success('Re-verified all domains');
      await loadDomains();
    } catch (e: any) {
      toast.error(e.message || 'Re-verify failed');
    }
  }

  return (
    <div className="space-y-6">
      {/* Auto-detection alert */}
      {issueCount > 0 && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {issueCount} domain(s) need attention. Some lost Netlify/DNS verification.
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={reverifyAll} className="mr-2">
                Re-verify now
              </Button>
              <Button size="sm" variant="ghost" onClick={triggerSync}>Refresh</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Domain Management</h2>
            <div className="flex items-center gap-2">
              {syncStatus.isMonitoring ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Live Sync</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs font-medium">Offline</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">Manage domains with two-way sync between database and Netlify</p>
          {syncStatus.lastSync && (
            <p className="text-xs text-gray-500 mt-1">
              Last sync: {syncStatus.lastSync.toLocaleTimeString()} •
              {syncStatus.syncCount} sync(s) •
              {syncStatus.errorCount} error(s)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.location.assign('/automation')}>Go to Automation</Button>
          <Button
            variant="outline"
            onClick={triggerSync}
            disabled={isLoading || syncing}
          >
            {isLoading || syncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {syncing ? 'Syncing...' : 'Refresh & Sync'}
          </Button>


          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Domain</DialogTitle>
                <DialogDescription>
                  Add a domain to your database and optionally to Netlify
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="addToNetlify"
                    checked={addToNetlify}
                    onChange={(e) => setAddToNetlify(e.target.checked)}
                  />
                  <label htmlFor="addToNetlify" className="text-sm">
                    Also add to Netlify
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addDomain}
                  disabled={!newDomain.trim() || processingActions.has('add')}
                >
                  {processingActions.has('add') ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Domain'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sync Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{domains.length}</div>
              <div className="text-sm text-gray-600">Database Domains</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{netlifyDomains.length}</div>
              <div className="text-sm text-gray-600">Netlify Domains</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {domains.filter(d => d.netlify_verified).length}
              </div>
              <div className="text-sm text-gray-600">Synced Domains</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {domains.filter(d => d.error_message).length}
              </div>
              <div className="text-sm text-gray-600">Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Domains ({domains.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading domains...</p>
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No domains found
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first domain to get started
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => {
                  const syncStatus = getSyncStatus(domain);
                  const IconComponent = syncStatus.icon;
                  
                  return (
                    <TableRow key={domain.id}>
                      <TableCell>
                        {editingDomain === domain.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-48"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  editDomain(domain.id, domain.domain, editValue);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => editDomain(domain.id, domain.domain, editValue)}
                              disabled={processingActions.has(domain.id)}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingDomain(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{domain.domain}</span>
                                                      </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(domain)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${syncStatus.color}`} />
                          <span className="text-sm capitalize">{syncStatus.status.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(domain.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {processingActions.has(domain.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDomain(domain.id);
                                setEditValue(domain.domain);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Domain
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingDomain(domain.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Site
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  const { error } = await supabase.from('domains').update({ selected_theme: 'HTML' }).eq('id', domain.id);
                                  if (error) throw error;
                                  toast.success('Theme set to HTML');
                                } catch (e) {
                                  const msg = (e && (e as any).message) || 'Failed to set theme';
                                  toast.error(msg);
                                }
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Use HTML Theme
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setPreviewDomain(domain.domain); setPreviewOpen(true); }}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deletingDomain && (
        <Dialog open={!!deletingDomain} onOpenChange={() => setDeletingDomain(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Domain</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this domain? This will remove it from both your database and Netlify.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletingDomain(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const domain = domains.find(d => d.id === deletingDomain);
                  if (domain) {
                    deleteDomain(domain.id, domain.domain);
                  }
                }}
                disabled={processingActions.has(deletingDomain)}
              >
                {processingActions.has(deletingDomain) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Domain'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Domain Dialog */}
      <Dialog open={previewOpen} onOpenChange={(open) => { if(!open) setPreviewDomain(null); setPreviewOpen(open); }}>
        <DialogContent className="w-full max-w-4xl h-[75vh]">
          <DialogHeader>
            <DialogTitle>Preview Domain</DialogTitle>
            <DialogDescription>
              Live preview of the domain root URL. Note: some sites may block embedding via X-Frame-Options.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 h-[60vh]">
            {previewDomain ? (
              <DomainPreviewFrame domain={previewDomain} onStatusChange={(status, seed) => { if (status === 'ready') { setPreviewSeed(seed || null); setPreviewFailed(false); } else if (status === 'failed') { setPreviewFailed(true); setPreviewSeed(null); } }} />
            ) : (
              <div className="text-sm text-gray-500">No domain selected</div>
            )}
          </div>

          <DialogFooter>
            <div className="flex-1 text-sm text-muted-foreground">
              {previewSeed ? (<span>Seed: <span className="font-mono text-xs">{previewSeed}</span></span>) : null}
              {(!previewSeed && previewFailed) ? (<span className="text-red-600"> Preview failed — try opening in a new tab.</span>) : null}
            </div>
            <Button variant="outline" onClick={() => { setPreviewOpen(false); setPreviewDomain(null); setPreviewSeed(null); }}>Close</Button>
            {previewDomain && (
              <Button onClick={() => window.open(`https://${previewDomain}`, '_blank')}>Open in new tab</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainManagementTable;
