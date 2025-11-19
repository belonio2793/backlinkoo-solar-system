import React, { useEffect } from 'react';

interface SeoArticlePageProps {
  htmlContent: string;
  className?: string;
}

export const SeoArticlePage: React.FC<SeoArticlePageProps> = ({
  htmlContent,
  className = ''
}) => {
  useEffect(() => {
    // Dynamically load CSS only once
    const link = document.getElementById('seo-article-css');
    if (!link) {
      const stylesheet = document.createElement('link');
      stylesheet.id = 'seo-article-css';
      stylesheet.rel = 'stylesheet';
      stylesheet.href = '/src/styles/seo-article-template.css';
      document.head.appendChild(stylesheet);
    }
  }, []);

  return (
    <div
      className={`article-page ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
