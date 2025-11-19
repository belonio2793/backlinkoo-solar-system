import React from 'react';
import '@/styles/senuke.css';

interface SEOPageLayoutProps {
  title: string;
  subtitle: string;
  htmlContent: string;
  tableOfContents?: { title: string; id: string }[];
}

export const SEOPageLayout: React.FC<SEOPageLayoutProps> = ({
  title,
  subtitle,
  htmlContent,
  tableOfContents = [],
}) => {
  // Extract headings from htmlContent to auto-generate TOC if not provided
  const generateTOC = (html: string) => {
    const regex = /<h2[^>]*>([^<]+)<\/h2>/g;
    const matches: { title: string; id: string }[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const title = match[1].replace(/<[^>]*>/g, '').trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      matches.push({ title, id });
    }
    return matches;
  };

  const toc = tableOfContents.length > 0 ? tableOfContents : generateTOC(htmlContent);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="scrape-progress">
        <div className="scrape-progress__bar" style={{ width: '100%' }} />
      </div>

      <div className="scrape-hero">
        <div className="scrape-kicker">SEO Guide</div>
        <h1 className="scrape-title">{title}</h1>
        <p className="scrape-subtitle">{subtitle}</p>
        <div className="scrape-hero__meta">
          <span>📖 15-20 min read</span>
          <span>✓ Updated 2025</span>
          <span>⭐ Expert reviewed</span>
        </div>
        <div className="scrape-hero__cta">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Get Started
          </button>
          <a
            href="#faq"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="scrape-layout">
        {toc.length > 0 && (
          <aside className="scrape-toc">
            <h3 className="scrape-toc__title">Contents</h3>
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <article
          className="scrape-article"
          itemScope
          itemType="https://schema.org/Article"
        >
          <meta itemProp="headline" content={title} />
          <meta itemProp="description" content={subtitle} />

          <div
            dangerouslySetInnerHTML={{
              __html: htmlContent.replace(/<h2/g, '<h2 class="scrape-section" id').replace(/<section/g, '<section class="scrape-section"'),
            }}
          />

          <div className="mt-8 p-6 bg-indigo-50 border-l-4 border-indigo-600 rounded">
            <h3 className="text-lg font-semibold mb-2">Ready to improve your SEO?</h3>
            <p className="mb-4">Get expert guidance and tools to build your backlink strategy.</p>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Get Started Today
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
