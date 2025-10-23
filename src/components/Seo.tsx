import React, { useEffect } from 'react';

type JsonLd = Record<string, any> | null;

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  jsonLd?: JsonLd;
}

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
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

function upsertJsonLd(id: string, json: JsonLd) {
  if (typeof document === 'undefined') return;
  if (!json) return;
  const sel = `script[data-jsonld="${id}"]`;
  let el = document.head.querySelector(sel) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-jsonld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export default function Seo({ title, description, canonical, robots = 'index, follow', jsonLd }: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) upsertMeta('description', description);
    if (robots) upsertMeta('robots', robots);
    if (canonical) upsertCanonical(canonical);
    if (description) upsertMeta('twitter:description', description);
    if (title) upsertMeta('twitter:title', title);
    if (title) upsertPropertyMeta('og:title', title);
    if (description) upsertPropertyMeta('og:description', description);

    if (jsonLd) {
      // two JSON-LD blocks: application and article if provided inside jsonLd
      upsertJsonLd('page-jsonld', jsonLd);
    }
  }, [title, description, canonical, robots, jsonLd]);

  return null;
}
