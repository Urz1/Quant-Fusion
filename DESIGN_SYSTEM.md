# Quant Fusion  Master Design System & Architectural Specification

**Version:** 5.0.0 (Production Engineering & Editorial Standard)  
**Target Audience:** CFOs, VPs of Supply Chain, Heads of Operations, Logistics Directors ($50M–$100B Manufacturers & Distributors)  
**Visual Identity:** The Executive Brief & Shipping Manifest Ledger  
**Document Status:** Complete & Locked for Next.js Build  

---

## 1. Design Philosophy: Grounded in Physical Commerce

Quant Fusion’s buyers run manufacturing plants, distribution warehouses, and global supply chains. They spend their working days in:
* **Dense, light-colored ERP environments** (SAP ECC, Oracle NetSuite, Manhattan WMS).
* **High-contrast spreadsheets and financial models.**
* **Printed physical paperwork:** Bills of Lading (BOL), purchase orders, packing manifests, customs declarations, and executive board decks.

This design system avoids the "developer-tool" template (dark navy canvas, 1px hairlines around every box, 11px uppercase monospace tags, and glowing blue blobs). Instead, it establishes an **authoritative, paper-grounded editorial experience** that communicates the rigor of an SEC filing or an audited customs declaration.

---

## 2. Color Architecture & Tokens

Every color is custom-mixed to provide clear visual separation between the paper canvas, floating document sheets, primary typography, and actionable buttons.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   QUANT FUSION COLOR SYSTEM                                     │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────┤
│    PAGE CANVAS (PARCHMENT)    │     DOCUMENT SHEET (SURFACE)  │        CARBON OBSIDIAN INK      │
│  #ECE8DF (Warm textured paper)│   #FFFFFF (Pure floating sheet)│  #1A1714 (Primary text, 14:1)  │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│    PRIMARY CTA BUTTON         │     INTERACTIVE / LINK BLUE   │        CUSTOMS / DARK SLATE     │
│  #0F663E (Distinct Forest)    │   #164E87 (Maritime Prussian) │   #0F172A (Section 5 Midpoint)  │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│    RECESSED LEDGER TRAY       │     EDITORIAL SECONDARY INK   │        AUDIT FRICTION CRIMSON   │
│  #DFDACF (Form field wash)    │   #4A463F (Body text, 6.9:1)  │   #8A1C14 (Loss / delay metrics)│
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```

### 2.1 Concrete Token Specifications

* **`--color-canvas-page`**: `#ECE8DF` (RGB: 236, 232, 223)  
  *Role:* Master page background. A warm parchment tone.
* **`--color-surface-sheet`**: `#FFFFFF` (RGB: 255, 255, 255)  
  *Role:* The floating document surface. Elevated from the canvas via a subtle, natural physical paper shadow:  
  `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 24px -8px rgba(26, 23, 20, 0.05);`  
  *(Ensures the sheet remains clearly distinct even on dim laptop screens or in bright ambient light without needing a wireframe border).*
* **`--color-surface-recessed`**: `#DFDACF` (RGB: 223, 218, 207)  
  *Role:* Recessed input trays, calculator field cells, and table headers.
* **`--color-border-rule`**: `#D5D0C5` (RGB: 213, 208, 197)  
  *Role:* Subtle horizontal ledger rules and accounting divider lines.
* **`--color-ink-primary`**: `#1A1714` (RGB: 26, 23, 20)  
  *Role:* Primary carbon text. Measured contrast against canvas: **14.2 : 1 (AAA Pass)**.
* **`--color-ink-secondary`**: `#4A463F` (RGB: 74, 70, 63)  
  *Role:* Secondary body text and analytical descriptions. Measured contrast: **6.9 : 1 (AA Pass)**.
* **`--color-ink-muted`**: `#6B665C` (RGB: 107, 102, 92)  
  *Role:* Timestamp metadata and table header captions. Measured contrast: **4.8 : 1 (AA Pass)**.
* **`--color-button-cta`**: `#0F663E` (RGB: 15, 102, 62) | Hover: `#0A4F30`  
  *Role:* Primary CTA button. Clearly lighter and more saturated than the dark ink, ensuring the primary conversion action is immediately noticeable on the page. Text on button: `#FFFFFF`.
* **`--color-link-interactive`**: `#164E87` (RGB: 22, 78, 135) | Hover: `#0E3A66`  
  *Role:* Hyperlinks, active tab indicators, and focus rings (`outline: 2px solid #164E87; outline-offset: 2px`).
* **`--color-stamp-ink`**: `#0D4E30` (RGB: 13, 78, 48)  
  *Role:* Archival green ink used specifically for the verified rubber stamp.
* **`--color-friction-crimson`**: `#8A1C14` (RGB: 138, 28, 20) | Wash: `#F7DFDE`  
  *Role:* Highlights spreadsheet errors, the 40-step friction, and 150 basis point loss figures.
* **`--color-canvas-slate`**: `#0F172A` (RGB: 15, 23, 42)  
  *Role:* **Section 5 Midpoint Anchor.** A single, deliberate dark maritime contrast section for TradeGauge™ Tariff Intelligence, giving the homepage visual pacing and breaking up the parchment.

### 2.4 Brand Mark & Logo Architecture

#### Original Asset Discovery
* **Original Wordmark:** Extracted directly from `quant-fusion.com` production Wix CDN: all-caps classical roman serif `QUANT FUSION` in muted slate grey (`#727272`) preceded by a vertical line and tagged with the obsolete mathematical formula `q(f)=free your data`.
* **Original Favicon / App Icon:** A low-resolution circular bitmap enclosing thin unweighted serif letters `QF`.
* **Diagnosis:** The original assets lacked contrast against warm parchment (`#ECE8DF`) and were illegible at small favicon resolutions (16px/32px). Furthermore, the tagline `q(f)=free your data` reflected the company's early generic data migration thesis rather than its validated enterprise position as the **Operations Decision Layer**.

#### The Modernized Vector Identity: "The Convergence Crucible"
* **Mark Geometry:** An isometric hexagonal plane (echoing the Hero exploded BOM technical drawing) forming a stylized letter **Q**.
* **The Fusion Node:** Two vector flow lines entering from opposite horizons (ERP & carrier telematics) fuse into a sharp emerald decision node (`#0F663E` / `#48C78E`), symbolizing disparate supply chain variables converging into a single verified ship date.
* **Typographic Wordmark:** Hand-kerning in Newsreader serif paired with an IBM Plex Mono uppercase subtitle: `OPERATIONS DECISION LAYER`.
* **Component Implementation:** [`Logo.tsx`](file:///home/sadam/Development/Quant_Fusion/src/components/Logo.tsx) supporting `variant` (`"full"`, `"icon"`, `"compact"`, `"stacked"`) and `theme` (`"light"`, `"dark"`).
* **Generated Asset Suite:**
  - Scalable vector icon: [`public/icon.svg`](file:///home/sadam/Development/Quant_Fusion/public/icon.svg)
  - Multi-scale favicon: [`public/favicon.ico`](file:///home/sadam/Development/Quant_Fusion/public/favicon.ico) & [`public/favicon-32x32.png`](file:///home/sadam/Development/Quant_Fusion/public/favicon-32x32.png)
  - Apple touch icon: [`public/apple-touch-icon.png`](file:///home/sadam/Development/Quant_Fusion/public/apple-touch-icon.png) (180x180)
  - PWA manifest icons: [`public/icon-192.png`](file:///home/sadam/Development/Quant_Fusion/public/icon-192.png) & [`public/icon-512.png`](file:///home/sadam/Development/Quant_Fusion/public/icon-512.png)
  - Web manifest: [`public/site.webmanifest`](file:///home/sadam/Development/Quant_Fusion/public/site.webmanifest)

---

## 3. Typography: Tone & Pairing

We align the headline tone with the typeface: authoritative, direct, and free of casual slang.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    THE TYPOGRAPHIC STANDARD                                     │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────────┤
│    HEADINGS & MAJOR TITLES    │       BODY & INTERFACE        │        DATA & NUMBERS ONLY      │
│  Newsreader                   │   Inter                       │   IBM Plex Mono                 │
│  Authoritative editorial serif│   Spacious 16px–17px, line 1.65│  Tabular numerals for POs, $   │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```

1. **Headings: `Newsreader` (Google Fonts, Optical Sizing `opsz`)**
   - High-contrast, sharp editorial serif that carries the weight of a formal audit or financial publication.
   - Normal letter-spacing (no squished negative tracking).
   - **Tone Rule:** Headlines use formal, executive language:  
     *Do:* *"Forty manual steps across eight departments. Or one click."*  
     *Don't:* *"Ditch the 40-step fire drill."*
2. **Body: `Inter`**
   - Clean, neutral workhorse.
   - Standard body text is **16px–17px** with **1.65 line-height** for effortless long-form readability.
3. **Operational Data: `IBM Plex Mono`**
   - Restricted *strictly* to real-world identifiers: PO numbers (`ORD-88194`), HTS customs codes (`8504.40.95`), dollar figures (`$900,000/yr`), and department hours (`22 hrs/mo`).
   - CSS rule enforced: `font-variant-numeric: tabular-nums;`.

### 3.1 Type Scale

| Element | Font | Size | Line Height | Weight | Purpose |
|:---|:---|:---:|:---:|:---:|:---|
| **Display Hero** | Serif | 52px / 3.25rem | 1.15 | 600 (Semibold) | Homepage Main Headline |
| **Section Title** | Serif | 34px / 2.125rem| 1.25 | 600 (Semibold) | Major Section Headers |
| **Mega Stat Callout** | Serif | 76px / 4.75rem | 1.00 | 700 (Bold) | "150 BPS", "40 Steps" |
| **Subsection Title** | Serif | 22px / 1.375rem| 1.35 | 600 (Semibold) | Ledger & Card Headers |
| **Body Lead** | Sans | 18px / 1.125rem| 1.60 | 400 (Regular) | Executive Intro Paragraphs |
| **Body Regular** | Sans | 16px / 1.0rem  | 1.65 | 400 (Regular) | Main Narrative Text |
| **Operational Mono** | Mono | 14px / 0.875rem| 1.40 | 500 (Medium) | POs, HTS Codes, Timestamps |
| **Form Entry Label** | Sans | 13px / 0.8125rem|1.20 | 600 (Semibold) | Form field labels |

---

## 4. The Signature Brand Element: The Inked Audit Stamp

Rather than using brackets like `[ SOX AUDIT VERIFIED ]` as a decorative tag in every row, the redesign features a **single, authentic physical stamp** placed prominently in the Hero Section.

* **Visual & Technical Execution:**
  - **No Stars:** Removed `★` characters (which look military/patriotic). Uses crisp compliance typography.
  - **Intentional Tilt:** Rotated at **`-4.5deg`** (an intentional physical stamp angle, not a 1.5° layout mistake).
  - **Double-Line Frame:** Thick outer border (`2.5px solid #0D4E30`) with a thin inner rule (`1px solid #0D4E30`) separated by 2px whitespace.
  - **Inked Roughen Texture:** Rendered via an inline SVG filter (`feTurbulence` + `feDisplacementMap`) that gives the border and typography the authentic uneven ink bleed of a rubber stamp on bond paper.
  - **Placement:** Overlaps the **top-right corner** of the order verification document slip (resting partly on the parchment and partly on the white sheet), anchoring the confirmed ship date without covering line-item data.
  - **Stamp Copy:**
    ```
    ┌──────────────────────────────────────────────┐
    │  QUANT FUSION  AUDIT VERIFIED               │
    │  SOX 404 TRACEABLE • SHIP DATE CONFIRMED     │
    └──────────────────────────────────────────────┘
    ```

---

## 5. Homepage Architecture: 8 Distinct Movements

The homepage flows through 8 varied movements with distinct shapes, textures, and visual weights:

```
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 1: THE EXECUTIVE HERO (Parchment Canvas #ECE8DF)                                       |
| Left Column (50%):                               Right Column (50%):                            |
| - Editorial Headline (Newsreader Serif 52px):     - The White Document Sheet (#FFFFFF):         |
|   "Forty manual steps across eight departments.    A clean, stacked Shipping Order Slip         |
|    Or one click."                                  showing real order query data, line items,   |
| - Subheadline (Inter 18px, line-height 1.60):      and the single authentic inked rubber stamp  |
|   "Quant Fusion connects your isolated ERP, 3PL,   overlapping the top-right corner:            |
|    and carrier data into a single verified ship    [ QUANT FUSION  AUDIT VERIFIED ]            |
|    datewithout replacing existing systems."                                                    |
| - Primary Action: [ Request a 30-Day Pilot ]                                                    |
|   (Distinct Forest Green #0F663E button, 16px)                                                  |
| - Subtext: "Runs on your existing flat-files & CSVs on Day One. Zero IT overhaul."               |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 2: THE 120-INTERVIEW FIELD TRANSCRIPTS (Operational Research Findings)                 |
| Factual findings from Deb Friar's 120-executive industry study (no fake log numbers):           |
| • $7B Commercial Distributor (Customer Operations):                                             |
|   "Our CSR team enters data across 7 screens then guesses at ship dates."                       |
| • $20B Chemical Enterprise (Supply Chain Operations):                                           |
|   "If SAP goes down, we survive. If Excel goes down, we're out of business."                    |
| • $120B Industrial Machinery Co. (Reporting & Forecasting):                                     |
|   "Fragmented systems mean hours wasted entering data in Excel for customer reports."           |
| • Multi-Billion Entertainment Co. (Production Lot Logistics):                                  |
|   "Supply chain operations relies on Excel and dozens of emails to manage every production lot."|
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 3: THE HARD TRUTH (Single Mega-Stat Callout)                                           |
| Wide whitespace on warm parchment. A single massive number:                                     |
|                                         150 BPS                                                 |
| "The silent profit margin CFOs lose to spreadsheet firefighting, chargebacks, and order delays."|
| Measured across 12,000 annual hours of manual order-chasing at a single $60M distributor.      |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 4: ATTRIBUTE-PAIRED COMPARATIVE LEDGER (Scannable Audit Table)                         |
| A clean, attribute-by-attribute accounting ledger (NOT two disconnected bullet lists):          |
| ──────────────────────────────┬───────────────────────────────┬──────────────────────────────── |
| OPERATIONAL ATTRIBUTE         │ LEGACY EXCEL WORKFLOW         │ QUANT FUSION DECISION LAYER     |
| ──────────────────────────────┼───────────────────────────────┼──────────────────────────────── │
| Data Ingestion                │ 7 to 12 isolated CSVs & emails│ Continuous automated ERP/3PL sync|
| Ship Date Calculation         │ Manual guesswork across tabs  │ Algorithmic rules engine (1-Click|
| Audit & Compliance            │ Unaudited SOX liability risk  │ 100% Traceable SOX audit log    |
| Operational Labor Burn        │ 12,000 hours / year per plant │ 90% reduction in firefighting   |
| Order Status Response Time    │ 4 to 24 hours (cross-dept)    │ Sub-second verified query       |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 5: TRADEGAUGE™ TARIFF INTELLIGENCE (The Dark Slate Midpoint #0F172A)                   |
| A single, deliberate dark maritime contrast section resembling an international customs ledger: |
| - Headline: "You Cannot Outsmart Tariffs with an Outdated Spreadsheet."                         |
| - Typeset HTS Customs Table (No fuzzy screenshots):                                             |
|   HTS Code 8504.40 (Power Supplies): China Section 301 (25% Duty) vs. Vietnam Alternative (0%) |
|   HTS Code 7308.90 (Fabricated Steel): Reciprocal Tariff Shift +15%                             |
|   Financial Impact: $125,000 duty liability delta on a $500,000 shipment.                       |
| - Citation: Source: U.S. International Trade Commission & Federal Register Schedules.          |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 6: OPERATIONAL PEDIGREE (The Welbilt & Deb Friar Origin Story)                         |
| Real operational credibility. Deb Friar’s career leading sales & ops at Welbilt, Target, Pepsi. |
| The real origin story: watching a $900K annual fire drill at a foodservice equipment maker.     |
| Features real_founder_deb_friar.jpg + MIT Applied Data Science credential.                      |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 7: THE AVOIDABLE COST LEDGER CALCULATOR (Typeable Form Inputs)                         |
| Structured like an accounting ledger (NO web sliders):                                          |
| Number input boxes for Inside Sales (22h), Logistics (17h), Supply Chain (13h), Ops (9h), etc.  |
| Real-time calculation: Annualized SG&A waste ($) + Days to Full Payback (< 60 Days).            |
| Action: [ Export Executive CFO Brief ]                                                          |
+-------------------------------------------------------------------------------------------------+
| MOVEMENT 8: THE PILOT GUARANTEE & CLOSING ACTION                                                |
| Clear commercial terms: "Deploy in weeks, not years. 30-Day Proof-of-Value Guarantee."          |
| Direct calendar booking + simple intake form (First Name, Last Name, Work Email, ERP System).   |
+-------------------------------------------------------------------------------------------------+
```

---

## 6. Layout & Spatial System: Spacing, Radii, and Header/Footer

### 6.1 Spacing Scale
Based on an `8px` grid rhythm:
* `space-1`: `4px`
* `space-2`: `8px`
* `space-3`: `12px`
* `space-4`: `16px`
* `space-6`: `24px`
* `space-8`: `32px`
* `space-12`: `48px`
* `space-16`: `64px`
* `space-24`: `96px`

### 6.2 Corner Radii
* Buttons & Input Fields: `4px` (`rounded-sm`). Clean, architectural, slightly softened.
* Floating Document Sheets: `4px` (`rounded-sm`).
* Inked Rubber Stamp: `2px` with double rule.
* **Strictly Banned:** `rounded-2xl` / `rounded-3xl` (24px+).

### 6.3 Global Header Specification
* **Height:** `68px` fixed.
* **Background:** Frosted parchment (`rgba(236, 232, 223, 0.92)` + `backdrop-blur-md`).
* **Bottom Rule:** `1px solid #D5D0C5`.
* **Brand Logo:** High-res vector wordmark with `Quant Fusion` in crisp carbon ink.
* **Navigation Links:** 15px Inter, `#1A1714` (Hover: `#164E87`, active indicator: 2px bottom rule).
  - Platform, Solutions, TradeGauge™, Calculator, Case Studies, Pricing.
* **Header CTA Button:** `Request Pilot` (Solid Forest Green `#0F663E`, 14px, white text, 4px radius).

### 6.4 Global Footer Specification
* **Background:** Deep Carbon Slate `#141311` (anchor footer).
* **Divider Rule:** `1px solid rgba(255, 255, 255, 0.12)`.
* **Columns (5):** Platform, Solutions, Tools & Data, Company, Legal & Trust.
* **Required Legal Links:** Privacy Policy, Terms of Service (with GDPR Annexes), Security Disclosures.
* **Direct Contact:** Tampa, FL • info@quant-fusion.com • +1 (813) 736-0703.
* **Copyright Notice:** `© 2026 Quant Fusion, LLC. All Rights Reserved. SOX Audit Compliant.`

### 6.5 Mobile & Responsive Rules
* **Containers:** Max width `1280px` on desktop; `100% - 40px` on mobile.
* **Hero Stack:** On viewports `< 1024px`, the 2-column layout stacks vertically (Headline & CTA on top, Order Manifest Sheet below).
* **Tables:** Comparison and tariff tables switch to horizontal scroll trays (`overflow-x: auto`) with a sticky first column, maintaining full readability without shrinking text.

---

*This document is the locked and authoritative production specification for the Quant Fusion rebuild.*
