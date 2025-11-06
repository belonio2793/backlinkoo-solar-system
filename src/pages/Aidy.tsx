import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ContentContainer from '@/components/ContentContainer';

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21s-7-4.35-9-7.5C-0.5 8 7 3 12 8c5-5 12.5 0 9 5.5C19 16.65 12 21 12 21z" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AidyPage() {
  useEffect(() => {
    const title = 'Aidy — Manage IBD with Better Tracking, Insights, and Doctor-Ready Reports';
    const description = 'A comprehensive guide to Aidy (tryaidy.com): the app built to help people with Crohn\'s and Colitis track symptoms, food, medications, and share clinical reports with their care teams. Features, privacy, integrations, best practices, and patient workflows.';

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
    upsertMeta('keywords', 'Aidy, tryaidy, IBD tracking, Crohn\'s, Colitis, health tracker, symptom tracker, patient reports');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/aidy');

    try {
      const ldArticle = {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        headline: title,
        description,
        mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '/aidy',
        author: { '@type': 'Organization', name: 'Backlink ∞' },
        publisher: { '@type': 'Organization', name: 'Backlink ∞' }
      } as const;

      const ldFAQ = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Aidy?',
            acceptedAnswer: { '@type': 'Answer', text: 'Aidy is an app designed for people with inflammatory bowel disease (IBD) such as Crohn\'s and Colitis to log symptoms, meals, medications, and stool data, receive personalized insights, and export reports to share with clinicians.' }
          },
          {
            '@type': 'Question',
            name: 'Is Aidy free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Aidy promotes free access to core tracking features. The team expresses a mission to help users engage care and pursue insurance coverage for advanced services.' }
          },
          {
            '@type': 'Question',
            name: 'Can I export data to share with my doctor?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Aidy includes export capabilities so users can generate clinician-friendly reports summarizing symptoms, medication adherence, dietary notes, and trends over time.' }
          }
        ]
      } as const;

      let scriptArticle = document.head.querySelector('script[data-jsonld="aidy-article"]') as HTMLScriptElement | null;
      if (!scriptArticle) {
        scriptArticle = document.createElement('script');
        scriptArticle.setAttribute('data-jsonld', 'aidy-article');
        scriptArticle.type = 'application/ld+json';
        document.head.appendChild(scriptArticle);
      }
      scriptArticle.textContent = JSON.stringify(ldArticle);

      let scriptFAQ = document.head.querySelector('script[data-jsonld="aidy-faq"]') as HTMLScriptElement | null;
      if (!scriptFAQ) {
        scriptFAQ = document.createElement('script');
        scriptFAQ.setAttribute('data-jsonld', 'aidy-faq');
        scriptFAQ.type = 'application/ld+json';
        document.head.appendChild(scriptFAQ);
      }
      scriptFAQ.textContent = JSON.stringify(ldFAQ);
    } catch {}
  }, []);

  return (
    <div className="aidy-page bg-background text-foreground">
      <Header />

      <ContentContainer
        variant="wide"
        hero={(
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white">
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm font-medium">IBD tracking • reports • care coordination</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight">Aidy — Manage IBD (Crohn's & Colitis) with Better Tracking, Insights, and Doctor-Ready Reports</h1>
            <p className="mt-3 text-lg text-slate-700 max-w-3xl mx-auto">This practical guide explains how Aidy works, who benefits most, best practices for tracking triggers and medications, how to generate clinician-ready exports, and how to protect privacy while using app-based health tools. We also cover how to publish patient resources that rank well in search and help other patients find your content.</p>
          </div>
        )}
      >

        <article className="prose prose-slate lg:prose-lg">

          <section>
            <h2>Why Aidy matters: the patient problem framed</h2>
            <p>Inflammatory bowel disease (IBD) presents variable symptoms that fluctuate with diet, medication, stress, and environment. Patients and clinicians frequently face information gaps: misremembered flare timing, incomplete medication adherence records, or uncertain trigger associations. Aidy aims to reduce uncertainty by turning daily logs into structured, shareable evidence.</p>
            <p>Well-structured symptom and food diaries lead to more informed clinical conversations, fewer avoidable ER visits, and a clearer path to personalized treatment decisions.</p>
          </section>

          <section>
            <h2>Core features and how to use them</h2>

            <h3>Daily symptom logging</h3>
            <p>Record symptoms (pain, urgency, stool consistency, bleeding) with simple inputs. The habit of logging is more valuable than capturing perfect data; frequent micro-entries create a high-fidelity timeline that clinicians can interpret.</p>

            <h3>Meal and diet tracking</h3>
            <p>Track meals using quick text, tags, or a photo. Over time, Aidy synthesizes dietary patterns and correlates them with symptom flares. Use consistent tagging (e.g., "dairy", "fiber-rich") to improve signal extraction.</p>

            <h3>Medication adherence</h3>
            <p>Log medications, doses, and missed doses. Linking administration times to symptom data helps clinicians assess treatment effectiveness and informs decisions like dose adjustments or switching therapies.</p>

            <h3>Stool charting</h3>
            <p>Many IBD care teams use stool scales (Bristol scale) as an objective measure. Aidy provides stool logging with standardized categories, enabling trend analysis and clearer symptom narratives.</p>

            <h3>IBD-specific chatbot</h3>
            <p>Aidy's chatbot offers condition-specific guidance and answers common questions. It is designed to augment—not replace—clinical advice, providing educational support and triage suggestions (e.g., when to contact a clinician).</p>

            <h3>Clinician export and summaries</h3>
            <p>Generate exportable reports that summarize symptom frequency, medication adherence, dietary patterns, and flare timelines. These clinician-ready summaries reduce intake time during visits and make telehealth sessions more productive.</p>

          </section>

          <section>
            <h2>Patient experience and workflows</h2>
            <p>Design tracking into daily life with friction-minimizing patterns. Quick wins are:</p>
            <ul>
              <li>Set a daily reminder to log a single mood and stool entry.</li>
              <li>Snap photos of meals and tag them later if you're busy.</li>
              <li>Use medication reminders to capture adherence automatically.</li>
              <li>Export a monthly report before clinical appointments.</li>
            </ul>
            <p>These small habits compound into rich longitudinal data that change care conversations.</p>
          </section>

          <section>
            <h2>Privacy, security, and data ownership</h2>
            <p>Health data is sensitive. When evaluating Aidy or similar apps, check for:</p>
            <ul>
              <li>Clear privacy policy outlining data processing, sharing, and retention.</li>
              <li>Options to export and delete your data on demand.</li>
              <li>Encryption in transit and at rest, and minimal third-party sharing.</li>
              <li>Local device options if available for extra privacy-conscious users.</li>
            </ul>
            <p>Patients should treat apps as tools to supplement care and confirm that any clinical decisions are made in consultation with their clinician.</p>
          </section>

          <section>
            <h2>Clinical integration and workflows for care teams</h2>
            <p>Care teams can use Aidy reports to: prioritize agenda items for visits, identify likely triggers, and document objective evidence for insurance or therapeutic decisions. Suggested clinical workflows:</p>
            <ol>
              <li>Patient exports a 30-day Aidy report prior to appointment.</li>
              <li>Clinician reviews key trends (stool consistency, flare clusters, medication gaps) in the EHR or an attached PDF.</li>
              <li>Team documents treatment adjustments and schedules follow-ups based on objective trends rather than recall alone.</li>
            </ol>
          </section>

          <section>
            <h2>Evidence, use cases, and outcomes</h2>
            <p>While digital tracking alone is not a panacea, structured diaries are associated with improved symptom recognition and better adherence. Use-case examples:</p>
            <h3>Identifying dietary triggers</h3>
            <p>Patients who consistently log food and symptoms can spot patterns—certain foods correlate with late-night flares or specific bowel changes—leading to targeted dietary trials under clinical supervision.</p>

            <h3>Monitoring medication effectiveness</h3>
            <p>Objective adherence data helps assess whether lack of response is due to pharmacologic failure or inconsistent dosing.</p>

            <h3>Reducing avoidable escalations</h3>
            <p>Early identification of worsening trends enables timely outpatient management and can reduce emergency visits.</p>
          </section>

          <section>
            <h2>Designing patient-centric tracking protocols</h2>
            <p>Create simple protocols that patients can maintain:</p>
            <ul>
              <li>Baseline protocol: one short log per day + meal photos as needed.</li>
              <li>Flare protocol: increase logging frequency to capture symptom trajectory.</li>
              <li>Pre-visit protocol: two weeks of focused logging before major appointments.</li>
            </ul>
          </section>

          <section>
            <h2>Publishing Aidy content and SEO guidance</h2>
            <p>If you publish patient resources, aim to rank for high-intent queries like "IBD symptom tracker", "Crohn's food diary", or "how to prepare for GI appointment". Best practices:</p>
            <ul>
              <li>Write clear headings with target keywords; include H1 with primary term "aidy" and relevant long-tail phrases.</li>
              <li>Provide transcripts and sample export visuals so search engines and readers understand the content without having to use the app.</li>
              <li>Use schema.org MedicalWebPage and FAQ markup to improve rich result eligibility.</li>
              <li>Include patient stories and anonymized examples to increase trust and time-on-page.</li>
            </ul>
          </section>

          <section>
            <h2>Testimonials and real-world voices</h2>
            <p>Representative, anonymized quotes from users (paraphrased for privacy):</p>
            <blockquote>
              "Logging meals and symptoms with Aidy helped me notice that certain late-night snacks preceded my worst episodes. That insight changed my plan with my GI." — A patient with Crohn's
            </blockquote>
            <blockquote>
              "My clinic now asks for my Aidy export before visits. It makes our conversations concrete and saves time." — A gastroenterology nurse practitioner
            </blockquote>
            <blockquote>
              "I could show a trend of missed doses and we adjusted the regimen to a once-daily formulation—my symptoms stabilized after that." — Someone with ulcerative colitis
            </blockquote>
          </section>

          <section>
            <h2>FAQ and troubleshooting</h2>
            <h3>What if I forget to log?</h3>
            <p>Don\'t worry—consistency is helpful but not perfect. Use scheduled reminders, and prioritize short entries over long blank days. Many patients build the habit by linking the log action to an existing daily cue (a morning routine or evening medication).</p>
            <h3>How do clinicians prefer receiving data?</h3>
            <p>Most clinicians appreciate concise exports summarizing key trends: frequency of flares, stool patterns, medication gaps, and notable triggers. Avoid sending raw, unfiltered logs unless requested.</p>
            <h3>Is the chatbot a replacement for medical advice?</h3>
            <p>No. The chatbot provides educational information and triage guidance but cannot replace personalized clinical assessment.</p>
          </section>

          <section>
            <h2>Implementation notes for creators and clinicians</h2>
            <p>If you create resources about Aidy—tutorials, templates, or clinic workflows—consider adding downloadable PDF templates, example exports, and clinician checklists to increase utility and linkability.</p>
          </section>

          <section>
            <h2>Research and further reading</h2>
            <p>Link authoritative resources such as Crohn\'s & Colitis Foundation guidelines, peer-reviewed literature on diary-based monitoring, and clinical decision support tools to improve credibility and SEO trust signals.</p>
          </section>

          <section>
            <h2>Conclusion and next steps</h2>
            <p>Aidy and similar patient-facing tracking tools bridge information gaps between patients and clinicians. When designed and used thoughtfully, they improve the signal clinicians need to make timely decisions and empower patients to discover meaningful patterns. For teams publishing Aidy resources or patient guidance, building backlinks from authoritative health sites and patient communities increases visibility and trust.</p>
            <p>If you publish patient resources or guides and want to amplify reach for Aidy-related content, register for Backlink ∞ to acquire authoritative links and grow organic traffic: <a href="https://backlinkoo.com/register" className="text-blue-600 underline">Register for Backlink ∞</a>.</p>
          </section>

        </article>

      </ContentContainer>

      <Footer />
    </div>
  );
}
