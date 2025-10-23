import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BlogAutoAdjustmentService } from '@/services/blogAutoAdjustmentService';
import { normalizeContent as normalizeAutoPost } from '@/lib/autoPostFormatter';

const SiteBlogPost: React.FC = () => {
  const { domain, slug } = useParams<{ domain: string; slug: string }>();
  const [domainRecord, setDomainRecord] = useState<any | null>(null);
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!domain || !slug) {
          setError('Missing parameters');
          return;
        }

        // Prefer automation-api
        try {
          const res = await fetch(`https://dfhanacsmsvvkpunurnp.supabase.co/functions/v1/domain-blog-server/sites/${encodeURIComponent(domain)}/blog/${encodeURIComponent(slug)}?domain=${encodeURIComponent(domain)}`);
          const json = await res.json();
          if (json?.success) {
            setDomainRecord({ domain: json.domain?.domain_name || json.domain?.domain || domain });
            const normalized = normalizeAutoPost(json.content?.title || '', json.content?.content || '');
            const adjusted = BlogAutoAdjustmentService.adjustContentForDisplay(normalized || (json.content?.content || ''), { title: json.content?.title });
            setPost({
              title: json.content?.title,
              slug: json.content?.slug,
              content: adjusted,
              published_at: json.content?.published_at,
              url: json.content?.url,
            });
            setLoading(false);
            return;
          }
        } catch (_) {
          // fall through to DB fallback
        }

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

        // Try automation_posts first (primary)
        const { data: autoPost, error: autoErr } = await supabase
          .from('automation_posts')
          .select('*')
          .eq('domain_id', d.id)
          .eq('slug', slug)
          .maybeSingle();
        if (!autoErr && autoPost) {
          const normalized = normalizeAutoPost((autoPost as any).title || '', (autoPost as any).content || '');
          const adjusted = BlogAutoAdjustmentService.adjustContentForDisplay(normalized || (autoPost as any).content || '', { title: (autoPost as any).title, target_url: (autoPost as any).target_url });
          setPost({ ...(autoPost as any), content: adjusted });

          // If CSS url present, attach stylesheet to head
          try {
            const cssUrl = (autoPost as any).css_url || (autoPost as any).cssUrl || null;
            if (cssUrl) {
              const linkId = `post-css-${String((autoPost as any).id)}`;
              const existing = document.getElementById(linkId);
              if (existing) existing.remove();
              const link = document.createElement('link');
              link.id = linkId;
              link.rel = 'stylesheet';
              link.href = cssUrl;
              link.crossOrigin = 'anonymous';
              document.head.appendChild(link);
            }
          } catch (e) {
            console.warn('Failed to attach post CSS:', e && ((e as any).message || e));
          }
        } else {
          // Fallback to blog_posts then domain_blog_posts
          const { data: legacy, error: legacyErr } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('domain_id', d.id)
            .eq('slug', slug)
            .maybeSingle();
          if (!legacyErr && legacy) {
            const adjusted = BlogAutoAdjustmentService.adjustContentForDisplay((legacy as any).content || '', { title: (legacy as any).title, target_url: (legacy as any).target_url });
            setPost({ ...(legacy as any), content: adjusted });
          } else {
            const { data: domainBlog, error: dbErr } = await supabase
              .from('domain_blog_posts')
              .select('*')
              .eq('domain_id', d.id)
              .eq('slug', slug)
              .maybeSingle();
            if (dbErr) throw dbErr;
            if (domainBlog) {
              const adjusted = BlogAutoAdjustmentService.adjustContentForDisplay((domainBlog as any).content || '', { title: (domainBlog as any).title, target_url: (domainBlog as any).target_url });
              setPost({ ...(domainBlog as any), content: adjusted });
            } else {
              setPost(null);
            }
          }
        }
      } catch (e: any) {
        console.error('SiteBlogPost load error:', e);
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };

    load();

    // cleanup: remove any post css link when unmounting or params change
    return () => {
      try {
        const links = Array.from(document.querySelectorAll('[id^="post-css-"]'));
        links.forEach(l => l.remove());
      } catch {}
    };
  }, [domain, slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Post</h1>
      <p className="text-red-600 mt-2">{error}</p>
      <p className="mt-4"><Link to={`/sites/${domain}/blog`} className="text-blue-600">Back to Blog</Link></p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Post not found</h1>
      <p className="mt-4"><Link to={`/sites/${domain}/blog`} className="text-blue-600">Back</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{(post as any).title || (post as any).slug}</h1>
          <p className="text-sm text-gray-600">{domainRecord?.domain} • {(post as any).published_at ? new Date((post as any).published_at).toLocaleString() : 'Draft'}</p>
        </header>

        <article className="modern-blog-content article-content prose prose-lg max-w-none">
          {(post as any).content ? (
            <div dangerouslySetInnerHTML={{ __html: (post as any).content }} />
          ) : (post as any).published_url || (post as any).url ? (
            <div>
              <p>This post links to an external URL:</p>
              <a href={(post as any).published_url || (post as any).url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{(post as any).published_url || (post as any).url}</a>
              <div className="mt-6 border rounded overflow-hidden">
                <iframe src={(post as any).published_url || (post as any).url} title={(post as any).slug} className="w-full h-[600px]" />
              </div>
            </div>
          ) : (
            <p>No content available for this post.</p>
          )}
        </article>

        <div className="mt-8">
          <Link to={`/sites/${domain}/blog`} className="text-blue-600">Back to blog</Link>
        </div>
      </main>
    </div>
  );
};

export default SiteBlogPost;
