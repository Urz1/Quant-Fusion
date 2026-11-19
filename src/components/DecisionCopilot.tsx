"use client";

import React, { useState, useEffect, useRef } from "react";
import { LivelyRobot } from "@/components/LivelyRobot";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Truck,
  Headphones,
  Lock,
  ArrowUpRight,
  Cpu,
  Copy,
  Check,
  User,
  Square,
  Compass,
  MessageSquareQuote
} from "lucide-react";

type PersonaType = "general" | "cfo" | "supply_chain" | "sales_csr" | "ciso";

interface Citation {
  id: string;
  title: string;
  sourceDoc: string;
  sourcePath: string;
  auditRef: string;
  score: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  queryId?: string;
  citations?: Citation[];
  latencyMs?: number;
  timestamp: string;
  isStreaming?: boolean;
}

const PERSONA_CONFIG: Record<
  PersonaType,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; promptHint: string; description: string }
> = {
  general: {
    label: "All-Round",
    icon: Compass,
    promptHint: "Ask anything about orders, margins, tariffs, or ERP...",
    description: "General enterprise operations intelligence and determination engine.",
  },
  cfo: {
    label: "CFO & Finance",
    icon: TrendingUp,
    promptHint: "EBITDA recovery, 150 BPS loss, SOX 404 compliance...",
    description: "Margin waterfall, avoided SG&A payroll, and non-compliance penalties.",
  },
  supply_chain: {
    label: "Supply Chain",
    icon: Truck,
    promptHint: "EDI 214 telematics, railcar dwell, buffer stock, BOM...",
    description: "Live carrier tracking, port demurrage, and plant assembly delays.",
  },
  sales_csr: {
    label: "Customer Ops",
    icon: Headphones,
    promptHint: "Instant order promise dates, 7 ERP screen hops...",
    description: "CSR turnaround time, customer trust, and dealer scorecards.",
  },
  ciso: {
    label: "IT & CISO",
    icon: Lock,
    promptHint: "Zero-writeback protocol, read-only connectors, SOC 2...",
    description: "Database mutation risk, TLS 1.3 encryption, and data isolation.",
  },
};

const SUGGESTED_PROMPTS: Record<PersonaType, { label: string; query: string }[]> = {
  general: [
    { label: "150 BPS Loss", query: "How does Quant Fusion calculate the 150 BPS EBITDA loss?" },
    { label: "Order ORD-78192", query: "Simulate determination for Order ORD-78192 with Chicago rail dwell." },
    { label: "Zero-Writeback ERP", query: "Explain how Quant Fusion connects to SAP/Oracle with zero database writeback." },
    { label: "Vs Celonis & MuleSoft", query: "How does Quant Fusion differ from Celonis, project44, or MuleSoft?" },
    { label: "Deb Friar Pedigree", query: "What is Founder Deb Friar's background and operational track record?" },
  ],
  cfo: [
    { label: "EBITDA Waterfall", query: "Break down the exact EBITDA margin erosion from 32.00% to 30.50%." },
    { label: "Avoidable SG&A Formula", query: "Explain the four-factor Avoidable SG&A Cost formula and labor waste." },
    { label: "OTIF Penalties", query: "How does Quant Fusion eliminate retailer OTIF delivery penalties and freight premiums?" },
    { label: "30-Day Pilot Terms", query: "What are the commercial terms and ROI timeline for the $15,000 30-Day Pilot?" },
  ],
  supply_chain: [
    { label: "Railcar PO-34018", query: "Explain the bulk railcar telematics reconciliation in PO-34018." },
    { label: "Vessel MSKU-90812", query: "Track Container MSKU-90812 on CMA CGM Marco Polo and tariff impact." },
    { label: "40-Step Bottleneck", query: "How does Quant Fusion eliminate the 40-step manual fulfillment bottleneck?" },
    { label: "TradeGauge Tariffs", query: "How does TradeGauge calculate Section 301 and USMCA nearshoring rules?" },
  ],
  sales_csr: [
    { label: "Sub-0.22s Lookup", query: "How does Quant Fusion deliver sub-second order promise dates?" },
    { label: "7 Screen Hops", query: "How does the single-pane decision layer eliminate 7-screen ERP fatigue?" },
    { label: "Order Shortage Alert", query: "How did Quant Fusion detect the Viton seal shortage in Order ORD-91204?" },
    { label: "22 Hours Saved", query: "How does Quant Fusion save 22 hours per month per customer service rep?" },
  ],
  ciso: [
    { label: "Zero-Writeback Safety", query: "Can Quant Fusion ever mutate, lock, or corrupt our production ERP database?" },
    { label: "48-Hour Ingestion", query: "What are the four read-only ingestion protocols and how does 48-hour onboarding work?" },
    { label: "SOX 404 Audit Defensibility", query: "How does cryptographic SOX 404 audit logging protect revenue recognition?" },
    { label: "Architecture vs MuleSoft", query: "Compare Quant Fusion read-only protocol isolation against MuleSoft and Boomi." },
  ],
};

export function DecisionCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<PersonaType>("general");
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hello! I'm the **Quant Fusion Decision Copilot**.\n\nI can analyze operational friction across enterprise systems, calculate avoidable EBITDA margin loss (-150 BPS), simulate verified order promise dates (like `ORD-78192` or `PO-34018`), or explain our zero-writeback decision architecture.\n\nHow can I help you today?",
      timestamp: "Just now",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamLatency, setStreamLatency] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Smooth, non-blocking auto-scroll (preserves user scroll position if scrolled up)
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setInput("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantMessageId = `asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: "Thinking...",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsLoading(true);
    setStreamLatency(0);

    const startTime = Date.now();
    const latencyTimer = setInterval(() => {
      setStreamLatency(Date.now() - startTime);
    }, 50);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          message: queryText,
          persona,
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let incomingQueue = "";
      let displayedContent = "";
      let retrievedCitations: Citation[] = [];
      let currentQueryId = "";
      let buffer = "";
      let readerDone = false;

      // Silky-smooth adaptive streaming typewriter ticker
      const tickerPromise = new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
          if (abortController.signal.aborted) {
            clearInterval(intervalId);
            resolve();
            return;
          }

          if (incomingQueue.length > 0) {
            // Adaptive consumption:
            // Small backlog (< 20 chars): 1-2 chars per tick (~60-120 chars/sec, natural human reading pace)
            // Medium backlog (20-60 chars): 3-5 chars per tick
            // Large backlog (> 60 chars): 8-16 chars per tick (speeds up smoothly so never stalls)
            let step = 2;
            if (incomingQueue.length > 100) {
              step = 14;
            } else if (incomingQueue.length > 50) {
              step = 6;
            } else if (incomingQueue.length > 20) {
              step = 3;
            }

            const chunk = incomingQueue.slice(0, step);
            incomingQueue = incomingQueue.slice(step);
            displayedContent += chunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: displayedContent,
                      queryId: currentQueryId,
                      citations: retrievedCitations,
                      isStreaming: true,
                    }
                  : msg
              )
            );
          } else if (readerDone) {
            clearInterval(intervalId);
            resolve();
          }
        }, 16);
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const dataStr = trimmed.slice(5).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === "meta") {
              currentQueryId = parsed.queryId;
              retrievedCitations = parsed.citations || [];
            } else if (parsed.type === "token") {
              incomingQueue += parsed.token;
            } else if (parsed.type === "done") {
              clearInterval(latencyTimer);
              setStreamLatency(parsed.totalLatencyMs);
            }
          } catch {
            // Ignore incomplete chunks
          }
        }
      }

      readerDone = true;
      // Wait for ticker to gracefully finish outputting any remaining characters
      await tickerPromise;

      clearInterval(latencyTimer);
      const finalLatency = Date.now() - startTime;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: displayedContent,
                queryId: currentQueryId,
                citations: retrievedCitations,
                latencyMs: finalLatency,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (err: any) {
      clearInterval(latencyTimer);
      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: msg.content + "\n\n*(Generation paused by user)*",
                  timestamp: "Stopped",
                  isStreaming: false,
                }
              : msg
          )
        );
      } else {
        console.error("Chat error:", err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: `**[Operational Audit Note]**: ${err.message || "Failed to complete determination. Please check your network connection."}`,
                  timestamp: "Error",
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleResetConversation = () => {
    handleStopGeneration();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `**Conversation reset.** I am now listening with the **${PERSONA_CONFIG[persona].label}** lens. What operational challenge or scenario would you like to explore?`,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* =========================================================================
          INTERACTIVE 3D MINI-ROBOT ASSISTANT MASCOT (BOTTOM RIGHT)
      ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Open Quant Fusion AI Decision Copilot"
          >
            {/* Ambient Holographic Aura Glow (Ensures crisp contrast on dark footer & light parchment) */}
            <div className="absolute inset-1 rounded-full bg-emerald-400/15 blur-lg pointer-events-none group-hover:bg-emerald-400/30 transition-all duration-300" />

            {/* Standalone Interactive 3D Robot Mascot */}
            <LivelyRobot
              size="mascot"
              trackCursor={true}
              isStreaming={isLoading}
              showSpeechBubble={false}
              speechText="Ask Quant Fusion"
            />

            {/* Glowing Online Status Beacon Badge */}
            <span
              className="absolute bottom-2 right-3 flex h-3.5 w-3.5 pointer-events-none"
              title="Quant Fusion Assistant Online"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900 shadow-sm" />
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODERN AI ASSISTANT MODAL / BOTTOM SHEET
      ========================================================================= */}
      {isOpen && (
        <>
          {/* Soft Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-ink-primary/50 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Assistant Window Container */}
          <div className="fixed z-50 flex flex-col bg-canvas-page border border-border-rule shadow-2xl overflow-hidden transition-all duration-300
            max-sm:inset-x-0 max-sm:bottom-0 max-sm:h-[90vh] max-sm:rounded-t-2xl
            sm:bottom-6 sm:right-6 sm:w-[530px] md:w-[570px] sm:h-[700px] sm:rounded-2xl
          ">
            
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-surface-sheet">
              <div className="w-10 h-1 rounded-full bg-border-rule" />
            </div>

            {/* Header Bar */}
            <div className="bg-surface-sheet px-5 py-3.5 border-b border-border-rule flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-xs shrink-0 overflow-visible">
                  <LivelyRobot size="md" isStreaming={isLoading} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-surface-sheet rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[16px] font-semibold text-ink-primary leading-tight">
                      Quant Fusion Assistant
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-btn-cta animate-pulse" />
                    <span>Deterministic AI</span>
                    <span>•</span>
                    <span>SOX 404 Grounded</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1 text-ink-muted">
                <button
                  onClick={handleResetConversation}
                  title="New conversation"
                  className="p-1.5 rounded-lg hover:bg-surface-recessed text-ink-secondary hover:text-ink-primary transition-colors"
                  aria-label="New conversation"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="p-1.5 rounded-lg hover:bg-surface-recessed text-ink-secondary hover:text-ink-primary transition-colors"
                  aria-label="Close assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Interactive Analytical Lenses (Subtle Mode Chips) */}
            <div className="bg-surface-recessed/40 px-4 py-2 border-b border-border-rule/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {(Object.keys(PERSONA_CONFIG) as PersonaType[]).map((pKey) => {
                const cfg = PERSONA_CONFIG[pKey];
                const Icon = cfg.icon;
                const isActive = persona === pKey;
                return (
                  <button
                    key={pKey}
                    onClick={() => setPersona(pKey)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-btn-cta text-white shadow-xs font-semibold"
                        : "bg-surface-sheet text-ink-secondary hover:text-ink-primary hover:bg-surface-recessed border border-border-rule/80"
                    }`}
                  >
                    <Icon size={12} className={isActive ? "text-emerald-200" : "text-ink-muted"} />
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conversational Chat Stream Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-canvas-page">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white shrink-0 flex items-center justify-center mt-0.5 shadow-xs overflow-visible">
                        <LivelyRobot size="sm" isStreaming={msg.isStreaming} />
                      </div>
                    )}

                    <div className={`${isUser ? "max-w-[85%] sm:max-w-[80%] items-end" : "w-full max-w-[96%] items-start"} space-y-1.5`}>
                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-card ${
                          isUser
                            ? "bg-ink-primary text-white rounded-br-xs font-normal"
                            : "bg-surface-sheet text-ink-primary border border-border-rule/80 rounded-tl-xs"
                        }`}
                      >
                        {/* Rich Markdown Formatted Content */}
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownRenderer content={msg.content} isStreaming={msg.isStreaming} />
                        )}

                        {/* Audited Source Citations Chips */}
                        {msg.citations && msg.citations.length > 0 && !msg.isStreaming && (
                          <div className="pt-2.5 mt-2.5 border-t border-border-rule/70 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider font-semibold">
                              <ShieldCheck size={12} className="text-btn-cta" />
                              <span>Verified Citations:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.citations.map((cite) => (
                                <a
                                  key={cite.id}
                                  href={cite.sourcePath}
                                  onClick={() => {
                                    if (window.innerWidth < 640) setIsOpen(false);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-recessed hover:bg-border-rule border border-border-rule text-[11px] font-sans text-ink-primary hover:text-btn-cta transition-colors group shadow-2xs"
                                  title={cite.auditRef}
                                >
                                  <span className="truncate max-w-[170px]">{cite.title}</span>
                                  <span className="text-[10px] text-btn-cta font-mono font-bold">
                                    {cite.score}%
                                  </span>
                                  <ArrowUpRight size={10} className="text-ink-muted group-hover:text-btn-cta" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Footer Info (Timestamp & Actions) */}
                      {!isUser && !msg.isStreaming && (
                        <div className="flex items-center gap-3 px-1 text-[11px] font-mono text-ink-muted">
                          <span>{msg.timestamp}</span>
                          {msg.latencyMs && (
                            <span>• {msg.latencyMs}ms verified response</span>
                          )}
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="hover:text-ink-primary transition-colors flex items-center gap-1 ml-auto"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check size={11} className="text-btn-cta" />
                                <span className="text-btn-cta">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 shrink-0 flex items-center justify-center mt-0.5 text-xs font-semibold">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Streaming loading indicator when waiting for first token */}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2.5 text-ink-muted font-sans text-[13px] pl-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center shrink-0 overflow-visible">
                    <LivelyRobot size="sm" isStreaming={true} forceWave={true} />
                  </div>
                  <div className="flex items-center gap-1 p-2.5 rounded-2xl bg-surface-sheet border border-border-rule/80">
                    <span className="w-2 h-2 rounded-full bg-btn-cta animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-btn-cta animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-btn-cta animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="font-mono text-[11px] text-ink-muted ml-1.5">Consulting knowledge base...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Inquiries (Horizontal Chips) */}
            <div className="px-4 py-2 bg-surface-sheet border-t border-border-rule/70">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                <span className="text-[11px] font-mono text-ink-muted shrink-0 flex items-center gap-1">
                  <MessageSquareQuote size={12} className="text-btn-cta" />
                  <span>Ask:</span>
                </span>
                {SUGGESTED_PROMPTS[persona].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    disabled={isLoading}
                    className="shrink-0 text-[11px] font-sans px-2.5 py-1 rounded-full bg-surface-recessed/70 hover:bg-surface-recessed border border-border-rule/80 text-ink-secondary hover:text-ink-primary transition-all active:scale-95 disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-surface-sheet border-t border-border-rule">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-canvas-page rounded-xl border border-border-rule/90 focus-within:border-btn-cta focus-within:ring-1 focus-within:ring-btn-cta transition-all shadow-inner"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={PERSONA_CONFIG[persona].promptHint}
                  disabled={isLoading}
                  className="flex-1 bg-transparent px-3.5 py-3 text-[13px] font-sans text-ink-primary placeholder:text-ink-muted resize-none focus:outline-none max-h-24"
                />

                <div className="pr-2 flex items-center gap-1.5">
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="p-2 rounded-lg bg-friction-crimson hover:bg-friction-crimson/90 text-white transition-colors"
                      title="Stop generating"
                    >
                      <Square size={14} className="fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="p-2 rounded-lg bg-btn-cta hover:bg-btn-ctaHover disabled:opacity-30 disabled:hover:bg-btn-cta text-white transition-all active:scale-95"
                      aria-label="Send message"
                    >
                      <Send size={15} />
                    </button>
                  )}
                </div>
              </form>

              {/* Engine Telemetry Footer */}
              <div className="mt-2 px-1 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span className="flex items-center gap-1">
                  <Cpu size={11} className="text-emerald-600" />
                  <span>Zero-Writeback Decision Engine</span>
                </span>
                <span>Deterministic • SOX 404 Defensible</span>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  );
}
