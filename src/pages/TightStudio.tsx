import { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/proximity-lock-system.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.text = text;
    document.head.appendChild(el);
  } else {
    el.text = text;
  }
}

const metaTitle = 'Tight Studio — Fast, Collaborative Audio & Video Editing for Creators';
const metaDescription = 'Tight Studio provides collaborative audio and video editing tools designed for creators and small teams. Learn about Tight Studio features, workflows, use cases, and best practices for fast production and remote collaboration.';

export default function TightStudioPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/tightstudio`;
    } catch {
      return '/tightstudio';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Tight Studio, collaborative editing, audio editor, video editor, creators, remote collaboration');
    upsertCanonical(canonical);

    injectJSONLD('tightstudio-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('tightstudio-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('tightstudio-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Tight Studio?', acceptedAnswer: { '@type': 'Answer', text: 'Tight Studio is a collaborative audio and video editing platform aimed at creators and small teams who need fast, remote-friendly production tools.' } },
        { '@type': 'Question', name: 'Can teams collaborate in real time?', acceptedAnswer: { '@type': 'Answer', text: 'Tight Studio focuses on asynchronous and real-time collaboration features—commenting, shared timelines, and versioning to help distributed teams work together.' } },
        { '@type': 'Question', name: 'Who is Tight Studio for?', acceptedAnswer: { '@type': 'Answer', text: 'Podcasters, video creators, small studios, and remote teams who need quick turnarounds and easy collaboration benefit from Tight Studio.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Tight Studio — Collaborative Audio & Video Editing for Modern Creators</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Tight Studio is built for creators who move fast: collaborative timelines, simple export pipelines, and tools tailored for short-form and episodic content production.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Collaborative Timelines</Badge>
            <Badge className="bg-slate-100 text-slate-800">Quick Export</Badge>
            <Badge className="bg-slate-100 text-slate-800">Creator Tools</Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 sticky top-28 self-start">
            <Card>
              <CardHeader>
                <CardTitle>On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="text-sm space-y-2">
                  <a href="#what" className="block text-blue-700">What is Tight Studio?</a>
                  <a href="#features" className="block text-blue-700">Key features</a>
                  <a href="#workflow" className="block text-blue-700">Creator workflow</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#integrations" className="block text-blue-700">Integrations</a>
                  <a href="#pricing" className="block text-blue-700">Pricing & access</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Tight Studio combines lightweight editing tools with collaboration features to help creators produce polished audio and video quickly. Ideal for teams producing podcasts, social clips, and episodic content.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Tight Studio?</h2>

              <p>Tight Studio is a collaborative editing environment for audio and video that emphasizes speed, simplicity, and distributed workflows. It focuses on the typical needs of modern creators—fast turnarounds, tidy edits, and easy collaboration—without the complexity of a full DAW or NLE.</p>

              <p>The product aims to reduce friction: shared timelines, comment-driven feedback, and one-click exports tailored to social platforms or podcast hosts. Tight Studio is particularly useful for teams that need to produce frequent short-form content or maintain episodic releases across channels.</p>
            </section>

            <section id="features">
              <h2>Key Features</h2>

              <h3>Collaborative Timeline</h3>
              <p>Shared timelines let multiple contributors comment, suggest edits, and flag sections for revision. Versioning ensures changes are tracked and reversible.</p>

              <h3>Simplified Multi-track Editing</h3>
              <p>Layer audio and video with an approachable editor—trim, fade, duck, and arrange clips without steep learning curves. Ideal for podcast producers and social editors.</p>

              <h3>Instant Exports & Presets</h3>
              <p>Export presets for podcast hosts, YouTube, Instagram, and TikTok streamline delivery. Batch exports reduce manual resizing or encoding steps.</p>

              <h2>Commenting & Time-Stamped Notes</h2>
              <p>Comment directly on timeline positions and attach suggested edits or assets. Time-stamped notes make reviews fast and precise.</p>

              <h3>Remote Recording & Asset Uploads</h3>
              <p>Contributors can upload recorded takes or use integrated remote recording features. Assets are organized for quick assembly and editing.</p>

              <h3>Lightweight Effects & Presets</h3>
              <p>Essential effects like EQ, compression, and color grading presets help get production-ready outputs without complex plugin chains.</p>

              <h3>Role-Based Access</h3>
              <p>Control who can edit, review, or publish content with role-based permissions, keeping production pipelines secure and auditable.</p>
            </section>

            <section id="workflow">
              <h2>Creator Workflow: From Take to Publish</h2>

              <ol>
                <li><strong>Ingest:</strong> Upload takes, raw footage, and supporting assets into a project folder.</li>
                <li><strong>Assemble:</strong> Use the timeline to arrange clips, apply quick trims and fades, and sync audio where needed.</li>
                <li><strong>Review:</strong> Invite collaborators to comment at precise timestamps, accept or reject suggested edits, and iterate rapidly.</li>
                <li><strong>Polish:</strong> Apply lightweight processing—EQ, compression, color presets—and finalize mix levels for exports.</li>
                <li><strong>Export & distribute:</strong> Use presets to export to publishing platforms or create multi-format bundles for social channels.</li>
              </ol>

              <p>This flow supports small teams and solo creators who need to ship content frequently and keep quality consistent.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases: Who Benefits from Tight Studio</h2>

              <h2>Podcasters & Audio Creators</h2>
              <p>Quick assembly and export for episodes, remote guest takes, and chapter markers for podcast platforms.</p>

              <h3>Social Video Creators</h3>
              <p>Produce multiformat clips with presets and batch exports for fast social delivery.</p>

              <h3>Small Studios & Agencies</h3>
              <p>Coordinate multi-person projects with shared timelines and approval gates to streamline client deliveries.</p>

              <h3>Educational Content</h3>
              <p>Build lecture clips, annotate timestamps, and export segments for LMS or video platforms.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Tooling</h2>

              <p>Tight Studio connects to common creator workflows and tools to reduce friction:</p>
              <ul>
                <li><strong>Cloud storage:</strong> Google Drive, Dropbox for asset sync and backup.</li>
                <li><strong>Publishing:</strong> Direct uploads to YouTube, podcast hosts, or integrations with social schedulers.</li>
                <li><strong>Communication:</strong> Slack for review notifications and simple approvals.</li>
                <li><strong>Analytics:</strong> Integrate with basic analytics to tag performance and guide creative iterations.</li>
              </ul>
            </section>

            <section id="pricing">
              <h2>Pricing & Access</h2>

              <p>Tight Studio typically offers tiers that reflect team size and export needs: a free or trial tier for individual creators, paid plans for teams with collaboration and increased storage, and enterprise options for custom integrations and SLAs. Focus your evaluation on export limits, storage quotas, and support SLAs when choosing a plan.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Early Feedback</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Podcast Network — Faster Episode Turnaround</CardTitle>
                </CardHeader>
                <CardContent>
                  "A small podcast network used Tight Studio to coordinate editor notes and guest uploads, reducing episode production time by over 30%." — Producer
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Social Creator — Volume Output</CardTitle>
                </CardHeader>
                <CardContent>
                  "Batch exports and presets enabled a creator to produce daily short clips optimized for different platforms, increasing reach and engagement." — Social Creator
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Tight Studio made collaborating with remote guests painless—the comment system is precise and saved hours in revision." — Podcast Host</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"Our agency uses Tight Studio for quick turnarounds on social edits—reliability and exports are great." — Creative Lead</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The presets are a lifesaver for multi-platform delivery—no more manual encoding headaches." — Video Editor</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Consider Other Tools</h2>

              <p>Tight Studio focuses on speed and collaboration. For high-end feature films, advanced audio production, or complex VFX, desktop NLEs and DAWs are still the right choice. Tight Studio shines when your priority is iteration speed, collaboration, and frequent delivery.</p>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Does Tight Studio support multi-track audio?</summary><p className="mt-2">Yes—Tight Studio supports multi-track editing with basic mixing tools designed for quick, production-ready results.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can I export for different social aspect ratios?</summary><p className="mt-2">Yes—use export presets to produce variants for vertical, square, and landscape outputs.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is collaboration real-time?</summary><p className="mt-2">Tight Studio supports both asynchronous collaboration through comments and live review sessions for synchronous edits where supported.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Get More Eyes on Your Content</h2>
              <p>After producing great audio and video, promotion matters. Backlink ∞ helps creators and studios build targeted backlink campaigns and SEO strategies that increase discovery and drive organic growth.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Tight Studio is a strong fit for creators and teams who prioritize speed, collaboration, and consistent output with minimal friction. Use it to streamline episode production, accelerate social content delivery, and keep creative operations lean.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
