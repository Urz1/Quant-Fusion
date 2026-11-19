/**
 * QUANT FUSION ENTERPRISE SUPPLY CHAIN KNOWLEDGE GRAPH
 * Entity-Relation Triple Store for deterministic multi-hop reasoning.
 */

export interface GraphNode {
  id: string;
  name: string;
  type:
    | "Order"
    | "Vessel"
    | "Bottleneck"
    | "Facility"
    | "Customer"
    | "FinancialMetric"
    | "TariffStrategy"
    | "Architecture"
    | "Competitor"
    | "Person"
    | "Silo";
  properties: Record<string, string | number>;
}

export interface GraphEdge {
  sourceId: string;
  relation: string;
  targetId: string;
  description: string;
}

export interface GraphKnowledgeSubGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  formattedTriples: string[];
}

export const GRAPH_NODES: GraphNode[] = [
  // 1. Orders
  {
    id: "ORD-78192",
    name: "Order ORD-78192 (Commercial Convection CX-900)",
    type: "Order",
    properties: {
      promisedDate: "November 17, 2026 @ 14:30 EST",
      confidence: "99.4%",
      latency: "0.18s",
      manualErpGuess: "November 14, 2026",
      costAvoidance: "$3,400 hot-shot freight saved",
    },
  },
  {
    id: "PO-34018",
    name: "Purchase Order PO-34018 (Bulk Liquid Tanker PC-400)",
    type: "Order",
    properties: {
      promisedDate: "November 22, 2026 @ 09:15 CST",
      confidence: "98.9%",
      plantEstimate: "November 19, 2026 (Unverified)",
      timeSaved: "60 hours/month eliminated across plants",
    },
  },
  {
    id: "ORD-91204",
    name: "Order ORD-91204 (Hydraulic Pump HP-550)",
    type: "Order",
    properties: {
      status: "Critical Shortage Exception",
      scheduledDate: "December 04, 2026 @ 16:00 EST",
      assumedDate: "November 28, 2026",
      leadTimeAdvance: "Flagged 12 days prior to scheduled shipment",
    },
  },
  {
    id: "MSKU-90812",
    name: "Maritime Container MSKU-90812 (Power Converters HTS 8504.40)",
    type: "Vessel",
    properties: {
      vesselName: "CMA CGM Marco Polo",
      entryValuation: "$482,000",
      customsDate: "November 24, 2026 @ 18:00 PST",
      statutoryDeadline: "December 01, 2026 (Section 301 Escalation)",
      tariffAvoided: "+$48,200 cash penalty avoided",
      demurrageSaved: "$250/day Pier 400 demurrage eliminated",
    },
  },

  // 2. Bottlenecks
  {
    id: "BOTTLENECK-CHICAGO",
    name: "Chicago Railhead Dwell",
    type: "Bottleneck",
    properties: { delay: "+48 hrs railcar dwell", location: "Chicago intermodal yard" },
  },
  {
    id: "BOTTLENECK-HOUSTON",
    name: "Houston Siding Manifold Pressure Hold",
    type: "Bottleneck",
    properties: { delay: "+72 hrs manifold delay", location: "Houston Siding #2" },
  },
  {
    id: "BOTTLENECK-MONTERREY",
    name: "Monterrey Tier-2 Viton Seal Shortage",
    type: "Bottleneck",
    properties: { delay: "+6 days supplier backorder", component: "Viton high-pressure seal" },
  },
  {
    id: "BOTTLENECK-PIER400",
    name: "Port of Los Angeles Pier 400 Congestion",
    type: "Bottleneck",
    properties: { fineRate: "$250/day demurrage", status: "Resolved via dynamic appointment" },
  },

  // 3. Facilities & Hubs
  { id: "FAC-TAMPA", name: "Tampa Facility #4", type: "Facility", properties: { role: "Line-02 Assembly" } },
  { id: "FAC-HOUSTON", name: "Houston Siding #2", type: "Facility", properties: { role: "Bulk Chemical Manifold" } },
  { id: "FAC-DALLAS", name: "Dallas Regional Distribution Hub", type: "Facility", properties: { role: "Buffer Stock Allocation" } },
  { id: "FAC-PIER400", name: "Pier 400 (Port of Los Angeles)", type: "Facility", properties: { role: "Deepwater Marine Container Terminal" } },

  // 4. Counterparties & Customers
  { id: "CUST-APEX", name: "Apex Thermal Dynamics", type: "Customer", properties: { industry: "Commercial Foodservice Equipment" } },
  { id: "CUST-CHEMCO", name: "ChemCo Industries", type: "Customer", properties: { industry: "Specialty Chemical Refining" } },
  { id: "CUST-TITAN", name: "Titan Heavy Machinery", type: "Customer", properties: { industry: "Industrial Construction Equipment" } },

  // 5. Financial Waterfall & Formulas
  {
    id: "FIN-150BPS",
    name: "150 BPS EBITDA Margin Waterfall ($900,000 on $60M)",
    type: "FinancialMetric",
    properties: {
      targetMargin: "32.00%",
      realizedExcelMargin: "30.50%",
      recoveredMargin: "+150 BPS (+1.50%)",
      csrTriagePayroll: "-$420,000/yr (12,000 hrs)",
      emergencyFreight: "-$280,000/yr hot-shot freight",
      otifPenalties: "-$200,000/yr retailer chargebacks (3-5%)",
    },
  },
  {
    id: "FIN-FORMULA",
    name: "Audited Avoidable SG&A Cost Formula",
    type: "FinancialMetric",
    properties: {
      formula: "Annual Avoidable Cost = (Annual Orders * % Chased * Lookup Hours * Loaded Wage) + Freight + Penalties",
      csrMonthlyWaste: "17 to 22 hours per employee/month",
      csrAnnualWaste: "Up to 400 hours per employee/year",
    },
  },

  // 6. Security & Architecture
  {
    id: "ARCH-ZERO-WRITEBACK",
    name: "Zero-Writeback Hardware/Protocol Isolation",
    type: "Architecture",
    properties: {
      dbMutationRisk: "0%",
      protocols: "Nightly SFTP CSV Batch, TLS 1.3 REST Webhooks, Read-Only SAP RFC/BAPI",
      compliance: "SOX 404 Audit Defensible, SOC 2 Type II Pre-Assessment Controls",
      onboardingSpeed: "Live in under 48 hours without ERP schema overhaul",
    },
  },

  // 7. Tariffs & TradeGauge
  {
    id: "TARIFF-TRADEGAUGE",
    name: "TradeGauge Statutory Tariff Engine",
    type: "TariffStrategy",
    properties: {
      regulations: "Section 301, Section 232, USMCA",
      mitigations: "Tariff Inversion Alert, Bonded FTZ Deferral, 65% RVC USMCA Nearshoring",
    },
  },

  // 8. Competitors
  {
    id: "COMP-CELONIS",
    name: "Celonis Process Mining",
    type: "Competitor",
    properties: {
      limit: "Post-mortem analysis of historical server logs weeks later",
      quantFusionAdvantage: "Real-time forward-looking deterministic decision layer (< 0.22s)",
    },
  },
  {
    id: "COMP-PROJECT44",
    name: "project44 / FourKites",
    type: "Competitor",
    properties: {
      limit: "Carrier GPS pins on a map without internal BOM context",
      quantFusionAdvantage: "Fuses internal ERP BOM buffers with live telematics",
    },
  },
  {
    id: "COMP-MULESOFT",
    name: "MuleSoft / Boomi",
    type: "Competitor",
    properties: {
      limit: "Heavy bidirectional writeback with database mutation risk",
      quantFusionAdvantage: "100% read-only zero-writeback in 48 hours",
    },
  },

  // 9. Leadership
  {
    id: "PERSON-DEB-FRIAR",
    name: "Deb (Debra) Friar",
    type: "Person",
    properties: {
      role: "Founder & CEO, Quant Fusion",
      experience: "20+ years executive leadership at Welbilt, Target, Pillsbury, Pepsi, Catalina Marketing",
      provenance: "Former Director of Sales Operations at Welbilt; mapped original 40-step manual silo breakdown",
      credentials: "BBA & MBA Univ. of Wisconsin; MIT Professional & AWS AI Certifications; USF Monica Wooden Center Advisory Board",
    },
  },
];

export const GRAPH_EDGES: GraphEdge[] = [
  // Order ORD-78192 relations
  { sourceId: "ORD-78192", relation: "CUSTOMER", targetId: "CUST-APEX", description: "Consigned to customer Apex Thermal Dynamics" },
  { sourceId: "ORD-78192", relation: "CONSTRAINED_BY", targetId: "BOTTLENECK-CHICAGO", description: "Delayed by unannounced +48 hr Chicago railhead railcar dwell" },
  { sourceId: "ORD-78192", relation: "PROACTIVE_DISPATCH", targetId: "FAC-TAMPA", description: "Automated Line-02 buffer scheduling at Tampa Facility #4" },
  { sourceId: "ORD-78192", relation: "AVOIDS_COST", targetId: "FIN-150BPS", description: "Eliminated $3,400 hot-shot freight and retailer OTIF chargebacks" },

  // Order PO-34018 relations
  { sourceId: "PO-34018", relation: "CUSTOMER", targetId: "CUST-CHEMCO", description: "Procured for ChemCo Industries" },
  { sourceId: "PO-34018", relation: "CONSTRAINED_BY", targetId: "BOTTLENECK-HOUSTON", description: "Siding manifold pressure delay (+72h)" },
  { sourceId: "PO-34018", relation: "RESOLVED_VIA", targetId: "FAC-HOUSTON", description: "Real-time GPS telematics fused with SAP batch release at Houston Siding #2" },

  // Order ORD-91204 relations
  { sourceId: "ORD-91204", relation: "CUSTOMER", targetId: "CUST-TITAN", description: "Fabricated for Titan Heavy Machinery" },
  { sourceId: "ORD-91204", relation: "CONSTRAINED_BY", targetId: "BOTTLENECK-MONTERREY", description: "Tier-2 Viton seal backorder in Monterrey (+6d)" },
  { sourceId: "ORD-91204", relation: "RESOLVED_VIA", targetId: "FAC-DALLAS", description: "Surfaced 12 days prior; automated inventory transfer from Dallas Hub" },

  // Maritime MSKU-90812 relations
  { sourceId: "MSKU-90812", relation: "BERTH_PORT", targetId: "FAC-PIER400", description: "Clearance at Port of Los Angeles Pier 400 on Nov 24, 2026" },
  { sourceId: "MSKU-90812", relation: "AVOIDS_CONGESTION", targetId: "BOTTLENECK-PIER400", description: "Real-time gate appointment eliminates $250/day demurrage" },
  { sourceId: "MSKU-90812", relation: "AVOIDS_STATUTORY_TARIFF", targetId: "TARIFF-TRADEGAUGE", description: "Clears 7 days prior to Dec 01 statutory tariff escalation, saving $48,200" },

  // Quant Fusion platform relations
  { sourceId: "PERSON-DEB-FRIAR", relation: "FOUNDED", targetId: "ORD-78192", description: "Deb Friar founded Quant Fusion after mapping 40-step silo fulfillment at Welbilt" },
  { sourceId: "ARCH-ZERO-WRITEBACK", relation: "PROTECTS_MARGIN", targetId: "FIN-150BPS", description: "Zero-writeback protocol isolation guarantees +150 BPS EBITDA margin defensibility" },
];

/**
 * Knowledge Graph Query Engine:
 * Performs sub-graph extraction and multi-hop entity traversal.
 */
export function queryKnowledgeGraph(query: string): GraphKnowledgeSubGraph {
  const queryLower = query.toLowerCase();
  const matchedNodeIds = new Set<string>();

  // 1. Direct Entity Matching
  for (const node of GRAPH_NODES) {
    if (queryLower.includes(node.id.toLowerCase()) || queryLower.includes(node.name.toLowerCase())) {
      matchedNodeIds.add(node.id);
    }
  }

  // 2. Domain Keyword to Entity Links
  if (/ord-?78192|apex|cx-900|convection/i.test(queryLower)) matchedNodeIds.add("ORD-78192");
  if (/po-?34018|chemco|pc-400|chemical|tanker/i.test(queryLower)) matchedNodeIds.add("PO-34018");
  if (/ord-?91204|titan|hp-550|hydraulic|viton/i.test(queryLower)) matchedNodeIds.add("ORD-91204");
  if (/msku|marco polo|vessel|pier 400|power converter/i.test(queryLower)) matchedNodeIds.add("MSKU-90812");
  if (/chicago|railhead|dwell/i.test(queryLower)) matchedNodeIds.add("BOTTLENECK-CHICAGO");
  if (/houston|manifold|siding/i.test(queryLower)) matchedNodeIds.add("BOTTLENECK-HOUSTON");
  if (/monterrey|viton|seal|dallas/i.test(queryLower)) matchedNodeIds.add("BOTTLENECK-MONTERREY");
  if (/deb|friar|founder|ceo|welbilt/i.test(queryLower)) matchedNodeIds.add("PERSON-DEB-FRIAR");
  if (/150\s*bps|ebitda|margin|waterfall|\$900/i.test(queryLower)) matchedNodeIds.add("FIN-150BPS");
  if (/formula|sga|payroll|400 hours|12,000|waste/i.test(queryLower)) matchedNodeIds.add("FIN-FORMULA");
  if (/writeback|sox|404|read-only|sftp|rfc/i.test(queryLower)) matchedNodeIds.add("ARCH-ZERO-WRITEBACK");
  if (/tradegauge|tariff|301|232|usmca|nearshore/i.test(queryLower)) matchedNodeIds.add("TARIFF-TRADEGAUGE");
  if (/celonis/i.test(queryLower)) matchedNodeIds.add("COMP-CELONIS");
  if (/project44|fourkites/i.test(queryLower)) matchedNodeIds.add("COMP-PROJECT44");
  if (/mulesoft|boomi/i.test(queryLower)) matchedNodeIds.add("COMP-MULESOFT");

  if (matchedNodeIds.size === 0) {
    return { nodes: [], edges: [], formattedTriples: [] };
  }

  // 3. 1-to-2 Hop Relational Traversal
  const expandedNodeIds = new Set<string>(matchedNodeIds);
  const relevantEdges: GraphEdge[] = [];

  for (const edge of GRAPH_EDGES) {
    if (matchedNodeIds.has(edge.sourceId) || matchedNodeIds.has(edge.targetId)) {
      relevantEdges.push(edge);
      expandedNodeIds.add(edge.sourceId);
      expandedNodeIds.add(edge.targetId);
    }
  }

  const relevantNodes = GRAPH_NODES.filter((n) => expandedNodeIds.has(n.id));

  // 4. Format Triples for Strict LLM Grounding
  const formattedTriples: string[] = relevantEdges.map((e) => {
    const src = GRAPH_NODES.find((n) => n.id === e.sourceId);
    const tgt = GRAPH_NODES.find((n) => n.id === e.targetId);
    return `• Entity [${src?.name || e.sourceId}] --(${e.relation})--> [${tgt?.name || e.targetId}]: ${e.description}`;
  });

  // Also format node property facts
  for (const node of relevantNodes) {
    const props = Object.entries(node.properties)
      .map(([k, v]) => `${k}="${v}"`)
      .join(", ");
    formattedTriples.push(`• Knowledge Graph Node [${node.name}] (${node.type}): { ${props} }`);
  }

  return {
    nodes: relevantNodes,
    edges: relevantEdges,
    formattedTriples,
  };
}
