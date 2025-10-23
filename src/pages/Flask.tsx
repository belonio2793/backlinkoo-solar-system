import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ContentContainer from '@/components/ContentContainer';

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={1.2} />
    <path d="M10 9l5 3-5 3V9z" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FlaskPage() {
  useEffect(() => {
    const title = 'Flask — Visual Video Collaboration for Creative Teams: Features, Pricing, and Best Practices';
    const description = 'A complete guide to Flask (flask.do): a visual, video-first collaboration platform built for creatives. Learn features, pricing, workflows, testimonials, and how to use video feedback to move faster.';

    document.title = title;

    const upsertMeta = (name: string, content: string) => {
      if (typeof document === 'undefined') return;
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const upsertPropertyMeta = (property: string, content: string) => {
      if (typeof document === 'undefined') return;
      let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    upsertMeta('description', description);
    upsertMeta('keywords', 'Flask, flask.do, video collaboration, creative feedback, video feedback tools, Notion Loom alternative, Flask Pro');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/flask');

    try {
      const ldArticle = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: title,
        description,
        mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '/flask',
        author: { '@type': 'Organization', name: 'Backlink ∞' },
        publisher: { '@type': 'Organization', name: 'Backlink ∞' }
      } as const;

      const ldFAQ = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Flask (flask.do)?',
            acceptedAnswer: { '@type': 'Answer', text: 'Flask is a video-first collaboration platform designed for creatives. It combines recorded feedback, threaded comments, tagging, and organization tools to make visual reviews fast and actionable.' }
          },
          {
            '@type': 'Question',
            name: 'How does Flask differ from Loom or Frame.io?',
            acceptedAnswer: { '@type': 'Answer', text: 'Flask centers around collaborative workflows and organization: unlimited feedback, tags and filters, shared workspaces on Pro, and built-in AI insights for video feedback. It blends quick recording with project-level structure.' }
          },
          {
            '@type': 'Question',
            name: 'Is Flask free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Flask offers a free tier with unlimited videos and comments leveraging YouTube for storage. Pro plans add uploads, shared team workspaces, branding removal, and additional team-focused features.' }
          },
          {
            '@type': 'Question',
            name: 'Who should use Flask?',
            acceptedAnswer: { '@type': 'Answer', text: 'Creative teams, producers, product designers, and content creators who need lightweight, visual-first feedback loops and a way to organize comments and revisions efficiently.' }
          }
        ]
      } as const;

      let scriptArticle = document.head.querySelector('script[data-jsonld="flask-article"]') as HTMLScriptElement | null;
      if (!scriptArticle) {
        scriptArticle = document.createElement('script');
        scriptArticle.setAttribute('data-jsonld', 'flask-article');
        scriptArticle.type = 'application/ld+json';
        document.head.appendChild(scriptArticle);
      }
      scriptArticle.textContent = JSON.stringify(ldArticle);

      let scriptFAQ = document.head.querySelector('script[data-jsonld="flask-faq"]') as HTMLScriptElement | null;
      if (!scriptFAQ) {
        scriptFAQ = document.createElement('script');
        scriptFAQ.setAttribute('data-jsonld', 'flask-faq');
        scriptFAQ.type = 'application/ld+json';
        document.head.appendChild(scriptFAQ);
      }
      scriptFAQ.textContent = JSON.stringify(ldFAQ);
    } catch {}
  }, []);

  return (
    <div className="flask-page bg-background text-foreground">
      <Header />

      <ContentContainer
        variant="wide"
        hero={(
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-yellow-50 text-pink-700 border border-pink-100 shadow-sm">
              <VideoIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Video collaboration • built for creatives</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight">Flask — Video collaboration, built for how creatives actually work</h1>
            <p className="mt-3 text-lg text-slate-700 max-w-3xl mx-auto">Flask blends quick, asynchronous video feedback with team organization so creative reviews become clear, actionable, and fast. Think Notion + Loom, but crafted for video-first workflows and the way teams iterate on visual work.</p>
          </div>
        )}
      >
        <article className="prose prose-slate lg:prose-lg">

          <section>
            <h2>The problem Flask solves</h2>
            <p>
              Creative work often fails to scale because feedback is scattered: messages in chat, comments in documents, and long explanatory emails that ask people to "picture" changes. Video captures intention and context: the speaker points, demonstrates, and highlights rhythm and motion—things words often miss. Flask makes recorded feedback first-class, organizes that feedback, and surfaces the actions you can take next.
            </p>
            <p>
              By applying structure—tags, filters, and collaborative threads—Flask turns ephemeral commentary into a repeatable process. That means fewer misunderstandings, fewer rounds of rework, and faster approvals.
            </p>
          </section>

          <section>
            <h2>Key features and how they help teams</h2>
            <h3>Show, don't type</h3>
            <p>
              Instead of writing long notes, record. Capture the screen, camera, or both, and narrate decisions. Flask shortens the gap between perception and instruction: a five-minute recording often replaces a 30-minute meeting or an unclear list of steps.
            </p>

            <h3>Free, unlimited video collaboration</h3>
            <p>
              For many teams, storing video is the main cost. Flask offers a generous free tier that leverages YouTube for storage, providing unlimited recording and comment threads at no cost. That lowers the barrier for adoption and helps teams experiment with a video-first process before committing to paid tiers.
            </p>

            <h3>Tag, filter, and organize</h3>
            <p>
             Tags let teams slice feedback any way they need: by feature, by client, by priority. Filters turn long timelines into action lists: show me only bugs, or only style changes. Organization reduces cognitive load and speeds triage.
            </p>

            <h3>Shared workspaces and uploads (Pro)</h3>
            <p>
             Teams on Pro get shared spaces, direct uploads, versioning, and the ability to remove branding—features that matter when you move from experimentation to daily practice.
            </p>

            <h3>AI insights</h3>
            <p>
             Flask augments video feedback with AI-driven summaries and suggested action items. That means long monologues can be distilled into clear tasks and owners, saving review time and increasing alignment.
            </p>
          </section>

          <section>
            <h2>Pricing and value signals</h2>
            <p>
             Flask positions itself with a free tier for exploration and a Pro plan for teams. The free tier is compelling for individuals and small projects: unlimited recordings and comments lower the adoption cost. Pro adds uploads, team workspaces, version controls, and white-labeling—features that help agencies and larger teams remove friction from client work.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mt-4 not-prose">
              <div className="rounded-xl border p-6 bg-white/60 dark:bg-slate-900/60">
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="mt-2 text-sm">Unlimited videos and comments using YouTube as the storage backend. Great for individuals and small teams getting started with visual feedback.</p>
                <ul className="mt-3 text-sm list-disc pl-5">
                  <li>Unlimited recordings and comments</li>
                  <li>AI insights and summaries</li>
                  <li>Use YouTube (Unlisted or Public) as storage</li>
                </ul>
              </div>

              <div className="rounded-xl border p-6 bg-white/60 dark:bg-slate-900/60">
                <h3 className="text-lg font-semibold">Pro — For creative teams</h3>
                <p className="mt-2 text-sm">Adds team workspaces, direct uploads, multiple assets per Flask, and branding removal. Typical price signals show a per-member monthly rate when billed annually.</p>
                <ul className="mt-3 text-sm list-disc pl-5">
                  <li>Shared team workspaces</li>
                  <li>Direct uploads and versioning</li>
                  <li>Remove Flask branding</li>
                </ul>
              </div>
            </div>

          </section>

          <section>
            <h2>Workflows that scale with Flask</h2>
            <p>
             Adopt Flask as a lightweight hub for creative reviews. A repeatable workflow might look like this:
            </p>
            <ol>
              <li>Record a short walkthrough highlighting the change, problem, or inspiration.</li>
              <li>Tag the recording with a project, priority, or client name.</li>
              <li>Leave timestamped comments or assign action items directly from the video timeline.</li>
              <li>Use filters to surface high-priority items for the next sprint or client delivery.</li>
              <li>Export or summarize decisions for stakeholders who need a digestible update.</li>
            </ol>
            <p>
             This approach keeps work asynchronous, traceable, and auditable while preserving the nuance that makes creative feedback useful.
            </p>
          </section>

          <section>
            <h2>Testimonials</h2>
            <p>Real teams report that video-first workflows reduce friction and speed decisions. Representative quotes:</p>
            <blockquote>
              “Flask completely changes how I collaborate with our team. It adds a new layer to creative communication I didn't know existed.” — Eric Villa, Producer, MKBHD & The Studio
            </blockquote>
            <blockquote>
              “It's Notion meets Loom, but for video collaboration.” — Tommy Geoco, Product Designer
            </blockquote>
            <blockquote>
              “We used Frame.io with my team, now I cannot even fathom going back. Flask is crazy.” — Simone Ferretti, Content Creator
            </blockquote>
            <blockquote>
              “Flask is modernising video collaboration and I'm here for it!” — Pedro Duarte, Head of Hype, Raycast
            </blockquote>
            <blockquote>
              “We work on dozens of complex creative projects with all sorts of clients, Flask has been a lifesaver.” — Fabrizio San Biagio, CEO, Seequence Studio
            </blockquote>
          </section>

          <section>
            <h2>Security, privacy, and storage options</h2>
            <p>
             Video data brings particular privacy and compliance questions. Flask’s model of leveraging YouTube for the free tier reduces storage costs but requires teams to consider visibility (Unlisted vs Public). For sensitive client work, Pro’s direct upload option and workspace controls keep assets off public platforms and under team governance.
            </p>
            <p>
             When evaluating any visual collaboration tool, define retention policies, access controls, and backup strategies. Ensure audit trails and role-based access are enabled for client deliverables.
            </p>
          </section>

          <section>
            <h2>AI-assisted summaries and action extraction</h2>
            <p>
             AI features can turn long critique sessions into bite-sized tasks. Flask’s AI insights aim to extract the key takeaways: suggested tasks, priorities, and recommended owners. Use these suggestions as a draft—human review ensures context and nuance are preserved.
            </p>
          </section>

          <section>
            <h2>Frequently asked questions</h2>
            <h3>How much does Pro cost?</h3>
            <p>
             Price signals indicate a modest per-member monthly fee when billed annually. The right plan depends on team size and whether you require uploads and workspace management.
            </p>
            <h3>Do I need to use YouTube?</h3>
            <p>
             No. YouTube is an option used for the free tier’s storage convenience. For private, client-facing projects, the Pro upload flow keeps footage in your account or under Flask’s managed storage depending on the plan.
            </p>
            <h3>Is Flask enterprise-ready?</h3>
            <p>
             Flask focuses primarily on small to mid-sized creative teams and agencies. For enterprise use, confirm requirements around single sign-on, data residency, and bespoke governance before committing.
            </p>
          </section>

          <section>
            <h2>Design patterns for better feedback</h2>
            <p>
             Encourage short, focused recordings: five minutes or less. Use timestamps to anchor specific issues and add action labels to comments. Create a tagging taxonomy for projects so reviewers can quickly filter by client, sprint, or priority.
            </p>
          </section>

          <section>
            <h2>Integrations and export options</h2>
            <p>
             Flask integrates with common collaboration tools via link sharing and export. Teams often link recordings into project trackers, shared documents, or client portals. If you rely on an ecosystem workflow, verify the available export formats and APIs for programmatic access.
            </p>
          </section>

          <section>
            <h2>Roadmap and product direction</h2>
            <p>
             Flask’s roadmap emphasizes collaboration primitives: better organization, deeper team controls, improved AI summarization, and more flexible storage choices. These investments align with the needs of agencies and studios who juggle many concurrent projects and versions.
            </p>
          </section>

          <section>
            <h2>Case studies</h2>
            <h3>Producer workflow</h3>
            <p>
             A production studio replaced multi-email feedback chains with Flask. Producers recorded direction, editors attached versions, and clients approved via timestamped comments. Turnaround improved and client satisfaction rose due to clearer expectations.
            </p>
            <h3>Design studio</h3>
            <p>
             A design team used Flask to centralize brand reviews. Tags and filters created a single source of truth for revisions and eliminated duplicated feedback across threads.
            </p>
          </section>

          <section>
            <h2>Checklist for adopting Flask</h2>
            <ul>
              <li>Decide whether to start on the free tier (YouTube storage) or Pro (uploads and workspaces).</li>
              <li>Create a tagging taxonomy for projects and clients.</li>
              <li>Set recording guidelines (length, naming conventions, required metadata).</li>
              <li>Document retention and access control policies for client work.</li>
              <li>Train reviewers to leave timestamped, actionable comments linked to tickets.
              </li>
            </ul>
          </section>

          <section>
            <h2>Conclusion</h2>
            <p>
             Flask brings clarity to creative collaboration by making video feedback first-class and giving teams the organization to act on insights. By combining short recordings, threaded comments, tagging, and AI summaries, teams reduce ambiguity and speed the path from brief to final delivery.
            </p>
            <p>
             If you build or document creative workflows and want to amplify visibility, consider pairing great content with high-quality backlinks. Register for Backlink ∞ to acquire authoritative links and grow organic traffic for your portfolio or studio: <a href="https://backlinkoo.com/register" className="text-blue-600 underline">Register for Backlink ∞</a>.
            </p>
          </section>

        </article>
      </ContentContainer>

      <Footer />
    </div>
  );
}
