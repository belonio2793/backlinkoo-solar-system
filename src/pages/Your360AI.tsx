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

const metaTitle = 'Your360 AI — Confidential 360° Feedback & Actionable Growth Plans Powered by AI';
const metaDescription = 'Your360 AI delivers confidential, AI-synthesized 360-degree feedback and personalized growth plans from peer interviews. Fast, affordable, and coach-quality insights for individuals and teams.';

export default function Your360AIPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/your360-ai`;
    } catch {
      return '/your360-ai';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Your360 AI, 360 feedback, AI coaching, peer interviews, growth plan, leadership development');
    upsertCanonical(canonical);

    injectJSONLD('your360-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('your360-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('your360-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Your360 AI?', acceptedAnswer: { '@type': 'Answer', text: 'Your360 AI is an AI-driven 360 feedback platform that converts confidential peer interviews into synthesized insights and tailored growth plans.' } },
        { '@type': 'Question', name: 'Is feedback confidential?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Your360 AI emphasizes confidential collection of peer input and synthesizes results to protect anonymity while providing actionable recommendations.' } },
        { '@type': 'Question', name: 'Who can use it?', acceptedAnswer: { '@type': 'Answer', text: 'Individuals, managers, and teams seeking development insights and coach-quality recommendations without the time and cost of traditional executive coaching.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Your360 AI — Fast, Confidential 360° Feedback with AI-Driven Growth Plans</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Bring coach-level insight to your professional growth. Your360 AI collects confidential peer interviews, synthesizes recurring themes, and delivers a prioritized, personalized plan to help you improve — faster and at lower cost than traditional 360s.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Confidential Feedback</Badge>
            <Badge className="bg-slate-100 text-slate-800">AI-Synthesized Insights</Badge>
            <Badge className="bg-slate-100 text-slate-800">Personal Growth Plan</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Your360 AI?</a>
                  <a href="#features" className="block text-blue-700">Core features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Recommended workflow</a>
                  <a href="#pricing" className="block text-blue-700">Pricing & plans</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">Your360 AI transforms confidential peer interviews into concise, prioritized growth plans powered by AI analysis — delivering practical development guidance at a fraction of the time and cost of traditional coaching.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Your360 AI?</h2>

              <p>Your360 AI is a modern take on 360-degree feedback. It streamlines the process of gathering peer perspectives, uses AI to distill patterns from qualitative interviews, and generates an individualized plan that highlights strengths, blind spots, and practical next steps.</p>

              <p>Traditional 360s often require long surveys, manual synthesis, and expensive external facilitation. Your360 AI reduces friction by conducting conversational interviews with peers (guided by AI), protecting anonymity, and providing a coach-quality synthesis that is actionable and easy to act on.</p>

              <p>The aim is simple: make high-quality development insight accessible. Whether you are an individual contributor seeking promotion, a manager wanting to level up leadership skills, or an HR team scaling development programs, Your360 AI delivers focused recommendations that teams can put into practice immediately.</p>
            </section>

            <section id="features">
              <h2>Core Features — What Makes It Effective</h2>

              <h3>Confidential Peer Interviews</h3>
              <p>Rather than relying exclusively on anonymous surveys, Your360 AI conducts structured interviews with peers, allowing for richer, context-driven feedback. The interview flow is designed to elicit specific examples and behavioral observations, which improve the usefulness of the resulting insights.</p>

              <h3>AI Synthesis & Thematic Analysis</h3>
              <p>AI analyzes interview transcripts to surface recurring themes, patterns, and sentiment. This automated analysis reduces bias and highlights the most consistent feedback points across respondents, producing a clear picture of perceived strengths and development areas.</p>

              <h3>Personalized Growth Plans</h3>
              <p>Instead of raw data, Your360 AI outputs prioritized, step-by-step growth plans tailored to the individual's goals, role, and feedback. Plans include suggested practices, short-term experiments, and resources to accelerate improvement.</p>

              <h3>Self-Reflection & AI Coach Sessions</h3>
              <p>The platform includes guided self-reflection modules and an AI coach that helps translate feedback into concrete behaviors, practice routines, and recommended checkpoints for measuring progress.</p>

              <h3>Admin & Team Dashboards</h3>
              <p>For organizations, dashboards provide anonymized program metrics, participation rates, and aggregated themes to guide leadership development investments and identify systemic opportunities across teams.</p>

              <h3>Action Tracking & Follow-ups</h3>
              <p>Track progress against the growth plan, schedule follow-up interviews, and measure behavior change over time to ensure feedback translates into durable development.</p>

              <h3>Secure & Privacy-First Design</h3>
              <p>Privacy is central: the platform anonymizes sensitive responses, stores data securely, and provides controls for who can access detailed outputs. This encourages honest peer input and helps maintain trust in the process.</p>
            </section>

            <section id="how-it-works">
              <h2>How Your360 AI Works — From Invitation to Action</h2>

              <p>The platform is built around a simple, repeatable workflow designed to minimize overhead while maximizing insight quality:</p>
              <ol>
                <li><strong>Initiate the 360:</strong> The individual or manager sets goals and invites a small group of peers — typically 6–12 people who have direct interaction with the participant.</li>
                <li><strong>Conduct interviews:</strong> Peers participate in short, guided interviews (video or voice) that focus on observed behaviors and specific examples rather than abstract ratings.</li>
                <li><strong>AI analysis:</strong> Transcripts are analyzed to identify recurring themes, sentiment, and illustrative examples that support each insight.</li>
                <li><strong>Synthesize insights:</strong> The system groups findings into strengths, blind spots, and growth opportunities, and ranks them by frequency and impact.</li>
                <li><strong>Deliver the plan:</strong> The participant receives a prioritized growth plan with suggested practices, timelines, and metrics to track change.</li>
                <li><strong>Follow up:</strong> Schedule follow-up sessions or micro-experiments to test new behaviors and re-measure impact over time.</li>
              </ol>

              <p>This approach preserves the depth of qualitative feedback while adding scale and speed through AI synthesis and templated coaching guidance.</p>
            </section>

            <section id="use-cases">
              <h2>Who Benefits Most: Key Use Cases</h2>

              <h3>Individual Contributors Seeking Promotion</h3>
              <p>Individuals preparing for promotion cycles use Your360 AI to gather concrete feedback on leadership potential, collaboration, and areas of technical influence. A clear growth plan helps focus development before performance reviews.</p>

              <h3>New Managers & Team Leads</h3>
              <p>Managers in new roles can accelerate their onboarding by understanding how peers perceive their communication, delegation, and decision-making styles — then use the plan to adjust behaviors with measurable checkpoints.</p>

              <h3>HR & People Ops Programs</h3>
              <p>HR teams can scale development programs, run cohort-based 360s, and aggregate anonymized insights to inform training investments and organizational health diagnostics.</p>

              <h3>Executives Seeking Objective Insight</h3>
              <p>Leaders can access confidential, broad-based feedback without hiring an expensive executive coach for every participant. AI synthesis provides a practical alternative to manual debriefing.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: Run a High-Impact 360</h2>

              <p>To get the best outcomes from a 360 using Your360 AI, follow these pragmatic steps:</p>
              <ol>
                <li><strong>Clarify objectives:</strong> Define the purpose (promotion, leadership growth, onboarding) and pick peers who interact frequently and can provide candid examples.</li>
                <li><strong>Communicate confidentiality:</strong> Explain how responses are anonymized and used to encourage honest participation.</li>
                <li><strong>Keep interviews focused:</strong> Use short, behaviorally anchored questions that invite examples rather than generic ratings.</li>
                <li><strong>Review synthesized output:</strong> Validate themes with a trusted colleague or coach to contextualize findings.</li>
                <li><strong>Translate insights into experiments:</strong> Convert each development area into measurable experiments (e.g., practice giving concise updates for two weeks) and track outcomes.</li>
                <li><strong>Plan follow-ups:</strong> Re-run a lighter follow-up in 3–6 months to measure progress and adjust the plan as needed.</li>
              </ol>

              <p>This cycle of feedback, focused practice, and re-measurement is what drives real behavioral change over time.</p>
            </section>

            <section id="pricing">
              <h2>Pricing & Plans</h2>

              <p>Your360 AI offers individual sessions and team plans designed for different organizational needs. Individual packages provide end-to-end 360 sessions with AI synthesis and a personalized plan, while team packages include admin dashboards, cohort reporting, and program management tools.</p>

              <p>When evaluating pricing, consider total cost of ownership compared to traditional coaching: time saved in synthesis, scalability across many participants, and lower per-person costs for the same quality of insight.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Stories</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Startup CPO — Faster Leadership Calibration</CardTitle>
                </CardHeader>
                <CardContent>
                  "The CPO ran cohort 360s for new managers during a fast hiring phase. We identified common gaps in delegation and feedback style, rolled out micro-training, and saw measurable improvements in team satisfaction scores." — Head of People
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Engineering Lead — Clearer Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  "Synthesized themes highlighted that my updates were too detailed for exec stakeholders. The suggested practice to create a two-sentence summary transformed my meetings and reduced follow-up emails." — Engineering Lead
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>HR Team — Program Scale Without Headcount</CardTitle>
                </CardHeader>
                <CardContent>
                  "We launched a manager development program for 50 people with limited resources. Your360 AI replaced a costly external vendor and delivered actionable insights for each participant." — People Ops Manager
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>What Users Say</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"The AI synthesis pulled out patterns we would have missed — it turned scattered comments into a clear narrative I could act on." — Product Manager</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"I expected generic advice, but the growth plan had concrete next steps I could start this week." — Senior Engineer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"Running cohort 360s helped us spot systemic coaching opportunities across teams and saved us thousands compared to external facilitation." — People Ops</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & Ethical Considerations</h2>

              <p>AI tools are powerful but must be used responsibly. Be mindful of potential biases in synthesized outputs, ensure diverse peer selection to avoid skewed samples, and always validate high-impact decisions with human judgment or an experienced coach.</p>

              <p>Additionally, in regulated industries or high-stakes decisions (promotion, compensation), use AI feedback as one input among several and maintain transparent processes with clear documentation.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Meaningful Development</h2>
              <ol>
                <li>Choose peers who have observed relevant behavior — quality over quantity matters more than raw respondent numbers.</li>
                <li>Encourage concrete examples — specificity enables clearer synthesis and more actionable plans.</li>
                <li>Set milestones — translate each recommendation into a measurable experiment with a timeline.</li>
                <li>Combine with coaching — use AI output as a foundation for targeted coaching rather than a replacement for human nuance.</li>
                <li>Respect anonymity — ensure participants understand confidentiality safeguards to promote honest feedback.</li>
              </ol>
            </section>

            <section id="comparison">
              <h2>How Your360 AI Compares to Traditional 360s and Coaching</h2>

              <p>Traditional 360s often involve long surveys and manual synthesis by consultants. They can be expensive and slow. Your360 AI shortens the cycle by using conversational interviews and AI analysis to reach similar insight depth faster and more affordably. While it does not replace the nuance of extended, human-led coaching for complex cases, it provides a highly practical alternative for broad-scale development programs and individuals seeking rapid feedback.</p>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">How many peers should I invite?</summary><p className="mt-2">Typically 6–12 peers provide enough perspective to spot recurring themes, but quality of selection is more important than volume.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is the process anonymous?</summary><p className="mt-2">Yes — the platform anonymizes individual responses in the synthesis to protect contributors while preserving actionable examples for the participant.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can teams run multiple 360s?</summary><p className="mt-2">Teams and HR programs can run cohort-based 360s and use aggregated dashboards to identify organization-wide trends.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can the AI be wrong?</summary><p className="mt-2">AI synthesis is a tool — validate findings with a human coach or trusted colleague, especially for decisions that impact careers or compensation.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Drive Awareness for Your Development Programs</h2>
              <p>After you’ve run 360s and built growth plans, visibility matters — for recruiting, employer branding, and sharing success stories. Backlink ∞ helps teams promote their development programs and attract the right talent by building targeted backlinks and SEO strategies that increase discoverability.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Your360 AI makes high-quality feedback and growth planning accessible by combining confidential peer interviews with AI synthesis and practical coaching guidance. Use it to scale development, surface hidden opportunities, and convert feedback into measurable behavior change — all while maintaining privacy and programmatic control.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
