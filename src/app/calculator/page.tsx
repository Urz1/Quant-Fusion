import React from "react";
import Link from "next/link";
import { LedgerCalculator } from "@/components/LedgerCalculator";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Avoidable Costs Ledger | Quant Fusion",
  description: "Calculate avoidable SG&A waste caused by manual cross-department order status inquiries and multi-system lookups.",
};

export default function CalculatorPage() {
  return (
    <div className="w-full animate-page-enter">
      {/* Header */}
      <section className="py-16 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
            Operational Diagnostic Tool
          </span>
          <h1 className="font-serif text-[40px] sm:text-[46px] font-semibold text-ink-primary mt-2 tracking-tight">
            Avoidable Costs Ledger
          </h1>
          <p className="font-sans text-[17px] text-ink-secondary mt-3 max-w-2xl leading-relaxed">
            Calculate your enterprise’s avoidable SG&A payroll waste caused by manual cross-department order status inquiries, data hunting, and multi-system lookups.
          </p>
        </div>
      </section>

      {/* Main Ledger Section */}
      <section className="py-14 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <LedgerCalculator />

          {/* Methodology Footnotes */}
          <ScrollReveal direction="up" delay={140} scale={true} blur={true}>
            <div className="p-6 sm:p-8 rounded-lg bg-surface-sheet border border-border-rule shadow-sheet text-ink-secondary text-[13px] leading-relaxed space-y-5 interactive-card">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-btn-cta uppercase tracking-wider px-2 py-0.5 rounded bg-surface-recessed border border-border-rule">
                  Audited Benchmark
                </span>
                <span className="font-mono text-[11px] text-ink-muted">120 Verified Plant Interviews</span>
              </div>
              <h4 className="font-serif text-[20px] font-semibold text-ink-primary">
                Benchmark Methodology & Data Integrity
              </h4>
              <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed">
                The default hour metrics (Inside Sales: 22h, Logistics: 17h, Supply Chain: 13h, Purchasing: 9h, Finance: 9h, Field Sales: 8h) are grounded in deep qualitative interviews with 120 supply chain and operations leaders across North American mid-market and enterprise manufacturers ($50M–$100B in annual revenue).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-[12px]">
                <div className="p-4 bg-surface-recessed/60 rounded border border-border-rule interactive-card cursor-default space-y-1">
                  <span className="font-bold text-ink-primary block text-[13px]">Zero Disruption Pilot</span>
                  <span className="text-ink-muted text-[11px]">Runs via secure read-only SFTP flat files or REST connectors with zero writeback risk.</span>
                </div>
                <div className="p-4 bg-surface-recessed/60 rounded border border-border-rule interactive-card cursor-default space-y-1">
                  <span className="font-bold text-ink-primary block text-[13px]">30-Day Payback Guarantee</span>
                  <span className="text-ink-muted text-[11px]">Measurable time savings surfaced in executive dashboards within 30 days of data ingestion.</span>
                </div>
                <div className="p-4 bg-surface-recessed/60 rounded border border-border-rule interactive-card cursor-default space-y-1">
                  <span className="font-bold text-ink-primary block text-[13px]">Customs & Carrier Scope</span>
                  <span className="text-ink-muted text-[11px]">Includes ocean dwell, border clearance holds, port congestion, and assembly component sync.</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
