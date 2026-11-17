import React from "react";

export const metadata = {
  title: "Terms of Service & Data Processing Annexes | Quant Fusion",
  description: "Master Subscription Agreement and GDPR Standard Contractual Clauses (Module Two) for enterprise customers of Quant Fusion, LLC.",
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full py-16 md:py-20">
      <div className="max-w-[860px] mx-auto px-6">
        <span className="font-mono text-[12px] uppercase tracking-wider text-ink-muted block">
          Legal Agreement
        </span>
        <h1 className="font-serif text-[38px] sm:text-[44px] font-semibold text-ink-primary mt-2 tracking-tight">
          Master Terms of Service & GDPR Annexes
        </h1>
        <p className="font-mono text-[13px] text-ink-muted mt-2 pb-8 border-b border-border-rule">
          Last Updated: June 1, 2026 • Quant Fusion, LLC (Tampa, FL, USA)
        </p>

        <div className="mt-8 space-y-8 text-[15px] font-sans text-ink-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">1. Subscription Services & Scope</h2>
            <p>
              Quant Fusion, LLC (“Quant Fusion”, “we”, “our”, or “us”) provides access to its cloud-based operational decision layer, including the 1-Click Ship Date Determination Engine, TradeGauge™ Tariff Intelligence module, and Avoidable Cost Analytics (collectively, the “Service”). Access is provided on a subscription basis subject to the terms of the applicable Order Form and these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">2. Customer Data & Intellectual Property</h2>
            <p>
              Customer retains all right, title, and interest in and to all data, flat files, ERP records, and transaction logs submitted to the Service (“Customer Data”). Customer grants Quant Fusion a limited, non-exclusive license to process Customer Data solely to provide, maintain, and execute the Service. Quant Fusion does not sell, commercialize, or use Customer Data to train foundation models for other commercial entities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">3. Sarbanes-Oxley (SOX) & Audit Logging</h2>
            <p>
              Quant Fusion maintains continuous, immutable audit logging for all automated order determinations, algorithmic rule executions, and data ingestion events. Audit logs are preserved throughout the active subscription term and for sixty (60) days following termination to support Customer’s internal controls and compliance audits under Section 404 of the Sarbanes-Oxley Act.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">4. 30-Day Proof-of-Value Pilot Guarantee</h2>
            <p>
              For qualifying evaluation pilots executed under a Pilot Agreement, Customer may terminate the evaluation at any time during the first thirty (30) days from initial data ingestion without penalty if the Service does not demonstrate positive labor savings or operational determination accuracy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">5. GDPR Standard Contractual Clauses (Annexes I, II, III)</h2>
            <p>
              To the extent the processing of Customer Data involves transfers of personal data originating from the European Economic Area (EEA), the European Commission Standard Contractual Clauses (Module Two: Controller-to-Processor) are hereby incorporated by reference:
            </p>
            <div className="p-4 bg-surface-sheet rounded border border-border-rule font-mono text-[12px] space-y-2 text-ink-primary">
              <p><strong>Annex I:</strong> Data Exporter is Customer; Data Importer is Quant Fusion, LLC (Tampa, FL, USA).</p>
              <p><strong>Categories of Data Subjects:</strong> Customer employees, contractors, commercial dealers, and carrier contacts.</p>
              <p><strong>Annex II:</strong> Technical and organizational security measures including TLS 1.3 encryption in transit, AES-256 encryption at rest, automated vulnerability scanning, and multi-factor authentication (MFA).</p>
              <p><strong>Annex III:</strong> Sub-processor list (Google Cloud Platform, authentication services, error logging infrastructure).</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-[22px] font-semibold text-ink-primary">6. Contact & Legal Inquiries</h2>
            <p>
              For legal notices or questions regarding these Terms, contact:  
              <br />
              <strong>Quant Fusion, LLC</strong>  
              <br />
              Email: <a href="mailto:info@quant-fusion.com" className="text-link-interactive hover:underline">info@quant-fusion.com</a>  
              <br />
              Telephone: +1 (813) 736-0703  
              <br />
              Tampa, Florida, United States
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
