import { KnowledgeChunk } from "./knowledgeBase";
import { ScoredChunk } from "./types";

export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "in", "on", "at", "to", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "from", "up", "down",
  "of", "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
  "too", "very", "can", "will", "just", "don", "should", "now", "what", "does", "do",
  "tell", "me", "give", "show", "would", "could", "who", "whom", "whose", "which",
  "s", "t", "re", "ve", "ll", "d", "m"
]);

// Legitimate domain synonyms (NO generic interrogative expansions)
export const DOMAIN_SYNONYMS: Record<string, string[]> = {
  price: ["cost", "pricing", "tier", "subscription", "pilot", "fee", "rate"],
  pricing: ["price", "cost", "tier", "subscription", "pilot", "fee", "rate"],
  cost: ["price", "pricing", "margin", "ebitda", "waste", "spend", "loss"],
  competitor: ["celonis", "project44", "mulesoft", "kinaxis", "powerbi", "alternative", "comparison", "vs"],
  competitors: ["celonis", "project44", "mulesoft", "kinaxis", "powerbi", "alternative", "comparison", "vs"],
  celonis: ["process mining", "competitor", "alternative", "post-mortem"],
  project44: ["fourkites", "carrier tracking", "visibility", "telematics", "gps"],
  mulesoft: ["integration", "middleware", "boomi", "connectors", "writeback"],
  kinaxis: ["supply chain planning", "concurrent planning", "competitor"],
  security: ["zero-writeback", "read-only", "sox 404", "isolation", "tls", "rbac", "safe"],
  safe: ["security", "sox 404", "writeback", "isolation", "read-only"],
  founder: ["deb friar", "leadership", "pedigree", "welbilt", "ceo"],
  founded: ["founder", "deb friar", "leadership", "pedigree", "welbilt", "ceo"],
  founders: ["founder", "deb friar", "leadership", "pedigree", "welbilt", "ceo"],
  ceo: ["deb friar", "founder", "leadership", "pedigree", "welbilt"],
  leadership: ["deb friar", "founder", "ceo", "management"],
  order: ["ord-78192", "po-34018", "ord-91204", "promise date", "tracking", "status", "ship date"],
  orders: ["ord-78192", "po-34018", "ord-91204", "promise date", "tracking", "status", "ship date"],
  tracking: ["carrier", "railhead", "dwell", "gps", "vessel", "telematics"],
  vessel: ["msku-90812", "cma cgm marco polo", "container", "pier 400", "ocean", "maritime"],
  shipment: ["vessel", "container", "order", "delivery", "dwell", "port"],
  tariff: ["tradegauge", "section 301", "section 232", "duty", "customs", "hts", "usmca"],
  tariffs: ["tradegauge", "section 301", "section 232", "duty", "customs", "hts", "usmca"],
  duty: ["tariff", "customs", "hts", "usmca", "section 301"],
  sap: ["rfc", "bapi", "ecc", "s4hana", "erp", "connectors"],
  oracle: ["wms", "netsuite", "rest", "connectors"],
  hours: ["labor", "csr", "payroll", "waste", "400 hours", "12000 hours", "22 hours"],
  chargeback: ["otif", "penalties", "fines", "scorecard", "freight", "expedited"],
  chargebacks: ["otif", "penalties", "fines", "scorecard", "freight", "expedited"],
  ebitda: ["150 bps", "margin", "waterfall", "recovery", "payroll"],
};

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export function expandDomainTokens(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    const synonyms = DOMAIN_SYNONYMS[token];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
  }
  return Array.from(expanded);
}

interface BM25IndexField {
  docTokens: string[][];
  docLengths: number[];
  avgdl: number;
  docFrequencies: Map<string, number>;
}

export class BM25Retriever {
  private chunks: KnowledgeChunk[];
  private titleIndex: BM25IndexField;
  private keywordIndex: BM25IndexField;
  private contentIndex: BM25IndexField;
  private N: number;

  private k1: number = 1.2;
  private b: number = 0.75;

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks;
    this.N = chunks.length;

    this.titleIndex = this.buildFieldIndex(chunks.map((c) => c.title));
    this.keywordIndex = this.buildFieldIndex(chunks.map((c) => c.keywords.join(" ")));
    this.contentIndex = this.buildFieldIndex(chunks.map((c) => c.content));
  }

  private buildFieldIndex(texts: string[]): BM25IndexField {
    const docTokens = texts.map((t) => tokenize(t));
    const docLengths = docTokens.map((tokens) => tokens.length);
    const totalLength = docLengths.reduce((a, b) => a + b, 0);
    const avgdl = totalLength / Math.max(texts.length, 1);

    const docFrequencies = new Map<string, number>();
    for (const tokens of docTokens) {
      const unique = new Set(tokens);
      for (const t of unique) {
        docFrequencies.set(t, (docFrequencies.get(t) || 0) + 1);
      }
    }

    return { docTokens, docLengths, avgdl, docFrequencies };
  }

  private idf(term: string, fieldIndex: BM25IndexField): number {
    const df = fieldIndex.docFrequencies.get(term) || 0;
    // Standard Lucene/Okapi BM25 IDF formula
    return Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
  }

  private scoreField(docIndex: number, tokens: string[], fieldIndex: BM25IndexField): number {
    let score = 0;
    const docTokens = fieldIndex.docTokens[docIndex];
    const docLen = fieldIndex.docLengths[docIndex];
    const lenNorm = 1 - this.b + this.b * (docLen / Math.max(fieldIndex.avgdl, 1));

    // Calculate term frequencies in document
    const tfMap = new Map<string, number>();
    for (const t of docTokens) {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    }

    for (const token of tokens) {
      const tf = tfMap.get(token) || 0;
      if (tf > 0) {
        const idfVal = this.idf(token, fieldIndex);
        const termScore = idfVal * ((tf * (this.k1 + 1)) / (tf + this.k1 * lenNorm));
        score += termScore;
      }
    }

    return score;
  }

  public search(query: string, persona: string = "cfo"): ScoredChunk[] {
    const rawTokens = tokenize(query);
    if (rawTokens.length === 0) return [];

    const expandedTokens = expandDomainTokens(rawTokens);
    const lowerQuery = query.toLowerCase();
    const scored: ScoredChunk[] = [];

    for (let i = 0; i < this.N; i++) {
      const chunk = this.chunks[i];
      const titleScore = this.scoreField(i, expandedTokens, this.titleIndex);
      const keywordScore = this.scoreField(i, expandedTokens, this.keywordIndex);
      const contentScore = this.scoreField(i, rawTokens, this.contentIndex);

      // Weighted multi-field BM25 aggregation
      const bm25Score = 2.5 * titleScore + 2.0 * keywordScore + 1.0 * contentScore;

      // Exact entity and phrase bonuses
      let exactBonus = 0;
      const matchedTerms: string[] = [];

      // Check which query tokens actually appeared
      const combinedTokens = new Set([
        ...this.titleIndex.docTokens[i],
        ...this.keywordIndex.docTokens[i],
        ...this.contentIndex.docTokens[i],
      ]);

      for (const token of rawTokens) {
        if (combinedTokens.has(token)) {
          matchedTerms.push(token);
        }
      }

      // Exact phrase match boost
      if (rawTokens.length >= 2 && chunk.content.toLowerCase().includes(lowerQuery)) {
        exactBonus += 15;
      }

      // Specific order ID boosts
      if (/ord-78192/i.test(query) && chunk.id === "scenario-ord-78192-foodservice") exactBonus += 30;
      if (/po-34018/i.test(query) && chunk.id === "scenario-po-34018-chemical") exactBonus += 30;
      if (/ord-91204/i.test(query) && chunk.id === "scenario-ord-91204-machinery") exactBonus += 30;
      if (/msku-90812|marco polo/i.test(query) && chunk.id === "scenario-msku-90812-vessel") exactBonus += 30;

      // Founder specific boost (ONLY if "deb", "friar", "founder", or "founded" are explicitly mentioned)
      if (/\b(deb|friar|founder|founders|founded|ceo)\b/i.test(query) && chunk.category === "founder_pedigree") exactBonus += 25;

      let totalScore = bm25Score + exactBonus;

      // Persona biasing (+15% subtle category adjustment)
      if (persona === "cfo" && (chunk.category === "financial_ebitda" || chunk.category === "pricing_deployment")) {
        totalScore *= 1.15;
      } else if (persona === "supply_chain" && (chunk.category === "operational_silos" || chunk.category === "order_scenarios" || chunk.category === "tariff_tradegauge")) {
        totalScore *= 1.15;
      } else if (persona === "sales_csr" && (chunk.category === "order_scenarios" || chunk.category === "operational_silos")) {
        totalScore *= 1.15;
      } else if (persona === "ciso" && (chunk.category === "security_governance" || chunk.category === "tech_architecture")) {
        totalScore *= 1.15;
      }

      if (matchedTerms.length > 0 && totalScore > 0.8) {
        scored.push({
          chunk,
          score: Math.round(totalScore * 10) / 10,
          matchedTerms,
          bm25Score: Math.round(bm25Score * 10) / 10,
          exactMatchBonus: exactBonus,
        });
      }
    }

    // Sort descending
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }
}
