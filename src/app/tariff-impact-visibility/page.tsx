"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Database, 
  Shield, 
  FileText, 
  Globe, 
  Clock, 
  TrendingUp, 
  Ship, 
  Sliders, 
  CheckCircle2 
} from "lucide-react";
import { TradeGaugeGlobe, ORIGIN_HUBS } from "@/components/TradeGaugeGlobe";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function TariffExposurePage() {
  const [selectedSort, setSelectedSort] = useState<"rate" | "name">("rate");

  const sortedHubs = [...ORIGIN_HUBS].sort((a, b) => {
    if (selectedSort === "rate") {
      return (b.baseRate + b.section301 + b.reciprocalProposal) - (a.baseRate + a.section301 + a.reciprocalProposal);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-full bg-[#181614] text-[#E2DED6] min-h-screen animate-page-enter">
      
      {/* =======================================================================
          HERO BRIEFING: TRADEGAUGE™ MISSION
      ======================================================================= */}
      <section className="py-14 sm:py-20 border-b border-[#2C2723] relative overflow-hidden">
        {/* Subtle Maritime Grid Lines Accent */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#25221F] border border-amber-500/40 text-[11px] font-mono text-amber-300">
              <AlertTriangle size={13} className="text-amber-400 shrink-0" />
              <span>PROTOTYPE ENGINE • REQUIRES MAINTAINED FEDERAL TARIFF DATA SOURCE</span>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#201D1A] text-btn-cta border border-[#35302B]">
              TradeGauge™ Interactive Prototype
            </span>
          </div>

          <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[54px] font-semibold text-white tracking-tight max-w-4xl leading-[1.12] mt-4">
            You can’t outsmart dynamic tariffs with an outdated spreadsheet.
          </h1>

          <p className="font-sans text-[17px] sm:text-[19px] text-[#BAB3A7] max-w-3xl leading-relaxed mt-4">
            Statutory duty rates and enforcement dates shift overnight. TradeGauge™ continuously synchronizes live USITC Harmonized Tariff Schedule (HTS) feeds with inbound bills of ladingaligning overseas inventory arrivals with regulatory windows before container ships dock.
          </p>

          <div className="pt-6 flex flex-wrap gap-3 font-mono text-[12px]">
            <span className="px-3 py-1.5 rounded bg-[#221E1B] border border-[#35302B] text-white flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Real-Time USITC HTS Alignment
            </span>
            <span className="px-3 py-1.5 rounded bg-[#221E1B] border border-[#35302B] text-white flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              In-Transit Vessel Demurrage Protection
            </span>
            <span className="px-3 py-1.5 rounded bg-[#221E1B] border border-[#35302B] text-white flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Zero ERP Writeback Risk
            </span>
          </div>
        </div>
      </section>

      {/* =======================================================================
          FLAGSHIP SHOWPIECE: INTERACTIVE 3D GLOBE & SIMULATOR
      ======================================================================= */}
      <section className="py-12 sm:py-18 border-b border-[#2C2723] bg-[#141210]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-6">
          
          <ScrollReveal direction="up" blur={true}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] text-btn-cta uppercase tracking-wider font-semibold block">
                  Tactile Sourcing Command Center
                </span>
                <h2 className="font-serif text-[28px] sm:text-[34px] font-semibold text-white mt-1">
                  Interactive 3D TradeGauge™ Globe & Landed Cost Engine
                </h2>
              </div>
              <p className="text-[13px] font-mono text-[#8C8478] max-w-md">
                Drag to rotate the 3D globe, select product HTS classifications, and scrub the regulatory enforcement timeline to simulate landed margin exposure.
              </p>
            </div>
          </ScrollReveal>

          {/* Embedded Full Interactive Globe Component */}
          <ScrollReveal direction="up" delay={80} scale={true} blur={true}>
            <TradeGaugeGlobe />
          </ScrollReveal>

        </div>
      </section>

      {/* =======================================================================
          READABLE STATUTORY RECIPROCAL TARIFFS LEDGER
          (Replaces the unreadable tiny Wix screenshot with clear, responsive data)
      ======================================================================= */}
      <section className="py-16 md:py-22 border-b border-[#2C2723]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-8">
          
          <ScrollReveal direction="up" blur={true}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-btn-cta font-semibold block">
                  Statutory Trade Action Index
                </span>
                <h3 className="font-serif text-[28px] sm:text-[34px] font-semibold text-white mt-1">
                  Country-by-Country Reciprocal Exposure Schedule
                </h3>
                <p className="font-sans text-[15px] text-[#BAB3A7] mt-1 max-w-2xl">
                  Replaces unmaintained static tables with audited duty components across primary industrial sourcing corridors.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-[#8C8478]">Sort By:</span>
                <button
                  onClick={() => setSelectedSort("rate")}
                  className={`btn-press px-3 py-1 rounded border transition-colors ${
                    selectedSort === "rate"
                      ? "bg-btn-cta text-white border-btn-cta shadow-sm"
                      : "bg-[#201D1A] text-[#9E978E] border-[#35302B] hover:text-white"
                  }`}
                >
                  Highest Exposure Rate
                </button>
                <button
                  onClick={() => setSelectedSort("name")}
                  className={`btn-press px-3 py-1 rounded border transition-colors ${
                    selectedSort === "name"
                      ? "bg-btn-cta text-white border-btn-cta shadow-sm"
                      : "bg-[#201D1A] text-[#9E978E] border-[#35302B] hover:text-white"
                  }`}
                >
                  Country Name
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Table Container with Horizontal Scroll for Mobile */}
          <ScrollReveal direction="up" delay={80} scale={true} blur={true}>
            <div className="bg-[#201D1A] rounded-lg border border-[#35302B] overflow-hidden shadow-2xl interactive-card-dark">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px] font-mono">
                  <thead>
                    <tr className="bg-[#181614] border-b border-[#35302B] text-[11px] text-[#9E978E] uppercase tracking-wider">
                      <th className="py-3.5 px-5 font-semibold">Origin Hub</th>
                      <th className="py-3.5 px-5 font-semibold">Primary Port</th>
                      <th className="py-3.5 px-5 font-semibold">Base WTO Col 1</th>
                      <th className="py-3.5 px-5 font-semibold">Sec 301 Action</th>
                      <th className="py-3.5 px-5 font-semibold text-amber-300">Proposed Reciprocal</th>
                      <th className="py-3.5 px-5 font-semibold text-white">Total Landed Rate</th>
                      <th className="py-3.5 px-5 font-semibold">Transit (LA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2723] text-[#BAB3A7]">
                    {sortedHubs.map((hub) => {
                      const total = hub.baseRate + hub.section301 + hub.reciprocalProposal;
                      return (
                        <tr key={hub.id} className="hover:bg-[#25211D] transition-colors">
                          <td className="py-3.5 px-5 font-medium text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-btn-cta" />
                            {hub.name} ({hub.code})
                          </td>
                          <td className="py-3.5 px-5 text-[12px]">{hub.port}</td>
                          <td className="py-3.5 px-5">{hub.baseRate.toFixed(1)}%</td>
                          <td className="py-3.5 px-5">
                            {hub.section301 > 0 ? (
                              <span className="text-friction-crimson font-medium">+{hub.section301.toFixed(1)}%</span>
                            ) : (
                              "0.0%"
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-amber-300 font-medium">
                            {hub.usmcaExempt ? (
                              <span className="text-emerald-400">0.0% (USMCA)</span>
                            ) : (
                              `+${hub.reciprocalProposal.toFixed(1)}%`
                            )}
                          </td>
                          <td className="py-3.5 px-5 font-bold text-white text-[14px]">
                            {total > 0 ? `${total.toFixed(1)}%` : "0.0%"}
                          </td>
                          <td className="py-3.5 px-5 text-[12px]">{hub.transitDaysToLA} days</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#8C8478] flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3">
              <span>Source Baseline: USITC Harmonized Tariff Schedule Chapter 84 & 85 Reference Schedules.</span>
              <span>Illustrative data model for executive briefing.</span>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =======================================================================
          FIVE CORE CAPABILITIES OF TRADEGAUGE™
      ======================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#2C2723] bg-[#161311]">
        <div className="max-w-[1280px] mx-auto px-6 space-y-10">
          
          <ScrollReveal direction="up" blur={true}>
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] text-btn-cta uppercase tracking-wider font-semibold block">
                Core Platform Capabilities
              </span>
              <h3 className="font-serif text-[30px] sm:text-[38px] font-semibold text-white mt-1">
                How TradeGauge™ Protects Operating Margins
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <ScrollReveal direction="up" delay={60} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 h-full interactive-card-dark">
                <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                  <Sliders size={18} />
                </div>
                <h4 className="font-serif text-[18px] font-semibold text-white">
                  Unlimited Scenario Simulations
                </h4>
                <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                  Simulate component sourcing shifts across alternative origin ports (e.g. Kaohsiung vs. Haiphong vs. Monterrey) before issuing purchase orders.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 h-full interactive-card-dark">
                <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                  <Clock size={18} />
                </div>
                <h4 className="font-serif text-[18px] font-semibold text-white">
                  Inventory Arrival Alignment
                </h4>
                <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                  Continuously compares maritime AIS vessel ETAs and customs clearance dwell against statutory enforcement deadlines to flag demurrage and duty spikes.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={180} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 h-full interactive-card-dark">
                <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                  <Database size={18} />
                </div>
                <h4 className="font-serif text-[18px] font-semibold text-white">
                  Automated HTS Mapping
                </h4>
                <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                  Reconciles 10-digit USITC tariff codes against ERP purchase order line items and customs entry summaries (CBP Forms 3461/7501).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 h-full interactive-card-dark">
                <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                  <TrendingUp size={18} />
                </div>
                <h4 className="font-serif text-[18px] font-semibold text-white">
                  Predictive Landed Cost Modeling
                </h4>
                <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                  Projects gross margin erosion down to the individual SKU, allowing finance to adjust distributor pricing before container bills are finalized.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 h-full interactive-card-dark">
                <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                  <Shield size={18} />
                </div>
                <h4 className="font-serif text-[18px] font-semibold text-white">
                  Court Stay & Litigation Alerts
                </h4>
                <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed">
                  Monitors federal appellate stays and Section 301 exclusion docket updates so your procurement team doesn’t pay stayed or rescinded duties.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={360} scale={true} blur={true}>
              <div className="p-6 rounded-lg bg-[#1F1C19] border border-[#35302B] space-y-3 flex flex-col justify-between h-full interactive-card-dark">
                <div>
                  <div className="p-2.5 rounded bg-[#2A2622] text-btn-cta w-fit">
                    <FileText size={18} />
                  </div>
                  <h4 className="font-serif text-[18px] font-semibold text-white mt-3">
                    Statutory Ingestion Spec
                  </h4>
                  <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed mt-1">
                    Enterprise architecture ready to connect with your customs broker EDI feed (3461/7501) with zero writeback risk.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="pt-4 font-mono text-[12px] text-btn-cta font-medium flex items-center gap-1.5 hover:underline"
                >
                  Schedule Architecture Walkthrough <ArrowRight size={13} />
                </Link>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* =======================================================================
          CLOSING AUDIT ASSURANCE
      ======================================================================= */}
      <section className="py-16 md:py-20">
        <ScrollReveal direction="up" delay={100} scale={true} blur={true}>
          <div className="max-w-[1000px] mx-auto px-6 text-center space-y-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-btn-cta font-semibold block">
              Strategic Pitch Governance
            </span>
            <h2 className="font-serif text-[28px] sm:text-[36px] font-semibold text-white">
              Honest enterprise software means withholding claims you cannot verify.
            </h2>
            <p className="font-sans text-[15px] sm:text-[16px] text-[#BAB3A7] max-w-xl mx-auto leading-relaxed">
              Quant Fusion delivers decision clarity across verified operational data streams. For live statutory tariff ingestion, we connect to your designated customs broker EDI feed.
            </p>
            <div className="pt-3">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center justify-center px-8 py-4 bg-btn-cta hover:bg-btn-ctaHover text-white font-medium rounded transition-colors shadow-sm text-[15px]"
              >
                Request 30-Day Pilot Sourcing Review
                <ArrowRight size={17} className="ml-2" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
