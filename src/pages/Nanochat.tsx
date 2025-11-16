import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ContentContainer from '@/components/ContentContainer';

const NanoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="1.6em" height="1.6em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth={1.2} />
    <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NanochatPage() {
  useEffect(() => {
    const title = 'Nanochat — Lightweight, Local-First Chat UI for Running Small LLMs';
    const description = 'Nanochat is a minimal, open-source chat interface for running local and experimental LLMs. Learn how to self-host, configure models, optimize prompts, and adopt Nanochat in research and product workflows.';

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
    upsertMeta('keywords', 'Nanochat, nano chat, local LLM UI, karpathy nanochat, open-source chat UI, self-hosted LLM');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/nanochat');

    try {
      const ldArticle = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: title,
        description,
        mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '/nanochat',
        author: { '@type': 'Person', name: 'Backlink ∞' },
        publisher: { '@type': 'Organization', name: 'Backlink ∞' }
      } as const;

      const ldFAQ = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Nanochat?',
            acceptedAnswer: { '@type': 'Answer', text: 'Nanochat is a minimal, open-source chat interface designed for running small language models locally or in constrained environments. It is developer-friendly, privacy-conscious, and ideal for research and experimentation.' }
          },
          {
            '@type': 'Question',
            name: 'Can I run Nanochat locally?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Nanochat is designed to be lightweight and simple to run locally. It integrates with local inference backends and can also proxy to remote inference services when needed.' }
          },
          {
            '@type': 'Question',
            name: 'What models work with Nanochat?',
            acceptedAnswer: { '@type': 'Answer', text: 'Nanochat works with small open-source models that can be served locally or through lightweight inference servers. Compatibility depends on the chosen backend, but common setups include small LLaMA variants and community models optimized for CPU/GPU.' }
          }
        ]
      } as const;

      let scriptArticle = document.head.querySelector('script[data-jsonld="nanochat-article"]') as HTMLScriptElement | null;
      if (!scriptArticle) {
        scriptArticle = document.createElement('script');
        scriptArticle.setAttribute('data-jsonld', 'nanochat-article');
        scriptArticle.type = 'application/ld+json';
        document.head.appendChild(scriptArticle);
      }
      scriptArticle.textContent = JSON.stringify(ldArticle);

      let scriptFAQ = document.head.querySelector('script[data-jsonld="nanochat-faq"]') as HTMLScriptElement | null;
      if (!scriptFAQ) {
        scriptFAQ = document.createElement('script');
        scriptFAQ.setAttribute('data-jsonld', 'nanochat-faq');
        scriptFAQ.type = 'application/ld+json';
        document.head.appendChild(scriptFAQ);
      }
      scriptFAQ.textContent = JSON.stringify(ldFAQ);
    } catch {}
  }, []);

  return (
    <div className="nanochat-page bg-background text-foreground">
      <Header />

      <ContentContainer
        variant="wide"
        hero={(
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white">
              <NanoIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Local-first • Minimal • Open-source</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight">Nanochat — A Practical Guide to Lightweight, Local Chat Interfaces</h1>
            <p className="mt-3 text-lg text-slate-700 max-w-3xl mx-auto">Nanochat is a minimal, developer-focused chat UI built for experimenting with small language models locally or in resource-constrained environments. This guide covers architecture, deployment, model selection, prompt engineering, privacy considerations, and how teams use Nanochat for research, prototyping, and private chat services.</p>
          </div>
        )}
      >

        <article className="prose prose-slate lg:prose-lg">

          <section>
            <h2>Executive summary</h2>
            <p>Nanochat is a practical tool: intentionally small, opinionated, and easy to run. Instead of the complexity of full-featured chat platforms, Nanochat focuses on the essentials—streaming chat UI, simple backend wiring, and low-friction model integration. That makes it ideal for researchers, engineers, and makers who want to run experiments locally, preserve privacy, and iterate quickly.</p>

            <p>In this article we explain the core design goals behind Nanochat, how to set it up in different environments, and patterns for making it part of your prototyping and product workflows. We also cover comparisons with hosted chat platforms, security considerations, and practical recipes for maximizing value while keeping operational complexity low.</p>
          </section>

          <section>
            <h2>What Nanochat is and why it matters</h2>
            <p>At its core, Nanochat is a minimal chat UI that connects to an inference backend. The ethos is simplicity: readable code, few dependencies, and predictable behavior. Key benefits include:</p>
            <ul>
              <li><strong>Local-first execution:</strong> Run models on your own hardware or a trusted server to keep data private.</li>
              <li><strong>Lightweight stack:</strong> Minimal runtime dependencies, making it easy to audit and modify.</li>
              <li><strong>Developer ergonomics:</strong> Easy to extend for custom behaviors (system prompts, logging, streaming hooks).</li>
              <li><strong>Experimentation-friendly:</strong> Rapidly prototype model and prompt changes without dealing with heavy orchestration layers.</li>
            </ul>
          </section>

          <section>
            <h2>Typical architecture and components</h2>
            <p>Although Nanochat keeps the architecture small, understanding the components helps you scale responsibly.</p>
            <ul>
              <li><strong>Frontend UI:</strong> A single-page chat interface that handles streaming tokens, user input, and history UI. It is intentionally minimal to minimize cognitive overhead and customization complexity.</li>
              <li><strong>Backend bridge:</strong> A tiny server that proxies chat messages to an inference backend and streams token outputs to the client. This bridge can run locally or on a small VPS.</li>
              <li><strong>Inference backend:</strong> The model-serving component. This can be a local inference engine (PyTorch, GGML-based runtimes) or a remote API that accepts prompt and returns token streams.</li>
              <li><strong>Storage (optional):</strong> For persistence and analytics, you can add a small database to store conversations, metadata, and evaluation logs. Keep privacy requirements in mind.</li>
            </ul>

            <p>This separation keeps the UI decoupled from specific model backends and enables flexible deployment: fully local, local with remote model, or remote with proxying.</p>
          </section>

          <section>
            <h2>Getting started: quick local run</h2>
            <p>A typical quick-start uses a local inference runtime and the Nanochat frontend connected via a local bridge. Steps include:</p>
            <ol>
              <li>Clone the repository and install minimal dependencies.</li>
              <li>Start the inference server or point Nanochat to a local model endpoint.</li>
              <li>Run the Nanochat bridge to proxy requests and stream outputs.</li>
              <li>Open the frontend and start a conversation. Use system messages to set behavior and test prompt variations.</li>
            </ol>

            <p>The emphasis is on low friction: the goal is to be chatting with your model within minutes for rapid iteration.</p>
          </section>

          <section>
            <h2>Model selection and trade-offs</h2>
            <p>Choosing a model for Nanochat depends on your goals and hardware constraints:</p>
            <ul>
              <li><strong>Tiny models (CPU-friendly):</strong> Great for experimentation and privacy. Expect limited capabilities but fast turnarounds and low cost.</li>
              <li><strong>Medium models (small GPUs):</strong> Provide substantially better completions and context handling with moderate hardware requirements.</li>
              <li><strong>Large models (multi-GPU or remote APIs):</strong> For production-grade interactions, use larger models via remote inference providers or optimized server clusters.</li>
            </ul>

            <p>Consider latency, cost, and privacy when choosing a model. For many research and prototyping tasks, small models offer an excellent balance between speed and utility.</p>
          </section>

          <section>
            <h2>Prompt engineering & system messages</h2>
            <p>Because Nanochat is used for research and experimentation, investing in prompt design yields outsized returns. Recommendations:</p>
            <ul>
              <li><strong>Use clear system messages:</strong> Set the assistant's role, constraints, and expected output format at the start of a session.</li>
              <li><strong>Prefer structured outputs:</strong> When you need machine-readable results, ask the model to respond in JSON or a well-defined schema.</li>
              <li><strong>Chunking long context:</strong> For large documents, feed content incrementally and use summarization anchors to maintain context efficiently.</li>
              <li><strong>Temperature and sampling:</strong> Lower temperature (e.g., 0–0.4) for deterministic outputs; higher temperature for creativity and exploration.</li>
            </ul>

            <p>Document prompt templates and system messages so collaborators can reproduce experiments reliably.</p>
          </section>

          <section>
            <h2>Privacy, data handling, and security</h2>
            <p>One of Nanochat's core advantages is enabling local-first workflows. Follow these practices to keep data safe:</p>
            <ul>
              <li><strong>Keep inference local:</strong> When privacy matters, serve models locally and avoid remote APIs that log inputs.</li>
              <li><strong>Encrypt persisted data:</strong> If you store conversations, encrypt them at rest and limit access to authorized personnel only.</li>
              <li><strong>Access controls:</strong> Protect the bridge and model endpoints behind authentication and network rules to prevent misuse.</li>
              <li><strong>PII redaction:</strong> Implement redaction or tokenization for sensitive fields before sending prompts to any remote provider.</li>
            </ul>

            <p>These minimal controls enable many private workflows while preserving the agility of local experimentation.</p>
          </section>

          <section>
            <h2>Integrations and extensions</h2>
            <p>Nanochat is intentionally small but easy to extend. Common integrations include:</p>
            <ul>
              <li><strong>Document loaders:</strong> Connect your knowledge base or local files to the bridge and provide context to the model for retrieval-augmented generation (RAG).</li>
              <li><strong>Evaluation hooks:</strong> Add automatic evaluation of responses with unit tests or scoring metrics to iterate on prompts and model choice.</li>
              <li><strong>Streaming analytics:</strong> Capture token-level latency and quality metrics to diagnose model behavior and performance.</li>
              <li><strong>Custom UIs:</strong> Swap the simple chat interface for domain-specific UI (form-fillers, assistants for code, or structured data extraction).</li>
            </ul>

            <p>Extensibility keeps Nanochat useful as projects grow while preserving the simplicity that makes it approachable.</p>
          </section>

          <section>
            <h2>Use cases: research, prototyping, and private assistants</h2>
            <p>Nanochat lends itself to several concrete use cases:</p>
            <h3>Research experiments</h3>
            <p>Researchers use Nanochat to rapidly test model behavior and prompt interventions without the overhead of complex platforms.</p>

            <h3>Product prototypes</h3>
            <p>Product teams build lightweight assistants or proof-of-concepts to validate features before investing in larger infrastructure.</p>

            <h3>Private chat services</h3>
            <p>Organizations deploy Nanochat internally for domain-specific assistants when privacy and data control are top priorities.</p>
          </section>

          <section>
            <h2>Performance tuning and scaling</h2>
            <p>Even with small setups, performance matters. Here are pragmatic tips:</p>
            <ul>
              <li><strong>Batching and streaming:</strong> Stream tokens to the client to improve perceived responsiveness rather than waiting for full outputs.</li>
              <li><strong>Optimize model runtimes:</strong> Use quantized runtimes (GGML, 4-bit/8-bit) where appropriate to reduce memory usage and improve inference speed.</li>
              <li><strong>Cache common prompts:</strong> Cache deterministic responses for common queries to reduce repeat inference costs.</li>
              <li><strong>Graceful degradation:</strong> Fallback to smaller models or canned responses when resources are constrained.</li>
            </ul>
          </section>

          <section>
            <h2>Monitoring, logging, and evaluation</h2>
            <p>To iterate effectively, collect signals that matter:</p>
            <ul>
              <li>Latency percentiles for token streaming and total response time.</li>
              <li>Quality metrics: BLEU/ROUGE for structured tasks, or human-annotated quality scores for free-form responses.</li>
              <li>Failure rates and reasons (OOM, timeouts, backend errors).</li>
              <li>User satisfaction signals (thumbs up/down, explicit feedback forms).</li>
            </ul>

            <p>Combine automated metrics with periodic human evaluation to maintain alignment and performance as models and prompts change.</p>
          </section>

          <section>
            <h2>Comparisons: Nanochat vs hosted chat platforms</h2>
            <p>Nanochat's value is in its simplicity and privacy-first stance. How it compares:</p>
            <ul>
              <li><strong>Vs. SaaS chat APIs:</strong> Hosted APIs offer scale and quality but often log data and incur costs; Nanochat prioritizes control and low overhead.</li>
              <li><strong>Vs. orchestration frameworks:</strong> Full frameworks (LangChain, LlamaIndex) provide powerful primitives for RAG and workflows—use Nanochat when you need a minimal UI and quick experiments.</li>
              <li><strong>Vs. full assistants:</strong> Production assistants include complex state, permissions, and analytics; Nanochat is intentionally narrower to reduce complexity.</li>
            </ul>
          </section>

          <section>
            <h2>Troubleshooting and common issues</h2>
            <h2>Slow model responses</h2>
            <p>Symptoms: high latency or token stalls. Fixes: switch to a quantized runtime, reduce model size, or increase available CPU/GPU resources.</p>

            <h3>Token streaming glitches</h3>
            <p>Symptoms: partial output or stream interruptions. Fixes: ensure WebSocket or SSE connections are stable, implement chunked transfers on the bridge, and add reconnection logic in the frontend.</p>

            <h3>Authentication failures</h3>
            <p>Symptoms: bridge cannot reach model endpoint. Fixes: verify credentials, check firewall rules, and confirm that endpoints accept the expected protocol.</p>
          </section>

          <section>
            <h2>Best practices and playbook for teams</h2>
            <ol>
              <li>Start with a local prototype to validate model and prompt choices.</li>
              <li>Document system messages and prompt templates for reproducibility.</li>
              <li>Instrument conversations and collect quality signals early.</li>
              <li>Automate evaluation for focused tasks (e.g., extraction accuracy) and use human checks for open-ended quality assessments.</li>
              <li>Plan a migration path to more robust infra if usage grows (managed inference, batching services, or cloud GPUs).</li>
            </ol>
          </section>

          <section>
            <h2>Case studies and success stories</h2>
            <h3>Academic research lab</h3>
            <p>A research group used Nanochat to run prompt-sensitivity experiments on small models locally. Outcome: reproducible experiments and quick iteration on prompt families without paying for hosted APIs.</p>

            <h2>Privacy-first startup</h2>
            <p>A startup delivered an internal knowledge assistant by running a small model on-prem and exposing it through Nanochat. Outcome: improved internal search and private assistant functionality without sending data to external providers.</p>
          </section>

          <section>
            <h2>Testimonials</h2>
            <blockquote>"Nanochat let us prototype an internal assistant in a single afternoon—no vendor lock-in and no surprises with data sharing." — ML Engineer, Research Lab</blockquote>
            <blockquote>"The minimal codebase made it easy to adapt the UI for our domain-specific workflows and add evaluation hooks." — Product Engineer, Privacy Startup</blockquote>
          </section>

          <section>
            <h2>Frequently asked questions (expanded)</h2>
            <h3>Do I need a GPU to run Nanochat?</h3>
            <p>Not necessarily. Tiny models and CPU-optimized runtimes allow you to run Nanochat on modest hardware. For richer conversations or larger models, GPUs significantly improve latency and throughput.</p>

            <h3>How do I keep conversations private?</h3>
            <p>Run the inference backend locally, avoid remote providers that log inputs, encrypt stored conversations, and restrict access to bridge endpoints.</p>

            <h3>Can I integrate Nanochat with my knowledge base?</h3>
            <p>Yes—connect a document loader to your bridge and implement retrieval steps that prepend relevant context to prompts for RAG-style responses.</p>
          </section>

          <section>
            <h2>Resources and next steps</h2>
            <p>Next steps to adopt Nanochat safely and effectively:</p>
            <ol>
              <li>Choose a model runtime that matches your hardware and privacy needs.</li>
              <li>Run a local prototype and measure latency and quality for representative prompts.</li>
              <li>Instrument logs and collect user feedback to guide prompt tuning.</li>
              <li>Plan for operational controls (access, encryption, backups) if you persist conversations.</li>
            </ol>

            <p>If you publish Nanochat experiments, tutorials, or case studies and want to amplify reach, acquiring authoritative backlinks drives organic discovery. Register for Backlink ∞ to acquire high-quality links and grow traffic to your Nanochat resources: <a href="https://backlinkoo.com/register" className="text-blue-600 underline">Register for Backlink ∞</a>.</p>
          </section>

        </article>

      </ContentContainer>

      <Footer />
    </div>
  );
}
