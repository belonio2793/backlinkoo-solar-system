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

const metaTitle = 'EraseVideo — AI-Powered Local Video Cleanup: Remove Watermarks & Artifacts Offline';
const metaDescription = 'EraseVideo removes logos, watermarks and unwanted overlays from videos using AI models that run locally. Learn how it works, best practices, privacy considerations, workflows, and use cases for creators and editors.';

export default function EraseVideoPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/erasevideo`;
    } catch {
      return '/erasevideo';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'EraseVideo, remove watermark, video cleanup, AI video editor, privacy-first, offline video processing');
    upsertCanonical(canonical);

    injectJSONLD('erasevideo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('erasevideo-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('erasevideo-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is EraseVideo?', acceptedAnswer: { '@type': 'Answer', text: 'EraseVideo is a privacy-focused application that removes watermarks and overlays from video content using AI models that run locally on your machine.' } },
        { '@type': 'Question', name: 'Does EraseVideo require internet?', acceptedAnswer: { '@type': 'Answer', text: 'No — EraseVideo processes videos offline on supported devices, which helps keep your media private and avoids uploading content to third-party servers.' } },
        { '@type': 'Question', name: 'Is removing watermarks legal?', acceptedAnswer: { '@type': 'Answer', text: 'Legal considerations depend on content ownership and licensing. Removing watermarks without rights may violate terms or copyright; always ensure you have the right to edit the content.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">EraseVideo — Clean Video, Keep Privacy: AI Cleanup That Runs Locally</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">EraseVideo uses on-device AI to remove watermarks, logos, and unwanted overlays from video clips. It offers a fast, privacy-first workflow for creators who need clean footage without uploading sensitive content to the cloud.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">On-device AI</Badge>
            <Badge className="bg-slate-100 text-slate-800">Privacy-first</Badge>
            <Badge className="bg-slate-100 text-slate-800">Quick results</Badge>
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
                  <a href="#what" className="block text-blue-700">What is EraseVideo?</a>
                  <a href="#how-it-works" className="block text-blue-700">How it works</a>
                  <a href="#features" className="block text-blue-700">Features & limits</a>
                  <a href="#workflow" className="block text-blue-700">Recommended workflow</a>
                  <a href="#use-cases" className="block text-blue-700">Use cases</a>
                  <a href="#legal" className="block text-blue-700">Legal & ethics</a>
                  <a href="#faq" className="block text-blue-700">FAQ</a>
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">EraseVideo delivers private, on-device watermark removal and video cleanup using AI models optimized for consumer hardware. It's ideal for creators who need fast, offline processing for short clips.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is EraseVideo?</h2>

              <p>EraseVideo is an application that leverages machine learning models to detect and remove visual overlays such as watermarks, logos, and timecodes from video footage. Unlike cloud-based services that send your media to remote servers, EraseVideo’s distinguishing feature is its on-device processing model — the AI runs locally on your machine, which preserves privacy and eliminates the need to upload potentially sensitive footage.</p>

              <p>The app is designed for simplicity: drag and drop a clip, set any available options, and let the model process the frames. Developers of EraseVideo focus on balancing speed and quality — for example, processing a short clip quickly on Apple Silicon while maintaining acceptable visual fidelity.</p>

              <p>EraseVideo appeals to content creators, editors, and hobbyists who want to clean up clips for personal compilations, educational projects, or to remove accidental overlays before further editing. It is not a substitute for advanced compositing workflows in professional NLEs, but rather a complementary tool for quick cleanup tasks.</p>
            </section>

            <section id="how-it-works">
              <h2>How EraseVideo Works — The Technology Simplified</h2>

              <p>At a high level, EraseVideo uses convolutional neural networks and image inpainting techniques adapted for video. The pipeline typically includes:</p>
              <ol>
                <li><strong>Detection:</strong> A model identifies regions of each frame likely to be overlays — logos, timestamps, or watermarks. Detection may be automatic or assisted by simple user input in more advanced versions.</li>
                <li><strong>Masking:</strong> The detected regions are converted into masks that indicate which pixels require replacement or inpainting.</li>
                <li><strong>Temporal inpainting:</strong> Rather than treating each frame independently (which can cause flicker), temporal models or frame-to-frame consistency techniques ensure the filled pixels look coherent across time.</li>
                <li><strong>Refinement:</strong> Post-processing steps such as color matching and edge softening help blend the inpainted patches into the surrounding content.</li>
              </ol>

              <p>For on-device performance, models are often quantized or optimized to run efficiently on target hardware. Some implementations use separate quality profiles — faster, lower-quality passes for quick previews and slower, higher-quality passes for final exports.</p>
            </section>

            <section id="features">
              <h2>Features & Typical Limits</h2>

              <p>EraseVideo emphasizes a few pragmatic features for a frictionless experience:</p>
              <ul>
                <li><strong>Drag-and-drop processing:</strong> Minimal setup; users simply drop a video file and the app processes it using the chosen quality preset.</li>
                <li><strong>On-device AI:</strong> Processing happens locally to protect privacy and avoid upload times or bandwidth costs.</li>
                <li><strong>Quick preview:</strong> Fast preview passes provide a near-instant look at results with an option to run a higher-quality export afterward.</li>
                <li><strong>Free tier limits:</strong> Some offerings provide a daily free quota (for example, two processed videos per day) to let users evaluate capabilities without signing up.</li>
                <li><strong>Platform support:</strong> Initially targeting macOS with M1/M2 optimizations; desktop and platform expansion plans may be in the roadmap.</li>
              </ul>

              <p>Because the app runs locally, processing time depends heavily on hardware. A 15-second clip might process in under a minute on recent Apple Silicon, while older machines may take longer. For longer or high-resolution footage, consider trimming the region of interest before processing or using proxy files to save time.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: Clean Fast, Edit Later</h2>

              <p>EraseVideo works best as part of a larger editing workflow. Here is an efficient sequence that balances speed and quality:</p>
              <ol>
                <li><strong>Identify the segment:</strong> Isolate the clip or range that needs cleanup. Short clips are faster to process and reduce the chance of artifacts across scenes.</li>
                <li><strong>Run a quick pass:</strong> Use the app’s fast preview mode to evaluate initial results. If artifacts or flicker appear, adjust settings or mark frames that need manual attention.</li>
                <li><strong>Refine and export:</strong> Run a higher-quality pass for the final output, then import the cleaned clip into your NLE for further editing, color grading, and audio work.</li>
                <li><strong>Quality check:</strong> Scrub the cleaned clip to ensure temporal consistency; use frame blending or manual corrections in your NLE if necessary.</li>
              </ol>

              <p>This workflow reduces heavy NLE time spent on cleanup and gives editors a clean starting point for creative work.</p>
            </section>

            <section id="use-cases">
              <h2>Use Cases — Who Benefits</h2>

              <h3>Content Creators & Social Editors</h3>
              <p>Creators repurposing clips for compilations, montages, or educational videos can quickly remove distracting overlays without exporting large projects or learning complex compositing tools.</p>

              <h3>Educators & Trainers</h3>
              <p>Instructional footage sometimes contains burned-in timestamps or watermarks that distract learners. EraseVideo helps produce clean instructional materials for classrooms or online courses.</p>

              <h3>Archivists & Hobbyists</h3>
              <p>People restoring old footage or cleaning home videos may find the tool useful for removing timestamps or camcorder overlays before archiving or sharing.</p>

              <h3>Pre-production & Proxy Workflows</h3>
              <p>For quick client reviews or short-form edits, teams can clean clips locally and share lighter proxies without exposing raw production assets to external servers.</p>
            </section>

            <section id="legal">
              <h2>Legal & Ethical Considerations</h2>

              <p>Removing watermarks and logos raises legal and ethical concerns. Consider the following guidelines:</p>
              <ul>
                <li><strong>Respect rights:</strong> Do not remove watermarks or logos from content you do not own or have explicit permission to edit. Watermarks often indicate ownership or licensing terms.</li>
                <li><strong>Avoid misrepresentation:</strong> Edited content should not be used to mislead viewers about origin, authorship, or authenticity.</li>
                <li><strong>Attribution:</strong> When in doubt, seek permission and provide attribution to the original creator rather than removing identifying information.</li>
                <li><strong>Educational & archival exceptions:</strong> Some uses such as restoration, critique, or fair use contexts may permit limited removal, but verify local laws and platform policies.</li>
              </ul>

              <p>Many platforms prohibit the removal of watermarks from videos they host. Always consult terms of service and, when necessary, legal guidance before altering third-party content.</p>
            </section>

            <section id="quality-tips">
              <h2>Tips to Improve Results</h2>

              <ul>
                <li><strong>Shorter clips:</strong> Process shorter ranges where overlays appear consistently to reduce temporal mismatch.</li>
                <li><strong>Stable backgrounds:</strong> Inpainting works best when the background behind a watermark is relatively uniform or predictable.</li>
                <li><strong>Use proxies:</strong> Create low-res proxies for preview passes to save time, and run the final pass on full-resolution media.</li>
                <li><strong>Manual cleanup:</strong> Use NLE touchups for the frames that need specific attention—e.g., cloning, patching, or manual rotoscoping.</li>
                <li><strong>Frame blending:</strong> If flicker appears, experiment with temporal smoothing or frame blending to improve consistency.</li>
              </ul>
            </section>

            <section id="case-studies">
              <h2>Examples & Early Feedback</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Quick Social Edit — Short Promo</CardTitle>
                </CardHeader>
                <CardContent>
                  "A creator removed a network watermark from a short clip for a compilation reel and then re-exported it for social use. The quick pass saved hours compared to manual masking in an NLE." — Social Editor
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Home Video Cleanup</CardTitle>
                </CardHeader>
                <CardContent>
                  "An enthusiast cleaned timestamps from digitized home videos before archiving them. The local processing meant private footage never left the computer." — Archivist
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Rapid Preview for Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  "The agency used EraseVideo to create client-facing proxies without exposing original assets to cloud uploads during early-stage reviews." — Creative Producer
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"EraseVideo processed a short clip on my M1 Mac in under a minute and the result was surprisingly clean for a quick pass." — Content Creator</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"I liked that nothing was uploaded — it’s reassuring when working with private footage." — Video Editor</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The app saved me a lot of manual rotoscoping when preparing social edits." — Social Media Manager</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When Not to Use It</h2>

              <p>EraseVideo is a helpful tool for quick cleanup, but it's not a replacement for advanced compositing. Situations where you should consider a different approach include:</p>
              <ul>
                <li><strong>Complex motion and occlusion:</strong> When overlays intersect with moving subjects or complex occlusions, automated inpainting may fail or create artifacts.</li>
                <li><strong>High-resolution feature films:</strong> Feature-grade restoration and VFX require specialized pipelines and manual artistry.</li>
                <li><strong>Legal constraints:</strong> If watermark removal violates licensing or platform policy, do not use the tool for that content.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Can EraseVideo remove any watermark?</summary><p className="mt-2">Effectiveness varies. Simple logos and timecodes on consistent backgrounds are easier to remove than complex, semi-transparent overlays over moving subjects.</p></details>

              <details className="mb-3"><summary className="font-semibold">Is my video uploaded?</summary><p className="mt-2">No — EraseVideo processes video locally in its typical configuration, keeping files on your device unless you manually share them.</p></details>

              <details className="mb-3"><summary className="font-semibold">What file formats are supported?</summary><p className="mt-2">Supported formats depend on the app build; commonly supported formats include MP4, MOV, and other standard consumer codecs. Check the app documentation for a complete list.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Drive Discovery for Your Cleaned Content</h2>
              <p>Once you prepare polished, watermark-free clips for sharing, the next step is visibility. Backlink ∞ helps creators, agencies, and publishers build targeted backlinks and SEO campaigns that increase organic reach and bring more viewers to your video content.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">EraseVideo fills a niche in the creator toolkit: quick, private, on-device cleanup for short clips. When combined with good ethical practices and proper rights management, it can save time and keep sensitive media out of the cloud. Use it as a fast-first pass before committing to heavier editing or professional compositing.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
