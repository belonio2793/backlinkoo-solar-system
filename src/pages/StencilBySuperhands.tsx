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

const metaTitle = 'Stencil by SUPERHANDS — AI-First Design System & Production Assistant for Teams';
const metaDescription = 'Stencil (SUPERHANDS) blends AI assistants and human review to produce design-ready assets and repeatable production flows. Learn how Stencil accelerates design-to-production, templates, workflows, integrations, and best practices.';

export default function StencilBySuperhandsPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/stencil-superhands`;
    } catch {
      return '/stencil-superhands';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Stencil, SUPERHANDS, AI design assistant, production assistant, creative ops, design system');
    upsertCanonical(canonical);

    injectJSONLD('stencil-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('stencil-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('stencil-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Stencil by SUPERHANDS?', acceptedAnswer: { '@type': 'Answer', text: 'Stencil by SUPERHANDS is a creative production assistant that combines AI generation with human review and templates to accelerate design and creative operations.' } },
        { '@type': 'Question', name: 'Who benefits from Stencil?', acceptedAnswer: { '@type': 'Answer', text: 'Marketing teams, design teams, small agencies, and creators who need repeatable, on-brand creative assets at scale benefit from Stencil’s workflows.' } },
        { '@type': 'Question', name: 'Can Stencil integrate with my tools?', acceptedAnswer: { '@type': 'Answer', text: 'Stencil typically integrates with common creative and collaboration tools to streamline asset delivery and approvals — check product docs for available integrations.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Stencil by SUPERHANDS — AI-First Creative Production That Scales</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Stencil is a production-aware creative assistant that pairs AI generation with human curation and repeatable playbooks. It helps teams produce on-brand visual assets, motion snippets, and campaign-ready creative with predictable quality and speed.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI + Human Review</Badge>
            <Badge className="bg-slate-100 text-slate-800">Creative Ops</Badge>
            <Badge className="bg-slate-100 text-slate-800">Templates & Scale</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Stencil?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#workflows" className="block text-blue-700">Production workflows</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#integration" className="block text-blue-700">Integrations</a>
                  <a href="#best-practices" className="block text-blue-700">Best practices</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Stencil blends AI generation, brand templates, and human review to help teams create consistent creative at scale—reducing turnaround time while preserving brand quality.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Stencil?</h2>

              <p>Stencil is a creative production platform by SUPERHANDS that sits at the intersection of automation and craft. It uses AI to generate ideas and base assets—mockups, social images, short motion clips, and copy variants—then routes them through human review and templating so outputs remain on-brand and production-ready.</p>

              <p>The platform is designed for teams that need a steady stream of creative—marketing, performance, product launches, and social campaigns—without the cost and bottleneck of full bespoke production for every asset. Stencil is optimized for repeatability: once your brand tokens, templates, and review rules are in place, the platform can produce consistent outputs quickly.</p>
            </section>

            <section id="features">
              <h2>Core Features</h2>

              <h3>AI-Assisted Creative Generation</h3>
              <p>Stencil provides AI-generated starting points: multiple visual treatments, headline suggestions, and motion variants tailored to your brief. The goal is to accelerate ideation and reduce the time spent on low-value iterations.</p>

              <h3>Brand Templates & Tokens</h3>
              <p>Define your brand tokens—colors, type, spacing, logo usage—and build templates that enforce brand rules automatically. When AI generates variants, they are automatically adapted to these templates to ensure consistency across assets.</p>

              <h3>Human-in-the-Loop Review</h3>
              <p>Every generated asset passes through a review queue where designers or brand stewards can accept,</p>
  <p> tweak, or reject items. This review step preserves quality and ensures sensitive messaging is vetted.</p>

              <h2>Production Handoff & Exports</h2>
              <p>Export assets in production-ready formats or push them directly to scheduling and publishing systems. Stencil supports layered exports for advanced finishing or flattened files ready for immediate upload.</p>

              <h3>Campaign Bundles & Versioning</h3>
              <p>Create grouped campaign bundles with multiple variants for A/B testing.</p>
  <p> Versioning keeps history of iterations and allows rollbacks to earlier creative directions.</p>

              <h3>Workflow Automation & Approvals</h3>
              <p>Automate approvals, stakeholder notifications, and direct uploads to ad platforms or content</p>
  <p> schedulers. Define gates so legal, compliance, or brand teams can sign off before publishing.</p>

              <h3>Performance Insights</h3>
              <p>Track creative performance metrics and surface which templates or AI prompts</p>
  <p> produce the best engagement—feeding back into the system to inform future generation.</p>
            </section>

            <section id="workflows">
              <h2>Production Workflows with Stencil</h2>

              <p>Stencil supports multiple production patterns depending on scale and goals. Here are three common workflows:</p>

              <h2>Rapid Social Production (High Volume)</h2>
              <ol>
                <li>Create a campaign brief with target sizes and messaging variants.</li>
                <li>Stencil generates 10–20 initial concepts per brief tailored to each platform format.</li>
                <li>Design reviewers select top concepts and apply minor edits via the built-in editor.</li>
                <li>Export multi-format bundles and schedule posts through connected social tools.</li>
              </ol>

              <h3>Performance Creative (Test & Learn)</h3>
              <ol>
                <li>Define a testing matrix for copy, imagery, and CTA variations.</li>
                <li>Generate variants in Stencil and map them to testing buckets.</li>
                <li>Deploy top performers and iterate on winning combinations based on engagement metrics.</li>
              </ol>

              <h3>Campaign Production with Approvals</h3>
              <ol>
                <li>Production managers create a campaign bundle and select templates with approval gates.</li>
                <li>Generated assets route to brand and legal reviewers; approvers annotate changes or approve.</li>
                <li>Assets are exported once all gates are cleared and performance tags are attached for measurement.</li>
              </ol>
            </section>

            <section id="use-cases">
              <h2>Who Benefits: Use Cases</h2>

              <h3>Small in-house teams</h3>
              <p>Teams with limited headcount produce volume creative quickly while maintaining brand consistency through templates and review rules.</p>

              <h2>Agencies and studios</h2>
              <p>Agencies use Stencil to scale deliverables across clients with repeatable templates and</p>
  <p> streamlined approvals, allowing junior designers to execute at scale while senior staff focus on strategy.</p>

              <h3>Performance marketers</h3>
              <p>Marketers iterate creative for ads and quickly produce multiformat variants for A/B testing and campaign optimization.</p>

              <h3>Product teams</h3>
              <p>Product teams generate feature announcement assets and in-app creatives without waiting on the central design team for every small update.</p>
            </section>

            <section id="integration">
              <h2>Integrations & Ecosystem</h2>

              <p>Stencil connects to common tools in the creative and marketing stack to minimize context switching:</p>
              <ul>
                <li><strong>Collaboration:</strong> Slack, Microsoft Teams for review notifications and approvals.</li>
                <li><strong>Design & Storage:</strong> Figma, Google Drive, Dropbox for asset management and handoffs.</li>
                <li><strong>Publishing:</strong> Buffer, Hootsuite, native social APIs for scheduling and publishing.</li>
                <li><strong>Analytics:</strong> Google Analytics, Facebook Ads Manager, and UTM tagging for performance insights.</li>
              </ul>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Using Stencil</h2>
              <ol>
                <li>Define brand tokens and enforce them through templates to maintain consistency.</li>
                <li>Use human review strategically—allow AI to do repetitive work and reserve senior review for sensitive or high-impact items.</li>
                <li>Run small tests on prompts and templates to identify high-performing directions before scaling.</li>
                <li>Instrument creative with performance tags so you can learn which templates and prompts work best.</li>
                <li>Document approval flows and retention policies to ensure compliance and traceability.</li>
              </ol>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Early Results</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Indie Brand — Faster Campaign Turnaround</CardTitle>
                </CardHeader>
                <CardContent>
                  "An indie brand used Stencil to produce multi-platform launch assets. The team shipped more variations with fewer rounds of feedback and improved early campaign ROI." — Head of Marketing
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Agency — Scalable Creative Ops</CardTitle>
                </CardHeader>
                <CardContent>
                  "The agency standardized templates across clients and used Stencil to reduce production time for repeat campaigns by over 40%." — Creative Director
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Stencil is an incredible time-saver—the AI gives us strong starting points and our designers finish them quickly." — Senior Designer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"We maintain brand quality at scale now. The templates and review workflow are a perfect balance of automation and craft." — Marketing Ops</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The export quality was production-ready for most social channels—saved us agency hours every week." — Social Producer</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & Responsible Use</h2>

              <p>AI-generated creative simplifies many tasks, but teams should be mindful of limitations:</p>
              <ul>
                <li><strong>Context & nuance:</strong> Brand nuance, cultural sensitivities, and campaign strategy still require human judgment.</li>
                <li><strong>Quality variance:</strong> Generated assets may need touch-ups, especially for high-resolution or complex motion work.</li>
                <li><strong>Intellectual property:</strong> Ensure generated content complies with licensing, especially when using third-party references.</li>
              </ul>

              <p>Use Stencil to augment creativity, not replace core design thinking—keep humans in the loop for final creative decisions.</p>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Is Stencil a replacement for designers?</summary><p className="mt-2">No—Stencil accelerates the creative process and reduces repetitive work, but designers remain essential for strategy, high-fidelity design, and final approvals.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can I export layered files for further editing?</summary><p className="mt-2">Yes—Stencil supports layered exports for advanced finishing in desktop tools when needed.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does Stencil respect brand assets?</summary><p className="mt-2">Stencil uses brand tokens and templates to ensure generated assets follow your brand guidelines; maintain token accuracy for best results.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Amplify Your Creative Work</h2>
              <p>When you produce consistent, high-quality creative—whether with Stencil or other tools—visibility matters. Backlink ∞ helps creators, agencies, and brands build targeted backlinks and SEO strategies that increase organic reach and attract customers to your work.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Stencil by SUPERHANDS demonstrates a pragmatic approach to creative scale: combine generative AI with templates and human review to produce consistent creative efficiently. When teams adopt clear governance, templates, and measurement, AI can unlock new capacity while preserving brand quality.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
