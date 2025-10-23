import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const CustomLayoutTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <div className={`custom-layout-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12" style={{ maxWidth: layout.contentWidth === 'narrow' ? 640 : layout.contentWidth === 'medium' ? 960 : 1200 }}>
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }} className="text-3xl font-bold">{post.title}</h1>
            {post.publishDate && <div style={{ color: finalStyles.secondaryColor }}>{post.publishDate}</div>}
          </div>
        </header>

        {post.featuredImage && <div className="mb-6"><img src={post.featuredImage as string} alt={post.title} className="w-full rounded object-cover" /></div>}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.anchorLink && <div className="mt-8"><a href={post.anchorLink as string} style={{ color: finalStyles.accentColor }}>Source link</a></div>}
      </div>
    </div>
  );
};

export default CustomLayoutTemplate;
