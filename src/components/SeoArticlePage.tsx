import React from 'react';
import '../styles/seo-article-template.css';

interface SeoArticlePageProps {
  htmlContent: string;
  className?: string;
}

export const SeoArticlePage: React.FC<SeoArticlePageProps> = ({
  htmlContent,
  className = ''
}) => {
  return (
    <div
      className={`article-page ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
