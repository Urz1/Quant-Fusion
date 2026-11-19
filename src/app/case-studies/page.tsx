import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle, Play } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Case Study Templates & Proof | Quant Fusion",
  description: "Operational ROI models across commercial equipment, specialty chemicals, and industrial machinery.",
};

export default function CaseStudiesPage() {
  const studies = [
    {
      company: "Commercial Foodservice Equipment Manufacturer",
      orderId: "ORD-78192",
      replayLabel: "Replay Foodservice Order Determination in Hero Console",
      statusBadge: "[Template Slot: Named Customer Clearance Pending • Owner: CEO / Sales]",
      headline: "Saving 400 hours per employee annually and eliminating $900,000 in operational waste.",
      image: "/assets/case_foodservice_manufacturing.webp",
      imageAlt: "Commercial Foodservice Equipment Manufacturing Assembly Line",
      imageCaption: "Assembly Line #02 • Commercial Convection Units",
      problem:
        "Customer service representatives spent over 20% of their workday querying five separate databases (sales orders, inventory, manufacturing schedules, and 3PL tracking) to answer basic delivery inquiries. Shifting dates caused missed bulk discounts, dealer chargebacks, and Sarbanes-Oxley compliance risks.",
      solution:
        "Quant Fusion deployed its 1-Click Ship Date engine, ingesting daily flat files from the manufacturer's SAP ERP and carrier portals. Business logic dynamically prioritizes orders based on customer revenue, profit margins, and promised delivery dates.",
      results: [
        "Up to 400 hours saved annually per CSR, sales, and procurement employee. [To verify against client timesheets]",
        "Over $900,000 in avoidable SG&A labor and delay chargebacks eliminated. [Modeled baseline]",
        "Full Sarbanes-Oxley (SOX) Section 404 audit trail established for revenue recognition.",
        "Dealer satisfaction improved by 34%, eliminating order cancellation penalties.",
      ],
      metrics: [
        { label: "Hours Saved / FTE", val: "400 hrs" },
        { label: "Annual Labor Savings", val: "$900,000" },
        { label: "Query Speed", val: "< 0.25s" },
      ],
    },
    {
      company: "$20B Global Chemical Enterprise",
      orderId: "PO-34018",
      replayLabel: "Replay Bulk Railcar Telematics Reconciliation",
      statusBadge: "[Template Slot: Anonymized Reference • Named Approval Needed]",
      headline: "Replacing 7-screen manual lookup across isolated SAP instances with instant order visibility.",
      image: "/assets/case_specialty_chemical_rail.webp",
      imageAlt: "Specialty Chemicals Railcar Logistics Terminal",
      imageCaption: "Private Bulk Railcar Siding • Manifold Telematics Hub",
      problem:
        "Operating across multiple acquired entities left regional plants on disjointed SAP instances. Customer service had to manually email plant logistics managers to verify bulk chemical railcar dispatches, creating a 48-hour lag in status updates.",
      solution:
        "Quant Fusion configured a centralized decision layer that ingests nightly SAP exports and railcar GPS telemetry, surfacing a unified delivery promise date without forcing an expensive SAP S/4HANA database migration.",
      results: [
        "Customer inquiry turnaround reduced from 48 hours to instantaneous 1-click lookup.",
        "Over 60 hours per month of internal email firefighting eliminated across supply chain.",
        "Accurate monthly revenue forecasting for corporate finance.",
      ],
      metrics: [
        { label: "Inquiry Turnaround", val: "Instant" },
        { label: "Email Firefighting", val: "-85%" },
        { label: "IT Migration Cost", val: "$0" },
      ],
    },
    {
      company: "$120B Industrial Machinery Manufacturer",
      orderId: "ORD-91204",
      replayLabel: "Replay Component Shortage Exception in Hero Console",
      statusBadge: "[Template Slot: Verified Enterprise Discovery • Client Reference Pending]",
      headline: "Automating KPI exception tracking and eliminating manual reporting across global distribution hubs.",
      image: "/assets/case_machinery_parts_hub.webp",
      imageAlt: "Industrial Machinery Parts Distribution Logistics Hub",
      imageCaption: "Distribution Center #12 • High-Bay Component Staging",
      problem:
        "Managing replacement parts across 30 global warehouses required regional teams to manually format Excel workbooks every Friday, taking up to 12 hours per team to calculate backorder risks.",
      solution:
        "Quant Fusion's Exception Engine was linked to regional warehouse feeds, automatically flagging part shortages and carrier dwell delays before customers noticed.",
      results: [
        "Eliminated Friday manual spreadsheet consolidation across 30 distribution hubs.",
        "Reduced backorder escalations by 42% through proactive inventory re-allocation.",
        "Deployed in under 3 weeks using existing flat-file exports.",
      ],
      metrics: [
        { label: "Reporting Time", val: "-90%" },
        { label: "Backorder Escalation", val: "-42%" },
        { label: "Deployment Time", val: "3 Weeks" },
      ],
    },
  ];

  return (
    <div className="w-full animate-page-enter">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
              Enterprise Proof Templates
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed border border-border-rule text-ink-secondary">
              Design Architecture & Proof Structures
            </span>
          </div>
          <h1 className="font-serif text-[40px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight max-w-3xl">
            Measurable operational ROI. Structured for customer proof.
          </h1>
          <p className="font-sans text-[17px] text-ink-secondary mt-3 max-w-2xl leading-relaxed">
            These templates demonstrate how Quant Fusion structures customer case studies: pairing qualitative operational friction with quantitative P&L recovery and audit compliance.
          </p>

          {/* Prototype Honest Proof Notice */}
          <div className="mt-6 p-4 rounded bg-surface-sheet border border-amber-500/30 text-[12px] font-mono text-ink-secondary flex items-start gap-3 shadow-xs">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-ink-primary block uppercase">Pitch Governance Note:</span>
              <span>
                Design supplies the narrative structure, KPI callouts, and audit formatting. Quant Fusion company leadership must supply 2–3 signed client releases willing to be named publicly to achieve top-tier enterprise credibility.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="py-16 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          {studies.map((study, i) => (
            <div
              key={i}
              className="bg-surface-sheet rounded-lg p-8 sm:p-10 border border-border-rule shadow-sheet space-y-8 interactive-card"
            >
              <div className="pb-6 border-b border-border-rule flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-btn-cta uppercase tracking-wider">
                      Case Study #{i + 1} • {study.company}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-friction-crimson font-medium">
                      {study.statusBadge}
                    </span>
                  </div>
                  <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold text-ink-primary mt-2">
                    {study.headline}
                  </h2>
                </div>
                
                <div className="flex items-center gap-6 font-mono shrink-0">
                  {study.metrics.map((m, idx) => (
                    <div key={idx} className="text-right">
                      <span className="font-serif text-[22px] font-bold text-ink-primary block leading-none">
                        {m.val}
                      </span>
                      <span className="text-[11px] text-ink-muted">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Facility Visual Context */}
              <div className="relative w-full h-[220px] sm:h-[300px] rounded overflow-hidden border border-border-rule shadow-xs img-zoom-container">
                <Image
                  src={study.image}
                  alt={study.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  className="object-cover parchment-photo"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded bg-ink-primary/85 backdrop-blur-xs text-white font-mono text-[11px] shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{study.imageCaption}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[15px] font-sans leading-relaxed">
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-serif text-[18px] font-semibold text-ink-primary">
                    The Operational Bottleneck
                  </h3>
                  <p className="text-ink-secondary">{study.problem}</p>
                </div>
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-serif text-[18px] font-semibold text-ink-primary">
                    The Quant Fusion Decision Layer
                  </h3>
                  <p className="text-ink-secondary">{study.solution}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-[15px] font-semibold text-ink-primary">
                    Documented Operational Results:
                  </h4>
                  <ul className="grid grid-cols-1 gap-1 text-[13px]">
                    {study.results.slice(0, 2).map((res, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-ink-secondary">
                        <Check size={14} className="text-btn-cta shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The "Replay in Hero Console" Action */}
                <Link
                  href={`/?order=${study.orderId}#order-console`}
                  className="btn-press inline-flex items-center gap-2 px-4 py-2.5 bg-btn-cta hover:bg-btn-ctaHover text-white font-mono text-[12px] font-medium rounded shadow-xs transition-colors shrink-0"
                >
                  <Play size={13} fill="currentColor" />
                  <span>{study.replayLabel}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <ScrollReveal direction="up" delay={40} scale={true} blur={false} className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="p-8 sm:p-12 rounded-xl bg-surface-sheet border border-btn-cta/30 shadow-sheet space-y-5 interactive-card">
            <h2 className="font-serif text-[32px] sm:text-[38px] font-semibold text-ink-primary">
              Ready to establish verified operational baselines for your facility?
            </h2>
            <p className="font-sans text-[16px] text-ink-secondary max-w-xl mx-auto leading-relaxed">
              Our 30-day proof-of-value evaluation ingests your everyday CSV exports to calculate exact labor and chargeback recovery metrics.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center justify-center px-8 py-3.5 bg-btn-cta hover:bg-btn-ctaHover text-white text-[15px] font-medium rounded transition-colors"
              >
                Request 30-Day Pilot Evaluation
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
