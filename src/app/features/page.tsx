import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, Database, Cpu, Lock, RefreshCw, Layers } from "lucide-react";
import { SourceInspector } from "@/components/SourceInspector";
import { CsvSandboxDrop } from "@/components/CsvSandboxDrop";
import { SecurityEnclaveVisualizer } from "@/components/SecurityEnclaveVisualizer";
import { OperationalFlowchart } from "@/components/OperationalFlowchart";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Platform Architecture | Quant Fusion",
  description: "The 3-stage decision engine: UNIFY, TRANSFORM, and ACCESS. Connect isolated systems into verified ship dates with Sarbanes-Oxley audit compliance.",
};

export default function FeaturesPage() {
  return (
    <div className="w-full animate-page-enter">
      {/* Page Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
            System Architecture
          </span>
          <h1 className="font-serif text-[40px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight max-w-3xl">
            The decision layer built for fragmented enterprise stacks.
          </h1>
          <p className="font-sans text-[17px] sm:text-[18px] text-ink-secondary mt-4 max-w-2xl leading-relaxed">
            Quant Fusion operates as a lightweight, non-invasive decision layer. We unify relevant order data from disparate ERPs, 3PLs, and spreadsheets without demanding database migrations or system replacements.
          </p>
        </div>
      </section>

      {/* Empirical Architectural Catalyst: The 40-Step Operational Flowchart */}
      <section id="operational-map" className="py-14 sm:py-18 border-b border-border-rule bg-surface-recessed/30 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-6 space-y-6">
          <ScrollReveal direction="up" blur={true} className="max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
              Architectural Catalyst
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-semibold text-ink-primary mt-1">
              The 40-step multi-silo manual reality we eliminate.
            </h2>
            <p className="font-sans text-[15px] sm:text-[16px] text-ink-secondary mt-2 leading-relaxed">
              Before a verified date can be stamped, order data must cross 8 disconnected silos. This interactive blueprint visualizes the exact operational handoffs Quant Fusion resolves in under 1 second.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={120} scale={true} blur={true}>
            <OperationalFlowchart />
          </ScrollReveal>
        </div>
      </section>

      {/* The 3-Stage Pipeline: UNIFY -> TRANSFORM -> ACCESS */}
      <section className="py-16 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-20">
          
          {/* Stage 1: UNIFY */}
          <ScrollReveal direction="up" delay={80} scale={true} blur={true}>
            <div id="pipeline" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[12px] font-bold text-btn-cta tracking-widest uppercase block">
                  Stage 01
                </span>
                <h2 className="font-serif text-[32px] font-semibold text-ink-primary mt-1">
                  UNIFY
                </h2>
                <p className="font-sans text-[15px] text-ink-secondary mt-2 leading-relaxed">
                  Extract and harmonize critical order data from legacy silos without demanding IT overhaul.
                </p>
              </div>
              <div className="lg:col-span-8 bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-sheet space-y-6 interactive-card">
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Multi-Source Ingestion: APIs, Database Connectors, and Flat-File CSVs
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  Enterprise manufacturers run on a patchwork of tools: SAP ECC for orders, Manhattan for warehouse tracking, carrier portals for freight, and vendor emails for components. Quant Fusion ingests only the fields relevant to order commitment into an encrypted in-memory processing layer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-[13px] text-ink-primary">
                  <div className="p-3 bg-surface-recessed rounded flex items-center gap-2 border border-border-rule/40">
                    <Database size={16} className="text-btn-cta shrink-0" />
                    <span>SAP, Oracle & NetSuite Connectors</span>
                  </div>
                  <div className="p-3 bg-surface-recessed rounded flex items-center gap-2 border border-border-rule/40">
                    <RefreshCw size={16} className="text-btn-cta shrink-0" />
                    <span>Carrier EDI 214 & 315 Status Feeds</span>
                  </div>
                  <div className="p-3 bg-surface-recessed rounded flex items-center gap-2 border border-border-rule/40">
                    <Layers size={16} className="text-btn-cta shrink-0" />
                    <span>Flat-File CSV / Excel Ingestion on Day 1</span>
                  </div>
                  <div className="p-3 bg-surface-recessed rounded flex items-center gap-2 border border-border-rule/40">
                    <Lock size={16} className="text-btn-cta shrink-0" />
                    <span>Zero Writeback Risk to Production Core</span>
                  </div>
                </div>

                {/* Agave-Style Schema & Payload Inspector */}
                <div className="pt-4 border-t border-border-rule">
                  <SourceInspector />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 60-Second Client Sandbox Dropzone */}
          <ScrollReveal direction="up" delay={120} scale={true} blur={true}>
            <div className="pt-4">
              <CsvSandboxDrop />
            </div>
          </ScrollReveal>

          {/* Stage 2: TRANSFORM */}
          <ScrollReveal direction="up" delay={80} scale={true} blur={true}>
            <div id="algorithms" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[12px] font-bold text-btn-cta tracking-widest uppercase block">
                  Stage 02
                </span>
                <h2 className="font-serif text-[32px] font-semibold text-ink-primary mt-1">
                  TRANSFORM
                </h2>
                <p className="font-sans text-[15px] text-ink-secondary mt-2 leading-relaxed">
                  Task-specific algorithms apply manufacturing rules to reconcile shifting logistics variables.
                </p>
              </div>
              <div className="lg:col-span-8 bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-sheet space-y-4 interactive-card">
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Solving the "Combinatorial Explosion" in Order Routing
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  When a single commercial order depends on dozens of sub-components, overseas freight arrivals, and plant sub-assembly schedules, manual spreadsheet recalculation breaks down. Quant Fusion applies deterministic business rules combined with AI-assisted exception logic to recalculate real-time ship commitments in under 250 milliseconds.
                </p>
                <ul className="space-y-2 pt-2 text-[14px] text-ink-secondary">
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-btn-cta shrink-0 mt-0.5" />
                    <span>Dynamic prioritization based on promise date, customer SLA tier, and gross margin contribution.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-btn-cta shrink-0 mt-0.5" />
                    <span>Automated buffer logic adjusting for carrier port dwell, customs inspections, and weather holds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-btn-cta shrink-0 mt-0.5" />
                    <span>Instant KPI exception notifications before shipping deadlines are breached.</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Stage 3: ACCESS */}
          <ScrollReveal direction="up" delay={80} scale={true} blur={true}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[12px] font-bold text-btn-cta tracking-widest uppercase block">
                  Stage 03
                </span>
                <h2 className="font-serif text-[32px] font-semibold text-ink-primary mt-1">
                  ACCESS
                </h2>
                <p className="font-sans text-[15px] text-ink-secondary mt-2 leading-relaxed">
                  Sub-second 1-click query responses for customer operations, sales, and logistics teams.
                </p>
              </div>
              <div className="lg:col-span-8 bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-sheet space-y-4 interactive-card">
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Decisions, Not Dashboards
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  Traditional BI visualization dashboards only display historical failure. Quant Fusion delivers actionable, forward-looking operational determinations. Customer service representatives enter an order number and immediately receive the verified promise date, eliminating 40 manual cross-department handoffs.
                </p>
                <div className="relative w-full h-[220px] sm:h-[300px] rounded overflow-hidden border border-border-rule shadow-xs img-zoom-container">
                  <Image
                    src="/assets/product_order_console_cockpit.jpg"
                    alt="Quant Fusion 1-Click Order Determination Cockpit"
                    fill
                    unoptimized
                    className="object-cover parchment-photo"
                  />
                </div>

                <div className="p-4 bg-surface-recessed rounded border border-border-rule font-mono text-[13px] text-ink-primary flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>QUERY TARGET: ORD-78192</span>
                  <span className="text-btn-cta font-bold">1-CLICK DETERMINATION IN 0.22 SECONDS</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Security & Sarbanes-Oxley Compliance */}
      <section id="security" className="py-16 md:py-24 bg-surface-sheet border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <ScrollReveal direction="up" blur={true} className="max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-wider text-ink-muted block">
              Governance & Security
            </span>
            <h2 className="font-serif text-[30px] sm:text-[36px] font-semibold text-ink-primary mt-1">
              Sarbanes-Oxley Compliant by Design
            </h2>
            <p className="font-sans text-[16px] text-ink-secondary mt-2">
              Replacing unaudited spreadsheets with traceable, immutable algorithmic audit logs.
            </p>
          </ScrollReveal>

          {/* Interactive Security Simulator */}
          <ScrollReveal direction="up" delay={100} scale={true} blur={true}>
            <SecurityEnclaveVisualizer />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={80} scale={true} blur={true} className="flex">
              <div className="w-full p-5 bg-surface-recessed/50 rounded-lg border border-border-rule space-y-2.5 interactive-card">
                <Shield className="text-btn-cta" size={24} />
                <h3 className="font-serif text-[18px] font-semibold text-ink-primary">
                  SOX Section 404 Audit Log
                </h3>
                <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                  Every calculation, rule execution, and data update is timestamped and recorded, creating a defensible audit trail for revenue recognition.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={180} scale={true} blur={true} className="flex">
              <div className="w-full p-5 bg-surface-recessed/50 rounded-lg border border-border-rule space-y-2.5 interactive-card">
                <Lock className="text-btn-cta" size={24} />
                <h3 className="font-serif text-[18px] font-semibold text-ink-primary">
                  Role-Based Access Control (RBAC)
                </h3>
                <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                  Granular permissions ensure CSRs view only order promise commitments while finance retains full visibility into margin thresholds.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={280} scale={true} blur={true} className="flex">
              <div className="w-full p-5 bg-surface-recessed/50 rounded-lg border border-border-rule space-y-2.5 interactive-card">
                <Cpu className="text-btn-cta" size={24} />
                <h3 className="font-serif text-[18px] font-semibold text-ink-primary">
                  FastAPI & Python Architecture
                </h3>
                <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                  High-performance endpoints secured with TLS 1.3, hosted on Google Cloud Platform with automated encrypted daily backups.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-28 text-center">
        <ScrollReveal direction="up" delay={100} scale={true} blur={true} className="max-w-[1000px] mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-xl bg-surface-sheet border border-btn-cta/30 shadow-sheet space-y-6 interactive-card">
            <h2 className="font-serif text-[36px] sm:text-[44px] font-semibold text-ink-primary">
              Ready to test Quant Fusion with your historical CSV data?
            </h2>
            <p className="font-sans text-[17px] text-ink-secondary max-w-xl mx-auto leading-relaxed">
              Our team configures a proof-of-value sandbox in under 48 hours using your everyday exports.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center justify-center px-8 py-4 bg-btn-cta hover:bg-btn-ctaHover text-white text-[16px] font-medium rounded transition-colors shadow-sm"
              >
                Request Technical Sandbox
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
