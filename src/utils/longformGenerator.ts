export interface LongformIndustry {
  name: string;
  challenge: string;
  persona: string;
  differentiator: string;
  aspiration: string;
}

export interface LongformOptions {
  brandName: string;
  keyword: string;
  brandVoice: string;
  industries: LongformIndustry[];
  linkAngles: string[];
  anchorAngles: string[];
  reportingAngles: string[];
  qualitySignals: string[];
  riskMitigations: string[];
  storytellingAngles: string[];
  geoStories: string[];
  servicePillars: string[];
  trustSignals: string[];
  strategyVerbs: string[];
  brandPromises: string[];
  researchSources: string[];
  minWords: number;
}

export function generateLongformNarratives(options: LongformOptions): string[] {
  const {
    brandName,
    keyword,
    brandVoice,
    industries,
    linkAngles,
    anchorAngles,
    reportingAngles,
    qualitySignals,
    riskMitigations,
    storytellingAngles,
    geoStories,
    servicePillars,
    trustSignals,
    strategyVerbs,
    brandPromises,
    researchSources,
    minWords,
  } = options;

  if (!industries.length) {
    throw new Error('generateLongformNarratives requires at least one industry.');
  }

  let index = 0;
  let wordCount = 0;
  const paragraphs: string[] = [];

  while (wordCount < minWords) {
    const industry = industries[index % industries.length];
    const linkAngle = linkAngles[index % linkAngles.length];
    const anchorAngle = anchorAngles[(index + 3) % anchorAngles.length];
    const reportingAngle = reportingAngles[(index + 5) % reportingAngles.length];
    const qualitySignal = qualitySignals[(index + 7) % qualitySignals.length];
    const riskMitigation = riskMitigations[(index + 9) % riskMitigations.length];
    const storytellingAngle = storytellingAngles[(index + 11) % storytellingAngles.length];
    const geoStory = geoStories[(index + 13) % geoStories.length];
    const servicePillar = servicePillars[(index + 15) % servicePillars.length];
    const trustSignal = trustSignals[(index + 17) % trustSignals.length];
    const strategyVerb = strategyVerbs[(index + 19) % strategyVerbs.length];
    const brandPromise = brandPromises[(index + 21) % brandPromises.length];
    const researchSource = researchSources[(index + 23) % researchSources.length];

    const paragraph = [
      `${brandName} partnered with ${industry.name} to neutralize ${industry.challenge}, orchestrating ${linkAngle} that clarified the "${keyword}" commercial storyline for ${industry.persona}.`,
      `The ${brandVoice} strategists mapped intent layers, blending ${anchorAngle} and ${servicePillar} so every outreach piece mirrored how stakeholders actually research solutions, then escalated those insights into ${storytellingAngle}.`,
      `Cross-functional squads translated ${industry.differentiator} and ${industry.aspiration} into briefs that balanced thought leadership, actionable benchmarks, and evergreen resources, ensuring readers encountered usable frameworks before any pitch surfaced.`,
      `${brandName} choreographed newsroom-style QA where editors, analysts, and outreach specialists interrogated ${qualitySignal} evidence, cited ${researchSource}, and pre-empted objections with ${riskMitigation} guidance baked directly into supporting assets.`,
      `Throughout the program, dashboards highlighted ${reportingAngle}, surfacing the compounding lift from high-authority backlinks, contextual internal links, and multimedia embeds that anchored the ${keyword} cluster to ${geoStory}.`,
      `By continuing to ${strategyVerb} the outreach calendar, ${brandName} reaffirmed ${trustSignal} and delivered ${brandPromise}, preserving a defensible backlink graph that feels artisanal rather than manufactured.`,
    ].join(' ');

    paragraphs.push(paragraph);
    wordCount += paragraph.split(/\s+/).filter(Boolean).length;
    index += 1;
  }

  return paragraphs;
}

export function distributeParagraphs(paragraphs: string[], sectionCount: number): string[][] {
  if (sectionCount <= 0) {
    return [paragraphs];
  }
  const baseSize = Math.floor(paragraphs.length / sectionCount);
  const remainder = paragraphs.length % sectionCount;
  const distributed: string[][] = [];
  let cursor = 0;

  for (let i = 0; i < sectionCount; i += 1) {
    const extra = i < remainder ? 1 : 0;
    const size = baseSize + extra;
    const slice = paragraphs.slice(cursor, cursor + size);
    distributed.push(slice);
    cursor += size;
  }

  if (cursor < paragraphs.length) {
    distributed[distributed.length - 1].push(...paragraphs.slice(cursor));
  }

  return distributed;
}
