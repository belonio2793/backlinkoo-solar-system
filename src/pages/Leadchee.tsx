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

const metaTitle = 'Leadchee — Smart CRM for Startups: Auto Leads, AI Insights, Calls & Proposals';
const metaDescription = 'Leadchee is a lightweight CRM built for small teams and startups. Automatically capture leads from email, prioritize with AI, manage pipelines, call customers, and generate proposals — simple, fast, and effective.';

export default function LeadcheePage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/leadchee`;
    } catch {
      return '/leadchee';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Leadchee, CRM, automatic lead capture, AI insights, sales pipeline, proposals, calling');
    upsertCanonical(canonical);

    injectJSONLD('leadchee-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('leadchee-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('leadchee-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Leadchee?', acceptedAnswer: { '@type': 'Answer', text: 'Leadchee is a CRM focused on small teams and startups that automatically captures leads from email, adds AI-powered insights, and streamlines sales tasks like calling and proposal generation.' } },
        { '@type': 'Question', name: 'How does automatic lead capture work?', acceptedAnswer: { '@type': 'Answer', text: 'Leadchee integrates with email providers and parses incoming messages to create leads automatically; AI tags intent and suggests follow-up actions so your team doesn’t miss opportunities.' } },
        { '@type': 'Question', name: 'Can I make calls from Leadchee?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Leadchee includes built-in calling features with call logging and recordings to centralize communication and simplify follow-ups.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Leadchee — The Modern CRM for Small Teams and Startups</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Capture leads automatically, prioritize with AI, run calls, and generate proposals — all inside a straightforward CRM designed for founders, freelancers, and growing teams.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Auto Lead Capture</Badge>
            <Badge className="bg-slate-100 text-slate-800">AI Insights</Badge>
            <Badge className="bg-slate-100 text-slate-800">Proposals & Calls</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Leadchee?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Recommended workflow</a>
                  <a href="#pricing" className="block text-blue-700">Pricing</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Leadchee simplifies sales for small teams by converting emails into qualified leads, applying AI-driven tags and priorities, and providing integrated calling and proposal tools to close deals faster.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Leadchee?</h2>
              <p>Leadchee is a focused CRM built for teams that want the essentials to work well. It emphasizes automatic lead capture from email, AI-based lead scoring and tagging, and a frictionless interface for managing pipelines, making calls, and sending proposals. The product targets startups, freelancers, consultants, and small sales teams who value speed, clarity, and measurable results.</p>

              <p>Rather than offering an overloaded feature set, Leadchee aims to streamline the sales motions that matter most to small teams. By automating repetitive data entry and highlighting high-intent interactions, it frees founders and reps to focus on human conversations and closing deals.</p>

              <p>Leadchee's design philosophy centers on being lightweight yet powerful: it integrates essential tools (email, telephony, proposals) in a single place, preserves a clean UX, and uses AI where it reduces friction — for example, by suggesting reply templates or identifying messages that indicate pricing interest.</p>
            </section>

            <section id="features">
              <h2>Core Features — What Makes Leadchee Useful</h2>

              <h3>Automatic Lead Capture from Email</h3>
              <p>One of Leadchee’s standout features is its ability to create leads automatically from incoming emails. Connect your mailbox and let Leadchee parse contact information, extract subject matter, and populate lead cards without manual input. This drastically reduces friction and helps teams respond faster.</p>

              <h3>AI-Powered Insights & Intent Tags</h3>
              <p>Leadchee employs lightweight AI to surface intent signals in incoming messages. Tags such as "Interested in pricing", "Feature question", or "Partnership opportunity" help prioritize follow-ups. These insights are exposed next to each lead to guide action and reduce guesswork.</p>

              <h3>Customizable Pipelines & Kanban Boards</h3>
              <p>Visual pipelines let teams track deals with drag-and-drop simplicity. Each board can be tailored with custom stages, automations, and shared with stakeholders so progress is transparent.</p>

              <h2>Built-in Calling & Call Logging</h2>
              <p>Leadchee includes integrated calling with call recording and automatic logging. Make international calls from the platform, view a call history on each lead, and attach notes to preserve conversational context.</p>

              <h3>Proposal Generation & Tracking</h3>
              <p>Create professional proposals quickly with templates, attach pricing, and send tracked documents to prospects. Leadchee shows proposal views and acceptance status so teams can follow up at the right moment.</p>

              <h3>Contact & Company Management</h3>
              <p>Maintain a centralized view of people and companies, with relationship histories, roles, and communication timelines. This is essential for teams managing multiple stakeholders per deal.</p>

              <h3>Integrations & Exports</h3>
              <p>Sync contacts with popular tools, export CSVs for reporting, and connect to Zapier or webhooks to automate downstream workflows like invoicing or marketing automation.</p>

              <h2>Simple Pricing & Transparent Limits</h2>
              <p>Leadchee favors straightforward pricing models — typically a flat per-user price with generous features included to avoid surprises for scaling teams.</p>
            </section>

            <section id="how-it-works">
              <h2>How Leadchee Works — From Email to Closed Deal</h2>

              <p>Leadchee stitches together a number of small automations into a coherent workflow that minimizes manual steps. A typical lifecycle might look like:</p>
              <ol>
                <li><strong>Inbox connection:</strong> Connect your Gmail or email provider using secure OAuth. Leadchee monitors incoming messages for contact info and creates lead cards automatically.</li>
                <li><strong>AI analysis:</strong> Messages are analyzed for intent, urgency, and topic. AI-generated tags and suggested next actions are added to the lead view.</li>
                <li><strong>Qualification:</strong> The team uses the pipeline to qualify leads, dragging cards across stages like "Contacted", "Qualified", "Proposal", and "Closed".</li>
                <li><strong>Outreach:</strong> Use call features, email templates, or proposal tools to engage. All interactions are logged to the lead timeline.</li>
                <li><strong>Close & onboard:</strong> After proposal acceptance, transition the lead to a customer record, export necessary info for billing, and hand off to operations.</li>
              </ol>

              <p>The system is intentionally opinionated: it automates the common steps and keeps advanced customizations optional, so teams stay focused on driving revenue rather than configuring complex rules.</p>
            </section>

            <section id="use-cases">
              <h2>Primary Use Cases & Who Should Consider Leadchee</h2>

              <h3>Founders & Solo Sellers</h3>
              <p>Founders who handle customer conversations personally benefit from Leadchee’s auto-capture and AI prioritization. It reduces administrative overhead and helps founders focus on high-value conversations.</p>

              <h3>Consultants & Freelancers</h3>
              <p>Consultants who respond to inbound inquiries can centralize leads, send proposals, and keep track of follow-ups without juggling spreadsheets and multiple apps.</p>

              <h3>Seed-Stage Sales Teams</h3>
              <p>Early-stage sales teams that need structure without bloat find Leadchee’s pipelines and proposal tools helpful for establishing repeatable processes quickly.</p>

              <h2>Customer Success & Account Management</h2>
              <p>Leadchee’s contact timelines and call logs provide a concise history for CSMs to manage renewals and upsells, ensuring no context is lost between handoffs.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: Best Practices to Get Value Fast</h2>

              <p>To get the most out of Leadchee, follow a focused onboarding and workflow that balances automation and human oversight:</p>
              <ol>
                <li><strong>Start small:</strong> Connect one or two inboxes and import recent threads so Leadchee can seed your account with historical context.</li>
                <li><strong>Define a lightweight qualification rubric:</strong> Use simple lead attributes (fit, budget, timeframe) to score leads and train your team on consistent stage movement.</li>
                <li><strong>Use templates for common responses:</strong> Save time and ensure consistent messaging by using answer templates for pricing and discovery questions.</li>
                <li><strong>Log calls and notes:</strong> Make call notes a habit — the timeline is where knowledge accumulates and helps future reps pick up conversations.</li>
                <li><strong>Track proposals and follow-ups:</strong> Use proposal view metrics to prioritize outreach; if a prospect viewed a proposal multiple times, follow up quickly with additional context.</li>
                <li><strong>Measure the process:</strong> Report on conversion rates per stage, average time to first contact, and proposal-to-close ratios to optimize the funnel.</li>
              </ol>

              <p>These practices help teams extract predictable improvements in response time and conversion without adding unnecessary complexity.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Extensibility</h2>

              <p>Leadchee is most effective when it fits into your existing toolchain. Common integration patterns include:</p>
              <ul>
                <li><strong>Email:</strong> Gmail/Google Workspace and IMAP providers for automatic capture.</li>
                <li><strong>Calendars:</strong> Sync with calendar providers to schedule meetings directly from lead cards.</li>
                <li><strong>Payment & invoicing:</strong> Connect invoicing tools post-contract to automate billing handoffs.</li>
                <li><strong>Marketing & automation:</strong> Use Zapier or webhooks to push leads into marketing sequences or record events in analytics platforms.</li>
                <li><strong>Storage & reporting:</strong> Export reports to Google Sheets or BI tools for deeper analysis.</li>
              </ul>
            </section>

            <section id="pricing">
              <h2>Pricing & Value</h2>

              <p>Leadchee typically positions itself as a single-price-per-user product that includes the core features needed by small teams. A transparent pricing model reduces friction when scaling and avoids surprise charges for features like call minutes or proposal templates.</p>

              <p>When evaluating pricing, focus on these value metrics:</p>
              <ul>
                <li>Time saved from automated lead capture vs manual entry.</li>
                <li>Revenue increase from faster response times and prioritized outreach.</li>
                <li>Reduced tool sprawl by consolidating calls, proposals, and lead management in one place.</li>
              </ul>

              <p>Many teams recover the cost of a CRM through a single closed deal that would otherwise have been missed due to slow follow-up.</p>
            </section>

            <section id="case-studies">
              <h2>Customer Stories & Examples</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Solo Consultant — From Inbox to Signed Client</CardTitle>
                </CardHeader>
                <CardContent>
                  "A consultant hooked Leadchee to their inbox and saw a 30% reduction in time-to-first-response. Auto-created leads helped prioritize inquiries, and proposal tracking made follow-ups more effective." — Independent Consultant
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Seed-Stage Startup — Structured Sales Without Overhead</CardTitle>
                </CardHeader>
                <CardContent>
                  "We standardized our early sales motions with Leadchee. The pipeline and AI tags made it obvious which conversations to prioritize, and the team could operate without a full-time salesperson." — Head of Growth
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Agency — Faster Proposal Turnaround</CardTitle>
                </CardHeader>
                <CardContent>
                  "Generating and sending proposals directly from Leadchee reduced administrative steps. We tracked opens and followed up at the right moment, increasing win rates on proposals." — Agency Owner
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>What Users Are Saying</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Leadchee captured leads from our support inbox and turned what used to be noise into opportunities — the AI tags were a game-changer." — Customer Success Lead</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"We replaced three separate tools with Leadchee and regained hours each week that went back into selling." — Founder</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The proposal templates are simple but highly effective — our clients appreciated the clarity and we closed faster as a result." — Consultant</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Consider Alternatives</h2>

              <p>No tool is perfect for every team. Consider these limitations when evaluating Leadchee:</p>
              <ul>
                <li><strong>Highly complex sales stacks:</strong> Enterprises with multi-touch enterprise sales processes and custom integrations may outgrow a lightweight CRM and require more customizable platforms.</li>
                <li><strong>Heavily automated marketing funnels:</strong> If your business relies on complex marketing automation, you may need deeper native integrations than a small CRM provides.</li>
                <li><strong>Data residency & compliance:</strong> For regulated industries, review data residency and compliance features carefully before adopting any cloud CRM.</li>
              </ul>

              <p>For many small teams, however, the tradeoff of simplicity and speed outweighs the advanced feature sets of larger platforms.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices to Improve Sales Outcomes</h2>
              <ol>
                <li>Respond quickly to inbound messages — aim for under 1 business day for the first reply.</li>
                <li>Use AI tags as prompts, not final decisions — review and refine tags where needed.</li>
                <li>Standardize proposal templates — clear pricing and timelines reduce friction in decision-making.</li>
                <li>Keep pipelines lean — fewer stages improve clarity and reduce administrative overhead.</li>
                <li>Monitor conversion metrics and iterate — small adjustments to outreach and proposal language compound over time.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">How quickly can I get Leadchee set up?</summary><p className="mt-2">Most teams can connect an inbox and start capturing leads within minutes. Full team onboarding, including importing historical threads and configuring templates, usually takes a few hours.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does Leadchee include calling credits?</summary><p className="mt-2">Calling features may include pay-as-you-go minutes or bundled credits depending on the plan. Review pricing details for current calling rates and included minutes.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can I export my data?</summary><p className="mt-2">Yes — Leadchee supports CSV export and integrations to pull contact and deal data into other systems for reporting or archival purposes.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is AI used to write email replies?</summary><p className="mt-2">Leadchee often offers AI-suggested reply templates to speed responses. These are editable and meant to help craft thoughtful, personalized replies faster.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Grow Traffic & Visibility for Your Business</h2>
              <p>After you start converting more leads and closing deals with Leadchee, the next challenge is scaling awareness. Backlink ∞ helps businesses build the backlinks and SEO authority needed to attract more organic inquiries and fill the top of your pipeline.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Leadchee demonstrates that CRM can be effective without being complicated. By automating low-value tasks like data entry and surfacing AI-driven insights, small teams can spend more time in conversations that matter. Choose tools that reduce administrative burden and fit your growth stage — for many startups, a focused, fast CRM offers the best return on time invested.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
