import React, { useEffect, useState } from 'react';

const DebugRoute = () => {
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const doFetch = async () => {
      try {
        const resp = await fetch(window.location.href, { method: 'GET', credentials: 'include' });
        const text = await resp.text().catch(() => '<non-text response>');
        setFetchResult({ status: resp.status, ok: resp.ok, url: resp.url, length: text?.length ?? 0 });
      } catch (e: any) {
        setError(String(e?.message || e));
      }
    };
    doFetch();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, Roboto, system-ui, sans-serif' }}>
      <h2>Client-side Routing & Location Debug</h2>
      <section>
        <h3>Location</h3>
        <pre>{JSON.stringify({ href: window.location.href, pathname: window.location.pathname, search: window.location.search, hash: window.location.hash }, null, 2)}</pre>
      </section>

      <section>
        <h3>Document</h3>
        <pre>{JSON.stringify({ referrer: document.referrer, title: document.title }, null, 2)}</pre>
      </section>

      <section>
        <h3>Navigator</h3>
        <pre>{JSON.stringify({ userAgent: navigator.userAgent, platform: navigator.platform }, null, 2)}</pre>
      </section>

      <section>
        <h3>Attempted fetch of current URL</h3>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        {fetchResult ? <pre>{JSON.stringify(fetchResult, null, 2)}</pre> : <div>Loading...</div>}
      </section>

      <section>
        <h3>Hints</h3>
        <ul>
          <li>If fetch returns 200 but the page is not rendered, the server is serving index.html but client routing may be failing.</li>
          <li>If fetch redirects (3xx) to another host or returns a non-200, server redirects may be involved.</li>
          <li>Open DevTools Network tab and view the request for this page to see response headers and any redirects.</li>
        </ul>
      </section>
    </div>
  );
};

export default DebugRoute;
