"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Check,
  FileText, 
  Users, 
  Package, 
  Truck, 
  Ship, 
  Factory, 
  Building2, 
  Landmark, 
  Sparkles,
  Eye,
  Info,
  Zap,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export type FlowchartMode = "status_quo" | "quant_fusion" | "original_artifact";

export interface DepartmentSilo {
  id: string;
  name: string;
  short: string;
  siloNumber: string;
  system: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  manualPain: string;
  quantFusionFix: string;
  hoursWastedPerMonth: number;
}

export const DEPARTMENT_SILOS: DepartmentSilo[] = [
  {
    id: "sales",
    name: "Sales & Customer Ops",
    short: "Sales",
    siloNumber: "01",
    system: "Salesforce CRM / SAP SD",
    icon: Users,
    manualPain: "CSRs spend 22 hrs/month answering customer inquiry emails, checking 7 disconnected ERP screens, and making unverified delivery promises.",
    quantFusionFix: "1-Click verified ship date console directly accessible to inside sales without leaving CRM or calling operations.",
    hoursWastedPerMonth: 22,
  },
  {
    id: "warehouse",
    name: "Warehouse & Fulfillment",
    short: "Warehouse",
    siloNumber: "02",
    system: "Manhattan WMS / HighJump",
    icon: Package,
    manualPain: "Inventory batches only sync once every 4 hours, causing CSRs to promise finished goods that were already committed to other purchase orders.",
    quantFusionFix: "Real-time available-to-promise (ATP) reconciliation with sub-second inventory allocation reservation locks.",
    hoursWastedPerMonth: 14,
  },
  {
    id: "sourcing",
    name: "Purchasing & Sourcing",
    short: "Sourcing",
    siloNumber: "03",
    system: "Coupa / SAP MM / Excel POs",
    icon: FileText,
    manualPain: "Buyers juggle open PO lead times across 40+ vendor spreadsheets, manually typing revised component dates into notes fields.",
    quantFusionFix: "Automated multi-tier component tracking flagging critical path vendor stockouts before production runs begin.",
    hoursWastedPerMonth: 19,
  },
  {
    id: "logistics",
    name: "Internal Logistics",
    short: "Logistics",
    siloNumber: "04",
    system: "MercuryGate TMS / Inbound BOLs",
    icon: Truck,
    manualPain: "Bills of lading (BOL) are filed in PDF attachments and shared network folders, requiring manual cross-dock lookup for in-transit status.",
    quantFusionFix: "Standardized BOL flat-file ingestion automatically parsing dock appointment windows and container manifest line items.",
    hoursWastedPerMonth: 16,
  },
  {
    id: "carriers",
    name: "Freight Carriers & 3PLs",
    short: "Carriers",
    siloNumber: "05",
    system: "EDI 214 / Ocean Tracking / AIS",
    icon: Ship,
    manualPain: "Carrier EDI dwell feeds arrive out-of-order; customs holds and railhead congestion are discovered only after ship docking.",
    quantFusionFix: "Continuous EDI 214 carrier telemetry and real-time geodetic AIS vessel tracking aligned with USITC clearance dates.",
    hoursWastedPerMonth: 18,
  },
  {
    id: "factory",
    name: "Factory & Plant Scheduling",
    short: "Factory",
    siloNumber: "06",
    system: "Siemens MES / JobBoss Production",
    icon: Factory,
    manualPain: "Shop floor work order schedules are revised daily based on missing sub-assemblies, leaving sales completely blind to line delays.",
    quantFusionFix: "BOM-level component gating linking manufacturing line completion targets directly to verified customer ship dates.",
    hoursWastedPerMonth: 21,
  },
  {
    id: "suppliers",
    name: "Tier-1 & Tier-2 Suppliers",
    short: "Suppliers",
    siloNumber: "07",
    system: "Vendor Portals / Email Inquiries",
    icon: Building2,
    manualPain: "Phone tag and 24-48 hr email delays to confirm overseas supplier vessel lading dates for single sub-assembly parts.",
    quantFusionFix: "Self-serve vendor commitment feeds and automated deviation detection against historical supplier reliability baselines.",
    hoursWastedPerMonth: 24,
  },
  {
    id: "finance",
    name: "Finance & Revenue Ops",
    short: "Finance",
    siloNumber: "08",
    system: "Oracle GL / NetSuite / RevRec",
    icon: Landmark,
    manualPain: "Uncalibrated ship dates trigger customer chargebacks, retailer OTIF fines (3% of invoice), and expedited air-freight penalties.",
    quantFusionFix: "SOX 404 audit-stamped fulfillment logs and defendable timestamp proof eliminating OTIF penalty deductions.",
    hoursWastedPerMonth: 15,
  },
];

const SILO_MOBILE_DETAILS: Record<string, { frictionTag: string; transitionText?: string }> = {
  sales: {
    frictionTag: "Screen Toggling (5+ Windows)",
    transitionText: "Step 2: Check Physical Inventory in WMS",
  },
  warehouse: {
    frictionTag: "WMS Sync Lag (4h Batch Delay)",
    transitionText: "Step 3: Check Open Vendor Purchase Orders",
  },
  sourcing: {
    frictionTag: "40+ Vendor Spreadsheets",
    transitionText: "Step 4: Check Inbound Freight Documentation",
  },
  logistics: {
    frictionTag: "Unlinked PDF BOLs",
    transitionText: "Step 5: Query Carrier Ocean / Railhead Telemetry",
  },
  carriers: {
    frictionTag: "+48h Port Dwell Delay",
    transitionText: "Step 6: Routing to Factory Line or Supplier",
  },
  factory: {
    frictionTag: "Blind Assembly Queue",
    transitionText: "Step 7: Sourcing Tier-1 Supplier Feeds",
  },
  suppliers: {
    frictionTag: "Vendor Phone Tag (24-48h Lag)",
    transitionText: "Step 8: Revenue Billing & Chargeback Review",
  },
  finance: {
    frictionTag: "Revenue At Risk (3% OTIF Fines)",
    transitionText: "Manual Commitment Stamped",
  },
};

export function OperationalFlowchart() {
  const [mode, setMode] = useState<FlowchartMode>("status_quo");
  const [selectedSilo, setSelectedSilo] = useState<DepartmentSilo>(DEPARTMENT_SILOS[0]);
  const [mobileExpandedSiloId, setMobileExpandedSiloId] = useState<string | null>("warehouse");

  return (
    <div className="bg-surface-sheet rounded-xl p-6 sm:p-8 lg:p-10 border border-border-rule shadow-sheet space-y-8 sm:space-y-10">
      
      {/* =======================================================================
          TOP BAR: CONSOLE HEADER & 3-WAY VIEW SWITCHER
      ======================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-border-rule gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-friction-crimson uppercase tracking-wider">
              Documented Field Artifact • Operational Workflow Map
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-ink-muted border border-border-rule">
              Empirical 40-Step Fulfillment Cycle
            </span>
          </div>
          <h3 className="font-serif text-[22px] sm:text-[26px] font-semibold text-ink-primary mt-1">
            Why answering “When will my order ship?” takes eight departments.
          </h3>
          <p className="font-sans text-[13px] sm:text-[14px] text-ink-secondary mt-1 max-w-2xl">
            Discovered by Founder Deb Friar across commercial manufacturing plants. Without a unified decision layer, one order triggers 40 manual handoffs across 8 siloed software databases.
          </p>
        </div>

        {/* 3-Way Mode Switcher */}
        <div className="inline-flex flex-wrap items-center p-1 rounded-lg bg-surface-recessed border border-border-rule text-[12px] font-mono shrink-0 gap-1 self-start lg:self-auto">
          <button
            onClick={() => setMode("status_quo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              mode === "status_quo"
                ? "bg-surface-sheet text-friction-crimson font-bold shadow-xs border border-border-rule"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <AlertTriangle size={13} className={mode === "status_quo" ? "text-friction-crimson" : "text-ink-muted"} />
            <span>40-Step Chaos (Manual)</span>
          </button>

          <button
            onClick={() => setMode("quant_fusion")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              mode === "quant_fusion"
                ? "bg-btn-cta text-white font-bold shadow-xs"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Zap size={13} className={mode === "quant_fusion" ? "text-white" : "text-btn-cta"} />
            <span>Quant Fusion (1-Click)</span>
          </button>

          <button
            onClick={() => setMode("original_artifact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              mode === "original_artifact"
                ? "bg-surface-sheet text-ink-primary font-bold shadow-xs border border-border-rule"
                : "text-ink-muted hover:text-ink-primary"
            }`}
            title="View original 2021 Visio whiteboard scan"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Original 2021 Artifact</span>
            <span className="sm:hidden">Original</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
          VIEW MODE A & B: VECTOR EDITORIAL BLUEPRINT CANVAS
      ======================================================================= */}
      {mode !== "original_artifact" ? (
        <div className="space-y-4">
          
          {/* Status Metric Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-surface-canvas border border-border-rule text-[12px] font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mode === "quant_fusion" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              <span className="font-bold text-ink-primary">
                {mode === "status_quo" ? "Current Enterprise Reality (8 Siloed Software Stacks):" : "Quant Fusion Non-Invasive Decision Layer Active:"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[11px]">
              <div>
                <span className="text-ink-muted">Fulfillment Latency: </span>
                <span className={`font-bold ${mode === "quant_fusion" ? "text-btn-cta font-mono" : "text-friction-crimson"}`}>
                  {mode === "status_quo" ? "5 to 8 Business Days" : "0.8 Seconds (Sub-Second)"}
                </span>
              </div>
              <div>
                <span className="text-ink-muted">Cross-Dept Handoffs: </span>
                <span className={`font-bold ${mode === "quant_fusion" ? "text-btn-cta" : "text-friction-crimson"}`}>
                  {mode === "status_quo" ? "40 Manual Ping-Pongs" : "1 Deterministic Stamped Click"}
                </span>
              </div>
              <div className="hidden md:block">
                <span className="text-ink-muted">Audit Defense: </span>
                <span className={`font-bold ${mode === "quant_fusion" ? "text-btn-cta" : "text-friction-crimson"}`}>
                  {mode === "status_quo" ? "0% (Unverified Email Notes)" : "100% SOX 404 Cryptographic Log"}
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              DESKTOP VIEW (hidden lg:block):
              Full 8-Swimlane Architectural Blueprint Canvas + Selector Chips
          =================================================================== */}
          <div className="hidden lg:block space-y-6">
            {/* Architectural SVG Canvas */}
            <div className="relative rounded-xl border border-border-rule bg-[#FAF8F5] overflow-x-auto shadow-inner select-none">
            
            {/* Ambient Decision Layer Overlay Banner for Mode B */}
            {mode === "quant_fusion" && (
              <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-btn-cta text-white text-[11px] font-mono shadow-md flex items-center gap-1.5 animate-fade-in">
                <ShieldCheck size={14} className="text-emerald-300" />
                <span>Deterministic In-Memory Layer Active • Zero ERP Writeback Risk</span>
              </div>
            )}

            <svg
              viewBox="0 0 1020 480"
              className="w-full min-w-[960px] h-auto block"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              <defs>
                {/* Friction Arrowhead */}
                <marker id="arrowRed" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="#8A1C14" />
                </marker>
                
                {/* Quant Fusion Instant Arrowhead */}
                <marker id="arrowGreen" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="#0F663E" />
                </marker>

                {/* Subtle Grid Dot Pattern */}
                <pattern id="flowGridDots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="0.75" fill="#D5D0C5" />
                </pattern>

                {/* Laser Beam Gradient for Quant Fusion Mode */}
                <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0F663E" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Blueprint Grid */}
              <rect width="1020" height="480" fill="#FBF9F4" />
              <rect width="1020" height="480" fill="url(#flowGridDots)" />

              {/* 8 Department Swimlane Columns */}
              {DEPARTMENT_SILOS.map((silo, idx) => {
                const colX = 20 + idx * 122;
                const isSelected = selectedSilo.id === silo.id;
                
                return (
                  <g key={silo.id} className="cursor-pointer group" onClick={() => setSelectedSilo(silo)}>
                    {/* Swimlane Column Background Tint */}
                    <rect
                      x={colX}
                      y="16"
                      width="116"
                      height="448"
                      rx="6"
                      fill={isSelected ? "rgba(15, 102, 62, 0.05)" : idx % 2 === 0 ? "rgba(236, 232, 223, 0.35)" : "rgba(255, 255, 255, 0.55)"}
                      stroke={isSelected ? "#0F663E" : "#E5E0D5"}
                      strokeWidth={isSelected ? "1.5" : "1"}
                      strokeDasharray={idx % 2 === 0 ? "none" : "4 3"}
                      className="transition-colors"
                    />

                    {/* Column Header Pill */}
                    <rect
                      x={colX + 4}
                      y="22"
                      width="108"
                      height="36"
                      rx="4"
                      fill={isSelected ? "#0F663E" : "#ECE8DF"}
                      stroke={isSelected ? "#0F663E" : "#D5D0C5"}
                      strokeWidth="1"
                    />
                    <text
                      x={colX + 58}
                      y="38"
                      textAnchor="middle"
                      fill={isSelected ? "#FFFFFF" : "#1A1714"}
                      fontSize="10.5"
                      fontWeight="bold"
                    >
                      {silo.siloNumber}. {silo.short.toUpperCase()}
                    </text>
                    <text
                      x={colX + 58}
                      y="51"
                      textAnchor="middle"
                      fill={isSelected ? "#D1FAE5" : "#6B665C"}
                      fontSize="7.5"
                    >
                      {silo.system.split("/")[0].trim()}
                    </text>

                    {/* Professional Enterprise Data Node Badge */}
                    <g transform={`translate(${colX + 8}, 66)`}>
                      {/* Node container card */}
                      <rect
                        x="0"
                        y="0"
                        width="100"
                        height="22"
                        rx="4"
                        fill={isSelected ? "#F0FDF4" : "#FFFFFF"}
                        stroke={isSelected ? "#0F663E" : "#D5D0C5"}
                        strokeWidth="1"
                      />
                      
                      {/* Precision Micro Database Stack SVG */}
                      <g transform="translate(6, 4)">
                        <ellipse cx="6" cy="2.5" rx="5" ry="1.6" fill={isSelected ? "#DCFCE7" : "#ECE8DF"} stroke={isSelected ? "#0F663E" : "#78716C"} strokeWidth="0.8" />
                        <path d="M1 2.5 v4.2 a5 1.6 0 0 0 10 0 v-4.2" fill="none" stroke={isSelected ? "#0F663E" : "#78716C"} strokeWidth="0.8" />
                        <path d="M1 5.6 v4.2 a5 1.6 0 0 0 10 0 v-4.2" fill="none" stroke={isSelected ? "#0F663E" : "#78716C"} strokeWidth="0.8" />
                        <ellipse cx="6" cy="9.8" rx="5" ry="1.6" fill="none" stroke={isSelected ? "#0F663E" : "#78716C"} strokeWidth="0.8" />
                      </g>

                      {/* Technical Architecture Metadata */}
                      <text
                        x="22"
                        y="10"
                        fill={isSelected ? "#0F663E" : "#57534E"}
                        fontSize="6.5"
                        fontWeight="600"
                        letterSpacing="0.04em"
                      >
                        LOCAL STORE
                      </text>
                      <text
                        x="22"
                        y="17.5"
                        fill={mode === "status_quo" ? "#991B1B" : "#0F663E"}
                        fontSize="5.5"
                        fontWeight="bold"
                        letterSpacing="0.03em"
                      >
                        {mode === "status_quo" ? "DISCONNECTED" : "IN-MEMORY SYNC"}
                      </text>

                      {/* Live Status LED */}
                      <circle
                        cx="91"
                        cy="11"
                        r="2"
                        fill={mode === "status_quo" ? "#EF4444" : "#10B981"}
                      />
                    </g>
                  </g>
                );
              })}

              {/* ===============================================================
                  FLOWCHART NODES & PATHS (MODE: STATUS QUO 40-STEP CHAOS)
              =============================================================== */}
              {mode === "status_quo" ? (
                <g>
                  {/* Convoluted Manual Workflow Connecting Lines (Red/Friction Trails) */}
                  
                  {/* Step 1: Sales Order -> Warehouse In-Stock? */}
                  <path d="M80 160 L142 160" fill="none" stroke="#8A1C14" strokeWidth="1.8" markerEnd="url(#arrowRed)" />

                  {/* Step 2: Warehouse Decision Diamond [Inventory?] */}
                  <polygon points="178 135, 218 160, 178 185, 138 160" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.5" />
                  <text x="178" y="163" textAnchor="middle" fill="#1A1714" fontSize="8" fontWeight="bold">In Stock?</text>
                  <text x="198" y="152" fill="#0F663E" fontSize="8" fontWeight="bold">YES</text>
                  <text x="186" y="200" fill="#8A1C14" fontSize="8" fontWeight="bold">NO</text>

                  {/* Yes Path: In-Stock -> Document Date */}
                  <path d="M218 160 L240 160 L240 220 L178 220" fill="none" stroke="#0F663E" strokeWidth="1.4" />
                  
                  {/* No Path: Inventory No -> Sourcing PO Check */}
                  <path d="M178 185 L178 230 L264 230" fill="none" stroke="#8A1C14" strokeWidth="1.8" strokeDasharray="4 2" markerEnd="url(#arrowRed)" />

                  {/* Step 3: Sourcing Decision Diamond [PO Issued?] */}
                  <polygon points="300 205, 340 230, 300 255, 260 230" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.5" />
                  <text x="300" y="233" textAnchor="middle" fill="#1A1714" fontSize="8" fontWeight="bold">Open PO?</text>
                  <text x="345" y="222" fill="#0F663E" fontSize="8" fontWeight="bold">YES</text>
                  <text x="308" y="270" fill="#8A1C14" fontSize="8" fontWeight="bold">NO</text>

                  {/* PO Yes -> Logistics Inbound BOL Check */}
                  <path d="M340 230 L386 230" fill="none" stroke="#8A1C14" strokeWidth="1.8" markerEnd="url(#arrowRed)" />

                  {/* Step 4: Logistics Decision Diamond [Inbound BOL?] */}
                  <polygon points="422 205, 462 230, 422 255, 382 230" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.5" />
                  <text x="422" y="233" textAnchor="middle" fill="#1A1714" fontSize="8" fontWeight="bold">Inbound BOL?</text>
                  <text x="468" y="222" fill="#0F663E" fontSize="8" fontWeight="bold">YES</text>
                  <text x="430" y="270" fill="#8A1C14" fontSize="8" fontWeight="bold">NO</text>

                  {/* BOL Yes -> Carrier EDI Freight Tracking */}
                  <path d="M462 230 L514 230" fill="none" stroke="#8A1C14" strokeWidth="1.8" strokeDasharray="3 3" markerEnd="url(#arrowRed)" />

                  {/* Carrier Node: EDI 214 Carrier Tracking Feed */}
                  <rect x="516" y="215" width="86" height="32" rx="4" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.5" />
                  <text x="559" y="229" textAnchor="middle" fill="#1A1714" fontSize="7.5" fontWeight="bold">EDI 214 Dwell</text>
                  <text x="559" y="240" textAnchor="middle" fill="#8A1C14" fontSize="7">+48h Port Delay</text>

                  {/* PO No -> Sourcing Decision (Factory vs Supplier) */}
                  <path d="M300 255 L300 310 L520 310" fill="none" stroke="#8A1C14" strokeWidth="1.8" strokeDasharray="4 2" />
                  
                  {/* Step 5: Sourcing Split Diamond [Source?] */}
                  <polygon points="544 285, 584 310, 544 335, 504 310" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.5" />
                  <text x="544" y="313" textAnchor="middle" fill="#1A1714" fontSize="8" fontWeight="bold">Source?</text>

                  {/* Source -> Factory MES Run */}
                  <path d="M584 310 L638 310" fill="none" stroke="#8A1C14" strokeWidth="1.6" markerEnd="url(#arrowRed)" />
                  <rect x="640" y="295" width="88" height="32" rx="4" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.4" />
                  <text x="684" y="309" textAnchor="middle" fill="#1A1714" fontSize="7.5" fontWeight="bold">Factory MES Plan</text>
                  <text x="684" y="320" textAnchor="middle" fill="#8A1C14" fontSize="7">Line Slotting Lag</text>

                  {/* Source -> Supplier PO Email Request */}
                  <path d="M544 335 L544 380 L760 380" fill="none" stroke="#8A1C14" strokeWidth="1.6" strokeDasharray="4 2" markerEnd="url(#arrowRed)" />
                  <rect x="762" y="365" width="92" height="32" rx="4" fill="#FFFFFF" stroke="#8A1C14" strokeWidth="1.4" />
                  <text x="808" y="379" textAnchor="middle" fill="#1A1714" fontSize="7.5" fontWeight="bold">Supplier Inquiries</text>
                  <text x="808" y="390" textAnchor="middle" fill="#8A1C14" fontSize="7">24-48h Email Lag</text>

                  {/* All paths converge back into Sales: Manual Date Review */}
                  <path d="M559 247 L559 270 L80 270 L80 340" fill="none" stroke="#8A1C14" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arrowRed)" />
                  <path d="M684 327 L684 350 L80 350 L80 355" fill="none" stroke="#8A1C14" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M808 397 L808 420 L80 420 L80 395" fill="none" stroke="#8A1C14" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* Professional Friction Callout Tags with Vector Warning Glyphs */}
                  <g transform="translate(208, 108)">
                    <rect x="0" y="0" width="98" height="18" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="0.9" />
                    <g transform="translate(6, 4)">
                      <path d="M 5 0.5 L 0.5 8.5 C 0.2 9 0.5 9.5 1.1 9.5 L 8.9 9.5 C 9.5 9.5 9.8 9 9.5 8.5 L 5 0.5 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="0.8" strokeLinejoin="round" />
                      <line x1="5" y1="3.2" x2="5" y2="5.8" stroke="#B91C1C" strokeWidth="0.9" strokeLinecap="round" />
                      <circle cx="5" cy="7.4" r="0.5" fill="#B91C1C" />
                    </g>
                    <text x="20" y="12" fill="#991B1B" fontSize="7.5" fontWeight="bold" letterSpacing="0.02em">
                      WMS Sync Lag
                    </text>
                  </g>

                  <g transform="translate(438, 172)">
                    <rect x="0" y="0" width="112" height="18" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="0.9" />
                    <g transform="translate(6, 4)">
                      <path d="M 5 0.5 L 0.5 8.5 C 0.2 9 0.5 9.5 1.1 9.5 L 8.9 9.5 C 9.5 9.5 9.8 9 9.5 8.5 L 5 0.5 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="0.8" strokeLinejoin="round" />
                      <line x1="5" y1="3.2" x2="5" y2="5.8" stroke="#B91C1C" strokeWidth="0.9" strokeLinecap="round" />
                      <circle cx="5" cy="7.4" r="0.5" fill="#B91C1C" />
                    </g>
                    <text x="20" y="12" fill="#991B1B" fontSize="7.5" fontWeight="bold" letterSpacing="0.02em">
                      Unlinked PDF BOLs
                    </text>
                  </g>

                  <g transform="translate(668, 258)">
                    <rect x="0" y="0" width="128" height="18" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="0.9" />
                    <g transform="translate(6, 4)">
                      <path d="M 5 0.5 L 0.5 8.5 C 0.2 9 0.5 9.5 1.1 9.5 L 8.9 9.5 C 9.5 9.5 9.8 9 9.5 8.5 L 5 0.5 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="0.8" strokeLinejoin="round" />
                      <line x1="5" y1="3.2" x2="5" y2="5.8" stroke="#B91C1C" strokeWidth="0.9" strokeLinecap="round" />
                      <circle cx="5" cy="7.4" r="0.5" fill="#B91C1C" />
                    </g>
                    <text x="20" y="12" fill="#991B1B" fontSize="7.5" fontWeight="bold" letterSpacing="0.02em">
                      Blind Assembly Queue
                    </text>
                  </g>

                  <g transform="translate(848, 332)">
                    <rect x="0" y="0" width="110" height="18" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="0.9" />
                    <g transform="translate(6, 4)">
                      <path d="M 5 0.5 L 0.5 8.5 C 0.2 9 0.5 9.5 1.1 9.5 L 8.9 9.5 C 9.5 9.5 9.8 9 9.5 8.5 L 5 0.5 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="0.8" strokeLinejoin="round" />
                      <line x1="5" y1="3.2" x2="5" y2="5.8" stroke="#B91C1C" strokeWidth="0.9" strokeLinecap="round" />
                      <circle cx="5" cy="7.4" r="0.5" fill="#B91C1C" />
                    </g>
                    <text x="20" y="12" fill="#991B1B" fontSize="7.5" fontWeight="bold" letterSpacing="0.02em">
                      Vendor Phone Tag
                    </text>
                  </g>

                  {/* Start Node: Customer Sales Order */}
                  <g transform="translate(30, 135)">
                    <rect x="0" y="0" width="96" height="50" rx="6" fill="#FFFFFF" stroke="#1A1714" strokeWidth="1.5" />
                    <text x="48" y="18" textAnchor="middle" fill="#1A1714" fontSize="8.5" fontWeight="bold">Sales Order Ingest</text>
                    <text x="48" y="30" textAnchor="middle" fill="#6B665C" fontSize="7.5">PO #34018 Line Item</text>
                    <text x="48" y="42" textAnchor="middle" fill="#8A1C14" fontSize="7" fontWeight="bold">When will it ship?</text>
                  </g>

                  {/* Final Resolution Node: Sales Order Commit Stamped */}
                  <g transform="translate(30, 340)">
                    <rect x="0" y="0" width="96" height="54" rx="6" fill="#FFFFFF" stroke="#0F663E" strokeWidth="1.8" />
                    <text x="48" y="16" textAnchor="middle" fill="#0F663E" fontSize="8" fontWeight="bold">MANUAL COMMIT</text>
                    <text x="48" y="28" textAnchor="middle" fill="#1A1714" fontSize="7.5">Unverified Date</text>
                    <text x="48" y="44" textAnchor="middle" fill="#8A1C14" fontSize="8" fontWeight="bold">5–8 Days Elapsed</text>
                  </g>

                  {/* Final Finance Node: Revenue Posting & Potential Chargeback */}
                  <path d="M126 367 L880 367 L880 380" fill="none" stroke="#8A1C14" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrowRed)" />
                  <g transform="translate(884, 380)">
                    <rect x="0" y="0" width="102" height="44" rx="4" fill="#F7DFDE" stroke="#8A1C14" strokeWidth="1.2" />
                    <text x="51" y="16" textAnchor="middle" fill="#8A1C14" fontSize="8" fontWeight="bold">Revenue At Risk</text>
                    <text x="51" y="28" textAnchor="middle" fill="#4A463F" fontSize="7">OTIF Fine Risk: 3%</text>
                    <text x="51" y="38" textAnchor="middle" fill="#8A1C14" fontSize="6.5" fontWeight="bold">Expedite Air-Freight</text>
                  </g>
                </g>
              ) : (
                /* ===============================================================
                   FLOWCHART NODES & PATHS (MODE: QUANT FUSION 1-CLICK RESOLUTION)
                =============================================================== */
                <g>
                  {/* Glowing In-Memory Decision Layer Bridge */}
                  <rect
                    x="18"
                    y="155"
                    width="984"
                    height="95"
                    rx="8"
                    fill="rgba(15, 102, 62, 0.08)"
                    stroke="#0F663E"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  
                  {/* Decision Layer Header Label */}
                  <text x="510" y="178" textAnchor="middle" fill="#0F663E" fontSize="11" fontWeight="bold" letterSpacing="0.08em">
                    QUANT FUSION IN-MEMORY OPERATIONS DECISION LAYER
                  </text>
                  <text x="510" y="194" textAnchor="middle" fill="#4A463F" fontSize="8.5">
                    Deterministic Parallel Multi-Tier Reconciliation Across All 8 Siloed Data Streams (Sub-Second)
                  </text>

                  {/* Simultaneous Feeds Entering From All 8 Silos */}
                  {DEPARTMENT_SILOS.map((silo, idx) => {
                    const colX = 20 + idx * 122 + 58;
                    return (
                      <g key={silo.id}>
                        {/* Vertical Green Ingestion Pulse */}
                        <line
                          x1={colX}
                          y1="92"
                          x2={colX}
                          y2="155"
                          stroke="#0F663E"
                          strokeWidth="2.2"
                          strokeDasharray="4 2"
                          markerEnd="url(#arrowGreen)"
                        />
                        <circle cx={colX} cy="124" r="3.5" fill="#10B981" className="animate-ping" />
                        <text x={colX} y="145" textAnchor="middle" fill="#0F663E" fontSize="7" fontWeight="bold">
                          FEED OK
                        </text>
                      </g>
                    );
                  })}

                  {/* Direct Single Laser Beam Flow */}
                  <path
                    d="M126 215 L880 215"
                    fill="none"
                    stroke="url(#laserBeam)"
                    strokeWidth="5"
                    filter="url(#glow)"
                  />

                  {/* Start Node: Customer Sales Order */}
                  <g transform="translate(30, 190)">
                    <rect x="0" y="0" width="96" height="52" rx="6" fill="#FFFFFF" stroke="#0F663E" strokeWidth="2" />
                    <text x="48" y="18" textAnchor="middle" fill="#1A1714" fontSize="8.5" fontWeight="bold">Sales Order Ingest</text>
                    <text x="48" y="31" textAnchor="middle" fill="#6B665C" fontSize="7.5">PO #34018 Line Item</text>
                    <text x="48" y="44" textAnchor="middle" fill="#0F663E" fontSize="8" fontWeight="bold">1 Click Trigger</text>
                  </g>

                  {/* Central In-Memory Reconciliation Engine Core */}
                  <g transform="translate(440, 202)">
                    <circle r="24" fill="#0F663E" stroke="#FFFFFF" strokeWidth="2.5" />
                    <text x="0" y="-4" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">Q(F)</text>
                    <text x="0" y="8" textAnchor="middle" fill="#D1FAE5" fontSize="7" fontWeight="bold">SOLVER</text>
                    <circle r="32" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" className="animate-spin-slow" />
                  </g>

                  {/* Output Node: Verified Ship Date Determination */}
                  <g transform="translate(884, 190)">
                    <rect x="0" y="0" width="104" height="52" rx="6" fill="#E6F3EC" stroke="#0D4E30" strokeWidth="2" />
                    <text x="52" y="17" textAnchor="middle" fill="#0D4E30" fontSize="8.5" fontWeight="bold">VERIFIED SHIP DATE</text>
                    <text x="52" y="30" textAnchor="middle" fill="#1A1714" fontSize="9" fontWeight="bold">Nov 24, 2026</text>
                    <text x="52" y="43" textAnchor="middle" fill="#0D4E30" fontSize="7.5" fontWeight="bold">0.8s • SOX Stamped</text>
                  </g>

                  {/* Benefits Callout Badges */}
                  <g transform="translate(150, 275)">
                    <rect x="0" y="0" width="190" height="44" rx="5" fill="#FFFFFF" stroke="#0F663E" strokeWidth="1" />
                    <g transform="translate(12, 10)">
                      <circle cx="5" cy="5" r="5" fill="rgba(15, 102, 62, 0.12)" />
                      <polyline points="2.5 5, 4.5 7, 7.5 3" fill="none" stroke="#0F663E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <text x="26" y="18" fill="#0F663E" fontSize="8.5" fontWeight="bold">Zero Manual Phone Tag</text>
                    <text x="14" y="32" fill="#6B665C" fontSize="7.5">Replaces 40 handoffs with instant ATP solver</text>
                  </g>

                  <g transform="translate(410, 275)">
                    <rect x="0" y="0" width="200" height="44" rx="5" fill="#FFFFFF" stroke="#0F663E" strokeWidth="1" />
                    <g transform="translate(12, 10)">
                      <circle cx="5" cy="5" r="5" fill="rgba(15, 102, 62, 0.12)" />
                      <polyline points="2.5 5, 4.5 7, 7.5 3" fill="none" stroke="#0F663E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <text x="26" y="18" fill="#0F663E" fontSize="8.5" fontWeight="bold">Zero ERP Writeback Risk</text>
                    <text x="14" y="32" fill="#6B665C" fontSize="7.5">Read-only TLS 1.3 in-memory pipeline</text>
                  </g>

                  <g transform="translate(670, 275)">
                    <rect x="0" y="0" width="190" height="44" rx="5" fill="#FFFFFF" stroke="#0F663E" strokeWidth="1" />
                    <g transform="translate(12, 10)">
                      <circle cx="5" cy="5" r="5" fill="rgba(15, 102, 62, 0.12)" />
                      <polyline points="2.5 5, 4.5 7, 7.5 3" fill="none" stroke="#0F663E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <text x="26" y="18" fill="#0F663E" fontSize="8.5" fontWeight="bold">100% Audit Defensibility</text>
                    <text x="14" y="32" fill="#6B665C" fontSize="7.5">Tamper-evident timestamp defends OTIF claims</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Department Silo Selector Chips */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
              <span className="uppercase tracking-wider">Click Any Department Silo Below to Inspect Operational Bottlenecks:</span>
              <span className="text-btn-cta font-medium">Selected: {selectedSilo.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-[11px]">
              {DEPARTMENT_SILOS.map((silo) => {
                const isSelected = selectedSilo.id === silo.id;
                const IconComponent = silo.icon;

                return (
                  <button
                    key={silo.id}
                    onClick={() => setSelectedSilo(silo)}
                    className={`p-2.5 rounded text-left transition-all border ${
                      isSelected
                        ? "bg-surface-sheet border-btn-cta shadow-xs ring-1 ring-btn-cta/30"
                        : "bg-surface-recessed/60 border-border-rule/80 hover:bg-surface-sheet hover:border-border-rule"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-ink-muted font-bold">{silo.siloNumber}</span>
                      <IconComponent size={13} className={isSelected ? "text-btn-cta" : "text-ink-secondary"} />
                    </div>
                    <span className={`block font-bold mt-1 text-[11px] truncate ${isSelected ? "text-btn-cta" : "text-ink-primary"}`}>
                      {silo.short}
                    </span>
                    <span className="text-[9px] text-ink-muted block truncate mt-0.5">
                      {silo.system.split("/")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deep-Dive Inspection Card for Selected Silo */}
            <div className="p-4 sm:p-5 rounded bg-surface-canvas border border-border-rule space-y-3 mt-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-rule">
                <div className="flex items-center gap-2">
                  <selectedSilo.icon size={16} className="text-btn-cta" />
                  <span className="font-serif font-bold text-[16px] text-ink-primary">
                    Department {selectedSilo.siloNumber}: {selectedSilo.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-ink-secondary border border-border-rule">
                    System: {selectedSilo.system}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-friction-crimson font-bold shrink-0 flex items-center gap-1.5">
                  <Zap size={13} className="text-friction-crimson fill-friction-crimson/20" />
                  <span>Eliminates ~{selectedSilo.hoursWastedPerMonth} Hours / Month of Status Chasing</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] font-sans">
                <div className="p-3 rounded bg-friction-wash/50 border border-friction-crimson/20 space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-friction-crimson font-bold block">
                    The Manual Status Quo Pain:
                  </span>
                  <p className="text-ink-primary leading-snug">
                    {selectedSilo.manualPain}
                  </p>
                </div>

                <div className="p-3 rounded bg-stamp-wash/60 border border-stamp-ink/20 space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stamp-ink font-bold block">
                    Quant Fusion Deterministic Resolution:
                  </span>
                  <p className="text-ink-primary leading-snug">
                    {selectedSilo.quantFusionFix}
                  </p>
                </div>
              </div>
            </div>

          </div>
          </div>

          {/* ===================================================================
              MOBILE & TABLET VIEW (block lg:hidden):
              RESPONSIVE VERTICAL INTERACTIVE PIPELINE
              Eliminates horizontal scrolling; presents an effortless vertical scan.
          =================================================================== */}
          <div className="block lg:hidden space-y-6">
            {mode === "status_quo" ? (
              /* --- STATUS QUO: VERTICAL 8-STAGE FRICTION PIPELINE --- */
              <div className="space-y-4">
                {/* Mobile Stage 0: Customer Ingest */}
                <div className="p-4 rounded-xl bg-surface-canvas border border-ink-primary/20 shadow-xs space-y-1 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-friction-crimson font-bold block">
                    Trigger Event
                  </span>
                  <div className="font-serif text-[17px] font-bold text-ink-primary">
                    Customer Sales Order Ingest
                  </div>
                  <div className="font-mono text-[11px] text-ink-secondary">
                    PO #34018 Line Item • “When will my order ship?”
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center items-center py-1 text-friction-crimson">
                  <ArrowDown size={18} className="animate-bounce" />
                </div>

                {/* 8 Vertical Stage Cards */}
                <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-[2px] before:bg-friction-crimson/30 before:border-l before:border-dashed before:border-friction-crimson">
                  {DEPARTMENT_SILOS.map((silo) => {
                    const isExpanded = mobileExpandedSiloId === silo.id;
                    const details = SILO_MOBILE_DETAILS[silo.id];
                    const IconComp = silo.icon;

                    return (
                      <div key={silo.id} className="relative pl-10 space-y-2">
                        {/* Milestone Indicator Node */}
                        <div
                          className={`absolute left-0 top-3.5 w-10 h-10 -ml-0.5 rounded-full border-2 flex items-center justify-center bg-surface-canvas transition-colors ${
                            isExpanded ? "border-friction-crimson text-friction-crimson shadow-xs" : "border-border-rule text-ink-secondary"
                          }`}
                        >
                          <IconComp size={16} />
                        </div>

                        {/* Interactive Step Card */}
                        <div
                          onClick={() => {
                            setSelectedSilo(silo);
                            setMobileExpandedSiloId(isExpanded ? null : silo.id);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isExpanded
                              ? "bg-surface-canvas border-friction-crimson shadow-sm ring-1 ring-friction-crimson/20"
                              : "bg-surface-canvas border-border-rule hover:border-ink-muted/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-ink-muted font-bold">
                                  {silo.siloNumber}
                                </span>
                                <span className="font-serif font-bold text-[15px] text-ink-primary">
                                  {silo.name}
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-ink-secondary mt-0.5">
                                {silo.system}
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-friction-crimson font-bold shrink-0 px-2 py-0.5 rounded bg-friction-wash/60 border border-friction-crimson/20">
                              -{silo.hoursWastedPerMonth}h/mo
                            </span>
                          </div>

                          {/* Friction Callout Tag with Vector Alert Triangle */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF2F2] border border-[#DC2626]/80 text-[#991B1B] font-mono text-[10.5px] font-bold shadow-2xs">
                              <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
                                <path d="M 5 0.5 L 0.5 8.5 C 0.2 9 0.5 9.5 1.1 9.5 L 8.9 9.5 C 9.5 9.5 9.8 9 9.5 8.5 L 5 0.5 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="0.8" strokeLinejoin="round" />
                                <line x1="5" y1="3.2" x2="5" y2="5.8" stroke="#B91C1C" strokeWidth="0.9" strokeLinecap="round" />
                                <circle cx="5" cy="7.4" r="0.5" fill="#B91C1C" />
                              </svg>
                              <span>{details?.frictionTag || "Disconnected Hand-off"}</span>
                            </div>

                            <span className="text-[10px] font-mono text-ink-muted flex items-center gap-1 ml-auto">
                              <span>{isExpanded ? "Hide" : "Details"}</span>
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </span>
                          </div>

                          {/* Collapsible Deep-Dive Inspection Content */}
                          {isExpanded && (
                            <div className="mt-4 pt-3 border-t border-border-rule/80 space-y-3 text-[12px] font-sans animate-in fade-in duration-200">
                              <div className="p-3 rounded-lg bg-friction-wash/60 border border-friction-crimson/20 space-y-1">
                                <span className="font-mono text-[9.5px] uppercase tracking-wider text-friction-crimson font-bold block">
                                  Manual Bottleneck:
                                </span>
                                <p className="text-ink-primary leading-snug">
                                  {silo.manualPain}
                                </p>
                              </div>

                              <div className="p-3 rounded-lg bg-stamp-wash/60 border border-stamp-ink/20 space-y-1">
                                <span className="font-mono text-[9.5px] uppercase tracking-wider text-stamp-ink font-bold block">
                                  Quant Fusion Resolution:
                                </span>
                                <p className="text-ink-primary leading-snug">
                                  {silo.quantFusionFix}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Transition Step Indicator */}
                        {details?.transitionText && (
                          <div className="text-[10px] font-mono text-friction-crimson/90 pl-3 flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-friction-crimson shrink-0" />
                            <span>{details.transitionText}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Final Outcome Card: Manual Commit */}
                <div className="p-5 rounded-xl bg-friction-wash/50 border-2 border-friction-crimson space-y-2 text-center shadow-xs">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-friction-crimson font-bold">
                    UNVERIFIED STATUS QUO OUTCOME
                  </div>
                  <div className="font-serif text-[20px] font-bold text-friction-crimson">
                    MANUAL PROMISE DATE
                  </div>
                  <div className="font-mono text-[12px] font-semibold text-ink-primary">
                    5–8 Business Days Elapsed
                  </div>
                  <p className="font-sans text-[12px] text-ink-secondary leading-relaxed pt-1">
                    Date calculated by manual email guesswork. 3% retailer OTIF fine risk active + expedited air-freight penalties.
                  </p>
                </div>
              </div>
            ) : (
              /* --- QUANT FUSION: VERTICAL 1-CLICK RESOLUTION PIPELINE --- */
              <div className="space-y-4">
                {/* Mobile Stage 0: 1-Click Trigger */}
                <div className="p-4 rounded-xl bg-surface-canvas border border-btn-cta/40 shadow-xs space-y-1 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-btn-cta font-bold block">
                    1-Click Operational Trigger
                  </span>
                  <div className="font-serif text-[17px] font-bold text-ink-primary">
                    Sales Order Ingest
                  </div>
                  <div className="font-mono text-[11px] text-btn-cta font-medium">
                    PO #34018 Line Item • Sub-second solver engaged
                  </div>
                </div>

                {/* Connector Laser Beam */}
                <div className="flex justify-center items-center py-1 text-btn-cta">
                  <ArrowDown size={20} className="animate-pulse" />
                </div>

                {/* Central In-Memory Decision Layer Card */}
                <div className="p-5 rounded-xl bg-emerald-500/10 border-2 border-btn-cta shadow-sm space-y-4">
                  <div className="text-center space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-btn-cta font-bold block">
                      Deterministic In-Memory Engine
                    </span>
                    <div className="font-serif text-[19px] font-bold text-ink-primary">
                      Quant Fusion Decision Layer
                    </div>
                    <p className="font-sans text-[12px] text-ink-secondary">
                      Simultaneous parallel ingestion across all 8 isolated stacks in &lt; 250ms.
                    </p>
                  </div>

                  {/* 8 Active Telemetry Feeds Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10.5px]">
                    {DEPARTMENT_SILOS.map((silo) => (
                      <div
                        key={silo.id}
                        className="p-2 rounded-lg bg-surface-canvas border border-btn-cta/30 flex items-center justify-between"
                      >
                        <div className="truncate pr-1">
                          <span className="font-bold text-ink-primary">{silo.short}</span>
                          <span className="text-[9px] text-ink-muted block truncate">{silo.system.split("/")[0]}</span>
                        </div>
                        <span className="flex items-center gap-1 shrink-0 text-btn-cta font-bold text-[9.5px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>OK</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-1 font-mono text-[10.5px] text-btn-cta font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Zero ERP Writeback Risk • Read-Only TLS 1.3 Pipeline</span>
                  </div>
                </div>

                {/* Connector Laser Beam */}
                <div className="flex justify-center items-center py-1 text-btn-cta">
                  <ArrowDown size={20} className="animate-pulse" />
                </div>

                {/* Final Stamped Outcome Card */}
                <div className="p-5 rounded-xl bg-[#E6F3EC] border-2 border-[#0D4E30] text-center space-y-2 shadow-sm">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#0D4E30] font-bold block">
                    DETERMINISTIC VERIFIED SHIP DATE
                  </span>
                  <div className="font-serif text-[24px] font-bold text-ink-primary">
                    Nov 24, 2026
                  </div>
                  <div className="font-mono text-[12px] font-bold text-[#0D4E30]">
                    0.8s Determination • Cryptographic SOX 404 Audit Stamp
                  </div>
                </div>

                {/* 3 Executive Benefits Vertical Cards */}
                <div className="space-y-2.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-surface-canvas border border-btn-cta/40 flex items-start gap-3 shadow-2xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-btn-cta shrink-0 mt-0.5">
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[13px] text-ink-primary">
                        Zero Manual Phone Tag
                      </div>
                      <div className="font-sans text-[11.5px] text-ink-secondary mt-0.5">
                        Replaces 40 handoffs with instant deterministic ATP solver.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-canvas border border-btn-cta/40 flex items-start gap-3 shadow-2xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-btn-cta shrink-0 mt-0.5">
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[13px] text-ink-primary">
                        Zero ERP Writeback Risk
                      </div>
                      <div className="font-sans text-[11.5px] text-ink-secondary mt-0.5">
                        Read-only TLS 1.3 in-memory pipeline with zero database mutation.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-canvas border border-btn-cta/40 flex items-start gap-3 shadow-2xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-btn-cta shrink-0 mt-0.5">
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[13px] text-ink-primary">
                        100% Audit Defensibility
                      </div>
                      <div className="font-sans text-[11.5px] text-ink-secondary mt-0.5">
                        Tamper-evident timestamp log eliminates customer & retailer OTIF chargebacks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* =======================================================================
            VIEW MODE C: ORIGINAL 2021 HISTORICAL WHITEBOARD ARTIFACT
        ======================================================================= */
        <div className="space-y-4">
          <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-[12px] font-mono text-ink-primary">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Historical Field Document Archive (2021): </span>
              This is the original operational map drafted by Founder Deb Friar during active plant leadership at Welbilt. It reflects the raw, unvarnished complexity of commercial manufacturing fulfillment that Quant Fusion was engineered to automate.
            </div>
          </div>

          <div className="relative rounded overflow-hidden border border-border-rule bg-surface-canvas">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
              <Image
                src="/assets/flowchart_40_steps.jpg"
                alt="Original 40-Step Multi-Department Cross-Silo Order Fulfillment Flowchart"
                fill
                unoptimized
                className="object-contain p-2 parchment-photo"
              />
            </div>
            
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded bg-ink-primary/90 text-white text-[11px] font-mono backdrop-blur-xs flex items-center gap-1.5 shadow-md">
              <Layers size={13} className="text-emerald-400" />
              <span>Welbilt Operational Plant Artifact • Archived 2021</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setMode("status_quo")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-btn-cta text-white text-[12px] font-mono font-bold hover:bg-btn-ctaHover transition-colors"
            >
              <RefreshCw size={13} />
              <span>Return to Interactive Vector Flowchart</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
