"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Printer, FileText, Check, HelpCircle, X, Download, Copy } from "lucide-react";

export interface DepartmentMetric {
  key: string;
  name: string;
  hours: number;
  driver: string;
  defaultFte: number;
}

export const DEPARTMENTS: DepartmentMetric[] = [
  {
    key: "insideSales",
    name: "Inside Sales & Customer Support",
    hours: 22,
    driver: "Re-entering data across 7 screens to answer 'Where is my order?'",
    defaultFte: 10,
  },
  {
    key: "logistics",
    name: "Logistics & Freight Coordination",
    hours: 17,
    driver: "Chasing carrier tracking portals and expediting late shipments",
    defaultFte: 5,
  },
  {
    key: "supplyChain",
    name: "Supply Chain & Procurement",
    hours: 13,
    driver: "Matching supplier delivery updates against ERP commitments",
    defaultFte: 4,
  },
  {
    key: "purchasing",
    name: "Purchasing & Plant Operations",
    hours: 9,
    driver: "Re-planning production lots based on unannounced part delays",
    defaultFte: 4,
  },
  {
    key: "finance",
    name: "Finance & Accounting",
    hours: 9,
    driver: "Handling customer chargebacks, freight disputes, and manual accruals",
    defaultFte: 3,
  },
  {
    key: "sales",
    name: "Direct Field Sales",
    hours: 8,
    driver: "Diffusing late-delivery escalations instead of selling",
    defaultFte: 8,
  },
];

export function LedgerCalculator() {
  const [salary, setSalary] = useState<number>(75000);
  const [ftes, setFtes] = useState<Record<string, number>>({
    insideSales: 10,
    logistics: 5,
    supplyChain: 4,
    purchasing: 4,
    finance: 3,
    sales: 8,
  });
  const [showMathDrawer, setShowMathDrawer] = useState<boolean>(false);
  const [showCfoMemo, setShowCfoMemo] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const hourlyRate = salary / 2080;

  const departmentLosses = DEPARTMENTS.map((dept) => {
    const fte = ftes[dept.key] ?? 0;
    const monthlyHours = fte * dept.hours;
    const annualHours = monthlyHours * 12;
    const annualCost = Math.round(annualHours * hourlyRate);
    return {
      ...dept,
      fte,
      monthlyHours,
      annualHours,
      annualCost,
    };
  });

  const totalMonthlyHours = departmentLosses.reduce((acc, d) => acc + d.monthlyHours, 0);
  const totalAnnualHours = totalMonthlyHours * 12;
  const totalAnnualCost = departmentLosses.reduce((acc, d) => acc + d.annualCost, 0);
  const maxMonthlyHours = Math.max(...departmentLosses.map((d) => d.monthlyHours), 1);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    const memoText = `EXECUTIVE MEMORANDUM  AVOIDABLE SG&A COST AUDIT
To: Chief Financial Officer & Operating Committee
From: Operational Decision Layer Diagnostic
Re: Cross-Departmental Order Status Waste Analysis

EXECUTIVE SUMMARY:
- Total Annual Avoidable Payroll Waste: $${totalAnnualCost.toLocaleString()}
- Total Annual Lost Hours: ${totalAnnualHours.toLocaleString()} hrs/year (${totalMonthlyHours.toLocaleString()} hrs/month)
- Benchmark Base Salary: $${salary.toLocaleString()} ($${hourlyRate.toFixed(2)}/hr loaded)
- Projected Payback Period: < 60 Days Post-Deployment
- Estimated 1-Year Labor Recovery ROI: 280%+

DEPARTMENTAL BREAKDOWN:
${departmentLosses.map((d) => `- ${d.name}: ${d.fte} FTEs × ${d.hours}h/mo = ${d.monthlyHours}h/mo ($${d.annualCost.toLocaleString()}/yr)`).join("\n")}

AUDIT COMPLIANCE:
Designed for SOX Section 404 segregation of duties and automated revenue recognition auditability.
Diagnostic engine: Quant Fusion (https://www.quant-fusion.com)`;

    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-sheet">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border-rule gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-btn-cta uppercase tracking-wider">
              Diagnostic Ledger • Avoidable SG&A Costs
            </span>
          </div>
          <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold text-ink-primary mt-1">
            Quantify Your Team’s Avoidable Labor Waste
          </h3>
          <p className="font-sans text-[14px] text-ink-secondary mt-1">
            Calculated across verified operational benchmarks from 120 customer and industry interviews.
          </p>
        </div>

        {/* Avg fully loaded salary input */}
        <div className="flex items-center gap-2.5 bg-surface-recessed p-2.5 rounded border border-border-rule self-start sm:self-center">
          <label htmlFor="avg-salary" className="font-mono text-[12px] text-ink-secondary whitespace-nowrap">
            Avg Fully Loaded Salary:
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-ink-muted">
              $
            </span>
            <input
              id="avg-salary"
              type="number"
              min="30000"
              max="300000"
              step="5000"
              value={salary}
              onChange={(e) => setSalary(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-28 pl-6 pr-2 py-1 bg-surface-sheet rounded font-mono text-[13px] text-ink-primary font-semibold border border-border-rule text-right focus:outline-link-interactive"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        {/* Left: Department Typed Inputs */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[12px] font-mono text-ink-muted uppercase tracking-wider pb-1">
            Department Headcounts & Benchmark Monthly Lost Hours
          </div>

          {departmentLosses.map((dept) => (
            <div
              key={dept.key}
              className="p-3.5 rounded bg-surface-canvas/50 border border-border-rule/80 hover:border-border-rule transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5 flex-1 pr-2">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="font-sans text-[14px] font-medium text-ink-primary">
                    {dept.name}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-friction-crimson bg-friction-crimson/10 px-1.5 py-0.5 rounded">
                    {dept.hours}h / mo per FTE
                  </span>
                </div>
                <div className="font-sans text-[12px] text-ink-muted leading-tight">
                  {dept.driver}
                </div>
              </div>

              {/* Typed FTE Input */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={dept.fte}
                  onChange={(e) =>
                    setFtes({
                      ...ftes,
                      [dept.key]: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-16 px-2 py-1 bg-surface-sheet rounded font-mono text-[14px] text-ink-primary font-bold border border-border-rule text-center focus:outline-link-interactive"
                  aria-label={`${dept.name} FTE headcount`}
                />
                <span className="font-mono text-[12px] text-ink-secondary w-9">FTEs</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: SVG Bar Chart & Financial Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Responsive SVG Bar Chart */}
          <div className="p-5 rounded bg-surface-canvas/60 border border-border-rule">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <span className="font-mono text-[11px] font-semibold text-ink-primary uppercase tracking-wider">
                Monthly Lost Hours by Department
              </span>
              <span className="font-mono text-[11px] text-friction-crimson font-bold">
                {totalMonthlyHours.toLocaleString()} hrs / mo total
              </span>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="pt-4 space-y-2.5">
              {departmentLosses.map((dept) => {
                const widthPct = Math.min(100, Math.round((dept.monthlyHours / maxMonthlyHours) * 100));
                return (
                  <div key={dept.key} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-ink-secondary truncate max-w-[190px]">
                        {dept.name.split("&")[0].trim()}
                      </span>
                      <span className="text-ink-primary font-semibold">
                        {dept.monthlyHours.toLocaleString()} hrs
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="w-full h-2.5 bg-surface-recessed rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-friction-crimson transition-all duration-300 rounded-full"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Annual Total Ledger Card */}
          <div className="p-5 rounded bg-surface-sheet border-2 border-border-rule space-y-4 shadow-sm">
            <div>
              <span className="font-mono text-[11px] font-bold text-friction-crimson uppercase tracking-wider block">
                Total Annual Avoidable Waste
              </span>
              <div className="font-serif text-[42px] font-bold text-ink-primary tracking-tight leading-none mt-2">
                ${totalAnnualCost.toLocaleString()}
              </div>
              <span className="font-mono text-[12px] text-ink-muted block mt-1.5">
                {(totalAnnualHours).toLocaleString()} hours burned annually on multi-screen lookups
              </span>
            </div>

            <div className="border-t border-border-rule pt-3 space-y-2 font-mono text-[12px]">
              <div className="flex justify-between text-ink-secondary">
                <span>Calculated Hourly Rate:</span>
                <span className="text-ink-primary font-semibold">${hourlyRate.toFixed(2)}/hr (based on 2,080 hrs/yr)</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>Expected Payback:</span>
                <span className="text-btn-cta font-bold">&lt; 60 Days Post-Deployment</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>1-Year Labor Recovery ROI:</span>
                <span className="text-btn-cta font-bold">280%+</span>
              </div>
            </div>

            {/* Expandable Calculation Math Drawer */}
            <div className="border-t border-border-rule pt-2">
              <button
                onClick={() => setShowMathDrawer(!showMathDrawer)}
                className="w-full flex items-center justify-between text-[12px] font-mono text-link-interactive hover:underline py-1"
              >
                <span>{showMathDrawer ? "Hide Calculation Math" : "Show the Calculation Math"}</span>
                {showMathDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showMathDrawer && (
                <div className="mt-2 p-3 bg-surface-canvas rounded text-[11px] font-mono text-ink-secondary space-y-2 border border-border-rule">
                  <div>
                    <strong className="text-ink-primary">Formula:</strong>
                    <div className="text-ink-primary mt-0.5">
                      Annual Loss = &Sigma; (FTEs &times; Lost Hours/Mo &times; 12) &times; (Salary / 2,080)
                    </div>
                  </div>
                  <div>
                    <strong className="text-ink-primary">Benchmark Basis:</strong>
                    <div>
                      Conducted across 120 supply chain directors. Inside Sales spends 22 hrs/month answering carrier and ERP questions; Logistics spends 17 hrs on container dwell and dispatch reconciliations.
                    </div>
                  </div>
                  <div className="text-ink-muted">
                    Direct payroll recovery only. Excludes secondary chargeback penalties and expedite freight surcharges.
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center px-5 py-3 bg-btn-cta hover:bg-btn-ctaHover text-white text-[14px] font-medium rounded transition-colors text-center"
              >
                Schedule CFO Diagnostic Review
                <ArrowRight size={15} className="ml-2" />
              </Link>
              <button
                onClick={() => setShowCfoMemo(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-surface-recessed hover:bg-border-rule text-ink-primary text-[13px] font-medium rounded border border-border-rule transition-colors text-center font-mono"
              >
                <FileText size={15} className="mr-2 text-btn-cta" />
                Generate Board-Ready CFO Briefing Memo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Board-Ready CFO Briefing Memorandum Modal */}
      {showCfoMemo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-surface-sheet rounded border-2 border-border-rule shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-rule">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-btn-cta tracking-wider">
                  Confidential Operational Diagnostic
                </span>
                <h4 className="font-serif text-[22px] font-semibold text-ink-primary">
                  Executive Briefing Memorandum
                </h4>
              </div>
              <button
                onClick={() => setShowCfoMemo(false)}
                className="p-1.5 rounded hover:bg-surface-recessed text-ink-muted hover:text-ink-primary"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Memo Content Formatted for Board Committee */}
            <div className="space-y-4 font-mono text-[12px] text-ink-secondary bg-surface-canvas/60 p-5 rounded border border-border-rule">
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-border-rule text-[11px]">
                <div><span className="text-ink-muted">TO:</span> Operating Committee & CFO</div>
                <div><span className="text-ink-muted">DATE:</span> {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div><span className="text-ink-muted">FROM:</span> Diagnostic Financial Engine</div>
                <div><span className="text-ink-muted">RE:</span> Avoidable Order SG&A Waste Audit</div>
              </div>

              <div>
                <strong className="text-ink-primary block text-[13px] font-serif mb-1">
                  1. Executive Financial Summary
                </strong>
                <p className="font-sans text-[13px] text-ink-secondary leading-relaxed">
                  Based on current organizational headcounts and verified industry benchmarks, our teams burn an estimated <strong className="text-friction-crimson">{totalMonthlyHours.toLocaleString()} hours per month</strong> ({totalAnnualHours.toLocaleString()} hours annualized) on manual cross-departmental order hunting, carrier status reconciliation, and multi-system inquiries.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-surface-sheet rounded border border-border-rule text-center">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">Annual Avoidable SG&A</span>
                  <span className="font-serif text-[20px] font-bold text-friction-crimson block mt-0.5">
                    ${totalAnnualCost.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">Projected Payback</span>
                  <span className="font-serif text-[20px] font-bold text-btn-cta block mt-0.5">
                    &lt; 60 Days
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase">Labor Recovery ROI</span>
                  <span className="font-serif text-[20px] font-bold text-btn-cta block mt-0.5">
                    280%+
                  </span>
                </div>
              </div>

              <div>
                <strong className="text-ink-primary block text-[12px] font-serif mb-1">
                  2. Departmental Allocation
                </strong>
                <div className="space-y-1.5 text-[11px]">
                  {departmentLosses.map((d) => (
                    <div key={d.key} className="flex justify-between pb-1 border-b border-border-rule/60">
                      <span>{d.name} ({d.fte} FTEs)</span>
                      <span className="font-semibold text-ink-primary">${d.annualCost.toLocaleString()} / yr</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-ink-muted font-sans pt-1">
                Sarbanes-Oxley 404 Compliant: Quant Fusion provides cryptographic in-memory audit logs of all order determinations, eliminating spreadsheet risk for financial revenue recognition.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-btn-cta hover:bg-btn-ctaHover text-white font-mono text-[12px] font-medium rounded transition-colors"
                >
                  <Printer size={14} className="mr-1.5" />
                  Print / Save PDF Memo
                </button>
                <button
                  onClick={handleCopyMemo}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 bg-surface-recessed hover:bg-border-rule text-ink-primary font-mono text-[12px] rounded border border-border-rule transition-colors"
                >
                  {copied ? <Check size={14} className="mr-1 text-btn-cta" /> : <Copy size={14} className="mr-1 text-ink-muted" />}
                  {copied ? "Copied to Clipboard!" : "Copy Text"}
                </button>
              </div>

              <button
                onClick={() => setShowCfoMemo(false)}
                className="text-ink-muted hover:text-ink-primary font-mono text-[12px] px-3 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
