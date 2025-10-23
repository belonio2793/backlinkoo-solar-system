import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const PortfolioTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <section className={`portfolio-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h1>
        </header>

        {post.featuredImage && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src={post.featuredImage as string} alt={post.title} className="w-full h-auto rounded object-cover" />
          </div>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.anchorLink && (
          <div className="mt-8 text-center">
            <a href={post.anchorLink as string} style={{ color: finalStyles.accentColor }} className="font-medium">See Project</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioTemplate;
