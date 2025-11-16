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

const metaTitle = 'Whistl — Conversational Notes & Meeting Summaries Powered by AI';
const metaDescription = 'Whistl captures meeting notes, summarizes conversations, and helps teams turn meetings into action. Explore Whistl’s features, workflows, integrations, and best practices for productive collaboration.';

export default function WhistlPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/whistl`;
    } catch {
      return '/whistl';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Whistl, meeting notes, AI summaries, meeting assistant, discussion capture, meeting transcripts');
    upsertCanonical(canonical);

    injectJSONLD('whistl-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('whistl-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('whistl-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Whistl?', acceptedAnswer: { '@type': 'Answer', text: 'Whistl is an AI-powered meeting assistant that records conversations, generates summaries, and extracts action items so teams can move faster after meetings.' } },
        { '@type': 'Question', name: 'Does Whistl integrate with calendars?', acceptedAnswer: { '@type': 'Answer', text: 'Many meeting assistants integrate with calendar providers for scheduling and recording context; check Whistl’s integrations for specifics.' } },
        { '@type': 'Question', name: 'Is Whistl private?', acceptedAnswer: { '@type': 'Answer', text: 'Privacy practices vary by provider — look for on-device processing options, encryption, and admin controls to ensure meeting data is handled securely.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Whistl — Turn Meetings into Clear Action with AI Notes</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Whistl helps teams capture the signal from meetings: automated summaries, action items, decisions, and searchable transcripts so meetings drive momentum, not busywork.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI Summaries</Badge>
            <Badge className="bg-slate-100 text-slate-800">Action Items</Badge>
            <Badge className="bg-slate-100 text-slate-800">Searchable Transcripts</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Whistl?</a>
                  <a href="#features" className="block text-blue-700">Features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Suggested workflow</a>
                  <a href="#privacy" className="block text-blue-700">Privacy & security</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Whistl automates meeting capture: record, transcribe, summarize, and extract next steps so teams spend less time in follow-ups and more time executing.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Whistl?</h2>

              <p>Whistl is an AI-driven meeting assistant designed to make meetings more effective. It focuses on three outcomes: concise summaries, clear action items, and searchable content that helps teams reference past discussions without rewatching entire calls. The product addresses a common complaint: meetings consume time but often lack clear outcomes or traceable decisions.</p>

              <p>By recording and processing meeting conversations, Whistl produces structured notes that are easy to scan, share, and act upon. Instead of relying on one person to capture minutes, the AI picks up major points, highlights decisions, and lists owners for follow-up tasks.</p>
            </section>

            <section id="features">
              <h2>Features that Make Meetings Useful</h2>

              <h3>Automated Transcription & Summaries</h3>
              <p>Whistl transcribes spoken conversations and generates readable summaries that emphasize decisions, key discussion points, and consensus items. Summaries are designed for quick scanning so stakeholders can understand outcomes in seconds.</p>

              <h3>Action Item Extraction</h3>
              <p>The system extracts commitments ("John will send the design specs by Friday") and turns them into assignable action items with owners and due dates. This reduces the friction of follow-ups and clarifies accountability immediately after the meeting.</p>

              <h3>Searchable Meeting Archive</h3>
              <p>All transcripts and summaries are indexed so teams can search across past meetings for quotes, decisions, and referenced documents. Searchable archives reduce repeated conversations and speed onboarding.</p>

              <h3>Smart Highlights & Timecodes</h3>
              <p>Whistl surfaces highlighted moments with precise timecodes so users can jump to the most relevant snippet in the recording instead of watching the whole meeting.</p>

              <h3>Integration with Calendars & Tools</h3>
              <p>Connect Whistl to calendar platforms to auto-attach context (participants, agenda) and push action items to task trackers like Asana, Jira, or Notion. Integration reduces manual handoffs between meeting outputs and execution tools.</p>

              <h3>Speaker Diarization & Role Mapping</h3>
              <p>Identify who said what using speaker diarization and optionally map speakers to organizational roles to maintain context in transcripts and summaries.</p>

              <h3>Multi-language Support</h3>
              <p>For global teams, support for multiple languages and translation features helps capture conversations across regions and convert them into a single searchable corpus.</p>
            </section>

            <section id="how-it-works">
              <h2>How Whistl Works — From Call to Action</h2>

              <p>Whistl's pipeline balances automation and human oversight. The typical flow includes:</p>
              <ol>
                <li><strong>Connect & schedule:</strong> Integrate with your calendar and invite Whistl to meetings you want recorded.</li>
                <li><strong>Record & transcribe:</strong> During the meeting, Whistl captures audio and produces a time-aligned transcript. Some deployments offer live transcription while others process recordings after the call.</li>
                <li><strong>AI analysis:</strong> Natural language models analyze the transcript to identify summaries, action items, decisions, and sentiment cues.</li>
                <li><strong>Review & edit:</strong> Participants can review automatic notes, adjust summaries, or confirm assignments before sharing them with the wider team.</li>
                <li><strong>Share & integrate:</strong> Push the finalized notes and action items to your project management or knowledge base, and notify assignees via email or chat integrations.</li>
              </ol>

              <p>Whistl encourages a review step so humans remain in the loop and can correct errors before downstream tasks are created.</p>
            </section>

            <section id="use-cases">
              <h2>Who Benefits from Whistl?</h2>

              <h3>Product Teams</h3>
              <p>Product teams use Whistl to capture feature decisions, sync notes across squads, and ensure follow-ups land in issue trackers. Summaries reduce the cognitive load of cross-functional meetings and make priorities explicit.</p>

              <h3>Sales & Customer Success</h3>
              <p>For customer calls and demos, accurate notes and action items prevent missed commitments and help new reps onboard faster by reviewing prior conversations and commitments.</p>

              <h3>Leadership & HR</h3>
              <p>Executive syncs and one-on-ones can be summarized to action items and tone checks, enabling better follow-through on strategic decisions and people-related actions.</p>

              <h3>Distributed Teams & Remote Work</h3>
              <p>Remote teams rely on clear records to maintain context across timezones; Whistl ensures that distant stakeholders can catch up with concise notes and playback highlights.</p>
            </section>

            <section id="workflow">
              <h2>Suggested Workflow for More Effective Meetings</h2>

              <p>To maximize value from Whistl, adopt a simple meeting practice:</p>
              <ol>
                <li><strong>Set an agenda:</strong> A short agenda helps AI prioritize which parts of the conversation are most important for summaries.</li>
                <li><strong>Invite Whistl:</strong> Add the assistant to the meeting so it captures context automatically (participants, title, and agenda).</li>
                <li><strong>Confirm ownership live:</strong> When decisions are made, state owners and tentative due dates aloud so Whistl can extract them reliably.</li>
                <li><strong>Review notes shortly after:</strong> Allocate five minutes post-meeting for participants to validate and adjust action items before they are dispatched to trackers.</li>
                <li><strong>Follow up:</strong> Use the auto-generated tasks and notifications to keep progress visible and maintain momentum after the meeting.</li>
              </ol>

              <p>These small changes greatly increase the reliability of extracted action items and reduce the cognitive overhead of manual minute-taking.</p>
            </section>

            <section id="privacy">
              <h2>Privacy, Security & Compliance</h2>

              <p>Meeting assistants handle sensitive conversations, so privacy practices are critical. Key considerations include:</p>
              <ul>
                <li><strong>Data residency:</strong> Understand where recordings and transcripts are stored and whether you can opt for regional storage or on-premise deployment.</li>
                <li><strong>Encryption:</strong> Use end-to-end or server-side encryption for recordings, transcripts, and backups.</li>
                <li><strong>Access control:</strong> Admin controls should let organizations restrict who sees meeting artifacts and manage retention periods.</li>
                <li><strong>Consent & notifications:</strong> Ensure participants are aware they are being recorded and have given consent where required by law or policy.</li>
                <li><strong>Retention policies:</strong> Configure automatic retention and deletion rules to comply with privacy or industry regulations.</li>
              </ul>

              <p>For regulated industries, consider deploy options that keep data within your controlled environment or support strict compliance certifications.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Ecosystem</h2>

              <p>Whistl typically integrates with common tools to streamline handoffs and reduce manual work:</p>
              <ul>
                <li><strong>Calendars:</strong> Google Calendar, Microsoft Exchange/Outlook for scheduling and context.</li>
                <li><strong>Communications:</strong> Slack, Microsoft Teams, or email for notifications and quick-share snippets.</li>
                <li><strong>Task management:</strong> Asana, Jira, Trello, Notion for converting action items into trackable tasks.</li>
                <li><strong>Storage & KB:</strong> Google Drive, SharePoint, Confluence for archived notes and artifacts.</li>
              </ul>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Real Results</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Startup — Faster Roadmap Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  "A rapidly scaling startup used Whistl to capture product and engineering syncs. With action items auto-created in Jira, feature delivery cycles shortened and fewer decisions slipped through the cracks." — Head of Product
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Agency — Clear Client Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  "Client calls were summarized and shared within hours, improving transparency and reducing follow-up emails. Our account teams closed the loop faster and clients appreciated the clarity." — Account Director
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Enterprise — Audit Trails for Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  "An enterprise used Whistl to keep auditable records of decision points across cross-functional committees. The searchability of transcripts helped during compliance reviews." — Operations Lead
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Whistl made our meetings actionable — summaries are concise and action items land in the right place every time." — Engineering Manager</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The searchable archive is invaluable for onboarding new team members — they can catch up on decisions in minutes." — People Ops</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"We reduced follow-up emails by 40% after adopting the auto-assigned action items." — Sales Lead</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Use Caution</h2>

              <p>AI meeting assistants improve productivity but are not perfect. Be aware of these limitations:</p>
              <ul>
                <li><strong>Transcription errors:</strong> Accents, crosstalk, and poor audio quality can reduce transcript fidelity and affect extraction accuracy.</li>
                <li><strong>Context understanding:</strong> AI may misinterpret sarcasm, implied decisions, or nuanced priorities — human review remains important for high-stakes outcomes.</li>
                <li><strong>Privacy expectations:</strong> Not all teams are comfortable recording sensitive or HR-related discussions; use policy and consent mechanisms accordingly.</li>
              </ul>

              <p>Use Whistl as an assistive tool and validate mission-critical items with explicit confirmation in subsequent workflows.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices to Get the Most Out of Whistl</h2>
              <ol>
                <li>Keep meetings focused: clear agendas improve the quality of automated summaries.</li>
                <li>Speak clearly and avoid talking over others to improve transcription fidelity.</li>
                <li>State owners and deadlines aloud for reliable action-item extraction.</li>
                <li>Review generated notes quickly and correct any mistakes before tasks are created.</li>
                <li>Control access and retention to align with your organization’s privacy posture.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Can Whistl join meetings automatically?</summary><p className="mt-2">Yes — with calendar integration, Whistl can be invited to meetings automatically and attach context such as attendees and agenda.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does it support non-English languages?</summary><p className="mt-2">Many meeting assistants offer multi-language support; check product documentation for supported languages and translation features.</p></details>

              <details className="mb-3"><summary className="font-semibold">How accurate are action item extractions?</summary><p className="mt-2">Extraction accuracy varies with audio clarity and explicitness. Encouraging participants to state assignments and due dates clearly improves reliability.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Increase Reach for Your Meetings & Content</h2>
              <p>After you capture and distill valuable meetings and content, visibility helps amplify impact. Backlink ∞ helps teams, creators, and companies build targeted backlinks and SEO campaigns that drive organic traffic and surface your insights to the right audience.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Whistl exemplifies how AI can turn time-consuming meetings into actionable, traceable outcomes. By combining transcription, summarization, and integrations, teams can reclaim time and ensure meetings contribute to momentum rather than paperwork. Adopt clear meeting habits, validate AI outputs, and use Whistl to keep your team aligned and accountable.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
