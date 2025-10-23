/*
  Fetch Backlinkoo YouTube channel uploads with best-effort strategy.
  - If YOUTUBE_API_KEY is set, use YouTube Data API v3 to fetch ALL uploads (paginated)
  - Else, resolve channelId and return latest items from the public RSS feed
*/

const DEFAULT_HANDLE = 'backlinkoo';

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const url = new URL(event.rawUrl || `https://example.com${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
    const handleParam = (url.searchParams.get('handle') || DEFAULT_HANDLE).replace(/^@+/, '').trim();
    const limitParam = url.searchParams.get('limit');
    const hardLimit = Math.max(1, Math.min(1000, Number(limitParam) || 300));

    const apiKey = process.env.YOUTUBE_API_KEY || '';

    // Step 1: Resolve channelId from handle by scraping the public page (works without API key)
    const resolveChannelId = async (handle) => {
      const res = await fetch(`https://www.youtube.com/@${encodeURIComponent(handle)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const html = await res.text();
      const m = html.match(/"channelId":"(UC[0-9A-Za-z_-]{22})"/);
      if (!m) throw new Error('Unable to resolve channelId from handle page');
      return m[1];
    };

    const channelId = await resolveChannelId(handleParam);

    // Helper to normalize response shape
    const mapVideo = (id, title, publishedAt) => ({
      id,
      title,
      publishedAt,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    });

    // If API key is available, fetch full uploads playlist with pagination
    if (apiKey) {
      const uploadsPlaylistId = `UU${channelId.slice(2)}`; // uploads playlist id

      let pageToken = '';
      const videos = [];

      // Optionally also verify via channels endpoint (not strictly required if derived)
      // But keep single path for performance.
      while (videos.length < hardLimit) {
        const apiUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        apiUrl.searchParams.set('part', 'snippet,contentDetails');
        apiUrl.searchParams.set('maxResults', '50');
        apiUrl.searchParams.set('playlistId', uploadsPlaylistId);
        apiUrl.searchParams.set('key', apiKey);
        if (pageToken) apiUrl.searchParams.set('pageToken', pageToken);

        const r = await fetch(apiUrl.toString());
        if (!r.ok) {
          const txt = await r.text().catch(() => '');
          throw new Error(`YouTube API error: ${r.status} ${txt}`);
        }
        const data = await r.json();
        const items = Array.isArray(data.items) ? data.items : [];
        for (const it of items) {
          const id = it?.contentDetails?.videoId || it?.snippet?.resourceId?.videoId;
          const title = it?.snippet?.title || '';
          const publishedAt = it?.contentDetails?.videoPublishedAt || it?.snippet?.publishedAt || '';
          if (id) videos.push(mapVideo(id, title, publishedAt));
          if (videos.length >= hardLimit) break;
        }
        pageToken = data.nextPageToken || '';
        if (!pageToken) break;
      }

      // Sort desc by publishedAt for consistency
      videos.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ channelId, uploadsPlaylistId, count: videos.length, videos })
      };
    }

    // Fallback: RSS feed returns latest ~15 items
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssRes = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!rssRes.ok) {
      const txt = await rssRes.text().catch(() => '');
      throw new Error(`RSS fetch failed: ${rssRes.status} ${txt}`);
    }
    const rss = await rssRes.text();

    const entries = [];
    const entryRegex = /<entry>[\s\S]*?<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<published>(.*?)<\/published>[\s\S]*?<\/entry>/g;
    let m;
    while ((m = entryRegex.exec(rss)) !== null) {
      const id = m[1].trim();
      const title = m[2].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const publishedAt = m[3].trim();
      entries.push(mapVideo(id, title, publishedAt));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ channelId, uploadsPlaylistId: `UU${channelId.slice(2)}`, count: entries.length, videos: entries })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: String(err && err.message ? err.message : err), videos: [] })
    };
  }
};
