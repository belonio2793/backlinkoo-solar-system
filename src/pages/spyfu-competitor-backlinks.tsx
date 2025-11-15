import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const SpyfuCompetitorBacklinks: React.FC = () => {
  const title = "Spyfu Competitor Backlinks: The Key to Dominating Google Rankings in 2025";
  const subtitle = "Complete guide";
  const htmlContent = `
    <h1>SpyFu Competitor Backlinks: The Ultimate Guide to Boosting Your SEO Strategy</h1>
    <p>In the competitive world of SEO, understanding <strong>SpyFu competitor backlinks</strong> can be a game-changer for your website's visibility and ranking. SpyFu is a powerful tool that allows you to spy on your competitors`;
  const keywords = "spyfu, competitor, backlinks, SEO";
  
  return (
    <GenericPageTemplate
      title={title}
      subtitle={subtitle}
      htmlContent={htmlContent}
      keywords={keywords}
      description={subtitle}
    />
  );
};

export default SpyfuCompetitorBacklinks;
