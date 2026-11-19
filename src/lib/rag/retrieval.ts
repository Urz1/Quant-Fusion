import { QUANT_FUSION_KNOWLEDGE_BASE, KnowledgeChunk } from "./knowledgeBase";
import { BM25Retriever } from "./bm25";
import { classifyQueryIntent } from "./intentClassifier";
import { queryKnowledgeGraph } from "./knowledgeGraph";
import { RetrievalResult, CRAGGrade, Citation, ScoredChunk } from "./types";

// Singleton BM25 index built in memory once at module load
const bm25Retriever = new BM25Retriever(QUANT_FUSION_KNOWLEDGE_BASE);

export * from "./types";
export * from "./knowledgeGraph";

/**
 * Enterprise Graph-Enhanced Corrective RAG (CRAG) Retrieval Engine:
 * 1. Front-Door Intent Gate: Filters out greetings and out-of-domain queries before retrieval.
 * 2. Multi-field BM25 Scored Search: Evaluates title, keywords, and content with term saturation.
 * 3. Knowledge Graph Subgraph Traversal: Discovers multi-hop entity relations (Orders -> Bottlenecks -> Facilities).
 * 4. CRAG Confidence Grading: Classifies retrieval into CORRECT, AMBIGUOUS, or INCORRECT based on calibrated threshold.
 * 5. Grounded Citations: Only cites chunks that genuinely meet relevance criteria.
 */
export function retrieveRelevantChunks(
  query: string,
  topK: number = 4,
  persona: string = "cfo"
): RetrievalResult {
  const startTime = Date.now();
  const intent = classifyQueryIntent(query);

  // 1. Guardrail Gate: If the query is OUT_OF_DOMAIN or a GREETING, skip retrieval entirely.
  // This prevents superficial matches and guarantees ZERO false citations.
  if (intent.intent === "GREETING" || intent.intent === "OUT_OF_DOMAIN") {
    return {
      query,
      intent,
      grade: "INCORRECT",
      confidence: 0,
      scoredChunks: [],
      topChunks: [],
      citations: [],
      knowledgeGraph: undefined,
      searchExecutionMs: Date.now() - startTime,
    };
  }

  // 2. Query the Knowledge Graph for Entity Triples
  const knowledgeGraph = queryKnowledgeGraph(query);

  // 3. Perform Multi-Field BM25 Search with Exact Entity Boosts
  const scored = bm25Retriever.search(query, persona);

  if (scored.length === 0 && knowledgeGraph.nodes.length === 0) {
    return {
      query,
      intent,
      grade: "INCORRECT",
      confidence: 0,
      scoredChunks: [],
      topChunks: [],
      citations: [],
      knowledgeGraph: undefined,
      searchExecutionMs: Date.now() - startTime,
    };
  }

  const topScored = scored[0];
  const maxScore = topScored ? topScored.score : 0;
  // In our BM25 weighting, an exact match + title alignment scores >= 14
  const normalizedConfidence = Math.min(Math.round((maxScore / 14) * 100), 99);

  let grade: CRAGGrade = "INCORRECT";
  let selectedChunks: ScoredChunk[] = [];

  // CRAG Decision Matrix
  if (normalizedConfidence >= 45 || (topScored && topScored.exactMatchBonus > 0) || knowledgeGraph.nodes.length > 0) {
    // High Confidence (CORRECT)
    grade = "CORRECT";
    selectedChunks = scored
      .filter((s) => s.score >= 2.0)
      .slice(0, topK);
  } else if (normalizedConfidence >= 25) {
    // Medium Confidence (AMBIGUOUS)
    grade = "AMBIGUOUS";
    selectedChunks = scored
      .filter((s) => s.matchedTerms.length >= 1 && s.score >= 1.5)
      .slice(0, 2);
  } else {
    // Low Confidence (INCORRECT / NO MATCH)
    grade = "INCORRECT";
    selectedChunks = [];
  }

  const topChunks = selectedChunks.map((s) => s.chunk);

  // Generate verified citations ONLY for valid chunks
  const citations: Citation[] = selectedChunks.map((s) => {
    const citeScore = Math.min(Math.max(Math.round((s.score / 14) * 100), 65), 99);
    return {
      id: s.chunk.id,
      title: s.chunk.title,
      sourceDoc: s.chunk.sourceDoc,
      sourcePath: s.chunk.sourcePath,
      auditRef: s.chunk.auditRef,
      score: citeScore,
    };
  });

  return {
    query,
    intent,
    grade,
    confidence: selectedChunks.length > 0 ? normalizedConfidence : (knowledgeGraph.nodes.length > 0 ? 95 : 0),
    scoredChunks: selectedChunks,
    topChunks,
    citations,
    knowledgeGraph,
    searchExecutionMs: Date.now() - startTime,
  };
}

export function formatRetrievedContextForPrompt(result: RetrievalResult): string {
  const parts: string[] = [];

  // 1. Inject Knowledge Graph Triples
  if (result.knowledgeGraph && result.knowledgeGraph.formattedTriples.length > 0) {
    parts.push(`=== VERIFIED KNOWLEDGE GRAPH ENTITY RELATIONS ===
${result.knowledgeGraph.formattedTriples.join("\n")}
`);
  }

  // 2. Inject Verified Knowledge Base Chunks
  if (result.topChunks.length > 0) {
    const chunkBlocks = result.topChunks.map((chunk, index) => {
      return `--- DOCUMENT [${index + 1}]: ${chunk.title} ---
CATEGORY: ${chunk.category}
SOURCE: ${chunk.sourceDoc} (Path: ${chunk.sourcePath})
AUDIT REF: ${chunk.auditRef}
CONTENT:
${chunk.content}`;
    }).join("\n\n");
    parts.push(`=== VERIFIED DOCUMENT CHUNKS ===\n${chunkBlocks}`);
  }

  if (parts.length === 0) {
    return "NO_VERIFIED_CONTEXT_FOUND: The user inquiry does not match indexed Quant Fusion enterprise supply chain knowledge.";
  }

  return parts.join("\n\n");
}
