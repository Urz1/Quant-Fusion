"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    erp: "SAP ECC / S4",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full animate-page-enter">
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="font-mono text-[12px] uppercase tracking-wider text-btn-cta font-bold block">
            Direct Commercial Contact
          </span>
          <h1 className="font-serif text-[40px] sm:text-[48px] font-semibold text-ink-primary mt-2 tracking-tight">
            Schedule a 30-Day Evaluation Pilot.
          </h1>
          <p className="font-sans text-[17px] text-ink-secondary mt-3 max-w-2xl leading-relaxed">
            Connect directly with Quant Fusion’s executive team. We configure a proof-of-value sandbox in under 48 hours using your historical flat-file exports.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 border-b border-border-rule">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Direct Contact Information */}
            <ScrollReveal direction="up" delay={80} scale={true} blur={true} className="lg:col-span-5 space-y-6">
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-8 border border-border-rule shadow-sheet space-y-6 interactive-card">
                <h2 className="font-serif text-[22px] font-semibold text-ink-primary">
                  Executive Headquarters
                </h2>
                
                <div className="space-y-4 text-[15px] font-sans">
                  <div className="flex items-start gap-3.5">
                    <MapPin size={20} className="text-btn-cta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ink-primary block">Quant Fusion, LLC</span>
                      <span className="text-ink-secondary">Tampa, Florida • United States</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone size={20} className="text-btn-cta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ink-primary block">Direct Operations Line</span>
                      <a
                        href="tel:+18137360703"
                        className="text-link-interactive hover:underline font-mono text-[14px]"
                      >
                        +1 (813) 736-0703
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail size={20} className="text-btn-cta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ink-primary block">Pilot Inquiries</span>
                      <a
                        href="mailto:info@quant-fusion.com"
                        className="text-link-interactive hover:underline font-mono text-[14px]"
                      >
                        info@quant-fusion.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-rule font-mono text-[12px] text-ink-muted space-y-1">
                  <p>Executive: Deb Friar (Former Welbilt, Target & PepsiCo)</p>
                  <p>Advisory: USF Monica Wooden Supply Chain Center</p>
                  <p>Response SLA: Under 4 business hours</p>
                </div>
              </div>

              <div className="p-6 bg-surface-recessed/60 rounded-lg border border-border-rule space-y-2 font-mono text-[12px] text-ink-secondary interactive-card">
                <span className="font-bold text-ink-primary block uppercase">30-Day Pilot Guarantee:</span>
                <p>
                  If Quant Fusion does not prove positive labor savings within 30 days of data ingestion, your company owes nothing. No long-term lock-in.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Pilot Request Intake Form */}
            <ScrollReveal direction="up" delay={160} scale={true} blur={true} className="lg:col-span-7">
              <div className="bg-surface-sheet rounded-lg p-6 sm:p-10 border border-border-rule shadow-sheet interactive-card">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <CheckCircle size={48} className="text-btn-cta mx-auto" />
                    <h3 className="font-serif text-[28px] font-semibold text-ink-primary">
                      Pilot Request Received
                    </h3>
                    <p className="font-sans text-[16px] text-ink-secondary max-w-md mx-auto leading-relaxed">
                      Thank you, {formData.firstName}. Deb Friar and our engineering team will review your system specifications and respond within 4 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-serif text-[22px] font-semibold text-ink-primary mb-2">
                      Request Evaluation Sandbox
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                          Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                          placeholder="jdoe@company.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                          placeholder="Acme Manufacturing"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                        Primary ERP / Order System
                      </label>
                      <select
                        value={formData.erp}
                        onChange={(e) => setFormData({ ...formData, erp: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                      >
                        <option value="SAP ECC / S4">SAP (ECC 6.0 / S/4HANA)</option>
                        <option value="Oracle NetSuite">Oracle / NetSuite</option>
                        <option value="Microsoft Dynamics">Microsoft Dynamics 365</option>
                        <option value="Infor / Epicor">Infor / Epicor</option>
                        <option value="Custom / Excel Spreadsheets">Custom Database / Excel Spreadsheets</option>
                        <option value="Other">Other Enterprise System</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[12px] uppercase text-ink-secondary font-medium">
                        Operational Note / Primary Bottleneck
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-surface-recessed rounded border border-border-rule text-[14px] text-ink-primary focus:outline-link-interactive"
                        placeholder="e.g. CSR team spending hours calculating promise dates across 3 plants..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="btn-press w-full inline-flex items-center justify-center py-3.5 bg-btn-cta hover:bg-btn-ctaHover text-white text-[15px] font-medium rounded transition-colors shadow-sm"
                      >
                        Submit Pilot Evaluation Request
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-ink-muted text-center pt-1">
                      Your data is protected under mutual non-disclosure and SOC 2 / GDPR compliance rules.
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </div>
  );
}
