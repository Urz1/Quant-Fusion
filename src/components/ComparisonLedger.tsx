"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ToggleLeft, ToggleRight, RotateCcw } from "lucide-react";

interface ComparisonRow {
  attribute: string;
  legacy: string;
  quantFusion: string;
  metric: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    attribute: "Data Ingestion",
    legacy: "7 to 12 isolated CSV files, email chains, and manual copy-pasting",
    quantFusion: "Continuous automated ingestion via read-only APIs and secure flat-file feeds",
    metric: "0 hours manual entry",
  },
  {
    attribute: "Ship Date Calculation",
    legacy: "Subjective guesswork across 4 departments with disconnected variables",
    quantFusion: "Task-specific algorithmic rules reconcile carrier dwell and bill of materials live",
    metric: "Deterministic calculation",
  },
  {
    attribute: "Audit & SOX Compliance",
    legacy: "Non-compliant: Spreadsheets lack tamper-evident audit logs, risking Sarbanes-Oxley audit failure",
    quantFusion: "100% Traceable: Cryptographic event log records every data feed, timestamp, and rule execution",
    metric: "SOX 404 defensible",
  },
  {
    attribute: "Operational Labor Burn",
    legacy: "Up to 400 hours lost annually per CSR, sales, and procurement employee chasing order updates",
    quantFusion: "90% reduction in order-status firefighting and repetitive multi-system lookups",
    metric: "22h/mo saved per CSR",
  },
  {
    attribute: "Customer Query Latency",
    legacy: "4 to 24 hours while CSRs chase updates across warehouse and freight carriers",
    quantFusion: "Sub-second verified query on any sales order or component batch",
    metric: "< 250ms response",
  },
];

export function ComparisonLedger() {
  const [resolvedMode, setResolvedMode] = useState<boolean>(true);

  return (
    <div className="bg-surface-sheet rounded border border-border-rule overflow-hidden shadow-sheet">
      {/* Header bar with resolution control */}
      <div className="bg-surface-recessed px-6 py-3.5 border-b border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-ink-primary font-mono text-[12px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider">
            Attribute-Paired Resolution Ledger
          </span>
          <span className="text-[10px] text-ink-muted hidden md:inline">
            • Static Fallback Supported
          </span>
        </div>

        {/* Interactive Strikethrough Resolution Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-ink-secondary text-[11px]">View Mode:</span>
          <button
            onClick={() => setResolvedMode(!resolvedMode)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sheet border border-border-rule hover:border-ink-secondary text-ink-primary text-[11px] font-semibold transition-colors"
            aria-label="Toggle resolved state"
          >
            {resolvedMode ? (
              <>
                <ToggleRight size={15} className="text-btn-cta" />
                <span className="text-btn-cta">Resolved (Quant Fusion 1-Click)</span>
              </>
            ) : (
              <>
                <ToggleLeft size={15} className="text-friction-crimson" />
                <span className="text-friction-crimson">Unresolved (40-Step Excel)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-surface-recessed/60 border-b border-border-rule font-mono text-[11px] text-ink-primary uppercase tracking-wider">
              <th className="py-3 px-6 font-semibold w-1/4">Operational Attribute</th>
              <th className="py-3 px-6 font-semibold w-3/8 text-friction-crimson">
                Legacy Spreadsheet Process (40 Steps)
              </th>
              <th className="py-3 px-6 font-semibold w-3/8 text-btn-cta">
                Quant Fusion Decision Layer (1 Click)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-rule/60 font-sans text-ink-secondary">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-surface-recessed/30 transition-colors"
              >
                <td className="py-4 px-6 font-mono font-medium text-ink-primary">
                  <div className="font-semibold">{row.attribute}</div>
                  <span className="text-[10px] font-mono text-ink-muted block mt-0.5">
                    {row.metric}
                  </span>
                </td>

                {/* Legacy Column: Strikethrough resolves when toggled/active */}
                <td className="py-4 px-6">
                  <span
                    className={`transition-all duration-300 block ${
                      resolvedMode
                        ? "line-through text-ink-muted/80 opacity-70"
                        : "text-friction-crimson font-medium opacity-100"
                    }`}
                  >
                    {row.legacy}
                  </span>
                </td>

                {/* Quant Fusion Column */}
                <td className="py-4 px-6">
                  <div
                    className={`flex items-start gap-2 transition-all duration-300 ${
                      resolvedMode ? "text-ink-primary font-medium" : "text-ink-secondary opacity-60"
                    }`}
                  >
                    <Check
                      size={16}
                      className={`shrink-0 mt-0.5 transition-colors ${
                        resolvedMode ? "text-btn-cta stroke-[2.5]" : "text-ink-muted"
                      }`}
                    />
                    <span>{row.quantFusion}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
