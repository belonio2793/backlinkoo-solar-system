import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const BusinessTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <div className={`business-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h1>
          {post.publishDate && <div style={{ color: finalStyles.secondaryColor }}>{post.publishDate}</div>}
        </header>

        {post.featuredImage && <img src={post.featuredImage as string} alt={post.title} className="w-full rounded mb-6 object-cover" />}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.anchorLink && (
          <div className="mt-8">
            <a href={post.anchorLink as string} className="px-4 py-2 rounded" style={{ backgroundColor: finalStyles.accentColor, color: '#fff' }}>Related Link</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessTemplate;
