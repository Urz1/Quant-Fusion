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
  "too", "very", "can", "will", "just", "don", "should", "now", "what", "does", "do",
  "tell", "me", "give", "show", "would", "could"
]);

// Semantic Synonym & Entity Expansion Dictionary
const SYNONYM_MAP: Record<string, string[]> = {
  price: ["cost", "pricing", "tier", "subscription", "pilot", "fee", "rate", "dollar"],
  cost: ["price", "pricing", "margin", "ebitda", "waste", "spend", "loss"],
  competitor: ["celonis", "project44", "mulesoft", "kinaxis", "powerbi", "alternative", "comparison", "difference", "vs"],
  celonis: ["process mining", "competitor", "alternative", "logs"],
  project44: ["fourkites", "carrier tracking", "visibility", "telematics", "gps"],
  mulesoft: ["integration", "middleware", "boomi", "connectors"],
  kinaxis: ["supply chain planning", "concurrent planning", "competitor"],
  safe: ["security", "sox", "404", "writeback", "isolation", "read-only", "tamper"],
  security: ["zero writeback", "read-only", "sox 404", "isolation", "tls", "rbac", "encryption", "safe"],
  founder: ["deb friar", "leadership", "pedigree", "background", "experience", "credentials"],
  who: ["founder", "deb friar", "leadership", "ceo", "team"],
  order: ["ord-78192", "po-34018", "ord-91204", "promise date", "tracking", "status", "ship date"],
  vessel: ["msku-90812", "cma cgm marco polo", "container", "pier 400", "ocean", "maritime"],
  shipment: ["vessel", "container", "order", "delivery", "dwell", "port"],
  tariff: ["tradegauge", "section 301", "section 232", "duty", "customs", "hts", "usmca"],
  how: ["architecture", "ingestion", "implementation", "onboarding", "connectors"],
  sap: ["rfc", "bapi", "ecc", "s4hana", "erp", "connectors"],
  oracle: ["wms", "netsuite", "rest", "connectors"],
  hours: ["labor", "csr", "payroll", "waste", "400 hours", "12000 hours", "22 hours"],
  chargeback: ["otif", "penalties", "fines", "scorecard", "freight", "expedited"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    const synonyms = SYNONYM_MAP[token];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
  }
  return Array.from(expanded);
}

export function retrieveRelevantChunks(
  query: string,
  topK: number = 4,
  persona: string = "cfo"
): RetrievalResult {
  const baseTokens = tokenize(query);
  const expandedTokens = expandTokens(baseTokens);
  const scoredChunks: ScoredChunk[] = [];

  const lowerQuery = query.toLowerCase();

  for (const chunk of QUANT_FUSION_KNOWLEDGE_BASE) {
    let score = 0;
    const matchedTerms: string[] = [];

    const chunkContentLower = chunk.content.toLowerCase();
    const chunkTitleLower = chunk.title.toLowerCase();

    // 1. Exact phrase boost
    if (baseTokens.length >= 2) {
      if (chunkContentLower.includes(lowerQuery) || chunkTitleLower.includes(lowerQuery)) {
        score += 40;
      }
    }

    // 2. Title matching (highest weight)
    for (const token of expandedTokens) {
      if (chunkTitleLower.includes(token)) {
        score += 20;
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      }
    }

    // 3. Explicit keywords match
    for (const token of expandedTokens) {
      if (chunk.keywords.some((k) => k.toLowerCase() === token || k.toLowerCase().includes(token))) {
        score += 15;
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      }
    }

    // 4. Content occurrences
    for (const token of baseTokens) {
      const occurrences = (chunkContentLower.match(new RegExp(`\\b${token}`, "g")) || []).length;
      if (occurrences > 0) {
        score += Math.min(occurrences * 3, 15);
        if (!matchedTerms.includes(token)) matchedTerms.push(token);
      }
    }

    // 5. Targeted Domain Entity Boosts
    // A. Specific Order or Vessel Identifiers
    if (/ord-78192|cx-900|foodservice|apex/i.test(query) && chunk.id === "scenario-ord-78192-foodservice") {
      score += 45;
    }
    if (/po-34018|pc-400|chemical|chemco/i.test(query) && chunk.id === "scenario-po-34018-chemical") {
      score += 45;
    }
    if (/ord-91204|hp-550|titan|machinery|monterrey/i.test(query) && chunk.id === "scenario-ord-91204-machinery") {
      score += 45;
    }
    if (/msku|marco polo|vessel|ocean|pier 400|48200/i.test(query) && chunk.id === "scenario-msku-90812-vessel") {
      score += 45;
    }

    // B. Competitors & Alternatives
    if (/celonis|project44|fourkites|mulesoft|kinaxis|powerbi|tableau|competitor|vs|alternative/i.test(query) && chunk.category === "competitive_intel") {
      score += 35;
    }

    // C. Technical Ingestion Architecture
    if (/csv|sftp|rfc|api|connector|integrate|integration|onboard|ingest|how it works/i.test(query) && chunk.category === "tech_architecture") {
      score += 30;
    }

    // D. Nearshoring & USMCA
    if (/nearshore|usmca|mexico|duty deferral|tariff inversion|rvc/i.test(query) && chunk.id === "tariff-nearshore-usmca") {
      score += 35;
    }

    // E. OTIF Penalties & Freight Chargebacks
    if (/otif|chargeback|penalty|penalties|freight|hot-shot|fines/i.test(query) && chunk.id === "fin-chargebacks-freight") {
      score += 35;
    }

    // F. EBITDA, Margin Bleed, Financials
    if (/ebitda|basis point|bps|margin|loss|revenue|\$900|\$420|waterfall|bleed/i.test(query) && chunk.category === "financial_ebitda") {
      score += 30;
    }

    // G. Security & SOX 404
    if (/sox|404|security|writeback|mutation|audit|ciso|read-only|tls|safe/i.test(query) && chunk.category === "security_governance") {
      score += 30;
    }

    // H. Tariffs & TradeGauge
    if (/tariff|tradegauge|301|232|ieepa|customs|duty|hts/i.test(query) && chunk.category === "tariff_tradegauge") {
      score += 30;
    }

    // I. Founder Pedigree
    if (/deb|friar|founder|ceo|welbilt|target|pepsi|experience|pedigree|credentials/i.test(query) && chunk.category === "founder_pedigree") {
      score += 35;
    }

    // J. Pricing & Pilots
    if (/price|pricing|cost|pilot|how much|15000|4500|12500|contract/i.test(query) && chunk.category === "pricing_deployment") {
      score += 35;
    }

    // 6. Persona-Biased Weighting (+25% category boost)
    if (persona === "cfo" && (chunk.category === "financial_ebitda" || chunk.category === "pricing_deployment")) {
      score *= 1.25;
    } else if (persona === "supply_chain" && (chunk.category === "operational_silos" || chunk.category === "order_scenarios" || chunk.category === "tariff_tradegauge")) {
      score *= 1.25;
    } else if (persona === "sales_csr" && (chunk.category === "order_scenarios" || chunk.category === "operational_silos")) {
      score *= 1.25;
    } else if (persona === "ciso" && (chunk.category === "security_governance" || chunk.category === "tech_architecture" || chunk.category === "competitive_intel")) {
      score *= 1.25;
    }

    if (score > 0) {
      scoredChunks.push({
        chunk,
        score: Math.round(score),
        matchedTerms,
      });
    }
  }

  // Sort descending by score
  scoredChunks.sort((a, b) => b.score - a.score);

  // If no specific match, default to foundational overview chunks
  const selectedScored = scoredChunks.length > 0
    ? scoredChunks.slice(0, topK)
    : [
        { chunk: QUANT_FUSION_KNOWLEDGE_BASE[0], score: 25, matchedTerms: ["ebitda", "margin"] },
        { chunk: QUANT_FUSION_KNOWLEDGE_BASE[3], score: 20, matchedTerms: ["silos", "ping-pong"] },
        { chunk: QUANT_FUSION_KNOWLEDGE_BASE[11], score: 18, matchedTerms: ["zero-writeback"] },
      ];

  const topChunks = selectedScored.map((s) => s.chunk);

  const citations = selectedScored.map((s) => ({
    id: s.chunk.id,
    title: s.chunk.title,
    sourceDoc: s.chunk.sourceDoc,
    sourcePath: s.chunk.sourcePath,
    auditRef: s.chunk.auditRef,
    score: Math.min(Math.round((s.score / 60) * 100), 100),
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
CATEGORY: ${chunk.category}
SOURCE: ${chunk.sourceDoc} (Path: ${chunk.sourcePath})
AUDIT REF: ${chunk.auditRef}
CONTENT:
${chunk.content}
`;
    })
    .join("\n\n");
}

