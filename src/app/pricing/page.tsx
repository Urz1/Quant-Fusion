import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing & Plans | Quant Fusion",
  description: "Transparent, predictable enterprise pricing. Basic, Professional, and Organization tiers with zero IT overhaul required.",
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Basic",
      price: "$199",
      cadence: "/ seat / month",
      desc: "For small distribution teams seeking single-department order determination.",
      sources: "Up to 3 Data Sources",
      features: [
        "Weekly data sync frequency",
        "1 Core workflow (Ship Date Determination)",
        "Standard CSV and flat-file ingestion",
        "Standard email customer support",
        "SOX Section 404 audit logging",
      ],
      ctaText: "Start Basic Pilot",
      popular: false,
      delay: 0,
    },
    {
      name: "Professional",
      price: "$499",
      cadence: "/ seat / month",
      desc: "For multi-plant manufacturers requiring real-time exception tracking and AI routing.",
      sources: "Up to 15 Data Sources",
      features: [
        "Daily automated data sync frequency",
        "3 Concurrent workflows",
        "3 KPI Exception Engines per workflow",
        "AI-Powered Decision Action Engine",
        "Report-based automated exports",
        "Priority technical support & SLA",
      ],
      ctaText: "Start Professional Pilot",
      popular: true,
      delay: 40,
    },
    {
      name: "Organization",
      price: "Custom",
      cadence: "enterprise agreement",
      desc: "For global enterprises requiring full ERP integration, custom KPIs, and SLAs.",
      sources: "Unlimited Data Sources",
      features: [
        "Continuous real-time data sync",
        "Unlimited custom workflows",
        "5+ KPI Exception Engines per workflow",
        "Conversational AI interface",
        "Direct API integration & dedicated pipeline",
        "Dedicated Solutions Engineer & 24/7 SLA",
      ],
      ctaText: "Contact for Enterprise Quote",
      popular: false,
      delay: 80,
    },
  ];

  return (
    <div className="w-full animate-page-enter">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
            Transparent Commercial Packaging
          </span>
          <h1 className="font-serif text-[42px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight">
            Predictable pricing. Measurable ROI in 30 days.
          </h1>
          <p className="font-sans text-[17px] text-ink-secondary mt-3 max-w-xl mx-auto leading-relaxed">
            Deploy on your everyday flat files on Day One. If you do not experience positive labor savings within 30 days, you owe nothing.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-22 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="flex"
              >
                <div
                  className={`w-full bg-surface-sheet rounded-lg p-8 border flex flex-col justify-between shadow-sheet relative interactive-card ${
                    tier.popular ? "border-btn-cta ring-1 ring-btn-cta/40" : "border-border-rule"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-8 bg-btn-cta text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded shadow-xs">
                      Most Selected for Manufacturing
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-[24px] font-bold text-ink-primary">{tier.name}</h2>
                      <p className="font-sans text-[14px] text-ink-secondary mt-1 min-h-[40px] leading-relaxed">
                        {tier.desc}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-border-rule">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-[44px] font-bold text-ink-primary leading-none">
                          {tier.price}
                        </span>
                        <span className="font-mono text-[12px] text-ink-muted">{tier.cadence}</span>
                      </div>
                      <span className="font-mono text-[12px] font-semibold text-btn-cta mt-2 block">
                        {tier.sources}
                      </span>
                    </div>

                    <ul className="space-y-3 text-[14px] font-sans text-ink-secondary">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check size={16} className="text-btn-cta shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/contact"
                      className={`btn-press w-full inline-flex items-center justify-center py-3 text-[15px] font-medium rounded transition-colors text-center ${
                        tier.popular
                          ? "bg-btn-cta hover:bg-btn-ctaHover text-white shadow-sm"
                          : "bg-surface-recessed hover:bg-surface-sheet text-ink-primary border border-border-rule"
                      }`}
                    >
                      {tier.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[13px] font-mono text-ink-muted">
            * Note: TradeGauge™ Tariff Intelligence is available as an enterprise module. Contact sales for bundled pricing.
          </div>
        </div>
      </section>
    </div>
  );
}
