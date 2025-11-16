import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
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

import ContentContainer from '@/components/ContentContainer';

export default function PrivateResumeBuilder() {
  useEffect(() => {
    const title = 'Private Resume Builder — Secure, Local-First, Open-Source Resume Generator';
    const description = 'Private Resume Builder: build, export, and share professional resumes locally. Open-source, privacy-first, and designed for professionals who want control over their data.';
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', 'private resume builder, resume generator, local resume, open source resume builder, privacy resume, secure CV builder');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'article');
    upsertPropertyMeta('og:url', typeof window !== 'undefined' ? window.location.href : '/private-resume-builder');
    upsertCanonical(typeof window !== 'undefined' ? (window.location.origin + '/private-resume-builder') : '/private-resume-builder');

    // JSON-LD
    try {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': title,
        'description': description,
        'url': typeof window !== 'undefined' ? window.location.href : '/private-resume-builder'
      };
      let script = document.head.querySelector('script[data-jsonld="private-resume-builder"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('data-jsonld', 'private-resume-builder');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(ld);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="private-resume-page bg-white text-slate-900">
      <Header />
      <ContentContainer variant="narrow" hero={(
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Private Resume Builder: Create Professional Resumes Locally and Securely</h1>
          <p className="lead text-base text-slate-700 mt-2 max-w-xl mx-auto">A privacy-first, open-source resume generator that runs on your machine — no uploads, no tracking, and full control over your career story.</p>
        </header>
      )}>

        <section>
          <h2>Why a Private Resume Builder Matters</h2>
          <p>
            In an era where data leaks and identity exposure are routine, the documents you share — your resume, CV, and portfolio — are sensitive. A private resume builder keeps control where it belongs: with you. Unlike cloud-first resume services that require account creation and store your personal history on third-party servers, a private resume builder enables you to craft and export polished resumes entirely locally or within trusted infrastructure.
          </p>
          <p>
            Privacy-first resume tools reduce attack surface: no user profiles living on a remote database, no third-party analytics tracking who viewed or edited your resume, and no surprise marketing emails. For jobseekers in high-risk fields, executives, or anyone who values privacy, building resumes without exposing your employment history to unknown services is a must.
          </p>
        </section>

        <section>
          <h2>Core Principles: Security, Simplicity, and Ownership</h2>
          <p>
            A well-designed private resume builder follows three core principles. First, security: the system minimizes data transfer and stores data encrypted when persistence is required. Second, simplicity: editing and formatting should be intuitive so users spend time on content, not settings. Third, ownership: users retain complete access to their source data — JSON, Markdown, or structured fields — and can export to multiple formats like PDF, DOCX, or plain text without vendor lock-in.
          </p>
          <ul>
            <li><strong>Local-first editing</strong>: work offline and save files on your machine or your own cloud.</li>
            <li><strong>Export flexibility</strong>: produce ATS-friendly PDFs and plain-text versions optimized for recruiters and automated systems.</li>
            <li><strong>Open-source transparency</strong>: audit code, extend templates, and contribute improvements.</li>
          </ul>
        </section>

        <section>
          <h3>Features That Matter for Hiring Success</h3>
          <p>
            Effective resumes blend clear structure with targeted content. A privacy-oriented resume generator should provide features that improve both the document's clarity and its discoverability by hiring systems.
          </p>
          <h3>1. ATS-Friendly Templates</h3>
          <p>
            Applicant Tracking Systems (ATS) are used by most companies to pre-screen resumes. Templates should favor clear headings, minimal visual noise, and semantic sections (Experience, Education, Skills). A private builder includes templates crafted for ATS compatibility while letting you export a visually appealing version for human readers.
          </p>

          <h3>2. Structured Data and Content Guidance</h3>
          <p>
            The builder captures experience as structured entries (title, company, dates, bullets with metrics). It can provide writing prompts and micro-guides: convert responsibilities into achievements, quantify outcomes, and optimize language for impact. This guidance helps users transform weak bullet points into compelling narratives that hiring managers appreciate.
          </p>

          <h3>3. Export and Sharing Options</h3>
          <p>
            Export to PDF with high-quality typography, generate Word documents for recruiters who request them, or export JSON/Markdown so you can version resumes in your own git repository. For controlled sharing, create a secure, shareable link hosted on your infrastructure or export a single-file resume that can be attached without exposing metadata.
          </p>

          <h3>4. Privacy & Encryption</h3>
          <p>
            When persistence is necessary — for example, to keep multiple resume versions — the builder uses local storage or encrypted files. Optional client-side encryption allows you to protect saved resumes with a password. No analytics scripts are embedded, and third-party fonts or CDNs should be optional to avoid network requests that leak usage data.
          </p>
        </section>

        <section>
          <h2>How It Works: From Draft to Interview</h2>
          <p>
            A typical workflow in a private resume builder is simple and focused on iterative improvement. Start with a template, fill structured fields for each role, refine bullet points with guidance, and export the finished resume. The application supports versioning so you can maintain specialized resumes for industry verticals or roles.
          </p>
          <ol>
            <li><strong>Choose a template</strong> optimized for your industry and whether you prefer ATS-first or design-forward layouts.</li>
            <li><strong>Import or start from scratch</strong> — paste your existing resume or build the timeline using structured fields to preserve semantic clarity.</li>
            <li><strong>Refine content</strong> with on-screen suggestions that focus on outcomes, metrics, and concise language.</li>
            <li><strong>Export</strong> to PDF/DOCX/Markdown and preview both the ATS version and the human-friendly version to ensure compatibility across channels.</li>
          </ol>
        </section>

        <section>
          <h2>Design & Templates: Balance Aesthetics with Compatibility</h2>
          <p>
            Templates in a private resume builder should be modular. Provide base templates for ATS (plain, single-column) and enhanced templates for designers (columns, subtle accents). Each template should be responsive when viewed in a browser and render consistently when converted to PDF. Include typographic presets and spacing options so the exported PDF visually matches the editor preview.
          </p>
        </section>

        <section>
          <h3>Advanced Capabilities: Automation, Versioning, and Integrations</h3>
          <p>
            For power users, private resume tools offer advanced features that improve workflow without compromising privacy.
          </p>
          <h3>Version Control & Git Integration</h3>
          <p>
            Store your resume source files in a private git repo so you can track changes over time. The builder can export a single JSON or Markdown file suitable for versioning, letting you branch for role-specific resumes and revert changes easily.
          </p>

          <h3>Automation & Template Variables</h3>
          <p>
            Use template variables to inject role-specific keywords, company names, or metrics. Automated replacements speed up customizing resumes for different job applications while keeping a single canonical profile.
          </p>

          <h3>Local Integrations</h3>
          <p>
            Integrate with local tooling like your password manager for secure storage, or with private cloud storage (e.g., your own Nextcloud instance) for backups. Avoid requiring OAuth to external SaaS providers that would grant them access to your personal history.
          </p>
        </section>

        <section>
          <h2>Open Source Benefits: Auditability and Extensibility</h2>
          <p>
            Open-source resume builders let the community audit security, propose features, and extend templates. Organizations can fork the project to include corporate-specific templates or internal metadata fields useful for internal recruiting workflows. If you’re in an industry that demands compliance, an open-source project enables independent verification that the tool doesn’t exfiltrate data.
          </p>
        </section>

        <section>
          <h2>Security Considerations and Best Practices</h2>
          <p>
            To maintain privacy, follow these best practices when using a resume builder:
          </p>
          <ul>
            <li><strong>Prefer local storage</strong> or encrypted files over remote accounts.</li>
            <li><strong>Audit third-party dependencies</strong> for telemetry and network calls before enabling them.</li>
            <li><strong>Use client-side encryption</strong> for saved resumes if you store them in shared locations.</li>
            <li><strong>Minimize metadata</strong> embedded in exported files (remove timestamps and author metadata when necessary).</li>
          </ul>
        </section>

        <section>
          <h3>Who Should Use a Private Resume Builder?</h3>
          <p>
            Private resume builders are ideal for professionals who prioritize confidentiality: executives, legal professionals, security personnel, or anyone applying to roles where discretion matters. They are also valuable to privacy-conscious jobseekers who prefer drafts and version history on their personal machine rather than a vendor cloud.
          </p>
        </section>

        <section>
          <h2>Comparisons: Private vs Cloud Resume Tools</h2>
          <p>
            Cloud resume services offer convenience, integrated templates, and collaboration but come with trade-offs in ownership and privacy. Private solutions trade a bit of convenience for strong data control, auditability, and flexibility in export formats. Choose based on your risk tolerance and the sensitivity of the roles you pursue.
          </p>
        </section>

        <section>
          <h2>SEO & Discoverability: Make Your Resume Work for You</h2>
          <p>
            If you publish a resume or public portfolio, consider a privacy-aware approach to sharing. Host a public, stripped-down version on your personal site that omits sensitive dates or employer details, and keep a full private copy for controlled sharing. When crafting a public profile, use targeted keywords that match your role and industry so hiring managers and search engines can discover relevant skills and achievements.
          </p>
        </section>

        <section>
          <h3>Practical Tips: Writing a Resume That Gets Read</h3>
          <p>
            A great resume is concise, quantifiable, and tailored. Use these practical tips when building your resume with a private tool:
          </p>
          <ul>
            <li><strong>Lead with impact</strong>: start bullets with clear outcomes ("Reduced costs by 30%...").</li>
            <li><strong>Use numbers</strong>: metrics catch attention and demonstrate scale.</li>
            <li><strong>Tailor per role</strong>: customize keywords and prioritize relevant achievements.</li>
            <li><strong>Keep formatting simple</strong>: especially for ATS-friendly versions.</li>
            <li><strong>Maintain a one-page classic</strong> for early-career roles; use two pages only for extensive relevant experience.</li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          <h3>Is a private resume builder hard to use?</h3>
          <p>
            No. Good private resume tools prioritize usability and provide templates, examples, and content guidance while keeping operations offline or local.
          </p>

          <h3>Can I still get modern designs without cloud storage?</h3>
          <p>
            Yes. Templates, local fonts, and client-side PDF rendering allow modern, polished exports without external dependencies.
          </p>

          <h3>How do I share my resume securely?</h3>
          <p>
            Export a password-protected PDF or host a minimal public profile and share the full resume only over encrypted channels or secure file transfer methods.
          </p>
        </section>

        <section>
          <h2>Getting Started: A Quick Setup Checklist</h2>
          <ol>
            <li>Pick the template that matches your industry and whether you need ATS compatibility.</li>
            <li>Import existing experience as structured entries, then convert duties into achievements.</li>
            <li>Run a plain-text export and an ATS-friendly preview to validate readability.</li>
            <li>Export a high-quality PDF for human reviewers and a plain-text or DOCX version for recruiters or ATS where requested.</li>
            <li>Keep versioned copies in a private git repo or encrypted backups for rollback and iteration.</li>
          </ol>
        </section>

        <section>
          <h3>Final Thoughts</h3>
          <p>
            The Private Resume Builder approach gives you control, security, and the flexibility to craft better resumes without surrendering personal data to third parties. For jobseekers who value privacy and want professional outputs, a local-first, open-source resume generator is a modern and ethical choice.
          </p>

          <p>
            If you publish or promote your resume online, pairing a privacy-first resume strategy with a deliberate SEO and backlink plan can increase visibility while preserving control. To grow traffic and authority for your public portfolio or personal site, consider investing in targeted backlinks and SEO amplification.
          </p>

          <div>
            <h3>Ready to amplify your reach?</h3>
            <p>
              Register for Backlink ∞ to get high-quality backlinks and targeted organic traffic for your public portfolio or personal site: <a href="https://backlinkoo.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Register for Backlink ∞</a>.
            </p>
          </div>
        </section>
      </ContentContainer>
      <Footer />
    </div>
  );
}
