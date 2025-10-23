import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { extractErrorMessage, logSupabaseError } from '@/utils/errorExtractor';

const SiteBlogIndex: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const [domainId, setDomainId] = useState<string | null>(null);
  const [domainRecord, setDomainRecord] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!domain) {
          setError('Missing domain');
          return;
        }

        // Resolve domain to id
        const clean = domain.toLowerCase();
        const { data: d, error: dErr } = await supabase
          .from('domains')
          .select('*')
          .eq('domain', clean)
          .maybeSingle();
        if (dErr) throw dErr;
        if (!d) {
          setError('Domain not found');
          return;
        }
        setDomainRecord(d);
        setDomainId(d.id);

        // Load posts for this domain from automation_posts (primary)
        const { data: autoPosts, error: autoErr } = await supabase
          .from('automation_posts')
          .select('id, title, slug, excerpt, meta_description, published_at, content, url, status')
          .eq('domain_id', d.id)
          .order('published_at', { ascending: false })
          .limit(50);
        if (!autoErr && autoPosts) {
          setPosts(autoPosts);
        } else {
          // Fallback: blog_posts then domain_blog_posts
          const { data: legacy, error: legacyErr } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, meta_description, published_at, content, url, status')
            .eq('domain_id', d.id)
            .order('published_at', { ascending: false })
            .limit(50);
          if (!legacyErr && legacy) {
            setPosts(legacy);
          } else {
            const { data: domainBlog, error: dbErr } = await supabase
              .from('domain_blog_posts')
              .select('id, title, slug, excerpt, meta_description, published_at, content, published_url, status')
              .eq('domain_id', d.id)
              .order('published_at', { ascending: false })
              .limit(50);
            if (dbErr) throw dbErr;
            setPosts(domainBlog || []);
          }
        }
      } catch (e: any) {
        logSupabaseError('SiteBlogIndex load error', e);
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [domain]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="text-red-600 mt-2">{error}</p>
      <p className="mt-4"><Link to="/domains" className="text-blue-600">Back to Domains</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-6 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">{domainRecord?.domain}</h1>
          <p className="text-sm text-gray-600 mt-1">Blog posts for this domain</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {posts.length === 0 ? (
          <div className="text-sm text-gray-600">No posts yet.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold">
                  <Link to={`/sites/${domainRecord?.domain}/blog/${p.slug}`} className="text-blue-600 hover:underline">{(p as any).title || p.slug}</Link>
                </h3>
                <div className="text-xs text-gray-500 mt-1">
                  {p.published_at ? new Date(p.published_at).toLocaleString() : 'Draft'}
                </div>
                <div className="mt-2 text-sm text-gray-700 line-clamp-3">{(p as any).excerpt || (p as any).meta_description || ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Link to legacy id-based view */}
        {domainId && (
          <div className="mt-8 text-xs">
            <Link to={`/site/${domainId}`} className="text-gray-500 underline">Open legacy view</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SiteBlogIndex;
