export interface CountryTariffData {
  id: string;
  numericId: string; // ISO 3166-1 numeric ID in world-atlas
  name: string;
  code: string;
  lat: number;
  lon: number;
  port: string;
  baseRate: number; // WTO Column 1 MFN %
  section301: number; // Section 301 %
  reciprocalProposal: number; // Proposed Reciprocal %
  usmcaExempt?: boolean;
  transitDaysToLA: number;
  typicalVesselRoute: string;
  samplePoNumber?: string;
  samplePoValue?: number;
}

export interface HtsProduct {
  code: string;
  name: string;
  bomItem: string;
  description: string;
  baseRatesByCountry: Record<string, number>;
}

export const HTS_PRODUCTS: HtsProduct[] = [
  {
    code: "8504.40.95",
    name: "Commercial Power Supplies & Inverters",
    bomItem: "CX900-PSU-48V",
    description: "Multi-phase static converters for industrial food equipment.",
    baseRatesByCountry: {
      vietnam: 2.8,
      china: 2.8,
      taiwan: 0.0,
      germany: 1.5,
      mexico: 0.0,
      india: 2.8,
      japan: 0.0,
    },
  },
  {
    code: "8419.81.90",
    name: "Convection Heating Assemblies",
    bomItem: "CX900-HEAT-COIL",
    description: "Industrial continuous heating elements with high-temp insulation.",
    baseRatesByCountry: {
      vietnam: 3.2,
      china: 3.2,
      taiwan: 0.0,
      germany: 2.0,
      mexico: 0.0,
      india: 3.2,
      japan: 0.0,
    },
  },
  {
    code: "8537.10.91",
    name: "Digital Logic Control Boards",
    bomItem: "CX900-MCU-LOGIC",
    description: "Microprocessor-based digital motor and thermal control boards.",
    baseRatesByCountry: {
      vietnam: 2.5,
      china: 2.5,
      taiwan: 0.0,
      germany: 1.2,
      mexico: 0.0,
      india: 2.5,
      japan: 0.0,
    },
  },
];

export const ORIGIN_HUBS: CountryTariffData[] = [
  {
    id: "vietnam",
    numericId: "704",
    name: "Vietnam",
    code: "VN",
    lat: 16.0,
    lon: 107.5,
    port: "Haiphong (VNHPH) / Cai Mep",
    baseRate: 2.8,
    section301: 0.0,
    reciprocalProposal: 46.0,
    transitDaysToLA: 21,
    typicalVesselRoute: "Transpacific South via Pearl River",
    samplePoNumber: "PO-34018",
    samplePoValue: 125000,
  },
  {
    id: "china",
    numericId: "156",
    name: "China",
    code: "CN",
    lat: 31.2,
    lon: 121.5,
    port: "Shanghai (CNSHA) / Shenzhen",
    baseRate: 2.8,
    section301: 25.0,
    reciprocalProposal: 34.0,
    transitDaysToLA: 18,
    typicalVesselRoute: "Direct Great Circle via North Pacific",
    samplePoNumber: "ORD-78192",
    samplePoValue: 180000,
  },
  {
    id: "taiwan",
    numericId: "158",
    name: "Taiwan",
    code: "TW",
    lat: 23.7,
    lon: 121.0,
    port: "Kaohsiung (TWKHH)",
    baseRate: 0.0,
    section301: 0.0,
    reciprocalProposal: 32.0,
    transitDaysToLA: 17,
    typicalVesselRoute: "Transpacific Central",
    samplePoNumber: "PO-91044",
    samplePoValue: 95000,
  },
  {
    id: "germany",
    numericId: "276",
    name: "Germany (EU)",
    code: "DE",
    lat: 53.5,
    lon: 10.0,
    port: "Hamburg (DEHAM) / Bremerhaven",
    baseRate: 1.5,
    section301: 0.0,
    reciprocalProposal: 20.0,
    transitDaysToLA: 28,
    typicalVesselRoute: "Transatlantic North & Panama Canal",
    samplePoNumber: "PO-22019",
    samplePoValue: 140000,
  },
  {
    id: "mexico",
    numericId: "484",
    name: "Mexico",
    code: "MX",
    lat: 25.6,
    lon: -100.3,
    port: "Monterrey / Laredo Cross-Dock",
    baseRate: 0.0,
    section301: 0.0,
    reciprocalProposal: 0.0,
    usmcaExempt: true,
    transitDaysToLA: 4,
    typicalVesselRoute: "Intermodal Class I Rail & Freight",
    samplePoNumber: "PO-55120",
    samplePoValue: 110000,
  },
  {
    id: "india",
    numericId: "356",
    name: "India",
    code: "IN",
    lat: 19.0,
    lon: 72.8,
    port: "Nhava Sheva (INNSA)",
    baseRate: 2.8,
    section301: 0.0,
    reciprocalProposal: 26.0,
    transitDaysToLA: 32,
    typicalVesselRoute: "Suez / Indian Ocean via Singapore",
    samplePoNumber: "PO-67311",
    samplePoValue: 85000,
  },
  {
    id: "japan",
    numericId: "392",
    name: "Japan",
    code: "JP",
    lat: 35.4,
    lon: 139.6,
    port: "Yokohama (JPYOK) / Tokyo",
    baseRate: 0.0,
    section301: 0.0,
    reciprocalProposal: 24.0,
    transitDaysToLA: 15,
    typicalVesselRoute: "North Pacific Direct Corridor",
    samplePoNumber: "PO-80415",
    samplePoValue: 160000,
  },
];

export const DESTINATION_PORT = {
  id: "usa_lax",
  numericId: "840",
  name: "Port of Los Angeles",
  code: "USLAX",
  lat: 33.74,
  lon: -118.27,
};
