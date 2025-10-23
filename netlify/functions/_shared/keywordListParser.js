const { parseNumeric } = require('./keywordResearchUtils');

function attemptParseJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractJsonBlock(raw) {
  if (!raw) return null;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const snippet = raw.slice(start, end + 1);
  return attemptParseJson(snippet);
}

function parseDifficulty(value) {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampDifficulty(value);
  }
  const str = String(value).trim();
  if (!str) return null;
  const match = str.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const num = Number(match[0]);
  if (!Number.isFinite(num)) return null;
  return clampDifficulty(num);
}

function clampDifficulty(value) {
  const rounded = Math.round(value);
  if (!Number.isFinite(rounded)) return null;
  if (rounded < 0) return 0;
  if (rounded > 100) return 100;
  return rounded;
}

function sanitizeWord(value) {
  if (value == null) return null;
  const str = String(value).trim();
  return str ? str : null;
}

function coerceKeyword(item) {
  const candidates = ['keyword', 'term', 'phrase', 'query'];
  for (const key of candidates) {
    if (item[key]) {
      const value = sanitizeWord(item[key]);
      if (value) return value;
    }
  }
  return null;
}

function coerceVolume(item) {
  const candidates = ['searchVolume', 'volume', 'monthlySearchVolume', 'searches', 'estimatedSearchVolume'];
  for (const key of candidates) {
    if (item[key] != null) {
      const raw = item[key];
      if (typeof raw === 'number' && Number.isFinite(raw)) {
        return Math.max(0, Math.round(raw));
      }
      const parsed = parseNumeric(raw);
      if (parsed != null) return parsed;
    }
  }
  return null;
}

function buildCompetitionLabel(item) {
  const candidates = ['difficultyLabel', 'competition', 'competitionLevel', 'rankingDifficulty'];
  for (const key of candidates) {
    if (item[key]) {
      const label = sanitizeWord(item[key]);
      if (label) return label;
    }
  }
  return null;
}

function collectNotes(item) {
  const candidates = ['notes', 'insight', 'insights', 'rationale', 'why', 'suggestion'];
  for (const key of candidates) {
    if (item[key]) {
      const note = sanitizeWord(item[key]);
      if (note) return note;
    }
  }
  return null;
}

function collectIntent(item) {
  const candidates = ['intent', 'searchIntent'];
  for (const key of candidates) {
    if (item[key]) {
      const intent = sanitizeWord(item[key]);
      if (intent) return intent;
    }
  }
  return null;
}

function ensureArrayFromParsed(parsed) {
  if (!parsed || typeof parsed !== 'object') return [];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.keywords)) return parsed.keywords;
  if (Array.isArray(parsed.data)) return parsed.data;
  return [];
}

function parseKeywordList(raw) {
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) {
    return { keywords: [], parsed: null };
  }

  let parsed = attemptParseJson(text);
  if (!parsed) {
    parsed = extractJsonBlock(text);
  }
  if (!parsed) {
    return { keywords: [], parsed: null };
  }

  const seeds = ensureArrayFromParsed(parsed);
  const keywords = [];
  seeds.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const keyword = coerceKeyword(item);
    if (!keyword) return;
    const searchVolume = coerceVolume(item);
    const difficulty = parseDifficulty(item.difficulty);
    const competition = buildCompetitionLabel(item);
    const notes = collectNotes(item);
    const intent = collectIntent(item);

    keywords.push({
      keyword,
      searchVolume,
      difficulty,
      difficultyLabel: competition,
      intent,
      notes,
    });
  });

  return { keywords, parsed };
}

module.exports = {
  parseKeywordList,
};
