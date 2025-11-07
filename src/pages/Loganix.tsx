import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BacklinkInfinityCTA } from '@/components/BacklinkInfinityCTA';
import '@/styles/loganix.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
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

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(json);
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

const metaTitle = 'Loganix Review: Pricing, Services, Link Building, Local SEO (2025)';
const metaDescription =
  'Independent Loganix review covering services, pricing references, link building quality, local citations, process, case studies, pros/cons, and alternatives.';

const paragraphsToWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

export default function Loganix() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const canonical = useMemo(() => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      return `${base}/loganix`;
    } catch {
      return '/loganix';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta(
      'keywords',
      'Loganix, Loganix review, Loganix pricing, Loganix services, Loganix citations, Loganix link building, local SEO citations, guest posts, niche edits, SEO agency'
    );
    upsertCanonical(canonical);

    // WebPage
    injectJSONLD('loganix-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en',
    });

    // Organization
    injectJSONLD('loganix-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Loganix',
      url: 'https://loganix.com/',
      sameAs: ['https://loganix.com/'],
      description:
        'Loganix is an SEO and digital marketing provider known for link building, local citations, and content-led growth services.',
    });

    // Review of Organization (no numeric rating to avoid misrepresentation)
    injectJSONLD('loganix-review', {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Organization',
        name: 'Loganix',
        url: 'https://loganix.com/',
      },
      reviewBody:
        'An in-depth editorial review of Loganix covering services, pricing references, methodology, case studies, ideal fit, risks, and alternatives based on public sources.',
      author: { '@type': 'Organization', name: 'Backlinkoo Editorial' },
      datePublished: new Date().toISOString().slice(0, 10),
    });

    // Breadcrumbs
    injectJSONLD('loganix-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Loganix Review', item: '/loganix' },
      ],
    });

    // FAQPage
    injectJSONLD('loganix-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does Loganix do?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Loganix provides link building, local SEO citation services, content production, digital PR, and related SEO solutions for businesses and agencies.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Loganix cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Public references show itemized services (e.g., citations packages, guest posts, and link options) and managed programs. Verify current pricing on loganix.com as offers change over time.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Loganix a good link-building provider?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'They are known for process-driven link acquisition and local citation fulfillment. Fit depends on goals, budget, vertical, and editorial standards you require. Review samples, QA criteria, and reports before committing.',
          },
        },
      ],
    });

    const onScroll = () => {
      const bar = document.querySelector('.loganix-progress__bar') as HTMLDivElement | null;
      const content = document.querySelector('#loganix-content') as HTMLElement | null;
      if (!bar || !content) return;
      const rect = content.getBoundingClientRect();
      const top = Math.max(0, -rect.top);
      const total = Math.max(1, content.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (top / total) * 100));
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [canonical]);

  const t = {
    en: {
      kicker: 'Independent Review',
      title: 'Loganix Review',
      subtitle:
        'A critical, research-driven deep dive into Loganix—services, pricing references, link-building methodology, local citations, case studies, risks, and best-fit scenarios.',
      onThisPage: 'On this page',
      ctas: { header: 'Ready to Build Quality Backlinks?', primary: 'Visit Loganix', secondary: 'Register for Backlink ∞' },
    },
    es: {
      kicker: 'Reseña Independiente',
      title: 'Reseña de Loganix',
      subtitle:
        'Un análisis profundo de Loganix: servicios, referencias de precios, metodología de link building, citaciones locales, estudios de caso, riesgos y mejores escenarios.',
      onThisPage: 'En esta página',
      ctas: { header: '¿Listo para crear backlinks de calidad?', primary: 'Visitar Loganix', secondary: 'Registrarse en Backlink ∞' },
    },
  } as const;

  const nav = [
    { id: 'intro', label: lang === 'en' ? 'Overview' : 'Introducción' },
    { id: 'media', label: lang === 'en' ? 'Media' : 'Medios' },
    { id: 'pricing', label: lang === 'en' ? 'Pricing' : 'Precios' },
    { id: 'services', label: lang === 'en' ? 'Services' : 'Servicios' },
    { id: 'backlinks', label: lang === 'en' ? 'Backlink Types' : 'Tipos de Backlinks' },
    { id: 'process', label: lang === 'en' ? 'Process' : 'Proceso' },
    { id: 'stories', label: lang === 'en' ? 'Stories' : 'Historias' },
    { id: 'cases', label: lang === 'en' ? 'Case Studies' : 'Casos de Estudio' },
    { id: 'fit', label: lang === 'en' ? 'Who It’s For' : 'Para Quién' },
    { id: 'proscons', label: lang === 'en' ? 'Pros & Cons' : 'Ventajas y Desventajas' },
    { id: 'risks', label: lang === 'en' ? 'Risk Playbook' : 'Riesgos' },
    { id: 'checklist', label: lang === 'en' ? 'Editorial Checklist' : 'Lista Editorial' },
    { id: 'alternatives', label: lang === 'en' ? 'Alternatives' : 'Alternativas' },
    { id: 'glossary', label: lang === 'en' ? 'Glossary' : 'Glosario' },
    { id: 'faq', label: 'FAQ' },
    { id: 'ctas', label: lang === 'en' ? 'Get Started' : 'Comenzar' },
  ];

  const sections: { id: string; html: string }[] = [
    {
      id: 'intro',
      html: `
        <h2>Loganix Review: Summary</h2>
        <p>
          This independent Loganix review synthesizes public information from <a href="https://loganix.com/" target="_blank" rel="nofollow noopener">loganix.com</a> and industry context to help you evaluate fit. Loganix is widely known for <strong>process-driven link acquisition</strong>, <strong>local SEO citations</strong>, and <strong>content-led outreach</strong>. Our goal is to document what they offer, how they work, and when their approach aligns with your goals.
        </p>
        <p>
          We examine <em>pricing references</em>, <em>service menu</em>, <em>editorial standards</em>, and <em>reporting practices</em> commonly associated with Loganix. Where possible, we connect claims to practical implications—what the process means for quality, timelines, and outcomes. We also include a <strong>risk playbook</strong>, <strong>pros & cons</strong>, and a pragmatic comparison to alternative providers so you can make a clear decision.
        </p>
        <p>
          If you value <strong>repeatable fulfillment</strong> and want <strong>clearly scoped deliverables</strong>—such as citations packages or itemized link options—Loganix positions itself as a fit. If you require <strong>bespoke digital PR</strong> at enterprise scale, evaluate their most advanced offers or consider hybrid approaches to ensure editorial quality matches your brand’s risk tolerance.
        </p>
      `,
    },
    {
      id: 'media',
      html: `
        <h2>Media Gallery: Videos & Images</h2>
        <p>Explore short videos and visuals illustrating SEO outreach, citation building, and analytics. All media below are royalty‑free stock for educational context.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="aspect-video overflow-hidden rounded-lg shadow">
            <video controls preload="metadata" class="w-full h-full object-cover" poster="https://images.pexels.com/photos/8060424/pexels-photo-8060424.jpeg">
              <source src="https://videos.pexels.com/video-files/7578620/7578620-sd_506_960_25fps.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="aspect-video overflow-hidden rounded-lg shadow">
            <video controls preload="metadata" class="w-full h-full object-cover" poster="https://images.pexels.com/photos/669616/pexels-photo-669616.jpeg">
              <source src="https://videos.pexels.com/video-files/7054949/7054949-sd_960_540_24fps.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <img class="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg" alt="SEO strategy session" />
          <img class="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg" alt="Analytics dashboard and reporting" />
          <img class="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg" alt="Team collaboration" />
          <img class="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/3779409/pexels-photo-3779409.jpeg" alt="Content planning" />
          <img class="rounded-md shadow-sm w-full h-56 object-cover" src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg" alt="Growth charts" />
        </div>
      `,
    },
    {
      id: 'pricing',
      html: `
        <h2>Loganix Pricing: What to Expect</h2>
        <p>
          Loganix is known for <strong>transparent, itemized services</strong> alongside managed engagements. Historically, you’ll find <em>citation packages</em> for local SEO, <em>guest post</em> and <em>niche edit</em> options for link acquisition, and <em>content creation</em> or <em>digital PR</em> add‑ons. Exact pricing changes over time—always verify current rates directly on <a href="https://loganix.com/" target="_blank" rel="nofollow noopener">loganix.com</a>.
        </p>
        <div class="loganix-cards">
          <div class="loganix-card" aria-label="Citations Pricing">
            <h3>Local SEO Citations — Package Based</h3>
            <ul>
              <li>Aggregator submissions and top directories</li>
              <li>NAP consistency and duplicate suppression options</li>
              <li>Spreadsheet reporting and login delivery (where supported)</li>
              <li>Suitable for businesses building local presence or cleaning existing listings</li>
            </ul>
          </div>
          <div class="loganix-card" aria-label="Link Building Pricing">
            <h3>Link Building — Itemized Options</h3>
            <ul>
              <li>Guest posts on vetted sites with contextual relevance</li>
              <li>Niche edits (contextual in‑content links)</li>
              <li>Tiered packages for DR/traffic ranges; editorial criteria vary by site</li>
              <li>Content writing included or available as an add‑on</li>
            </ul>
          </div>
        </div>
        <p class="text-muted">Note: Third‑party authority metrics (DR/DA) are directional. Prioritize topical fit, placement quality, and risk controls.</p>
      `,
    },
    {
      id: 'services',
      html: `
        <h2>Loganix Services</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <h3>Custom Outreach & Guest Posting</h3>
            <p>Editorial contributions on relevant sites. Focus on context, audience alignment, and avoiding patterns that signal transactional placement.</p>
          </div>
          <div>
            <h3>Niche Edits (Contextual Links)</h3>
            <p>In‑content placements on existing articles. Effective when sites are vetted for quality and link context genuinely adds value.</p>
          </div>
          <div>
            <h3>Local Citations</h3>
            <p>Aggregator submissions and curated directories to establish NAP consistency. Ideal for local businesses and franchises managing multi‑location data.</p>
          </div>
          <div>
            <h3>Content Production</h3>
            <p>Supporting articles and linkable assets crafted for outreach and on‑site authority. Emphasis on clarity, helpfulness, and editorial polish.</p>
          </div>
          <div>
            <h3>Digital PR (Selective)</h3>
            <p>Campaigns designed to earn attention through data stories, expert commentary, or unique angles. Expect longer timelines and stronger editorial standards.</p>
          </div>
          <div>
            <h3>SEO Support</h3>
            <p>On‑page recommendations, technical fixes, and site health improvements to compound link acquisition. Ensures links land on pages ready to rank.</p>
          </div>
        </div>
      `,
    },
    {
      id: 'backlinks',
      html: `
        <h2>Backlink Types and Editorial Criteria</h2>
        <p>
          Loganix emphasizes relevance and predictable fulfillment. To evaluate fit, request <strong>sample placements</strong>, <strong>editorial guidelines</strong>, and <strong>exclusion lists</strong>. Consider:
        </p>
        <ul>
          <li><strong>Guest Posts:</strong> New articles placed on relevant publications. Check whether the site has a genuine audience, consistent editorial standards, and meaningful internal linking.</li>
          <li><strong>Niche Edits:</strong> Links inserted into existing articles. Ensure context is natural, page is indexed, and site quality is stable.</li>
          <li><strong>Digital PR:</strong> Campaigns that earn links due to story value. Typically involves ideation, data analysis, outreach to journalists, and patience.</li>
          <li><strong>Resource Links:</strong> Inclusion in curated lists or guides when the asset is genuinely helpful to readers.</li>
        </ul>
        <p>
          Avoid over‑focusing on a single metric. Scrutinize <em>topical fit</em>, <em>placement quality</em>, <em>link attributes</em>, and the <em>business outcome</em> (traffic, assisted conversions, brand mentions).
        </p>
      `,
    },
    {
      id: 'process',
      html: `
        <h2>Process and Reporting</h2>
        <p>
          A strong fulfillment model pairs <strong>clear scoping</strong> with <strong>repeatable QA</strong>. Loganix is known for defined workflows—prospecting, vetting, outreach, content creation, placement, and reporting. Ask how they:
        </p>
        <ol class="loganix-list">
          <li>Source and qualify sites (traffic patterns, editorial integrity, topic match)</li>
          <li>Develop briefs and drafts (tone, originality, compliance)</li>
          <li>Secure placements (turnaround time, acceptance rates, link attributes)</li>
          <li>Handle revisions (when and how they renegotiate or replace)</li>
          <li>Report (placements, URLs, anchor text, publication dates, performance notes)</li>
        </ol>
        <p>
          For <em>citations</em>, look for clear <strong>aggregation strategy</strong>, <strong>duplicate suppression</strong>, and <strong>login delivery</strong> where possible. Clean local data is a compounding asset—ensure ongoing maintenance is planned.
        </p>
      `,
    },
    {
      id: 'stories',
      html: `
        <h2>Stories from the Field</h2>
        <p>
          Outreach‑driven SEO is a craft. Teams learn from thousands of interactions—what resonates with editors, how to angle a story, and which patterns to avoid. Loganix’s positioning suggests systematic learning baked into their process. The most durable outcomes usually come from content that <strong>improves the host publication</strong> and <strong>serves readers first</strong>.
        </p>
        <p>
          When reviewing examples, look for <em>reader value</em>, <em>topic alignment</em>, and <em>coherent internal linking</em> on the host site. Short‑term velocity is less useful than long‑term credibility.
        </p>
      `,
    },
    {
      id: 'cases',
      html: `
        <h2>Case Studies and Signals</h2>
        <div class="loganix-cards">
          <div class="loganix-card">
            <h3>Ecommerce Growth (Composite Example)</h3>
            <p>Launching seasonal content clusters and strategic outreach to publications read by the target demographic. Links support hub pages, which ladder into category pages via internal linking. Organic revenue grows as rankings stabilize for mid‑funnel queries.</p>
          </div>
          <div class="loganix-card">
            <h3>Local Services (Composite Example)</h3>
            <p>Comprehensive citations across aggregators and niche directories. Add regionally relevant guest posts that answer specific questions homeowners ask. Rankings improve for service + city terms, with GMB interactions increasing alongside brand searches.</p>
          </div>
        </div>
        <p class="text-muted">These composites illustrate patterns only. Always request live, verifiable examples and clarify what success looks like for your niche.</p>
      `,
    },
    {
      id: 'fit',
      html: `
        <h2>Ideal Fit and When to Reconsider</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="loganix-card">
            <h3>Best Fit</h3>
            <ul>
              <li>Brands seeking <strong>consistent fulfillment</strong> with scoped link and citation deliverables</li>
              <li>Local businesses needing <strong>NAP consistency</strong> and foundational links</li>
              <li>Agencies requiring <strong>white‑label link building</strong> with predictable turnaround</li>
              <li>Teams that value <strong>reporting and repeatability</strong> over ad‑hoc experimentation</li>
            </ul>
          </div>
          <div class="loganix-card">
            <h3>Reconsider or Customize</h3>
            <ul>
              <li>Enterprise brands pursuing <strong>flagship digital PR</strong> with national press</li>
              <li>Categories where compliance and brand tone demand <strong>bespoke editorial</strong></li>
              <li>Hyper‑competitive niches needing <strong>cross‑channel media orchestration</strong></li>
              <li>Situations requiring <strong>owned research</strong> and highly differentiated assets</li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: 'proscons',
      html: `
        <h2>Pros and Cons</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="loganix-card">
            <h3>Pros</h3>
            <ul>
              <li>Itemized services and clear scoping</li>
              <li>Specialization in <strong>citations</strong> and <strong>repeatable outreach</strong></li>
              <li>Process discipline and predictable timeline expectations</li>
              <li>Useful for agencies needing white‑label fulfillment</li>
            </ul>
          </div>
          <div class="loganix-card">
            <h3>Cons</h3>
            <ul>
              <li>Editorial ceiling compared to premium digital PR boutiques</li>
              <li>Quality varies by publisher—vet samples and update frequency</li>
              <li>Over‑reliance on third‑party metrics can mislead; focus on <em>fit</em> and <em>business outcomes</em></li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: 'risks',
      html: `
        <h2>Risk Playbook</h2>
        <p>Any link acquisition carries risk. Practical guardrails:</p>
        <ol class="loganix-list">
          <li><strong>Vetting:</strong> Favor publications with editorial substance, stable traffic, and authentic reader engagement.</li>
          <li><strong>Distribution:</strong> Diversify anchors, landing pages, and referring domains to avoid footprints.</li>
          <li><strong>Relevance:</strong> Map links to content that solves real problems for your audience.</li>
          <li><strong>Documentation:</strong> Maintain a ledger of placements with status, anchors, and notes for future audits.</li>
          <li><strong>Measurement:</strong> Track rankings, assisted conversions, and brand queries—not just link counts.</li>
        </ol>
      `,
    },
    {
      id: 'checklist',
      html: `
        <h2>Editorial Checklist for Placements</h2>
        <ul>
          <li>Topic genuinely useful for the host’s audience</li>
          <li>Originality, clear thesis, and readable structure</li>
          <li>Evidence: examples, mini‑case notes, or practitioner quotes</li>
          <li>Natural link context; avoid abrupt keyword drops</li>
          <li>Internal links on host page that support discovery</li>
          <li>Reasonable author attribution and site recency</li>
        </ul>
      `,
    },
    {
      id: 'alternatives',
      html: `
        <h2>Alternatives and Comparisons</h2>
        <div class="loganix-table__wrap">
          <table class="loganix-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Strengths</th>
                <th>Consider When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Page One Power</td>
                <td>Editorial outreach, relevance‑first strategy</td>
                <td>Need bespoke, research‑heavy placements</td>
              </tr>
              <tr>
                <td>Siege Media</td>
                <td>Design‑forward content and digital PR</td>
                <td>Investing in linkable assets and media hits</td>
              </tr>
              <tr>
                <td>FatJoe</td>
                <td>Scaled fulfillment and packaged offers</td>
                <td>Require predictable logistics at pace</td>
              </tr>
              <tr>
                <td>Authority Builders</td>
                <td>Marketplace model with granular filters</td>
                <td>Want control over domain‑level selection</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-muted">Compare editorial standards, sourcing methods, replacement policies, and reporting depth—not just price.</p>
      `,
    },
    {
      id: 'glossary',
      html: `
        <h2>Glossary</h2>
        <ul>
          <li><strong>NAP:</strong> Name, Address, Phone—must be consistent in local listings.</li>
          <li><strong>Guest Post:</strong> Contributed article with contextual brand mention or link.</li>
          <li><strong>Niche Edit:</strong> Link inserted into an existing relevant article.</li>
          <li><strong>Aggregator:</strong> Data partner distributing business info to directories/maps.</li>
          <li><strong>E‑E‑A‑T:</strong> Experience, Expertise, Authoritativeness, and Trustworthiness, used to evaluate quality.</li>
        </ul>
      `,
    },
    {
      id: 'faq',
      html: `
        <h2>Frequently Asked Questions</h2>
        <h3>Does Loganix guarantee rankings?</h3>
        <p>No credible provider can guarantee rankings. Focus on fit, editorial quality, and how links support a sound SEO strategy.</p>
        <h3>How long until I see results?</h3>
        <p>For local citations, data propagation can take weeks. For link‑driven content, compounding growth often manifests over 3–6 months depending on competition and content quality.</p>
        <h3>Can I choose sites?</h3>
        <p>With marketplace‑style options you may filter by metrics and categories. For managed outreach, expect alignment on criteria rather than domain‑by‑domain selection.</p>
      `,
    },
    {
      id: 'ctas',
      html: `
        <div class="loganix-ctas" aria-label="Calls to action">
          <div class="loganix-ctas__inner">
            <div class="loganix-ctas__title">${t[lang].ctas.header}</div>
            <div class="loganix-ctas__row">
              <a class="loganix-cta" href="https://loganix.com/" target="_blank" rel="nofollow noopener">${t[lang].ctas.primary}</a>
              <a class="loganix-cta loganix-cta--ghost" href="/login" rel="nofollow">${t[lang].ctas.secondary}</a>
              <a class="loganix-cta loganix-cta--accent" href="/">Explore SEO Blog</a>
            </div>
          </div>
        </div>
      `,
    },
  ];

  const wordCount = useMemo(() => {
    const textOnly = sections.map((s) => s.html.replace(/<[^>]+>/g, ' ')).join(' ');
    return paragraphsToWords(textOnly);
  }, [sections]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="loganix-progress">
        <div className="loganix-progress__bar" />
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <header className="loganix-hero" aria-labelledby="page-title">
          <div className="loganix-lang">
            <button
              className={`loganix-lang__btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >EN</button>
            <button
              className={`loganix-lang__btn ${lang === 'es' ? 'active' : ''}`}
              onClick={() => setLang('es')}
              aria-pressed={lang === 'es'}
            >ES</button>
          </div>
          <p className="loganix-kicker">{t[lang].kicker}</p>
          <h1 id="page-title" className="loganix-title">{t[lang].title}</h1>
          <p className="loganix-subtitle">{t[lang].subtitle}</p>
          <div className="loganix-hero__meta">
            <span>Updated</span>
            <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString()}</time>
            <span>Author: Editorial Team</span>
            <span>Words: ~{wordCount.toLocaleString()}</span>
          </div>
        </header>

        <div className="loganix-layout">
          <nav className="loganix-toc" aria-label="Table of contents">
            <div className="loganix-toc__title">{t[lang].onThisPage}</div>
            <ul>
              {nav.map((n) => (
                <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
              ))}
            </ul>
          </nav>

          <article id="loganix-content" className="loganix-article" itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content={metaTitle} />
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="loganix-section" dangerouslySetInnerHTML={{ __html: s.html }} />
            ))}
          </article>
          <section className="mt-12">
            <BacklinkInfinityCTA
              title="Ready to Execute Your Link Building Strategy?"
              description="Backlink ∞ is the #1 leading search engine optimization agency and top-selling backlinks provider with guaranteed results for even the most competitive keywords across the globe. We offer unbeatable, competitive rates and expertise beyond imagination. Double guaranteed results—double the amount of links you purchase across campaigns. Access leading SEO tools for Premium Plan members and benefit from comprehensive support."
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
