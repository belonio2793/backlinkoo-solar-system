import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Settings,
  BarChart3,
  Loader2,
  RefreshCw,
  Link,
  Globe,
  Calendar,
  Eye,
  Copy,
  Edit3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getOrchestrator, type Campaign } from '@/services/automationOrchestrator';
import { realTimeFeedService } from '@/services/realTimeFeedService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CampaignErrorStatus from './CampaignErrorStatus';
import InlineProgressTracker from './InlineProgressTracker';
import { CampaignProgress } from './CampaignProgressTracker';
import { CampaignDetailsModal } from './CampaignDetailsModal';
import PublishedLinksDisplay from './PublishedLinksDisplay';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface PublishedLink {
  id: string;
  published_url: string;
  platform: string;
  published_at: string;
}

interface CampaignWithLinks extends Campaign {
  automation_published_links: PublishedLink[];
}

interface CampaignManagerTabbedProps {
  onStatusUpdate?: (message: string, type: 'success' | 'error' | 'info') => void;
  currentCampaignProgress?: CampaignProgress | null;
  onRetryProgress?: () => void;
}

const CampaignManagerTabbed: React.FC<CampaignManagerTabbedProps> = ({
  onStatusUpdate,
  currentCampaignProgress,
  onRetryProgress
}) => {
  const [campaigns, setCampaigns] = useState<CampaignWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [campaignStatusSummaries, setCampaignStatusSummaries] = useState<Map<string, any>>(new Map());
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [shownToastUrls, setShownToastUrls] = useState<Set<string>>(new Set());
  const [domainCount, setDomainCount] = useState<number>(0);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});
  const [campaignUrls, setCampaignUrls] = useState<Record<string, string[]>>({});

  // Pagination for campaigns
  const [campaignPage, setCampaignPage] = useState<number>(1);
  const campaignsPerPage = 1;

  // Per-campaign link pagination (shows 2 links at a time)
  const [linkPageMap, setLinkPageMap] = useState<Record<string, number>>({});
  const linksPerPage = 2;

  // Auto-switch to activity tab when a campaign progress starts
  useEffect(() => {
    if (currentCampaignProgress && !currentCampaignProgress.isComplete && !currentCampaignProgress.isError) {
      setActiveTab('activity');
    }
  }, [currentCampaignProgress]);
  const orchestrator = getOrchestrator();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();

    // Auto-refresh every 10 seconds
    const interval = setInterval(loadCampaigns, 10000);

    // Real-time feed integration for instant updates
    const handleFeedEvent = (event: any) => {
      // Force refresh campaigns when events occur
      if (['campaign_created', 'campaign_completed', 'campaign_failed', 'url_published'].includes(event.type)) {
        console.log('📡 Real-time event received, refreshing campaigns:', event.type);

        // Show toast notification for URL published events
        if (event.type === 'url_published') {
          const publishedUrl = event.details?.publishedUrl;

          // Only show toast if we haven't shown it for this URL already
          if (publishedUrl && !shownToastUrls.has(publishedUrl)) {
            setShownToastUrls(prev => new Set([...prev, publishedUrl]));

            toast({
              title: "New Backlink Published!",
              description: `Published "${event.details?.keyword || event.keyword || 'content'}" to ${event.details?.platform || event.platform || 'platform'}`,
              duration: 3000, // Shorter duration - just a few seconds
            });
          }

          // Note: Don't create duplicate status messages - BacklinkNotification handles popup notifications
        }

        // Refresh campaigns to show new data
        loadCampaigns();
      }
    };

    const unsubscribe = realTimeFeedService.subscribe(handleFeedEvent);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [toast, onStatusUpdate]);

  const loadCampaigns = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);

      // If user is not authenticated, don't try to load campaigns
      if (!user) {
        setCampaigns([]);
        setCampaignStatusSummaries(new Map());
        return;
      }

      const userCampaigns = await orchestrator.getUserCampaigns();
      
      // Load published links for each campaign
      const campaignsWithLinks = await Promise.all(
        userCampaigns.map(async (campaign) => {
          const campaignWithLinks = await orchestrator.getCampaignWithLinks(campaign.id);
          return campaignWithLinks || { ...campaign, automation_published_links: [] };
        })
      );
      
      // Load status summaries for each campaign
      const statusSummaries = new Map();
      for (const campaign of campaignsWithLinks) {
        const summary = orchestrator.getCampaignStatusSummary(campaign.id);
        statusSummaries.set(campaign.id, summary);
      }

      setCampaigns(campaignsWithLinks);
      setCampaignStatusSummaries(statusSummaries);

      // Load URLs per campaign from automation_posts
      try {
        const ids = campaignsWithLinks.map(c => c.id);
        if (ids.length) {
          const { data: urlRows } = await supabase
            .from('automation_posts')
            .select('automation_id, url')
            .in('automation_id', ids)
            .not('url', 'is', null);
          const map: Record<string, string[]> = {};
          (urlRows || []).forEach((r: any) => {
            const k = String(r.automation_id);
            if (!map[k]) map[k] = [];
            if (r.url && !map[k].includes(r.url)) map[k].push(r.url);
          });
          setCampaignUrls(map);
        } else {
          setCampaignUrls({});
        }
      } catch (e) {
        console.warn('Failed to load campaign URLs', e);
        setCampaignUrls({});
      }

      // Load progress counts
      await computeProgressCounts(campaignsWithLinks);

      if (showRefreshing) {
        onStatusUpdate?.('Campaigns refreshed successfully', 'success');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error loading campaigns:', {
        message: errorMessage,
        error: error
      });
      onStatusUpdate?.(`Failed to load campaigns: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadCampaigns(true);
  };

  const computeProgressCounts = async (items: CampaignWithLinks[]) => {
    if (!user?.id || !items || items.length === 0) {
      setPostCounts({});
      setDomainCount(0);
      return;
    }
    try {
      // Total domains for user excluding example domains
      const { count: domCount } = await supabase
        .from('domains')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
;
      setDomainCount(domCount || 0);

      // Completed posts per campaign (published_at not null)
      const ids = items.map((c) => c.id);
      const { data: posts } = await supabase
        .from('automation_posts')
        .select('automation_id, published_at')
        .in('automation_id', ids)
        .not('published_at', 'is', null);

      const map: Record<string, number> = {};
      for (const id of ids) map[id] = 0;
      (posts || []).forEach((p: any) => {
        const k = String(p.automation_id);
        map[k] = (map[k] || 0) + 1;
      });
      setPostCounts(map);
    } catch (e) {
      console.warn('computeProgressCounts failed', e);
    }
  };

  const handleViewDetails = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setShowDetailsModal(true);
  };

  const handlePauseCampaign = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      // Find the campaign to get details for the feed
      const campaign = campaigns.find(c => c.id === campaignId);
      const keyword = campaign?.keywords?.[0] || campaign?.name || 'Unknown';
      const campaignName = campaign?.name || `Campaign for ${keyword}`;
      
      await orchestrator.pauseCampaign(campaignId);
      
      // Emit real-time feed event
      realTimeFeedService.emitCampaignPaused(
        campaignId,
        campaignName,
        keyword,
        'Paused by user',
        user?.id
      );
      
      await loadCampaigns();
      onStatusUpdate?.('Campaign paused successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error pausing campaign:', {
        message: errorMessage,
        campaignId,
        error: error
      });
      
      // Emit error event to feed
      realTimeFeedService.emitUserAction(
        'pause_campaign_failed',
        `Failed to pause campaign: ${errorMessage}`,
        user?.id,
        campaignId
      );
      
      onStatusUpdate?.(`Failed to pause campaign: ${errorMessage}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      // Find the campaign to get details for the feed
      const campaign = campaigns.find(c => c.id === campaignId);
      const keyword = campaign?.keywords?.[0] || campaign?.name || 'Unknown';
      const campaignName = campaign?.name || `Campaign for ${keyword}`;

      // Check if campaign is completed
      const isCompleted = campaign?.status === 'completed';

      // Check published links to determine true completion status
      const campaignWithLinks = await orchestrator.getCampaignWithLinks(campaignId);
      const hasPublishedLinks = campaignWithLinks?.automation_published_links &&
                               campaignWithLinks.automation_published_links.length > 0;

      // If completed, show warning but proceed with forced resume
      if (isCompleted || hasPublishedLinks) {
        const publishedCount = campaignWithLinks?.automation_published_links?.length || 0;
        const warningMessage = `⚠️ Campaign "${keyword}" was completed with ${publishedCount} published link(s). Checking for new opportunities...`;

        onStatusUpdate?.(warningMessage, 'warning');

        // Force resume by publishing missing domain posts
        const result = await orchestrator.smartResumeCampaign(campaignId);

        if (result.success) {
          realTimeFeedService.emitCampaignResumed(
            campaignId,
            campaignName,
            keyword,
            'Force resumed completed campaign',
            user?.id
          );
          try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}

          onStatusUpdate?.(`Re-run complete: ${result.message}`, 'success');
        } else {
          onStatusUpdate?.(`Re-run finished with issues: ${result.message}`,'warning');
          if (Array.isArray((result as any).details) && (result as any).details.length) {
            const lines = (result as any).details.slice(0,5).map((d:any)=>`• ${d.domain || d.action}: ${d.error || d.message || (d.status ? `HTTP ${d.status}` : '')}`).join('\n');
            onStatusUpdate?.(lines, 'error');
          }
        }
      } else {
        // Normal resume then ensure all eligible domains have a post
        const resume = await orchestrator.resumeCampaign(campaignId);
        if (resume.success) {
          realTimeFeedService.emitCampaignResumed(
            campaignId,
            campaignName,
            keyword,
            'Resumed by user',
            user?.id
          );
          onStatusUpdate?.(resume.message, 'success');
        } else {
          onStatusUpdate?.(resume.message, 'error');
        }

        const result = await orchestrator.smartResumeCampaign(campaignId);
        if (result.success) {
          try { window.dispatchEvent(new Event('automation:posts:updated')); } catch {}
          onStatusUpdate?.(`Re-run complete: ${result.message}`, 'success');
        } else {
          onStatusUpdate?.(`Re-run finished with issues: ${result.message}`,'warning');
          if (Array.isArray((result as any).details) && (result as any).details.length) {
            const lines = (result as any).details.slice(0,5).map((d:any)=>`• ${d.domain || d.action}: ${d.error || d.message || (d.status ? `HTTP ${d.status}` : '')}`).join('\n');
            onStatusUpdate?.(lines, 'error');
          }
        }
      }

      await loadCampaigns();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error resuming campaign:', {
        message: errorMessage,
        campaignId,
        error: error
      });

      // Emit error event to feed
      realTimeFeedService.emitUserAction(
        'resume_campaign_failed',
        `Failed to resume campaign: ${errorMessage}`,
        user?.id,
        campaignId
      );

      onStatusUpdate?.(`Failed to resume campaign: ${errorMessage}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCampaign = async (campaignId: string, keyword: string) => {
    if (!confirm(`Are you sure you want to delete the campaign "${keyword}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(campaignId);
    try {
      // Try server-side Netlify function first
      try {
        const w: any = typeof window !== 'undefined' ? window : {};
        const candidatesRaw = [
          w?.NETLIFY_FUNCTIONS_URL || '',
          (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL || ''
        ].map((s: string) => String(s || '').trim()).filter(Boolean);

        // If running on Fly, prefer the Netlify functions host (if configured) because Fly won't serve Netlify functions
        const isFlyHost = typeof window !== 'undefined' && typeof window.location !== 'undefined' && String(window.location.host || '').includes('fly.dev');
        const netlifyEnv = (import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL || w?.NETLIFY_FUNCTIONS_URL || '';

        const candidates: string[] = [];

        if (isFlyHost && netlifyEnv) {
          const n = String(netlifyEnv).replace(/\/$/, '');
          if (n.includes('/.netlify/functions')) {
            candidates.push(n + '/deleteAutomationCampaign');
            const hostOnly = n.replace(/\/\.netlify\/functions.*$/, '');
            if (hostOnly) candidates.push(hostOnly + '/api/deleteAutomationCampaign');
          } else {
            candidates.push(n + '/.netlify/functions/deleteAutomationCampaign');
            candidates.push(n + '/api/deleteAutomationCampaign');
          }
        }

        for (const baseRaw of candidatesRaw) {
          const base = baseRaw.replace(/\/$/, '');
          if (!base) continue;
          // skip duplicate netlifyEnv entry
          if (netlifyEnv && base === String(netlifyEnv).replace(/\/$/, '')) continue;
          if (base.includes('/.netlify/functions')) {
            candidates.push(base.replace(/\/$/, '') + '/deleteAutomationCampaign');
            const hostOnly = base.replace(/\/\.netlify\/functions.*$/, '');
            if (hostOnly) candidates.push(hostOnly + '/api/deleteAutomationCampaign');
          } else {
            candidates.push(base + '/.netlify/functions/deleteAutomationCampaign');
            candidates.push(base + '/api/deleteAutomationCampaign');
          }
        }

        // Try simple API and functions relative paths on the current origin as last resort
        candidates.push('/api/deleteAutomationCampaign');
        candidates.push('/.netlify/functions/deleteAutomationCampaign');

        let lastError: any = null;
        let success = false;
        for (const fnUrl of candidates) {
          try {
            const res = await fetch(fnUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: campaignId })
            });

            if (!res.ok) {
              const text = await res.text().catch(() => '');
              let parsed = null;
              try { parsed = text ? JSON.parse(text) : null; } catch {}
              lastError = `(${res.status}) ${res.statusText} - ${parsed ? JSON.stringify(parsed) : text}`;
              console.warn('Delete attempt failed for', fnUrl, lastError);
              continue;
            }

            const j = await res.json().catch(() => ({}));
            if (j && j.success) {
              success = true;
              break;
            }

            lastError = `No success confirmation from ${fnUrl}`;
          } catch (e) {
            lastError = e?.message || String(e);
            console.warn('Delete attempt error for', fnUrl, lastError);
          }
        }

        if (!success) {
          throw new Error('All function endpoints failed: ' + String(lastError));
        }
      } catch (serverErr) {
        // Fallback to orchestrator.deleteCampaign
        console.warn('Server delete failed, falling back to orchestrator:', serverErr);
        await orchestrator.deleteCampaign(campaignId);
      }

      // Emit real-time feed event
      realTimeFeedService.emitCampaignDeleted(
        campaignId,
        keyword,
        keyword,
        user?.id
      );

      await loadCampaigns();
      onStatusUpdate?.(`Campaign "${keyword}" deleted successfully`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error deleting campaign:', {
        message: errorMessage,
        campaignId,
        campaignKeyword: keyword,
        error: error
      });
      
      // Emit error event to feed
      realTimeFeedService.emitUserAction(
        'delete_campaign_failed',
        `Failed to delete campaign "${keyword}": ${errorMessage}`,
        user?.id,
        campaignId
      );
      
      onStatusUpdate?.(`Failed to delete campaign: ${errorMessage}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'publishing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'generating': return <FileText className="w-4 h-4" />;
      case 'publishing': return <ExternalLink className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActiveCampaigns = () => campaigns.filter(c => ['active', 'pending', 'generating', 'publishing'].includes(c.status));
  const getCompletedCampaigns = () => campaigns.filter(c => c.status === 'completed');
  const getPausedCampaigns = () => campaigns.filter(c => c.status === 'paused');
  const getFailedCampaigns = () => campaigns.filter(c => c.status === 'failed');

  // Get all published links sorted by date (including URLs discovered from posts)
  const getAllPublishedLinks = () => {
    const combined: Array<PublishedLink & { campaignKeyword: string; campaignName: string }> = [];

    // 1) Links table entries already loaded with campaigns
    campaigns.forEach(campaign => {
      if (campaign.automation_published_links?.length > 0) {
        campaign.automation_published_links.forEach(link => {
          combined.push({
            ...link,
            campaignKeyword: campaign.keywords?.[0] || campaign.name || 'Unknown',
            campaignName: campaign.name
          });
        });
      }
    });

    // 2) Add URLs from posts map
    Object.entries(campaignUrls).forEach(([campaignId, urls]) => {
      const campaign = campaigns.find(c => c.id === campaignId);
      (urls || []).forEach((u) => {
        combined.push({
          id: `${campaignId}:${u}`,
          published_url: u,
          platform: 'domain',
          published_at: new Date().toISOString(),
          campaignKeyword: campaign?.keywords?.[0] || campaign?.name || 'Unknown',
          campaignName: campaign?.name || ''
        } as any);
      });
    });

    // Deduplicate by URL
    const seen = new Set<string>();
    const deduped = combined.filter((l) => {
      const key = l.published_url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  };

  const totalCampaignPages = Math.max(1, Math.ceil(campaigns.length / campaignsPerPage));
  const displayedCampaigns = campaigns.slice((campaignPage - 1) * campaignsPerPage, campaignPage * campaignsPerPage);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading campaigns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Activity
            </CardTitle>
            <CardDescription>
              Monitor and control your active campaigns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{getActiveCampaigns().length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-600">{getPausedCampaigns().length}</div>
            <div className="text-sm text-gray-600">Paused</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{getFailedCampaigns().length}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="live-links" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {(() => {
                const displayedIds = new Set(displayedCampaigns.map(c => c.id));
                const postsTotal = Object.entries(campaignUrls).reduce((a, [id, arr]) => a + (displayedIds.has(id) ? ((arr as string[])?.length || 0) : 0), 0);
                const linkCount = postsTotal; // Links are derived from automation_posts for displayed campaigns
                return `Links (${linkCount}) • Posts (${postsTotal})`;
              })()}
            </TabsTrigger>
          </TabsList>

          {/* Campaign Activity Tab */}
          <TabsContent value="activity" className="space-y-3 mt-4">
            {!user ? (
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Sign in to view your campaigns</p>
                  <p className="text-sm text-gray-500">Create an account or sign in to start monitoring your campaigns</p>
                </div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No campaigns found</p>
                  <p className="text-sm text-gray-500">Create your first campaign to get started</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {displayedCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(campaign.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(campaign.status)}
                                {campaign.status}
                              </div>
                            </Badge>
                            <span className="font-medium">{campaign.name}</span>

                            {/* Campaign Details, Pause, and Delete Actions */}
                            <div className="flex items-center gap-2 ml-auto">
                              {/* Pause Button - Active campaigns only */}
                              {(() => {
                                const isActive = ['active', 'pending', 'generating', 'publishing'].includes(campaign.status);
                                if (isActive) {
                                  return (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handlePauseCampaign(campaign.id)}
                                      disabled={actionLoading === campaign.id}
                                      title="Pause Campaign"
                                      className="px-3 py-1 h-8 min-w-[80px] bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 shadow-sm text-xs font-medium"
                                    >
                                      {actionLoading === campaign.id ? (
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      ) : (
                                        <Pause className="w-3 h-3 mr-1" />
                                      )}
                                      Pause
                                    </Button>
                                  );
                                }
                                return null;
                              })()}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(campaign.id)}
                                title="View Campaign Details"
                                className="px-3 py-1 h-8 min-w-[80px] bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm text-xs font-medium"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                                disabled={actionLoading === campaign.id}
                                title="Delete Campaign"
                                className="px-3 py-1 h-8 min-w-[80px] bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200 shadow-sm text-xs font-medium"
                              >
                                {actionLoading === campaign.id ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1.5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-1">
                                <p><strong>Target URL:</strong> <span className="break-all">{campaign.target_url}</span></p>
                                <p>
                                  <strong>Keywords:</strong>{' '}
                                  {Array.isArray(campaign.keywords) && campaign.keywords.length > 0 ? (
                                    <span>{campaign.keywords.join(', ')}</span>
                                  ) : campaign.keyword ? (
                                    <span>{campaign.keyword}</span>
                                  ) : (
                                    <span className="text-gray-400">N/A</span>
                                  )}
                                </p>
                                <p>
                                  <strong>Anchor texts:</strong>{' '}
                                  {Array.isArray(campaign.anchor_texts) && campaign.anchor_texts.length > 0 ? (
                                    <span>{campaign.anchor_texts.join(', ')}</span>
                                  ) : campaign.anchor_text ? (
                                    <span>{campaign.anchor_text}</span>
                                  ) : (
                                    <span className="text-gray-400">N/A</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {/* Re-run/Resume Button */}
                                {(() => {
                                  const summary = campaignStatusSummaries.get(campaign.id);
                                  const isActive = ['active', 'pending', 'generating', 'publishing'].includes(campaign.status);
                                  const isPaused = campaign.status === 'paused';
                                  const isCompleted = campaign.status === 'completed';

                                  if (isPaused || isCompleted) {
                                    const hasNextPlatform = summary?.nextPlatform;
                                    const buttonText = isCompleted ? 'Re-run' : hasNextPlatform ? 'Resume' : 'Re-run';
                                    const tooltipText = isCompleted
                                      ? 'Campaign completed - click to check for new opportunities or re-run'
                                      : hasNextPlatform
                                        ? `Resume to continue posting to ${summary.nextPlatform}`
                                        : 'No more platforms available - click to check for new opportunities';

                                    return (
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleResumeCampaign(campaign.id)}
                                        disabled={actionLoading === campaign.id}
                                        title={tooltipText}
                                        className={`${isCompleted ? "bg-blue-600 hover:bg-blue-700 border-blue-500" : "bg-green-600 hover:bg-green-700 border-green-500"} text-white px-4 py-1 h-8 min-w-[100px] transition-all duration-200 shadow-sm text-xs font-medium`}
                                      >
                                        {actionLoading === campaign.id ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : (
                                          <>
                                            <Play className="w-3 h-3 mr-1" />
                                            {buttonText}
                                          </>
                                        )}
                                      </Button>
                                    );
                                  }
                                  return null;
                                })()}

                              </div>
                            </div>

                            {/* Platform Progress */}
                            {(() => {
                              const summary = campaignStatusSummaries.get(campaign.id);
                              if (summary && summary.totalPlatforms > 0) {
                                return (
                                  <div className="mt-1.5 p-2 bg-gray-50 rounded-md">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Platform Progress</p>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-gray-600">
                                        {summary.platformsCompleted || 0}/{summary.totalPlatforms} platforms completed
                                      </span>
                                      {summary.nextPlatform && (
                                        <span className="text-blue-600">
                                          • Next: {summary.nextPlatform}
                                        </span>
                                      )}
                                      {summary.isFullyCompleted && (
                                        <span className="text-green-600 font-medium">
                                          All platforms completed
                                        </span>
                                      )}
                                    </div>
                                    {summary.completedPlatforms && summary.completedPlatforms.length > 0 && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        Completed: {summary.completedPlatforms.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            {(campaign.automation_published_links && campaign.automation_published_links.length > 0) || (campaignUrls[campaign.id]?.length) ? (
                              <div className="mt-1.5">
                                <p className="font-medium">Published Links:</p>
                                <div className="space-y-1 mt-1">
                                  {/* Prefer published links if available */}
{(() => {
                                    const allLinks = (campaign.automation_published_links && campaign.automation_published_links.length > 0)
                                      ? campaign.automation_published_links
                                          .sort((a, b) => new Date(b.published_at || b.created_at || '').getTime() - new Date(a.published_at || a.created_at || '').getTime())
                                          .map((l) => l.published_url)
                                      : (campaignUrls[campaign.id] || []);
                                    const currentPage = linkPageMap[campaign.id] || 1;
                                    const totalPages = Math.max(1, Math.ceil((allLinks || []).length / linksPerPage));
                                    const start = (currentPage - 1) * linksPerPage;
                                    const visibleLinks = (allLinks || []).slice(start, start + linksPerPage);
                                    return (
                                      <>
                                        {visibleLinks.map((u, idx) => (
                                          <a
                                              key={idx}
                                              href={u}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:underline text-xs flex items-start gap-1 break-all whitespace-normal max-w-full"
                                            >
                                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                              <span className="break-all">{u}</span>
                                            </a>
                                        ))}
                                        {(allLinks.length > linksPerPage) && (
                                          <div className="flex items-center gap-2 mt-1">
                                            <button
                                              onClick={() => setLinkPageMap(prev => ({ ...prev, [campaign.id]: Math.max(1, (prev[campaign.id] || 1) - 1) }))}
                                              disabled={currentPage <= 1}
                                              className="text-xs text-gray-600 px-2 py-1 border rounded disabled:opacity-50"
                                            >
                                              <ChevronLeft className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs text-gray-500">{currentPage}/{totalPages}</span>
                                            <button
                                              onClick={() => setLinkPageMap(prev => ({ ...prev, [campaign.id]: Math.min(totalPages, (prev[campaign.id] || 1) + 1) }))}
                                              disabled={currentPage >= totalPages}
                                              className="text-xs text-gray-600 px-2 py-1 border rounded disabled:opacity-50"
                                            >
                                              <ChevronRight className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                        {(allLinks.length > linksPerPage) && (
                                          <p className="text-xs text-gray-500 mt-1">+{allLinks.length - linksPerPage} more links</p>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            ) : null}
                          </div>

                          {/* Posting Progress based on automation_posts vs user domains */}
                          <div className="mt-3">
                            {(() => {
                              const completed = postCounts[campaign.id] || 0;
                              const total = Math.max(domainCount, 0);
                              const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
                              return (
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Posting Progress</span>
                                    <span className="font-medium">{completed}/{total}</span>
                                  </div>
                                  <Progress value={percent} />
                                  <div className="text-xs text-gray-500 mt-1.5">Campaign ID: {campaign.id}</div>
                                  <div className="text-xs text-gray-500">Created: {campaign.created_at ? new Date(campaign.created_at).toLocaleString() : '-'}</div>
                                </div>
                              );
                            })()}
                          </div>

                          {campaign.error_message && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              <strong>Error:</strong> {campaign.error_message}
                            </div>
                          )}
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex flex-col items-start gap-2">
                          {/* Future secondary actions can be added here */}
                        </div>
                      </div>
                    </div>
                ))}

                {campaigns.length > campaignsPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => setCampaignPage(p => Math.max(1, p - 1))} disabled={campaignPage <= 1}>Prev</Button>
                    <span className="text-sm text-gray-600">Page {campaignPage}/{totalCampaignPages}</span>
                    <Button size="sm" variant="outline" onClick={() => setCampaignPage(p => Math.min(totalCampaignPages, p + 1))} disabled={campaignPage >= totalCampaignPages}>Next</Button>
                  </div>
                )}

              </div>
            )}
          </TabsContent>

          {/* Live Links Tab */}
          <TabsContent value="live-links" className="mt-6">
            <PublishedLinksDisplay campaignIds={displayedCampaigns.map(c => c.id)} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {/* Campaign Details Modal */}
    {selectedCampaignId && (
      <CampaignDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        campaignId={selectedCampaignId}
      />
    )}
    </>
  );
};

export default CampaignManagerTabbed;
export { CampaignManagerTabbed };
