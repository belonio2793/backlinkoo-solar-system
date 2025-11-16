import { useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const metaTitle = 'Glue AI — AI-Connected Collaboration: Smart Chat, Tasks & Integrations for Teams';
const metaDescription = 'Glue AI brings AI into team collaboration: chat with AI assistants, auto-generate tasks, summarize conversations, and integrate with your toolchain to streamline work and speed up outcomes.';

export default function GlueAIPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/glue-ai`;
    } catch {
      return '/glue-ai';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Glue AI, team AI, AI chat, collaboration AI, meeting summaries, task automation');
    upsertCanonical(canonical);

    injectJSONLD('glue-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('glue-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('glue-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Glue AI?', acceptedAnswer: { '@type': 'Answer', text: 'Glue AI is an AI-enhanced collaboration platform that embeds smart assistants into team chat, automates task creation from conversations, and connects to existing tools to reduce manual work.' } },
        { '@type': 'Question', name: 'How does Glue AI integrate with tools?', acceptedAnswer: { '@type': 'Answer', text: 'Glue AI connects to calendars, task managers, and cloud storage via integrations and webhooks to push summaries, tasks, and files into your workflows.' } },
        { '@type': 'Question', name: 'Who should use Glue AI?', acceptedAnswer: { '@type': 'Answer', text: 'Product teams, customer success, marketing, and operations teams that want to automate routine work, keep context in one place, and speed up decision-making.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Glue AI — Make Teamwork Smarter with AI-Powered Collaboration</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Glue AI embeds AI helpers where teams already work: chats, meetings, and project trackers. Summarize conversations, extract tasks, and surface context without leaving the conversation.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI Chat</Badge>
            <Badge className="bg-slate-100 text-slate-800">Task Automation</Badge>
            <Badge className="bg-slate-100 text-slate-800">Integrations</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Glue AI?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Recommended workflow</a>
                  <a href="#integrations" className="block text-blue-700">Integrations</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Glue AI accelerates collaboration by turning conversations into actions: AI summaries, task extraction, and context-aware responses reduce manual work and keep teams aligned.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Glue AI?</h2>

              <p>Glue AI is a collaboration layer that augments existing communication platforms with AI-driven capabilities. Instead of treating AI as a separate tool, Glue aims to "glue" intelligence into the flow of work: automated meeting recaps in chat, suggested follow-ups, and context-aware answers that draw from your connected systems.</p>

              <p>The platform's goal is to reduce the boring, repetitive work that follows most meetings — manual note-taking, creating tasks, and chasing context across tools. Glue AI surfaces the important bits, assigns owners, and connects related artifacts so teams can move faster.</p>
            </section>

            <section id="features">
              <h2>Core Features</h2>

              <h3>AI-Driven Chat Assistants</h3>
              <p>Glue AI adds helpful assistants to team chats that can answer questions from connected docs, summarize long threads, and pull relevant context into the conversation to reduce context switching.</p>

              <h3>Automatic Meeting Summaries</h3>
              <p>After calls, Glue provides concise summaries that highlight decisions, risks, and action items with timecodes and responsible owners. These summaries are shareable and link back to the recording or transcript for verification.</p>

              <h3>Task Extraction & Assignment</h3>
              <p>Glue recognizes commitments and converts them into tasks in your preferred project tracker, complete with suggested assignees and deadlines based on the discussion.</p>

              <h3>Contextual Knowledge Retrieval</h3>
              <p>Search across connected repositories, documentation, and past conversations. Glue surfaces relevant snippets when you ask the assistant, helping reduce repeated explanations and onboarding time.</p>

              <h3>Workflow Automation</h3>
              <p>Trigger common automations from chat or meetings — create tickets, send follow-ups, or update statuses without leaving the conversation.</p>

              <h3>Security & Access Controls</h3>
              <p>Enterprise-grade controls let administrators manage access, data retention, and integration permissions to maintain compliance and protect sensitive information.</p>
            </section>

            <section id="how-it-works">
              <h3>How Glue AI Works — The Engine Under the Hood</h3>

              <p>Glue AI connects to your tools and pipelines, indexes permitted content, and runs models that are tuned to workplace language. The workflow typically looks like:</p>
              <ol>
                <li><strong>Connect:</strong> Authorize Glue to access selected channels, calendars, documents, and task systems with fine-grained permissions.</li>
                <li><strong>Index & surface:</strong> Glue indexes the accessible content and builds retrieval layers that power contextual responses.</li>
                <li><strong>Assist & act:</strong> In chat or meeting contexts, Glue suggests summaries, creates tasks, and answers queries based on indexed knowledge and conversation signals.</li>
                <li><strong>Audit & control:</strong> Admins review logs, configure retention, and control model behavior in sensitive contexts to ensure compliance.</li>
              </ol>

              <p>Where regulations or privacy are a concern, Glue offers configuration to limit data exposure and to route sensitive processing to on-premise or regional deployments when available.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases — Teams That Benefit</h2>

              <h3>Product & Engineering</h3>
              <p>Developers use Glue to capture decisions, link relevant tickets, and reduce miscommunication across sprints. Automatic task creation from planning sessions speeds iteration and prevents missed action items.</p>

              <h3>Customer Success & Support</h3>
              <p>Support teams use Glue to summarize customer calls, extract follow-ups, and attach context to case records so handoffs are smoother and faster.</p>

              <h3>Marketing & Growth</h3>
              <p>Marketing teams use Glue to find past campaign decisions, fetch brand guidance, and accelerate campaign launches by surfacing prior learnings.</p>

              <h3>Operations & Leadership</h3>
              <p>Leaders use Glue to get concise updates from cross-functional meetings and to track commitments across teams without wading through long threads or recordings.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: How to Adopt Glue AI Effectively</h2>

              <p>To get the most from Glue, follow a phased adoption approach:</p>
              <ol>
                <li><strong>Pilot:</strong> Start with a small team and connect a subset of channels and docs. Validate the quality of summaries and task extraction before expanding.</li>
                <li><strong>Train:</strong> Teach teams to phrase commitments explicitly during meetings to improve extraction accuracy (e.g., "Alice will do X by Friday").</li>
                <li><strong>Integrate:</strong> Connect Glue to ticketing and knowledge bases to close the loop between conversation and execution.</li>
                <li><strong>Govern:</strong> Set retention and access policies and review logs regularly to ensure compliance with internal policies.</li>
                <li><strong>Scale:</strong> Roll out to additional teams and use feedback to refine prompts and extraction rules.</li>
              </ol>

              <p>This approach balances value and control while building confidence across the organization.</p>
            </section>

            <section id="integrations">
              <h3>Integrations & Extensibility</h3>

              <p>Glue integrates with the tools teams already use, enabling automations that keep work flowing:</p>
              <ul>
                <li><strong>Chat & meetings:</strong> Slack, Microsoft Teams, Zoom for capturing context and providing inline assistance.</li>
                <li><strong>Project trackers:</strong> Jira, Asana, Trello, Linear for pushing tasks and tracking execution.</li>
                <li><strong>Docs & storage:</strong> Google Drive, Notion, Confluence for knowledge retrieval and citation.</li>
                <li><strong>Identity & security:</strong> SSO providers and role sync for enterprise access control and provisioning.</li>
                <li><strong>APIs & webhooks:</strong> Extend Glue with custom automations and integrate with internal systems.</li>
              </ul>
            </section>

            <section id="case-studies">
              <h2>Case Studies</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Product Team — Faster Decision Handoffs</CardTitle>
                </CardHeader>
                <CardContent>
                  "A product team used Glue to summarize weekly syncs and automatically create tickets for follow-ups. The improved clarity reduced rework and kept priorities aligned." — Product Lead
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Customer Support — Shorter Resolution Times</CardTitle>
                </CardHeader>
                <CardContent>
                  "Support teams used Glue to attach call summaries to tickets and surface suggested knowledge articles, reducing resolution times and improving first-contact success." — Support Manager
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Remote Organization — Better Async Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  "Remote teams used Glue to keep decisions discoverable and avoid repeated context switching. New hires ramped faster by searching past summaries for decisions and rationale." — Ops Head
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Glue saved time by turning long threads into action lists automatically — a real productivity multiplier." — Engineering Manager</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"We stopped losing decisions in chat. Summaries and timecodes make follow-ups simple." — Head of Customer Success</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The contextual retrieval feature pulled up the exact doc we needed during a sprint planning meeting." — Product Designer</blockquote>
            </section>

            <section id="limitations">
              <h3>Limitations & Responsible Use</h3>

              <p>AI assistants are powerful but imperfect. Consider these limitations when adopting Glue:</p>
              <ul>
                <li><strong>False positives:</strong> Task extraction may mislabel casual mentions as commitments — human review helps catch these cases.</li>
                <li><strong>Context gaps:</strong> AI may not capture unstated assumptions or organizational nuance without proper prompts and tuning.</li>
                <li><strong>Privacy risks:</strong> Sensitive conversations require strict access controls and retention policies to prevent data leakage.</li>
              </ul>

              <p>Use human-in-the-loop processes and governance to maintain trust and accuracy.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Working with Glue AI</h2>
              <ol>
                <li>Make commitments explicit during meetings to improve extraction accuracy.</li>
                <li>Use pilot teams to refine settings and prompts before organization-wide rollouts.</li>
                <li>Keep humans in the loop for validation of critical tasks and decisions.</li>
                <li>Monitor system usage and set retention policies aligned with compliance requirements.</li>
                <li>Document AI behaviors so teams understand when to trust automated outputs and when to verify.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Does Glue store meeting data?</summary><p className="mt-2">Data retention depends on configuration. Administrators can set retention and access policies. For sensitive data, consider on-premise or restricted deployments.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can Glue create tasks in our tracker?</summary><p className="mt-2">Yes — Glue integrates with common task trackers and can create tasks automatically from extracted action items, with suggested assignees and due dates.</p></details>

              <details className="mb-3"><summary className="font-semibold">How accurate are summaries?</summary><p className="mt-2">Summary accuracy is high for explicit decisions and action items, but subtle nuances may require human review. Encourage clear language during meetings for best results.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h3>Boost Visibility for Your AI Initiatives</h3>
              <p>If you’re launching AI-driven tools like Glue AI, visibility and credibility matter. Backlink ∞ helps AI startups, teams, and authors build authoritative backlinks and SEO strategies that increase organic discovery and drive targeted traffic to product pages.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Glue AI demonstrates how AI can be a connective tissue across the tools teams already use: summarizing conversations, extracting work, and surfacing context when it matters. With clear governance and thoughtful adoption, Glue can reduce busywork, improve follow-through, and make collaboration measurably more efficient.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
