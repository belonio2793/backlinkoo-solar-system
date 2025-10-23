import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BlogAutoAdjustmentService } from '@/services/blogAutoAdjustmentService';
import { normalizeContent as normalizeAutoPost } from '@/lib/autoPostFormatter';

const DomainPost: React.FC = () => {
  const { domainId, slug } = useParams<{ domainId: string; slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [domain, setDomain] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!domainId || !slug) {
        setError('Missing parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: d } = await supabase.from('domains').select('*').eq('id', domainId).maybeSingle();
        setDomain(d || null);

        const { data: p, error: pErr } = await supabase.from('automation_posts').select('*, content, css_url, title').eq('domain_id', domainId).eq('slug', slug).maybeSingle();
        if (pErr) throw pErr;
        if (!p) {
          // fallback to blog_posts
          const { data: fb } = await supabase.from('blog_posts').select('*, content').eq('domain_id', domainId).eq('slug', slug).maybeSingle();
          const adjusted = fb ? BlogAutoAdjustmentService.adjustContentForDisplay((fb as any).content || '', { title: (fb as any).title, target_url: (fb as any).target_url }) : '';
          setPost(fb ? { ...(fb as any), content: adjusted } : null);
        } else {
          const normalized = normalizeAutoPost((p as any).title || '', (p as any).content || '');
          const adjusted = BlogAutoAdjustmentService.adjustContentForDisplay(normalized || (p as any).content || '', { title: (p as any).title, target_url: (p as any).target_url });
          setPost({ ...(p as any), content: adjusted });

          // If CSS url present, attach stylesheet to head
          try {
            const cssUrl = (p as any).css_url || (p as any).cssUrl || null;
            if (cssUrl) {
              const linkId = `post-css-${String(p.id)}`;
              // Remove existing if present
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
            console.warn('Failed to attach post CSS:', e && (e.message || e));
          }
        }

      } catch (e: any) {
        console.error('DomainPost load error:', e);
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
  }, [domainId, slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Post</h1>
      <p className="text-red-600 mt-2">{error}</p>
      <p className="mt-4"><Link to={`/site/${domainId}`} className="text-blue-600">Back to {domain?.domain || 'domain'}</Link></p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Post not found</h1>
      <p className="mt-4"><Link to={`/site/${domainId}`} className="text-blue-600">Back</Link></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{post.title || post.slug}</h1>
          <p className="text-sm text-gray-600">{domain?.domain} • {post.published_at ? new Date(post.published_at).toLocaleString() : 'Draft'}</p>
        </header>

        <article className="modern-blog-content article-content prose prose-lg max-w-none">
          {/* If content exists, render as HTML. Otherwise link out to post.url */}
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : post.url ? (
            <div>
              <p>This post links to an external URL:</p>
              <a href={post.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{post.url}</a>
              <div className="mt-6 border rounded overflow-hidden">
                <iframe src={post.url} title={post.slug} className="w-full h-[600px]" />
              </div>
            </div>
          ) : (
            <p>No content available for this post.</p>
          )}

        </article>

        <div className="mt-8">
          <Link to={`/site/${domainId}`} className="text-blue-600">Back to blog</Link>
        </div>
      </main>
    </div>
  );
};

export default DomainPost;
