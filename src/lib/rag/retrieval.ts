import { QUANT_FUSION_KNOWLEDGE_BASE, KnowledgeChunk } from "./knowledgeBase";

export interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

export interface RetrievalResult {
  query: string;
  scoredChunks: ScoredChunk[];
  topChunks: KnowledgeChunk[];
  citations: Array<{
    id: string;
    title: string;
    sourceDoc: string;
    sourcePath: string;
    auditRef: string;
    score: number;
  }>;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "in", "on", "at", "to", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "from", "up", "down",
  "of", "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
  "too", "very", "can", "will", "just", "don", "should", "now", "what", "does", "do"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export function retrieveRelevantChunks(query: string, topK: number = 3): RetrievalResult {
  const queryTokens = tokenize(query);
  const scoredChunks: ScoredChunk[] = [];

  for (const chunk of QUANT_FUSION_KNOWLEDGE_BASE) {
    let score = 0;
    const matchedTerms: string[] = [];

    const chunkContentLower = chunk.content.toLowerCase();
    const chunkTitleLower = chunk.title.toLowerCase();

    // 1. Exact phrase boost
    if (queryTokens.length >= 2) {
      const lowerQuery = query.toLowerCase();
      if (chunkContentLower.includes(lowerQuery) || chunkTitleLower.includes(lowerQuery)) {
        score += 35;
      }
    }

    // 2. Keyword matching & weighting
    for (const token of queryTokens) {
      let tokenMatched = false;

      // Title match (heavy weight)
      if (chunkTitleLower.includes(token)) {
        score += 15;
        tokenMatched = true;
      }

      // Explicit keywords match (heavy weight)
      if (chunk.keywords.some((k) => k.toLowerCase().includes(token) || token.includes(k.toLowerCase()))) {
        score += 12;
        tokenMatched = true;
      }

      // Content occurrence match
      const occurrences = (chunkContentLower.match(new RegExp(`\\b${token}`, "g")) || []).length;
      if (occurrences > 0) {
        score += Math.min(occurrences * 3, 15);
        tokenMatched = true;
      }

      if (tokenMatched && !matchedTerms.includes(token)) {
        matchedTerms.push(token);
      }
    }

    // 3. Domain entity boosts
    const isOrderQuery = /ord-|po-|\d{5}/i.test(query);
    if (isOrderQuery && chunk.category === "order_scenarios") {
      score += 25;
    }

    const isFinancialQuery = /ebitda|basis point|bps|margin|loss|revenue|cfo|\$900|\$420|420k|cost/i.test(query);
    if (isFinancialQuery && chunk.category === "financial_ebitda") {
      score += 20;
    }

    const isSecurityQuery = /sox|404|security|writeback|mutation|audit|ciso|read-only|tls/i.test(query);
    if (isSecurityQuery && chunk.category === "security_governance") {
      score += 20;
    }

    const isTariffQuery = /tariff|tradegauge|301|232|ieepa|customs|duty|hts/i.test(query);
    if (isTariffQuery && chunk.category === "tariff_tradegauge") {
      score += 20;
    }

    const isFounderQuery = /deb|friar|founder|ceo|welbilt|target|pepsi|experience|pedigree/i.test(query);
    if (isFounderQuery && chunk.category === "founder_pedigree") {
      score += 20;
    }

    if (score > 0) {
      scoredChunks.push({
        chunk,
        score,
        matchedTerms,
      });
    }
  }

  // Sort descending by score
  scoredChunks.sort((a, b) => b.score - a.score);

  // If no specific match, default to the top foundational financial & operational overview chunks
  const selectedScored = scoredChunks.length > 0 
    ? scoredChunks.slice(0, topK)
    : [
        { chunk: QUANT_FUSION_KNOWLEDGE_BASE[0], score: 10, matchedTerms: [] },
        { chunk: QUANT_FUSION_KNOWLEDGE_BASE[2], score: 8, matchedTerms: [] },
      ];

  const topChunks = selectedScored.map((s) => s.chunk);

  const citations = selectedScored.map((s) => ({
    id: s.chunk.id,
    title: s.chunk.title,
    sourceDoc: s.chunk.sourceDoc,
    sourcePath: s.chunk.sourcePath,
    auditRef: s.chunk.auditRef,
    score: Math.min(Math.round((s.score / 50) * 100), 100),
  }));

  return {
    query,
    scoredChunks: selectedScored,
    topChunks,
    citations,
  };
}

export function formatRetrievedContextForPrompt(result: RetrievalResult): string {
  if (result.topChunks.length === 0) {
    return "No directly indexed documents matched this query.";
  }

  return result.topChunks
    .map((chunk, index) => {
      return `--- DOCUMENT [${index + 1}]: ${chunk.title} ---
SOURCE: ${chunk.sourceDoc} (Path: ${chunk.sourcePath})
AUDIT REF: ${chunk.auditRef}
CONTENT:
${chunk.content}
`;
    })
    .join("\n\n");
}
