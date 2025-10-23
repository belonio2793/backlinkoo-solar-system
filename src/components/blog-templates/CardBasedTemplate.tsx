import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const CardBasedTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <div className={`card-based-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {post.featuredImage && <img src={post.featuredImage as string} alt={post.title} className="w-full object-cover" />}
          <div className="p-6">
            <h2 className="text-2xl font-semibold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h2>
            {post.excerpt && <p className="mt-2" style={{ color: finalStyles.secondaryColor }}>{post.excerpt}</p>}
            <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.anchorLink && <div className="mt-4"><a href={post.anchorLink as string} style={{ color: finalStyles.accentColor }}>Read full article</a></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBasedTemplate;
