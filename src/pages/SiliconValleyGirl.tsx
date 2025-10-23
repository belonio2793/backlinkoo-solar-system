import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import { ChevronRight, Image } from 'lucide-react';
import MarinaDeep from '@/content/marinaDeep';
import MarinaDeepExtra from '@/content/marinaDeepExtra';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ArticleProgress from '@/components/ArticleProgress';

export default function SiliconValleyGirlPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: 'Silicon Valley Girl — Career & Creator Playbook',
    description: 'A practical, in-depth guide to becoming a Silicon Valley Girl: creator strategies, link-building, and career growth.',
    author: { "@type": 'Person', name: 'Backlinkoo Guide' },
    publisher: { "@type": 'Organization', name: 'Backlinkoo' },
    mainEntityOfPage: { "@type": 'WebPage', '@id': '/siliconvalleygirl' }
  } as const;

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="mb-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white shadow-lg">
            <Image className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Marina Mogilko — Deep Profile & Creator Playbook</h1>
            <p className="text-sm text-slate-500 mt-1">An in-depth, practical playbook inspired by public creator strategies — actionable formats, distribution, and monetization tactics for product-minded creators.</p>
          </div>
          <div className="ml-auto">
            <Badge>Featured</Badge>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:gap-4">
          <Button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} className="mr-3">Read the guide</Button>
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
            Back home <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <article className="md:col-span-3 prose max-w-none">
          <section className="prose-lg">
            <div dangerouslySetInnerHTML={{ __html: MarinaDeep + '\n' + MarinaDeepExtra }} />
            <ArticleProgress />
          </section>

          <section className="mt-12">
            <h2>Frequently asked</h2>
            <details className="mb-3 p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Who is a "Silicon Valley Girl"?</summary>
              <p className="mt-2 text-slate-700">A Silicon Valley Girl is someone who blends technical fluency with startup culture, design aesthetics, and an entrepreneurial mindset — while navigating the social codes of the tech ecosystem.</p>
            </details>

            <details className="mb-3 p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">How to build a career as a creator in Silicon Valley?</summary>
              <p className="mt-2 text-slate-700">Focus on building a recognizable voice, creating reproducible content, and leveraging platform-native formats while forming strategic partnerships.</p>
            </details>

            <details className="mb-3 p-4 border rounded-lg">
              <summary className="font-medium cursor-pointer">Can this guide help with SEO and backlinks?</summary>
              <p className="mt-2 text-slate-700">Yes — the guide includes link building strategies, outreach templates, and best practices for authority and topical relevance.</p>
            </details>
          </section>
        </article>

        <aside className="md:col-span-1">
          <nav className="sticky top-24 p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold">On this page</h3>
            <ol className="mt-3 space-y-2 text-sm">
              <li><a href="#overview" className="text-slate-700 hover:underline">Overview</a></li>
              <li><a href="#culture" className="text-slate-700 hover:underline">Culture & Identity</a></li>
              <li><a href="#career" className="text-slate-700 hover:underline">Career & Growth</a></li>
              <li><a href="#creator-economy" className="text-slate-700 hover:underline">Creator Economy</a></li>
              <li><a href="#backlinks" className="text-slate-700 hover:underline">SEO & Backlinks</a></li>
              <li><a href="#faq" className="text-slate-700 hover:underline">FAQ</a></li>
            </ol>

            <div className="mt-4">
              <Button onClick={() => window.alert('Thanks!')} className="w-full">Join the newsletter</Button>
            </div>
          </nav>

          <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-white border rounded-lg">
            <h4 className="text-sm font-semibold">Quick links</h4>
            <ul className="mt-3 text-sm space-y-2">
              <li><a href="/siliconvalleygirl#backlinks" className="text-slate-600 hover:underline">SEO checklist</a></li>
              <li><a href="/siliconvalleygirl#creator-economy" className="text-slate-600 hover:underline">Creator templates</a></li>
            </ul>
          </div>
        </aside>
      </div>

    </main>
      <Footer />
    </>
  );
}
