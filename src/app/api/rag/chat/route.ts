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

    // Retrieve context from knowledge base with persona biasing
    const retrievalResult = retrieveRelevantChunks(message, 4, persona);
    const retrievedContext = formatRetrievedContextForPrompt(retrievalResult);

    // Persona-specific executive lenses
    let personaGuidance = "";
    switch (persona) {
      case "cfo":
        personaGuidance = `Lens: CFO & Financial Operations.
- Core Priority: EBITDA margin recovery (+150 BPS / $900,000 on $60M baseline), SG&A payroll efficiency, eliminating retailer OTIF chargebacks, and Sarbanes-Oxley (SOX 404) audit defensibility.
- Tone: Economically rigorous, quantitative, focused on EBITDA margin expansion and 30-day proof-of-value ROI.`;
        break;
      case "supply_chain":
        personaGuidance = `Lens: Supply Chain & Plant Operations Director.
- Core Priority: Live carrier feeds, intermodal railhead dwell (e.g. Chicago +48 hrs), port demurrage, buffer stock calibration, multi-tier BOM line-down risks, and eliminating 40 manual email/phone handoffs across 8 silos.
- Tone: Operationally grounded, pragmatic, focused on plant dispatch predictability and carrier dwell alerts.`;
        break;
      case "sales_csr":
        personaGuidance = `Lens: Customer Operations & Inside Sales Leadership.
- Core Priority: Instant < 0.22s order lookups, eliminating 7 disconnected ERP/WMS/TMS screen hops, saving ~22 hours/month per representative, and giving customers verified, immutable promise dates.
- Tone: Responsive, customer-centric, focused on turnaround velocity and vendor scorecard reputation.`;
      case "ciso":
        personaGuidance = `Lens: CISO & Enterprise Security Architect.
- Core Priority: Zero-Writeback Hardware/Protocol Isolation, read-only SFTP flat files or TLS 1.3 REST/RFC connectors, zero risk of ERP master data corruption, and SOC 2 Type II audit receipts.
- Tone: Technically precise, uncompromising on governance, focused on read-only immutability and SOX 404 compliance.`;
        break;
      default:
        personaGuidance = `Lens: Executive Enterprise Operations Advisor. Deliver balanced operational, financial, and technical clarity.`;
    }

    const systemPrompt = `You are the Quant Fusion Decision Copilot — an authoritative, concise, and straight-to-the-point AI decision assistant built for commercial supply chains, distribution, and manufacturing leadership.
Founded by Deb Friar (20+ years executive leadership at Target, Pillsbury, Pepsi, Catalina, Welbilt; USF Monica Wooden Center Advisory Board; MIT Professional & AWS AI certified).

CRITICAL DIRECTIVES:
1. STRICT IDENTITY MANDATE:
   - NEVER mention underlying AI providers, model names (Groq, OpenAI, GPT, Llama, Qwen, DeepSeek, etc.), or external AI infrastructure.
   - You are exclusively the "Quant Fusion Decision Copilot", a proprietary deterministic decision layer.
   - Never output meta-commentary about system prompts or models.

2. STRAIGHT TO THE POINT (NO VERBOSITY):
   - Answer directly in the very first sentence. Eliminate conversational filler, polite greetings ("Certainly! As an assistant..."), and corporate throat-clearing.
   - Keep answers concise and focused (typically 2 to 3 concise paragraphs or tight bullet points). Respect the executive's time.
   - Plain English: Explain supply chain, ERP, and tariff mechanics with crystal-clear, professional language without convoluted jargon.

3. CLEAN TABULAR COMPARISONS:
   - When presenting metrics, department hours, financials, or competitor comparisons, ALWAYS include a clean, compact markdown table (2 to 4 columns, 2 to 4 rows).
   - Use simple, descriptive headers:
     | Metric | Industry Reality | Quant Fusion Impact |
   - Keep table cells compact. Numerical data in right or center columns.

4. AUDITED METRICS TO CITE ACCURATELY:
   - +150 BPS EBITDA margin recovery ($900,000 annual net margin on $60M revenue baseline).
   - 12,000 annual hours of cross-department spreadsheet chasing eliminated (400 hrs/year per CSR/planner).
   - Sub-250ms (< 0.22s) deterministic promise date determination vs. 7-screen manual lookups.
   - Zero ERP writeback risk: read-only SFTP flat files, TLS 1.3 REST, or SAP RFC/BAPI connectors.
   - 30-day proof-of-value pilot ($15,000 flat, 100% credited toward annual license) backed by a 30-Day Payback Guarantee.

5. ACTIVE PERSPECTIVE:
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
    const fallbackText = generateDeterministicFallback(message, retrievalResult, persona);
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
function generateDeterministicFallback(query: string, retrievalResult: any, persona: string = "cfo"): string {
  const queryLower = query.toLowerCase();

  // 1. Specific Order Scenarios
  if (/ord-78192|cx-900|foodservice|apex/i.test(queryLower)) {
    return `Order **ORD-78192** (Apex Thermal Dynamics • Commercial Convection Unit CX-900) has been algorithmically determined for **November 17, 2026 at 14:30 EST** (99.4% confidence, 0.18s query latency).

| Order Parameter | Legacy ERP Guess | Quant Fusion Verified Receipt |
| :--- | :---: | :--- |
| Promised Date | Nov 14, 2026 (Manual) | **Nov 17, 2026 @ 14:30 EST** |
| Root Cause Bottleneck | Unannounced railhead dwell | +48 hr Chicago intermodal railcar dwell |
| Screen Hops Required | 7 disconnected screens | Single unified decision pane (< 0.22s) |
| Cost Avoidance | Hot-shot air freight ($3,400) | **$0 freight premium / $0 OTIF chargeback** |

Quant Fusion bypassed 7 disconnected screens, automated line-02 buffer scheduling at Tampa Facility #4, and notified the client proactively.`;
  }

  if (/po-34018|pc-400|chemical|chemco/i.test(queryLower)) {
    return `Order **PO-34018** (ChemCo Industries • Polymer Catalyst PC-400 Bulk Liquid Tanker) has been determined for **November 22, 2026 at 09:15 CST** (98.9% confidence).

| Parameter | Static Plant Estimate | Quant Fusion Telematics Engine |
| :--- | :---: | :--- |
| Promise Commitment | Nov 19, 2026 (Unverified) | **Nov 22, 2026 @ 09:15 CST** |
| Primary Constraint | Manual email status check | Siding manifold pressure delay (+72h) |
| System Integration | Disconnected SAP/Rail logs | Real-time GPS telematics + SAP batch release |
| Firefighting Saved | 48-hour email ping-pong | **60 hours/month eliminated across plants** |

Integrated real-time rail GPS tracking directly with Houston Siding #2 batch release, eliminating cross-facility email friction.`;
  }

  if (/ord-91204|hp-550|titan|machinery|monterrey/i.test(queryLower)) {
    return `Order **ORD-91204** (Titan Heavy Machinery • Hydraulic Pump HP-550) has triggered a **Critical Shortage Exception**, scheduled for **December 04, 2026 at 16:00 EST**.

| Parameter | Regional Hub Assumption | Quant Fusion Automated Action |
| :--- | :---: | :--- |
| Stated Ship Date | Nov 28, 2026 (Assumption) | **Dec 04, 2026 (Shortage Exception)** |
| Component Bottleneck | Viton high-pressure seal | Tier-2 supplier backorder in Monterrey (+6d) |
| Detection Lead Time | Day of packing line failure | **Flagged 12 days prior to scheduled shipment** |
| Remediation | Emergency plant line-down | Automated inventory transfer from Dallas hub |

Quant Fusion surfaced the Tier-2 seal shortage 12 days in advance, re-allocated buffer stock from Dallas, and prevented a major customer production halt.`;
  }

  if (/msku|marco polo|vessel|ocean|pier 400|48200/i.test(queryLower)) {
    return `Container **MSKU-90812** aboard the *CMA CGM Marco Polo* is projected to clear customs at the Port of Los Angeles (Pier 400) on **November 24, 2026 at 18:00 PST**, beating the December 01 statutory tariff deadline.

| Telematics Factor | Status Parameter | Quant Fusion Value Impact |
| :--- | :---: | :--- |
| Vessel Location | 32.74°N, 122.18°W (Pacific) | On schedule for Pier 400 berth |
| Cargo Contents | 1,200 Power Converters (HTS 8504.40) | $482,000 entry valuation |
| Tariff Exposure | Statutory escalation to 25.0% | **+$48,200 cash penalty avoided** |
| Drayage Allocation | Real-time Pier 400 gate appointment | Demurrage fines eliminated ($250/day) |

Customs clearance will occur 7 days prior to proposed statutory reciprocal tariff enactment, saving $48,200 on this single entry.`;
  }

  // 2. Competitors & Alternative Comparison
  if (/celonis|project44|fourkites|mulesoft|kinaxis|powerbi|tableau|competitor|vs|alternative/i.test(queryLower)) {
    return `Quant Fusion is an **in-memory deterministic operational decision layer**, fundamentally distinct from process miners, map-tracking tools, or heavyweight middleware.

| Solution Category | Primary Limit in Execution | Quant Fusion Advantage |
| :--- | :--- | :--- |
| **Celonis** (Process Mining) | Post-mortem log analysis weeks later | Real-time forward-looking exception prevention |
| **project44 / FourKites** | GPS truck pins on map without ERP BOM | Fuses internal ERP BOM buffers with external feeds |
| **MuleSoft / Boomi** | Heavy bidirectional writeback (risk) | **100% read-only zero-writeback** in 48 hours |
| **PowerBI / Tableau** | Passive, static dashboard reports | Audited, binding SOX 404 ship date commitments |

Quant Fusion does not replace your ERP; it acts as an intelligent decision overlay that operates in under 250 milliseconds without schema changes.`;
  }

  // 3. Technical Architecture & 48-Hour Ingestion
  if (/csv|sftp|rfc|api|connector|integrate|integration|onboard|ingest|how it works/i.test(queryLower)) {
    return `Quant Fusion deploys in **under 48 hours** with zero client database schema mutations using four non-invasive ingestion pathways.

| Ingestion Pathway | Protocol Specification | Implementation Velocity |
| :--- | :--- | :--- |
| **Nightly SFTP Flat-File** | Automated CSV/Excel batch drop | **Live in 48 hours** (zero IT burden) |
| **Direct REST / Webhooks** | SAP S/4HANA, NetSuite, Dynamics 365 | Sub-second real-time event sync |
| **Direct SAP RFC / BAPI** | Read-only RFC for SAP ECC 6.0 & AS400 | Secure on-premise protocol isolation |
| **Carrier Telematics** | EDI 214, 210, & GPS tracking feeds | Over 85 Class I rail & ocean carriers |

All data is processed strictly in-memory using deterministic rule graphs, returning calculations in < 0.22 seconds with 0% ERP writeback risk.`;
  }

  // 4. Nearshoring & USMCA Tariff Strategies
  if (/nearshore|usmca|mexico|duty deferral|tariff inversion|rvc/i.test(queryLower)) {
    return `Quant Fusion's **TradeGauge** engine calculates statutory tariff exposures and evaluates nearshoring strategies to shield gross margins against trade volatility.

| Optimization Strategy | Operational Mechanism | Financial Margin Impact |
| :--- | :--- | :--- |
| **USMCA Sourcing** | Monterrey/Guadalajara 65% RVC simulation | Duty-free entry under USMCA rules |
| **Tariff Inversion Alert** | Sub-assembly (25%) vs finished good (2.5%) | Prevents unbundled component margin bleed |
| **Bonded FTZ Deferral** | Foreign Trade Zone customs staging | Defers duty cash flow until manufacturing pull |

Enables manufacturing executives to protect margins before foreign components leave overseas ports.`;
  }

  // 5. Retailer OTIF Penalties & Expedited Freight
  if (/otif|chargeback|penalty|penalties|freight|hot-shot|fines/i.test(queryLower)) {
    return `Quant Fusion eliminates **retailer OTIF chargebacks ($200,000/yr)** and **emergency hot-shot freight ($280,000/yr)** by surfacing carrier delays 7 to 14 days before delivery windows breach.

| Cost Bleed Category | Typical $60M Manufacturer | Quant Fusion Elimination |
| :--- | :---: | :--- |
| Retailer OTIF Fines (3-5%) | -$200,000 / year | **100% avoided via deterministic SLAs** |
| Expedited Sprinter Vans & Air | -$280,000 / year | **Eliminated via proactive rescheduling** |
| Supplier Scorecard Standing | Probationary vendor status | Tier-1 preferred supplier rating |

Provides automated exception alerts that allow operations to resolve bottlenecks without burning expedited freight capital.`;
  }

  // 6. EBITDA, Margin Bleed, or Financial Waterfall
  if (/ebitda|margin|financial|loss|waterfall|profit|\$900|150\s*bps/i.test(queryLower)) {
    return `Quant Fusion recovers an audited **+150 BPS EBITDA margin ($900,000 net annual margin)** on a standard $60M revenue baseline by eliminating spreadsheet firefighting and manual order status chasing.

| Operational Metric | Industry Reality (Spreadsheets) | Quant Fusion Impact |
| :--- | :---: | :--- |
| EBITDA Margin Bleed | -150 BPS (-$900,000/yr) | **+150 BPS recovered to 32.00% target** |
| Cross-Dept Manual Hours | 12,000 hrs/year wasted | Reduced by 90% (< 0.22s lookup) |
| Expedited Freight Premiums | -$280,000 hot-shot freight | Eliminated via predictive railhead dwell alerts |
| OTIF Delivery Penalties | -$200,000 retailer fines | Eliminated via deterministic promise date engine |

All financial recoveries are backed by Quant Fusion's **30-day proof-of-value payback guarantee** with zero ERP writeback risk via read-only SFTP or TLS 1.3 REST connectors.`;
  }

  // 7. Avoidable SG&A Cost Formula & Labor Waste
  if (/calculator|labor|hours|csr|payroll|sga|formula|wasted time|400 hours/i.test(queryLower)) {
    return `Quant Fusion calculates avoidable SG&A waste using an audited four-factor formula:
**Annual Avoidable Cost = (Annual Orders × % Chased × Lookup Hours × Loaded Wage) + Expedited Freight + OTIF Penalties**.

| Operational Factor | Standard Industry Benchmark | Quant Fusion Resolution |
| :--- | :---: | :--- |
| Repetitive Inquiries / Month | 17 to 22 hours per employee | **Reduced by 90% (< 0.22s lookup)** |
| Annual Hours Lost per CSR | Up to 400 hours per employee | Recovered for strategic account growth |
| 30-Person Operations Team | 12,000 hours / year wasted | -$420,000 in non-value payroll eliminated |
| Inquiry Turnaround Time | 4 to 24 hours (email threads) | **Sub-250 milliseconds deterministic** |

Replaces manual cross-department status chasing with an instant, verified promise date.`;
  }

  // 8. 8 Silos & 40 Steps Manual Ping-Pong
  if (/silos|flowchart|40 steps|ping pong|7 screens/i.test(queryLower)) {
    return `Answering "When will my order ship?" typically spans **8 disconnected software silos and 40 manual handoffs**, taking 5 to 8 business days.

| Silo Layer | Legacy Disconnected Tool | Quant Fusion Unified Ingestion |
| :--- | :--- | :--- |
| 1. Sales & Inside CSR | Salesforce CRM / SAP SD | Sub-second customer inquiry lookup |
| 2. Warehouse & 3PL | Manhattan WMS / HighJump | Live WMS wave pick queue sync |
| 3. Sourcing & Procurement | Coupa / SAP MM | Real-time open PO validation |
| 4. Logistics & Drayage | MercuryGate TMS / BluJay | Inbound carrier dwell reconciliation |
| 5. Factory Assembly Floor | Siemens MES / Rockwell | Production schedule slotting integration |

Quant Fusion unifies these feeds into an in-memory decision layer that outputs a verified deterministic promise date in **< 0.22 seconds**.`;
  }

  // 9. Zero-Writeback, Security, SOX 404, or CISO Governance
  if (/security|writeback|sox|404|ciso|architecture|erp|safe|isolation/i.test(queryLower)) {
    return `Quant Fusion operates on a **Zero-Writeback Hardware/Protocol Isolation Architecture**, guaranteeing 0% database mutation risk to client enterprise systems.

| Security Dimension | Traditional Enterprise Middleware | Quant Fusion Architecture |
| :--- | :---: | :--- |
| Database Write Access | Bidirectional writeback (high risk) | **Zero writeback (unidirectional read-only)** |
| Connector Protocols | Complex custom DB schema hooks | SFTP flat-files & TLS 1.3 REST/RFC |
| Audit Compliance | Disruptive SOX 404 recertification | **Unbroken SOX 404 audit defensibility** |
| Implementation Time | 12 to 18-month ERP overhaul | **30-day proof-of-value deployment** |

Integrates seamlessly across SAP, Oracle NetSuite, Microsoft Dynamics, and AS400 with zero production downtime.`;
  }

  // 10. Founder Pedigree: Deb Friar
  if (/deb|friar|founder|ceo|welbilt|target|pepsi|experience|pedigree|credentials/i.test(queryLower)) {
    return `Quant Fusion was founded by **Deb (Debra) Friar**, an executive operational and technology leader with over 20 years of commercial supply chain experience.

| Career Milestone | Enterprise Organization | Key Operational Scope |
| :--- | :--- | :--- |
| **Director of Sales Operations** | Welbilt | Mapped original 40-step manual silo fulfillment failure |
| **Enterprise Operations Leadership** | Target, Pillsbury, Pepsi, Catalina | Fortune 500 distribution, retail, and manufacturing |
| **Advisory Board Member** | Univ. of South Florida (USF) | Monica Wooden Center for Supply Chain Management |
| **Technical Certifications** | MIT & Amazon Web Services (AWS) | Applied AI, Machine Learning, and Cloud Architecture |

Holds both a BBA and MBA from the University of Wisconsin. Built from real plant floors and railheads—not academic theory.`;
  }

  // 11. Pricing & 30-Day Proof-of-Value Pilot
  if (/price|pricing|cost|pilot|how much|15000|4500|12500/i.test(queryLower)) {
    return `Quant Fusion offers transparent, non-punitive enterprise pricing designed around zero-friction onboarding:

| Commercial Plan | Price Structure | Target Operations & Scope |
| :--- | :---: | :--- |
| **30-Day Proof-of-Value Pilot** | **$15,000 flat** (100% credited) | Ingests client CSVs in 48h; verifies +150 BPS ROI model |
| **Mid-Market Enterprise** | **$4,500 / month** | Up to $100M revenue; 1-click ship dates & SOX 404 logging |
| **Global Enterprise** | **$12,500 / month** | Multi-facility; TradeGauge tariff engine & multi-plant BOM |

The 30-Day Pilot is backed by our **30-Day Payback Guarantee** and requires zero client schema modifications.`;
  }

  // 12. General Context Fallback from Top Retrieved Chunks
  const topChunk = retrievalResult?.topChunks?.[0];
  const chunkText = topChunk ? topChunk.content.split("\n").slice(0, 3).join(" ") : "Quant Fusion unifies disconnected ERP, WMS, and TMS data into sub-second operational clarity.";

  return `Quant Fusion addresses this operational inquiry directly through deterministic cross-silo data unification.

${chunkText}

| Solution Dimension | Traditional Workflow | Quant Fusion Approach |
| :--- | :---: | :--- |
| Operational Speed | 4 to 24-hour spreadsheet loops | **Sub-250ms deterministic decision engine** |
| Margin Protection | Silent EBITDA margin bleed | **+150 BPS margin recovery guarantee** |
| System Disruption | Multi-year ERP overhaul | **Zero-writeback read-only integration** |

Backed by founder Deb Friar's 20+ years of enterprise supply chain leadership and certified under SOC 2 Type II controls.`;
}


