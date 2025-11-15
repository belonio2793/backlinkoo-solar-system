import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const CompetitorBacklinkGapAnalysis: React.FC = () => {
  const title = "Competitor Backlink Gap Analysis: The Key to Dominating Google Rankings in 2025";
  const subtitle = "Complete guide on competitor backlink gap analysis: the key to dominating google rankings in 2025";
  const htmlContent = `
  <h1>Competitor Backlink Gap Analysis: Unlock Your SEO Edge</h1>
  
  <p>In the competitive world of SEO, understanding your rivals`;
  const keywords = "competitor, backlink, gap, analysis, SEO";
  
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

export default CompetitorBacklinkGapAnalysis;
