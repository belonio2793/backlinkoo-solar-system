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

const metaTitle = 'Bloom — AI-Powered Creative Studio: Design, Motion & Collaboration for Teams';
const metaDescription = 'Bloom (bloomapp.club) is a collaborative creative studio that combines AI-assisted design, motion, and team workflows to help creators produce polished assets faster. Learn features, workflows, case studies, and best practices.';

export default function BloomPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/bloom`;
    } catch {
      return '/bloom';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Bloom, Bloom App, creative studio, AI design, motion design, collaborative design tools');
    upsertCanonical(canonical);

    injectJSONLD('bloom-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('bloom-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('bloom-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Bloom?', acceptedAnswer: { '@type': 'Answer', text: 'Bloom is a collaborative creative studio that blends AI-powered design tools with motion and publishing workflows to help teams produce high-quality creative assets faster.' } },
        { '@type': 'Question', name: 'Who uses Bloom?', acceptedAnswer: { '@type': 'Answer', text: 'Designers, marketers, social teams, agencies, and product teams use Bloom to produce motion assets, social posts, and short-form video content with faster iteration cycles.' } },
        { '@type': 'Question', name: 'Does Bloom export production-ready files?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Bloom supports exports suitable for social channels and production handoffs, including video formats and layered assets depending on the project needs.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Bloom — The AI-Enhanced Studio for Creative Teams</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Bloom helps teams ideate, design, and ship creative assets — from social visuals to motion clips — by combining AI-assisted generation, collaborative editing, and production-ready exports.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI Design</Badge>
            <Badge className="bg-slate-100 text-slate-800">Motion & Video</Badge>
            <Badge className="bg-slate-100 text-slate-800">Team Collaboration</Badge>
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
                  <a href="#overview" className="block text-blue-700">Overview</a>
                  <a href="#features" className="block text-blue-700">Features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Team workflow</a>
                  <a href="#case-studies" className="block text-blue-700">Case studies</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Bloom accelerates creative production with AI-assisted templates, collaborative timelines, and exports optimized for social and media teams. It helps reduce repetitive design work and improves iteration speed across campaigns.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="overview">
              <h2>Overview</h2>
              <p>Bloom is a creative platform focused on helping teams bring ideas to polished assets quickly. It centers on three pillars: generative assistance for ideation and layouts, streamlined motion tools for short-form clips, and team-oriented collaboration for feedback and approvals. This combination is particularly valuable for small creative teams, marketing squads, and agencies that need to produce a steady stream of content under tight deadlines.</p>

              <p>Historically, producing motion and social assets required a mix of designers, motion editors, and engineers. Bloom reduces that friction by providing templates, AI suggestions, and an integrated timeline to iterate faster while preserving the option to export for advanced finishing if needed.</p>
            </section>

            <section id="features">
              <h2>Key Features</h2>

              <h3>AI-Assisted Templates & Layouts</h3>
              <p>Seed projects with AI-driven templates tailored to platform specs—Instagram posts, short-form vertical videos, story formats, ads, and more. Templates can be pre-populated with brand colors, fonts, and tone-of-voice suggestions to accelerate consistent output.</p>

              <h3>Motion Timeline & Transitions</h3>
              <p>Built-in motion tools let creators animate text, images, and vector elements with simple keyframes and presets. The timeline is approachable for non-specialists while still supporting export-compatible motion curves and easing functions.</p>

              <h3>Collaborative Editing & Comments</h3>
              <p>Invite reviewers, leave time-stamped comments on frames, and approve versions. Bloom’s collaboration model reduces back-and-forth by linking feedback to specific frames or elements in the composition.</p>

              <h3>Asset Management & Brand Kits</h3>
              <p>Store logos, fonts, and approved imagery in a shared brand kit so every team member works with the latest assets. Version history ensures you can revert to previous iterations if needed.</p>

              <h3>Auto-Resize & Multi-Format Exports</h3>
              <p>Export assets in multiple aspect ratios and formats automatically—crop and reflow content for stories, feed posts, and ads without rebuilding the composition for each target.</p>

              <h3>Content Scheduling & Drafts</h3>
              <p>Plan campaigns, create drafts for future publication, and export ready-to-upload files to social schedulers or CMS systems. Some integrations enable direct publishing to social platforms when available.</p>

              <h3>High-Fidelity Exports</h3>
              <p>Export high-resolution video and layered files for further editing in desktop tools if your creative pipeline requires advanced color grading or audio mastering.</p>
            </section>

            <section id="how-it-works">
              <h2>How Bloom Works — A Practical Walkthrough</h2>
              <ol>
                <li><strong>Start with a brief:</strong> Choose a goal—brand awareness, event promo, product highlight—and pick an appropriate template size and style.</li>
                <li><strong>AI ideation:</strong> Use AI to generate headline variations, layout options, and suggested motion presets that match your brief.</li>
                <li><strong>Customize:</strong> Replace imagery, update copy, swap colors, and fine-tune timing on the motion timeline.</li>
                <li><strong>Collaborate:</strong> Share a draft for review; reviewers add inline, time-stamped comments tied to frames or elements.</li>
                <li><strong>Export & schedule:</strong> Export multi-format assets and schedule posts or deliver files to a content management system or social scheduler.</li>
              </ol>

              <p>This flow shortens time from concept to publish while keeping teams aligned and reducing rework common in remote creative workflows.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases — Who Benefits from Bloom</h2>

              <h3>Social & Content Teams</h3>
              <p>Teams that publish daily or weekly content benefit from templates, auto-resize, and scheduling features. Bloom reduces the iteration cycle and helps maintain a consistent brand voice across formats.</p>

              <h3>Agencies & Creative Studios</h3>
              <p>Agencies can prototype rapid concepts for clients, gather approvals inside the platform, and export master files for fine-tuning if required by the production pipeline.</p>

              <h3>Product & Marketing</h3>
              <p>Product teams can produce explainer clips, teaser videos, and promotional assets without needing to queue a motion designer for every request.</p>

              <h3>Freelancers & Small Teams</h3>
              <p>Independent creators gain an all-in-one tool to produce professional assets and deliver them to clients without maintaining a complex toolchain.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Team Workflow</h2>
              <ol>
                <li><strong>Define roles:</strong> Assign who drafts, who reviews, and who publishes to reduce overlap.</li>
                <li><strong>Use brand kits:</strong> Keep assets centralized in Bloom to ensure consistency across campaigns.</li>
                <li><strong>Iterate with comments:</strong> Use time-stamped feedback to make precise edits and avoid vague requests.</li>
                <li><strong>Automate exports:</strong> Set up multi-format exports to reduce manual resizing work and accelerate publishing.</li>
                <li><strong>Measure:</strong> Track campaign performance and feed learnings back into template adjustments and AI prompts.</li>
              </ol>

              <p>These practices help teams scale creative output while maintaining quality and brand alignment.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Direct-to-Consumer Brand — Faster Campaign Iteration</CardTitle>
                </CardHeader>
                <CardContent>
                  "A DTC brand used Bloom to create multiple versions of a launch campaign across channels. The team recycled motion assets into static ads and stories, reducing production time by half and improving creative freshness." — Head of Marketing
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Agency — Faster Client Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  "The agency moved client reviews into Bloom and used time-stamped comments to resolve feedback quickly. Approval cycles shrank from days to hours." — Creative Director
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Solo Creator — Professional Output Without the Suite</CardTitle>
                </CardHeader>
                <CardContent>
                  "A solo animator produced social clips and pitched them directly to brands. Bloom’s exports were high enough quality that no additional editing was needed for most clients." — Freelance Motion Designer
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Bloom made it possible to iterate on motion posts without a dedicated editor. We ship more content, with better polish." — Social Lead</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The AI suggestions cut our concept phase in half and the timeline is intuitive for non-technical teammates." — Content Strategist</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"Auto-resize saved hours when adapting a long-form video to multiple social formats." — Video Producer</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & Considerations</h2>

              <p>Bloom is optimized for short-form motion and social assets. Consider these limitations:</p>
              <ul>
                <li><strong>Complex VFX or audio mixing:</strong> Advanced visual effects and deep audio post-production are better performed in specialized desktop tools.</li>
                <li><strong>Extensive plugin workflows:</strong> Plugins and custom effects common in high-end studios may not be supported directly in the browser environment.</li>
                <li><strong>Large-scale studio pipelines:</strong> Enterprises with large motion pipelines may require additional integrations or asset handoff practices to meet compliance and archival needs.</li>
              </ul>

              <p>For many teams, Bloom complements existing toolchains by handling early-stage ideation, social edits, and client approvals, while leaving final mastering to specialist tools when necessary.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Getting the Most Out of Bloom</h2>
              <ol>
                <li>Standardize a brand kit with approved colors, fonts, and image assets.</li>
                <li>Create templates for recurring campaign types to maintain consistency across releases.</li>
                <li>Use AI prompts as starting points and refine copy to match brand voice.</li>
                <li>Centralize review cycles within Bloom and link comments to tasks in your project tracker.</li>
                <li>Keep exports organized by naming conventions and version tags for easy handoffs.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Can Bloom replace desktop video editors?</summary><p className="mt-2">Bloom is designed for rapid motion and social edits. For advanced VFX, detailed color grading, or complex audio mastering, desktop editors remain essential. Bloom is best used for ideation, drafts, and social-first assets.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does Bloom integrate with schedulers?</summary><p className="mt-2">Many creative studios connect Bloom exports to social scheduling tools and CMS systems. Check the product’s integrations for direct publishing options.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is AI-generated content customizable?</summary><p className="mt-2">Yes — AI suggestions are editable and intended to accelerate workflows rather than replace human creativity. Teams should always review outputs for brand fit and messaging accuracy.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Grow Visibility for Your Creative Work</h2>
              <p>Once you create standout creative assets with Bloom, you need discoverability to magnify impact. Backlink ∞ helps creators, agencies, and brands build targeted backlinks and SEO campaigns that drive organic traffic, improve content reach, and support monetization.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Bloom is built to help teams create polished, on-brand motion and social content at speed. By combining AI assistance with collaborative timelines and production-quality exports, it reduces the friction in modern creative workflows. Use Bloom to iterate faster, align teams, and deliver content that performs.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
