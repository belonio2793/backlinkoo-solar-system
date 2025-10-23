import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const MagazineTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <div className={`magazine-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2">
            {post.featuredImage && (
              <div className="mb-8">
                <img src={post.featuredImage as string} alt={post.title} className="w-full h-auto object-cover rounded" />
              </div>
            )}

            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-3 text-lg" style={{ color: finalStyles.secondaryColor }}>{post.excerpt}</p>}
            </header>

            <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.anchorLink && (
              <div className="mt-8">
                <a href={post.anchorLink as string} className="inline-block px-5 py-2 rounded" style={{ backgroundColor: finalStyles.accentColor, color: '#fff' }}>
                  Read more
                </a>
              </div>
            )}
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div style={{ borderLeft: `4px solid ${finalStyles.accentColor}` }} className="pl-4">
                <h4 style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>About this article</h4>
                {post.author && <p style={{ color: finalStyles.secondaryColor }}>{post.author}</p>}
                {post.publishDate && <p style={{ color: finalStyles.secondaryColor }}>{post.publishDate}</p>}
              </div>

              {post.tags && (
                <div>
                  <h5 style={{ color: finalStyles.primaryColor }}>Topics</h5>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded border" style={{ borderColor: finalStyles.accentColor, color: finalStyles.accentColor }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MagazineTemplate;
