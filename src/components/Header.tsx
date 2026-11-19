"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronDown, Users } from "lucide-react";
import { Logo } from "@/components/Logo";

export type RoleKey = "operations" | "supplychain" | "finance" | "it";

export interface RoleBrief {
  title: string;
  badge: string;
  summary: string;
  impact: string;
  deliverable: string;
}

export const ROLE_BRIEFS: Record<RoleKey, RoleBrief> = {
  operations: {
    title: "Inside Sales & Customer Operations",
    badge: "22 Hours Saved / Month per CSR",
    summary: "Replaces 7-screen manual system lookups with sub-second verified ship date determinations.",
    impact: "Eliminates cross-department status email chasing and prevents contradictory delivery promises.",
    deliverable: "1-Click Order Console with SOX-compliant audit log.",
  },
  supplychain: {
    title: "Supply Chain & Demand Planning",
    badge: "17 Hours Saved / Month per Planner",
    summary: "Automatically reconciles ocean carrier EDI dwell, customs holds, and vendor component commitments.",
    impact: "Surfaces assembly line component bottlenecks 8 days before line shutdowns occur.",
    deliverable: "Deterministic multi-tier component routing engine.",
  },
  finance: {
    title: "CFO & Finance Operations",
    badge: "150 BPS EBITDA Margin Recovery",
    summary: "Eliminates uncalibrated delivery promises that trigger customer chargebacks and costly air-freight expedites.",
    impact: "Generates tamper-evident timestamp logs to defend against retailer OTIF penalty claims.",
    deliverable: "Avoidable SG&A Cost Diagnostic & Audit Trail.",
  },
  it: {
    title: "IT & Enterprise Architecture",
    badge: "Zero Writeback Risk • Day 1 SFTP",
    summary: "Non-invasive decision layer that runs on flat-file CSVs or read-only REST/RFC connections.",
    impact: "No ERP database schema modifications, no multi-year systems replacement, and zero production write risk.",
    deliverable: "Encrypted in-memory payload pipeline with TLS 1.3.",
  },
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleModal, setActiveRoleModal] = useState<RoleKey | null>(null);
  const pathname = usePathname();

  const navLinks = [
    { label: "The Problem", href: "/#the-problem" },
    { label: "How It Works", href: "/features" },
    { label: "Tariff Exposure", href: "/tariff-impact-visibility" },
    { label: "Cost & Calculator", href: "/calculator" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-canvas-page/95 backdrop-blur-md border-b border-border-rule transition-colors">
        {/* Role-Based Quick Entry Strip */}
        <div className="border-b border-border-rule/60 bg-surface-canvas/60 py-1 px-6 hidden md:block">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between text-[11px] font-mono">
            <span className="text-ink-muted flex items-center gap-1.5">
              <Users size={12} className="text-btn-cta" />
              <span>Tailored Executive View:</span>
            </span>
            <div className="flex items-center gap-4">
              {(
                [
                  { key: "operations", label: "Operations & CSR" },
                  { key: "supplychain", label: "Supply Chain" },
                  { key: "finance", label: "CFO & Finance" },
                  { key: "it", label: "IT & Architecture" },
                ] as const
              ).map((role) => (
                <button
                  key={role.key}
                  onClick={() => setActiveRoleModal(activeRoleModal === role.key ? null : role.key)}
                  className={`hover:text-ink-primary transition-colors inline-flex items-center gap-1 ${
                    activeRoleModal === role.key
                      ? "text-btn-cta font-bold underline underline-offset-2"
                      : "text-ink-secondary"
                  }`}
                >
                  <span>{role.label}</span>
                  <ChevronDown size={11} className={activeRoleModal === role.key ? "rotate-180" : ""} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-[1280px] mx-auto h-[62px] px-6 flex items-center justify-between">
          {/* Brand Mark & Wordmark */}
          <Logo variant="full" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] xl:text-[14px] whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`relative py-1 font-sans whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-ink-primary font-medium"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-ink-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA and Actions */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/pricing"
              prefetch={true}
              className="inline-flex items-center justify-center px-4 py-2 bg-btn-cta hover:bg-btn-ctaHover text-white text-[14px] font-medium rounded transition-colors shadow-sm whitespace-nowrap"
            >
              Request 30-Day Pilot
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ink-primary hover:text-ink-secondary"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Role Briefing Popover */}
        {activeRoleModal && (
          <div className="border-t border-border-rule bg-surface-sheet px-6 py-4 shadow-lg transition-all animate-in fade-in slide-in-from-top-1">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-btn-cta uppercase tracking-wider">
                    Executive Briefing: {ROLE_BRIEFS[activeRoleModal].title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-recessed border border-border-rule font-mono text-[10px] text-ink-primary font-semibold">
                    {ROLE_BRIEFS[activeRoleModal].badge}
                  </span>
                </div>
                <p className="font-sans text-[14px] text-ink-primary max-w-3xl leading-snug">
                  {ROLE_BRIEFS[activeRoleModal].summary} {ROLE_BRIEFS[activeRoleModal].impact}
                </p>
                <div className="font-mono text-[11px] text-ink-muted">
                  Primary Capability: {ROLE_BRIEFS[activeRoleModal].deliverable}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-3.5 py-1.5 bg-btn-cta text-white font-mono text-[12px] font-medium rounded hover:bg-btn-ctaHover"
                >
                  Schedule Role Audit
                </Link>
                <button
                  onClick={() => setActiveRoleModal(null)}
                  className="px-2.5 py-1 text-ink-muted hover:text-ink-primary font-mono text-[12px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-canvas-page border-b border-border-rule px-6 py-6 shadow-sheet">
            <div className="pb-3 mb-3 border-b border-border-rule text-[12px] font-mono text-ink-muted">
              Select Role Briefing:
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(
                  [
                    { key: "operations", label: "Operations" },
                    { key: "supplychain", label: "Supply Chain" },
                    { key: "finance", label: "Finance (CFO)" },
                    { key: "it", label: "IT / Tech" },
                  ] as const
                ).map((role) => (
                  <button
                    key={role.key}
                    onClick={() => {
                      setActiveRoleModal(role.key);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 bg-surface-sheet rounded border border-border-rule text-left text-[11px] text-ink-primary"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col gap-3 text-[15px]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-ink-primary font-medium border-b border-border-rule/60 flex items-center justify-between"
                >
                  {link.label}
                  <ArrowUpRight size={15} className="text-ink-muted" />
                </Link>
              ))}

              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full text-center py-2.5 bg-btn-cta text-white font-medium rounded text-[14px]"
              >
                Request 30-Day Pilot
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
