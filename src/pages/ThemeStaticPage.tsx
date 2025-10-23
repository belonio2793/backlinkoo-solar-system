import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useParams } from 'react-router-dom';

const tryPaths = (theme: string, page: string) => {
  const bases = [`/${theme}`, `/themes/${theme}`];
  const out: string[] = [];
  for (const base of bases) {
    out.push(`${base}/${page}.html`, `${base}/${page}/index.html`, `${base}/${page}.htm`, `${base}/${page}/index.htm`);
  }
  return out;
};

const ThemeStaticPage: React.FC = () => {
  const { theme, page } = useParams<{ theme: string; page: string }>();
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!theme || !page) {
        if (!mounted) return;
        setError('Invalid theme or page');
        return;
      }

      const paths = tryPaths(theme, page);
      let lastErr: any = null;

      for (const p of paths) {
        try {
          const res = await fetch(p, { cache: 'no-store' });
          if (!res.ok) {
            lastErr = new Error(`Failed to load ${p} (${res.status})`);
            continue;
          }
          const txt = await res.text();
          if (!mounted) return;
          // Ensure a footer exists on the served theme page. If missing, inject a minimal footer
          let finalHtml = txt;
          try {
            if (!/<footer\b/i.test(finalHtml)) {
              const host = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '{{domain}}';
              const injectedFooter = `\n<footer style="margin:16px 0;text-align:center;color:#6b7280;font-size:14px">\n  <nav aria-label="Legal" class="legal-links">\n    <a href="privacy-policy.html" style="color:inherit">Privacy Policy</a> · <a href="terms-and-conditions.html" style="color:inherit">Terms &amp; Conditions</a> · <a href="contact-us.html" style="color:inherit">Contact Us</a>\n  </nav>\n  <div>© <span id="theme-footer-year"></span> ${host}</div>\n</footer>\n<script>document.getElementById('theme-footer-year') && (document.getElementById('theme-footer-year').textContent = new Date().getFullYear());</script>`;

              if (/<\/body>/i.test(finalHtml)) {
                finalHtml = finalHtml.replace(/<\/body>/i, injectedFooter + '\\n</body>');
              } else {
                finalHtml = finalHtml + injectedFooter;
              }
            }
          } catch (e) {
            // If anything goes wrong, fall back to original fetched content
            finalHtml = txt;
          }

          setHtml(finalHtml);
          setError(null);
          return;
        } catch (e) {
          lastErr = e;
        }
      }

      if (!mounted) return;
      setError(lastErr?.message || 'Failed to load theme page');
    })();

    return () => {
      mounted = false;
    };
  }, [theme, page]);

  if (!html && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h2 className="text-xl font-semibold">Theme page not available</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <p className="mt-4 text-sm">Checked paths:</p>
        <ul className="mt-2 list-disc list-inside text-sm">
          {tryPaths(theme || '', page || '').map(p => (
            <li key={p} className="text-xs break-all">{p}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="prose max-w-none p-6">
      <div dangerouslySetInnerHTML={{ __html: html || '' }} />
    </div>
  );
};

export default ThemeStaticPage;
