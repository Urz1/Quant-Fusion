"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-[#181614] text-[#E2DED6] border-t border-[#2C2723]">
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2C2723]">
          
          {/* Column 1: Institutional Wordmark & Direct Founder Details */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" theme="dark" />

            <p className="font-sans text-[14px] text-[#BAB3A7] leading-relaxed max-w-sm">
              The operational decision layer unifying isolated ERP, 3PL, and warehouse data into single-click verified ship dates without system replacement.
            </p>

            <div className="pt-2 space-y-2 font-mono text-[12px] text-[#BAB3A7]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-btn-cta shrink-0" />
                <span>Tampa, Florida • United States</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-btn-cta shrink-0" />
                <a href="tel:+18137360703" className="hover:text-white transition-colors">
                  Direct: +1 (813) 736-0703
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-btn-cta shrink-0" />
                <a href="mailto:info@quant-fusion.com" className="hover:text-white transition-colors">
                  Inquiries: info@quant-fusion.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Capabilities */}
          <div>
            <span className="font-mono text-[11px] uppercase font-semibold tracking-wider text-[#9E978E]">
              Platform Architecture
            </span>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/features" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  1-Click Ship Date Engine
                </Link>
              </li>
              <li>
                <Link href="/features#pipeline" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  UNIFY: Ingestion Connectors
                </Link>
              </li>
              <li>
                <Link href="/features#algorithms" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  TRANSFORM: Order Routing Logic
                </Link>
              </li>
              <li>
                <Link href="/features" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  SOX 404 Audit Traceability
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Self-Serve Intelligence Tools */}
          <div>
            <span className="font-mono text-[11px] uppercase font-semibold tracking-wider text-[#9E978E]">
              Intelligence Tools
            </span>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/tariff-impact-visibility" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Tariff Exposure Module
                </Link>
              </li>
              <li>
                <Link href="/calculator" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Avoidable SG&A Cost Ledger
                </Link>
              </li>
              <li>
                <Link href="/case-studies" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Field Research & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/pricing" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Transparent Pricing & Tiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Trust */}
          <div>
            <span className="font-mono text-[11px] uppercase font-semibold tracking-wider text-[#9E978E]">
              Governance & Trust
            </span>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <Link href="/privacy-policy" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Privacy Policy (15 Sections)
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Terms of Service & GDPR Annexes
                </Link>
              </li>
              <li>
                <Link href="/about" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Executive Leadership (Deb Friar)
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="text-[#BAB3A7] hover:text-white transition-colors">
                  Schedule Direct Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Integrity Notice & Honest Attestation Status */}
        <div className="pt-6 pb-2 text-[11px] font-mono text-[#8C8478] border-b border-[#2C2723]/60 space-y-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-amber-400 font-semibold uppercase">PROTOTYPE COMPLIANCE STATUS:</span>
            <span>Architecture designed for SOX Section 404 audit logging.</span>
            <span className="text-[#BAB3A7]">[SOC 2 Type II: In Pre-Assessment • Attestations to be verified with CISO]</span>
          </div>
        </div>

        {/* Legal Disclaimer & Verification */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#8C8478]">
          <p>
            © {new Date().getFullYear()} Quant Fusion, LLC. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 font-mono text-[11px] text-[#8C8478]">
            <span>LATENCY TARGET: &lt; 250MS</span>
            <span>CLOUD: GOOGLE CLOUD PLATFORM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
