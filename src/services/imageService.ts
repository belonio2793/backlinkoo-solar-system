export interface ImageMeta {
  url: string | null;
  alt: string;
  width?: number;
  height?: number;
  avg_color?: string | null;
  photographer?: string | null;
  photographer_url?: string | null;
  pexels_url?: string | null;
  license?: string | null;
  source?: 'pexels' | 'unsplash' | string | null;
  target_url?: string | null;
  bucket?: string | null;
  key?: string | null;
}

export class ImageService {
  static async fetchFeaturedImage(keyword: string, targetUrl: string, slug?: string): Promise<ImageMeta | null> {
    const w: any = (typeof window !== 'undefined') ? window : {};
    const base = ((import.meta as any)?.env?.VITE_NETLIFY_FUNCTIONS_URL as string | undefined)
      || w?.NETLIFY_FUNCTIONS_URL
      || w?.ENV?.VITE_NETLIFY_FUNCTIONS_URL;

    // Use netlifyInvoker so function resolution (local vs explicit) is centralized
    try {
      const { netlifyInvoker } = await import('@/utils/netlifyInvoker');
      try {
        const { data, error } = await netlifyInvoker.invoke('fetch-pexels-image', { body: { keyword, targetUrl, slug } });
        if (!error && data && (data as any).image) return (data as any).image as ImageMeta;
      } catch (e) {}

      try {
        const { data, error } = await netlifyInvoker.invoke('generate-openai-image', { body: { keyword, targetUrl, slug } });
        if (!error && data && (data as any).image) return (data as any).image as ImageMeta;
      } catch (e) {}
    } catch (e) {
      // netlifyInvoker may not be available in some contexts; fall back to previous approach
      try {
        const fnFetch = async (fn: string) => {
          const cleanBase = base ? String(base).replace(/\/$/, '') : '';
          const hasFunctionsSuffix = cleanBase ? /\/\.netlify\/functions\/?$/.test(cleanBase) : false;
          const fnName = fn.replace(/^\/.netlify\/functions\//, '').replace(/^\//, '');
          const urlFn = cleanBase
            ? (hasFunctionsSuffix ? `${cleanBase}/${fnName}` : `${cleanBase}/.netlify/functions/${fnName}`)
            : `/.netlify/functions/${fnName}`;
          const res = await fetch(urlFn, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keyword, targetUrl, slug }) });
          if (!res.ok) return null;
          const json = await res.json();
          return (json?.image as ImageMeta) || null;
        };
        const img = await fnFetch('/.netlify/functions/fetch-pexels-image');
        if (img && img.url) return img;
        const img2 = await fnFetch('/.netlify/functions/generate-openai-image');
        if (img2 && img2.url) return img2;
      } catch (err) {}
    }

    return null;
  }

  static injectFeaturedImage(contentHtml: string, image: ImageMeta, targetUrl: string, pageTitle?: string): string {
    if (!image?.url) return contentHtml;
    try {
      const html = String(contentHtml || '');
      if (/class=\"featured-image\"/i.test(html) || (image.url && html.includes(String(image.url)))) {
        return html;
      }
    } catch {}

    // Build figure HTML with SEO-friendly attributes and schema.org metadata
    const altBase = image.alt || pageTitle || 'Featured image';
    const alt = `${altBase}`;
    const widthAttr = image.width ? ` width=\"${image.width}\"` : '';
    const heightAttr = image.height ? ` height=\"${image.height}\"` : '';

    const figCaption = image.photographer && image.photographer_url
      ? `Photo by <a href=\"${image.photographer_url}\" target=\"_blank\" rel=\"noopener nofollow\">${image.photographer}</a> on Pexels`
      : '';

    const figure = `\n<figure class=\"featured-image\" itemscope itemtype=\"https://schema.org/ImageObject\">\n  <a href=\"${targetUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" itemprop=\"url\">\n    <img src=\"${image.url}\" alt=\"${alt}\" loading=\"eager\" decoding=\"async\" itemprop=\"contentUrl\"${widthAttr}${heightAttr} />\n  </a>\n  ${figCaption ? `<figcaption>${figCaption}</figcaption>` : ''}\n  ${image.width ? `<meta itemprop=\"width\" content=\"${image.width}\" />` : ''}\n  ${image.height ? `<meta itemprop=\"height\" content=\"${image.height}\" />` : ''}\n  ${image.photographer ? `<meta itemprop=\"author\" content=\"${image.photographer}\" />` : ''}\n  ${alt ? `<meta itemprop=\"caption\" content=\"${alt}\" />` : ''}\n</figure>\n`;

    // Place after the first heading if present, else at the top
    try {
      const hMatch = contentHtml.match(/<h2[^>]*>[^<]*<\/h2>/i);
      if (hMatch) {
        const idx = contentHtml.indexOf(hMatch[0]) + hMatch[0].length;
        return contentHtml.slice(0, idx) + figure + contentHtml.slice(idx);
      }
    } catch {}

    return figure + contentHtml;
  }
}

export const imageService = ImageService;
