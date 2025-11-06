import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'InputLock — Keep Your macOS Input Method Locked (Complete Guide)';
const metaDescription = 'InputLock keeps your preferred input method locked across macOS apps. This comprehensive guide covers features, installation, workflows, troubleshooting, privacy, and value—everything teams and individuals need to decide.';

type Section = { id: string; title: string; summary: string; paragraphs: string[] };

const sections: Section[] = [
  {
    id: 'overview',
    title: 'InputLock — Lock Your Input Method on macOS',
    summary: 'A practical introduction to InputLock: what it does, who it helps, and why a stable input method matters for productivity and accuracy.',
    paragraphs: [
      'InputLock is a focused macOS utility that ensures your preferred input method remains active regardless of app switches or transient system changes. Whether you type in multiple languages, alternate between specialized input systems, or rely on consistent text entry for code and content, InputLock removes the small but frequent friction of accidental input switching.',
      'At first glance the problem sounds minor—an input method toggles here and there—but the human cost is real: lost words, embarrassing messages, slowed typing, and context breaks. InputLock addresses the root cause by monitoring app focus and restoring your locked input method automatically, offering a quiet, reliable layer of user experience improvement.',
      'This guide explains InputLock in depth: how it works on macOS, its core features, installation and setup tips, advanced usage patterns, privacy and security considerations, troubleshooting, comparisons, pricing rationale, and adoption best practices for teams and individuals.'
    ]
  },
  {
    id: 'why-input-switching-matters',
    title: 'Why Input Switching is a Real Productivity Problem',
    summary: 'Understanding the hidden cost of input method switching explains why a small utility can deliver outsized user value.',
    paragraphs: [
      'Switching input methods can happen accidentally: keyboard shortcuts, app-specific defaults, or transient events (like remote desktop sessions) can change the active input system. For multilingual writers, a wrong input mode can produce unintelligible text—especially in languages that use different scripts or IME systems.',
      'Beyond errors, switching breaks focus. Research on attention shows that even small interruptions have measurable productivity costs because the brain needs time to re‑orient. A brief pause to notice and fix the input method is a break in flow that accumulates across a day.',
      'For technical users—developers, system administrators, and content creators—typing mistakes can disrupt command lines, code syntax, and configuration files. InputLock reduces error surfaces by restoring the preferred input method automatically, keeping the user in the intended context.'
    ]
  },
  {
    id: 'core-features',
    title: 'Core Features and Experience',
    summary: 'InputLock focuses on a concise set of features that solve the common pain points without adding complexity.',
    paragraphs: [
      'Auto‑Lock on App Switch: When you switch applications, InputLock checks the active app and restores the input method you designated for that context—or a global locked preference—preventing accidental text in the wrong script or layout.',
      'Menu Bar Quick Toggle: A compact menu bar item gives immediate control: choose an input method, lock it, unlock it, or toggle between favorites without opening system settings.',
      'Lightweight Background Process: Designed for efficiency, InputLock runs unobtrusively without draining battery or impacting system performance, making it ideal for laptops and always‑on workflows.',
      'Per‑App Preferences: Set default input methods per application. For instance, keep your editor on English US while keeping a chat app or translation app on a different input if you regularly paste in other scripts.',
      'Keyboard Shortcut Support: Quickly lock or switch the input method via shortcuts you define, enabling muscle memory-based control for power users.'
    ]
  },
  {
    id: 'how-it-works',
    title: 'How InputLock Works on macOS',
    summary: 'High‑level technical overview of what InputLock does behind the scenes—monitoring, restoring, and persisting preferences in a way that respects system integrity and privacy.',
    paragraphs: [
      'InputLock uses standard macOS accessibility and input APIs to observe application focus and the active input source. On focus change, it evaluates the desired input method for that app or falls back to the global locked input method and sets the system input source accordingly.',
      'This action is performed with minimal permissions: InputLock does not capture keystrokes or content, it only interacts with the input source and the accessibility focus stream. That reduces the surface area for privacy concerns while still delivering the desired behavior.',
      'Settings are stored locally: InputLock persists per‑app and global preferences in user defaults so behavior is consistent across reboots and updates. Updates that modify system APIs are handled gracefully by the app to prevent abrupt behavior changes after macOS upgrades.'
    ]
  },
  {
    id: 'installation-setup',
    title: 'Installation, Setup and Quick Start',
    summary: 'Step‑by‑step guidance to get InputLock up and running and configured for immediate value.',
    paragraphs: [
      'Download & Install: The app is distributed as a standard macOS installer or a signed app bundle. After downloading, move InputLock to the Applications folder and open it. If macOS warns about unsigned apps, follow the provided instructions to allow the app under System Preferences > Security & Privacy.',
      'Grant Accessibility Permissions: InputLock requires accessibility permission to detect app focus reliably. macOS will present a prompt; navigate to System Settings > Privacy & Security > Accessibility and enable InputLock. This permission is only used to observe focus events, not to read typed content.',
      'Choose a Global Lock: Open the menu bar item, select the input method (e.g., English US, Japanese IME, Chinese Pinyin), and click “Lock”. With this engaged, switching apps will no longer change your typing method unexpectedly.',
      'Per‑App Overrides: For apps where you prefer alternate methods (for example, a translation tool), open the app, select the desired input source, and use the menu item to create a per‑app rule so that when that application is active InputLock sets the stored preference automatically.'
    ]
  },
  {
    id: 'usage-patterns',
    title: 'Usage Patterns & Tips: Make InputLock Work for You',
    summary: 'Practical patterns that fit common workflows—multilingual writing, developer environments, and hybrid OS setups.',
    paragraphs: [
      'Multilingual Writers: Lock the primary writing app to your target language and set a second per‑app rule for chat or translation tools. This prevents accidental script changes when composing emails or comments.',
      'Developers & Shell Users: Keep terminal windows locked to a predictable keyboard layout to avoid accidental characters in commands. Use a shortcut to switch temporarily for copying foreign text into a README.',
      'Remote Desktop & VM Users: Remote sessions can sometimes change input sources. Use per‑app rules for virtual machine clients to preserve the host’s preferred input method when focusing the remote window.',
      'Presentation Mode: Prepare a Flow for presentations—lock the presentation app input (and a backup shortcut) so that when you switch to slides you won’t accidentally type in the wrong mode.'
    ]
  },
  {
    id: 'privacy-security',
    title: 'Privacy and Security Considerations',
    summary: 'InputLock is intentionally narrow: it changes which input source is active and monitors app focus—no keystrokes are logged or transmitted.',
    paragraphs: [
      'Local‑only Settings: Preferences and per‑app rules are stored locally in the user’s home directory and not shared with external services unless the user exports or syncs them explicitly.',
      'No Keystroke Logging: InputLock does not intercept, log, or transmit keystrokes. It requests accessibility permissions only to observe focus, and may request Input Monitoring on newer macOS versions where necessary; these permissions are documented and reversible by the user.',
      'Update & Verify: The app should be code‑signed and shipped via a trusted channel. Verify signatures when installing and review privacy policy and release notes for any changes to permissions.',
      'Enterprise Considerations: For companies with strict security postures, InputLock can be deployed with code review, internal signing, or via managed distribution channels to align with policy.'
    ]
  },
  {
    id: 'performance-footprint',
    title: 'Performance and Resource Footprint',
    summary: 'Designed to be unobtrusive—InputLock prioritizes low CPU, low memory, and minimal I/O impact.',
    paragraphs: [
      'Background Efficiency: The app monitors focus events and performs small state updates only when necessary. Idle systems see negligible CPU activity and minimal memory allocation, preserving battery life for laptops.',
      'Responsive Behavior: Restoring an input method is a near‑instant action on modern macOS systems. InputLock uses non‑blocking calls and performs updates on the UI thread only where required to keep the menu bar responsive.',
      'Compatibility: InputLock targets modern macOS versions and adapts behavior for platform changes. Where system APIs change, the app falls back to safe defaults to ensure predictable behavior rather than aggressive state changes.'
    ]
  },
  {
    id: 'comparisons',
    title: 'How InputLock Compares to Alternatives',
    summary: 'Comparing InputLock’s focused approach to broader utilities helps clarify when to adopt it and when to favor alternative solutions.',
    paragraphs: [
      'System Shortcuts and Built‑In Controls: macOS provides input management, but it doesn’t automatically restore preferred methods on app changes. InputLock fills this particular gap with per‑app persistence and auto‑restore.',
      'General Productivity Suites: Full‑featured automation suites (e.g., Keyboard Maestro) can replicate similar behavior but often require custom rules, scripts, and more privileged access. InputLock offers a simpler, dedicated UI for non‑technical users.',
      'Enterprise MDM Policies: Managed device policies can enforce certain input settings, but they are usually coarse‑grained. InputLock provides flexible per‑app granularity that complements device management rather than replaces it.'
    ]
  },
  {
    id: 'pricing-and-value',
    title: 'Pricing and Value: One-Time Licenses, Lifetime Updates',
    summary: 'InputLock adopts a simple pricing model: straightforward one‑time purchases with options for individual and small family packs.',
    paragraphs: [
      'One‑Time Purchase: A low up‑front fee secures a lifetime license and free updates—this aligns with a utility that delivers ongoing productivity gains without recurring costs.',
      'Family or Multi‑Device Bundles: For households or small teams, multi‑device bundles provide better value per device and simplify management compared to per‑device subscriptions.',
      'Value Measurement: Compare the license price to time savings—avoiding typing mistakes, faster recovery from context switches, and reduced friction in multilingual workflows all compound into measurable time saved each week.'
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting and Common Issues',
    summary: 'A practical troubleshooting checklist for common scenarios and how to resolve them.',
    paragraphs: [
      'Accessibility Permission Not Granted: If InputLock cannot observe focus, ensure Accessibility is enabled for the app in System Settings > Privacy & Security > Accessibility. Reboot after granting if the app still cannot observe focus events.',
      'Input Source Not Listed: Some specialized input methods may not appear in system lists until installed; install and enable them via System Settings > Keyboard > Input Sources before adding rules in InputLock.',
      'Conflict with Automation Tools: If other automation utilities are also controlling input sources, disable overlapping rules to avoid oscillation. Prefer server‑mediated patterns where complex orchestration is required.',
      'Unexpected Input Changes: Review per‑app rules and global locks to ensure there is not an unintended override. Use the menu bar icon to inspect the current rule set and temporarily disable the auto‑restore feature for testing.'
    ]
  },
  {
    id: 'testimonials',
    title: 'User Stories & Testimonials',
    summary: 'Representative feedback from individuals and small teams who benefit from consistent input behavior.',
    paragraphs: [
      '"As a translator, InputLock saved me from embarrassing mistakes—no more typing in the wrong script mid‑sentence." — Translator (composite)',
      '"I use an alternate layout for command line work; InputLock guarantees my terminal never receives the wrong characters when I switch windows." — Developer (composite)',
      '"On my MacBook Air the app runs quietly and reliably; the menu bar toggle is fast and predictable." — Product Manager (composite)'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices and Setup Recommendations',
    summary: 'Guidelines for configuring InputLock in personal and small team environments to maximize reliability and minimize surprises.',
    paragraphs: [
      'Start with a Global Lock: For most users, begin by locking the primary input method globally and then add per‑app exceptions as needed. This minimizes rules while covering most use cases.',
      'Use Shortcuts Sparingly: Define one or two reliable shortcuts for temporary switches. Overusing shortcuts increases accidental toggles.',
      'Document Per‑App Preferences: Keep a short internal list of per‑app rules if shared among a team so everyone understands why certain apps behave differently.',
      'Test After macOS Updates: When upgrading the OS, briefly verify InputLock behavior—API changes can occasionally require a prompt to reauthorize accessibility permissions.'
    ]
  },
  {
    id: 'faqs',
    title: 'Frequently Asked Questions',
    summary: 'Concise answers to common questions about compatibility, privacy, and behavior.',
    paragraphs: [
      'Which macOS versions are supported? InputLock supports recent macOS versions; check the download page for the minimum version (typically macOS 14.0 or later).',
      'Does InputLock record what I type? No. The app only manages which input source is active; it does not capture or transmit keystrokes.',
      'Can I sync settings across devices? The app stores settings locally. For cross‑device sync, export and import options or third‑party file sync can be used, depending on the app’s export capabilities.',
      'What should I do if the app stops working after an update? Re‑grant required permissions and verify settings. Reach out to support via the listed contact email if issues persist.'
    ]
  }
];

export default function InputLock() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/input-lock`;
    } catch {
      return '/input-lock';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const parts: string[] = [];
    sections.forEach((s) => {
      parts.push(s.summary);
      s.paragraphs.forEach((p) => parts.push(p));
    });
    const words = parts.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'InputLock, input method, macOS input, lock input method, mac input lock');
    upsertCanonical(canonical);

    injectJSONLD('inputlock-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('inputlock-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'InputLock — Keep Your macOS Input Method Locked',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: { '@type': 'Organization', name: 'Backlink ∞' },
      publisher: { '@type': 'Organization', name: 'Backlink ∞' },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: sections.map((s) => s.title)
    });

    const faqSection = sections.find((s) => s.id === 'faqs');
    const faqItems = faqSection ? faqSection.paragraphs : [];
    injectJSONLD('inputlock-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((a) => ({ '@type': 'Question', name: a.split('?')[0].trim(), acceptedAnswer: { '@type': 'Answer', text: a } }))
    });
  }, [canonical]);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-border/60 bg-white">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Keep Your Input Method Locked</span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Keep Your Input Method <span className="text-blue-600">Locked</span></h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">Tired of switching input methods constantly? InputLock automatically maintains your preferred input method across all apps on macOS, saving time and preventing typing errors.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Everything you need to evaluate InputLock for personal and team use.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Includes compatibility, privacy, and best practice guidance.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">InputLock</p>
                <p className="mt-2 text-sm text-slate-600">Lock your input method on macOS for predictable typing and fewer mistakes.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="text-slate-700 hover:text-slate-900 hover:underline" href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#register">Register</a>
              </li>
            </ul>
          </aside>

          <article className="flex flex-col gap-10 pb-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-2 text-slate-700">{section.summary}</p>
                </header>
                <div className="prose max-w-none prose-slate">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="register" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-white">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Register for Backlink ∞ to Amplify Visibility</h2>
                <p className="mt-2 text-slate-700">If you want pages like this to rank faster, strategic backlinks from relevant, authoritative sites increase topical authority and referral traffic.</p>
              </header>
              <p className="text-lg text-slate-900">
                <a className="underline text-blue-700 hover:text-blue-800" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
