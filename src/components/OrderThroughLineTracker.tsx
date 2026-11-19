"use client";

import React, { useState, useEffect } from "react";
import { Check, AlertTriangle, ArrowRight, Layers, FileText } from "lucide-react";

export function OrderThroughLineTracker() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 280);

      // Section-based milestone calculation based on scroll depth
      if (scrollY < 900) {
        setActiveStep(1); // Ingestion & Hero Console
      } else if (scrollY < 2000) {
        setActiveStep(2); // 120 Transcripts & Hard Truth Conflict
      } else if (scrollY < 3400) {
        setActiveStep(3); // Comparative Ledger & Reconciled Dates
      } else {
        setActiveStep(4); // SOX Audit & Commercial Pilot
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { num: "01", name: "Sources Ingested", sub: "4 systems read", status: "ok" },
    { num: "02", name: "Bottleneck Detected", sub: "Port dwell +3d", status: "warn" },
    { num: "03", name: "Date Reconciled", sub: "Nov 06 confirmed", status: "ok" },
    { num: "04", name: "Audit Stamped", sub: "SOX 404 logged", status: "stamp" },
  ];

  if (!isScrolled) return null;

  return (
    <>
      {/* Desktop Top Persistent Strip (Just beneath header, normal scroll context) */}
      <div className="hidden lg:block fixed top-[62px] left-0 right-0 z-40 bg-surface-sheet/95 backdrop-blur-md border-b border-border-rule shadow-xs transition-all animate-in fade-in slide-in-from-top-1">
        <div className="max-w-[1280px] mx-auto px-6 h-[44px] flex items-center justify-between text-[11px] font-mono">
          {/* Order Identity Through-Line */}
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-btn-cta uppercase tracking-wider">
              ORDER THROUGH-LINE:
            </span>
            <span className="font-semibold text-ink-primary">
              ORD-78192
            </span>
            <span className="text-ink-muted">
              Commercial Unit #CX-900 (Apex Thermal Dynamics)
            </span>
          </div>

          {/* 4 Milestones Progression */}
          <div className="flex items-center gap-6">
            {steps.map((st, i) => {
              const stepIdx = i + 1;
              const isCurrent = activeStep === stepIdx;
              const isPast = activeStep > stepIdx;

              return (
                <div
                  key={st.num}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCurrent
                      ? "text-ink-primary font-bold"
                      : isPast
                      ? "text-btn-cta font-medium"
                      : "text-ink-muted opacity-60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                      isCurrent
                        ? "bg-ink-primary text-white"
                        : isPast
                        ? "bg-btn-cta text-white"
                        : "bg-surface-recessed text-ink-muted"
                    }`}
                  >
                    {isPast ? <Check size={9} strokeWidth={3} className="text-white" /> : st.num}
                  </span>
                  <span>{st.name}</span>
                </div>
              );
            })}
          </div>

          {/* Action quick jump */}
          <a
            href="#order-console"
            className="text-[11px] text-link-interactive hover:underline font-semibold"
          >
            Inspect Console ↑
          </a>
        </div>
      </div>

      {/* Mobile Bottom Fixed Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-sheet border-t border-border-rule px-4 py-2.5 shadow-lg flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="w-2 h-2 rounded-full bg-btn-cta shrink-0" />
          <span className="font-bold text-ink-primary truncate">
            ORD-78192:
          </span>
          <span className="text-ink-secondary truncate">
            {steps[activeStep - 1]?.name}
          </span>
        </div>
        <a
          href="#order-console"
          className="shrink-0 px-2.5 py-1 bg-surface-recessed rounded text-ink-primary font-semibold text-[10px]"
        >
          View Order
        </a>
      </div>
    </>
  );
}
