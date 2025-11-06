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

const metaTitle = 'Spottr — Find Moments in Video Instantly: Search, Tag & Review Footage';
const metaDescription = 'Spottr makes video searchable — like Ctrl+F for video. Instantly find moments, detect objects, read text, and review clips for media, security, legal reviews, and creative workflows.';

export default function SpottrPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/spottr`;
    } catch {
      return '/spottr';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Spottr, video search, Ctrl+F for video, object detection, video review, usespottr');
    upsertCanonical(canonical);

    injectJSONLD('spottr-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('spottr-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('spottr-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Spottr?', acceptedAnswer: { '@type': 'Answer', text: 'Spottr is a video search tool that lets you find moments inside video files using text, object detection, and visual search — effectively a Ctrl+F for video.' } },
        { '@type': 'Question', name: 'What can Spottr detect?', acceptedAnswer: { '@type': 'Answer', text: 'Spottr can identify objects, read visible text, and locate moments that match search queries or tagged concepts depending on the available models and processing capabilities.' } },
        { '@type': 'Question', name: 'Who uses Spottr?', acceptedAnswer: { '@type': 'Answer', text: 'Journalists, legal teams, security analysts, content creators, and teams that need to index and review large video collections use Spottr to find relevant clips quickly.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Spottr — Search Video Like Text, Instantly</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Spottr transforms video into searchable moments. Use text queries, object recognition, and visual tags to locate the exact clip you need in seconds — ideal for media teams, security reviews, and creative editors.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">Video Search</Badge>
            <Badge className="bg-slate-100 text-slate-800">Object Detection</Badge>
            <Badge className="bg-slate-100 text-slate-800">Rapid Review</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Spottr?</a>
                  <a href="#features" className="block text-blue-700">Key features</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#workflow" className="block text-blue-700">Search workflow</a>
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
                <p className="text-sm text-gray-700">Spottr indexes video frames and applies detection models to turn footage into a searchable asset. Find clips by text, tag, or object, and export or timestamp moments for faster editing and review.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Spottr?</h2>

              <p>Spottr is built to solve a simple, painful problem: video searching is slow. When you need a particular moment — a license plate, a spoken phrase, or a specific visual cue — traditional scrubbing can take hours across many files. Spottr automates that by indexing visual and textual elements across footage and exposing a search interface where queries return precise timestamps and short previews.</p>

              <p>The product is positioned as the "Ctrl+F for video": rather than scanning transcripts or manually tagging footage, teams can search for occurrences of objects, visible text, or concepts and jump to those frames instantly. This dramatically reduces time to insight for investigative workflows, content repurposing, and audit tasks.</p>
            </section>

            <section id="features">
              <h2>Key Features</h2>

              <h3>Full-Video Indexing</h3>
              <p>Spottr processes video files, extracts frames, and indexes recognized elements. This creates a searchable catalog of moments that can be queried by keywords or tags.</p>

              <h3>Object & Text Detection</h3>
              <p>Spottr’s models identify common objects and readable text (OCR) in scenes — from vehicles and logos to on-screen captions — enabling precise searches like "Toyota Camry" or a specific serial number.</p>

              <h3>Natural-Language Search</h3>
              <p>Search with natural language queries and receive ranked results with timestamps and preview thumbnails. The interface is designed to be familiar to text search users while tuned for visual relevance.</p>

              <h3>Timestamps & Clips Export</h3>
              <p>Export found moments as timestamped clips or CSV timelines, which can be used in editing timelines, legal exhibits, or reporting workflows.</p>

              <h3>Batch Processing</h3>
              <p>Upload folders of footage and let Spottr process them in the background, making large libraries searchable without manual tagging.</p>

              <h3>Privacy & Local Options</h3>
              <p>Depending on the offering, Spottr can process footage in the cloud for scale or offer local/edge processing for privacy-sensitive scenarios where footage cannot leave the premises.</p>
            </section>

            <section id="how-it-works">
              <h2>How Spottr Works — The Pipeline</h2>

              <p>Spottr’s workflow transforms raw footage into searchable moments through a few core stages:</p>
              <ol>
                <li><strong>Ingestion:</strong> Upload or connect video sources (S3, local uploads, shared drives). Spottr normalizes files and queues them for processing.</li>
                <li><strong>Frame extraction & analysis:</strong> Frames are sampled and passed through detection models (object detection, OCR, scene classification).</li>
                <li><strong>Indexing & metadata:</strong> Detected entities and timestamps are indexed, along with contextual metadata such as timecodes, camera IDs, and file origins.</li>
                <li><strong>Search & retrieval:</strong> Users query the index and receive ranked moments with thumbnails and quick-play previews for verification.</li>
                <li><strong>Export & integrate:</strong> Selected moments can be exported as clips, annotations, or timeline CSVs for downstream tools.</li>
              </ol>

              <p>Quality and recall depend on model selection, sampling rates, and processing budgets — higher sample density and more advanced models increase detection fidelity at the cost of compute and time.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases — Who Gains the Most</h2>

              <h3>Journalists & Media Teams</h3>
              <p>Investigative teams can quickly find relevant footage across hours of video, locating precise moments that support reporting and fact-checking.</p>

              <h3>Security & Surveillance</h3>
              <p>Security analysts can search footage for matches to vehicle models, clothing colors, or specific objects, expediting incident review and response.</p>

              <h3>Legal & Compliance</h3>
              <p>Legal teams can extract evidentiary clips, generate timestamped logs for discovery, and reduce manual review time in litigation workflows.</p>

              <h3>Content Creators & Editors</h3>
              <p>Editors repurposing long-form footage for highlights or social clips can locate the best moments without scrubbing entire recordings.</p>
            </section>

            <section id="workflow">
              <h2>Search Workflow — From Query to Clip</h2>

              <p>A practical search workflow looks like this:</p>
              <ol>
                <li><strong>Upload or connect:</strong> Add files or point Spottr at a storage location.</li>
                <li><strong>Wait for indexing:</strong> Let Spottr process and index the footage. For time-sensitive tasks, prioritize smaller batches.</li>
                <li><strong>Search:</strong> Enter a natural language query or object name and review ranked results with thumbnails.</li>
                <li><strong>Verify:</strong> Play short previews to confirm relevance, adjust search terms if necessary (e.g., synonyms, scene context).</li>
                <li><strong>Export:</strong> Export timestamps, generate clips, or add moments to a review playlist for stakeholders.</li>
              </ol>

              <p>This cycle shortens review times from hours to minutes for many common tasks.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & API</h2>

              <p>Spottr often integrates with common storage and editing workflows to streamline operations:</p>
              <ul>
                <li><strong>Cloud storage:</strong> Connect S3, Google Cloud Storage, or Azure blobs for seamless ingestion.</li>
                <li><strong>NLEs & editors:</strong> Export EDLs, XML, or CSVs for import into Premiere, DaVinci, or Final Cut.</li>
                <li><strong>Case management:</strong> Push clips and annotations into legal or security case trackers via webhooks or APIs.</li>
                <li><strong>Search & discovery:</strong> Integrate with internal search tools or knowledge bases to surface video moments alongside transcripts and documents.</li>
              </ul>
            </section>

            <section id="pricing">
              <h2>Pricing & Scalability</h2>

              <p>Spottr’s pricing models typically reflect processing costs: pay-per-minute or subscription plans with included indexing hours. Factors that influence cost include sample rate, model complexity, retention duration, and whether processing happens in the cloud or locally.</p>

              <p>Lower tiers are suited for occasional search tasks or small teams, while enterprise plans include higher throughput, on-premise options, and SLAs for critical workflows.</p>
            </section>

            <section id="case-studies">
              <h2>Case Studies & Results</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Newsroom — Speeding Story Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  "A newsroom indexed hundreds of hours of press footage and cut their search time from days to hours. Reporters could locate exact moments for attribution and context without manual scrubbing." — News Editor
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Security Operations — Faster Incident Review</CardTitle>
                </CardHeader>
                <CardContent>
                  "By searching for vehicle models and visible text, our SOC reduced video review time and improved response accuracy in incidents." — Security Manager
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Creative Agency — Efficient Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  "Editors used Spottr to build highlight reels from long events, saving hours of manual review and improving turnaround time for social edits." — Post Producer
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Spottr found the one moment I needed across a week's worth of footage in under five minutes." — Investigative Reporter</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The vehicle recognition saved us time during post-incident review and made reporting more accurate." — Security Analyst</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"Exporting timestamps to our editor streamlined highlight creation — a real timesaver for social content." — Video Editor</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & Accuracy Considerations</h2>

              <p>Detection accuracy varies with video quality, resolution, obstructions, and lighting. Common limitations include:</p>
              <ul>
                <li><strong>Low-resolution footage:</strong> Small or blurred objects may not be reliably detected.</li>
                <li><strong>Occlusion & motion blur:</strong> Fast motion and occlusions reduce recognition quality.</li>
                <li><strong>Model bias:</strong> Detection models have strengths and weaknesses depending on training data — validate results and corroborate with multiple sources for critical cases.</li>
              </ul>

              <p>For high-stakes use (e.g., legal evidence), treat Spottr as a discovery and prioritization tool rather than the final authoritative source — combine automated search with human review.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Reliable Results</h2>
              <ol>
                <li>Use higher-resolution source footage when possible for better detection and OCR results.</li>
                <li>Prioritize critical time ranges and process them with higher sampling density to improve recall.</li>
                <li>Combine visual search with transcript search for better recall on spoken content.</li>
                <li>Validate critical findings with human review and multiple clips when necessary.</li>
                <li>Track and iterate on query terms — synonyms and contextual keywords often surface more relevant moments.</li>
              </ol>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">How fast does Spottr index footage?</summary><p className="mt-2">Indexing speed depends on sampling rate, model complexity, and infrastructure. Small batches can be indexed in minutes, while large libraries may take longer depending on processing quota.</p></details>

              <details className="mb-3"><summary className="font-semibold">Can Spottr read license plates or text?</summary><p className="mt-2">Spottr includes OCR capabilities for readable on-screen text and can identify objects such as vehicle models in many cases. Accuracy varies by image quality and angle.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is my footage secure?</summary><p className="mt-2">Security and privacy depend on configuration. Cloud processing requires secure storage and access controls; on-premise or edge options help keep sensitive footage within your environment.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Get More Views for Your Video Work</h2>
              <p>Once you’ve extracted and refined clips with Spottr, promoting that content is essential. Backlink ∞ helps creators, newsrooms, and agencies build targeted backlink campaigns and SEO strategies that increase visibility and drive organic traffic to your video content.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Spottr fills a vital gap for teams drowning in unwieldy footage. By turning video into searchable moments, it accelerates discovery, saves editorial time, and supports investigative and operational workflows. Use Spottr as a discovery and prioritization tool, combine it with human review for critical findings, and let it cut hours of manual work into minutes.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
