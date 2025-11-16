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

const metaTitle = 'Plural — Collaborative Knowledge & Team Playbooks: Organize, Share, Execute';
const metaDescription = 'Plural helps teams centralize knowledge, run playbooks, and coordinate work. Learn about features, workflows, integrations, and best practices for making team knowledge actionable and discoverable.';

export default function PluralPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/plural`;
    } catch {
      return '/plural';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Plural, team knowledge, playbooks, runbooks, knowledge base, collaboration, operational playbooks');
    upsertCanonical(canonical);

    injectJSONLD('plural-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('plural-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('plural-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Plural?', acceptedAnswer: { '@type': 'Answer', text: 'Plural is a platform for team knowledge and operational playbooks that helps organizations capture how work gets done, share repeatable processes, and run coordinated operations.' } },
        { '@type': 'Question', name: 'How can teams use Plural?', acceptedAnswer: { '@type': 'Answer', text: 'Teams use Plural to document runbooks, incident procedures, onboarding flows, and marketing playbooks �� turning tribal knowledge into searchable, actionable documents.' } },
        { '@type': 'Question', name: 'Does Plural integrate with other tools?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Plural typically connects with chat platforms, ticketing systems, and cloud storage so playbooks can trigger actions and be kept in sync with operational tools.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Plural — Make Team Knowledge Actionable with Playbooks</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Plural focuses on operational clarity: capture repeatable processes, create playbooks for common scenarios, and enable teams to run work reliably with fewer errors. This page covers use cases, features, workflows, measurement, and tips for adoption.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Playbooks</Badge>
            <Badge className="bg-slate-100 text-slate-800">Runbooks</Badge>
            <Badge className="bg-slate-100 text-slate-800">Team Knowledge</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Plural?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Recommended workflow</a>
                  <a href="#integrations" className="block text-blue-700">Integrations</a>
                  <a href="#metrics" className="block text-blue-700">Metrics & ROI</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Plural lets teams capture and run playbooks—documented sequences of actions for common operational scenarios. The goal is faster onboarding, lower incident resolution time, and repeatable outcomes across functions.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Plural?</h2>

              <p>Plural is a knowledge-first platform that treats operational procedures as first-class products. Instead of a static wiki, Plural emphasizes runnable playbooks—documents that not only describe how to do work but provide the steps, checklists, and integrations to execute them reliably.</p>

              <p>Where traditional documentation is passive, Plural's playbooks are active: they guide users through steps during incidents, onboarding, or campaigns, and can integrate with alerts and tools to surface the right runbook when needed.</p>
            </section>

            <section id="features">
              <h2>Core Features & Capabilities</h2>

              <h3>Runnable Playbooks</h3>
              <p>Playbooks in Plural are more than text: they contain steps, decision trees, and checklists that a user can follow interactively. Each step can include commands, links, or embedded checks to validate progress.</p>

              <h3>Templates & Libraries</h3>
              <p>Start with templates for common scenarios—incident response, customer onboarding, content launches—and adapt them to your org. Libraries help teams maintain consistent standards across similar processes.</p>

              <h3>Searchable Knowledge Graph</h3>
              <p>Content is indexed for fast retrieval. Teams can surface playbooks by intent ("how to</p>
  <p> reset a DB"), by alert type, or by role to minimize time spent searching for answers.</p>

              <h3>Integrations & Automations</h3>
              <p>Connect playbooks to monitoring, chat, ticketing, and CI/CD systems so steps can trigger actions or pre-populate fields. Automations reduce manual work and keep the playbook context in sync with systems of record.</p>

              <h3>Role-Based Access & Versioning</h3>
              <p>Manage who can run, edit, or publish playbooks. Version history ensures you can roll back to a prior iteration and track changes over time.</p>

              <h3>Embedded Checklists & Run Metrics</h3>
              <p>Capture completion data—who ran a playbook, how long it took, and which</p>
  <p> steps were skipped. This data powers retrospectives and continuous improvement.</p>

              <h3>Onboarding & Learning Paths</h3>
              <p>Use playbooks as interactive onboarding guides: new hires can follow playbooks</p>
  <p> to learn tasks with embedded quizzes and checkpoints to validate understanding.</p>
            </section>

            <section id="use-cases">
              <h3>Who Uses Plural: Primary Use Cases</h3>

              <h3>Incident Response</h3>
              <p>Operations teams keep runbooks for common failure modes—database incidents, server outages, or degraded services. Runnable steps and integrations with alerting systems speed resolution and reduce toil.</p>

              <h3>Customer Onboarding & Support</h3>
              <p>Support and success teams use playbooks to standardize onboarding sequences,</p>
  <p> troubleshoot common issues, and escalate consistent handoffs to engineering.</p>

              <h3>Product Launches & Campaigns</h3>
              <p>Marketing and product teams coordinate launches with playbooks that list</p>
  <p> publication tasks, verification checks, and contingency plans for launch-day issues.</p>

              <h3>Security & Compliance</h3>
              <p>Security incident workflows and audit procedures benefit from immutable</p>
  <p> playbooks that record who executed which steps and when for compliance evidence.</p>

              <h3>Remote & Distributed Teams</h3>
              <p>For distributed teams, runnable playbooks reduce synchronous coordination and make critical processes discoverable across time zones.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: Create, Validate, and Run</h2>

              <p>Adopting Plural works best as an iterative practice: start with critical processes, validate through drills, and expand to lower-risk areas.</p>

              <ol>
                <li><strong>Identify critical knowledge:</strong> Map the processes that are high-impact or frequently repeated—start there.</li>
                <li><strong>Create a runnable playbook:</strong> Convert a checklist into steps with clear acceptance criteria and any necessary commands or links.</li>
                <li><strong>Run a drill:</strong> Test the playbook in a controlled setting; gather feedback and correct gaps.</li>
                <li><strong>Automate where possible:</strong> Connect verification steps to monitoring or APIs to reduce manual checks.</li>
                <li><strong>Measure outcomes:</strong> Track time-to-resolution, onboarding time, and task completion rates to assess ROI.</li>
                <li><strong>Iterate:</strong> Use run metrics and retrospectives to continuously improve playbooks.</li>
              </ol>

              <p>This cycle builds institutional knowledge and reduces single points of failure across teams.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Platform Ecosystem</h2>

              <p>Plural is most effective when it sits at the center of a team's toolchain. Typical integrations include:</p>
              <ul>
                <li><strong>Monitoring & Alerts:</strong> PagerDuty, Datadog, Prometheus to trigger runbooks on alerts.</li>
                <li><strong>Chat & Collaboration:</strong> Slack, Microsoft Teams for notifications and step-by-step guidance inside conversations.</li>
                <li><strong>Ticketing & Issue Trackers:</strong> Jira, Zendesk, Linear for creating and linking tickets from playbooks.</li>
                <li><strong>Storage & Docs:</strong> Google Drive, Notion, Confluence for referencing artifacts and linking contextual documentation.
                </li>
                <li><strong>CI/CD & Automation:</strong> GitHub Actions, GitLab pipelines for running automated checks as steps in a playbook.</li>
              </ul>
            </section>

            <section id="metrics">
              <h3>Measuring Impact: KPIs & ROI</h3>

              <p>To quantify the value of Plural, focus on outcomes tied to speed, reliability, and knowledge transfer:</p>
              <ul>
                <li><strong>Mean Time To Resolution (MTTR):</strong> A primary metric for incident playbooks—reduction indicates faster problem solving.</li>
                <li><strong>Time-to-onboard:</strong> How quickly new hires can perform core tasks using onboarding playbooks.</li>
                <li><strong>Playbook run rate:</strong> Frequency of playbook use—high-run playbooks often correlate with high-impact processes.</li>
                <li><strong>Error rates:</strong> Number of post-action errors or rollbacks after following playbooks—lower is better.</li>
                <li><strong>Coverage:</strong> Percentage of critical processes that have runnable playbooks—coverage shows institutionalization of knowledge.</li>
              </ul>

              <p>Collecting these metrics requires instrumentation and tagging of playbook runs,</p>
  <p> but the resulting insights help justify investment and prioritize playbook creation.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Examples</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Operations Team — Faster Incident Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  "A company implemented runnable runbooks for their common outages and reduced MTTR by 35%. The playbook steps included automated checks and pre-approved escalation paths." — Site Reliability Lead
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Customer Success — Consistent Onboarding</CardTitle>
                </CardHeader>
                <CardContent>
                  "CS teams standardized onboarding playbooks to ensure every customer received the same high-quality experience, lowering churn during the first 90 days." — Head of Customer Success
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Marketing — Repeatable Launch Process</CardTitle>
                </CardHeader>
                <CardContent>
                  "A marketing team used playbooks to coordinate campaign launches across channels, keeping creative assets and timelines aligned and reducing last-minute errors." — Marketing Operations
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>What Practitioners Say</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Runnable playbooks made us far less dependent on individual memory — we now have a single source of truth for critical tasks." — Director of Engineering</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"New hires can now complete core tasks with confidence after following playbooks—onboarding time dropped significantly." — VP People
</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The integration with our alerting system means the right playbook surfaces the moment an incident is detected." — SRE Manager</blockquote>
            </section>

            <section id="limitations">
              <h3>Limitations & When to Use Caution</h3>

              <p>While playbooks are powerful, they are not a silver bullet. Consider these limitations:</p>
              <ul>
                <li><strong>Maintenance overhead:</strong> Playbooks require regular updates as systems and procedures change—stale runbooks can cause more harm than help.</li>
                <li><strong>Complex, subjective tasks:</strong> Playbooks are best for repeatable processes; creative or highly ambiguous tasks may not benefit as much.</li>
                <li><strong>Over-reliance:</strong> Teams should avoid blind trust in automation and retain human judgment for exceptions and edge cases.</li>
              </ul>

              <p>Invest in governance: assign owners for playbooks, schedule reviews, and track runbook health as part of process improvement.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Building Effective Playbooks</h2>
              <ol>
                <li>Start with the high-impact processes and focus on clarity over completeness.</li>
                <li>Embed checks and links to observability tools to validate state quickly.</li>
                <li>Include decision gates and escalation paths for ambiguous outcomes.</li>
                <li>Make authorship and ownership explicit so playbooks have clear maintainers.</li>
                <li>Run regular drills and update playbooks based on feedback and outcomes.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Can playbooks be automated?</summary><p className="mt-2">Yes — many playbooks include automated steps that run scripts, checks, or integrations. However, human verification for critical steps is recommended.</p></details>

              <details className="mb-3"><summary className="font-semibold">How often should playbooks be reviewed?</summary><p className="mt-2">Review cadence depends on change velocity—high-change systems may need monthly reviews, while stable processes can be quarterly.</p></details>

              <details className="mb-3"><summary className="font-semibold">Who should own playbooks?</summary><p className="mt-2">Playbooks should have clear owners—teams or individuals responsible for maintaining accuracy and running periodic drills.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h3>Get More Visibility for Your Playbooks & Services</h3>
              <p>If your team publishes valuable playbooks, guides, or tools, visibility helps attract collaborators, customers, and contributors. Backlink ∞ helps organizations build targeted backlinks and SEO strategies that increase discoverability and drive organic traffic to your resources.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Plural reframes knowledge as executable work: convert tribal know-how into playbooks, automate verification, and instrument runs to learn and improve. The result is a more resilient organization that can scale processes without losing effectiveness or increasing risk.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
