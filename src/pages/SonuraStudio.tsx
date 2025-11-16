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

const metaTitle = 'Sonura Studio — AI Music Production Studio: Create, Collaborate & Export Pro Audio';
const metaDescription = 'Sonura Studio blends AI-assisted music production, collaborative tools, and pro-level export features to help creators compose, arrange, and deliver high-quality audio for podcasts, films, games, and streaming.';

export default function SonuraStudioPage(): JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/sonura-studio`;
    } catch {
      return '/sonura-studio';
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Sonura Studio, AI music production, collaborative DAW, online music studio, stems export');
    upsertCanonical(canonical);

    injectJSONLD('sonura-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('sonura-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDescription,
      author: { '@type': 'Organization', name: 'Backlink ∞ Editorial' },
      datePublished: new Date().toISOString().slice(0,10),
      mainEntityOfPage: canonical
    });

    injectJSONLD('sonura-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Sonura Studio?', acceptedAnswer: { '@type': 'Answer', text: 'Sonura Studio is a cloud-first music production platform that combines AI-assisted composition, a collaborative workspace, and pro export tools for creators, producers, and teams.' } },
        { '@type': 'Question', name: 'Can I export stems and MIDI from Sonura Studio?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Sonura Studio supports stem exports, multi-track stems, and MIDI exports so you can finalize mixes in your preferred DAW or hand off files to collaborators.' } },
        { '@type': 'Question', name: 'Is Sonura Studio suitable for commercial releases?', acceptedAnswer: { '@type': 'Answer', text: 'Sonura Studio is designed to support professional workflows, including commercial releases. Review the platform’s licensing and distribution terms for specific use cases.' } }
      ]
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Sonura Studio — Modern AI-Assisted Music Production</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">Compose, arrange, and collaborate in a cloud-based studio that brings AI tools, pro export options, and real-time teamwork to music creators, podcasters, game composers, and sound designers.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-slate-100 text-slate-800">AI Composition</Badge>
            <Badge className="bg-slate-100 text-slate-800">Collaborative DAW</Badge>
            <Badge className="bg-slate-100 text-slate-800">Pro Exports</Badge>
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
                  <a href="#what" className="block text-blue-700">What is Sonura Studio?</a>
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
                <p className="text-sm text-gray-700">Sonura Studio accelerates music production with AI-generated ideas, an online collaborative workspace, and export options that respect professional release workflows. Ideal for creators who need speed without sacrificing quality.</p>
              </CardContent>
            </Card>
          </aside>

          <article className="lg:col-span-3 prose prose-slate max-w-none" ref={contentRef}>
            <section id="what">
              <h2>What is Sonura Studio?</h2>

              <p>Sonura Studio is a cloud-first music production environment that blends AI-assisted generation, traditional digital-audio-workstation (DAW) features, and collaborative tools. It is built for creators who want the convenience of browser-based workflows without losing export quality or professional control.</p>

              <p>Unlike simple beat-makers or restricted loop libraries, Sonura Studio offers deep control over arrangement, stems, and MIDI export — enabling musicians to prototype quickly, iterate in teams, and finalize mixes using professional toolchains. The platform targets independent artists, production studios, podcasters seeking polished themes, game audio teams needing adaptive music, and creators who benefit from remote collaboration.</p>

              <p>The product emphasizes three principles: speed, collaboration, and fidelity. Speed comes from AI-assisted composition helpers and templates. Collaboration is enabled by real-time editing, comments, and shared sessions. Fidelity is achieved through high-quality virtual instruments, thoughtful mixing tools, and flexible export formats.</p>
            </section>

            <section id="features">
              <h2>Core Features — Why Sonura Studio Stands Out</h2>

              <h3>AI-Assisted Composition & Idea Generation</h3>
              <p>Sonura Studio’s AI modules provide quick starting points: chord progressions, melodic hooks, rhythm sketches, and complete arrangement suggestions in various styles. Users can seed a project with mood, tempo, key, and instrumentation prompts. The AI then generates versions that serve as inspiration or near-complete foundations.</p>

              <h3>Professional Virtual Instruments & Effects</h3>
              <p>The platform includes a curated set of high-quality virtual instruments and effects that are tuned for clarity and mix-ready output. From realistic piano and strings to modern synths and textured pads, Sonura Studio prioritizes sonic quality so exports require minimal polishing.</p>

              <h3>Track-Level Control & Automation</h3>
              <p>Users get familiar DAW controls — multi-track mixing, automation lanes, send/return effects, and per-track EQ and compression. These tools allow precise arrangement and mixing inside the browser before exporting stems for final mastering.</p>

              <h3>Real-Time Collaboration</h3>
              <p>Invite collaborators to the same session to edit in real time or leave time-stamped comments tied to regions. Version history and branching let teams experiment without losing previous iterations.</p>

              <h3>Stems, MIDI & Multi-Format Exports</h3>
              <p>Export stereo mixes, individual stems (drums, bass, vocals, synths), MIDI files for further arrangement, and high-resolution audio files for distribution. This flexibility supports handoffs to mastering engineers or inclusion in games and visual media.</p>

              <h3>Adaptive & Looping Tools for Games</h3>
              <p>Sonura Studio offers features to produce adaptive music: layers that can be faded or switched programmatically, loop-accurate edits, and export formats compatible with game audio middleware. This makes the platform attractive for game composers who need compact, interactive assets.</p>

              <h3>Templates & Genre Presets</h3>
              <p>Start from templates tailored to common needs — podcast themes, indie-pop production, cinematic underscore, or short-form social audio. Presets help teams get consistent sonic identity quickly.</p>

              <h3>Collaboration & Rights Management</h3>
              <p>Projects include contributor roles and clear metadata for authorship and licensing. Teams can control access to stems and export rights and tag contributors for publishing credits.</p>
            </section>

            <section id="how-it-works">
              <h2>How Sonura Studio Works — Core Workflow</h2>

              <p>Sonura Studio is designed to mirror familiar DAW workflows while lowering friction through AI and cloud collaboration. The primary steps are:</p>
              <ol>
                <li><strong>Create or seed a project:</strong> Start from a template or seed AI prompts for mood, tempo, and instruments.</li>
                <li><strong>Generate & iterate:</strong> Use AI to propose ideas, then edit MIDI, adjust arrangement, or substitute instruments.</li>
                <li><strong>Collaborate:</strong> Invite co-producers or engineers to edit, comment, or audition changes in real time.</li>
                <li><strong>Mix & automate:</strong> Use track-level controls, automation, and bus routing to refine the sound.</li>
                <li><strong>Export & deliver:</strong> Export stems, MIDI, and master files ready for release, licensing, or integration into other media.</li>
              </ol>

              <p>This blend of automated assistance and manual control enables rapid prototyping without sacrificing depth for professional release workflows.</p>
            </section>

            <section id="use-cases">
              <h2>Who Benefits Most: Use Cases for Sonura Studio</h2>

              <h3>Independent Musicians & Producers</h3>
              <p>Artists who need to sketch ideas quickly or collaborate with remote producers can use Sonura Studio to move from idea to arrange-to-release faster. Stem exports allow for subsequent mastering in a desktop DAW.</p>

              <h3>Podcasters & Content Creators</h3>
              <p>Create signature themes, episode beds, and transitions with genre-tailored templates. The platform is suitable for creators who need broadcast-ready intros and jingles without hiring external composers.</p>

              <h3>Game Composers</h3>
              <p>Produce adaptive music layers and loop-ready assets that can be exported for use in engines like Unity or Unreal. Sonura Studio’s looping and layering tools simplify adaptive scoring challenges.</p>

              <h3>Advertisers & Media Producers</h3>
              <p>Produce quick variations of a theme to suit ad lengths and formats. The AI can retarget the same motif to different energy levels for platform-specific edits (15s, 30s, 60s).</p>

              <h3>Education & Collaboration</h3>
              <p>Music schools and remote classes can use Sonura Studio to teach arrangement, composition, and mixing collaboratively with students contributing in real time.</p>
            </section>

            <section id="workflow">
              <h2>Recommended Workflow: From Sketch to Release</h2>

              <p>To produce a high-quality track using Sonura Studio, try this structured workflow:</p>
              <ol>
                <li><strong>Concept:</strong> Define the goal (episode theme, song demo, game loop), mood, tempo, and reference tracks.</li>
                <li><strong>AI sketching:</strong> Use AI to generate several sketches and pick the strongest one as a foundation.</li>
                <li><strong>Arrangement:</strong> Build structure — intro, verse, chorus, bridge — and refine transitions using automation and fills.</li>
                <li><strong>Sound design & layering:</strong> Swap instruments, layer pads and textures, and refine per-track EQ and dynamics.</li>
                <li><strong>Review & collaborate:</strong> Invite collaborators for feedback, use comments to resolve notes, and iterate until the mix is balanced.</li>
                <li><strong>Export & finalize:</strong> Export stems and a high-resolution master for distribution or further mastering in a specialized DAW.</li>
              </ol>

              <p>This disciplined approach takes advantage of Sonura Studio’s speed while ensuring tracks remain production-ready when they leave the platform.</p>
            </section>

            <section id="integrations">
              <h2>Integrations & Export Options</h2>

              <p>Sonura Studio is intentionally flexible when it comes to exports and integrations so teams can use their preferred toolchains:</p>
              <ul>
                <li><strong>DAW handoff:</strong> Export stems and MIDI for importing into Ableton Live, Logic Pro, Pro Tools, or Reaper.</li>
                <li><strong>Game engines:</strong> Export looped assets and stems formatted for Wwise or FMOD integration.</li>
                <li><strong>Distribution:</strong> High-resolution WAV exports ready for mastering and distribution services.</li>
                <li><strong>Collaboration:</strong> Cloud storage integrations for project backups and shared assets (Dropbox, Google Drive).</li>
                <li><strong>Version control:</strong> Project history and branching to keep iterations organized and auditable.</li>
              </ul>
            </section>

            <section id="case-studies">
              <h2>Case Studies: How Teams Use Sonura Studio</h2>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Indie Pop Artist — From Demo to Release</CardTitle>
                </CardHeader>
                <CardContent>
                  "An indie artist used Sonura Studio to quickly prototype a demo. The AI generated strong hook variations; the artist layered vocals and exported stems for mastering. The track moved from concept to release-ready files within a week." — Independent Artist
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Mobile Game Studio — Adaptive Soundtrack</CardTitle>
                </CardHeader>
                <CardContent>
                  "We produced interactive, layered music for our mobile title and exported loop-ready stems for Wwise. Sonura Studio’s layering tools made it simple to deliver assets that scaled across levels and states." — Audio Lead, Game Studio
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Podcast Network — Branded Themes at Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  "We built a library of show themes and short stings for multiple podcasts. The templates and AI variants let us produce a consistent sound identity across shows without hiring external composers for each episode." — Podcast Producer
                </CardContent>
              </Card>
            </section>

            <section id="testimonials">
              <h2>User Testimonials</h2>

              <blockquote className="border-l-4 pl-4 italic text-gray-700">"Sonura Studio turned quick ideas into full arrangements — the collaboration features made remote co-writing feel effortless." — Music Producer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"The stems export was flawless. We imported everything into our DAW and finished the mix with minimal cleanup." — Mixing Engineer</blockquote>

              <blockquote className="border-l-4 pl-4 italic text-gray-700 mt-4">"As a game composer, the loop and layer tools saved hours when preparing interactive music for the engine." — Game Audio Composer</blockquote>
            </section>

            <section id="limitations">
              <h2>Limitations & When to Use Caution</h2>

              <p>While Sonura Studio accelerates many workflows, there are scenarios where extra care is needed:</p>
              <ul>
                <li><strong>Highly custom production chains:</strong> Complex, plugin-heavy projects might still require a desktop DAW for the final polish and plugin-specific routing.</li>
                <li><strong>Offline workflows:</strong> If collaborators need fully offline workflows, a cloud-first studio may not be suitable without local export routines.</li>
                <li><strong>Licensing & sample sources:</strong> Confirm sample licensing when using built-in libraries for commercial releases; review terms if planning wide distribution.</li>
              </ul>

              <p>For many creators, Sonura Studio functions as a primary sketching and collaboration environment, with final mastering or advanced processing done in specialized tools when necessary.</p>
            </section>

            <section id="best-practices">
              <h2>Best Practices for Professional Results</h2>
              <ol>
                <li>Start with references — upload tracks that define the desired tone and tempo to guide AI generation.</li>
                <li>Use stems early — export stems to check balance and ensure each element translates well outside the browser.</li>
                <li>Version frequently — keep iterations separate so you can revert to strong earlier takes if a later direction fails.</li>
                <li>Collaborate with roles — define who mixes, who arranges, and who masters to reduce overlap and confusion in sessions.</li>
                <li>Verify licensing — keep clear records of sample and instrument licenses for distribution and publishing.</li>
              </ol>
            </section>

            <section id="comparison">
              <h2>Comparisons: Sonura Studio vs Desktop DAWs vs Simple Beat Makers</h2>

              <p>Each tool class serves different needs:</p>
              <ul>
                <li><strong>Desktop DAWs (Logic, Ableton):</strong> Best for deep sound-design, plugin ecosystems, and mastering — more control but less immediate collaboration.</li>
                <li><strong>Simple beat-makers:</strong> Fast and easy for loops and single-track creation but limited for full arrangements and professional exports.</li>
                <li><strong>Sonura Studio:</strong> Balances speed, collaboration, and export fidelity — ideal for teams and creators who need professional exports without complex local setups.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>FAQ</h2>
              <details className="mb-3"><summary className="font-semibold">Can I finish a commercial release entirely in Sonura Studio?</summary><p className="mt-2">Many creators can take tracks from Sonura Studio to commercial release, especially with the high-quality instruments and export options. For final mastering or advanced sound design, some teams still prefer a dedicated mastering engineer or desktop DAW.</p></details>

              <details className="mb-3"><summary className="font-semibold">Does Sonura Studio use third-party samples?</summary><p className="mt-2">The platform may include licensed sample libraries. Always check the licensing terms for samples and instruments before using tracks commercially.</p></details>

              <details className="mb-3"><summary className="font-semibold">How is collaboration handled?</summary><p className="mt-2">Collaboration is real-time with session invites, comments, and version history. Roles and access controls help teams manage edits and exports securely.</p></details>
            </section>

            <section id="register" className="mt-8 mb-12">
              <h2>Amplify Reach for Your Music</h2>
              <p>After producing music and audio assets with Sonura Studio, promoting your work is the next vital step. Backlink ∞ helps artists, studios, and creators build targeted backlinks and SEO strategies that increase discoverability, drive streams, and support release campaigns.</p>
              <p className="mt-4"><a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">Register for Backlink ∞ to buy backlinks (https://backlinkoo.com/register) and get traffic using SEO with user registration</a></p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Sonura Studio represents a modern approach to music production: fast idea generation, collaborative editing, and professional exports that respect downstream production needs. For creators who work remotely, iterate quickly, or collaborate across disciplines, Sonura Studio can shrink the time from inspiration to deliverable while preserving the quality required for professional releases.</p>

              <p className="text-sm text-muted-foreground mt-6">Published by Backlink ∞ Editorial — updated {new Date().toLocaleDateString()}</p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
