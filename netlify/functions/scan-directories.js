// Netlify function: scan-directories
// Supports SERPAPI (SERPAPI_KEY) or Bing Web Search (BING_API_KEY)
// Query params: q (query), limit (number)

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const q = (params.q || 'seo directory listing').trim();
    const limit = Math.min(100, Number(params.limit || 20));

    const xApiKey = process.env.X_API || process.env.X_API_KEY || process.env.X_TWITTER_BEARER;

    if (!xApiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing X_API environment variable.' }),
      };
    }

    // Use X (Twitter) recent search to find tweets that contain links to directories/listings
    const results = [];

    const searchQuery = q && q !== 'seo directory listing' ? `${q} has:links -is:retweet lang:en` : `directory OR "submit your site" OR "add your site" OR "submit startup" OR "list your startup" OR "submit site" has:links -is:retweet lang:en`;

    const maxResults = Math.min(100, Math.max(10, limit));
    const apiUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=${maxResults}&tweet.fields=entities,lang,author_id`;

    const resp = await fetch(apiUrl, { method: 'GET', headers: { Authorization: `Bearer ${xApiKey}` } });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`X API error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    const tweets = data.data || [];
    for (const t of tweets) {
      try {
        const urls = (t.entities && t.entities.urls) || [];
        for (const u of urls) {
          const expanded = u.expanded_url || u.url;
          if (!expanded) continue;
          results.push({ url: expanded, title: t.text?.slice(0, 120) || '', snippet: t.text });
        }
      } catch (err) {
        // ignore
      }
    }

    // Normalize, dedupe by hostname and compute a basic score
    const seen = new Map();
    const keywords = ['directory', 'submit', 'list', 'add', 'startup', 'software', 'directory-listing', 'submit-site', 'add-site'];

    for (const r of results) {
      try {
        const u = new URL(r.url);
        const host = u.hostname.replace(/^www\./, '');
        if (seen.has(host)) continue;
        // score: occurrences of keywords in url/title/snippet
        const text = `${r.url} ${r.title || ''} ${r.snippet || ''}`.toLowerCase();
        let score = 0;
        for (const k of keywords) if (text.includes(k)) score += 1;
        // boost if path contains submit or add or directory
        if (u.pathname && /submit|add|directory|list|signup|apply/.test(u.pathname)) score += 1;
        seen.set(host, { url: r.url, title: r.title, snippet: r.snippet, hostname: host, score });
      } catch (err) {
        // ignore invalid urls
      }
    }

    const out = Array.from(seen.values()).sort((a, b) => b.score - a.score).slice(0, limit);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, results: out }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
    };
  }
};
