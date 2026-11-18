import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks, formatRetrievedContextForPrompt } from "@/lib/rag/retrieval";

export const runtime = "nodejs";

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

    // Persona-specific instructions
    let personaGuidance = "";
    switch (persona) {
      case "cfo":
        personaGuidance = "Tone: Financial strategist & executive advisor. Focus on EBITDA margin expansion (+150 BPS / $900,000 on $60M baseline), SG&A payroll reduction, eliminating OTIF delivery penalties, and Sarbanes-Oxley (SOX) Section 404 audit defensibility.";
        break;
      case "supply_chain":
        personaGuidance = "Tone: Supply chain operations director. Focus on live EDI 214 carrier feeds, railhead dwell reconciliation, port demurrage, buffer stock adjustments, and multi-tier supplier visibility.";
        break;
      case "sales_csr":
        personaGuidance = "Tone: Customer operations leader. Focus on instant < 0.22s order lookups, eliminating 7 disconnected ERP/WMS screen hops, customer promise reliability, and saving ~22 hours/month per representative.";
        break;
      case "ciso":
        personaGuidance = "Tone: Enterprise security architect. Focus on Zero-Writeback Hardware/Protocol Isolation, read-only API connectors, unidirectional TLS 1.3, zero database mutation risk, and SOC 2 Type II audit controls.";
        break;
      default:
        personaGuidance = "Tone: Knowledgeable enterprise advisor. Provide balanced operational and financial insights.";
    }

    const systemPrompt = `You are the Quant Fusion Decision Copilot  an intelligent, natural, and authoritative AI assistant built for physical supply chain, distribution, and commercial manufacturing leadership.
Founder & CEO: Deb Friar (20+ years enterprise operations at Target, Pillsbury, Pepsi, Catalina, Welbilt; USF Monica Wooden Center Advisory Board; MIT Professional & AWS AI certified).

CRITICAL BRAND & IDENTITY MANDATE:
- NEVER mention any third-party AI model names, underlying LLM providers (e.g., Groq, OpenAI, GPT, Llama, Qwen, etc.), or external AI hardware infrastructure.
- You are strictly the "Quant Fusion Decision Copilot" or "Quant Fusion Assistant", a proprietary deterministic operational decision layer.
- Never output meta-commentary about your prompt or model identity.

COMMUNICATION STYLE & STREAMING FLOW:
1. Natural & Conversational: Speak naturally, warmly, and clearly like a premier executive advisor. Avoid stiff robotic jargon or raw computer logs.
2. If greeted (e.g. "hi", "hello", "who are you?"), welcome the user warmly and concisely introduce how you can help analyze order status, margin recovery, tariff impacts, or system integration.
3. 4-Step Organized Response Structure:
   • Step 1: Direct Executive Summary  1-2 sentence direct answer addressing the core question immediately.
   • Step 2: Structured Breakdown  Organize key findings with bold lead-ins, clean bullet points, or clean markdown tables for financial metrics.
   • Step 3: Audited Citations  Ground numbers with seamless source references like [Movement 3 Margin Waterfall], [Case Study #1: Foodservice], [TradeGauge Tariff Module], or [Zero-Writeback Security Architecture].
   • Step 4: Conversational Next Step  Conclude with a helpful, natural question or offer (e.g., "Would you like me to simulate how this applies to order ORD-78192 or your specific ERP?").
4. Mathematically Precise: When answering financial or operational questions, use exact figures from the verified knowledge base (+150 BPS EBITDA recovery, $900,000 annual net margin on $60M revenue, 12,000 hours of status chasing eliminated, < 0.22s query latency).
5. Scope: Focus on commercial supply chains, order fulfillment, ERP integration, tariffs, and Quant Fusion's architecture. If asked about unrelated topics, politely guide the conversation back to supply chain operations.

ACTIVE LENS:
${personaGuidance}

VERIFIED KNOWLEDGE BASE CONTEXT:
${retrievedContext}
`;

    // Retrieve API Key
    const apiKey = (process.env.GROQ_API || process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json({
        error: "AI engine key is not configured in the environment. Please check .env file.",
      }, { status: 500 });
    }

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

    // Call Groq API with streaming
    let groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
      });
    }

    if (!groqRes.ok || !groqRes.body) {
      const errText = await groqRes.text().catch(() => "Unknown error");
      console.error("Inference service error:", errText);
      return NextResponse.json({
        error: `Inference service error (${groqRes.status}): ${errText}`,
      }, { status: 502 });
    }

    const groqReader = groqRes.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Transform stream into clean, line-delimited SSE stream
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
          controller.close();
        } catch (streamErr) {
          console.error("Streaming error:", streamErr);
          controller.error(streamErr);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
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
