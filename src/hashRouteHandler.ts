// Client-side handler that detects location.hash and fetches/render post HTML
// This runs before the main app to allow serving posts at domain.com/#slug

async function fetchAndInject(slug) {
  try {
    const api = `/.netlify/functions/fetch-post?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(api, { method: 'GET', headers: { 'Accept': '*/*' } });
    if (!res.ok) return false;

    let html = '';
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) {
      html = await res.text();
    } else {
      try {
        const j = await res.json();
        if (j && j.html) {
          html = j.html;
          if (j.title) document.title = j.title;
        }
      } catch (_) {
        // Fallback to text if JSON parse fails
        html = await res.text();
      }
    }
    if (!html) return false;

    const root = document.getElementById('root');
    if (!root) return false;
    // Extract body content if a full document is returned
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];
    root.innerHTML = html;

    const scripts = root.querySelectorAll('script');
    scripts.forEach((s) => {
      const ns = document.createElement('script');
      if (s.src) ns.src = s.src;
      ns.text = s.innerText;
      document.body.appendChild(ns);
    });
    return true;
  } catch (e) {
    // ignore
  }
  return false;
}

(async function() {
  try {
    const hash = (location.hash || '').replace(/^#/, '').trim();
    if (!hash) return;
    // Try fetch and inject
    const ok = await fetchAndInject(hash);
    if (ok) return;
    // If not found, try fetch by theme-prefixed slug
    // nothing else for now
  } catch (e) {}
})();
