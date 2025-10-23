import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const LifestyleTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <div className={`lifestyle-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-3xl">
        {post.featuredImage && <img src={post.featuredImage as string} alt={post.title} className="w-full h-auto rounded mb-6" />}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h1>
          {post.excerpt && <p className="mt-2" style={{ color: finalStyles.secondaryColor }}>{post.excerpt}</p>}
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.anchorLink && (
          <div className="mt-8 text-center">
            <a href={post.anchorLink as string} className="inline-block px-4 py-2 rounded" style={{ backgroundColor: finalStyles.accentColor, color: '#fff' }}>Visit</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifestyleTemplate;
