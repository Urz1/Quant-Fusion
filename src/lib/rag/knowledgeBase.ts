/**
 * QUANT FUSION AUDITED DOMAIN KNOWLEDGE CORPUS
 * Comprehensive, verified domain facts and operational metrics for RAG retrieval.
 */

export interface KnowledgeChunk {
  id: string;
  category: "financial_ebitda" | "operational_silos" | "order_scenarios" | "tariff_tradegauge" | "security_governance" | "founder_pedigree" | "pricing_deployment";
  title: string;
  sourceDoc: string;
  sourcePath: string;
  auditRef: string;
  keywords: string[];
  content: string;
}

export const QUANT_FUSION_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // 1. FINANCIAL IMPACT & MARGIN EROSION
  {
    id: "fin-150-bps-waterfall",
    category: "financial_ebitda",
    title: "The 150 Basis Point Margin Bleed Waterfall Analysis",
    sourceDoc: "Quant Fusion Movement 3: The Cost of Spreadsheets",
    sourcePath: "/#hard-truth",
    auditRef: "SEC/SOX Benchmark Model $60M Distribution Baseline",
    keywords: ["150 bps", "basis points", "ebitda", "margin", "waterfall", "profit", "loss", "900000", "420k", "280k", "200k", "firefighting"],
    content: `Quant Fusion benchmark model on a $60M commercial manufacturer/distributor demonstrates a 150 basis point (1.50% / $900,000) silent EBITDA bleed caused by manual spreadsheet order tracking.
Baseline Target Gross Margin: 32.00%.
Actual Realized Margin under Excel firefighting: 30.50%.
Erosion Breakdown:
1. CSR Lookup & Triage Payroll: -0.70% (-$420,000 / year) from customer service and sales engineers spending 12,000 aggregate hours manually querying disconnected ERP and WMS databases.
2. Emergency Expedited Freight: -0.50% (-$280,000 / year) spent on hot-shot courier vans and air freight to salvage promise dates missed due to unannounced carrier railhead dwells.
3. Customer Delivery Chargebacks & OTIF Penalties: -0.30% (-$200,000 / year) from missed On-Time In-Full supplier scorecards and canceled dealer orders.
With Quant Fusion's 1-Click Decision Layer, the full +150 BPS ($900,000 annual net margin) is recovered back to the 32.00% target baseline without replacing underlying ERP systems.`
  },
  {
    id: "fin-labor-waste-calculator",
    category: "financial_ebitda",
    title: "Avoidable SG&A Payroll & Time Waste Formula",
    sourceDoc: "Quant Fusion Avoidable Cost Calculator",
    sourcePath: "/calculator",
    auditRef: "Operational SG&A Audit Matrix [Formula: (Orders * % Chased * Hours * Hourly Rate) + Freight + Penalties]",
    keywords: ["calculator", "labor", "hours", "csr", "payroll", "sga", "formula", "wasted time", "400 hours", "lookup time"],
    content: `Quant Fusion calculates avoidable operational waste using a four-factor formula:
Formula: Annual Avoidable Cost = (Annual Orders × Chased Ratio × Lookup Hours × Loaded Hourly Wage) + Expedited Freight Premiums + OTIF Fines.
Standard Mid-Market Baseline:
- Across customer operations, planners spend 17 to 22 hours per month per employee on repetitive order status inquiries.
- Up to 400 hours are wasted annually per customer service representative, sales engineer, and procurement agent.
- Quant Fusion eliminates 90% of repetitive status inquiries, reducing inquiry turnaround from 4 to 24 hours down to sub-250 milliseconds.`
  },

  // 2. OPERATIONAL SILOS & THE 40-STEP CHAOS
  {
    id: "ops-8-silos-flowchart",
    category: "operational_silos",
    title: "The 8-Department Silos & 40-Step Manual Ping-Pong Reality",
    sourceDoc: "Quant Fusion Operational Flowchart (Welbilt Plant Archive 2021)",
    sourcePath: "/features#flowchart",
    auditRef: "Welbilt Field Artifact 2021 • Discovered by Deb Friar",
    keywords: ["flowchart", "40 steps", "8 departments", "silos", "ping pong", "erp", "wms", "tms", "crm", "mes", "edi 214", "latency"],
    content: `In typical mid-market and enterprise industrial manufacturing, answering the simple customer question "When will my order ship?" spans 8 disconnected software silos and up to 40 manual email/phone handoffs:
1. Sales / Customer Ops: Salesforce CRM / SAP SD (Sales Order Ingestion, manual lookup).
2. Warehouse / 3PL: Manhattan WMS / HighJump (WMS synchronization lag, unlinked pick queues).
3. Sourcing & Procurement: Coupa / SAP MM (Open PO validation, sub-assembly supplier tracking).
4. Logistics & Transportation: MercuryGate TMS / BluJay (Unlinked PDF bills of lading, manual spot checks).
5. Carriers & Drayage: EDI 214 Status Feeds (Port dwell, railhead delays, unnotified demurrage).
6. Factory Assembly Floor: Siemens MES / Rockwell (Production schedule slotting lag, machine downtime).
7. External Tier-1/Tier-2 Suppliers: Vendor Portals & Phone Calls (Component backorders, raw material delays).
8. Corporate Finance: Oracle GL / SAP FICO (Revenue recognition hold, credit checks).
This manual status ping-pong takes 5 to 8 business days and provides 0% audit defense.
Quant Fusion unifies these feeds into an in-memory decision layer that outputs a verified deterministic promise date in < 0.22 seconds.`
  },

  // 3. VERIFIED SCENARIOS & LINE-ITEM DETERMINATION
  {
    id: "scenario-ord-78192-foodservice",
    category: "order_scenarios",
    title: "Order Determination Scenario ORD-78192: Commercial Foodservice Unit CX-900",
    sourceDoc: "Quant Fusion Interactive Console & Case Study #1",
    sourcePath: "/case-studies",
    auditRef: "Foodservice Equipment Manufacturer ($60M Model • Tampa Facility #4)",
    keywords: ["ord-78192", "convection unit", "cx-900", "apex", "foodservice", "tampa", "rail dwell", "chicago"],
    content: `Order Reference: ORD-78192
Customer: Apex Thermal Dynamics
Product: Commercial Convection Unit #CX-900 (Assembly Line #02)
Manufacturing Plant: Tampa Commercial Facility #4
Legacy Manual Guess: Nov 14, 2026 (Customer Service estimated based on static ERP date).
Actual Field Bottleneck: Inbound component railcar container stuck in Chicago railhead dwell (+48 hours).
Quant Fusion Algorithmic Determination: November 17, 2026 at 14:30 EST (Confidence: 99.4%, Query Latency: 0.18s).
Operational Action: 7 disconnected screens bypassed, automated buffer adjustment applied, customer notified proactively without hot-shot freight costs.`
  },
  {
    id: "scenario-po-34018-chemical",
    category: "order_scenarios",
    title: "Order Determination Scenario PO-34018: Specialty Chemical Bulk Railcar",
    sourceDoc: "Quant Fusion Interactive Console & Case Study #2",
    sourcePath: "/case-studies",
    auditRef: "$20B Global Chemical Enterprise (Houston Siding #2)",
    keywords: ["po-34018", "bulk railcar", "chemical", "chemco", "polymer", "pc-400", "telematics", "houston"],
    content: `Order Reference: PO-34018
Customer: ChemCo Industries
Product: Polymer Catalyst #PC-400 (Bulk Liquid Tanker)
Manufacturing Plant: Houston Chemical Complex Siding #2
Legacy Manual Guess: Nov 19, 2026 (48-hour lag while CSR emailed plant rail managers).
Actual Field Bottleneck: Siding manifold pressure inspection delay (+72 hours) and Class I rail carrier switch backlog.
Quant Fusion Algorithmic Determination: November 22, 2026 at 09:15 CST (Confidence: 98.9%, Query Latency: 0.21s).
Operational Action: Real-time GPS telematics fused with SAP batch release; eliminated 60 hours/month of internal email firefighting across regional plants.`
  },
  {
    id: "scenario-ord-91204-machinery",
    category: "order_scenarios",
    title: "Order Determination Scenario ORD-91204: Industrial Machinery Shortage Exception",
    sourceDoc: "Quant Fusion Interactive Console & Case Study #3",
    sourcePath: "/case-studies",
    auditRef: "$120B Industrial Machinery Manufacturer (Cleveland DC #12)",
    keywords: ["ord-91204", "hydraulic pump", "hp-550", "titan", "machinery", "monterrey", "backorder", "cleveland"],
    content: `Order Reference: ORD-91204
Customer: Titan Heavy Machinery
Product: Hydraulic Pump Assembly #HP-550 (High-Bay Staging)
Distribution Facility: Cleveland Distribution Center #12
Legacy Manual Guess: Nov 28, 2026 (Regional team assumed all sub-components were in stock).
Actual Field Bottleneck: Critical Viton high-pressure seal backordered from Tier-2 supplier in Monterrey, Mexico (+6 days).
Quant Fusion Algorithmic Determination: December 04, 2026 at 16:00 EST (Status: Shortage Exception Flagged).
Operational Action: Automatically flagged backorder risk 12 days prior to shipment, triggered inventory re-allocation from secondary Dallas hub, and prevented customer production halt.`
  },

  // 4. TARIFF EXPOSURE & TRADEGAUGE RULES
  {
    id: "tariff-tradegauge-methodology",
    category: "tariff_tradegauge",
    title: "TradeGauge Tariff Impact & Statutory Code Reconciliation",
    sourceDoc: "Quant Fusion TradeGauge Module",
    sourcePath: "/tariff-impact-visibility",
    auditRef: "US Harmonized Tariff Schedule (HTS) • Section 301, 232, & IEEPA Rules",
    keywords: ["tariff", "tradegauge", "section 301", "section 232", "ieepa", "duty", "customs", "hts", "bonded warehouse", "landed cost"],
    content: `Quant Fusion TradeGauge calculates statutory tariff exposures and landed margin impacts across bill-of-materials (BOM):
Key Regulatory Frameworks Monitored:
1. Section 301 Tariffs: China List 1-4 ad valorem duties (7.5% to 25.0%) affecting electronic micro-controllers, forged aluminum brackets, and power supplies.
2. Section 232 Tariffs: National security tariffs on raw steel (25%) and aluminum (10%) affecting chassis frames and structural fabrications.
3. IEEPA & Executive Orders: Emergency economic powers and dynamic country-of-origin cross-border sanctions.
Landed Cost Formula: Landed Margin = Gross Selling Price - (FOB Factory Cost + International Ocean Freight + Harbor Maintenance Fees + [HTS Base Duty + Section 301/232 Surcharge] + Domestic Drayage).
Mitigation Capabilities: Identifies tariff inversion opportunities (importing sub-assemblies vs. finished goods), bonded warehouse duty deferral, and alternative domestic sourcing triggers.`
  },

  // 5. SECURITY & GOVERNANCE ARCHITECTURE
  {
    id: "sec-zero-writeback-sox404",
    category: "security_governance",
    title: "Zero-Writeback Hardware/Protocol Isolation & SOX Section 404 Compliance",
    sourceDoc: "Quant Fusion Security & Governance Architecture",
    sourcePath: "/features#security",
    auditRef: "Sarbanes-Oxley (SOX) Section 404 • SOC 2 Type II Pre-Assessment Controls",
    keywords: ["security", "zero writeback", "read-only", "sox 404", "sarbanes oxley", "audit log", "tls 1.3", "ciso", "tamper evident", "rbac"],
    content: `Quant Fusion is engineered with a strict Zero-Writeback Architecture to guarantee 0% risk of database mutation to client enterprise systems:
1. Read-Only Ingestion Protocols: Connects to SAP ECC/S4, Oracle WMS, and flat-file SFTP repositories strictly through read-only connectors and REST APIs. Quant Fusion physically cannot write, mutate, or corrupt production ERP master records.
2. Cryptographic SOX 404 Audit Logging: Every calculated ship date commitment generates a tamper-evident audit receipt recording the raw data inputs, carrier timestamps, algorithmic rule applied, and user ID. This provides external auditors with 100% defensible revenue recognition trails.
3. Network & Data Isolation: Unidirectional TLS 1.3 data transfer; in-memory deterministic rule evaluation; enterprise Role-Based Access Control (RBAC) ensuring customer service, logistics, and finance view only appropriate permission tiers.`
  },

  // 6. EXECUTIVE PEDIGREE & FOUNDER PROVENANCE
  {
    id: "founder-deb-friar-credentials",
    category: "founder_pedigree",
    title: "Executive Leadership & Founder Pedigree: Deb Friar",
    sourceDoc: "Quant Fusion Leadership & About Page",
    sourcePath: "/about",
    auditRef: "Verified Executive History • https://www.linkedin.com/in/debrafriar/",
    keywords: ["deb friar", "founder", "ceo", "welbilt", "target", "pillsbury", "pepsi", "catalina", "usf", "mit", "aws", "wisconsin mba"],
    content: `Quant Fusion Founder & CEO: Deb (Debra) Friar.
Proven Enterprise Supply Chain & Operations Track Record:
- Over 20 years of executive operational and technology leadership across Fortune 500 and mid-market organizations, including Target, Pillsbury, Pepsi, Catalina Marketing, and Welbilt.
- Former Director of Sales Operations at Welbilt, where she managed commercial foodservice equipment distribution and mapped the original 40-step manual cross-silo fulfillment breakdown.
- Academic & Advisory Roles: Serves on the Advisory Board of the University of South Florida (USF) Monica Wooden Center for Supply Chain Management.
- Technical Credentials: Certifications in Applied AI and Machine Learning from MIT Professional Education and Amazon Web Services (AWS). Holds both a BBA and MBA from the University of Wisconsin.
- Provenance Principle: Built from real operational plant floors, intermodal rail yards, and maritime container terminalsnot academic theory.`
  },

  // 7. PRICING & PROOF-OF-VALUE DEPLOYMENT
  {
    id: "pricing-deployment-pilots",
    category: "pricing_deployment",
    title: "Transparent Commercial Tiers & 30-Day Proof-of-Value Pilot",
    sourceDoc: "Quant Fusion Transparent Pricing & Deployment",
    sourcePath: "/pricing",
    auditRef: "Quant Fusion Commercial Terms & Pilot Agreement",
    keywords: ["pricing", "cost", "pilot", "30-day", "15000", "4500", "12500", "proof of value", "csv ingestion", "deployment"],
    content: `Quant Fusion offers transparent, non-punitive enterprise pricing designed around zero-friction onboarding:
1. 30-Day Proof-of-Value Pilot ($15,000 flat):
   - Ingests everyday historical CSV/Excel exports from client SAP/Oracle ERP and carrier feeds within 48 hours.
   - Calculates exact client baseline SG&A payroll bleed, un-audited chargebacks, and verifies the 150 BPS recovery model on real customer order history.
   - 100% credited toward annual enterprise license upon execution.
2. Mid-Market Enterprise ($4,500 / month):
   - Up to $100M annual revenue operations.
   - 1-Click Ship Date determination, 8-silo unification, automated carrier dwell tracking, and standard SOX 404 audit logging.
3. Global Enterprise ($12,500 / month):
   - Multi-facility, international distribution with TradeGauge statutory tariff monitoring, multi-plant BOM allocation, and dedicated enterprise SLA.`
  }
];
