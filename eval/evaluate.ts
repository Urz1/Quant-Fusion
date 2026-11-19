import fs from "fs";
import path from "path";
import { retrieveRelevantChunks } from "../src/lib/rag/retrieval";

interface TestCase {
  id: string;
  type: string;
  query: string;
  targetChunkIds: string[];
  expectedAnswerKeywords: string[];
  isOutOfScope: boolean;
}

interface TestResult {
  id: string;
  type: string;
  query: string;
  isOutOfScope: boolean;
  retrievedChunkIds: string[];
  hitAtK: boolean;
  reciprocalRank: number;
  precisionAtK: number;
  recallAtK: number;
  citationsCount: number;
  responseLatencyMs: number;
  generatedText: string;
  refusedCorrectly: boolean;
  keywordMatchRate: number;
}

const DATASET_PATH = path.join(process.cwd(), "eval", "dataset.json");
const OUTPUT_BASELINE_PATH = path.join(process.cwd(), "eval", "baseline.json");

async function queryAPI(message: string): Promise<{ text: string; citations: any[]; latencyMs: number }> {
  const t0 = Date.now();
  try {
    const res = await fetch("http://localhost:3005/api/rag/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      return { text: `HTTP ${res.status}`, citations: [], latencyMs: Date.now() - t0 };
    }

    const reader = res.body?.getReader();
    if (!reader) {
      return { text: "No body", citations: [], latencyMs: Date.now() - t0 };
    }

    const decoder = new TextDecoder();
    let text = "";
    let citations: any[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const json = JSON.parse(raw);
            if (json.type === "meta") citations = json.citations || [];
            if (json.type === "token") text += json.token;
          } catch {}
        }
      }
    }

    return { text, citations, latencyMs: Date.now() - t0 };
  } catch (err: any) {
    return { text: `ERR: ${err.message}`, citations: [], latencyMs: Date.now() - t0 };
  }
}

async function runEvaluation(outputFilename: string = "baseline.json") {
  console.log(`\n======================================================`);
  console.log(`RUNNING PRODUCTION RAG EVALUATION SUITE`);
  console.log(`Dataset: ${DATASET_PATH}`);
  console.log(`======================================================\n`);

  const rawData = fs.readFileSync(DATASET_PATH, "utf-8");
  const dataset: TestCase[] = JSON.parse(rawData);

  const results: TestResult[] = [];
  const latencies: number[] = [];

  let inDomainCount = 0;
  let oosCount = 0;

  let totalHits = 0;
  let sumRR = 0;
  let sumPrecision = 0;
  let sumRecall = 0;

  let oosRefusedCount = 0;
  let oosWithCitationsCount = 0;

  for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i];
    process.stdout.write(`[${i + 1}/${dataset.length}] Evaluating "${item.id}"... `);

    // 1. Direct Retrieval Evaluation
    const retrieval = retrieveRelevantChunks(item.query, 4, "cfo");
    const retrievedIds = retrieval.topChunks.map((c) => c.id);

    // 2. Full Pipeline API Execution
    const apiResult = await queryAPI(item.query);
    latencies.push(apiResult.latencyMs);

    let hitAtK = false;
    let rank = 0;
    let relevantRetrieved = 0;

    if (!item.isOutOfScope && item.targetChunkIds.length > 0) {
      inDomainCount++;
      for (let r = 0; r < retrievedIds.length; r++) {
        if (item.targetChunkIds.includes(retrievedIds[r])) {
          if (!hitAtK) {
            hitAtK = true;
            rank = r + 1;
          }
          relevantRetrieved++;
        }
      }

      if (hitAtK) totalHits++;
      const rr = rank > 0 ? 1 / rank : 0;
      sumRR += rr;

      const pAtK = retrievedIds.length > 0 ? relevantRetrieved / retrievedIds.length : 0;
      const rAtK = item.targetChunkIds.length > 0 ? relevantRetrieved / item.targetChunkIds.length : 0;
      sumPrecision += pAtK;
      sumRecall += rAtK;
    } else {
      oosCount++;
    }

    // Check Out-of-Scope Refusal
    let refusedCorrectly = false;
    if (item.isOutOfScope) {
      // In a strict enterprise RAG system, out-of-scope questions MUST be refused.
      // Must state that the topic is outside the operational domain / cannot be answered.
      const textLower = apiResult.text.toLowerCase();
      const refusesAnswering =
        /outside (my|the|our) (operational|analytical|supply chain)?\s*domain|cannot answer|do not have verified.*records|strictly specialized/i.test(textLower) ||
        /specializ(e|ed) in commercial supply chain.*cannot answer/i.test(textLower);

      // Note: If the model answers the factual question (e.g. gives a recipe or details who Saddam was),
      // we check if it refused or attempted to answer general knowledge.
      // We will record the exact behavior to quantify baseline vs improved!
      const attemptedAnswer = /cake requires|flour|sugar|president of iraq|ruling iraq|dictator of iraq/i.test(textLower);
      refusedCorrectly = refusesAnswering && !attemptedAnswer;

      if (refusedCorrectly) oosRefusedCount++;
      if (apiResult.citations.length > 0) oosWithCitationsCount++;
    }

    // Check keyword surfacing
    let matchedKeywords = 0;
    for (const kw of item.expectedAnswerKeywords) {
      if (apiResult.text.toLowerCase().includes(kw.toLowerCase())) {
        matchedKeywords++;
      }
    }
    const keywordMatchRate =
      item.expectedAnswerKeywords.length > 0
        ? matchedKeywords / item.expectedAnswerKeywords.length
        : 1;

    results.push({
      id: item.id,
      type: item.type,
      query: item.query,
      isOutOfScope: item.isOutOfScope,
      retrievedChunkIds: retrievedIds,
      hitAtK,
      reciprocalRank: rank > 0 ? 1 / rank : 0,
      precisionAtK: retrievedIds.length > 0 ? relevantRetrieved / retrievedIds.length : 0,
      recallAtK: item.targetChunkIds.length > 0 ? relevantRetrieved / item.targetChunkIds.length : 0,
      citationsCount: apiResult.citations.length,
      responseLatencyMs: apiResult.latencyMs,
      generatedText: apiResult.text.trim().slice(0, 160) + "...",
      refusedCorrectly,
      keywordMatchRate,
    });

    console.log(`done (${apiResult.latencyMs}ms)`);
  }

  // Calculate Aggregates
  latencies.sort((a, b) => a - b);
  const p50Index = Math.floor(latencies.length * 0.5);
  const p95Index = Math.floor(latencies.length * 0.95);

  const hitRate = inDomainCount > 0 ? totalHits / inDomainCount : 0;
  const mrr = inDomainCount > 0 ? sumRR / inDomainCount : 0;
  const meanPrecision = inDomainCount > 0 ? sumPrecision / inDomainCount : 0;
  const meanRecall = inDomainCount > 0 ? sumRecall / inDomainCount : 0;

  const oosRefusalRate = oosCount > 0 ? oosRefusedCount / oosCount : 0;
  const oosFalseCitationRate = oosCount > 0 ? oosWithCitationsCount / oosCount : 0;

  const summary = {
    timestamp: new Date().toISOString(),
    totalQueries: dataset.length,
    inDomainQueries: inDomainCount,
    outOfScopeQueries: oosCount,
    retrievalMetrics: {
      hitRateAt4: Math.round(hitRate * 1000) / 1000,
      mrr: Math.round(mrr * 1000) / 1000,
      precisionAt4: Math.round(meanPrecision * 1000) / 1000,
      recallAt4: Math.round(meanRecall * 1000) / 1000,
    },
    generationAndSafetyMetrics: {
      outOfScopeRefusalRate: Math.round(oosRefusalRate * 1000) / 1000,
      outOfScopeFalseCitationRate: Math.round(oosFalseCitationRate * 1000) / 1000,
    },
    operationalMetrics: {
      p50LatencyMs: latencies[p50Index],
      p95LatencyMs: latencies[p95Index],
      meanLatencyMs: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
    },
    results,
  };

  const outputPath = path.join(process.cwd(), "eval", outputFilename);
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), "utf-8");

  console.log(`\n======================================================`);
  console.log(`EVALUATION COMPLETE -> Saved to ${outputPath}`);
  console.log(`======================================================`);
  console.log(`HitRate@4: ${(summary.retrievalMetrics.hitRateAt4 * 100).toFixed(1)}%`);
  console.log(`MRR: ${summary.retrievalMetrics.mrr.toFixed(3)}`);
  console.log(`Recall@4: ${(summary.retrievalMetrics.recallAt4 * 100).toFixed(1)}%`);
  console.log(`Precision@4: ${(summary.retrievalMetrics.precisionAt4 * 100).toFixed(1)}%`);
  console.log(`------------------------------------------------------`);
  console.log(`Out-of-Scope Refusal Rate: ${(summary.generationAndSafetyMetrics.outOfScopeRefusalRate * 100).toFixed(1)}%`);
  console.log(`Out-of-Scope False Citation Rate: ${(summary.generationAndSafetyMetrics.outOfScopeFalseCitationRate * 100).toFixed(1)}%`);
  console.log(`------------------------------------------------------`);
  console.log(`Latency P50: ${summary.operationalMetrics.p50LatencyMs}ms`);
  console.log(`Latency P95: ${summary.operationalMetrics.p95LatencyMs}ms`);
  console.log(`Mean Latency: ${summary.operationalMetrics.meanLatencyMs}ms`);
  console.log(`======================================================\n`);
}

runEvaluation(process.argv[2] || "baseline.json");
