import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const formatDate = (d: string | null) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

interface AutomationPostsListProps { campaignId?: string | null }
const AutomationPostsList: React.FC<AutomationPostsListProps> = ({ campaignId }) => {
  const { user, isAuthenticated } = useAuthState();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const postsPerPage = 5;

  const loadPosts = async () => {
    if (!user?.id) {
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      let query = supabase
        .from('automation_posts')
        .select('id, url, published_at, domain_id, automation_id')
        .eq('user_id', user.id)
        .order('published_at', { ascending: false });
      if (campaignId) {
        query = query.eq('automation_id', campaignId);
      }
      const { data, error } = await query;
      if (error) throw error;

      const rows = data || [];
      const domainIds = Array.from(new Set(rows.map((r: any) => r.domain_id).filter(Boolean)));
      let domainsMap: Record<string, string> = {};
      if (domainIds.length > 0) {
        const { data: domains } = await supabase.from('domains').select('id, domain').in('id', domainIds);
        domainsMap = (domains || []).reduce((acc: any, d: any) => ({ ...acc, [d.id]: d.domain }), {});
      }

      const enriched = rows.map((r: any) => ({ ...r, domain: domainsMap[r.domain_id] || 'unknown' }));
      setPosts(enriched);
    } catch (e) {
      console.error('Failed to load posts', e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    const onUpdated = () => loadPosts();
    try { window.addEventListener('automation:posts:updated', onUpdated); } catch {}
    try { window.addEventListener('automation:campaign:created', onUpdated); } catch {}
    return () => {
      try { window.removeEventListener('automation:posts:updated', onUpdated); } catch {}
      try { window.removeEventListener('automation:campaign:created', onUpdated); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, campaignId]);

  // Reset to first page whenever posts change or campaign filter changes
  useEffect(() => {
    setPage(1);
  }, [posts.length, campaignId]);

  if (!user?.id) {
    return (
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 border-gray-200 text-center">
        <div className="text-sm text-gray-600">Sign in to view your posts</div>
      </div>
    );
  }

  return (
    <Card className="flex-1 w-full flex flex-col min-h-[420px] md:min-h-[520px] lg:min-h-[640px]">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">Generated Posts</CardTitle>
        <CardDescription className="text-sm text-gray-500">Recent posts published by your automation campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-4 flex-1 overflow-auto">
        <div className="w-full h-full overflow-auto">
          <table className="w-full h-full text-left text-sm table-auto min-w-full">
            <thead className="bg-gray-50 sticky top-0 text-sm">
              <tr>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Published At</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              )}

              {!loading && posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-sm text-gray-500">No posts found</td>
                </tr>
              )}

              {(() => {
                const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
                const start = (page - 1) * postsPerPage;
                const visible = posts.slice(start, start + postsPerPage);
                return (
                  <>
                    {visible.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="px-4 py-2 align-top">{p.domain}</td>
                        <td className="px-4 py-2 align-top">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{p.url}</a>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-2 align-top whitespace-nowrap">{formatDate(p.published_at)}</td>
                      </tr>
                    ))}

                    {/* Pagination controls */}
                    {posts.length > postsPerPage && (
                      <tr>
                        <td colSpan={3} className="px-4 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => setPage(p => Math.max(1, p - 1))}
                              disabled={page <= 1}
                              className="px-3 py-1 border rounded text-sm text-gray-600 disabled:opacity-50"
                            >Prev</button>

                            <span className="text-sm text-gray-600">Page {page}/{totalPages}</span>

                            <button
                              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                              disabled={page >= totalPages}
                              className="px-3 py-1 border rounded text-sm text-gray-600 disabled:opacity-50"
                            >Next</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationPostsList;
