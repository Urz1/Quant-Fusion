import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "About Us & Leadership | Quant Fusion",
  description: "Founded by Deb Friar, former executive at Welbilt, Target, and PepsiCo. Bringing MIT data science and enterprise P&L discipline to global supply chains.",
};

export default function AboutPage() {
  return (
    <div className="w-full animate-page-enter">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
            Executive Leadership & Proven Pedigree
          </span>
          <h1 className="font-serif text-[40px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight max-w-3xl">
            Decades inside Fortune 500 supply chains. Now solved in software.
          </h1>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Portrait & Credentials */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative w-full max-w-[340px] h-[410px] rounded-lg overflow-hidden shadow-sheet border border-border-rule mx-auto lg:mx-0 img-zoom-container interactive-card">
                <Image
                  src="/assets/deb_friar_founder_official.jpg"
                  alt="Deb Friar, CEO and Founder of Quant Fusion"
                  fill
                  className="object-cover object-top parchment-photo"
                  priority
                />
              </div>

              <div className="p-5 bg-surface-sheet rounded-lg border border-border-rule shadow-sheet space-y-2.5 font-mono text-[12px] interactive-card">
                <div className="flex justify-between border-b border-border-rule pb-2">
                  <span className="text-ink-secondary">Executive:</span>
                  <span className="font-bold text-ink-primary">Deb Friar, Founder & CEO</span>
                </div>
                <div className="flex justify-between border-b border-border-rule pb-2">
                  <span className="text-ink-secondary">Education:</span>
                  <span className="font-bold text-ink-primary">BBA & MBA, Univ. of Wisconsin</span>
                </div>
                <div className="flex justify-between border-b border-border-rule pb-2">
                  <span className="text-ink-secondary">AI & Data Mastery:</span>
                  <span className="font-bold text-ink-primary">MIT Professional & AWS Certified</span>
                </div>
                <div className="flex justify-between border-b border-border-rule pb-2">
                  <span className="text-ink-secondary">Advisory Role:</span>
                  <span className="font-bold text-ink-primary">USF Monica Wooden SCM Board</span>
                </div>
                <div className="flex justify-between border-b border-border-rule pb-2">
                  <span className="text-ink-secondary">Enterprise Pedigree:</span>
                  <span className="font-bold text-ink-primary text-right">Target • Pillsbury • Pepsi • Catalina • Welbilt</span>
                </div>
                <div className="pt-1 flex justify-end">
                  <a
                    href="https://www.linkedin.com/in/debrafriar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press text-btn-cta hover:text-btn-ctaHover font-medium inline-flex items-center gap-1.5 text-[11px]"
                  >
                    <span>View Deb Friar on LinkedIn</span>
                    <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* Narrative Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-[28px] sm:text-[34px] font-semibold text-ink-primary tracking-tight">
                The origin story: The $900K fire drill.
              </h2>
              
              <p className="font-sans text-[16px] text-ink-secondary leading-[1.7]">
                Debra Friar is a pioneering AI innovator and supply chain visionary with over two decades of leadership across Consumer Packaged Goods, Marketing Technology, Commercial Equipment, and enterprise SaaS. Throughout her executive career at Target, Pillsbury, Pepsi, Catalina, and Welbilt, she has consistently engineered data-driven decision architectures that automate complex operations and eliminate structural waste.
              </p>

              <p className="font-sans text-[16px] text-ink-secondary leading-[1.7]">
                At a multi-plant commercial foodservice equipment manufacturer, Deb witnessed the daily breakdown firsthand: cross-functional teams burning 40 manual steps across inside sales, logistics, procurement, and finance just to answer a simple distributor inquiry. The company lost 150 basis points of net profit margin annually ($900,000 in avoidable SG&A bleed) to this single bottleneck.
              </p>

              <p className="font-sans text-[16px] text-ink-secondary leading-[1.7]">
                A recognized speaker on artificial intelligence with certifications from MIT Professional and AWS, and an advisory board member of USF&apos;s Monica Wooden Center for Supply Chain Management, Deb built Quant Fusion to solve this permanently. Rather than forcing a disruptive 3-year ERP overhaul, Quant Fusion applies deterministic algorithms and automated exception engines to surface audited promise dates in under 250 milliseconds.
              </p>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="btn-press inline-flex items-center justify-center px-6 py-3.5 bg-btn-cta hover:bg-btn-ctaHover text-white text-[15px] font-medium rounded transition-colors shadow-sm"
                >
                  Schedule a Call with Deb Friar
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Building Blocks */}
      <section className="py-16 md:py-24 border-b border-border-rule bg-surface-sheet">
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal direction="up" blur={true} className="max-w-2xl mb-12">
            <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
              Guiding Principles
            </span>
            <h2 className="font-serif text-[30px] sm:text-[36px] font-semibold text-ink-primary mt-1">
              The Three Building Blocks
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={80} scale={true} blur={true} className="flex">
              <div className="w-full p-6 bg-surface-recessed/60 rounded-lg border border-border-rule space-y-3 interactive-card">
                <span className="font-mono text-[12px] font-bold text-btn-cta">01</span>
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Cross-Industry Vantage
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  Insights forged across CPG, commercial equipment, retail, and SaaSbusting departmental silos with proven cross-functional frameworks.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={180} scale={true} blur={true} className="flex">
              <div className="w-full p-6 bg-surface-recessed/60 rounded-lg border border-border-rule space-y-3 interactive-card">
                <span className="font-mono text-[12px] font-bold text-btn-cta">02</span>
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Advanced AI & Data Mastery
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  Rooted in MIT applied algorithms, Python microservices, and practical machine learning that solves real supply chain bottlenecks.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={280} scale={true} blur={true} className="flex">
              <div className="w-full p-6 bg-surface-recessed/60 rounded-lg border border-border-rule space-y-3 interactive-card">
                <span className="font-mono text-[12px] font-bold text-btn-cta">03</span>
                <h3 className="font-serif text-[20px] font-semibold text-ink-primary">
                  Real-World P&L Accountability
                </h3>
                <p className="font-sans text-[15px] text-ink-secondary leading-relaxed">
                  Every tool is measured on labor savings, avoided chargebacks, and Sarbanes-Oxley audit complianceguaranteed positive ROI in 30 days.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
