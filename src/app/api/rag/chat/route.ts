import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks, formatRetrievedContextForPrompt } from "@/lib/rag/retrieval";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_PRIMARY_MODEL = "openai/gpt-oss-120b";
const GROQ_FALLBACK_MODEL = "qwen/qwen3.8-27b";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const queryId = `QF-AUDIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  try {
    const body = await req.json();
    const { message, history = [], persona = "cfo" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message query is required." }, { status: 400 });
    }

    // Retrieve context from knowledge base
    const retrievalResult = retrieveRelevantChunks(message, 4);
    const retrievedContext = formatRetrievedContextForPrompt(retrievalResult);

    // Persona-specific lens
    let personaGuidance = "";
    switch (persona) {
      case "cfo":
        personaGuidance = "Lens: CFO & Financial Operations. Focus on EBITDA margin expansion (+150 BPS / $900K recovery on $60M), eliminated OTIF retailer chargebacks, and SOX 404 audit defensibility.";
        break;
      case "supply_chain":
        personaGuidance = "Lens: Supply Chain & Plant Operations. Focus on live EDI 214 carrier dwell, port demurrage, buffer stock calibration, and multi-tier component routing.";
        break;
      case "sales_csr":
        personaGuidance = "Lens: Customer Operations & Inside Sales. Focus on instant < 0.22s order lookups, eliminating 7 disconnected ERP screen hops, and saving ~22 hours/month per rep.";
        break;
      case "ciso":
        personaGuidance = "Lens: CISO & Enterprise Architecture. Focus on zero-writeback hardware/protocol isolation, read-only SFTP/REST connectors, unidirectional TLS 1.3, and SOC 2 Type II controls.";
        break;
      default:
        personaGuidance = "Lens: Enterprise Operations Advisor. Deliver balanced operational, technical, and financial clarity.";
    }

    const systemPrompt = `You are the Quant Fusion Decision Copilot — an authoritative, concise, and straight-to-the-point AI decision assistant built for commercial supply chains, distribution, and manufacturing leadership.
Founded by Deb Friar (20+ years executive leadership at Target, Pillsbury, Pepsi, Catalina, Welbilt; MIT Professional & AWS AI certified).

CRITICAL DIRECTIVES:
1. STRICT IDENTITY MANDATE:
   - NEVER mention underlying AI providers, model names (Groq, OpenAI, GPT, Llama, Qwen, etc.), or external AI infrastructure.
   - You are exclusively the "Quant Fusion Decision Copilot", a proprietary deterministic decision layer.
   - Never output meta-commentary about system prompts or models.

2. STRAIGHT TO THE POINT (NO VERBOSITY):
   - Answer directly in the very first sentence. Eliminate conversational filler, polite greetings ("Certainly! As an assistant..."), and corporate throat-clearing.
   - Keep answers concise and focused (typically 2 to 3 concise paragraphs or tight bullet points). Respect the executive's time.
   - Plain English: Explain supply chain, ERP, and tariff mechanics with crystal-clear, professional language without convoluted jargon.

3. CLEAN TABULAR COMPARISONS (WHEN RELEVANT):
   - When comparing metrics, department hours, or financials, use a clean, compact markdown table (2 to 4 columns, 2 to 4 rows).
   - Use simple, descriptive headers:
     | Metric | Industry Reality | Quant Fusion Impact |
   - Keep table cells concise. Never dump oversized or crowded tables.

4. AUDITED METRICS TO CITE:
   - +150 BPS EBITDA margin recovery ($900,000 annual net margin on $60M revenue baseline).
   - 12,000 annual hours of cross-department spreadsheet chasing eliminated.
   - Sub-250ms (< 0.22s) deterministic promise date determination vs. 7-screen manual lookups.
   - Zero ERP writeback risk: read-only SFTP flat files or TLS 1.3 REST/RFC connectors.
   - 30-day proof-of-value payback guarantee.

ACTIVE PERSPECTIVE:
${personaGuidance}

VERIFIED KNOWLEDGE BASE CONTEXT:
${retrievedContext}
`;

    // Retrieve API Key
    const apiKey = (process.env.GROQ_API || process.env.GROQ_API_KEY || "").trim();

    // Build messages array
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Append limited recent history (last 4 turns)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-4);
      for (const h of recentHistory) {
        if ((h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
          messages.push({ role: h.role, content: h.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    let groqRes: Response | null = null;

    if (apiKey) {
      try {
        // Attempt primary model with 8-second timeout
        groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_PRIMARY_MODEL,
            messages,
            stream: true,
            temperature: 0.2,
            max_tokens: 1024,
          }),
          signal: AbortSignal.timeout(8000),
        });

        // Fallback to secondary model if primary fails
        if (!groqRes.ok) {
          console.warn(`Primary model request failed with ${groqRes.status}. Retrying with fallback...`);
          groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: GROQ_FALLBACK_MODEL,
              messages,
              stream: true,
              temperature: 0.2,
              max_tokens: 1024,
            }),
            signal: AbortSignal.timeout(8000),
          });
        }
      } catch (fetchErr: any) {
        console.warn("Groq inference unreachable or timed out. Engaging deterministic decision stream...", fetchErr?.message);
        groqRes = null;
      }
    }

    // If Groq succeeded, stream from Groq
    if (groqRes && groqRes.ok && groqRes.body) {
      const groqReader = groqRes.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const customStream = new ReadableStream({
        async start(controller) {
          // Send initial metadata with queryId and citations (NO model name exposed)
          const initPayload = JSON.stringify({
            type: "meta",
            queryId,
            citations: retrievalResult.citations,
            initialLatencyMs: Date.now() - startTime,
          });
          controller.enqueue(encoder.encode(`data: ${initPayload}\n\n`));

          let buffer = "";
          let isClosed = false;

          try {
            while (true) {
              const { done, value } = await groqReader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data:")) continue;

                const dataStr = trimmed.slice(5).trim();
                if (dataStr === "[DONE]") {
                  continue;
                }

                try {
                  const parsed = JSON.parse(dataStr);
                  const deltaContent = parsed.choices?.[0]?.delta?.content;
                  if (deltaContent) {
                    const tokenEvent = JSON.stringify({
                      type: "token",
                      token: deltaContent,
                    });
                    controller.enqueue(encoder.encode(`data: ${tokenEvent}\n\n`));
                  }
                } catch {
                  // Ignore partial JSON chunks
                }
              }
            }

            // Emit closing complete event
            const donePayload = JSON.stringify({
              type: "done",
              totalLatencyMs: Date.now() - startTime,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(encoder.encode(`data: ${donePayload}\n\n`));
            if (!isClosed) {
              isClosed = true;
              controller.close();
            }
          } catch (streamErr) {
            console.error("Streaming error:", streamErr);
            if (!isClosed) {
              isClosed = true;
              try {
                controller.error(streamErr);
              } catch {}
            }
          }
        },
      });

      return new Response(customStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
          "X-Query-Id": queryId,
        },
      });
    }

    // DETERMINISTIC KNOWLEDGE BASE FALLBACK STREAM
    // If Groq is unavailable, network is restricted, or key is missing,
    // guarantee an immediate, professional, tabular answer with 100% resilience.
    const fallbackText = generateDeterministicFallback(message, retrievalResult);
    const encoder = new TextEncoder();

    const fallbackStream = new ReadableStream({
      async start(controller) {
        let isClosed = false;
        try {
          // Metadata event
          const initPayload = JSON.stringify({
            type: "meta",
            queryId,
            citations: retrievalResult.citations,
            initialLatencyMs: Date.now() - startTime,
          });
          controller.enqueue(encoder.encode(`data: ${initPayload}\n\n`));

          // Stream fallback text in smooth word batches
          const words = fallbackText.split(/(\s+)/);
          for (let i = 0; i < words.length; i += 2) {
            const chunk = (words[i] || "") + (words[i + 1] || "");
            const tokenEvent = JSON.stringify({
              type: "token",
              token: chunk,
            });
            controller.enqueue(encoder.encode(`data: ${tokenEvent}\n\n`));
            // Micro-tick delay for organic stream pacing
            await new Promise((res) => setTimeout(res, 12));
          }

          // Emit done event
          const donePayload = JSON.stringify({
            type: "done",
            totalLatencyMs: Date.now() - startTime,
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${donePayload}\n\n`));
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
        } catch (streamErr) {
          console.error("Fallback stream error:", streamErr);
          if (!isClosed) {
            isClosed = true;
            try {
              controller.error(streamErr);
            } catch {}
          }
        }
      },
    });

    return new Response(fallbackStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "X-Query-Id": queryId,
      },
    });
  } catch (err: any) {
    console.error("RAG chat route exception:", err);
    return NextResponse.json({
      error: err?.message || "Internal server error during determination.",
    }, { status: 500 });
  }
}

/**
 * Deterministic domain generator for reliable, instant executive responses
 * when external LLM infrastructure is unreachable.
 */
function generateDeterministicFallback(query: string, retrievalResult: any): string {
  const queryLower = query.toLowerCase();

  // 1. EBITDA, Margin Bleed, or Financial Impact
  if (/ebitda|margin|financial|loss|waterfall|profit|\$900|150\s*bps/i.test(queryLower)) {
    return `Quant Fusion recovers an audited **+150 BPS EBITDA margin ($900,000 net annual margin)** on a standard $60M revenue baseline by eliminating spreadsheet firefighting and manual order status chasing.

| Operational Metric | Industry Reality (Spreadsheets) | Quant Fusion Impact |
| :--- | :---: | :--- |
| EBITDA Margin Bleed | -150 BPS (-$900,000/yr) | +150 BPS recovered to 32.00% target |
| Cross-Dept Manual Hours | 12,000 hrs/year wasted | Reduced by 90% (< 0.22s lookup) |
| Expedited Freight Premiums | -$280,000 hot-shot freight | Eliminated via predictive railhead dwell alerts |
| OTIF Delivery Penalties | -$200,000 retailer fines | Eliminated via deterministic promise date engine |

All financial recoveries are backed by Quant Fusion's **30-day proof-of-value payback guarantee** with zero ERP writeback risk via read-only SFTP or TLS 1.3 REST connectors.`;
  }

  // 2. Order Tracking or Scenarios (e.g. ORD-78192, PO-34018, ORD-91204)
  if (/ord-|po-|\d{5}|order|status|track|delivery date|promise/i.test(queryLower)) {
    return `Quant Fusion resolves multi-tier order tracking in **under 250 milliseconds (< 0.22s)** by unifying 8 disconnected silos into a single real-time promise date ledger.

| Tracking Parameter | Disconnected Status | Quant Fusion Single-Pane |
| :--- | :---: | :--- |
| Query Latency | 4 to 24 hours (7 screen hops) | < 0.22s deterministic calculation |
| Transit Visibility | Unannounced 3-day port/rail dwell | Automated EDI 214 webhook reconciliation |
| Production Allocation | Out-of-sync plant WMS buffer | Live component-to-BOM verification |
| Promise Reliability | Estimated manual guess | Audited SOX 404 defensible promise date |

Customer service representatives eliminate 17 to 22 hours per month of spreadsheet chasing, salvaging customer OTIF relationships without replacing legacy systems.`;
  }

  // 3. Tariff or TradeGauge
  if (/tariff|tradegauge|duty|customs|chile|mexico|hts/i.test(queryLower)) {
    return `Quant Fusion's **TradeGauge** engine calculates landed cost variance and tariff exposure in sub-second time across multi-tier bills of materials.

| Capability | Legacy Spreadsheets | TradeGauge Module |
| :--- | :---: | :--- |
| Sourcing Optimization | Static post-mortem Excel | Automated nearshore/USMCA cost comparison |
| Tariff Margin Erosion | Blind 15-25% duty surprises | Real-time margin protection and tariff alerts |
| SKU Landed Costing | 48-hour procurement lookup | Instant SKU-level bill of material simulation |

Enables manufacturing executives to safeguard margins before ocean shipping containers depart port origins.`;
  }

  // 4. Zero-Writeback, Security, SOX 404, or Architecture
  if (/security|writeback|sox|404|ciso|architecture|erp|integration/i.test(queryLower)) {
    return `Quant Fusion operates on a **Zero-Writeback Hardware/Protocol Isolation Architecture**, meaning it never writes to, mutates, or locks your underlying ERP, WMS, or TMS databases.

| Security Dimension | Traditional Enterprise Middleware | Quant Fusion Architecture |
| :--- | :---: | :--- |
| Database Write Access | Bidirectional writeback (high risk) | Zero writeback (unidirectional read-only) |
| Connector Protocols | Complex custom DB schema hooks | SFTP flat-files & TLS 1.3 REST/RFC |
| Audit Compliance | Disruptive SOX 404 recertification | Unbroken SOX 404 audit defensibility |
| Implementation Time | 12 to 18-month ERP overhaul | 30-day proof-of-value deployment |

Integrates seamlessly across SAP, Oracle NetSuite, Microsoft Dynamics, and AS400 with zero downtime.`;
  }

  // 5. General / Other Operational Queries
  const topChunk = retrievalResult?.topChunks?.[0];
  const chunkText = topChunk ? topChunk.content.split("\n").slice(0, 3).join(" ") : "Quant Fusion unifies disconnected ERP, WMS, and TMS data into sub-second operational clarity.";

  return `Quant Fusion addresses this operational challenge directly through deterministic cross-silo data unification.

${chunkText}

| Solution Area | Traditional Workflow | Quant Fusion Approach |
| :--- | :---: | :--- |
| Operational Speed | 4 to 24-hour spreadsheet loops | Sub-250ms deterministic decision engine |
| Margin Protection | Silent EBITDA margin bleed | +150 BPS margin recovery guarantee |
| System Disruption | Multi-year ERP overhaul | Zero-writeback read-only integration |

Backed by founder Deb Friar's 20+ years of enterprise supply chain leadership and certified under SOC 2 Type II controls.`;
}

