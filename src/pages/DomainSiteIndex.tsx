import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ApiResponse {
  success: boolean;
  domain?: { id: string; domain_name?: string; domain?: string; theme?: string } | null;
  content?: { id?: string; title?: string; slug?: string; content?: string } | null;
  error?: string;
}

const MinimalLayout: React.FC<{ title?: string; html?: string }> = ({ title, html }) => (
  <div className="min-h-screen bg-white">
    <header className="border-b py-6 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{title || 'Welcome'}</h1>
      </div>
    </header>
    <main className="max-w-4xl mx-auto p-6 prose max-w-none">
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <p>No content.</p>}
    </main>
  </div>
);

const ModernLayout: React.FC<{ title?: string; html?: string }> = ({ title, html }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <div className="max-w-5xl mx-auto px-6 pt-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{title || 'Welcome'}</h1>
      <div className="mt-6 prose lg:prose-lg">
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <p>No content.</p>}
      </div>
    </div>
  </div>
);

const DefaultLayout = MinimalLayout;

const DomainSiteIndex: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('default');
  const [title, setTitle] = useState<string>('');
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      if (!domain) {
        setError('Missing domain');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://dfhanacsmsvvkpunurnp.supabase.co/functions/v1/domain-blog-server/sites/${encodeURIComponent(domain)}/index?domain=${encodeURIComponent(domain)}` , {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json: ApiResponse = await res.json();
        if (!json?.success) throw new Error(json?.error || 'API error');
        const d = json.domain || ({} as any);
        const c = json.content || ({} as any);
        setTheme((d.theme || 'default').toLowerCase());
        setTitle(c.title || d.domain_name || d.domain || domain);
        setHtml(c.content || '');
      } catch (e: any) {
        setError(e?.message || 'Failed to load site');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Site</h1>
      <p className="text-red-600 mt-2">{error}</p>
      <p className="mt-4"><Link to="/domains" className="text-blue-600">Back to Domains</Link></p>
    </div>
  );

  const layouts: Record<string, React.FC<{ title?: string; html?: string }>> = {
    minimal: MinimalLayout,
    modern: ModernLayout,
    default: DefaultLayout,
  };
  const Layout = layouts[theme] || DefaultLayout;

  return <Layout title={title} html={html} />;
};

export default DomainSiteIndex;
