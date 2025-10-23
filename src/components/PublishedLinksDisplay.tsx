import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ExternalLink,
  Copy,
  Link as LinkIcon,
  CheckCircle,
  Globe,
  RefreshCw
} from 'lucide-react';
import { getOrchestrator } from '@/services/automationOrchestrator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PublishedLink {
  id: string;
  published_url: string;
  platform: string;
  published_at: string;
  campaign_id: string;
  target_url?: string;
  keyword?: string;
  anchor_text?: string;
}

interface PublishedLinksDisplayProps {
  campaignIds?: string[];
}

const PublishedLinksDisplay: React.FC<PublishedLinksDisplayProps> = ({ campaignIds }) => {
  const [links, setLinks] = useState<PublishedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsCount, setPostsCount] = useState(0);
  const [campaignNameMap, setCampaignNameMap] = useState<Record<string, string>>({});
  const [attemptedResume, setAttemptedResume] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Pagination for published links (1 per page)
  const [linkPage, setLinkPage] = useState<number>(1);
  const linksPerPage = 1;

  useEffect(() => {
    if (user) {
      loadPublishedLinks();

      const interval = setInterval(() => {
        loadPublishedLinks();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user, campaignIds?.join(',')]);

  // Reset pagination when links change
  useEffect(() => {
    setLinkPage(1);
  }, [links.length]);

  const loadPublishedLinks = async () => {
    try {
      setLoading(true);
      const orchestrator = getOrchestrator();
      const allUserCampaigns = await orchestrator.getUserCampaigns();

      const effectiveIds = (campaignIds && campaignIds.length)
        ? campaignIds
        : allUserCampaigns.map(c => c.id);

      const nameMap: Record<string, string> = {};
      allUserCampaigns.forEach(c => { if (!campaignIds || campaignIds.includes(c.id)) nameMap[c.id] = c.name || 'Campaign'; });
      setCampaignNameMap(nameMap);

      // Fetch URLs directly from automation_posts for the selected campaigns
      if (effectiveIds.length) {
        const { data: postRows } = await supabase
          .from('automation_posts')
          .select('id, automation_id, url, published_at')
          .in('automation_id', effectiveIds)
          .neq('url', null)
          .order('published_at', { ascending: false });

        const postUrls: PublishedLink[] = (postRows || [])
          .filter((p: any) => !!p.url)
          .map((p: any) => ({
            id: String(p.id),
            published_url: String(p.url),
            platform: 'domain',
            published_at: p.published_at || new Date().toISOString(),
            campaign_id: String(p.automation_id)
          }));

        // Deduplicate by URL
        const seen = new Set<string>();
        const deduped: PublishedLink[] = [];
        postUrls.forEach((l) => {
          const key = l.published_url.trim().toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(l);
          }
        });

        setPostsCount(postUrls.length);
        deduped.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        setLinks(deduped);

        // Optional: auto attempt resume once if no links
        if (deduped.length === 0 && allUserCampaigns.length && !attemptedResume) {
          setAttemptedResume(true);
          try {
            for (const c of allUserCampaigns) {
              if (!campaignIds || effectiveIds.includes(c.id)) {
                await orchestrator.smartResumeCampaign(c.id);
              }
            }
            setTimeout(() => loadPublishedLinks(), 1500);
          } catch {}
        }
      } else {
        setLinks([]);
        setPostsCount(0);
      }
    } catch (error: any) {
      console.error('❌ Error loading published links:', error);
      toast({
        title: 'Error Loading Links',
        description: `Failed to load published links: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyAllUrls = () => {
    const allUrls = links.map(link => link.published_url).join('\n');
    copyToClipboard(allUrls);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Card className="w-full h-full flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Published Backlinks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center min-h-0 px-8 py-6">
          <div className="text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium text-gray-900 mb-2">Sign In to View Published Links</h3>
            <p className="text-sm text-gray-500">
              Create an account or sign in to view your published backlinks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="space-y-3">
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Published Backlinks
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Published Links: {links.length} • Posts: {postsCount}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadPublishedLinks()}
                className="text-xs"
                disabled={loading}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={copyAllUrls}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy All
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading published links...</p>
            </div>
          </div>
        ) : links.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-900 mb-2">No Published Links Yet</h3>
              <p className="text-sm text-gray-500">
                Links will appear here after your campaigns publish content
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              const totalPages = Math.max(1, Math.ceil(links.length / linksPerPage));
              const start = (linkPage - 1) * linksPerPage;
              const visible = links.slice(start, start + linksPerPage);
              return (
                <>
                  {visible.map((link) => (
                    <div
                      key={link.id}
                      className="border rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={link.platform === 'telegraph' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {link.platform === 'telegraph' ? 'Telegraph.ph' : (campaignNameMap[link.campaign_id] || 'Campaign')}
                            </Badge>
                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Published" />
                          </div>

                          {link.keyword && (
                            <p className="font-medium text-gray-900 mb-1 text-sm">
                              {link.keyword}
                            </p>
                          )}

                          <p className="text-xs text-gray-500">
                            Published {formatDate(link.published_at)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(link.published_url)}
                            title="Copy URL"
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(link.published_url, '_blank')}
                            title="Open Link"
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* URL Display */}
                      <div className="bg-white rounded border p-3">
                        <div className="flex items-center justify-between">
                          <a
                            href={link.published_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-mono flex-1 break-all whitespace-normal transition-colors"
                            title={link.published_url}
                          >
                            {link.published_url}
                          </a>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(link.published_url, '_blank')}
                            className="ml-3 h-7 text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(link.anchor_text || link.target_url) && (
                        <div className="mt-3 text-xs text-gray-600 space-y-1">
                          {link.anchor_text && (
                            <div>
                              <span className="font-medium">Anchor:</span> {link.anchor_text}
                            </div>
                          )}
                          {link.target_url && (
                            <div>
                              <span className="font-medium">Target:</span> {link.target_url}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination controls */}
                  {links.length > linksPerPage && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLinkPage(p => Math.max(1, p - 1))}
                        disabled={linkPage <= 1}
                      >Prev</Button>

                      <span className="text-sm text-gray-600">{linkPage}/{totalPages}</span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLinkPage(p => Math.min(totalPages, p + 1))}
                        disabled={linkPage >= totalPages}
                      >Next</Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishedLinksDisplay;
