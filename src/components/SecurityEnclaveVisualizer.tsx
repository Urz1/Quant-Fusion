"use client";

import { useState } from "react";
import { ShieldAlert, AlertOctagon, CheckCircle2, ArrowRight, ArrowDown, Server, Cpu } from "lucide-react";

export function SecurityEnclaveVisualizer() {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "blocked">("idle");
  const [logMessage, setLogMessage] = useState<string>("Ready for security architecture verification.");

  const handleSimulateAttack = () => {
    setTestStatus("testing");
    setLogMessage("Injecting mock HTTP POST / DB UPDATE writeback packet into enclave...");

    setTimeout(() => {
      setTestStatus("blocked");
      setLogMessage(
        "SOCKET REJECT: HTTP 403 FORBIDDEN. Writeback attempt terminated at socket layer. No write credentials or database mutation ports exist."
      );
    }, 600);
  };

  const handleReset = () => {
    setTestStatus("idle");
    setLogMessage("Ready for security architecture verification.");
  };

  return (
    <div className="bg-surface-sheet rounded-xl border border-border-rule shadow-sheet p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-rule gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-btn-cta uppercase tracking-wider">
              Architecture Security Simulator
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-ink-primary font-semibold">
              For CIOs, CISOs & IT Architects
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-semibold text-ink-primary mt-1">
            Zero-Writeback Hardware & Protocol Isolation
          </h3>
          <p className="font-sans text-[14px] text-ink-secondary mt-0.5">
            Quant Fusion operates as a strictly read-only decision enclave. We physically cannot modify your production ERP core.
          </p>
        </div>

        <button
          onClick={testStatus === "blocked" ? handleReset : handleSimulateAttack}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-[12px] font-medium rounded transition-colors shrink-0 ${
            testStatus === "blocked"
              ? "bg-surface-recessed hover:bg-border-rule text-ink-primary border border-border-rule"
              : "bg-friction-crimson hover:bg-red-800 text-white shadow-xs"
          }`}
        >
          {testStatus === "testing" ? (
            <span>Testing Socket...</span>
          ) : testStatus === "blocked" ? (
            <span>Reset Security Simulator</span>
          ) : (
            <>
              <AlertOctagon size={14} />
              <span>Simulate Writeback Attempt</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Data Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 items-center">
        {/* Node 1: Customer ERP */}
        <div className="p-5 sm:p-6 rounded-xl bg-surface-canvas border border-border-rule space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span className="font-semibold uppercase tracking-wider">CLIENT SYSTEM</span>
            <Server size={15} className="text-ink-primary" />
          </div>
          <div className="font-serif text-[18px] sm:text-[19px] font-semibold text-ink-primary">
            Production SAP / WMS Core
          </div>
          <div className="font-mono text-[11px] text-btn-cta flex items-center gap-1.5 pt-1">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Read-Only Connector (0% Mutation)</span>
          </div>
        </div>

        {/* The One-Way Gate */}
        <div className="p-5 sm:p-6 rounded-xl bg-surface-recessed/70 border border-border-rule text-center space-y-2.5 relative shadow-xs">
          <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider font-semibold">
            One-Way TLS 1.3 Pipe
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-[12px] font-bold text-ink-primary">
              INGESTION ONLY
            </span>
            <ArrowRight size={18} className="text-btn-cta hidden md:inline-block" />
            <ArrowDown size={18} className="text-btn-cta md:hidden" />
          </div>
          <div className="text-[11px] font-mono text-friction-crimson font-semibold flex items-center justify-center gap-1.5 pt-0.5">
            {testStatus === "blocked" ? (
              <>
                <ShieldAlert size={13} className="text-friction-crimson shrink-0" />
                <span>REVERSE WRITE BLOCKED</span>
              </>
            ) : (
              <span>Reverse Write Disabled</span>
            )}
          </div>
        </div>

        {/* Node 2: Quant Fusion Memory Enclave */}
        <div className="p-5 sm:p-6 rounded-xl bg-surface-canvas border border-border-rule space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span className="font-semibold uppercase tracking-wider">DECISION LAYER</span>
            <Cpu size={15} className="text-btn-cta" />
          </div>
          <div className="font-serif text-[18px] sm:text-[19px] font-semibold text-ink-primary">
            Quant Fusion In-Memory Enclave
          </div>
          <div className="font-mono text-[11px] text-ink-secondary pt-1">
            Deterministic Rule Engine &lt; 250ms
          </div>
        </div>
      </div>

      {/* Security Socket Diagnostic Console */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#181614] text-[#E2DED6] font-mono text-[11px] space-y-2 border border-[#35302B] shadow-inner">
        <div className="flex items-center justify-between pb-1 border-b border-[#2C2723] text-[#8C8478] text-[10px]">
          <span>SOCKET PROTOCOL MONITOR</span>
          <span className={testStatus === "blocked" ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
            {testStatus === "blocked" ? "IMMUTABILITY VERIFIED" : "READ-ONLY LOCK ACTIVE"}
          </span>
        </div>
        <div className="text-[#BAB3A7]">{logMessage}</div>
      </div>
    </div>
  );
}
