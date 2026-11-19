import { IntentClassification } from "./types";

const GREETING_REGEX =
  /^(hi|hello|hey|howdy|greetings|good\s+(morning|afternoon|evening)|yo|thanks|thank\s+you|help)\b|^who\s+are\s+you\??$|^what\s+(is\s+this|can\s+you\s+do)\??$/i;

const DOMAIN_TERMS_REGEX =
  /\b(quant\s+fusion|deb(\s+friar|ra)?|friar|founder|founders|founded|ceo|supply\s+chain|logistics|operations|inventory|plant|warehouse|carrier|vessel|freight|demurrage|railhead|intermodal|drayage|container|pier\s+400|ord-\d+|po-\d+|msku-\d+|tradegauge|tariff|tariffs|duty|duties|hts|usmca|customs|ebitda|basis\s+point|bps|margin|margins|otif|chargeback|chargebacks|sg&a|sga|payroll|csr|firefighting|erp|wms|tms|mes|sap|oracle|netsuite|dynamics|as400|sftp|csv|rest|rfc|bapi|connector|connectors|zero-writeback|writeback|sox|404|celonis|project44|fourkites|mulesoft|kinaxis|boomi|powerbi|tableau|pilot|pricing|onboard|ingest|ingestion|promise\s+date|ship\s+date|fulfillment|order|orders|shipment|shipments|vendor|supplier|scorecard)\b/i;

const COMMON_OOD_PATTERNS = [
  /^who('s|\s+is|\s+was)\s+(?!quant\s+fusion|deb|friar|the\s+founder|the\s+ceo|your\s+founder)[a-z\s]+(\?|$)/i,
  /\b(sadam|saddam|husen|hussein|president|prime\s+minister|dictator|emperor|king|queen|churchill|biden|trump|obama)\b/i,
  /\b(recipe|bake|cook|flour|sugar|cake|pizza|burger|chocolate)\b/i,
  /\b(quantum|physics|astronomy|planet|mars|sun|aphelion|shor'?s|relativity|photosynthesis|calculus|math)\b/i,
  /\b(python|script|binary\s+tree|invert|javascript|leetcode|coding|algorithm|compile)\b/i,
  /\b(migraine|headache|medication|medicine|symptom|doctor|disease|pill|drug)\b/i,
  /\b(world\s+cup|fifa|soccer|football|nfl|nba|beatles|drummer|singer|movie|film|godfather|actor|actress|album|song)\b/i,
  /\b(iphone|screen|cracked|repair|battery|android|samsung)\b/i,
  /\b(weather|forecast|tokyo|paris|london|capital\s+of|population\s+of)\b/i,
  /\b(bitcoin|ethereum|crypto|joke|riddle|funny|tell\s+me\s+a\s+joke)\b/i,
];

export function classifyQueryIntent(query: string): IntentClassification {
  const trimmed = query.trim();

  // 1. Check for simple greetings and meta inquiries
  if (GREETING_REGEX.test(trimmed)) {
    return {
      intent: "GREETING",
      confidence: 0.95,
      detectedEntities: [],
      reason: "User initiated a greeting or asked about copilot capabilities.",
    };
  }

  // 2. Extract specific domain identifiers
  const detectedEntities: string[] = [];
  const entityMatches = trimmed.match(
    /\b(ORD-\d+|PO-\d+|MSKU-\d+|TradeGauge|Deb(\s+Friar)?|Founder|Founded|CEO|SOX\s+404|150\s+BPS|Celonis|MuleSoft|SAP|Oracle|NetSuite|USMCA|Pier\s+400)\b/gi
  );
  if (entityMatches) {
    for (const ent of entityMatches) {
      if (!detectedEntities.includes(ent.toUpperCase())) {
        detectedEntities.push(ent.toUpperCase());
      }
    }
  }

  if (detectedEntities.length > 0) {
    return {
      intent: "SPECIFIC_ENTITY",
      confidence: 0.98,
      detectedEntities,
      reason: `Specific enterprise operational entity detected: ${detectedEntities.join(", ")}`,
    };
  }

  // 3. Strict Out-of-Domain Guardrail Check
  const hasDomainTerms = DOMAIN_TERMS_REGEX.test(trimmed);
  const isExplicitOOD = COMMON_OOD_PATTERNS.some((pattern) => pattern.test(trimmed));

  if (isExplicitOOD || !hasDomainTerms) {
    // If explicit OOD pattern matched, or if there are zero supply chain domain terms
    return {
      intent: "OUT_OF_DOMAIN",
      confidence: 0.96,
      detectedEntities: [],
      reason: "Query references external individuals, general trivia, programming, or non-supply chain topics.",
    };
  }

  // 4. In-domain query with verified domain terms
  return {
    intent: "IN_DOMAIN",
    confidence: 0.92,
    detectedEntities: [],
    reason: "Query aligns with enterprise supply chain, operational decision layers, and platform functionality.",
  };
}
