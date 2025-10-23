import React, { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, Shield } from "lucide-react";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import "@/styles/xrumer.css";

// Sections and expanded content — self-contained editorial material
const SECTIONS = [
  { key: "overview", title: "XRumer at a Glance" },
  { key: "history", title: "Origin and Evolution" },
  { key: "architecture", title: "Core Architecture (Conceptual)" },
  { key: "capabilities", title: "Reported Capabilities" },
  { key: "usage", title: "How It Was Used Historically" },
  { key: "seo_impact", title: "SEO Impact and Modern Relevance" },
  { key: "ethics", title: "Ethical Considerations" },
  { key: "detection", title: "Detection and Countermeasures" },
  { key: "alternatives", title: "Responsible Alternatives" },
  { key: "best_practices", title: "Modern Best Practices" },
  { key: "case_studies", title: "Case Studies and Lessons" },
  { key: "legal", title: "Legal Notes" },
  { key: "faq", title: "XRumer FAQs" },
  { key: "glossary", title: "Glossary" },
  { key: "resources", title: "Further Reading & Resources" },
];

const CONTENT: Record<string, string> = {
  overview: `XRumer is often referenced in security research and SEO retrospectives as a canonical example of mass automation tools that targeted forums, blogs, and other user-generated content surfaces. While the name often appears in contemporary writing, the broader phenomenon is what practitioners should understand: a class of tools designed to scale repetitive content insertion tasks across many targets.

This extended overview frames the issue across technical, operational, and ethical dimensions. First, the technical side: automation lowered the marginal cost of creating accounts and posting links, turning previously manual steps into repeatable pipelines. Second, the operational side: operators organized campaigns around lists of targets and templates, implicitly betting that sheer volume would produce useful ranking signals despite low per-placement quality. Third, the ethical side: these campaigns frequently externalized costs to site owners and moderators and degraded community conversations.

Importantly, our purpose here is education and defense. We do not provide instructions. Instead, we describe the observable patterns defenders and ethical SEO practitioners should monitor. The high-level lessons: focus on editorial relevance, measure outcomes beyond raw link counts, and design systems that make low-effort automation uneconomic for bad actors.`,

  history: `A multi-decade lens helps explain why automation was attractive and why it lost efficacy. In the early web era, user-generated content areas were often minimally protected, and links were a dominant signal in ranking algorithms. The combination of low friction and high incentive led to experimentation with automation.

By the mid-to-late 2000s, several shifts occurred. Platforms introduced captchas and moderation features; Google and others rolled out spam-fighting efforts and began to emphasize other engagement signals. The early winners from automated tactics often saw initial ranking movement, but the long-term consequences included link decay, removal, and reputational cost.

Analyzing the historical arc provides practical preventative measures: focus on reducing the attack surface for automated submissions, instrument for signals of coordination, and align incentives so that legitimate contributors are rewarded for quality rather than quantity.`,

  architecture: `The conceptual architecture of mass-posting tools provides guidance for defenders without instructing abuse. Observers typically describe four conceptual layers:

1) Discovery/Targeting — a crawler that identifies candidate pages (forms, profiles, comment endpoints) and collects structural hints about where submissions might succeed.
2) Templating/Content — a system that assembles messages from templates, optionally applying simple 'spinning' to create variants and reduce exact duplication.
3) Submission and interaction — the component that performs HTTP interactions, manages cookies and retries, and interprets responses to decide success or failure.
4) Operations — proxy pool management, scheduling, report aggregation, and basic anti-friction heuristics.

For defenders these layers imply several instrumentation points: capture request metadata at ingress, compute lightweight similarity fingerprints of content, and collect distribution metrics (how many distinct targets received similar content within short windows). These signals, combined with human review, make detection robust and precise.`,

  capabilities: `Reported capabilities of XRumer-style systems include automated account creation, bulk posting, profile population, templated link insertion, and operational supports like proxy rotation or integration with captcha-solving services. These capabilities were designed to maximize reach and minimize manual intervention.

Yet it's critical to distinguish capability from effectiveness. Links placed by automation lack the editorial vetting that makes an endorsement meaningful. Many sites mark user-generated links as nofollow or remove suspect posts. From an SEO perspective, the lasting value comes from editorial endorsement and user engagement — neither of which is reliably produced by automated placements.`,

  usage: `How operators historically used automation reveals common patterns and failure modes. Typical strategies included:

- Breadth-first campaigns that saturate many low-quality properties in hopes of accumulating signals.
- Narrow, topical campaigns that target communities related to a theme, attempting to capture some contextual relevance.
- Repetition and recovery tactics, where content is reposted after takedown or rotated across targets to persist placements.

Operationally, these choices reflect trade-offs: broad diffusion increases volume but reduces contextual relevance; niche targeting increases relevance but requires more effort and subject expertise. Defenders observed that the operational cost of constant remediation — moderator time, triage workflows, and engineering resources — often outweighed any short-term benefit for site operators. For ethical practitioners, the recommendation is clear: invest in editorial strategies and relationships that generate natural, high-quality placements.`,

  seo_impact: `When assessing SEO impact, consider relevance, engagement, and durability. Automated placements often fail across all three axes:

- Relevance: Links inserted without editorial context are unlikely to match user intent.
- Engagement: Low-quality placements attract little real interaction, signaling low user satisfaction.
- Durability: Platforms and moderators may remove or neutralize automated content, erasing short-term gains.

Search engines additionally deploy network and footprint analyses to detect coordinated manipulative activity. The sustainable path to authority is editorial quality — original research, practical utilities, and content that attracts citations and natural links. This section provides frameworks to audit link quality and prioritize outreach.`,

  ethics: `The ethical considerations are straightforward: mass-posting without consent externalizes costs to platform operators and degrades community spaces. Ethical SEO prioritizes reciprocity, transparency, and the creation of products or content that provides real user value.

Practically, ethical assessment should weigh who benefits and who pays the cost. Tactics that impose moderation burdens or degrade user experience should be rejected in favor of approaches that build long-term relationships and reputation.`,

  detection: `Detectors rely on statistical aggregation rather than single heuristics. Useful signals include:

- Similarity fingerprints across content samples.
- Temporal clustering of submissions across multiple accounts.
- Reuse of the same structural footprint (form field names, URL patterns).
- Network signals from IPs and user-agent anomalies.

Coupling these signals with human moderation — and establishing clear escalation paths — yields a practical defense. Tactical responses include progressive verification, throttling, and content staging where suspicious submissions are queued for review.`,

  alternatives: `Rather than relying on mechanical tactics, consider durable alternatives that produce compounding value:

- Research and original studies: publish unique data and insights that others cite.
- Tools and interactive experiences: build calculators, visualizations, or open datasets that others link to.
- Editorial partnerships: co-create content with publishers and influencers who provide contextual authority.
- Community contribution: authentically participate in communities and offer resources that benefit members.

Each of these alternatives requires investment but yields editorial links that carry lasting value and avoid the legal, ethical, and operational risks of mass automation.`,

  best_practices: `A defensible, modern approach to link building blends editorial excellence with technical rigor. Key practices:

- E-E-A-T focus: highlight author expertise, provide evidence, and maintain editorial standards.
- Technical care: performant pages, accessible markup, mobile optimization, and schema enhance discoverability and user experience.
- Governance: publishing policies, moderation workflows, and staged privileges for new accounts protect communities.
- Measurement: track referral quality, engagement, and conversion-focused KPIs rather than vanity backlink counts.

Regular audits and relationship-driven outreach outperform mechanical tactics in the long run.`,

  case_studies: `Anonymized case studies from public reports show a recurring arc: initial visibility gains from volume-based campaigns are often followed by detection and removal, sometimes accompanied by reputational damage. Conversely, initiatives that prioritized subject-matter depth and publisher relationships generated consistent referral traffic and long-term authority.

These case studies reinforce practical lessons: relevance beats volume; monitoring beats ignorance; relationships beat shortcuts.`,

  legal: `Legal exposure depends on conduct and jurisdiction. Violations of terms of service can result in suspension or removal; in extreme cases, unauthorized access or deceptive practices may trigger statutory liability. This section is informational and not legal advice — consult counsel for specific concerns.

The practical guidance is straightforward: prioritize permission, respect platform terms, and avoid tactics that externalize costs or deceive users.`,

  faq: `Q: Can automation be used ethically?\nA: Yes — for internal workflows like publishing pipelines, moderation tools, or scheduled content on owned properties. The problem is unauthorized or deceptive automation aimed at third-party sites.\n\nQ: How do I evaluate link quality?\nA: Look for editorial context, referral engagement, and persistence. Test for whether links drive users who engage or convert.\n\nQ: What immediate steps reduce abuse on my site?\nA: Implement rate-limiting, staged account privileges, captcha at thresholds, similarity detection, and clear moderation workflows for rapid remediation.`,

  glossary: `Algorithm: The combination of signals and statistical models used to rank content.\nFootprint: Repeating patterns across content or behavior that indicate coordination.\nEditorial Link: A link created by a curator or author because content provides value.\nNofollow: A link attribute that signals not to pass ranking credit.\nSimilarity Fingerprint: A compact summary used to detect near-duplicate content.`,

  resources: `Authoritative resources include search engine webmaster guidelines, papers on webspam and detection, moderation best-practice guides, and reputable SEO publications that emphasize ethics and defensible strategy. Recommended reading: Google Search Central documentation, academic literature on webspam detection, and modern practitioner write-ups that emphasize editorial quality.`,
};

export default function XRumerPage() {
  const title = "XRumer: Comprehensive, Ethical Analysis for Modern SEO";

  const ids = useMemo(() => SECTIONS.map((s) => s.key), []);
  const [active, setActive] = useState<string>(ids[0] || "overview");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { rootMargin: `-120px 0px -60% 0px`, threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  useEffect(() => {
    document.title = "XRumer: Comprehensive, Ethical Analysis for Modern SEO";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Comprehensive analysis and responsible recommendations regarding XRumer and automation in SEO.");
    document.head.appendChild(meta);

    const canonicalHref = window.location.origin + "/xrumer";
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    const existingScript = document.getElementById("xrumer-jsonld");
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "xrumer-jsonld";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "XRumer: Comprehensive, Ethical Analysis for Modern SEO",
        description: "Comprehensive analysis and responsible recommendations regarding XRumer and automation in SEO.",
        url: canonicalHref,
        author: { "@type": "Organization", name: "Backlinkoo" },
      });
      document.head.appendChild(script);
    }

    // Try to load generated content if present (public/xrumer.generated.json)
    (async () => {
      try {
        const res = await fetch('/xrumer.generated.json');
        if (res.ok) {
          const json = await res.json();
          Object.keys(json).forEach((k) => {
            if (k in CONTENT) CONTENT[k] = json[k];
          });
          console.log('Loaded generated XRumer content');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <div>
      <Seo title={title} description={description} canonical={typeof canonical !== 'undefined' ? canonical : undefined} />

      <Header />
      <div className="xrumer-page relative">
        <div className="xr-hero">
        <div className="container">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-sm">
              <BookOpen className="h-4 w-4" /> Expert SEO Analysis
            </div>
            <h1 className="xr-title">XRumer: Comprehensive, Ethical Analysis for Modern SEO</h1>
            <p className="xr-subtitle">A thorough, neutral examination of XRumer—the origins, reported capabilities, detection signals, risks, and modern alternatives focused on long-term authority and trust.</p>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 py-10">
        <aside className="hidden lg:block">
          <Card className="sticky top-24 xr-toc">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> On this page</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-3">
                {SECTIONS.map((s) => {
                  const excerpt = (CONTENT[s.key] || '').split('\n\n')[0].slice(0,120) + '...';
                  return (
                    <div key={s.key} className={`xr-toc-entry ${active === s.key ? 'active' : ''}`}>
                      <a href={`#${s.key}`} className="xr-toc-link font-medium">{s.title}</a>
                      <div className="text-xs text-muted-foreground mt-1">{excerpt}</div>
                    </div>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Ethical stance</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>We document XRumer for awareness and defense—never for abuse. Sustainable SEO is built on value, consent, and trust.</p>
              <p>Prefer durable tactics: editorial PR, partnerships, helpful content, and community contributions.</p>
            </CardContent>
          </Card>
        </aside>

        <main className="space-y-10">
          <div className="w-full">
            <div className="mb-4 text-muted-foreground">Guided exploration of XRumer and defensive practices. Use the table of contents on the left to navigate.</div>
            {SECTIONS.map((section) => (
              <article id={section.key} key={section.key} className="xr-section pt-6">
                <header className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="xr-h2">{section.title}</h2>
                </header>

                <div className="mt-4 grid gap-4">
                  <Accordion type="single" collapsible className="xr-accordion">
                    <AccordionItem value="summary">
                      <AccordionTrigger>Editorial Summary</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-slate max-w-none"><p>{CONTENT[section.key] || 'This section explores the topic in detail.'}</p></div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="details">
                      <AccordionTrigger>Detailed Discussion</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-slate max-w-none">{renderDetailedParagraphs(CONTENT[section.key])}</div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </article>
            ))}
          </div>

          <Card>
            <CardContent className="py-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Comprehensive coverage — curated for context, ethics and practical takeaways.</span>
              </div>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
      <Footer />
    </div>
  );
}

function renderDetailedParagraphs(text?: string) {
  const body = text || '';
  const paras = body.split('\n\n').map((p) => p.trim()).filter(Boolean);
  return <>{paras.map((p, i) => (<p key={i}>{p}</p>))}</>;
}
