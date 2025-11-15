import React from 'react';
import { GenericPageTemplate } from '@/components/GenericPageTemplate';

const VoiceSearchBacklinkOptimization: React.FC = () => {
  const title = "SEO Link Building Guide";
  const subtitle = "In the ever-evolving world of SEO, link building remains a cornerstone...";
  const htmlContent = `<p>Placeholder content generated. Expand manually.`;
  const keywords = "voice, search, backlink, optimization";
  
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

export default VoiceSearchBacklinkOptimization;