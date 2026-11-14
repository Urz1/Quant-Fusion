"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Check, AlertTriangle, Clock, RefreshCw, FileText, ArrowRight, Printer, X, Download, Eye, Sparkles, Zap } from "lucide-react";
import { ExplodedOrderViewer } from "./ExplodedOrderViewer";

interface OrderScenario {
  id: string;
  name: string;
  customer: string;
  origin: string;
  manualEstimate: string;
  roleMetrics: {
    operations: string;
    cfo: string;
    supplyChain: string;
  };
  scenarios: {
    baseline: {
      date: string;
      status: "reconciled" | "exception";
      statusLabel: string;
      daysSaved: string;
      lines: { name: string; source: string; status: string; statusType: "ok" | "warn" | "danger" }[];
      notes: string;
    };
    portDelay: {
      date: string;
      status: "reconciled" | "exception";
      statusLabel: string;
      daysSaved: string;
      lines: { name: string; source: string; status: string; statusType: "ok" | "warn" | "danger" }[];
      notes: string;
    };
    airFreight: {
      date: string;
      status: "reconciled" | "exception";
      statusLabel: string;
      daysSaved: string;
      lines: { name: string; source: string; status: string; statusType: "ok" | "warn" | "danger" }[];
      notes: string;
    };
  };
}

export const SAMPLE_ORDERS: OrderScenario[] = [
  {
    id: "ORD-78192",
    name: "Commercial Convection Unit #CX-900",
    customer: "Apex Thermal Dynamics",
    origin: "Tampa Facility #4",
    manualEstimate: "Nov 14, 2026",
    roleMetrics: {
      operations: "7 Disconnected Screens Eliminated • Sub-second CSR Response",
      cfo: "$14,200 Late Delivery Chargeback Avoided • 150 BPS EBITDA Protected",
      supplyChain: "Critical Path Part: Control Module • Buffer Absorbed 3-Day Dwell",
    },
    scenarios: {
      baseline: {
        date: "Nov 06, 2026",
        status: "reconciled",
        statusLabel: "Reconciled Delivery Date",
        daysSaved: "8 Days Firefighting Saved",
        lines: [
          { name: "Oracle WMS: 304 Stainless Frame & Chassis", source: "WMS REST", status: "Staged in Bay 2", statusType: "ok" },
          { name: "SAP ECC Line 3: 200HP Inverter Drive Motor", source: "SAP RFC", status: "Allocated (Tampa)", statusType: "ok" },
          { name: "Carrier EDI 214: Microprocessor Control Board", source: "Ocean EDI", status: "Maersk #441 (On Schedule)", statusType: "ok" },
          { name: "Fastenal Tool Crib: Thermal Seal & Fastener Kit", source: "Vendor Feed", status: "Available", statusType: "ok" },
        ],
        notes: "All components synchronized. Assembly window confirmed without expediting.",
      },
      portDelay: {
        date: "Nov 09, 2026",
        status: "reconciled",
        statusLabel: "Re-Routed Promise Date",
        daysSaved: "5 Days Firefighting Saved",
        lines: [
          { name: "Oracle WMS: 304 Stainless Frame & Chassis", source: "WMS REST", status: "Held in Bay 2", statusType: "ok" },
          { name: "SAP ECC Line 3: 200HP Inverter Drive Motor", source: "SAP RFC", status: "Allocated (Tampa)", statusType: "ok" },
          { name: "Carrier EDI 214: Microprocessor Control Board", source: "Ocean EDI", status: "CRITICAL PATH DELAY (+3d)", statusType: "danger" },
          { name: "Fastenal Tool Crib: Thermal Seal & Fastener Kit", source: "Vendor Feed", status: "Available", statusType: "ok" },
        ],
        notes: "Control board delayed at Port LA. Algorithmic buffer shifted assembly window +3 days; dealer auto-notified.",
      },
      airFreight: {
        date: "Nov 03, 2026",
        status: "reconciled",
        statusLabel: "Expedited Air Commitment",
        daysSaved: "11 Days Firefighting Saved",
        lines: [
          { name: "Oracle WMS: 304 Stainless Frame & Chassis", source: "WMS REST", status: "Priority Staging", statusType: "ok" },
          { name: "SAP ECC Line 3: 200HP Inverter Drive Motor", source: "SAP RFC", status: "Allocated (Tampa)", statusType: "ok" },
          { name: "Atlas Air AWB #902-88: Control Board", source: "Air EDI", status: "Customs Cleared ORD", statusType: "ok" },
          { name: "Fastenal Tool Crib: Thermal Seal & Fastener Kit", source: "Vendor Feed", status: "Available", statusType: "ok" },
        ],
        notes: "Air freight expedite simulation confirmed. Premium transit offsets ocean congestion completely.",
      },
    },
  },
  {
    id: "PO-34018",
    name: "Continuous Conveyor Motor Assembly",
    customer: "Vanguard Logistics Group",
    origin: "Chicago Plant #2",
    manualEstimate: "Nov 18, 2026",
    roleMetrics: {
      operations: "5 Warehouse Calls Eliminated • Direct Telematics Visibility",
      cfo: "$9,800 Demurrage Fee Prevented by Truck Reschedule",
      supplyChain: "QA Hold Detected 48h Prior to Scheduled Truck Arrival",
    },
    scenarios: {
      baseline: {
        date: "Nov 10, 2026",
        status: "reconciled",
        statusLabel: "Reconciled Delivery Date",
        daysSaved: "8 Days Firefighting Saved",
        lines: [
          { name: "Inverter Duty 50HP Drive", source: "NetSuite ERP", status: "Stock Level OK (Chicago)", statusType: "ok" },
          { name: "VFD Control Cabinet #CC-12", source: "Rockwell CSV", status: "Staged at Dock 4", statusType: "ok" },
          { name: "Heavy Haul Flatbed Transit", source: "Freightquote API", status: "Dispatched", statusType: "ok" },
        ],
        notes: "All components staged. Driver check-in verified via carrier telematics feed.",
      },
      portDelay: {
        date: "Nov 13, 2026",
        status: "reconciled",
        statusLabel: "Adjusted Dock Delivery",
        daysSaved: "5 Days Firefighting Saved",
        lines: [
          { name: "Inverter Duty 50HP Drive", source: "NetSuite ERP", status: "Stock Level OK", statusType: "ok" },
          { name: "VFD Control Cabinet #CC-12", source: "Rockwell CSV", status: "Wiring QA Hold (+48h)", statusType: "warn" },
          { name: "Heavy Haul Flatbed Transit", source: "Freightquote API", status: "Truck Rescheduled", statusType: "ok" },
        ],
        notes: "Plant QA hold detected before truck arrival. Truck appointment pushed 48 hours to avoid demurrage fee.",
      },
      airFreight: {
        date: "Nov 08, 2026",
        status: "reconciled",
        statusLabel: "Same-Week Direct Courier",
        daysSaved: "10 Days Firefighting Saved",
        lines: [
          { name: "Inverter Duty 50HP Drive", source: "NetSuite ERP", status: "Hot-Shot Courier Dispatched", statusType: "ok" },
          { name: "VFD Control Cabinet #CC-12", source: "Rockwell CSV", status: "Direct Van Transfer", statusType: "ok" },
          { name: "Direct Facility Delivery", source: "FedEx Custom Critical", status: "En Route I-80", statusType: "ok" },
        ],
        notes: "Emergency direct hot-shot bypasses consolidation hub. Reached recipient dock 2 days early.",
      },
    },
  },
  {
    id: "ORD-91204",
    name: "Hydraulic Pump Assembly #HP-20",
    customer: "Titan Industrial Machinery",
    origin: "Cleveland Plant",
    manualEstimate: "Nov 20, 2026",
    roleMetrics: {
      operations: "Automated Early Warning Generated • Customer Escalation Paused",
      cfo: "Uncalibrated Delivery Promise Prevented • SOX Audit Trace Maintained",
      supplyChain: "Backorder Flag Triggered Secondary Approved Vendor Sourcing",
    },
    scenarios: {
      baseline: {
        date: "PENDING SUPPLIER RE-COMMIT",
        status: "exception",
        statusLabel: "Unresolved Exception (CSR Action)",
        daysSaved: "Early Warning Generated",
        lines: [
          { name: "Pump Housing Casting", source: "Oracle ERP", status: "In Stock (Cleveland)", statusType: "ok" },
          { name: "Drive Motor #DM-88", source: "Supplier CSV Feed", status: "BACKORDERED (Monterrey)", statusType: "danger" },
          { name: "Seal Kit #SK-40", source: "Fastenal Vending Feed", status: "Available", statusType: "ok" },
        ],
        notes: "Exception Detected: Supplier component missing. Automated determination paused for CSR decision.",
      },
      portDelay: {
        date: "SUPPLIER ESCALATION REQUIRED",
        status: "exception",
        statusLabel: "Exception Compounded",
        daysSaved: "Expedite Flag Raised",
        lines: [
          { name: "Pump Housing Casting", source: "Oracle ERP", status: "In Stock (Cleveland)", statusType: "ok" },
          { name: "Drive Motor #DM-88", source: "Supplier CSV Feed", status: "BACKORDERED (+10d)", statusType: "danger" },
          { name: "Laredo Border Crossing", source: "Customs EDI", status: "Documentation Hold", statusType: "warn" },
        ],
        notes: "Supplier component compounding border hold. CSR escalation notification dispatched.",
      },
      airFreight: {
        date: "Nov 12, 2026 (Alt Sourcing)",
        status: "reconciled",
        statusLabel: "Alternative Supplier Sourced",
        daysSaved: "8 Days Firefighting Saved",
        lines: [
          { name: "Pump Housing Casting", source: "Oracle ERP", status: "In Stock (Cleveland)", statusType: "ok" },
          { name: "Drive Motor #DM-88 (Alt Vendor)", source: "Secondary Vendor API", status: "Emergency Stock Sourced (Akron)", statusType: "ok" },
          { name: "Seal Kit #SK-40", source: "Fastenal Vending Feed", status: "Available", statusType: "ok" },
        ],
        notes: "Algorithmic rule exercised secondary approved supplier clause. Order cleared for final assembly.",
      },
    },
  },
];

export function HeroConsole() {
  const [selectedOrderIdx, setSelectedOrderIdx] = useState<number>(0);
  const [selectedScenario, setSelectedScenario] = useState<"baseline" | "portDelay" | "airFreight">("baseline");
  const [isAssembled, setIsAssembled] = useState<boolean>(false);
  const [stampActive, setStampActive] = useState<boolean>(false);
  const [stampKey, setStampKey] = useState<number>(0);
  const [briefOpen, setBriefOpen] = useState<boolean>(false);
  const [activeRolePerspective, setActiveRolePerspective] = useState<"operations" | "cfo" | "supplyChain">("operations");
  const [autoPlayInterrupted, setAutoPlayInterrupted] = useState<boolean>(false);

  const order = SAMPLE_ORDERS[selectedOrderIdx];
  const scenarioData = order.scenarios[selectedScenario];

  // Auto-play the core scenario after 4s so visitor understands in 10s without clicking
  useEffect(() => {
    if (autoPlayInterrupted) return;
    const timer = setTimeout(() => {
      setSelectedScenario("portDelay");
    }, 4500);
    return () => clearTimeout(timer);
  }, [autoPlayInterrupted]);

  // Cross-page Replay listener (?order=ORD-91204 or window 'replay-fire-drill' event)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOrderParam = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderParam = params.get("order");
        if (orderParam) {
          const matchIdx = SAMPLE_ORDERS.findIndex(
            (o) => o.id.toLowerCase() === orderParam.toLowerCase()
          );
          if (matchIdx !== -1) {
            setSelectedOrderIdx(matchIdx);
            setSelectedScenario("portDelay");
            setAutoPlayInterrupted(true);
            setIsAssembled(false);
            setStampActive(false);
            setBriefOpen(false);
            const el = document.getElementById("order-console");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }
      } catch (err) {
        console.warn("Unable to parse order query param", err);
      }
    };

    checkOrderParam();

    const handleReplayFireDrill = (e: Event) => {
      const customEvent = e as CustomEvent<{ orderId?: string; scenario?: "baseline" | "portDelay" | "airFreight" }>;
      const orderId = customEvent.detail?.orderId;
      if (orderId) {
        const matchIdx = SAMPLE_ORDERS.findIndex(
          (o) => o.id.toLowerCase() === orderId.toLowerCase()
        );
        if (matchIdx !== -1) {
          setSelectedOrderIdx(matchIdx);
          setSelectedScenario(customEvent.detail?.scenario || "portDelay");
          setAutoPlayInterrupted(true);
          setIsAssembled(false);
          setStampActive(false);
          setBriefOpen(false);
          const el = document.getElementById("order-console");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };

    window.addEventListener("replay-fire-drill", handleReplayFireDrill);
    window.addEventListener("popstate", checkOrderParam);
    return () => {
      window.removeEventListener("replay-fire-drill", handleReplayFireDrill);
      window.removeEventListener("popstate", checkOrderParam);
    };
  }, []);

  const handleScenarioChange = (scen: "baseline" | "portDelay" | "airFreight") => {
    setAutoPlayInterrupted(true);
    setSelectedScenario(scen);
    setIsAssembled(false);
    setStampActive(false);
    setBriefOpen(false);
  };

  const handleOrderChange = (idx: number) => {
    setAutoPlayInterrupted(true);
    setSelectedOrderIdx(idx);
    setIsAssembled(false);
    setStampActive(false);
    setBriefOpen(false);
  };

  const handleGenerateBrief = () => {
    setAutoPlayInterrupted(true);
    // Snap parts together into assembled chassis
    setIsAssembled(true);
    // Land the stamp once with animation
    setStampActive(false);
    setTimeout(() => {
      setStampActive(true);
      setStampKey((prev) => prev + 1);
      setBriefOpen(true);
    }, 150);
  };

  return (
    <div
      id="order-console"
      className="relative bg-surface-sheet rounded-lg p-4 sm:p-5 lg:p-6 shadow-sheet border border-border-rule/80 transition-all max-w-full overflow-hidden"
    >
      {/* Disclaimer & Role Lens Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-border-rule gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-btn-cta tracking-wider uppercase text-[10px] sm:text-[11px]">
            SAMPLE SCENARIO DATA • LIVE CONSOLE
          </span>
          <span className="hidden sm:inline text-ink-muted">•</span>
          {/* Order Switcher Tabs */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Sample Orders">
            {SAMPLE_ORDERS.map((ord, idx) => (
              <button
                key={ord.id}
                role="tab"
                aria-selected={selectedOrderIdx === idx}
                onClick={() => handleOrderChange(idx)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] sm:text-[11px] transition-colors border ${
                  selectedOrderIdx === idx
                    ? "bg-ink-primary text-white border-ink-primary font-semibold shadow-xs"
                    : "bg-surface-recessed/60 text-ink-secondary border-border-rule hover:bg-surface-recessed hover:text-ink-primary"
                }`}
              >
                <span>{ord.id}</span>
                {ord.id === "ORD-91204" && (
                  <span className="ml-1 px-1 py-0.2 text-[8px] font-mono uppercase bg-friction-crimson text-white rounded">
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Lens Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto pt-1 sm:pt-0">
          <span className="text-[10px] text-ink-muted uppercase">Lens:</span>
          {(
            [
              { key: "operations", label: "Operations" },
              { key: "cfo", label: "CFO" },
              { key: "supplyChain", label: "Supply Chain" },
            ] as const
          ).map((lens) => (
            <button
              key={lens.key}
              onClick={() => setActiveRolePerspective(lens.key)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                activeRolePerspective === lens.key
                  ? "bg-ink-primary text-white font-semibold"
                  : "bg-surface-recessed/60 text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {lens.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Order Context & Perspective Bar */}
      <div className="mt-2.5 py-2 px-3 bg-surface-recessed/50 rounded border border-border-rule/60 text-[11px] font-mono flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold text-ink-primary text-[11px] sm:text-[12px]">{order.name}</span>
          <span className="text-ink-muted text-[10px] sm:text-[11px]">→ {order.customer}</span>
          <span className="text-ink-muted text-[10px]">({order.origin})</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] pt-1.5 sm:pt-0 border-t sm:border-t-0 border-border-rule/40">
          <span className="text-ink-muted shrink-0">
            Manual CSR Guess:{" "}
            <span className="line-through text-friction-crimson font-medium">
              {order.manualEstimate}
            </span>
          </span>
          <span className="hidden sm:inline text-border-rule">|</span>
          <span className="text-btn-cta font-medium text-[10px] sm:text-[11px]">
            {order.roleMetrics[activeRolePerspective]}
          </span>
        </div>
      </div>

      {/* Main 2-Column High-Density Cockpit */}
      <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Column (7 cols): Scenario Tester & Live Multi-System Feed */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          
          {/* Scenario Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase text-ink-muted tracking-wider">
                Test Supply Chain Scenario:
              </span>
              {!autoPlayInterrupted && (
                <span className="font-mono text-[9px] text-btn-cta animate-pulse">
                  ● 10s Demo Playing (Click to test)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => handleScenarioChange("baseline")}
                className={`p-2 rounded border text-left transition-all ${
                  selectedScenario === "baseline"
                    ? "bg-surface-canvas border-ink-primary font-bold text-ink-primary ring-1 ring-ink-primary shadow-xs"
                    : "bg-surface-recessed/40 border-border-rule text-ink-secondary hover:bg-surface-recessed"
                }`}
              >
                <span className="block text-[9px] text-ink-muted uppercase">Scenario 01</span>
                <span className="truncate block font-medium">Baseline Flow</span>
              </button>

              <button
                onClick={() => handleScenarioChange("portDelay")}
                className={`p-2 rounded border text-left transition-all ${
                  selectedScenario === "portDelay"
                    ? "bg-surface-canvas border-ink-primary font-bold text-ink-primary ring-1 ring-ink-primary shadow-xs"
                    : "bg-surface-recessed/40 border-border-rule text-ink-secondary hover:bg-surface-recessed"
                }`}
              >
                <span className="block text-[9px] text-friction-crimson uppercase">+3-Day Dwell</span>
                <span className="truncate block font-medium">Port Ocean Delay</span>
              </button>

              <button
                onClick={() => handleScenarioChange("airFreight")}
                className={`p-2 rounded border text-left transition-all ${
                  selectedScenario === "airFreight"
                    ? "bg-surface-canvas border-ink-primary font-bold text-ink-primary ring-1 ring-ink-primary shadow-xs"
                    : "bg-surface-recessed/40 border-border-rule text-ink-secondary hover:bg-surface-recessed"
                }`}
              >
                <span className="block text-[9px] text-btn-cta uppercase">Expedite Option</span>
                <span className="truncate block font-medium">Air / Alt Sourcing</span>
              </button>
            </div>
          </div>

          {/* Live Ingestion Feed Table */}
          <div className="bg-surface-canvas/60 rounded border border-border-rule/80 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-border-rule/60 text-[10px] font-mono text-ink-muted">
              <span>LIVE MULTI-SYSTEM INGESTION FEED</span>
              <span>IN-MEMORY DECISION (0.8s)</span>
            </div>
            <div className="space-y-1.5">
              {scenarioData.lines.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className="flex items-center justify-between gap-2 text-[11px] font-mono p-1.5 rounded bg-surface-sheet/80 border border-border-rule/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-surface-recessed text-ink-secondary border border-border-rule shrink-0">
                      {line.source}
                    </span>
                    <span className="truncate text-ink-primary font-medium text-[11px]">
                      {line.name}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {line.statusType === "ok" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-btn-cta">
                        <Check size={11} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{line.status}</span>
                        <span className="sm:hidden">{line.status.split(" ")[0]}</span>
                      </span>
                    ) : line.statusType === "warn" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                        <AlertTriangle size={11} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{line.status}</span>
                        <span className="sm:hidden">{line.status.split(" ")[0]}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-friction-crimson">
                        <AlertTriangle size={11} strokeWidth={2.5} />
                        <span className="hidden sm:inline">{line.status}</span>
                        <span className="sm:hidden">DELAY</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Layer Log / Note Ticker */}
          <div className="p-2 bg-surface-recessed/40 rounded border border-border-rule/60 text-[10px] font-mono text-ink-secondary flex items-start gap-1.5">
            <Zap size={12} className="text-btn-cta shrink-0 mt-0.5" />
            <span className="leading-tight">{scenarioData.notes}</span>
          </div>

        </div>

        {/* Right Column (5 cols): Reconciled Date Verdict + Compact BOM Visualizer */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-surface-recessed/30 rounded border border-border-rule p-3 sm:p-3.5 relative">
          
          {/* Action-Only Physical Rubber Stamp */}
          {stampActive && scenarioData.status === "reconciled" && (
            <div
              key={stampKey}
              className="absolute -top-3 -right-2 sm:-right-3 z-30 pointer-events-none transition-transform animate-[bounce_0.35s_ease-out_1]"
              role="status"
              aria-live="polite"
            >
              <div className="rubber-stamp">
                <div className="text-[9px] tracking-[0.14em] font-mono">QUANT FUSION</div>
                <div className="text-[11px] font-black tracking-wider">AUDIT VERIFIED</div>
                <div className="text-[8px] font-mono tracking-widest text-[#0D4E30]/90">
                  SOX 404 TRACEABLE
                </div>
              </div>
            </div>
          )}

          {stampActive && scenarioData.status === "exception" && (
            <div
              key={stampKey}
              className="absolute -top-3 -right-2 sm:-right-3 z-30 pointer-events-none transition-transform"
              role="status"
              aria-live="polite"
            >
              <div className="rubber-stamp rubber-stamp-red">
                <div className="text-[9px] tracking-[0.14em] font-mono">QUANT FUSION</div>
                <div className="text-[11px] font-black tracking-wider">EXCEPTION DETECTED</div>
                <div className="text-[8px] font-mono tracking-widest text-[#8A1C14]/90">
                  ACTION REQUIRED
                </div>
              </div>
            </div>
          )}

          {/* Delivery Promise Verdict Card Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border-rule/70 pb-2.5">
            <div>
              <span className="font-mono text-[9px] text-ink-muted uppercase tracking-wider block">
                {scenarioData.statusLabel}
              </span>
              <span
                className={`font-serif text-[20px] sm:text-[23px] font-bold block leading-tight ${
                  scenarioData.status === "exception" ? "text-friction-crimson" : "text-ink-primary"
                }`}
              >
                {scenarioData.date}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                scenarioData.status === "exception"
                  ? "bg-friction-wash text-friction-crimson border-friction-crimson/30"
                  : "bg-white text-btn-cta border-btn-cta/30"
              }`}
            >
              {scenarioData.status === "reconciled" ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <AlertTriangle size={11} strokeWidth={3} />
              )}
              {scenarioData.daysSaved}
            </span>
          </div>

          {/* Compact 3D Exploded/Assembled Drawing Viewer */}
          <div className="my-0.5">
            <ExplodedOrderViewer
              scenario={selectedScenario}
              isAssembled={isAssembled}
              compact={true}
            />
          </div>

          {/* Action Button & SOX Badge */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={handleGenerateBrief}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-btn-cta hover:bg-btn-ctaHover text-white text-[12px] font-mono font-medium rounded shadow-xs transition-colors"
            >
              <FileText size={13} />
              <span>Generate Brief & Stamp Order</span>
            </button>
            <div className="text-center">
              <span className="font-mono text-[9px] text-ink-muted">
                SOX 404 Audit Logged • Read-Only Enclave
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Exported Order Brief Sheet */}
      {briefOpen && (
        <div className="mt-3.5 p-4 rounded bg-surface-sheet border-2 border-border-rule shadow-md transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2.5 border-b border-border-rule">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-btn-cta uppercase">
                EXPORTED ORDER BRIEF • ASSEMBLED
              </span>
              <span className="text-[10px] font-mono text-ink-muted">
                DocRef: QF-{order.id}
              </span>
            </div>
            <button
              onClick={() => setBriefOpen(false)}
              className="text-ink-muted hover:text-ink-primary p-1"
              aria-label="Close exported brief"
            >
              <X size={14} />
            </button>
          </div>

          <div className="pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-ink-muted block text-[10px]">Order Identity:</span>
              <span className="font-semibold text-ink-primary">{order.id}  {order.name}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Client Recipient:</span>
              <span className="font-semibold text-ink-primary">{order.customer}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Manual CSR Guess:</span>
              <span className="line-through text-friction-crimson">{order.manualEstimate}</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Reconciled Promise Date:</span>
              <span className="font-bold text-btn-cta">{scenarioData.date}</span>
            </div>
          </div>

          <div className="mt-2.5 p-2 bg-surface-canvas rounded text-[10px] font-mono text-ink-muted flex items-center justify-between">
            <span>SOX 404 Audit Logged • Read-Only Enclave</span>
            <button
              onClick={() => window.print()}
              className="text-link-interactive hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <Printer size={11} />
              Print / Save Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
