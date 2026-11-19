# Quant-Fusion

> **Enterprise Operations Decision Layer for Fragmented Supply Chains**  
> Unifying ERPs, carrier telematics, and production schedules into sub-second verified ship dates with Sarbanes-Oxley audit compliance.

---

## 🧭 Executive Overview

At mid-market and enterprise manufacturers ($50M–$100B in revenue), cross-functional teams waste **40 manual steps across 8 disconnected data silos** (Inside Sales, Logistics, Procurement, Production Planning, Finance, IT, and 3PLs) just to answer one customer question: *"When will my order ship?"*

This operational fragmentation silently bleeds **150 basis points of net profit margin** ($900,000 annually at a $60M manufacturer) through avoidable SG&A payroll waste, expedited air freight, and retailer OTIF chargebacks.

**Quant Fusion** solves this permanently as a lightweight, non-invasive decision layer. By applying deterministic routing algorithms and automated exception engines, Quant Fusion reconciles inbound carrier EDI, port customs dwell, vendor POs, and factory bill-of-materials (BOM) components into audited promise dates in under **250 milliseconds**with **zero ERP writeback risk**.

---

## ⚡ Key Capabilities

### 1. Interactive 1-Click Order Console Cockpit
- **Deterministic Date Recalculation:** Instantly evaluates assembly dependencies against real-world disruption events (ocean customs holds, factory shutdowns, component delays).
- **Audit-Stamped Assurance:** Generates immutable timestamped decision briefs defending against customer chargebacks and OTIF penalties.
- **Scenario Replay Engine:** Test and simulate order exceptions with preloaded commercial industrial equipment scenarios.

### 2. Avoidable Costs Ledger Diagnostic Tool
- **Audited Financial Benchmark:** Grounded in qualitative interviews across 120 North American manufacturing leaders.
- **Dynamic SG&A Payroll Calculator:** Computes wasted annual hours and dollar loss across 6 commercial departments with instant SVG visualization and board-ready export briefs.

### 3. TradeGauge™ 3D Interactive Cartographic Engine
- **Spherical Orthographic Projection:** High-performance vector 3D globe with 60fps drag rotation, inertia physics, and dual-mode Flat Map toggle.
- **Live USITC HTS Sourcing Simulator:** Simulates statutory duty exposures across Vietnam, China, Taiwan, Germany, Mexico, India, and Japan.
- **Active In-Transit Vessel Telematics:** Real-time tracking of container shipments against statutory enforcement windows to prevent demurrage penalties.

### 4. Non-Invasive Enterprise Integration
- **Zero Production Write Risk:** Connects via secure flat-file CSVs, read-only SFTP pipelines, or TLS 1.3 REST/RFC connectors without database migrations or multi-year ERP replacements.
- **Enterprise Security Enclave:** Encrypted in-memory payload pipeline with SOX 404 audit logging and SOC 2 Type II compliance framework.

### 5. Supply Chain AI Decision Copilot (RAG)
- **Domain-Specific Knowledge Base:** Embedded retrieval augmented generation (RAG) powered by Groq Llama-3 microservices for real-time logistics troubleshooting.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19 Server & Client Components)
- **Language:** TypeScript 7
- **Styling:** Tailwind CSS, Custom Architectural Parchment Design System
- **Cartography & 3D:** D3 Geo (`d3-geo`, `topojson-client`, `world-atlas`), Mathematical Orthographic Projections
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI/LLM:** Groq API (`llama-3.3-70b-versatile`)
- **Performance:** Sharp (WebP compression), CSS Hardware Acceleration, Sub-160ms Client Navigation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Urz1/Quant-Fusion.git
cd Quant-Fusion

# Install dependencies
npm install

# Configure environment variables (optional for AI Copilot)
cp .env.example .env.local
```

### Running Locally

```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm run start -p 3005
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 🏛️ Project Structure

```
├── public/
│   ├── assets/              # Compressed WebP photography, brand assets, and schematics
│   ├── icon.svg             # Vector brand icon (Convergence Crucible)
│   └── site.webmanifest     # PWA and browser manifest
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/           # Executive leadership & founder story
│   │   ├── api/rag/chat/    # AI Decision Copilot streaming API
│   │   ├── blog/            # Supply chain strategy briefings
│   │   ├── calculator/      # Avoidable Costs Ledger diagnostic tool
│   │   ├── case-studies/    # Field-verified plant case studies
│   │   ├── contact/         # Commercial pilot scheduling
│   │   ├── features/        # Platform architecture & 40-step blueprint
│   │   ├── pricing/         # Commercial tiers & transparent license pricing
│   │   ├── tariff-impact-visibility/ # TradeGauge™ 3D globe & tariff simulator
│   │   ├── globals.css      # Architectural parchment theme & animation physics
│   │   └── layout.tsx       # Root layout, fonts, and metadata
│   ├── components/          # Reusable enterprise UI components
│   │   ├── ComparisonLedger.tsx
│   │   ├── DecisionCopilot.tsx
│   │   ├── Header.tsx       # Sticky navbar with role-based quick entry strip
│   │   ├── HeroConsole.tsx  # 1-Click Order Console Cockpit
│   │   ├── LedgerCalculator.tsx
│   │   ├── Logo.tsx         # Responsive vector Convergence Crucible mark
│   │   ├── OperationalFlowchart.tsx # 40-step multi-silo blueprint
│   │   └── TradeGaugeGlobe.tsx      # 3D Orthographic cartographic engine
│   └── lib/                 # Utilities, Knowledge Graph, BM25, and RAG retrieval
│       └── rag/             # GraphRAG engine, intent classification, and knowledge base
├── eval/                    # RAG evaluation harness, golden dataset, and metrics
│   ├── dataset.json         # 50 golden test cases (easy, multi-hop, exploratory, out-of-scope)
│   ├── evaluate.ts          # Automated evaluation runner for retrieval & generation safety
│   ├── baseline.json        # Pre-refactor evaluation metrics
│   └── final_report.json    # Post-refactor evaluation metrics with 100% refusal rate
└── DESIGN_SYSTEM.md         # Comprehensive paper-and-ink design specifications
```

---

## 🧠 Enterprise GraphRAG Architecture

The Quant Fusion Copilot implements a multi-tier **Hybrid Retrieval-Augmented Generation with an In-Memory Knowledge Graph** to provide deterministic supply chain answers while strictly refusing out-of-domain inquiries:

1. **Intent Classification & Guardrails:** Query pre-filtering via [intentClassifier.ts](file:///home/sadam/Development/Quant_Fusion/src/lib/rag/intentClassifier.ts) detects non-supply chain and general queries (trivia, historical figures, recipes, programming, politics), enforcing an immediate, zero-tolerance refusal with **zero false citations**.
2. **Knowledge Graph Subgraph Traversal:** Relational entities (Orders $\leftrightarrow$ Bottlenecks $\leftrightarrow$ Facilities $\leftrightarrow$ Tariffs $\leftrightarrow$ Leadership) in [knowledgeGraph.ts](file:///home/sadam/Development/Quant_Fusion/src/lib/rag/knowledgeGraph.ts) extract multi-hop relational context triples (e.g. `(ORD-78192) -[ROUTES_THROUGH]-> (Chicago Railhead Dwell +48h)`).
3. **Hybrid BM25 + Vector Retrieval:** Lexical matching with domain synonym expansion and metadata boost in [bm25.ts](file:///home/sadam/Development/Quant_Fusion/src/lib/rag/bm25.ts) and [retrieval.ts](file:///home/sadam/Development/Quant_Fusion/src/lib/rag/retrieval.ts).
4. **Deterministic Audited Generation:** Prompt engineering in [route.ts](file:///home/sadam/Development/Quant_Fusion/src/app/api/rag/chat/route.ts) with zero-hallucination constraints and offline fallback.

### Running RAG Evaluations

```bash
# Run the automated 50-query golden dataset evaluation
npx tsx eval/evaluate.ts final_report.json
```

---

## 📜 Leadership & Proven Pedigree

Founded by **Deb Friar**, former executive at **Target, Pillsbury, PepsiCo, and Welbilt**. Certified in Applied AI by MIT Professional and AWS, and an advisory board member of USF's Monica Wooden Center for Supply Chain Management.

---

## 📄 License

Proprietary enterprise software prototype. All rights reserved.
