import React from "react";

export const metadata = {
  title: "Privacy Policy | Quant Fusion",
  description: "Comprehensive 15-section privacy policy governing customer data, security controls, and compliance under GDPR and CCPA.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full py-16 md:py-20">
      <div className="max-w-[860px] mx-auto px-6">
        <span className="font-mono text-[12px] uppercase tracking-wider text-ink-muted block">
          Data Protection & Privacy
        </span>
        <h1 className="font-serif text-[38px] sm:text-[44px] font-semibold text-ink-primary mt-2 tracking-tight">
          Privacy Policy
        </h1>
        <p className="font-mono text-[13px] text-ink-muted mt-2 pb-8 border-b border-border-rule">
          Effective Date: June 1, 2026 • Quant Fusion, LLC (Tampa, FL, USA)
        </p>

        <div className="mt-8 space-y-8 text-[15px] font-sans text-ink-secondary leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">1. Introduction</h2>
            <p>
              Quant Fusion, LLC (“Quant Fusion”, “we”, “our”, or “us”) respects your privacy and is committed to protecting the data of our enterprise customers, website visitors, and authorized users. This Privacy Policy explains our practices regarding the collection, use, disclosure, and protection of information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">2. Information We Collect</h2>
            <p>
              We collect information you provide directly through our platform, including business contact details (name, corporate email, phone number, company name), user account credentials, and operational datasets (such as order numbers, HTS codes, component schedules, and carrier identifiers) uploaded to the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">3. How We Use Information</h2>
            <p>
              We process information to deliver, maintain, and optimize the 1-Click Ship Date Engine, model TradeGauge™ tariff projections, perform customer support, and maintain audit trails required under Sarbanes-Oxley (SOX) Section 404. We do not sell or monetize personal data under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">4. Data Security Controls</h2>
            <p>
              Quant Fusion implements administrative, physical, and technical safeguards engineered to protect enterprise data, including end-to-end TLS 1.3 transport encryption, AES-256 rest encryption on Google Cloud Platform, role-based access control (RBAC), and automated threat monitoring.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">5. Data Retention & Deletion</h2>
            <p>
              Operational order datasets are retained during the active subscription period and securely purged within sixty (60) days following account termination, unless retention is mandated by applicable legal or statutory obligations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">6. Your Rights (GDPR & CCPA/CPRA)</h2>
            <p>
              Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of your personal data, or to restrict or object to certain processing activities. Requests may be submitted directly to <a href="mailto:info@quant-fusion.com" className="text-link-interactive hover:underline">info@quant-fusion.com</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-[20px] font-semibold text-ink-primary">7. Contact Information</h2>
            <p>
              For questions regarding this policy or our data protection measures, contact:  
              <br />
              <strong>Quant Fusion, LLC</strong>  
              <br />
              Email: info@quant-fusion.com • Phone: +1 (813) 736-0703  
              <br />
              Tampa, Florida, United States
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
