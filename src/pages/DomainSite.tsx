import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const DomainSite: React.FC = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const [domain, setDomain] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!domainId) {
        setError('Missing domain id');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: d, error: dErr } = await supabase.from('domains').select('*').eq('id', domainId).maybeSingle();
        if (dErr) throw dErr;
        if (!d) {
          setError('Domain not found');
          setLoading(false);
          return;
        }
        setDomain(d);

        // Load posts for this domain (automation_posts or blog_posts)
        const { data: postsData, error: postsErr } = await supabase
          .from('automation_posts')
          .select('id, slug, url, published_at, status, title')
          .eq('domain_id', domainId)
          .order('published_at', { ascending: false })
          .limit(200);

        if (postsErr) {
          // fallback to blog_posts
          const { data: fallback, error: fbErr } = await supabase
            .from('blog_posts')
            .select('id, slug, url, published_at, status, title')
            .eq('domain_id', domainId)
            .order('published_at', { ascending: false })
            .limit(200);
          if (fbErr) throw fbErr;
          setPosts(fallback || []);
        } else {
          setPosts(postsData || []);
        }

      } catch (e: any) {
        console.error('DomainSite load error:', e);
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [domainId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Domain site</h1>
      <p className="text-red-600 mt-2">{error}</p>
      <p className="mt-4"><Link to="/domains" className="text-blue-600">Back to Domains</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-6 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">{domain.domain}</h1>
          <p className="text-sm text-gray-600 mt-1">Managed domain ID: {domain.id}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Blog</h2>
          <p className="text-sm text-gray-600 mb-4">This is the blog template for this domain. Posts below are specific to this domain and use unique slugs.</p>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm table-auto min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Slug</th>
                    <th className="px-4 py-2">Published</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-gray-500">No posts yet</td>
                    </tr>
                  )}
                  {posts.map(p => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-3 align-top">
                        <Link to={`/site/${domain.id}/${p.slug}`} className="text-blue-600 hover:underline">{p.title || p.slug}</Link>
                      </td>
                      <td className="px-4 py-3 align-top">{p.slug}</td>
                      <td className="px-4 py-3 align-top">{p.published_at ? new Date(p.published_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 align-top">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium mb-2">Site Preview</h3>
          <p className="text-sm text-gray-600 mb-2">Open a generated post below to preview it in context.</p>
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Live site preview is available when a post has a public URL.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DomainSite;
