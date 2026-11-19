import { KnowledgeChunk } from "./knowledgeBase";
import { GraphKnowledgeSubGraph } from "./knowledgeGraph";

export type QueryIntentType =
  | "IN_DOMAIN"
  | "GREETING"
  | "OUT_OF_DOMAIN"
  | "SPECIFIC_ENTITY";

export type CRAGGrade = "CORRECT" | "AMBIGUOUS" | "INCORRECT";

export interface IntentClassification {
  intent: QueryIntentType;
  confidence: number;
  detectedEntities: string[];
  reason: string;
}

export interface Citation {
  id: string;
  title: string;
  sourceDoc: string;
  sourcePath: string;
  auditRef: string;
  score: number;
}

export interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
  bm25Score: number;
  exactMatchBonus: number;
}

export interface RetrievalResult {
  query: string;
  intent: IntentClassification;
  grade: CRAGGrade;
  confidence: number;
  scoredChunks: ScoredChunk[];
  topChunks: KnowledgeChunk[];
  citations: Citation[];
  knowledgeGraph?: GraphKnowledgeSubGraph;
  searchExecutionMs: number;
}
