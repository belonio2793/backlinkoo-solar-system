import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; el.text = text; document.head.appendChild(el); }
  else { el.text = text; }
}

export default function GeneratedPage() {
  const { slug = '' } = useParams();
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`generated-page:${slug}`);
      if (raw) setPage(JSON.parse(raw));
    } catch {}
  }, [slug]);

  useEffect(() => {
    if (!page) return;
    const title = page?.meta?.title || `${page.keyword} — Generated Deep Dive`;
    document.title = title;
    upsertMeta('description', page?.meta?.description || `Comprehensive deep dive into ${page.keyword}.`);
    injectJSONLD('generated-webpage', {
      '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: `${window.location.origin}/generated/${slug}`, description: page?.meta?.description || ''
    });
  }, [page, slug]);

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">Not Found</h1>
          <p className="text-slate-600 mt-2">We couldn't find this generated page in your browser storage.</p>
          <div className="mt-4"><Link className="text-emerald-700 hover:underline" to="/generate">Go to Generator</Link></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <article className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: page.html }} />
      </main>
      <Footer />
    </div>
  );
}
