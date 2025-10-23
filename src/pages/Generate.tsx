import React, { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

function slugify(s: string) {
  return String(s || '')
    .toLowerCase()
    .replace(/https?:\/\/|www\./g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'post';
}

export default function Generate() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [wordCount, setWordCount] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const computedSlug = useMemo(() => slug || slugify(keyword || url), [slug, keyword, url]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url || !keyword) {
      setError('Please provide both URL and keyword.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/homePostGenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, keyword, slug: computedSlug, wordCount })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');

      const page = {
        slug: data.slug,
        url,
        keyword,
        html: data.html,
        meta: data.meta || {},
        word_count: data.word_count || 0,
        createdAt: new Date().toISOString()
      };

      try {
        const key = `generated-page:${page.slug}`;
        localStorage.setItem(key, JSON.stringify(page));
        const listKey = 'generated-pages:index';
        const existing = JSON.parse(localStorage.getItem(listKey) || '[]');
        const filtered = existing.filter((p: any) => p.slug !== page.slug);
        filtered.unshift({ slug: page.slug, keyword: page.keyword, url: page.url, createdAt: page.createdAt });
        localStorage.setItem(listKey, JSON.stringify(filtered.slice(0, 50)));
      } catch {}

      navigate(`/generated/${page.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Generate SEO Page</h1>
        <p className="text-slate-600 mt-2">Enter a source URL and target keyword. We will create a 10,000-word, media-rich page and save it to a shareable permalink.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="url">Source URL</Label>
            <Input id="url" type="url" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="keyword">Target Keyword</Label>
            <Input id="keyword" placeholder="Your primary keyword" value={keyword} onChange={e => setKeyword(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="slug">Permalink Slug (optional)</Label>
            <Input id="slug" placeholder="auto-generated-from-keyword" value={slug} onChange={e => setSlug(e.target.value)} />
            <p className="text-xs text-slate-500 mt-1">Final permalink will be /generated/{computedSlug}</p>
          </div>
          <div>
            <Label htmlFor="wordCount">Word Count Target</Label>
            <Input id="wordCount" type="number" min={2000} max={20000} step={500} value={wordCount} onChange={e => setWordCount(parseInt(e.target.value || '10000', 10))} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate Page'}</Button>
            <Button type="button" variant="outline" onClick={() => { setUrl(''); setKeyword(''); setSlug(''); setError(null); }}>Reset</Button>
          </div>
        </form>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Recently Generated</h2>
          <GeneratedList />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function GeneratedList() {
  const [items] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('generated-pages:index') || '[]'); } catch { return []; }
  });
  if (!items.length) return <p className="text-slate-500">No pages yet.</p>;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.slug} className="flex items-center justify-between border rounded-md p-3 bg-white">
          <div>
            <div className="font-medium">/{it.slug}</div>
            <div className="text-xs text-slate-500">{it.keyword} · {it.url}</div>
          </div>
          <a className="text-emerald-700 hover:underline" href={`/generated/${it.slug}`}>Open</a>
        </li>
      ))}
    </ul>
  );
}
