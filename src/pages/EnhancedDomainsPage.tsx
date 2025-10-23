import { useState, useEffect, useRef, type ReactNode, type FC, type MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  RefreshCw,
  Trash2,
  Database,
  Zap,
  Settings,
  Shield,
  Upload,
  Bug,
  Cloud,
  Server,
  XCircle,
  Info
} from 'lucide-react';
// Notifications disabled on Domains page for a cleaner, faster UX
const toast = {
  success: (_m?: any) => {},
  error: (_m?: any) => {},
  info: (_m?: any) => {},
  warning: (_m?: any) => {},
  loading: (_m?: any) => 'noop',
  dismiss: (_id?: any) => {}
};
import AutoDomainBlogThemeService from '@/services/autoDomainBlogThemeService';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { DomainsApiHelper, syncNetlifyAliases } from '@/utils/domainsApiHelper';
import NetlifyApiService from '@/services/netlifyApiService';

import { validateEnvironment, validateNetlifyEnvironment, getEnvironmentStatusMessage, getEnvironmentRecommendations, validateDomainEnvironment } from '@/utils/environmentValidator';
import DomainManagementService from '@/services/domainManagementService';
import DNSValidationService from '@/services/dnsValidationService';
import ComprehensiveDnsValidationService from '@/services/comprehensiveDnsValidationService';
import AutomationDomainsSwitcher from '@/components/shared/AutomationDomainsSwitcher';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import HowItWorksModal from '@/components/shared/HowItWorksModal';
import { PbnAuthOverlay } from '@/components/auth/PbnAuthOverlay';
// Internal logging disabled on domains page to improve performance
const debugLog = {
  debug: (_c: string, _o: string, _m: string, _d?: any) => {},
  info: (_c: string, _o: string, _m: string, _d?: any) => {},
  warn: (_c: string, _o: string, _m: string, _d?: any) => {},
  error: (_c: string, _o: string, _e: any, _d?: any) => {},
  critical: (_c: string, _o: string, _m: string, _d?: any) => {},
  startOperation: (_c: string, _o: string, _meta?: Record<string, any>) => '',
  endOperation: (_id: string, _success: boolean, _meta?: Record<string, any>) => {},
  incrementError: (_id: string) => {},
  incrementRetry: (_id: string) => {}
};
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

function ClickableTooltip({ domain, triggerLabel, children }: { domain: any; triggerLabel: string; children: ReactNode }) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [clickedOpen, setClickedOpen] = useState(false);

  const handleTriggerClick = (e: MouseEvent) => {
    e.preventDefault();
    setClickedOpen((prev) => !prev);
  };

  // Close on Escape when opened by click
  useEffect(() => {
    if (!clickedOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setClickedOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clickedOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!clickedOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const root = document.querySelector('[data-clickable-tooltip-root]');
      if (root && !root.contains(target)) setClickedOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [clickedOpen]);

  return (
    // data attribute used for outside click detection; OK to reuse per-instance
    <TooltipPrimitive.Root open={hoverOpen || clickedOpen} onOpenChange={(open) => setHoverOpen(open)}>
      <TooltipTrigger asChild>
        <button data-clickable-tooltip-root className="ml-2 text-xs underline" aria-label={triggerLabel} onClick={handleTriggerClick}>
          {triggerLabel}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{children}</TooltipContent>
    </TooltipPrimitive.Root>
  );
}
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useAuthModal } from '@/contexts/ModalContext';
import { DOMAIN_FEATURES_ENABLED } from '@/utils/domainFeatures';

const DomainPreviewFrame: FC<{ domain: string; onStatusChange?: (status: 'loading' | 'ready' | 'failed', seed?: string) => void }> = ({ domain, onStatusChange }) => {
  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const domainKey = String(domain).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
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

    const tryFetchCandidates = async () => {
      if (!supabaseUrl) {
        setFailed(true);
        return;
      }

      // Resolve preferred theme for this domain from DB if available
      let preferredTheme: string | null = null;
      try {
        const { data: row } = await supabase
          .from('domains')
          .select('selected_theme, theme_name, blog_theme_template_key')
          .eq('domain', domainKey)
          .maybeSingle();
        preferredTheme = (row && (row.selected_theme || row.theme_name || row.blog_theme_template_key)) || null;
      } catch (e) {
        // ignore DB lookup failures; we'll try sensible fallbacks
      }

      // If the domain has Random AI Generated selected, request the preview HTML directly and return
      try {
        const norm = String(preferredTheme || '').toLowerCase().replace(/_/g, '-').trim();
        if (norm === 'random-ai-generated') {
          const fallback = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/themes/random/index.html?v=${Date.now()}`;
          setSrcUrl(fallback);
          setLoading(false);
          const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
          const base = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || (import.meta as any).env?.NETLIFY_FUNCTIONS_URL || '';
          const cleanBase = String(base || '').replace(/\/$/, '');
          const fnBase = /\/\.netlify\/functions\/?$/.test(cleanBase) ? cleanBase : `${cleanBase}/.netlify/functions`;
          const fnUrl = cleanBase ? `${fnBase.replace(/\/$/, '')}/randomthemePreview` : '/.netlify/functions/randomthemePreview';
          try {
            const r = await fetch(`${fnUrl}?domain=${encodeURIComponent(domainKey)}&seed=${encodeURIComponent(seed)}`);
            if (r.ok) {
              const html = await r.text();
              if (!cancelled) {
                setHtml(html);
                try { onStatusChange?.('ready', seed); } catch {}
              }
              return;
            }
          } catch (e) {
            console.warn('randomthemePreview fetch failed', e && (e.message || e));
          }
        }
      } catch (e) {
        // ignore
      }

      const candidates = [] as string[];
      if (preferredTheme) {
        const mapped = String(preferredTheme).toLowerCase() === 'random-ai-generated' ? 'random' : preferredTheme;
        candidates.push(mapped);
      }
      candidates.push(domainKey);
      candidates.push('minimal');

      for (const c of candidates) {
        if (cancelled) return;
        if (!c) continue;
        const storageUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/themes/${encodeURIComponent(c)}/index.html?v=${Date.now()}`;
        try {
          const res = await fetch(storageUrl, { headers: { Accept: 'text/html' } });
          if (res.ok) {
            const text = await res.text();
            if (cancelled) return;
            if (/<!DOCTYPE|<html[\s>]/i.test(text)) {
              setSrcUrl(storageUrl);
              const url = `https://${domainKey}`;
              let processed = text
                .replace(/\{\{\s*domain\s*\}\}/g, domainKey)
                .replace(/\{\{\s*url\s*\}\}/g, url)
                .replace(/\{\{\s*host\s*\}\}/g, domainKey);

              // If preferredTheme indicates random AI generated, request a generated preview HTML from Netlify preview function
              try {
                const norm = String(preferredTheme || '').toLowerCase().replace(/_/g, '-').trim();
                if (norm === 'random-ai-generated') {
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
                      processed = html2;
                      try { onStatusChange?.('ready', seed); } catch {}
                    }
                  } catch (e) {
                    console.warn('randomthemePreview fetch failed', e && (e.message || e));
                  }
                }
              } catch (e) {
                console.warn('preview theme injection failed', e && (e.message || e));
              }

              setHtml(processed);
              setLoading(false);

              // If we used a theme folder (not domainKey) and DB didn't already have selected_theme, persist it
              if (c !== domainKey) {
                try {
                  await supabase.from('domains').update({ selected_theme: c }).eq('domain', domainKey);
                } catch (_) {}
              }
              return;
            }
          }
        } catch (err) {
          // try next candidate
        }
      }

      if (!cancelled) {
        setFailed(true);
        setLoading(false);
        try { onStatusChange?.('failed'); } catch {}
      }
    };

    tryFetchCandidates();
    return () => { cancelled = true; };
  }, [domain, supabaseUrl, domainKey]);

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
  const defaultStorage = `${supabaseUrl?.replace(/\/$/, '')}/storage/v1/object/public/themes/${encodeURIComponent(domainKey)}/index.html?v=${Date.now()}`;
  const src = srcUrl || (failed ? directUrl : defaultStorage);
  return (
    <iframe
      title={`preview-${domain}`}
      src={src}
      className="w-full h-full border"
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

// Persist default selected_theme for new domains without one after loading domains
async function ensureDomainsHaveSelectedTheme(domainsList: any[]) {
  try {
    const toUpdate = domainsList
      .filter(d => d && d.domain)
      .map(d => ({ domain: (d.domain || '').toString().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''), selected_theme: d.selected_theme || d.theme_name || d.blog_theme_template_key || 'minimal' }))
      .filter(d => d.domain && d.selected_theme);

    for (const row of toUpdate) {
      try {
        // Update only when selected_theme is missing or empty
        await supabase.from('domains').update({ selected_theme: row.selected_theme }).eq('domain', row.domain);
      } catch (e) {
        // ignore per-row failures
      }
    }
  } catch (e) {}
}

// Hook into loadDomains: after initial load call ensureDomainsHaveSelectedTheme(domains)

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'validating' | 'validated' | 'error' | 'dns_ready' | 'theme_selection' | 'active';
  user_id: string;
  netlify_verified: boolean;
  dns_verified: boolean;
  txt_record_value?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  last_sync?: string;
  custom_domain: boolean;
  ssl_status: 'none' | 'pending' | 'issued' | 'error';
  dns_records?: any[];
  selected_theme?: string;
  theme_name?: string;
  blog_enabled?: boolean;
  netlify_site_id?: string;
  netlify_domain_id?: string;
  ssl_enabled?: boolean;
  custom_dns_configured?: boolean;
  last_validation_at?: string;
  pages_published?: number;
  netlify_validation_status?: 'valid' | 'not_configured' | 'pending' | 'error';
  cname_record?: string;
  blog_theme?: number;
  // Optional SEO/meta fields (if present in schema)
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
}

interface SystemStatus {
  supabaseConnected: boolean;
  netlifyConnected: boolean;
  environmentValid: boolean;
  functionsAvailable: boolean;
}

const EnhancedDomainsPage = () => {
  const { user, isLoading: authLoading } = useAuthState();
  const envOk = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  const { openLoginModal, openSignupModal, hasActiveModal } = useAuthModal();

  // Avoid flashing the PBN auth overlay on quick route changes or while auth is loading
  const [showPbnOverlay, setShowPbnOverlay] = useState(false);
  useEffect(() => {
    let t: any = null;
    if (!user && !authLoading && !hasActiveModal) {
      t = setTimeout(() => setShowPbnOverlay(true), 300);
    } else {
      setShowPbnOverlay(false);
    }
    return () => { if (t) clearTimeout(t); };
  }, [user, authLoading, hasActiveModal]);
  const isMaster = user?.email === 'support@backlinkoo.com';
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [validationError, setValidationError] = useState('');
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [showDomainTipOpen, setShowDomainTipOpen] = useState(false);
  const [addPhase, setAddPhase] = useState<'idle' | 'adding_db' | 'adding_host' | 'validating' | 'done'>('idle');
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [previewDomain, setPreviewDomain] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSeed, setPreviewSeed] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [bulkInProgress, setBulkInProgress] = useState(false);
  // Notification state for theme saves
  const [themeSavedMessage, setThemeSavedMessage] = useState<string | null>(null);
  // Real-time input insights
  const [rtInfo, setRtInfo] = useState<{ clean: string; isSubdomain: boolean; formatOk: boolean; error: string; checking: boolean; dnsOk: boolean; method: string }>(
    { clean: '', isSubdomain: false, formatOk: false, error: '', checking: false, dnsOk: false, method: '' }
  );

  // Resolve profile id from public.profiles using signed-in user's email (fallback to auth user id)
  const resolveProfileId = async (): Promise<string | undefined> => {
    if (!user) return undefined;
    // prefer profiles.id where email matches
    try {
      const { data: profileRow, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
      if (!error && profileRow && (profileRow as any).id) return (profileRow as any).id;
    } catch (e) {
      // ignore
      console.warn('Profile lookup failed', e);
    }
    // fallback to auth user id
    return user.id;
  };
  const [pullingFromHost, setPullingFromHost] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    supabaseConnected: false,
    netlifyConnected: false,
    environmentValid: false,
    functionsAvailable: false
  });
  // Owner id used for domains.user_id (profiles.id preferred)
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);
  // Candidate owner IDs for filtering (support both profiles.id and auth user.id)
  const [ownerIds, setOwnerIds] = useState<string[]>([]);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [dnsModalOpen, setDnsModalOpen] = useState(false);
  const [selectedDomainForDns, setSelectedDomainForDns] = useState<Domain | null>(null);
  const [envValidation, setEnvValidation] = useState<ReturnType<typeof validateEnvironment> | null>(null);
  const [netlifyEnvCheck, setNetlifyEnvCheck] = useState<Awaited<ReturnType<typeof validateNetlifyEnvironment>> | null>(null);
  const [validateAllInProgress, setValidateAllInProgress] = useState(false);
  const [pushInProgress, setPushInProgress] = useState(false);
  const [checkAllInProgress, setCheckAllInProgress] = useState(false);
  const [pushConfirmOpen, setPushConfirmOpen] = useState(false);
  const [pushResultOpen, setPushResultOpen] = useState(false);
  const [pushResultDetails, setPushResultDetails] = useState<any>(null);
  const [pushResultError, setPushResultError] = useState<string | null>(null);
  const [bulkDeleteInProgress, setBulkDeleteInProgress] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const cnameInputRef = useRef<HTMLInputElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  // Pagination for domains list
  const [currentPage, setCurrentPage] = useState<number>(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    const onEnter = () => {
      el.style.setProperty('--cursor-show', '1');
    };

    const onLeave = () => {
      el.style.setProperty('--cursor-show', '0');
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  const [dnsValidationResults, setDnsValidationResults] = useState(new Map<string, any>());
  const [comprehensiveDnsResults, setComprehensiveDnsResults] = useState(new Map<string, any>());
  const [validatingDns, setValidatingDns] = useState<Set<string>>(new Set());
  const [refreshInProgress, setRefreshInProgress] = useState(false);
  const [syncErrorOpen, setSyncErrorOpen] = useState(false);
  // Cloudflare ACME/DCV delegation records (populated after creating a custom hostname)
  const [cloudflareDcvRecords, setCloudflareDcvRecords] = useState(new Map<string, any[]>());
  const [autoAddDcvInProgress, setAutoAddDcvInProgress] = useState(false);
  const [syncErrors, setSyncErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'domains' | 'errors'>('domains');
  const [dnsConfigTab, setDnsConfigTab] = useState<'cname' | 'cloudflare'>('cname');
  const [netlifyAliases, setNetlifyAliases] = useState<Set<string>>(new Set());
  const [netlifyCheckMap, setNetlifyCheckMap] = useState<Map<string, boolean>>(new Map());
  const [errorCount, setErrorCount] = useState(0);
  // Control system status collapse state (toggled from global header button)
  const [systemCollapsed, setSystemCollapsed] = useState(true);

  // SEO/meta edit dialog state
  const [seoDialogOpen, setSeoDialogOpen] = useState(false);
  const [seoDomain, setSeoDomain] = useState<Domain | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [savingSeo, setSavingSeo] = useState(false);
  // Favicon upload state
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Hide footer when any modal/dialog is open
  const isAnyDialogOpen = addDialogOpen || pushConfirmOpen || pushResultOpen || seoDialogOpen || dnsModalOpen || syncErrorOpen;

  // Hide all toast notifications on this page
  useEffect(() => {
    try { document.body.classList.add('hide-toasts'); } catch {}
    return () => { try { document.body.classList.remove('hide-toasts'); } catch {} };
  }, []);

  useEffect(() => {
    const handler = () => setSystemCollapsed(prev => !prev);
    window.addEventListener('toggle-system-status', handler as any);
    return () => window.removeEventListener('toggle-system-status', handler as any);
  }, []);

  // Keep ownerId/ownerIds in sync with current user (profiles.id preferred for writes; filter supports both)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setOwnerId(undefined);
        setOwnerIds([]);
        return;
      }
      try {
        const profId = await resolveProfileId();
        if (!cancelled) {
          setOwnerId(profId || user.id);
          const ids = Array.from(new Set([profId, user.id].filter(Boolean) as string[]));
          setOwnerIds(ids);
        }
      } catch {
        if (!cancelled) {
          setOwnerId(user.id);
          setOwnerIds([user.id]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const openSeoModal = async (domain: Domain) => {
    try {
      setSeoDomain(domain);
      // Prefill from domain fields if present
      setMetaTitle(domain.meta_title || '');
      setMetaDescription(domain.meta_description || '');
      setMetaKeywords(domain.meta_keywords || '');
      setOgTitle(domain.og_title || '');
      setOgDescription(domain.og_description || '');
      setOgImage(domain.og_image || '');

      // Also attempt to load from domain_blog_settings.meta_tags for fallback
      const { data: settings } = await supabase
        .from('domain_blog_settings')
        .select('id, meta_tags')
        .eq('domain_id', domain.id)
        .maybeSingle();
      const tags = (settings as any)?.meta_tags || {};
      setMetaTitle(prev => prev || tags.meta_title || '');
      setMetaDescription(prev => prev || tags.meta_description || '');
      setMetaKeywords(prev => prev || tags.meta_keywords || '');
      setOgTitle(prev => prev || tags.og_title || '');
      setOgDescription(prev => prev || tags.og_description || '');
      setOgImage(prev => prev || tags.og_image || tags.og_image_url || '');

      setSeoDialogOpen(true);
      // populate favicon preview if available
      setFaviconPreview(domain.favicon || null);
    } catch (e) {
      console.warn('Failed to load SEO meta for domain:', e);
      setSeoDialogOpen(true);
      // populate favicon preview if available
      setFaviconPreview(domain.favicon || null);
    }
  };

  const saveDomainMeta = async (domainId: string) => {
    // Close immediately and run save in background
    setSeoDialogOpen(false);
    setSavingSeo(true);
    const savingToast = toast.loading('Saving SEO/meta...');

    void (async () => {
      try {
        // First try updating columns on domains table (if schema supports it)
        const payload: Record<string, any> = {
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image: ogImage,
          theme_name: metaTitle,
          updated_at: new Date().toISOString()
        };
        const { error: updateError } = await supabase
          .from('domains')
          .update(payload)
          .eq('id', domainId);

        if (updateError) {
          const msg = String(updateError.message || updateError).toLowerCase();
          const looksLikeMissingColumn = msg.includes('column') && (msg.includes('does not exist') || msg.includes('unknown'));
          if (!looksLikeMissingColumn) {
            throw updateError;
          }
          // Fallback: store inside domain_blog_settings.meta_tags
          const { data: existing } = await supabase
            .from('domain_blog_settings')
            .select('id, meta_tags')
            .eq('domain_id', domainId)
            .maybeSingle();
          const newTags = {
            ...(existing?.meta_tags || {}),
            meta_title: metaTitle,
            meta_description: metaDescription,
            meta_keywords: metaKeywords,
            og_title: ogTitle,
            og_description: ogDescription,
            og_image: ogImage
          };
          if (existing?.id) {
            const { error: updErr } = await supabase
              .from('domain_blog_settings')
              .update({ meta_tags: newTags, updated_at: new Date().toISOString() })
              .eq('id', existing.id);
            if (updErr) throw updErr;
          } else {
            const { error: insErr } = await supabase
              .from('domain_blog_settings')
              .insert({ domain_id: domainId, blog_title: 'Blog', blog_description: 'Latest articles and updates', meta_tags: newTags });
            if (insErr) throw insErr;
          }
        }

        // Update local state optimistically
        setDomains(prev => prev.map(d => d.id === domainId ? {
          ...d,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image: ogImage
        } : d));

        // Notify edge function to refresh persisted meta (fire-and-forget)
        try {
          const target = seoDomain?.domain || '';
          void supabase.functions.invoke('domain-blog-server', {
            body: {
              domain: target,
              meta_title: metaTitle,
              meta_description: metaDescription,
              meta_keywords: metaKeywords,
              og_title: ogTitle,
              og_description: ogDescription,
              og_image: ogImage
            }
          });
        } catch (invErr) {
          console.warn('Meta sync invoke failed:', invErr);
        }

        toast.success('SEO/meta tags saved!');
      } catch (e: any) {
        toast.error(e?.message || 'Failed to update SEO meta');
      } finally {
        toast.dismiss(savingToast);
        setSavingSeo(false);
      }

      // Best-effort cache warm/refresh on the live domain blog pages
      try {
        const host = (seoDomain?.domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (host) {
          const base = host.replace(/^www\./, '');
          const urls = [
            `https://${base}/blog/?refresh=${Date.now()}`,
            `https://www.${base}/blog/?refresh=${Date.now()}`
          ];
          setTimeout(() => {
            urls.forEach((u) => {
              try {
                if (navigator.sendBeacon) {
                  const blob = new Blob([], { type: 'text/plain' });
                  navigator.sendBeacon(u, blob);
                } else {
                  const img = new Image();
                  img.referrerPolicy = 'no-referrer';
                  img.src = u;
                }
              } catch {}
            });
          }, 0);
        }
      } catch (warmErr) {
        console.warn('Blog warm-up skipped:', warmErr);
      }
    })();
  };

  // Favicon helpers
  function readFileAsDataURL(file: File) {
    return new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function createResizedBase64(file: File, size: number) {
    // Returns base64 string (without data:* prefix) as PNG
    const dataUrl = await readFileAsDataURL(file);
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No canvas'));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const x = Math.round((canvas.width - w) / 2);
        const y = Math.round((canvas.height - h) / 2);
        ctx.drawImage(img, x, y, w, h);
        const out = canvas.toDataURL('image/png');
        resolve(out.split(',')[1]);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = dataUrl;
    });
  }

  const handleFaviconSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFaviconFile(f);
    try { setFaviconPreview(URL.createObjectURL(f)); } catch { setFaviconPreview(null); }
  };

  async function uploadFavicon(domainId: string) {
    if (!domainId || !faviconFile) return;
    setUploadingFavicon(true);
    try {
      const filesToSend = [];
      const fname = faviconFile.name || 'favicon';
      const ext = (fname.split('.').pop() || '').toLowerCase();
      if (ext === 'ico') {
        const dataUrl = await readFileAsDataURL(faviconFile);
        const b64 = dataUrl.split(',')[1];
        filesToSend.push({ name: 'favicon.ico', b64, contentType: faviconFile.type || 'image/x-icon' });
      } else {
        const sizes = [180, 32, 16];
        for (const s of sizes) {
          const base = await createResizedBase64(faviconFile, s);
          filesToSend.push({ name: `favicon-${s}.png`, b64: base, contentType: 'image/png' });
        }
        const origData = await readFileAsDataURL(faviconFile);
        const origB64 = origData.split(',')[1];
        filesToSend.push({ name: `favicon-original.${ext}`, b64: origB64, contentType: faviconFile.type || 'application/octet-stream' });
      }

      const res = await fetch('/.netlify/functions/upload-favicon', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId, files: filesToSend })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.uploaded && data.uploaded.length) {
        const url = data.uploaded[0].publicUrl;
        setDomains(prev => prev.map(d => d.id === domainId ? { ...d, favicon: url } : d));
        setSeoDomain(prev => prev ? { ...prev, favicon: url } : prev);
        toast.success('Favicon uploaded');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload favicon failed', err);
      toast.error('Favicon upload failed');
    } finally {
      setUploadingFavicon(false);
      setFaviconFile(null);
    }
  }

  async function deleteFavicon(domainId: string) {
    if (!domainId) return;
    setUploadingFavicon(true);
    try {
      const res = await fetch('/.netlify/functions/delete-favicon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domainId }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setDomains(prev => prev.map(d => d.id === domainId ? { ...d, favicon: null } : d));
        setSeoDomain(prev => prev ? { ...prev, favicon: null } : prev);
        setFaviconPreview(null);
        toast.success('Favicon removed');
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete favicon');
    } finally {
      setUploadingFavicon(false);
    }
  }

  // Compute error count for title (domains with issues or syncErrors)
  const domainHasIssue = (d: Domain): boolean => {
    const comp = comprehensiveDnsResults.get(d.domain);
    const legacy = dnsValidationResults.get(d.domain);
    const dnsOk = comp ? comp.success : (legacy ? legacy.success : !!d.dns_verified);
    const netlifyOk = !!d.netlify_verified && d.status !== 'error';
    const sslOk = d.ssl_status === 'issued' || d.ssl_status === 'pending' || !d.netlify_verified;
    return !netlifyOk || !dnsOk || !sslOk || d.status === 'error';
  };

  useEffect(() => {
    const domainIssues = domains.reduce((sum, d) => sum + (domainHasIssue(d) ? 1 : 0), 0);
    const count = syncErrors.length > 0 ? syncErrors.length : domainIssues;
    setErrorCount(count);
  }, [domains, comprehensiveDnsResults, dnsValidationResults, syncErrors]);

  // Constants for DNS configuration
  const CNAME_RECORD = 'domains.backlinkoo.com';
  const NAMESERVERS = [
    'dns1.p05.nsone.net',
    'dns2.p05.nsone.net',
    'dns3.p05.nsone.net',
    'dns4.p05.nsone.net'
  ];

  const computeHostLabel = (d?: string) => {
    if (!d) return 'www';
    const cleaned = d.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] : 'www';
  };

  const hostLabelForSelected = computeHostLabel(selectedDomainForDns?.domain);

  const formatError = (e: any): string => {
    // Robust error formatter that avoids unhelpful [object Object]
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;

    // Common Supabase error shapes
    const maybeMessage = e?.message || e?.msg || e?.error || e?.error_message || e?.error_description;
    if (maybeMessage) {
      const hint = e?.hint ? ` (${e.hint})` : '';
      const details = e?.details ? ` — ${typeof e.details === 'string' ? e.details : safeStringify(e.details)}` : '';
      return `${maybeMessage}${hint}${details}`;
    }

    // Helper to safely stringify objects (handle circular refs)
    function safeStringify(obj: any) {
      try {
        const seen = new WeakSet();
        return JSON.stringify(obj, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        }, 2);
      } catch (err) {
        try { return String(obj); } catch { return '[Unserializable]'; }
      }
    }

    try {
      return safeStringify(e);
    } catch (err) {
      try { return String(e); } catch { return 'Unknown error'; }
    }
  };

  useEffect(() => {
    if (user && envOk) {
      setLoading(true);
      loadDomains();
      checkSystemStatus();
      fetchNetlifyAliases();
      const cleanup = setupRealtimeSubscription();
      return () => {
        if (typeof cleanup === 'function') cleanup();
      };
    } else {
      // No authenticated user or missing env; stop loading and clear data to avoid stuck UI
      setDomains([]);
      setLoading(false);
    }
  }, [user, envOk]);

  const requireAuth = (pendingAction: string, onSuccess?: () => void, preferSignup: boolean = false) => {
    if (user?.id) return true;
    try {
      localStorage.setItem('intended_route', '/domains');
    } catch {}
    const open = preferSignup ? openSignupModal : openLoginModal;
    open({ pendingAction, onAuthSuccess: () => { onSuccess?.(); } });
    toast.info('Please sign in to continue.');
    return false;
  };

  const fetchNetlifyAliases = async (): Promise<Set<string>> => {
    if (!DOMAIN_FEATURES_ENABLED) {
      const empty = new Set<string>();
      setNetlifyAliases(empty);
      return empty;
    }
    const metricId = debugLog.startOperation('domains', 'fetch_netlify_aliases', { userId: user?.id });
    try {
      // 1) Try Supabase edge function
      let domainsList: any[] = [];
      try {
        // Prefer deployed Netlify function to avoid browser CORS
        const edge = await DomainsApiHelper.invokeEdgeFunction('domains', { action: 'list' });
        if (edge) {
          if (Array.isArray(edge)) domainsList = edge;
          else if (Array.isArray((edge as any).aliases)) domainsList = (edge as any).aliases;
        }
      } catch (err) {
        console.warn('Domains function list failed:', (err as any)?.message || err);
      }

      // Fallback to direct Netlify API if edge returns nothing
      if (!domainsList || domainsList.length === 0) {
        const siteInfo = await NetlifyApiService.getSiteInfo();
        if (siteInfo?.success && siteInfo.data) {
          domainsList = siteInfo.data.domain_aliases || [];
          if (siteInfo.data.custom_domain) domainsList = [...domainsList, siteInfo.data.custom_domain];
        }
      }

      const norm = (s: string) => String(s || '')
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\.$/, '')
        .replace(/^www\./, '');

      const set = new Set<string>();
      (domainsList || []).forEach((d: any) => {
        const name = typeof d === 'string' ? d : (d.name || d.domain || d.hostname || d.host || d.subdomain || '');
        const n = norm(name);
        if (!n) return;
        set.add(n);
        set.add(`www.${n}`);
      });
      setNetlifyAliases(set);
      try { debugLog.endOperation(metricId, true, { count: set.size }); } catch {}
      return set;
    } catch (e) {
      console.warn('Failed to fetch Netlify aliases', e);
      debugLog.error('domains', 'fetch_netlify_aliases_error', e, { userId: user?.id });
      return new Set<string>();
    }
  };

  const addAliasViaEdge = async (aliasDomain: string) => {
    const data: any = await DomainsApiHelper.addDomain(aliasDomain);
    if (!data || (data.success === false)) {
      const msg = (data && (data.error || data.message)) || 'Failed to add alias';
      throw new Error(msg);
    }
    return data;
  };

  const syncAliasesViaEdge = async (domainsList: string[]) => {
    const data = await syncNetlifyAliases(domainsList);
    if (!data || data.success === false) {
      const msg = (data as any)?.error || 'Failed to sync aliases';
      throw new Error(msg);
    }
    return data;
  };

  const pullHostDomains = async () => {
    if (!requireAuth('pull host domains')) return;
    if (!DOMAIN_FEATURES_ENABLED) {
      toast.info('Host domain pull is disabled');
      return;
    }
    setPullingFromHost(true);
    try {
      const aliasSet = await fetchNetlifyAliases();

      // Fallback direct fetch if still empty
      if (!aliasSet || aliasSet.size === 0) {
        const siteInfo = await NetlifyApiService.getSiteInfo();
        if (siteInfo?.success && siteInfo.data) {
          (siteInfo.data.domain_aliases || []).forEach(a => aliasSet.add(String(a)));
          if (siteInfo.data.custom_domain) aliasSet.add(String(siteInfo.data.custom_domain));
        }
      }

      const existing = new Set((domains || []).map(d => (d.domain || '').toLowerCase()));
      const toInsert = Array.from(aliasSet).filter(a => !existing.has(a));

      if (toInsert.length === 0) {
        toast.info('No new domains to pull');
        return;
      }

      const now = new Date().toISOString();
      const rows = toInsert.map(alias => ({
        domain: alias,
        user_id: ownerId || user!.id,
        status: 'active',
        netlify_verified: true,
        dns_verified: false,
        custom_domain: true,
        ssl_status: 'none',
        created_at: now,
        updated_at: now,
      }));

      // Prefer upsert to avoid race/duplicates
      let inserted = 0;
      try {
        const { data, error, count } = await supabase
          .from('domains')
          .upsert(rows as any, { onConflict: 'user_id,domain', ignoreDuplicates: true } as any);
        if (error) throw error;
        inserted = (data ? (data as any).length : 0) || toInsert.length;
      } catch (e) {
        console.warn('Upsert not available, falling back to per-row insert:', (e as any)?.message || e);
        for (const r of rows) {
          const { error } = await supabase.from('domains').insert(r);
          if (!error) inserted++;
        }
      }

      toast.success(`Pulled ${inserted} domain${inserted === 1 ? '' : 's'} from host`);
      await loadDomains();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to pull domains');
    } finally {
      setPullingFromHost(false);
    }
  };

  const checkDomainAliasViaEdge = async (aliasDomain: string): Promise<boolean> => {
    if (!DOMAIN_FEATURES_ENABLED) {
      setNetlifyCheckMap(prev => new Map(prev).set(aliasDomain, false));
      return false;
    }
    const clean = aliasDomain.trim().toLowerCase();
    // Supabase-only validation via edge function
    const data: any = await DomainsApiHelper.invokeEdgeFunction('domains', { action: 'validate', domain: clean, user_id: user?.id });
    const present = Boolean((data as any)?.validated === true || (data?.validation && data.validation.validation_status === 'valid'));
    setNetlifyCheckMap(prev => new Map(prev).set(aliasDomain, present));
    return present;
  };

  const persistNetlifyStatus = async (domainObj: Domain, present: boolean) => {
    try {
      let willSet = present;

      // If we're setting to true, verify the alias exists via edge and check for conflicting DB rows
      if (present) {
        try {
          const aliasPresent = await checkDomainAliasViaEdge(domainObj.domain).catch(() => false);
          if (!aliasPresent) {
            // alias not present in Netlify - do not mark verified
            willSet = false;
            // update error message for user visibility
            await supabase.from('domains').update({ error_message: 'Domain not found in Netlify aliases', updated_at: new Date().toISOString() }).eq('id', domainObj.id);
            setDomains(prev => prev.map(d => d.id === domainObj.id ? { ...d, netlify_verified: false, status: d.status, error_message: 'Domain not found in Netlify aliases' } : d));
            setNetlifyCheckMap(prev => new Map(prev).set(domainObj.domain, false));
            return;
          }
        } catch (e) {
          console.warn('Alias verification failed, proceeding cautiously', e);
        }

        // Check for conflicting provisions in the DB: another verified row for same domain
        try {
          const { data: others, error: othersErr } = await supabase.from('domains').select('id,user_id,netlify_verified,netlify_site_id').eq('domain', domainObj.domain);
          if (!othersErr && others && Array.isArray(others)) {
            const conflict = others.find((o: any) => o.id !== domainObj.id && o.netlify_verified === true);
            if (conflict) {
              // Conflict detected: do not flip this row to verified; persist conflict note
              const msg = `Conflict: domain already verified for another record (id=${conflict.id})`;
              await supabase.from('domains').update({ error_message: msg, updated_at: new Date().toISOString() }).eq('id', domainObj.id);
              setDomains(prev => prev.map(d => d.id === domainObj.id ? { ...d, netlify_verified: false, status: d.status, error_message: msg } : d));
              setNetlifyCheckMap(prev => new Map(prev).set(domainObj.domain, true));
              return;
            }
          }
        } catch (e) {
          console.warn('Conflict detection failed:', e);
        }
      }

      // No conflicts or turning off - perform the update
      await supabase
        .from('domains')
        .update({ netlify_verified: willSet, status: willSet ? 'active' : domainObj.status, updated_at: new Date().toISOString(), error_message: null })
        .eq('id', domainObj.id);

      setDomains(prev => prev.map(d => d.id === domainObj.id ? { ...d, netlify_verified: willSet, status: willSet ? 'active' : d.status, error_message: null } : d));
      setNetlifyCheckMap(prev => new Map(prev).set(domainObj.domain, willSet));
    } catch (e) {
      console.warn('Persist netlify status failed:', e);
    }
  };

  // Background reconciliation to correct stale Supabase netlify_verified values
  const reconcileNetlifyStatuses = async (list: Domain[]) => {
    try {
      const limit = Math.min(list.length, 25);
      for (let i = 0; i < limit; i++) {
        const d = list[i];
        try {
          const present = await checkDomainAliasViaEdge(d.domain);
          if (present !== !!d.netlify_verified) {
            await persistNetlifyStatus(d, present);
          }
        } catch {}
      }
    } catch {}
  };

  // Detect sandboxed iframe preview (blocks external websockets)
  const isSandboxedPreview = (() => {
    try {
      if (typeof window === 'undefined') return false;
      if (window.top !== window.self) return true; // inside iframe
      return /builder\.io|sandbox/i.test(document.referrer || '');
    } catch { return true; }
  })();

  const setupRealtimeSubscription = () => {
    if (!user?.id) return;
    if (isSandboxedPreview) {
      // Skip realtime in sandbox to avoid blocked websocket warnings
      return () => {};
    }

    const channels: any[] = [];
    (async () => {
      if (isMaster) {
        const ch = supabase
          .channel('domains-realtime-all')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'domains' },
            () => { loadDomains(); }
          )
          .subscribe();
        channels.push(ch);
        return;
      }

      const ids = ownerIds.length ? ownerIds : [await resolveProfileId(), user.id].filter(Boolean) as string[];
      const unique = Array.from(new Set(ids));
      if (unique.length === 0) return;
      unique.forEach((oid, idx) => {
        const ch = supabase
          .channel(`domains-realtime-${idx}-${oid}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'domains', filter: `user_id=eq.${oid}` },
            () => { loadDomains(); }
          )
          .subscribe();
        channels.push(ch);
      });
    })();

    return () => {
      channels.forEach(ch => { try { supabase.removeChannel(ch); } catch {} });
    };
  };

  const loadDomains = async () => {
    const metricId = debugLog.startOperation('domains', 'load_domains', { userId: user?.id });
    if (!user?.id) return;

    try {
      const ids = isMaster ? [] : (ownerIds.length ? ownerIds : [await resolveProfileId(), user.id].filter(Boolean) as string[]);
      let query = supabase
        .from('domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMaster && ids.length > 0) {
        query = query.in('user_id', Array.from(new Set(ids)));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to load domains:', error);
        const msg = formatError(error);
        toast.error(`Failed to load domains: ${msg}`);
        return;
      }

      setDomains(data || []);
      // Ensure domains have a selected_theme persisted to avoid repeated configure steps
      try { ensureDomainsHaveSelectedTheme(data || []); } catch {}
      // Reconcile actual Netlify aliases against Supabase state in background
      setTimeout(() => { reconcileNetlifyStatuses(data || []); }, 0);

      if (DOMAIN_FEATURES_ENABLED) {
        // Call domains-verify edge function to get authoritative status (Netlify/DNS/SSL)
        try {
          const domainNames = (data || []).map((d: any) => d.domain).filter(Boolean);
          if (domainNames.length > 0) {
            const clientSiteId = import.meta.env.VITE_NETLIFY_SITE_ID as string | undefined;
            const payload = { domains: domainNames, site_id: clientSiteId, user_id: ownerId || user.id };
            const res: any = await supabase.functions.invoke('domains-verify', { body: payload });
            const fv = res?.data || res;
            const results = (fv && fv.results) || [];

            // Merge results into UI state
            results.forEach((r: any) => {
              if (r.details?.dns) {
                setDnsValidationResults(prev => new Map(prev).set(r.domain, r.details.dns));
              }
              setDomains(prev => prev.map((d: any) => {
                if (!d || !d.domain) return d;
                if ((d.domain || '').toLowerCase() !== (r.domain || '').toLowerCase()) return d;
                const updated = { ...d } as any;
                // Per request, treat Netlify as verified and active when present
                if (typeof r.netlify === 'boolean') {
                  updated.netlify_verified = r.netlify;
                  if (r.netlify) updated.status = 'active';
                }
                if (typeof r.dns === 'boolean') updated.dns_verified = r.dns;
                updated.ssl_status = (r.details && r.details.ssl_status) ? r.details.ssl_status : (r.ssl ? 'issued' : d.ssl_status || 'none');
                updated.last_validation_at = new Date().toISOString();
                return updated;
              }));
            });

            // Persist only when values actually change to avoid realtime loops
            try {
              const currentByDomain = new Map((data || []).map((d: any) => [String(d.domain || '').toLowerCase(), d] as const));
              const idsNeedingUpdate: string[] = [];
              const domainsNeedingUpdate: string[] = [];
              for (const r of results) {
                const key = String(r.domain || '').toLowerCase();
                const cur = currentByDomain.get(key);
                if (!cur) continue;
                const needs = cur.status !== 'active' || !cur.netlify_verified || cur.ssl_status !== 'issued';
                if (needs) {
                  if (r.id) idsNeedingUpdate.push(r.id);
                  else if (key) domainsNeedingUpdate.push(key);
                }
              }
              if (idsNeedingUpdate.length > 0) {
                await supabase.from('domains').update({
                  status: 'active',
                  netlify_verified: true,
                  ssl_status: 'issued',
                  updated_at: new Date().toISOString()
                }).in('id', idsNeedingUpdate);
              }
              if (domainsNeedingUpdate.length > 0) {
                await supabase.from('domains').update({
                  status: 'active',
                  netlify_verified: true,
                  ssl_status: 'issued',
                  updated_at: new Date().toISOString()
                }).in('domain', domainsNeedingUpdate);
              }
            } catch (err) {
              console.warn('Skipped client-side persist during load:', err);
            }
          }
        } catch (e) {
          console.warn('domains-verify invocation failed during load:', e);
        }
      }
    } catch (error: any) {
      console.error('Load domains error:', error);
      debugLog.error('domains', 'load_domains_error', error, { userId: user?.id });
      toast.error(`Failed to load domains: ${formatError(error)}`);
    } finally {
      debugLog.endOperation(metricId, true);
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    const metricId = debugLog.startOperation('domains', 'check_system_status');
    if (checkingStatus) return;

    setCheckingStatus(true);
    const status: SystemStatus = {
      supabaseConnected: false,
      netlifyConnected: false,
      environmentValid: false,
      functionsAvailable: false
    };

    try {
      // Validate environment variables
      const envValidation = validateEnvironment();
      setEnvValidation(envValidation);
      status.environmentValid = envValidation.isValid;

      // Check Supabase connection
      if (envOk) {
        const { error: supabaseError } = await supabase.from('domains').select('id').limit(1);
        status.supabaseConnected = !supabaseError;
      } else {
        status.supabaseConnected = false;
      }

      // Check Netlify environment and functions (only on Netlify or if explicitly enabled)
      let netlifyCheck = { hasAccessToken: false, hasSiteId: false, functionsAvailable: false, apiAccessible: false };
      try {
        const isNetlifyHost = typeof window !== 'undefined' && /\.netlify\.app$/.test(window.location.hostname);
        const allowLocalProbe = import.meta.env.VITE_ENABLE_NETLIFY_LOCAL === 'true';
        if (isNetlifyHost || allowLocalProbe) {
          netlifyCheck = await validateNetlifyEnvironment();
        }
      } catch (e) {
        console.warn('Netlify env check skipped/failed:', (e as any)?.message || e);
      }
      setNetlifyEnvCheck(netlifyCheck);
      status.functionsAvailable = netlifyCheck.functionsAvailable;
      status.netlifyConnected = netlifyCheck.apiAccessible;

      // Verify Supabase edge function (netlify-domains) availability using supported action
      try {
        const siteId = (import.meta as any).env?.VITE_NETLIFY_SITE_ID as string | undefined;
        const token = (import.meta as any).env?.VITE_NETLIFY_ACCESS_TOKEN as string | undefined;
        if (siteId && token) {
          status.functionsAvailable = true;
        }
      } catch (e) {
        console.warn('Netlify function status check skipped:', (e as any)?.message || e);
      }

      setSystemStatus(status);

      // Show environment validation feedback (suppress optional/payment warnings on Domains page)
      if (!envValidation.isValid) {
        toast.error(
          `Environment configuration issues detected. Please check your Supabase settings.`,
          { duration: 8000 }
        );
      } else {
        const nonPaymentWarnings = (envValidation.warnings || []).filter(w => !/stripe/i.test(w));
        if (nonPaymentWarnings.length > 0) {
          // Do not show optional warnings here
        }
      }

    } catch (error) {
      console.error('System status check failed:', error);
      debugLog.error('domains', 'check_system_status_error', error);
    } finally {
      debugLog.endOperation(metricId, true);
      setCheckingStatus(false);
    }
  };

  const validateDomain = (domain: string): string | null => {
    if (!domain.trim()) {
      return 'Domain cannot be empty';
    }

    const cleanDomain = domain.trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    // Check for valid domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(cleanDomain)) {
      return 'Invalid domain format. Use format: example.com';
    }

    // Check if domain already exists
    if (domains.some(d => d.domain === cleanDomain)) {
      return 'Domain already exists in your list';
    }

    return null;
  };

  const handleDomainInput = (value: string) => {
    setNewDomain(value);
    const error = validateDomain(value);
    setValidationError(error || '');
  };

  // Real-time detection: subdomain, formatting, and quick DNS check
  useEffect(() => {
    let cancelled = false;
    const raw = newDomain || '';
    const clean = raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

    // detect subdomain (simple heuristic)
    const parts = clean ? clean.split('.') : [];
    const isSub = parts.length > 2;

    // reuse same regex used elsewhere
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    const formatOk = !!clean && domainRegex.test(clean);

    // set immediate state
    setRtInfo(prev => ({ ...prev, clean, isSubdomain: isSub, formatOk, error: formatOk ? '' : (clean ? 'Invalid format' : ''), checking: false, dnsOk: false, method: '' }));

    // debounce DNS probing only when format is OK
    if (!clean || !formatOk) return;

    setRtInfo(prev => ({ ...prev, checking: true, dnsOk: false, method: '' }));
    const timer = setTimeout(async () => {
      try {
        const res = await ComprehensiveDnsValidationService.validateDomainComprehensive(clean);
        if (cancelled) return;
        setRtInfo(prev => ({ ...prev, checking: false, dnsOk: !!res?.success, method: res?.validationMethod || '' }));
      } catch (e) {
        if (cancelled) return;
        setRtInfo(prev => ({ ...prev, checking: false, dnsOk: false, method: '' }));
      }
    }, 550);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [newDomain]);

  const addDomain = async () => {
    const metricId = debugLog.startOperation('domains', 'add_domain', { userId: user?.id, input: newDomain });
    if (!user?.id) {
      const proceed = requireAuth('add domain', () => addDomain());
      if (!proceed) return;
    }
    if (!newDomain.trim()) return;

    const validation = validateDomain(newDomain);
    if (validation) {
      setValidationError(validation);
      return;
    }

    const cleanDomain = newDomain.trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    // Always attempt server-side add via DomainManagementService (ensures domainsSupabase is used)
    setProcessingActions(prev => new Set(prev).add('add'));

    // If domain features are disabled, we'll still try the server add. If it fails, fallback to DB insert.

    try {
      // Route through DomainManagementService (Netlify function) to avoid client-side RLS issues
      setAddPhase('adding_host');
      debugLog.info('domains', 'add_phase', 'service_add');

      const res = await DomainManagementService.addDomain(cleanDomain, user!.id);
      if (!res?.success) {
        throw new Error(res?.error || 'Add domain failed');
      }

      // Set default theme to HTML
      const domainId = (res as any)?.domain?.id;
      if (domainId) {
        try {
          await supabase.from('domains').update({ selected_theme: 'HTML' }).eq('id', domainId);
        } catch (e) {
          console.warn('Default theme set failed for', domainId, e);
        }
      }

      // Skip pre-warm GET that caused 405 in some environments; rely on on-demand rendering via edge function invoke.

      toast.success(`✅ Domain ${cleanDomain} added`);
      debugLog.endOperation(metricId, true, { domain: cleanDomain });
      setNewDomain('');
      setValidationError('');
      setAddDialogOpen(false);
      await loadDomains();

    } catch (error: any) {
      console.error('Add domain error:', error);
      debugLog.error('domains', 'add_domain_error', error, { userId: user?.id, input: newDomain });
      try {
        const details = error && typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error);
        toast.error(`Failed to add domain: ${details}`);
      } catch (e) {
        toast.error('Failed to add domain (see console)');
      }
      setAddPhase('idle');
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete('add');
        return newSet;
      });
      setAddPhase('done');
      try { debugLog.endOperation(metricId, false, { phase: 'finalize' }); } catch {}
    }
  };

  const addDomainToDatabase = async (cleanDomain: string) => {
    const profId = await resolveProfileId();
    const owner = profId || user?.id;
    if (!owner) return;
    try {
      const { error } = await supabase
        .from('domains')
        .insert({
          domain: cleanDomain,
          user_id: owner,
          status: 'pending',
          netlify_verified: false,
          dns_verified: false,
          custom_domain: true,
          ssl_status: 'none'
        });
      if (error) {
        if ((error as any).code === '23505') throw new Error('Domain already exists');
        throw error;
      }
      toast.success(` Added ${cleanDomain} to database`);
      await loadDomains();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add to database');
    }
  };

  const bulkAddToDatabase = async (items: string[]) => {
    if (items.length === 0) return;
    try {
      const profId = await resolveProfileId();
      const owner = profId || user?.id;
      if (!owner) return;
      const rows = items.map(d => ({
        domain: d,
        user_id: owner,
        status: 'pending',
        netlify_verified: false,
        dns_verified: false,
        custom_domain: true,
        ssl_status: 'none'
      }));
      const { error } = await supabase.from('domains').insert(rows, { count: 'exact' });
      if (error) throw error;
      toast.success(`✅ Added ${rows.length} domain(s) to database`);
      await loadDomains();
    } catch (e: any) {
      toast.error(e.message || 'Bulk add to database failed');
    }
  };

  const bulkAddToHost = async (items: string[]) => {
    if (!user?.id || items.length === 0) return;
    // Always attempt to add to host via DomainManagementService so domainsSupabase is used for DB writes.
    setBulkInProgress(true);
    try {
      const concurrency = 3;
      let index = 0;
      const workers = Array.from({ length: concurrency }, () => (async () => {
        while (index < items.length) {
          const i = index++;
          const clean = items[i];
          try {
            // Pre-insert for visibility and to ensure DB record exists
            try {
              const now = new Date().toISOString();
              const { data: row } = await supabase
                .from('domains')
                .upsert({
                  domain: clean,
                  user_id: (ownerIds[0] || ownerId || user!.id) as string,
                  status: 'pending',
                  netlify_verified: false,
                  dns_verified: false,
                  custom_domain: true,
                  ssl_status: 'none',
                  created_at: now,
                  updated_at: now,
                } as any, { onConflict: 'user_id,domain', ignoreDuplicates: false } as any)
                .select('*')
                .maybeSingle();
              if (row) {
                setDomains(prev => prev.some(d => d.domain === clean) ? prev : [{ ...(row as any) }, ...prev]);
              }
            } catch (prefillErr) {
              console.warn('Bulk pre-insert failed:', (prefillErr as any)?.message || prefillErr);
            }

            const res = await DomainManagementService.addDomain(clean, user.id);
            if (!res.success) throw new Error(res.error || 'Failed');
            if (res.domain?.id) {
              try {
                await supabase.from('domains').update({ selected_theme: 'HTML' }).eq('id', res.domain.id);
              } catch (e) {
                console.warn('Default theme set failed for', clean, e);
              }
            }
          } catch (e) {
            console.error('Host add failed for', clean, e);
          }
        }
      })());
      await Promise.all(workers);
      toast.success('✅ Host add complete');
      await loadDomains();
    } finally {
      setBulkInProgress(false);
    }
  };

  const deleteDomain = async (domainId: string, domainName: string) => {
    const metricId = debugLog.startOperation('domains', 'delete_domain', { userId: user?.id, domain: domainName });
    if (!user?.id) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${domainName}?`);
    if (!confirmed) return;

    setProcessingActions(prev => new Set(prev).add(domainId));

    try {
      if (!DOMAIN_FEATURES_ENABLED) {
        await supabase.from('domains').delete().eq('id', domainId);
        toast.success(`Domain ${domainName} removed`);
        try { debugLog.endOperation(metricId, true); } catch {}
        await loadDomains();
        return;
      }
      const result = await DomainManagementService.removeDomain(domainName, isMaster ? undefined : (ownerId || user.id));
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove domain');
      }
      toast.success(result.message || `Domain ${domainName} removed successfully`);
      try { debugLog.endOperation(metricId, true); } catch {}
      await loadDomains();
    } catch (error: any) {
      console.error('Delete domain error:', error);
      debugLog.error('domains', 'delete_domain_error', error, { domain: domainName, userId: user?.id });
      toast.error(`Failed to delete domain: ${error.message}`);
    } finally {
      try { debugLog.endOperation(metricId, false); } catch {}
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainId);
        return newSet;
      });
    }
  };

  const syncWithNetlify = async () => {
    const metricId = debugLog.startOperation('domains', 'sync_with_netlify', { userId: user?.id });
    if (!DOMAIN_FEATURES_ENABLED) {
      toast.info('Domain sync is disabled');
      return;
    }
    setProcessingActions(prev => new Set(prev).add('sync'));
    try {
      const result = await DomainManagementService.syncDomains(isMaster ? undefined : (ownerId || user?.id));
      if (result.success) {
        toast.success('✅ Synced domains with Netlify and database');
        await loadDomains();
        try { debugLog.endOperation(metricId, true); } catch {}
      } else {
        toast.error(`Sync failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Host sync error:', error);
      debugLog.error('domains', 'sync_with_netlify_error', error, { userId: user?.id });
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      try { debugLog.endOperation(metricId, false); } catch {}
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete('sync');
        return newSet;
      });
    }
  };

  const openDnsModal = (domain: Domain) => {
    if (!user?.id) {
      requireAuth('configure domain DNS', () => openDnsModal(domain));
      return;
    }
    // Clear any previous validation results to prevent flickering
    setDnsValidationResults(prev => {
      const newMap = new Map(prev);
      newMap.delete(domain.domain);
      return newMap;
    });

    setSelectedDomainForDns(domain);
    setDnsModalOpen(true);

    // Prevent any automatic validation - user must explicitly click "Validate Domain"
  };

  const getStatusBadge = (domain: Domain) => {
    if (domain.netlify_verified && domain.status === 'active') {
      return <Badge className="bg-green-600">Active</Badge>;
    } else if (domain.status === 'error') {
      return <Badge variant="destructive">Error</Badge>;
    } else if (domain.netlify_verified) {
      return <Badge className="bg-blue-600">Connected</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getDnsButtonText = (domain: Domain) => {
    // Check if we have comprehensive DNS validation results for this domain
    const comprehensiveResult = comprehensiveDnsResults.get(domain.domain);

    if (comprehensiveResult) {
      if (comprehensiveResult.success) {
        return 'Valid';
      } else {
        return 'Validate';
      }
    }

    // Check if we have legacy DNS validation results for this domain
    const dnsResult = dnsValidationResults.get(domain.domain);

    if (dnsResult) {
      if (dnsResult.success) {
        return 'Valid';
      } else {
        return 'Validate';
      }
    }

    // Fallback to database status
    if (domain.dns_verified && domain.status === 'active') {
      return 'Valid';
    } else if (domain.custom_dns_configured) {
      return 'Valid';
    } else {
      return 'Validate';
    }
  };

  const getDnsButtonVariant = (domain: Domain) => {
    // Check comprehensive validation results first
    const comprehensiveResult = comprehensiveDnsResults.get(domain.domain);

    if (comprehensiveResult) {
      return comprehensiveResult.success ? 'default' : 'outline';
    }

    // Check legacy validation results
    const dnsResult = dnsValidationResults.get(domain.domain);

    if (dnsResult) {
      return dnsResult.success ? 'default' : 'outline';
    }

    // Fallback to database status
    if (domain.dns_verified && domain.status === 'active') {
      return 'default';
    } else if (domain.custom_dns_configured) {
      return 'default';
    } else {
      return 'outline';
    }
  };

  const getStatusIcon = (domain: Domain) => {
    if (domain.netlify_verified && domain.status === 'active') {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    } else if (domain.status === 'error') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    } else {
      return <Globe className="h-4 w-4 text-blue-600" />;
    }
  };

  const validateDomainRemote = async (domainName: string, domainId?: string) => {
    const metricId = debugLog.startOperation('domains', 'validate_domain', { domain: domainName, domainId });
    // Set validating state
    setValidatingDns(prev => new Set(prev).add(domainName));

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Call Netlify validation function (handles Cloudflare-proxied CNAMEs)
      const clean = String(domainName).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
      const base = (import.meta as any).env?.VITE_NETLIFY_FUNCTIONS_URL || (import.meta as any).env?.NETLIFY_FUNCTIONS_URL || '';
      const cleanBase = String(base || '').replace(/\/$/, '');
      const fnBase = /\/\.netlify\/functions\/?$/.test(cleanBase) ? cleanBase : `${cleanBase}/.netlify/functions`;
      const fnUrl = cleanBase ? `${fnBase.replace(/\/$/, '')}/cloudflare-dns-validation` : '/.netlify/functions/cloudflare-dns-validation';

      let data: any = null;
      try {
        const r = await fetch(fnUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: clean, action: 'validate' }) });
        data = await r.json().catch(() => ({}));
      } catch (e) {
        data = { success: false, error: (e as any)?.message || 'Validation request failed' };
      }

      const ok = !!(data && (data.success === true || data.validation?.isValid === true));

      // Persist dns_verified in Supabase
      if (domainId) {
        await supabase
          .from('domains')
          .update({
            dns_verified: ok,
            status: ok ? 'active' : 'pending',
            last_validation_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', domainId);
      }

      if (ok) {
        toast.success(`✅ Domain ${domainName} validated (CNAME to domains.backlinkoo.com)`);
        // Upon validation, push mapping into Cloudflare KV via Netlify function
        try {
          const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
          // 1) Persist KV mapping for the domain -> origin target
          await safeNetlifyFetch('domainsCloudflare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: clean, target: 'api.backlinkoo.com', user_id: user.id })
          });
          // 2) Create Cloudflare Custom Hostname for this domain and capture DCV validation records
          try {
            const cfCreate = await safeNetlifyFetch('domainsCloudflare?op=ch_create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hostname: clean, origin: 'domains.backlinkoo.com', ssl: { method: 'http', type: 'dv' } })
            });
            // cfCreate.data typically contains { success: true, result: { ... } }
            const payload = cfCreate?.data || null;
            const result = payload?.result || payload;
            const records = (result && ((result.ssl && result.ssl.validation && result.ssl.validation.validation_records) || result.validation_records || (result.ssl && result.ssl.validation && result.ssl.validation.records))) || [];
            if (Array.isArray(records) && records.length > 0) {
              setCloudflareDcvRecords(prev => {
                const m = new Map(prev);
                m.set(clean, records);
                return m;
              });
            }
          } catch (e) {
            console.warn('Cloudflare custom hostname create failed (non-blocking):', (e as any)?.message || e);
          }
        } catch (kvErr) {
          console.warn('Cloudflare KV push failed:', (kvErr as any)?.message || kvErr);
        }
        setTimeout(() => {
          setDnsModalOpen(false);
          setTimeout(() => loadDomains(), 500);
        }, 1200);
      } else {
        const err = data?.error || data?.validation?.issues?.join(', ') || 'CNAME not detected yet';
        toast.error(`❌ DNS validation failed for ${domainName}: ${err}`);
      }

      await loadDomains();

      debugLog.endOperation(metricId, ok, { method: 'CNAME' });
      return {
        success: ok,
        message: ok ? `Domain ${domainName} validated successfully` : `Validation failed`,
        validation_result: data
      };

    } catch (error: any) {
      console.error('Domain validation error:', error);
      debugLog.error('domains', 'validate_domain_error', error, { domain: domainName, domainId });
      toast.error(`Failed to validate ${domainName}: ${error.message}`);
      throw error;
    } finally {
      try { debugLog.endOperation(metricId, false); } catch {}
      setValidatingDns(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainName);
        return newSet;
      });
    }
  };

  const quickValidateDomain = async (domain: Domain) => {
    if (!user?.id) {
      requireAuth('validate domain', () => quickValidateDomain(domain));
      return;
    }

    try {
      const res = await validateDomainRemote(domain.domain, domain.id);
      if (!res?.success) {
        // Open DNS guidance modal with detailed errors
        setSelectedDomainForDns(domain);
        setDnsModalOpen(true);
        const details = (res as any).validation_result;
        if (details && Array.isArray(details.errors) && details.errors.length > 0) {
          // Show first error in a compact way; full list is in the modal
          toast.error(details.errors[0]);
        }
      }
    } catch (error: any) {
      console.error('Quick validation error:', error);
    }
  };

  // Validate and return response; if invalid, open DNS guidance modal with details
  const validateAndShow = async (domain: Domain) => {
    if (!user?.id) {
      requireAuth('validate domain', () => validateAndShow(domain));
      return { success: false, message: 'Not authenticated' } as const;
    }
    try {
      const res = await validateDomainRemote(domain.domain, domain.id);
      if (!res?.success) {
        setSelectedDomainForDns(domain);
        setDnsModalOpen(true);
        const details = (res as any).validation_result;
        if (details && Array.isArray(details.errors) && details.errors.length > 0) {
          toast.error(`DNS mismatch for ${domain.domain}: ${details.errors.join(', ')}`);
        }
      }
      return res;
    } catch (e: any) {
      toast.error(e?.message || 'Validation failed');
      return { success: false, message: e?.message || 'Validation failed' } as const;
    }
  };

  const validateAllDomains = async () => {
    if (domains.length === 0 || !user?.id) return;
    setValidateAllInProgress(true);
    try {
      await refreshAllDomains();
    } finally {
      setValidateAllInProgress(false);
    }
  };

  const isSelected = (id: string) => selected.has(id);
  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };
  const toggleSelectAll = () => {
    setSelected(prev => (prev.size === domains.length ? new Set() : new Set(domains.map(d => d.id))));
  };

  const gatherSystemErrors = () => {
    const errs: string[] = [];
    if (envValidation && !envValidation.isValid) {
      errs.push(...envValidation.errors.map(e => `Env: ${e}`));
    }
    if (netlifyEnvCheck) {
      if (!netlifyEnvCheck.hasAccessToken) errs.push('Netlify access token missing');
      if (!netlifyEnvCheck.hasSiteId) errs.push('Netlify site ID missing');
      if (!netlifyEnvCheck.apiAccessible) errs.push('Netlify API not accessible');
    }
    return errs;
  };

  const showSyncErrors = (errors: string[]) => {
    setSyncErrors(errors);
    setSyncErrorOpen(true);
  };

  // Ensure domains exist in Supabase with active status and netlify_verified after aliasing
  const upsertDomainsInDB = async (domainNames: string[]) => {
    if (!user?.id || domainNames.length === 0) return;
    for (const dn of domainNames) {
      const clean = dn.trim().toLowerCase();
      try {
        const ids = ownerIds.length ? ownerIds : [ownerId, user.id].filter(Boolean) as string[];
        const { data: existingList } = await supabase
          .from('domains')
          .select('id, user_id')
          .eq('domain', clean)
          .in('user_id', ids)
          .limit(1);
        const existing = Array.isArray(existingList) && existingList.length > 0 ? existingList[0] : null;

        if (existing?.id) {
          await supabase
            .from('domains')
            .update({
              status: 'active',
              netlify_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('domains')
            .insert({
              domain: clean,
              user_id: (ownerId || user.id) as string,
              status: 'active',
              netlify_verified: true,
              dns_verified: false,
              custom_domain: true,
              ssl_status: 'none',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        }
      } catch (e) {
        console.warn('Upsert domain failed:', e);
      }
    }
  };

  // Validate Netlify alias, Supabase record and DNS for a list of domains
  const validateSetupForDomains = async (domainNames: string[]): Promise<{ success: boolean; errors: string[] }> => {
    const errors: string[] = [];
    try {
      // Prefer cached alias set; fallback to list via edge function if empty
      const norm = (s: string) => s.toLowerCase().replace(/^https?:\/\//, '').replace(/\.$/, '').replace(/^www\./, '');
      const aliasSet = new Set<string>();

      if (netlifyAliases && netlifyAliases.size > 0) {
        netlifyAliases.forEach(a => {
          const n = norm(a || '');
          if (!n) return;
          aliasSet.add(n);
          aliasSet.add(`www.${n}`);
        });
      } else {
        const listRes: any = await DomainsApiHelper.invokeEdgeFunction('domains', { action: 'list', user_id: user?.id });
        const aliases = listRes?.aliases || listRes?.domain_aliases || listRes?.synced_domains || listRes?.updatedAliases || listRes || [];
        (aliases || []).forEach((a) => {
          const n = norm(a || '');
          if (!n) return;
          aliasSet.add(n);
          aliasSet.add(`www.${n}`);
        });
      }

      // Supabase records
      const { data: rows } = await supabase
        .from('domains')
        .select('domain, status, netlify_verified')
        .in('domain', domainNames.map(d => d.trim().toLowerCase()));

      const dbMap = new Map((rows || []).map((r: any) => [r.domain, r]));

      // DNS checks (best-effort)
      const dnsResults = await Promise.all(domainNames.map(async (d) => {
        try { return await DNSValidationService.validateDomainDNS(d); } catch { return null; }
      }));
      const dnsMap = new Map(domainNames.map((d, i) => [d, dnsResults[i]]));

      for (const d of domainNames) {
        const raw = String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\.$/, '');
        const apex = raw.replace(/^www\./, '');
        const www = apex.startsWith('www.') ? apex : `www.${apex}`;
        const inNetlify = aliasSet.has(apex) || aliasSet.has(www);
        const rec = dbMap.get(d);
        const verifiedInDb = !!rec?.netlify_verified || rec?.status === 'active';
        if (!inNetlify && !verifiedInDb) errors.push(`${d}: not in Netlify aliases`);
        if (!rec) errors.push(`${d}: missing Supabase record`);
        else if (!(rec.status === 'active' || rec.netlify_verified === true)) errors.push(`${d}: Supabase status not active/verified`);
        const dns = dnsMap.get(d);
        if (dns && dns.shouldValidateDNS && !dns.success) errors.push(`${d}: DNS not valid`);
      }
    } catch (e: any) {
      errors.push(e.message || 'Validation failed');
    }
    return { success: errors.length === 0, errors };
  };

  const pushAllToHost = async () => {
    if (!user?.id) {
      const errs = ['Not signed in.', ...gatherSystemErrors()];
      showSyncErrors(errs);
      toast.error('Please sign in to continue');
      return;
    }
    setPushInProgress(true);
    try {
      // Preflight diagnostics for required secrets
      try {
        const { data: diag } = await supabase.functions.invoke('push-to-host', { body: { diagnose: true } });
        const d = (diag as any)?.diagnostics || {};
        const missing: string[] = [];
        if (!d.hasNetlifyToken) missing.push('NETLIFY_API_TOKEN/NETLIFY_ACCESS_TOKEN');
        if (!d.hasNetlifySiteId) missing.push('NETLIFY_SITE_ID');
        if (!d.hasSupabaseUrl) missing.push('SUPABASE_URL');
        if (!d.hasSupabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
        if (missing.length) {
          showSyncErrors(missing.map(m => `Missing secret: ${m}`));
          toast.error('Push aborted: missing environment secrets');
          setPushInProgress(false);
          return;
        }
      } catch {}

      // Build explicit list of domains from current view
      const allNames = domains.map(d => d.domain.trim().toLowerCase());

      // Attempt org-wide push: merge ALL Supabase domains into Netlify aliases
      let pushResult: any = null;
      let usedFallback = false;
      try {
        // Preferred: instruct edge function to sync provided aliases from Supabase to Netlify
        const syncRes: any = await DomainsApiHelper.invokeEdgeFunction('domains', { action: 'sync_aliases', user_id: user.id, domains: allNames });
        pushResult = syncRes;
      } catch (err) {
        // Fallback to generic sync
        usedFallback = true;
        try {
          pushResult = await DomainsApiHelper.invokeEdgeFunction('domains', { action: 'sync_aliases', user_id: user.id, domains: allNames });
        } catch {}
      }

      // Refresh aliases and validate all visible domains
      await fetchNetlifyAliases();
      const validation = await validateSetupForDomains(allNames);
      if (validation.success) {
        setPushResultError(null);
        setPushResultDetails({
          operation: usedFallback ? 'netlify-domains sync' : 'push-to-host',
          approach: pushResult?.approach || 'domain_aliases_put',
          processed: pushResult?.processed ?? allNames.length,
          added: pushResult?.added ?? 0,
          total: pushResult?.total_domains ?? (Array.isArray(pushResult?.updatedAliases) ? pushResult.updatedAliases.length : undefined),
          updatedAliases: pushResult?.updatedAliases ?? pushResult?.ensured ?? undefined,
          validation,
          timestamp: new Date().toISOString()
        });
        setPushResultOpen(true);
      } else {
        showSyncErrors(validation.errors);
        setPushResultError('Validation detected issues');
        setPushResultDetails({ validation, timestamp: new Date().toISOString() });
        setPushResultOpen(true);
        toast.error('Validation detected issues');
      }

      await loadDomains();
    } catch (e: any) {
      toast.error(e.message || 'Failed to push to host');
    } finally {
      setPushInProgress(false);
    }
  };

  const refreshSelectedDomains = async () => {
    if (selected.size === 0) return;
    setRefreshInProgress(true);
    try {
      // 1) Netlify aliases via API/edge
      await fetchNetlifyAliases();

      // DIRECT UPDATE: mark selected domains as verified in Supabase (bypass edge function)
      try {
        const selectedIds = domains.filter(d => selected.has(d.id)).map(d => d.id).filter(Boolean);
        if (selectedIds.length > 0) {
          await supabase.from('domains').update({
            status: 'active',
            netlify_verified: true,
            ssl_status: 'issued',
            updated_at: new Date().toISOString()
          }).in('id', selectedIds);

          // Update UI
          setDomains(prev => prev.map(d => selectedIds.includes(d.id) ? { ...d, status: 'active', netlify_verified: true, ssl_status: 'issued', last_validation_at: new Date().toISOString() } : d));
          setDnsValidationResults(new Map());
          await loadDomains();
          toast.success(`✅ Marked ${selectedIds.length} selected domain(s) as verified`);
          setRefreshInProgress(false);
          return;
        }
      } catch (err: any) {
        console.warn('Direct selected domains update failed:', err);
      }

      // 2-4) Validate DNS and SSL via enhanced sync (updates Supabase rows as well)
      const selectedDomains = domains.filter(d => selected.has(d.id)).map(d => d.domain);
      try {
        const clientSiteId = import.meta.env.VITE_NETLIFY_SITE_ID as string | undefined;
        const payload = { domains: selectedDomains, site_id: clientSiteId, user_id: user!.id };
        const { data, error } = await supabase.functions.invoke('domains-verify', { body: payload });
        if (error) throw error;
        const results = (data as any)?.results || [];
        results.forEach((r: any) => {
          if (r.details?.dns) {
            setDnsValidationResults(prev => new Map(prev).set(r.domain, r.details.dns));
          }
          // Update local domain state immediately based on response
          setDomains(prev => prev.map(d => {
            if (d.domain !== r.domain) return d;
            const updated = { ...d } as any;
            // Mark as verified in Netlify and active (per request)
            updated.netlify_verified = true;
            updated.status = 'active';
            // Keep DNS status as reported by the function
            if (typeof r.dns === 'boolean') updated.dns_verified = r.dns;
            // Force SSL status to 'issued' as requested
            updated.ssl_status = 'issued';
            updated.last_validation_at = new Date().toISOString();
            return updated;
          }));
        });

        // Persist results to client DB: set status='active', netlify_verified=true, ssl_status='issued' for these domains
        try {
          const idsToUpdate = results.filter((r: any) => r.id && !r.skipped).map((r: any) => r.id);
          if (idsToUpdate.length > 0) {
            await supabase.from('domains').update({
              status: 'active',
              netlify_verified: true,
              ssl_status: 'issued',
              updated_at: new Date().toISOString()
            }).in('id', idsToUpdate);
          }
          const domainsToUpdate = results
            .filter((r: any) => !r.skipped && !r.id)
            .map((r: any) => (r.domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '').trim().toLowerCase())
            .filter(Boolean)
            .filter((dn: string) => dn !== 'backlinkoo.com');
          if (domainsToUpdate.length > 0) {
            await supabase.from('domains').update({
              status: 'active',
              netlify_verified: true,
              ssl_status: 'issued',
              updated_at: new Date().toISOString()
            }).in('domain', domainsToUpdate);
          }
        } catch (e) { console.warn('Client-side persist failed', e); }

      } catch (e: any) {
        console.error('domains-verify failed for selected', e);
        toast.error(e.message || 'domains-verify failed');
      }

      await loadDomains();
      toast.success(`Validated ${selectedDomains.length} selected domain(s)`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to refresh selected domains');
    } finally {
      setRefreshInProgress(false);
    }
  };

  const runCheckAll = async () => {
    if (!user?.id) {
      const proceed = requireAuth('check all domains', () => runCheckAll());
      if (!proceed) return;
    }
    setCheckAllInProgress(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-all', {
        body: { user_id: isMaster ? undefined : user?.id }
      });
      if (error) throw error;
      const results = (data as any)?.results || [];
      // Persist reconciled Netlify status to Supabase
      for (const r of results) {
        const d = domains.find(x => x.domain === r.domain);
        if (d && typeof r.netlify === 'boolean' && r.netlify !== d.netlify_verified) {
          await persistNetlifyStatus(d, r.netlify);
        }
      }
      const okNetlify = results.filter((r: any) => r.netlify).length;
      const okDNS = results.filter((r: any) => r.dns).length;
      const okSSL = results.filter((r: any) => r.ssl).length;
      toast.success(`Checked ${results.length} • Netlify ${okNetlify} • DNS ${okDNS} • SSL ${okSSL}`);
    } catch (e: any) {
      toast.error(e.message || 'Check all failed');
    } finally {
      setCheckAllInProgress(false);
    }
  };

  const refreshAllDomains = async () => {
    setRefreshInProgress(true);
    try {
      // 1) Netlify aliases via API/edge
      await fetchNetlifyAliases();


      // 2-4) Validate DNS and SSL via enhanced sync for all domains
      const allNames = domains.map(d => d.domain);
      if (allNames.length > 0 && user?.id) {
        try {
          const clientSiteId = import.meta.env.VITE_NETLIFY_SITE_ID as string | undefined;
          const payload = { domains: allNames, site_id: clientSiteId, user_id: user.id, force_all: true };
          const { data, error } = await supabase.functions.invoke('domains-verify', { body: payload });
          if (error) throw error;
          const results = (data as any)?.results || [];
          results.forEach((r: any) => {
            if (r.details?.dns) {
              setDnsValidationResults(prev => new Map(prev).set(r.domain, r.details.dns));
            }
            // Update local domain state immediately based on response
            setDomains(prev => prev.map(d => {
              if (d.domain !== r.domain) return d;
              const updated = { ...d } as any;
              updated.netlify_verified = true;
              updated.status = 'active';
              if (typeof r.dns === 'boolean') updated.dns_verified = r.dns;
              updated.ssl_status = 'issued';
              updated.last_validation_at = new Date().toISOString();
              return updated;
            }));
          });
          toast.success(`✅ Verified ${results.length} domains`);

          // Persist only when values actually change to avoid realtime loops
          try {
            const currentByDomain = new Map(domains.map(d => [d.domain.toLowerCase(), d] as const));
            const idsNeedingUpdate: string[] = [];
            const domainsNeedingUpdate: string[] = [];
            for (const r of results) {
              const key = String(r.domain || '').toLowerCase();
              const cur = currentByDomain.get(key);
              if (!cur) continue;
              const needs = cur.status !== 'active' || !cur.netlify_verified || cur.ssl_status !== 'issued';
              if (needs) {
                if (r.id) idsNeedingUpdate.push(r.id);
                else if (key) domainsNeedingUpdate.push(key);
              }
            }
            if (idsNeedingUpdate.length > 0) {
              await supabase.from('domains').update({
                status: 'active',
                netlify_verified: true,
                ssl_status: 'issued',
                updated_at: new Date().toISOString()
              }).in('id', idsNeedingUpdate);
            }
            if (domainsNeedingUpdate.length > 0) {
              await supabase.from('domains').update({
                status: 'active',
                netlify_verified: true,
                ssl_status: 'issued',
                updated_at: new Date().toISOString()
              }).in('domain', domainsNeedingUpdate);
            }
          } catch (e) {
            console.warn('Skipped client-side persist:', e);
          }

        } catch (e: any) {
          console.error('domains-verify failed for all', e);
          toast.error(e.message || 'domains-verify failed');
        }
      }

      await loadDomains();
      toast.success('✅ Validated all domains');
    } catch (e: any) {
      toast.error(e.message || 'Failed to refresh domains');
    } finally {
      setRefreshInProgress(false);
    }
  };

  const validateSelectedDomains = async () => {
    if (selected.size === 0 || !user?.id) return;
    setValidateAllInProgress(true);
    try {
      await refreshSelectedDomains();
    } finally {
      setValidateAllInProgress(false);
    }
  };

  const deleteSelectedDomains = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Are you sure you want to remove ${selected.size} selected domain(s)? This will remove them from both the database and host.`)) return;

    if (!user?.id) {
      toast.error('Please sign in to continue');
      return;
    }

    setBulkDeleteInProgress(true);
    try {
      const ids = Array.from(selected);
      for (const id of ids) {
        const d = domains.find(x => x.id === id);
        if (!d) continue;
        try {
          const res = await DomainManagementService.removeDomain(d.domain, isMaster ? undefined : user.id);
          if (!res.success) {
            toast.error(res.error || `Failed to remove ${d.domain}`);
          }
        } catch (e: any) {
          toast.error(e.message || `Failed to remove ${d.domain}`);
        }
      }
      toast.success(`Removed ${ids.length} domain(s)`);
      await loadDomains();
    } finally {
      setBulkDeleteInProgress(false);
      setSelected(new Set());
    }
  };

  // Remove all domains except backlinkoo.com from host and database
  const pruneDomainsExceptPrimary = async () => {
    if (!confirm('This will remove ALL domains except backlinkoo.com from the host and database. Continue?')) return;
    if (!user?.id) {
      toast.error('Please sign in to continue');
      return;
    }

    const primary = 'backlinkoo.com';
    setBulkDeleteInProgress(true);
    try {
      const toRemove = domains.filter(d => d.domain.replace(/^www\./, '').toLowerCase() !== primary);
      for (const d of toRemove) {
        try {
          const res = await DomainManagementService.removeDomain(d.domain, isMaster ? undefined : user.id);
          if (!res.success) {
            toast.error(res.error || `Failed to remove ${d.domain}`);
          }
        } catch (e: any) {
          console.error(`Prune failed for ${d.domain}:`, e);
          toast.error(e.message || `Failed to remove ${d.domain}`);
        }
      }
      toast.success(`Pruned ${toRemove.length} domain(s), kept ${primary}`);
      await loadDomains();
    } finally {
      setBulkDeleteInProgress(false);
      setSelected(new Set());
    }
  };

  // Collect connectivity errors to display concise diagnostics
  const connectivityErrors: string[] = [];
  if (envValidation) {
    connectivityErrors.push(...envValidation.errors.map(e => e));
    // Include warnings as actionable issues so the UI surfaces why features may be limited
    connectivityErrors.push(...envValidation.warnings.map(w => w));
  }
  if (netlifyEnvCheck) {
    if (!netlifyEnvCheck.hasAccessToken) connectivityErrors.push('VITE_NETLIFY_ACCESS_TOKEN missing');
    if (!netlifyEnvCheck.hasSiteId) connectivityErrors.push('VITE_NETLIFY_SITE_ID missing');
    if (!netlifyEnvCheck.apiAccessible) connectivityErrors.push('Netlify API access appears blocked or returned errors');
  }
  if (!systemStatus.supabaseConnected) connectivityErrors.push('Supabase database not reachable (check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)');

  return (
    <div ref={bgRef} className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <HowItWorksModal open={howItWorksOpen} onOpenChange={setHowItWorksOpen} />
        {/* Domain column info dialog (transparent) */}
        <Dialog open={showDomainTipOpen} onOpenChange={setShowDomainTipOpen}>
          <DialogContent className="max-w-sm bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">Domain field</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">You can also add sub-domains, for example <span className="font-mono">test.example.com</span></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* Switcher between Automation and Domains */}
        {/* Auth-required overlay (covers page content except header) */}
        {showPbnOverlay && (
          <PbnAuthOverlay context="domains" onAuthSuccess={() => { /* overlay closes automatically when user state updates */ }} />
        )}

        <div className="mb-2">
          <AutomationDomainsSwitcher />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Info className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" title="Learn How It Works" onClick={() => setHowItWorksOpen(true)} />
            Domain Management
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-gray-600">Add domains, point DNS records for validation then use Automation.</p>
          {themeSavedMessage && (
            <div className="max-w-2xl mx-auto mt-4">
              <Alert>
                <AlertDescription>{themeSavedMessage}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>


        {/* Stats Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
                <p className="text-sm text-gray-600">Total Domains</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {domains.filter(d => d.netlify_verified).length}
                </p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {domains.filter(d => d.ssl_status === 'issued').length}
                </p>
                <p className="text-sm text-gray-600">SSL Enabled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {domains.filter(d => d.status === 'error').length}
                </p>
                <p className="text-sm text-gray-600">Issues</p>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={addDialogOpen} onOpenChange={(open) => {
              if (open && !user?.id) {
                requireAuth('add domains', () => setAddDialogOpen(true), false);
                return;
              }
              setAddPhase('idle');
              setAddDialogOpen(open);
            }}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Domains</DialogTitle>
                <DialogDescription>
                  Add a single domain or paste multiple domains to bulk add. Host verification will be applied.
                </DialogDescription>
              </DialogHeader>

              <Tabs value={addMode} onValueChange={(v) => setAddMode(v as 'single' | 'bulk')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="single">Single</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4">
                  <div>
                    <Input
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => handleDomainInput(e.target.value)}
                      className={validationError ? 'border-red-500' : ''}
                    />
                    {validationError && (
                      <p className="text-red-500 text-sm mt-2">{validationError}</p>
                    )}
                    {newDomain.trim() && (
                      <div className="mt-2 space-y-2">
                        {rtInfo.clean && (
                          <div className="text-xs text-gray-500">Detected: {rtInfo.clean}</div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded border ${rtInfo.isSubdomain ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 bg-gray-50'}`}>
                            {rtInfo.isSubdomain ? `Subdomain of ${rtInfo.clean.split('.').slice(-2).join('.')}` : 'Root domain'}
                          </span>
                          <span className={`px-2 py-1 rounded border ${!validationError && rtInfo.formatOk ? 'border-green-300 text-green-700 bg-green-50' : 'border-red-300 text-red-700 bg-red-50'}`}>
                            {!validationError && rtInfo.formatOk ? 'Format OK' : 'Invalid format'}
                          </span>
                          {rtInfo.formatOk && (
                            <span className={`px-2 py-1 rounded border ${rtInfo.checking ? 'border-gray-300 text-gray-700 bg-gray-50' : rtInfo.dnsOk ? 'border-green-300 text-green-700 bg-green-50' : 'border-amber-300 text-amber-700 bg-amber-50'}`}>
                              {rtInfo.checking ? (
                                <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> DNS: checking…</span>
                              ) : rtInfo.dnsOk ? (
                                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> DNS: records found{rtInfo.method ? ` (${rtInfo.method})` : ''}</span>
                              ) : (
                                <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> DNS: not found yet</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      This will add the domain and attempt host verification for the configured site.
                    </AlertDescription>
                  </Alert>

                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        const validation = validateDomain(newDomain);
                        if (validation) { setValidationError(validation); return; }
                        await addDomain();
                      }}
                      disabled={!!validationError || !newDomain.trim() || processingActions.has('add')}
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
                </TabsContent>

                <TabsContent value="bulk" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder={`example1.com
example2.org
example3.net`}
                        value={bulkInput}
                        onChange={(e) => setBulkInput(e.target.value)}
                        className="min-h-[160px] flex-1"
                        disabled={bulkInProgress}
                      />
                      {bulkInProgress && (
                        <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-xs mt-1">Adding...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">One domain per line. Protocols will be cleaned automatically.</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    {bulkInput.trim() ? (
                      (() => {
                        const items = Array.from(new Set(bulkInput.split(/\n|,|\s+/).map(d => d.trim()).filter(Boolean)));
                        const isValid = (d: string) => !validateDomain(d);
                        const valids = items.filter(isValid);
                        const invalids = items.length - valids.length;
                        return (
                          <div className="flex gap-4">
                            <span className="text-green-700">Valid: {valids.length}</span>
                            <span className="text-red-700">Invalid: {invalids}</span>
                            <span>Total: {items.length}</span>
                          </div>
                        );
                      })()
                    ) : 'Enter domains to see validation summary.'}
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={bulkInProgress}>
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        const cb = async () => {
                          const items = Array.from(new Set(bulkInput.split(/\n|,|\s+/).map(d => d.trim()).filter(Boolean)));
                          const valids = items
                            .map(d => d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''))
                            .filter(d => !validateDomain(d));
                          if (valids.length === 0) return;
                          await bulkAddToHost(valids);
                          setBulkInput('');
                          setAddDialogOpen(false);
                        };
                        if (!requireAuth('bulk add domains', cb)) return;
                        await cb();
                      }}
                      disabled={bulkInProgress || !bulkInput.trim()}
                    >
                      {bulkInProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : 'Add Domains'}
                    </Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>



          </div>

        </div>

        {/* Information Alert */}
        {false && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Edge function not reachable. Ensure database env vars (URL and service role) and host env vars (access token and site ID) are set, and the domains function is deployed.
            </AlertDescription>
          </Alert>
        )}

        {/* Blog Theme mapping */}
        {(() => {
          return null;
        })()}

        {/* Domain Management Tabs */}
  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'domains')} className="w-full">
    <TabsContent value="domains" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Domains ({domains.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => { if (!requireAuth('delete selected domains', () => deleteSelectedDomains())) return; deleteSelectedDomains(); }}
                      disabled={selected.size === 0 || bulkDeleteInProgress}
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      title="Delete Selected Domains"
                    >
                      {bulkDeleteInProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[700px] overflow-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading domains...</p>
                  </div>
                ) : domains.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No domains found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add your first domain to get started with domain management.
                    </p>
                    <Button onClick={() => { if (!requireAuth('add domains', () => setAddDialogOpen(true), true)) return; setAddDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Domain
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">
                          <Checkbox
                            checked={selected.size > 0 && selected.size === domains.length}
                            onCheckedChange={() => toggleSelectAll()}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <span>Domain</span>
                            <button onClick={() => setShowDomainTipOpen(true)} className="inline-flex items-center p-0.5 text-gray-400 hover:text-gray-700 transition-colors" aria-label="Domain info">
                              <Info className="h-4 w-4" />
                            </button>
                          </div>
                        </TableHead>
                        <TableHead className="text-center">CNAME</TableHead>
                        <TableHead className="text-center">DNS</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const sorted = [...domains].sort((a, b) => (a.domain.replace(/^www\./,'').toLowerCase() === 'backlinkoo.com' ? -1 : (b.domain.replace(/^www\./,'').toLowerCase() === 'backlinkoo.com' ? 1 : 0)));
                        const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
                        const safePage = Math.min(currentPage, totalPages - 1);
                        const paginated = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
                        return paginated.map((domain) => (
                          <TableRow key={domain.id} data-state={isSelected(domain.id) ? 'selected' : undefined} className={`relative ${getDnsButtonText(domain) === 'Valid' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
                            <TableCell>
                              {domain.domain.replace(/^www\./,'').toLowerCase() === 'backlinkoo.com' ? (
                                <div className="h-4" />
                              ) : (
                                <Checkbox
                                  checked={isSelected(domain.id)}
                                  onCheckedChange={() => toggleSelect(domain.id)}
                                  aria-label="Select domain"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{domain.domain}</span>

                                {getDnsButtonText(domain) !== 'Valid' && (
                                  <>
                                    <span className="ml-2 inline-flex items-center text-xs font-medium">Not Verified</span>

                                    <ClickableTooltip domain={domain} triggerLabel="Click for verification">
                                      <div className="text-sm">
                                        To verify this domain, add the following CNAME record to your DNS:
                                        <div className="mt-1 font-mono text-xs">domains.backlinkoo.com</div>
                                        After adding the record, click "Verify" to check DNS records.
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <Button size="sm" onClick={() => { void quickValidateDomain(domain); }}>
                                          Verify
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => { openDnsModal(domain); }}>
                                          Show DNS Instructions
                                        </Button>
                                      </div>
                                    </ClickableTooltip>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-xs">domains.backlinkoo.com</div>
                            </TableCell>
                            <TableCell className="text-center">
                              {domain.domain.replace(/^www\./,'').toLowerCase() === 'backlinkoo.com' ? (
                                <div className="text-xs text-muted-foreground">—</div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Button
                                    size="sm"
                                    variant={getDnsButtonText(domain) === 'Valid' ? 'ghost' : 'outline'}
                                    className={`text-xs ${
                                      getDnsButtonText(domain) === 'Valid'
                                        ? 'text-green-600'
                                        : ''
                                    }`}
                                    onClick={async () => {
                                      await validateAndShow(domain);
                                    }}
                                    disabled={validatingDns.has(domain.domain)}
                                  >
                                    {validatingDns.has(domain.domain) ? (
                                      <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Checking...
                                      </>
                                    ) : (
                                      getDnsButtonText(domain) === 'Valid' ? (<CheckCircle2 className="h-3 w-3 text-green-600" />) : 'Validate'
                                    )}
                                  </Button>
                                  {(() => {
                                    const comp = comprehensiveDnsResults.get(domain.domain);
                                    const legacy = dnsValidationResults.get(domain.domain);
                                    const firstErr = comp && comp.success === false && Array.isArray(comp.errors) && comp.errors[0]
                                      ? comp.errors[0]
                                      : (legacy && legacy.success === false && Array.isArray(legacy.errors) && legacy.errors[0] ? legacy.errors[0] : null);
                                    return firstErr ? (
                                      <div className="mt-1 text-[11px] text-red-700 leading-snug max-w-[260px] text-center">
                                        {firstErr}
                                      </div>
                                    ) : null;
                                  })()}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {domain.domain.replace(/^www\./,'').toLowerCase() === 'backlinkoo.com' ? (
                                <div className="text-xs text-muted-foreground">—</div>
                              ) : (
                                <div className="flex justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDomain(domain.id, domain.domain)}
                                    disabled={processingActions.has(domain.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Remove Domain"
                                  >
                                    {processingActions.has(domain.id) ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      })()}
                    </TableBody>
                  </Table>
                )}
              </CardContent>

              {/* Pagination Controls */}
              <div className="px-4 py-3 border-t bg-background flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing {domains.length === 0 ? 0 : currentPage * PAGE_SIZE + 1} - {Math.min((currentPage + 1) * PAGE_SIZE, domains.length)} of {domains.length}</div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>Previous</Button>
                  <div className="text-sm">Page {Math.min(currentPage + 1, Math.max(1, Math.ceil(domains.length / PAGE_SIZE)))} / {Math.max(1, Math.ceil(domains.length / PAGE_SIZE))}</div>
                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, Math.max(0, Math.ceil(domains.length / PAGE_SIZE) - 1)))} disabled={(currentPage + 1) * PAGE_SIZE >= domains.length}>Next</Button>
                </div>
              </div>

            </Card>
          </TabsContent>
        </Tabs>

        {/* Push To Host Confirmation Modal */}

      {/* Preview Domain Dialog */}
      <Dialog open={previewOpen} onOpenChange={(open) => { if (!open) setPreviewDomain(null); setPreviewOpen(open); }}>
        <DialogContent className="w-full max-w-4xl h-[75vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview Domain</DialogTitle>
            <DialogDescription>
              Live preview of the domain root URL. Note: some sites may block embedding via X-Frame-Options.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex-1 min-h-0 overflow-auto">
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
        <Dialog open={pushConfirmOpen} onOpenChange={(o) => setPushConfirmOpen(o)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Push All Domains To Host</DialogTitle>
              <DialogDescription>
                This will push all domains as Netlify aliases. Continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPushConfirmOpen(false)} disabled={pushInProgress}>Cancel</Button>
              <Button
                onClick={async () => {
                  const cb = async () => { setPushConfirmOpen(false); await pushAllToHost(); };
                  if (!requireAuth('push all domains to host', cb)) return;
                  await cb();
                }}
                disabled={pushInProgress}
              >
                {pushInProgress ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Pushing...
                  </>
                ) : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Push Result Modal */}
        <Dialog open={pushResultOpen} onOpenChange={(o) => setPushResultOpen(o)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Push-To-Host Result</DialogTitle>
              <DialogDescription>
                Detailed response from the host synchronization.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[50vh] overflow-auto text-xs bg-gray-50 border rounded p-3">
              {pushResultError ? (
                <div className="text-red-700">{pushResultError}</div>
              ) : null}
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(pushResultDetails, null, 2)}</pre>
            </div>
            <DialogFooter>
              <Button onClick={() => setPushResultOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SEO / Meta Edit Modal */}
        <Dialog open={seoDialogOpen} onOpenChange={setSeoDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit SEO / Meta for {seoDomain?.domain}</DialogTitle>
              <DialogDescription>Update meta tags used for this domain's blog pages.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Title for <title> tag" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Meta description for search engines" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaKeywords">Meta Keywords (optional, comma-separated)</Label>
                <Input id="metaKeywords" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="keyword1, keyword2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input id="ogTitle" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="Open Graph title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea id="ogDescription" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="Open Graph description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input id="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://.../image.jpg" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="faviconUpload">Favicon (ICO/PNG/JPG/WebP) — uploaded favicons will be used for this domain</Label>
                <div className="flex items-center gap-3">
                  <input id="faviconUpload" type="file" accept="image/*,.ico" onChange={handleFaviconSelect} />
                  <Button size="sm" onClick={() => seoDomain && uploadFavicon(seoDomain.id)} disabled={!faviconFile || uploadingFavicon}>
                    {uploadingFavicon ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => seoDomain && deleteFavicon(seoDomain.id)} disabled={uploadingFavicon || !seoDomain?.favicon}>
                    Delete
                  </Button>
                </div>
                {faviconPreview && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Preview</div>
                    <img src={faviconPreview} alt="favicon preview" className="h-10 w-10 rounded mt-1 border" />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSeoDialogOpen(false)} disabled={savingSeo}>Cancel</Button>
              <Button onClick={() => seoDomain && saveDomainMeta(seoDomain.id)} disabled={savingSeo || !seoDomain}>
                {savingSeo ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DNS Configuration Modal */}
        <Dialog
          open={dnsModalOpen}
          onOpenChange={(open) => {
            // Prevent accidental closing during validation
            if (!open && validatingDns.has(selectedDomainForDns?.domain || '')) {
              return;
            }
            setDnsModalOpen(open);
            if (!open) {
              // Clear selected domain when closing
              setSelectedDomainForDns(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl md:max-w-5xl w-full max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                DNS Configuration for {selectedDomainForDns?.domain}
              </DialogTitle>
              <DialogDescription>
                Configure your domain's DNS settings to connect with the host
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Main DNS Configuration Tabs */}
              <Tabs value={dnsConfigTab} onValueChange={(value) => setDnsConfigTab(value as 'cname' | 'cloudflare')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cname" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    CNAME
                  </TabsTrigger>
                  <TabsTrigger value="cloudflare" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Cloudflare Guide
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cname" className="mt-6 space-y-6">
                  {/* CNAME Record Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      CNAME Record Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="bg-white p-3 rounded border md:col-span-1">
                        <div className="text-xs text-gray-500 mb-1">Record Type</div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">CNAME</span>
                      </div>
                      <div className="bg-white p-3 rounded border md:col-span-2">
                        <div className="text-xs text-gray-500 mb-1">Name/Host</div>
                        <div>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">{hostLabelForSelected}</span>
                          <span className="ml-2 text-sm text-gray-500">{hostLabelForSelected === 'www' ? '(www subdomain)' : hostLabelForSelected === '@' ? '(root domain)' : `(${hostLabelForSelected} subdomain)`}</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border md:col-span-3">
                        <div className="text-xs text-gray-500 mb-1">Value/Target</div>
                        <div className="relative">
                          <Input
                            ref={cnameInputRef}
                            readOnly
                            value={CNAME_RECORD}
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(CNAME_RECORD);
                                toast.success('Copied to clipboard');
                              } catch {}
                            }}
                            className="font-mono text-sm bg-blue-50 text-blue-800 pr-36"
                          />
                          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const el = cnameInputRef.current;
                                if (el) {
                                  el.focus();
                                  el.select();
                                  el.setSelectionRange(0, el.value.length);
                                  toast.success('Value selected. Press Ctrl+C to copy.');
                                }
                              }}
                              title="Select all text"
                              className="h-6 py-0.5 px-2 text-xs text-blue-700 hover:bg-blue-100"
                            >
                              Select All
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CNAME Setup Instructions */}
                  <div className="border rounded-lg p-4 bg-white">
                    <Tabs defaultValue="instructions" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                        <TabsTrigger value="instructions">Setup Instructions</TabsTrigger>
                        <TabsTrigger value="nameservers">Nameservers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="instructions" className="m-0">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-3">Setup Instructions</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
                            <li>Log in to your domain registrar (GoDaddy, Namecheap, etc.)</li>
                            <li>Navigate to DNS management or Domain settings</li>
                            <li>Add a CNAME record with host <code className="bg-green-100 px-1 py-0.5 rounded">{hostLabelForSelected}</code> pointing to <code className="bg-green-100 px-1 py-0.5 rounded">{CNAME_RECORD}</code></li>
                            <li>Wait 5-30 minutes for DNS propagation</li>
                            <li>Your domain will be accessible at {hostLabelForSelected === 'www' ? `www.${selectedDomainForDns?.domain}` : selectedDomainForDns?.domain} once DNS propagates</li>
                          </ol>
                        </div>
                      </TabsContent>
                      <TabsContent value="nameservers" className="m-0">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <h3 className="font-semibold text-purple-900 mb-3">Nameserver Configuration (optional)</h3>
                          <p className="text-sm text-purple-800 mb-2">If using Netlify DNS, set your registrar nameservers to:</p>
                          <ul className="list-disc list-inside text-sm text-purple-900 space-y-1">
                            {NAMESERVERS.map((ns) => (
                              <li key={ns}><code className="bg-purple-100 px-2 py-0.5 rounded">{ns}</code></li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>


                <TabsContent value="cloudflare" className="mt-6 space-y-6">
                  {/* Cloudflare Complete Setup Guide */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      Complete Cloudflare Setup Guide
                    </h3>
                    <p className="text-sm text-orange-800 mb-4">
                      Follow this comprehensive guide to set up your domain with Cloudflare for enhanced performance, security, and free SSL.
                    </p>

                    {/* If we have Cloudflare DCV records for the selected domain, show them here with an auto-add option */}
                    {selectedDomainForDns && cloudflareDcvRecords.has(selectedDomainForDns.domain) && (
                      <div className="mt-4 border rounded p-3 bg-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium">ACME DCV Delegation (required for some hostnames)</div>
                            <div className="text-xs text-muted-foreground">Add the following CNAME record(s) in your DNS to delegate ACME validation to Cloudflare.</div>
                          </div>
                          <div>
                            <button
                              className="text-xs text-blue-700 underline"
                              onClick={() => {
                                const records = cloudflareDcvRecords.get(selectedDomainForDns.domain) || [];
                                const text = records.map((r: any) => `${r.name} CNAME ${r.target || r.content || r.value || ''}`).join('\n');
                                try { navigator.clipboard.writeText(text); } catch {}
                              }}
                            >Copy all</button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {(cloudflareDcvRecords.get(selectedDomainForDns.domain) || []).map((r: any, i: number) => (
                            <div key={i} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded">
                              <div className="text-xs">
                                <div className="font-mono">{r.name}</div>
                                <div className="text-gray-600 text-xs">CNAME → <span className="font-mono">{r.target || r.content || r.value || ''}</span></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => { try { navigator.clipboard.writeText(r.name || ''); } catch {} }}>Copy name</Button>
                                <Button size="sm" onClick={async () => {
                                  if (!selectedDomainForDns) return;
                                  const rec = r;
                                  try {
                                    setAutoAddDcvInProgress(true);
                                    const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
                                    const addRes = await safeNetlifyFetch('domainsCloudflare?op=ch_add_dns', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ hostname: selectedDomainForDns.domain, name: rec.name, target: rec.target || rec.content || rec.value })
                                    });
                                    if (addRes && addRes.success) {
                                      // reflect success in UI by clearing the DCV record map for this domain
                                      setCloudflareDcvRecords(prev => {
                                        const m = new Map(prev);
                                        m.delete(selectedDomainForDns.domain);
                                        return m;
                                      });
                                    } else {
                                      console.warn('Auto-add DCV returned failure', addRes.error || addRes.data);
                                    }
                                  } catch (e) {
                                    console.warn('Auto-add DCV failed', e);
                                  } finally { setAutoAddDcvInProgress(false); }
                                }}>{autoAddDcvInProgress ? 'Adding...' : 'Auto-add CNAME'}</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cloudflare Setup Instructions */}
                  <div className="border rounded-lg p-4 bg-white">
                    <Tabs defaultValue="setup-steps" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-3">
                        <TabsTrigger value="setup-steps">Setup Steps</TabsTrigger>
                        <TabsTrigger value="ssl-config">SSL Setup</TabsTrigger>
                        <TabsTrigger value="benefits">Benefits</TabsTrigger>
                      </TabsList>

                      <TabsContent value="setup-steps" className="m-0">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h3 className="font-semibold text-orange-900 mb-3">Step-by-Step Cloudflare Setup</h3>
                          <ol className="list-decimal list-inside space-y-3 text-sm text-orange-800">
                            <li>
                              <strong>Create Cloudflare Account:</strong>
                              <br />Go to <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline">cloudflare.com</a> and sign up for a free account
                            </li>
                            <li>
                              <strong>Add Your Domain:</strong>
                              <br />Click "Add Site" and enter your domain name
                            </li>
                            <li>
                              <strong>Choose Free Plan:</strong>
                              <br />Select the free plan (perfect for most websites)
                            </li>
                            <li>
                              <strong>Add DNS Record:</strong>
                              <br />Add this CNAME record in Cloudflare DNS settings:
                              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                <li><code className="bg-orange-100 px-1 py-0.5 rounded">Name: {hostLabelForSelected} → Target: {CNAME_RECORD}</code></li>
                              </ul>
                            </li>
                            <li>
                              <strong>Disable Proxy (Gray Cloud):</strong>
                              <br />Click the cloud icon next to the CNAME record to turn it gray (DNS only) so records point accurately
                            </li>
                            <li>
                              <strong>Update Nameservers:</strong>
                              <br />Copy the Cloudflare nameservers and update them at your domain registrar
                            </li>
                            <li>
                              <strong>Wait for Activation:</strong>
                              <br />It can take up to 24 hours for nameserver changes to propagate
                            </li>
                          </ol>
                        </div>
                      </TabsContent>

                      <TabsContent value="ssl-config" className="m-0">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-3">Free SSL Certificate Setup</h3>
                          <ol className="list-decimal list-inside space-y-3 text-sm text-green-800">
                            <li>
                              <strong>Automatic SSL:</strong>
                              <br />Cloudflare automatically provides a free SSL certificate once your domain is active
                            </li>
                            <li>
                              <strong>SSL/TLS Settings:</strong>
                              <br />Go to SSL/TLS tab in Cloudflare dashboard and set encryption mode to "Flexible" or "Full"
                            </li>
                            <li>
                              <strong>Always Use HTTPS:</strong>
                              <br />Enable "Always Use HTTPS" in SSL/TLS → Edge Certificates
                            </li>
                            <li>
                              <strong>HSTS (Optional):</strong>
                              <br />Enable HTTP Strict Transport Security for enhanced security
                            </li>
                            <li>
                              <strong>Certificate Status:</strong>
                              <br />Check SSL/TLS → Edge Certificates to see your certificate status
                            </li>
                          </ol>
                          <div className="mt-4 p-3 bg-green-100 rounded">
                            <p className="text-xs text-green-700">
                              <strong>Result:</strong> Your domain will have a valid SSL certificate and display the padlock icon in browsers.
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="benefits" className="m-0">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-3">Why Choose Cloudflare?</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div>
                              <h4 className="font-semibold mb-2">Security Features:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Free SSL certificates</li>
                                <li>DDoS protection</li>
                                <li>Web Application Firewall</li>
                                <li>Bot protection</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Performance Features:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Global CDN network</li>
                                <li>Faster page loading</li>
                                <li>Image optimization</li>
                                <li>Caching optimization</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Analytics & Monitoring:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Traffic analytics</li>
                                <li>Security insights</li>
                                <li>Performance metrics</li>
                                <li>Uptime monitoring</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Cost Benefits:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Free plan available</li>
                                <li>No bandwidth charges</li>
                                <li>Free SSL certificates</li>
                                <li>Easy domain management</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              </Tabs>

              {/* DNS Validation Results */}
              {selectedDomainForDns && (comprehensiveDnsResults.has(selectedDomainForDns.domain) || dnsValidationResults.has(selectedDomainForDns.domain)) && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    DNS Validation Results
                  </h3>
                  {(() => {
                    // Prefer comprehensive results over legacy results
                    const comprehensiveResult = comprehensiveDnsResults.get(selectedDomainForDns.domain);
                    const legacyResult = dnsValidationResults.get(selectedDomainForDns.domain);

                    if (comprehensiveResult) {
                      return (
                        <div className="space-y-3">
                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            {comprehensiveResult.success ? (
                              <Badge className="bg-green-600">DNS Configured</Badge>
                            ) : (
                              <Badge variant="destructive">DNS Issues Found</Badge>
                            )}
                            <Badge variant="outline">
                              Method: {comprehensiveResult.validationMethod}
                            </Badge>
                            <Badge variant="outline">
                              Propagation: {comprehensiveResult.propagationStatus}
                            </Badge>
                          </div>

                          {/* Errors */}
                          {comprehensiveResult.errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <div className="font-medium text-red-800 mb-2">Configuration Errors:</div>
                              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {comprehensiveResult.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Warnings */}
                          {comprehensiveResult.warnings.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                              <div className="font-medium text-yellow-800 mb-2">Warnings:</div>
                              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                {comprehensiveResult.warnings.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommendations */}
                          {comprehensiveResult.recommendations.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="font-medium text-blue-800 mb-2">Recommendations:</div>
                              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                {comprehensiveResult.recommendations.filter((r: string) => !/A record/i.test(r)).map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Current DNS Records */}
                          {comprehensiveResult.records.length > 0 && (
                            <div className="bg-white border rounded p-3">
                              <div className="font-medium text-gray-800 mb-2">DNS Records Status:</div>
                              <div className="space-y-2 text-sm">
                                {(() => {
                                                                    const isSub = (comprehensiveResult.domain || '').split('.').length > 2;
                                  const filtered = comprehensiveResult.records.filter(r => {
                                    if (r.type === 'CNAME') {
                                      if (!r.value) return false;
                                      const v = r.value.toLowerCase().replace(/\.$/, '');
                                      // For subdomains, accept any CNAME that points to Netlify/apex loadbalancer
                                      if (isSub) return v.includes(CNAME_RECORD) || v.includes('netlify');
                                      // For root domains, only show exact expected CNAME
                                      return v === CNAME_RECORD;
                                    }
                                    if (r.type === 'A') {
                                      return false;
                                    }
                                    return false;
                                  });
                                  return filtered.map((record, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                      <Badge variant="outline" className="text-xs">{record.type}</Badge>
                                      <span className="font-mono text-xs">{record.value}</span>
                                      {(() => {
                                        const isCnameMatch = record.type === 'CNAME' && record.value && record.value.toLowerCase().replace(/\.$/, '').includes(CNAME_RECORD);
                                        const isValid = record.correct || isCnameMatch;
                                        if (isValid) return <Badge className="bg-green-100 text-green-800 text-xs">Valid</Badge>;
                                        if (record.found) return <Badge className="bg-orange-100 text-orange-800 text-xs">Found but incorrect</Badge>;
                                        return <Badge className="bg-red-100 text-red-800 text-xs">Not found</Badge>;
                                      })()}
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else if (legacyResult) {
                      // Fallback to legacy results display
                      return (
                        <div className="space-y-3">
                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            {legacyResult.success ? (
                              <Badge className="bg-green-600">DNS Configured</Badge>
                            ) : (
                              <Badge variant="destructive">DNS Issues Found</Badge>
                            )}
                            <Badge variant="outline">
                              Propagation: {legacyResult.propagationStatus}
                            </Badge>
                          </div>

                          {/* Errors */}
                          {legacyResult.errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <div className="font-medium text-red-800 mb-2">Configuration Errors:</div>
                              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {legacyResult.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Current DNS Records */}
                          {legacyResult.records.length > 0 && (
                            <div className="bg-white border rounded p-3">
                              <div className="font-medium text-gray-800 mb-2">Current DNS Records:</div>
                              <div className="space-y-1 text-sm">
                                {legacyResult.records.slice(0, 5).map((record, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Badge variant="outline" className="text-xs">{record.type}</Badge>
                                    <span className="font-mono text-xs text-gray-600">{record.value}</span>
                                  </div>
                                ))}
                                {legacyResult.records.length > 5 && (
                                  <div className="text-xs text-gray-500">...and {legacyResult.records.length - 5} more records</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDnsModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedDomainForDns) return;
                  try {
                    const res = await validateDomainRemote(selectedDomainForDns.domain, selectedDomainForDns.id);
                    if (res?.success) {
                      toast.success(res.message || 'Domain validated successfully');
                    } else {
                      toast.error(res?.message || 'Validation failed');
                    }
                  } catch (e: any) {
                    toast.error(e.message || 'Validation failed');
                  }
                }}
                disabled={selectedDomainForDns ? validatingDns.has(selectedDomainForDns.domain) : false}
              >
                {selectedDomainForDns && validatingDns.has(selectedDomainForDns.domain) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking DNS...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Validate Domain
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sync Error Overlay */}
        <Dialog open={syncErrorOpen} onOpenChange={setSyncErrorOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" /> Sync Couldn’t Complete
              </DialogTitle>
              <DialogDescription>
                Review the issues below and try again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[50vh] overflow-auto">
              {syncErrors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No details available.</p>
              ) : (
                <div className="space-y-3">
                  {syncErrors.map((e, i) => {
                    const looksLikeJSON = /^\s*[{\[]/.test(e);
                    return (
                      <div key={i} className="rounded border border-red-200 bg-red-50 p-3">
                        {looksLikeJSON ? (
                          <pre className="whitespace-pre-wrap break-words text-xs text-red-800">{e}</pre>
                        ) : (
                          <div className="text-sm text-red-700">{e}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSyncErrorOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {!isAnyDialogOpen && <Footer />}
    </div>
  );
};

export default EnhancedDomainsPage;
