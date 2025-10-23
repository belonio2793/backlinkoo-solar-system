import React from 'react';
import { BlogTemplateProps } from '@/types/blogTemplateTypes';

export const EcommerceTemplate: React.FC<BlogTemplateProps> = ({ post, styles, layout, customStyles = {}, className = '' }) => {
  const finalStyles = { ...styles, ...customStyles };

  return (
    <article className={`ecommerce-template ${className}`} style={{ backgroundColor: finalStyles.backgroundColor, color: finalStyles.textColor, fontFamily: finalStyles.bodyFont }}>
      <div className="mx-auto px-6 py-12 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: finalStyles.primaryColor, fontFamily: finalStyles.headingFont }}>{post.title}</h1>
        </header>

        {post.featuredImage && <img src={post.featuredImage as string} alt={post.title} className="w-full rounded mb-6 object-cover" />}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {post.anchorLink && <a href={post.anchorLink as string} className="px-4 py-2 rounded text-center" style={{ backgroundColor: finalStyles.accentColor, color: '#fff' }}>Shop Now</a>}
          <div style={{ color: finalStyles.secondaryColor }}>{post.publishDate}</div>
        </div>
      </div>
    </article>
  );
};

export default EcommerceTemplate;
