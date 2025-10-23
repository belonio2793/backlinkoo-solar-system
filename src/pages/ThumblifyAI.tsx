import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'ThumblifyAI — AI Thumbnail Generator: Create Click-Worthy Thumbnails Fast';
const metaDescription = 'Create eye-catching thumbnails in seconds with ThumblifyAI. AI-driven prompts, face & style training, sketch conversion, and AI edits for thumbnails that drive views.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'ThumblifyAI — AI Thumbnails Built to Boost Clicks',
    summary:
      'ThumblifyAI is an AI-powered thumbnail creation platform that helps creators, marketers, and teams produce high-conversion thumbnails in minutes—no design expertise required.',
    paragraphs: [
      'Thumbnails are the first handshake between your content and a potential viewer. In crowded feeds and search results, a single strong thumbnail can be the difference between a scroll and a click. ThumblifyAI focuses on making that handshake unmistakable: high-contrast compositions, readable text treatments, expressive faces, and visual storytelling tuned to modern attention patterns.',
      'The platform combines prompt-driven generation, personalized face and style training, sketch-driven design, and precise AI editing. This blend lets creators iterate quickly, maintain consistent visual language, and test multiple approaches to discover what resonates with their audience.',
      'This guide explores ThumblifyAI’s features, workflows, use cases, and practical advice for creators who want to scale thumbnail production without sacrificing brand or quality. Whether you are a solo YouTuber, a growth marketer, or an agency creating video at scale, the principles below will help you get more views with less friction.'
    ]
  },
  {
    id: 'why-thumbnails-matter',
    title: 'Why Thumbnails Matter: The Psychology of a Click',
    summary: 'A thumbnail is a visual promise. It communicates relevance, emotion, and value in one glance.',
    paragraphs: [
      'People decide in a fraction of a second whether to click. Thumbnails that succeed do three things: convey the topic clearly, create curiosity, and signal credibility. Great thumbnails use composition, face expressions, bold typography, and color contrast to create an immediate emotional hook.',
      'For creators, thumbnails are a lever for growth: a small improvement in click-through rate can compound across dozens of videos and millions of impressions. Investing in thumbnails is often more cost-effective than optimizing titles or descriptions alone because visual salience is paramount in discovery interfaces.',
      'ThumblifyAI is designed to operationalize these thumbnail principles—automating the visual grammar while keeping the creator in control. By combining AI with explicit controls for face placement, text hierarchy, and color, it balances automation with brand consistency.'
    ]
  },
  {
    id: 'features',
    title: 'Core Features — Prompts, Faces, Styles, and Sketches',
    summary: 'ThumblifyAI’s toolkit is built around practical features creators actually use: fast generation from prompts, personalized face models, style transfers, sketch conversion, and fine-grained AI editing.',
    paragraphs: [
      'Prompt-Based Generation: Describe the scene, mood, and key elements in plain language and ThumblifyAI generates a scroll-stopping thumbnail composition. Prompts let you experiment quickly—try several angles (humor, shock, mystery) to discover which voice matches your audience.',
      'Face Training: For personality-based channels, consistent face representation is essential. ThumblifyAI can be trained on a few images of your face to produce thumbnails that represent you accurately in a variety of poses and expressions, preserving authenticity while optimizing composition.',
      'Style Training: Maintain brand continuity by training the model on existing thumbnails or a style guide. The system learns your color palettes, edge treatments, and typographic sensibilities so generated thumbnails feel native to your channel.',
      'Sketch to Thumbnail: Sketch a rough layout—box for face, place for headline, suggested background—and ThumblifyAI turns it into a polished thumbnail. This workflow is perfect for creators who think visually and want direct control over composition.',
      'AI Editing: Need to tweak a small part of an existing thumbnail? Use AI editing to replace objects, adjust facial expressions, or change the background while keeping the rest of the design intact. This enables rapid A/B testing with minimal rework.',
      'Batch Generation & Variants: Generate multiple options from a single prompt to test different hooks. Batch mode saves time when producing thumbnails for a series or when preparing multiple size variants for platforms.',
      'Export-Ready Assets: Output optimized thumbnails for YouTube, TikTok, Instagram, and other platforms with the correct resolution and bleed settings, plus layered sources for designers who want to refine further.'
    ]
  },
  {
    id: 'how-it-works',
    title: 'How It Works — From Prompt to Publish in Minutes',
    summary: 'ThumblifyAI blends model-driven generation with deterministic editing and export pipelines so creators can go from idea to published thumbnail rapidly.',
    paragraphs: [
      'Start with Intent: Enter a short prompt describing the video’s angle—what the viewer will learn, the emotional tone, and any visual anchors (e.g., “shocked face + bold yellow headline: I QUIT my job”). The prompt frames the model and narrows creative possibilities so results are on-target.',
      'Select Personalization: Choose whether to include your trained face or style. For many creators, toggling the face model keeps thumbnails branded without overwhelming the scene.',
      'Refine with Tools: Use sketch input, composition presets, and AI edits to refine the generated thumbnail. Designers can adjust text placement, swap background scenes, or nudge facial expression to match the video’s emotional beat.',
      'Export & Test: Export multiple variants for A/B testing. ThumblifyAI supports common thumbnail sizes and includes export presets for each major platform so creators don’t waste time resizing or reformatting.'
    ]
  },
  {
    id: 'face-and-style-training',
    title: 'Face & Style Training — Consistency at Scale',
    summary: 'Train the model on your face and your look so thumbnails remain recognizably you, even as they explore different concepts and hooks.',
    paragraphs: [
      'Face training requires only a few examples of your face in different expressions and angles. The model learns your features and can synthesize plausible, on-brand expressions that match the prompt—smiles, shock, contemplative looks—without looking generative or artificial.',
      'Style training allows you to upload a set of your existing thumbnails or brand assets. The model internalizes color palettes, stroke weights, and layout conventions so new thumbnails slot into your feed as if they were handcrafted by your design team.',
      'Security & Ethics: Face and style models are private to your account. Training data is stored securely, and generated faces are stylized to avoid impersonation concerns while preserving recognizability for your audience.'
    ]
  },
  {
    id: 'sketch-workflow',
    title: 'Sketch-Driven Design — Direct the Composition',
    summary: 'If you prefer to lead with a visual idea, the sketch workflow allows you to draft a rough layout that ThumblifyAI refines.',
    paragraphs: [
      'Creators often think in thumbnails: boxes, bold text blocks, and focal points. The sketch workflow accepts rough black-and-white layouts or simple annotated frames and translates them into fully rendered thumbnails that respect your intent.',
      'This approach preserves creative control while hugely reducing execution time. Instead of recreating a composition from scratch, designers supply the vision and the AI fills in grade-A visuals and lighting, producing professional results in minutes.',
      'Sketch-driven generation is especially useful when collaborating with a social team where a strategist provides hooks and a designer polishes final exports. It moves the heavy lifting to AI while keeping human authorship at the core.'
    ]
  },
  {
    id: 'editing-and-variants',
    title: 'AI Editing & Variant Generation — Iterate Faster',
    summary: 'Refinement tools let you change discrete parts of an image or produce multiple concept variants for testing and discovery.',
    paragraphs: [
      'Localized Edits: Selectors enable you to paint or mask a region for edit—swap a background, alter clothing color, or replace an object—while preserving global lighting and compositional coherence.',
      'Variants for Testing: Automated variant generation gives you several distinct thumbnails from one prompt, ideally tuned to different emotional and informational hooks. These variants can be exported and run in A/B tests to identify the highest-performing approach.',
      'Rapid Exploration: Because generation is fast, creators are freed from perfection paralysis. Try bold, experimental hooks without committing many hours and revert to proven styles when necessary.'
    ]
  },
  {
    id: 'outputs-and-formats',
    title: 'Outputs & Formats — Ready for Every Platform',
    summary: 'Export settings and presets ensure thumbnails look right whether they appear in a YouTube search, a TikTok feed, or a LinkedIn post.',
    paragraphs: [
      'Platform Presets: Choose a preset for YouTube (1280×720), TikTok vertical previews, or social banner crops. Each preset includes safe margins and text scale guidance so critical elements are never cut off.',
      'Layered Exports: For designers who want to continue working in Photoshop or Figma, ThumblifyAI can produce layered source files that preserve text, face layers, and background elements for further edits.',
      'Optimized Web Asset: The platform also produces optimized PNG/JPEG outputs with sensible compression to keep file sizes friendly for fast uploads without visible quality loss.'
    ]
  },
  {
    id: 'use-cases',
    title: 'Who Benefits — Creators, Marketers, and Agencies',
    summary: 'ThumblifyAI is useful across the creator economy: solo YouTubers, educational channels, product marketers, and agencies producing high volumes of video content.',
    paragraphs: [
      'Solo Creators: Save hours per video by generating previews and testing hooks quickly. A consistent face model and style training helps build a recognisable brand that audiences come back to.',
      'Educational Channels: Thumbnails that properly summarize the lesson and show an instructor face often increase click-through for educational content; ThumblifyAI ensures clarity and readability even for dense topics.',
      'Marketers & Growth Teams: Campaigns with dozens of videos or ads need rapid iteration. Batch generation and variant exports make it simple to produce multiple creatives tuned to different audience segments.',
      'Creative Agencies: Agencies can scale thumbnail production across clients and maintain different style profiles per account—mixing custom edits with AI-generated drafts to meet tight timelines.'
    ]
  },
  {
    id: 'comparison',
    title: 'Comparing Alternatives — When to Use ThumblifyAI',
    summary: 'ThumblifyAI is purpose-built for thumbnails; general image generators or manual design workflows serve different needs.',
    paragraphs: [
      'Generic Image Models: Tools like general image generators can create beautiful images, but they are not optimized for thumbnail grammar—face prominence, clear headlines, and platform-safe layouts. ThumblifyAI explicitly designs for these constraints.',
      'Manual Design: A human designer offers bespoke creativity but at a higher time and money cost. ThumblifyAI reduces the iteration cost and allows designers to focus on higher-level strategy rather than repetitive composition tasks.',
      'Hybrid Workflows: Many teams will use ThumblifyAI as the rapid ideation layer and refine top options manually. This hybrid approach keeps costs down while ensuring final assets meet brand standards.'
    ]
  },
  {
    id: 'testimonials',
    title: 'Creator Testimonials — Fast, High‑Quality Results',
    summary: 'ThumblifyAI has resonated with creators who praise speed, quality, and the ability to remove creative blocks.',
    paragraphs: [
      '“Honestly, the tool is outstanding, the level of detail is incredibly sharp, the quality it produces is unmatched, and the speed at which it delivers results is truly impressive. I would highly recommend it for thumbnail designers!” — Boubagraouy Houssam',
      '“I used to spend hours designing each thumbnail. Now it takes minutes. It\'s a massive time-saver for every thumbnail I create. Clean designs, fast output, and zero creative block.” — Otis Wu',
      '“ThumblifyAI is a lifesaver for lazy creators like me. The thumbnails it generated were🔥—typed topic, boom—a scroll-stopping thumbnail in seconds.” — xie'
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing & Plans — Flexible Options for Creators',
    summary: 'ThumblifyAI typically offers credit-based and subscription tiers to suit individual creators and teams.',
    paragraphs: [
      'Credit Models: Many creator tools favor credit systems—buy a bundle of credits and spend them on generations. This model suits intermittent creators who need bursts of production.',
      'Subscription Tiers: For high-volume creators and agencies, subscription tiers with monthly generation quotas and team seats provide better predictability and lower per-thumbnail costs.',
      'Custom & Enterprise: Agencies and networks producing thousands of thumbnails monthly can negotiate enterprise arrangements with bulk pricing, SSO, and managed onboarding.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Common questions about how ThumblifyAI works, file formats, trials, and support are answered below.',
    paragraphs: [
      'What is ThumblifyAI? ThumblifyAI is an artificial intelligence tool focused on generating and editing thumbnails optimized for video platforms and social feeds.',
      'How does it work? The system combines prompt-based generative models with supervised personalization layers for faces and styles, plus editing tools that respect composition and lighting.',
      'Is there a free trial? Many creators platforms provide a free trial or free credit tier so new users can test outputs and quality. Check the product site for current trial offerings.',
      'What formats are supported? Standard outputs include PNG/JPEG in platform resolutions plus layered source files for designers in PSD or SVG formats depending on the export option.',
      'How do I manage billing and refunds? Billing is handled through the product checkout and relevant payment platform. Refund policies vary and are documented in the product terms of service.',
      'Can I use thumbnails on any platform? Yes—export presets ensure exported files meet common size and safe‑zone requirements for YouTube, TikTok, Instagram, and others.'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices — Thumbnail Strategies That Work',
    summary: 'Practical tips to get better performance from thumbnails generated with ThumblifyAI.',
    paragraphs: [
      'Prioritize Face & Expression: For personality-driven content, include a clear face with an expressive emotion. Faces attract attention and build connection.',
      'Use Short, Bold Text: Keep headline text concise and legible at small sizes. Use high contrast between text and background to maintain readability in search results.',
      'Test Multiple Hooks: Generate several variants and A/B test them to learn which emotional hooks convert best for your audience.',
      'Keep Branding Subtle: Use a consistent color accent and small logo mark rather than heavy branding. Viewers respond to clarity more than branding on discovery screens.',
      'Iterate Based on Data: Use click-through rates to guide creative choices—if a style consistently underperforms, either refine the prompt or adjust the visual grammar.'
    ]
  },
  {
    id: 'privacy-security',
    title: 'Privacy & Security — Respecting Creator Data',
    summary: 'Creator privacy is a priority: face training and style assets remain private and exportable on request.',
    paragraphs: [
      'Private Models: Trained face and style models are scoped to individual accounts and are not used to train public models. If you choose to delete your training data, the representations are revoked.',
      'Data Retention: Generated thumbnails and training datasets are retained according to the product\'s retention policy with options to export or delete on request.',
      'Ethical Use: The platform encourages ethical use of face models and requires consent for representing other people. For team workflows, account-level governance helps ensure responsible use.'
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started — From First Prompt to First Publish',
    summary: 'A simple onboarding path helps creators adopt the tool rapidly without being overwhelmed by options.',
    paragraphs: [
      'Sign Up & Try a Prompt: Create an account and try a short prompt that describes your next video. Use simple language and specify the emotion and headline you want.',
      'Train Your Face (Optional): Upload a handful of high-quality face photos in varied expressions to enable face-centric generations.',
      'Save Preferred Styles: If you like a set of generated thumbnails, save the style profile so future generations prefer that look.',
      'Export & Test: Export several variants and run an A/B test to measure performance. Use results to refine prompts and style preferences.'
    ]
  },
  {
    id: 'conclusion',
    title: 'Conclusion — Scale Creativity Without Losing Voice',
    summary: 'ThumblifyAI helps creators scale the production of high-performing thumbnails while preserving personal voice and brand consistency.',
    paragraphs: [
      'Generating effective thumbnails at scale used to be expensive and time-consuming. With targeted AI tools, creators can ideate, iterate, and publish more quickly while maintaining a distinct visual identity.',
      'The right workflow mixes automation with human taste: use ThumblifyAI to produce many strong candidates, pick the best, and refine it with lightweight edits. Over time this process lets creators learn which visuals drive the most engagement and apply those lessons across content series.',
      'If you produce video regularly and want to turn attention into action, investing in thumbnail quality is a multiplier. To accelerate organic reach for pages and products like this, consider registering with Backlink ∞ to build high-quality backlinks and drive referral traffic.'
    ]
  }
];

export default function ThumblifyAI() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/thumblify-ai`;
    } catch {
      return '/thumblify-ai';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    sections.forEach((s) => {
      parts.push(s.summary);
      s.paragraphs.forEach((p) => parts.push(p));
    });
    const words = parts.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'ThumblifyAI, thumbnails, AI thumbnails, thumbnail generator, face training, sketch to thumbnail');
    upsertCanonical(canonical);

    injectJSONLD('thumblify-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('thumblify-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'ThumblifyAI — AI Thumbnail Generator',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: sections.map((s) => s.title)
    });

    const faqSection = sections.find((s) => s.id === 'faqs');
    const faqItems = faqSection ? faqSection.paragraphs : [];
    injectJSONLD('thumblify-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((a) => ({ '@type': 'Question', name: a.split('?')[0].trim(), acceptedAnswer: { '@type': 'Answer', text: a } }))
    });
  }, [canonical]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-yellow-50 via-white to-pink-50 p-6 md:p-10">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-700">AI Thumbnail Generator</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">ThumblifyAI — Create Click‑Worth Thumbnails in Seconds</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Prompt-driven generation, face & style training, sketch workflows, and precise AI editing—everything creators need to consistently produce thumbnails that get clicked.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">In-depth guide to thumbnail creation, workflows, and best practices.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">AI-driven thumbnail strategies and practical tips.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">ThumblifyAI</p>
                <p className="mt-2 text-sm text-slate-600">AI thumbnails • face training • prompt generation</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="text-slate-700 hover:text-slate-900 hover:underline" href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#register">Register</a>
              </li>
            </ul>
          </aside>

          <article className="flex flex-col gap-10 pb-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-2 text-slate-700">{section.summary}</p>
                </header>
                <div className="prose max-w-none prose-slate">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="register" className="scroll-mt-24 rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-pink-50 p-6 shadow-sm md:p-8">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Boost Organic Reach</h2>
                <p className="mt-2 text-slate-700">If you want pages like this one to rank faster, backlinks from relevant and authoritative sites increase topical authority and drive referral traffic.</p>
              </header>
              <p className="text-lg text-slate-900">
                <a className="underline text-blue-700 hover:text-blue-800" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
