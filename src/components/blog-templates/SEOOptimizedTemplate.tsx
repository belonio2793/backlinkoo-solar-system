import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const SEOOptimizedTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <article className={`seo-optimized-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-4xl">
        {post.featuredImage && <img src={post.featuredImage as string} alt={post.title} className="w-full rounded mb-6 object-cover" />}

        <header className="mb-6">
          <h1 className="text-4xl font-bold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h1>
          {post.excerpt && <p className="mt-3 text-lg" style={{ color: finalStyles.secondaryColor }}>{post.excerpt}</p>}
        </header>

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className="mt-8 flex items-center justify-between">
          <div style={{ color: finalStyles.secondaryColor }}>{post.publishDate}</div>
          {post.anchorLink && <a href={post.anchorLink as string} style={{ color: finalStyles.accentColor }} className="font-medium">Target Link</a>}
        </footer>

      </div>
    </article>
  );
};

export default SEOOptimizedTemplate;
