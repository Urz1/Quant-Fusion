"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Database, 
  TrendingUp, 
  Building2, 
  Globe,
  Compass,
  Zap
} from "lucide-react";
import { HeroConsole } from "@/components/HeroConsole";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function HomePage() {
  const [bpsMetricMode, setBpsMetricMode] = useState<"bps" | "dollars">("bps");

  return (
    <div className="w-full">
      
      {/* =========================================================================
          MOVEMENT 1: THE EXECUTIVE HERO
          Warm Paper Canvas (#ECE8DF) with Interactive Order Console Sheet (#FFFFFF)
      ========================================================================= */}
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-22 border-b border-border-rule overflow-hidden">
        {/* Subtle Ambient Radial Light with breathing animation */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[450px] bg-gradient-to-b from-[#E2DBD0]/70 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-glow-breathe" />

        <div className="max-w-[1280px] mx-auto px-6 space-y-10">
          
          {/* Header Narrative & Positioning */}
          <div className="max-w-3xl space-y-4">
            <div className="animate-hero-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-sheet border border-border-rule shadow-xs">
              <span className="w-2 h-2 rounded-full bg-btn-cta animate-telemetry" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-primary font-medium">
                Operations Decision Layer • Commercial Manufacturing & Distribution
              </span>
            </div>

            <h1 className="animate-hero-2 font-serif text-[44px] sm:text-[56px] lg:text-[64px] font-semibold text-ink-primary leading-[1.08] tracking-tight">
              One order. Eight isolated systems. <br />
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="italic font-normal animate-verified-sweep">
                  One verified ship date.
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-verified-underline pointer-events-none" />
              </span>
            </h1>

            <p className="animate-hero-3 font-sans text-[18px] sm:text-[20px] text-ink-secondary leading-relaxed max-w-2xl">
              Quant Fusion connects isolated ERPs, warehouse WMS, and ocean carrier tracking into sub-second ship commitments without a multi-year IT overhaul.
            </p>
          </div>

          {/* Flagship Showpiece: Interactive Working Order Console */}
          <div id="order-console" className="pt-2 animate-hero-console">
            <HeroConsole />
          </div>

          {/* Social Proof Strip & Enterprise Pedigree */}
          <div className="animate-hero-strip pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-border-rule/80 text-[12px] font-mono text-ink-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-btn-cta" />
              <span className="font-semibold text-ink-primary">Non-Invasive Deployment:</span>
              <span>Runs on daily flat-file CSVs or read-only REST/RFC connections. Zero core writeback risk.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>SOX 404 Compliant</span>
              <span>•</span>
              <span>AES-256 In-Memory Encryption</span>
              <span>•</span>
              <span>Day 1 SFTP Ingestion</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MOVEMENT 2: THE OPERATIONAL PAIN & 8-SILO CHALLENGE
          Verbatim Practitioner Transcripts + 8 Isolated Silos Teaser
      ========================================================================= */}
      <section className="py-18 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-wider text-friction-crimson font-semibold block">
              The 120-Interview Qualitative Diagnosis
            </span>
            <h2 className="font-serif text-[32px] sm:text-[42px] font-semibold text-ink-primary mt-1 tracking-tight">
              What really happens when a customer asks: <br />
              <span className="italic font-normal">“When will my order ship?”</span>
            </h2>
            <p className="font-sans text-[16px] text-ink-secondary mt-3 leading-relaxed">
              Across 120 operations, logistics, and finance leaders, the answer is never in one screen. It takes an average of 40 manual handoffs across eight disconnected software stacks.
            </p>
          </div>

          {/* 4 Practitioner Verbatim Cards with Real Photography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quote 1: Inside Sales */}
            <ScrollReveal direction="up" delay={80} scale={true}>
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-7 border border-border-rule shadow-card interactive-card space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[11px] text-friction-crimson uppercase tracking-wider font-semibold">
                      Inside Sales & Customer Operations
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted px-2 py-0.5 rounded bg-surface-recessed">
                      22 hrs / mo wasted per CSR
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-[110px] h-[95px] shrink-0 rounded overflow-hidden border border-border-rule img-zoom-container bg-surface-canvas shadow-xs">
                      <Image
                        src="/assets/dept_customer_ops_specialist.jpg"
                        alt="Inside Sales & Customer Operations Specialist"
                        fill
                        unoptimized
                        className="object-cover parchment-photo"
                      />
                    </div>
                    <blockquote className="font-serif text-[17px] sm:text-[18px] italic text-ink-primary leading-snug">
                      “We open five screens in SAP, check a spreadsheet for inbound railcars, and still end up calling the plant floor. By the time we answer, the date has already changed.”
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-rule flex items-center justify-between text-[12px] font-mono text-ink-muted">
                  <span className="font-medium text-ink-primary">VP of Customer Operations</span>
                  <span>$20B Specialty Chemicals</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Quote 2: Logistics */}
            <ScrollReveal direction="up" delay={160} scale={true}>
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-7 border border-border-rule shadow-card interactive-card space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[11px] text-friction-crimson uppercase tracking-wider font-semibold">
                      Logistics & Transportation
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted px-2 py-0.5 rounded bg-surface-recessed">
                      17 hrs / mo wasted per Planner
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-[110px] h-[95px] shrink-0 rounded overflow-hidden border border-border-rule img-zoom-container bg-surface-canvas shadow-xs">
                      <Image
                        src="/assets/dept_logistics_port_terminal.jpg"
                        alt="Port Logistics Container Terminal Staging"
                        fill
                        unoptimized
                        className="object-cover parchment-photo"
                      />
                    </div>
                    <blockquote className="font-serif text-[17px] sm:text-[18px] italic text-ink-primary leading-snug">
                      “A container sits in railhead dwell in Chicago for three days. Our EDI 214 carrier feed doesn’t talk to the warehouse WMS. Sales promises delivery, and we pay $1,200 for emergency hot-shot freight.”
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-rule flex items-center justify-between text-[12px] font-mono text-ink-muted">
                  <span className="font-medium text-ink-primary">Director of Logistics</span>
                  <span>$60M Commercial Equipment</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Quote 3: Sourcing */}
            <ScrollReveal direction="up" delay={240} scale={true}>
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-7 border border-border-rule shadow-card interactive-card space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[11px] text-friction-crimson uppercase tracking-wider font-semibold">
                      Supply Chain & Sourcing
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted px-2 py-0.5 rounded bg-surface-recessed">
                      19 hrs / mo wasted per Buyer
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-[110px] h-[95px] shrink-0 rounded overflow-hidden border border-border-rule img-zoom-container bg-surface-canvas shadow-xs">
                      <Image
                        src="/assets/dept_smart_warehouse_amr.jpg"
                        alt="Automated AGV Warehouse Logistics Staging"
                        fill
                        unoptimized
                        className="object-cover parchment-photo"
                      />
                    </div>
                    <blockquote className="font-serif text-[17px] sm:text-[18px] italic text-ink-primary leading-snug">
                      “When one sub-assembly supplier misses a date in Monterrey, the entire final assembly schedule in Cleveland stalls. We only catch it when assembly lines shut down.”
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-rule flex items-center justify-between text-[12px] font-mono text-ink-muted">
                  <span className="font-medium text-ink-primary">Director of Procurement</span>
                  <span>Tier-1 Automotive & Machinery</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Quote 4: Finance */}
            <ScrollReveal direction="up" delay={320} scale={true}>
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-7 border border-border-rule shadow-card interactive-card space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[11px] text-friction-crimson uppercase tracking-wider font-semibold">
                      Corporate Finance & Systems
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted px-2 py-0.5 rounded bg-surface-recessed">
                      150 BPS EBITDA Bleed
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-[110px] h-[95px] shrink-0 rounded overflow-hidden border border-border-rule img-zoom-container bg-surface-canvas shadow-xs">
                      <Image
                        src="/assets/dept_corporate_finance_suite.jpg"
                        alt="Corporate Finance Operations & Dual Screen Analytics"
                        fill
                        unoptimized
                        className="object-cover parchment-photo"
                      />
                    </div>
                    <blockquote className="font-serif text-[17px] sm:text-[18px] italic text-ink-primary leading-snug">
                      “OTIF chargebacks and detention fines eat 150 basis points of EBITDA. Because our promise dates are built on spreadsheets, we have zero audit trail to contest vendor claims.”
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-rule flex items-center justify-between text-[12px] font-mono text-ink-muted">
                  <span className="font-medium text-ink-primary">Chief Financial Officer</span>
                  <span>Specialty Chemical & Plastics</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Compact 8 Silos Architectural Teaser Banner */}
          <ScrollReveal direction="up" delay={200} scale={true}>
            <div className="p-6 rounded-lg bg-surface-sheet border border-border-rule shadow-sheet interactive-card flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-friction-crimson uppercase tracking-wider px-2 py-0.5 rounded bg-friction-wash">
                    Documented Field Artifact
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    Discovered across commercial plant operations
                  </span>
                </div>
                <h3 className="font-serif text-[22px] font-semibold text-ink-primary">
                  The 40-Step Operational Workflow Across Eight Isolated Databases
                </h3>
                <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                  Without a non-invasive decision layer, fulfilling a single order requires 40 handoffs across Sales, Warehouse, Sourcing, Logistics, Freight Carriers, Factory, Suppliers, and Financetaking 5 to 8 business days per inquiry.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/features#operational-map"
                  className="btn-press inline-flex items-center gap-2 px-5 py-3 rounded bg-btn-cta hover:bg-btn-ctaHover text-white text-[13px] font-mono font-medium transition-colors shadow-sm"
                >
                  <span>Explore 40-Step Architecture Map</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          MOVEMENT 3: THE CFO HARD TRUTH (MEGA-STAT CALLOUT)
          Whitespace on warm parchment with interactive metric switch & Waterfall
      ========================================================================= */}
      <section id="hard-truth" className="py-14 sm:py-20 md:py-24 border-b border-border-rule bg-surface-recessed/40 overflow-hidden relative scroll-mt-24">
        <ScrollReveal direction="up" blur={true} scale={true} className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold tracking-wider uppercase text-friction-crimson">
                  The Cost of Spreadsheets
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-sheet border border-border-rule text-ink-muted">
                  [Benchmark Model: $60M Revenue • To Verify Against Client Baseline]
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 p-1 rounded bg-surface-sheet border border-border-rule shadow-xs">
                <button
                  onClick={() => setBpsMetricMode("bps")}
                  className={`btn-press px-3.5 py-1.5 rounded text-[11px] font-mono font-medium transition-all ${
                    bpsMetricMode === "bps"
                      ? "bg-btn-cta text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  EBITDA Basis Points
                </button>
                <button
                  onClick={() => setBpsMetricMode("dollars")}
                  className={`btn-press px-3.5 py-1.5 rounded text-[11px] font-mono font-medium transition-all ${
                    bpsMetricMode === "dollars"
                      ? "bg-btn-cta text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  Dollar SG&A Loss ($60M Model)
                </button>
              </div>

              <div className="font-serif text-[70px] sm:text-[90px] font-bold text-ink-primary leading-none tracking-tight">
                {bpsMetricMode === "bps" ? "150 BPS" : "$900,000"}
              </div>

              <h3 className="font-serif text-[26px] sm:text-[32px] text-ink-primary font-medium leading-tight">
                {bpsMetricMode === "bps"
                  ? "The silent profit margin CFOs lose to spreadsheet firefighting, chargebacks, and un-audited delivery promises."
                  : "Annual payroll and operational penalty bleed at a single mid-market manufacturer running manual order lookups."}
              </h3>

              <p className="font-sans text-[16px] sm:text-[17px] text-ink-secondary leading-relaxed max-w-xl">
                At a single $60M distributor, the simple question <span className="italic">“When will my order ship?”</span> triggered cross-functional fire drills costing $900,000 annuallyover 12,000 hours of manual work scattered across isolated Excel sheets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
                <div className="p-3 bg-surface-sheet rounded border border-border-rule interactive-card cursor-default">
                  <span className="text-friction-crimson font-bold block text-[13px]">-$420K</span>
                  <span className="text-ink-muted text-[10px]">Labor & CSR Lookup Time</span>
                </div>
                <div className="p-3 bg-surface-sheet rounded border border-border-rule interactive-card cursor-default">
                  <span className="text-friction-crimson font-bold block text-[13px]">-$280K</span>
                  <span className="text-ink-muted text-[10px]">Expedited Freight Premiums</span>
                </div>
                <div className="p-3 bg-surface-sheet rounded border border-border-rule interactive-card cursor-default">
                  <span className="text-friction-crimson font-bold block text-[13px]">-$200K</span>
                  <span className="text-ink-muted text-[10px]">Customer OTIF Chargebacks</span>
                </div>
              </div>
            </div>

            {/* Financial Analysis Interactive Margin Waterfall Ledger */}
            <div className="lg:col-span-5">
              <div className="bg-surface-sheet rounded-lg border border-border-rule p-5 shadow-sheet space-y-4 interactive-card">
                <div className="flex items-center justify-between pb-3 border-b border-border-rule text-[11px] font-mono text-ink-muted">
                  <span className="flex items-center gap-1.5 font-medium text-ink-primary">
                    <TrendingUp size={13} className="text-friction-crimson" />
                    EBITDA Margin Waterfall Analysis
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-recessed text-ink-primary font-medium">$60M Model</span>
                </div>

                {/* Waterfall Visual Bars */}
                <div className="space-y-3 font-mono text-[11px]">
                  {/* Step 1: Baseline */}
                  <div>
                    <div className="flex justify-between text-ink-primary mb-1">
                      <span className="font-medium">1. Baseline Gross Margin Target</span>
                      <span className="font-bold text-ink-primary">32.00%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-recessed rounded-xs overflow-hidden">
                      <div className="h-full bg-slate-700 rounded-xs" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  {/* Step 2: CSR Firefighting Bleed */}
                  <div>
                    <div className="flex justify-between text-friction-crimson mb-1">
                      <span>2. CSR Lookup & Triage Payroll</span>
                      <span className="font-bold">-0.70% (-$420K)</span>
                    </div>
                    <div className="h-2.5 w-full bg-surface-recessed rounded-xs overflow-hidden flex justify-end">
                      <div className="h-full bg-friction-crimson rounded-xs" style={{ width: "22%" }}></div>
                    </div>
                  </div>

                  {/* Step 3: Expedited Freight */}
                  <div>
                    <div className="flex justify-between text-friction-crimson mb-1">
                      <span>3. Emergency Expedited Freight</span>
                      <span className="font-bold">-0.50% (-$280K)</span>
                    </div>
                    <div className="h-2.5 w-full bg-surface-recessed rounded-xs overflow-hidden flex justify-end">
                      <div className="h-full bg-friction-crimson/90 rounded-xs" style={{ width: "16%" }}></div>
                    </div>
                  </div>

                  {/* Step 4: OTIF Chargebacks */}
                  <div>
                    <div className="flex justify-between text-friction-crimson mb-1">
                      <span>4. Customer Delivery Chargebacks</span>
                      <span className="font-bold">-0.30% (-$200K)</span>
                    </div>
                    <div className="h-2.5 w-full bg-surface-recessed rounded-xs overflow-hidden flex justify-end">
                      <div className="h-full bg-friction-crimson/80 rounded-xs" style={{ width: "10%" }}></div>
                    </div>
                  </div>

                  {/* Step 5: Realized vs Recovered */}
                  <div className="pt-2 border-t border-border-rule space-y-2">
                    <div className="p-2.5 rounded bg-friction-crimson/10 border border-friction-crimson/30 flex items-center justify-between">
                      <span className="text-friction-crimson font-medium">Realized Margin (Excel Firefighting):</span>
                      <span className="font-serif text-[16px] font-bold text-friction-crimson">30.50%</span>
                    </div>

                    <div className="p-2.5 rounded bg-emerald-500/10 border border-btn-cta/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-btn-cta font-medium">
                        <Check size={14} className="stroke-[2.5]" />
                        <span>With Quant Fusion 1-Click Layer:</span>
                      </div>
                      <span className="font-serif text-[16px] font-bold text-btn-cta">32.00% (+150 BPS)</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-surface-recessed/70 border border-border-rule/60 text-[11px] font-mono text-ink-secondary leading-snug">
                  <span className="font-semibold text-ink-primary">Audited ROI:</span> Recovers $900,000 annual net margin by eliminating 12,000 hours of cross-departmental manual order tracking.
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          MOVEMENT 4: THREE SPECIALIZED SOLUTION ENGINES (PILLAR PREVIEW CARDS)
          Clear routing to specialized category destinations in navbar
      ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-border-rule bg-surface-recessed/30">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          
          <ScrollReveal direction="up" blur={true} className="max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
              Enterprise Solution Architecture
            </span>
            <h2 className="font-serif text-[32px] sm:text-[42px] font-semibold text-ink-primary mt-1 tracking-tight">
              Three deterministic engines built for physical supply chains.
            </h2>
            <p className="font-sans text-[16px] sm:text-[17px] text-ink-secondary mt-3 leading-relaxed">
              Explore specialized modules engineered to resolve statutory tariffs, audit SG&A payroll waste, and harmonize disparate ERP data streams.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* PILLAR 1: TradeGauge Landed Cost Foresight */}
            <ScrollReveal direction="up" delay={80} scale={true} blur={true} className="flex">
              <div className="w-full rounded-lg bg-[#161311] text-[#E2DED6] border border-[#35302B] p-6 sm:p-7 shadow-xl flex flex-col justify-between interactive-card-dark group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#25201C] text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30">
                      <Globe size={13} />
                      TradeGauge™ Foresight
                    </span>
                    <span className="font-mono text-[11px] text-[#8C8478]">177 Boundaries</span>
                  </div>

                  <h3 className="font-serif text-[24px] font-semibold text-white leading-snug">
                    Global Tariff Exposure & Maritime In-Transit Simulator
                  </h3>

                  <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                    Statutory duty rates shift overnight. Continuous reconciliation of 10-digit USITC codes against bills of lading, monitoring vessel arrivals against regulatory stay dates.
                  </p>

                  {/* Live Preview Metric Chip */}
                  <div className="p-3 bg-[#110F0E] rounded border border-[#2C2723] font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between text-[#8C8478]">
                      <span>Haiphong → Pier 400 LA:</span>
                      <span className="text-white font-bold">21 Days</span>
                    </div>
                    <div className="flex justify-between text-[#8C8478]">
                      <span>Reciprocal Stay Impact:</span>
                      <span className="text-emerald-400 font-bold">14.3% vs 46%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#2C2723]">
                  <Link
                    href="/tariff-impact-visibility"
                    className="btn-press w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-btn-cta hover:bg-btn-ctaHover text-white text-[13px] font-mono font-medium rounded transition-colors shadow-sm"
                  >
                    <span>Open Sourcing Command Center</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* PILLAR 2: Avoidable SG&A Cost Diagnostic */}
            <ScrollReveal direction="up" delay={200} scale={true} blur={true} className="flex">
              <div className="w-full rounded-lg bg-surface-sheet border border-border-rule p-6 sm:p-7 shadow-sheet flex flex-col justify-between interactive-card group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-recessed text-friction-crimson font-mono text-[11px] font-bold border border-border-rule">
                      <TrendingUp size={13} />
                      Avoidable Costs
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">$60M Model</span>
                  </div>

                  <h3 className="font-serif text-[24px] font-semibold text-ink-primary leading-snug">
                    Operational SG&A Payroll & Penalty Diagnostic
                  </h3>

                  <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                    Audit your enterprise baseline against 120 verified manufacturer benchmarks. Surface exact labor bleed, expedited freight penalties, and customer OTIF fines.
                  </p>

                  {/* Live Preview Metric Chip */}
                  <div className="p-3 bg-surface-recessed/60 rounded border border-border-rule font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between text-ink-muted">
                      <span>Identified Payroll Bleed:</span>
                      <span className="text-friction-crimson font-bold">-$420,000 / yr</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>EBITDA Margin Recovery:</span>
                      <span className="text-btn-cta font-bold">+150 Basis Points</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border-rule">
                  <Link
                    href="/calculator"
                    className="btn-press w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-recessed hover:bg-surface-sheet text-ink-primary border border-border-rule text-[13px] font-mono font-medium rounded transition-colors group-hover:border-btn-cta/40"
                  >
                    <span>Launch Avoidable Cost Ledger</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* PILLAR 3: Non-Invasive Platform Architecture */}
            <ScrollReveal direction="up" delay={320} scale={true} blur={true} className="flex">
              <div className="w-full rounded-lg bg-surface-sheet border border-border-rule p-6 sm:p-7 shadow-sheet flex flex-col justify-between interactive-card group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-recessed text-btn-cta font-mono text-[11px] font-bold border border-border-rule">
                      <Database size={13} />
                      Platform Engine
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">Zero Core Risk</span>
                  </div>

                  <h3 className="font-serif text-[24px] font-semibold text-ink-primary leading-snug">
                    Non-Invasive Decision Layer & Ingestion Pipeline
                  </h3>

                  <p className="font-sans text-[14px] text-ink-secondary leading-relaxed">
                    Connect SAP ECC, Oracle, Manhattan WMS, and EDI 214 feeds into an encrypted in-memory processing layer. Zero database writeback risk, deployed via Day 1 SFTP flat files.
                  </p>

                  {/* Live Preview Metric Chip */}
                  <div className="p-3 bg-surface-recessed/60 rounded border border-border-rule font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between text-ink-muted">
                      <span>Standard Connectors:</span>
                      <span className="text-ink-primary font-bold">SAP • Oracle • EDI 214</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Compliance & Security:</span>
                      <span className="text-btn-cta font-bold">SOX 404 • TLS 1.3</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border-rule">
                  <Link
                    href="/features"
                    className="btn-press w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-recessed hover:bg-surface-sheet text-ink-primary border border-border-rule text-[13px] font-mono font-medium rounded transition-colors group-hover:border-btn-cta/40"
                  >
                    <span>Inspect Platform Architecture</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* =========================================================================
          MOVEMENT 5: OPERATIONAL PEDIGREE, AUDIT GAP LIST & PILOT CLOSE
          Founder Provenance + Physical Realities + Commercial Commitment
      ========================================================================= */}
      <section className="py-18 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          
          {/* Founder Origin Narrative */}
          <ScrollReveal direction="up" blur={true}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-[280px] h-[340px] rounded-lg overflow-hidden shadow-sheet border border-border-rule bg-surface-canvas interactive-card img-zoom-container">
                  <Image
                    src="/assets/deb_friar_founder_official.jpg"
                    alt="Deb Friar, Founder & CEO of Quant Fusion"
                    fill
                    unoptimized
                    loading="eager"
                    className="object-cover object-top parchment-photo"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-semibold block">
                  Founder Narrative & Operational Heritage
                </span>
                <h2 className="font-serif text-[32px] sm:text-[38px] font-semibold text-ink-primary leading-tight tracking-tight">
                  Built from 20 years in enterprise supply chains, not in a classroom.
                </h2>
                <div className="space-y-4 font-sans text-[16px] text-ink-secondary leading-relaxed">
                  <p>
                    Deb Friar founded Quant Fusion after more than two decades leading operational, supply chain, and product innovation teams inside global enterprise organizationsincluding executive leadership at Target, Pillsbury, Pepsi, Catalina, and Welbilt.
                  </p>
                  <p>
                    At Welbilt, Deb witnessed the daily breakdown firsthand: cross-functional teams burning 40 manual steps across inside sales, logistics, procurement, and finance just to answer a simple distributor inquiry. She designed Quant Fusion as a lightweight, non-invasive decision layer that applies MIT-certified and AWS-backed algorithms to eliminate operational firefighting permanently.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-[12px] font-mono text-ink-muted">
                  <span className="px-3 py-1 bg-surface-sheet rounded border border-border-rule font-medium text-ink-primary interactive-card cursor-default">
                    Former Director of Sales Ops, Welbilt
                  </span>
                  <span className="px-3 py-1 bg-surface-sheet rounded border border-border-rule font-medium text-ink-primary interactive-card cursor-default">
                    Target, Pillsbury, Pepsi & Catalina
                  </span>
                  <span className="px-3 py-1 bg-surface-sheet rounded border border-border-rule font-medium text-ink-primary interactive-card cursor-default">
                    USF Monica Wooden Supply Chain Advisory Board
                  </span>
                  <span className="px-3 py-1 bg-surface-sheet rounded border border-border-rule font-medium text-ink-primary interactive-card cursor-default">
                    MIT Professional & AWS Certified
                  </span>
                  <a
                    href="https://www.linkedin.com/in/debrafriar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press px-3 py-1 bg-surface-sheet hover:bg-surface-recessed rounded border border-btn-cta/40 font-medium text-btn-cta inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRight size={12} />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Physical Supply Chain Photo Band */}
          <div className="pt-10 border-t border-border-rule">
            <ScrollReveal direction="up" blur={true}>
              <div className="flex items-center justify-between mb-6 font-mono text-[11px] text-ink-muted">
                <span className="flex items-center gap-1.5 font-medium text-ink-primary">
                  <Building2 size={13} className="text-btn-cta" />
                  FIELD CONTEXT • THE PHYSICAL SUPPLY CHAIN REALITY
                </span>
                <span>[Authentic Operational Facilities]</span>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Tampa Plant Card */}
              <ScrollReveal direction="up" delay={80} scale={true} blur={true} className="flex">
                <div className="w-full bg-surface-sheet rounded-lg border border-border-rule overflow-hidden shadow-sheet interactive-card flex flex-col group">
                  <div className="relative h-48 w-full border-b border-border-rule overflow-hidden img-zoom-container">
                    <Image
                      src="/assets/facility_tampa_advanced_plant.jpg"
                      alt="Tampa Commercial Manufacturing Plant - Precision Equipment Assembly"
                      fill
                      unoptimized
                      className="object-cover parchment-photo"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink-primary/80 backdrop-blur-xs text-white font-mono text-[10px]">
                      Tampa, FL • Facility #04
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Assembly Staging</div>
                      <div className="font-serif text-[17px] font-semibold text-ink-primary">Tampa Commercial Plant</div>
                      <p className="font-sans text-[13px] text-ink-secondary mt-1 leading-relaxed">
                        Component staging buffer where unannounced tier-2 supplier delays freeze sub-assembly lines.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border-rule/60 font-mono text-[10px] text-btn-cta font-medium">
                      Monitored: ERP Work Center #402
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Chicago Rail Yard Card */}
              <ScrollReveal direction="up" delay={180} scale={true} blur={true} className="flex">
                <div className="w-full bg-surface-sheet rounded-lg border border-border-rule overflow-hidden shadow-sheet interactive-card flex flex-col group">
                  <div className="relative h-48 w-full border-b border-border-rule overflow-hidden img-zoom-container">
                    <Image
                      src="/assets/facility_chicago_intermodal_rail.jpg"
                      alt="Chicago Logistics Class I Rail Intermodal Hub"
                      fill
                      unoptimized
                      className="object-cover parchment-photo"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink-primary/80 backdrop-blur-xs text-white font-mono text-[10px]">
                      Chicago, IL • Rail Intermodal
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Intermodal Transfer</div>
                      <div className="font-serif text-[17px] font-semibold text-ink-primary">Chicago Logistics Yard</div>
                      <p className="font-sans text-[13px] text-ink-secondary mt-1 leading-relaxed">
                        Where Class I rail dwell times and cross-dock freight appointments require continuous cross-system reconciliation.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border-rule/60 font-mono text-[10px] text-btn-cta font-medium">
                      Monitored: EDI 214 & Rail Dwell Feeds
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Port of LA Card */}
              <ScrollReveal direction="up" delay={280} scale={true} blur={true} className="flex">
                <div className="w-full bg-surface-sheet rounded-lg border border-border-rule overflow-hidden shadow-sheet interactive-card flex flex-col group">
                  <div className="relative h-48 w-full border-b border-border-rule overflow-hidden img-zoom-container">
                    <Image
                      src="/assets/facility_port_la_pier400.jpg"
                      alt="Port of Los Angeles Maritime Terminal Container Dwell"
                      fill
                      unoptimized
                      className="object-cover parchment-photo"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink-primary/80 backdrop-blur-xs text-white font-mono text-[10px]">
                      Port of Los Angeles • Pier 400
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">Ocean Container Dwell</div>
                      <div className="font-serif text-[17px] font-semibold text-ink-primary">Port of Los Angeles</div>
                      <p className="font-sans text-[13px] text-ink-secondary mt-1 leading-relaxed">
                        Where customs and chassis dwell triggers alternative-route calculations before demurrage charges accrue.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border-rule/60 font-mono text-[10px] text-btn-cta font-medium">
                      Monitored: AIS Vessel & Port EDI 315
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>

          {/* Pilot Guarantee & Closing Commercial Actions */}
          <ScrollReveal direction="up" delay={120} scale={true} blur={true}>
            <div className="p-8 sm:p-12 rounded-xl bg-surface-sheet border border-btn-cta/30 shadow-sheet space-y-5 text-center relative overflow-hidden interactive-card">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-recessed border border-btn-cta/30 font-mono text-[11px] text-btn-cta font-semibold">
                <ShieldCheck size={14} />
                <span>30-DAY COMMERCIAL COMMITMENT</span>
              </div>

              <h3 className="font-serif text-[32px] sm:text-[40px] font-semibold text-ink-primary tracking-tight">
                Ready to test Quant Fusion with your historical CSV data?
              </h3>
              
              <p className="font-sans text-[16px] text-ink-secondary max-w-xl mx-auto leading-relaxed">
                Connect your historical ERP flat files in under an hour. If we don’t prove positive ROI in 30 days of data reconciliation, you owe nothing.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                <Link
                  href="/contact"
                  className="btn-press inline-flex items-center justify-center px-8 py-4 bg-btn-cta hover:bg-btn-ctaHover text-white text-[15px] font-mono font-medium rounded transition-colors shadow-sm"
                >
                  Schedule Executive Walkthrough
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link
                  href="/features"
                  className="btn-press inline-flex items-center justify-center px-6 py-4 bg-surface-sheet hover:bg-surface-recessed text-ink-primary text-[14px] font-mono font-medium rounded border border-border-rule transition-colors"
                >
                  Inspect Platform Architecture
                </Link>
              </div>
              
              <div className="font-mono text-[12px] text-ink-muted pt-2">
                Direct Contact: Deb Friar, CEO • +1 (813) 736-0703 • info@quant-fusion.com
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

    </div>
  );
}
