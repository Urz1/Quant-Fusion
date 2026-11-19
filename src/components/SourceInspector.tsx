"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export function SourceInspector() {
  const [activeSource, setActiveSource] = useState<"sap" | "oracle" | "edi" | "csv">("sap");

  const sources = {
    sap: {
      name: "SAP ECC / S4",
      type: "REST / RFC Read-Only Connector",
      desc: "Extracts sales order header, component reservation lines, and shipping plant codes without writeback.",
      payload: `{
  "source_system": "SAP_ECC_PRD_01",
  "sales_order_number": "0084192004",
  "item_number": "000010",
  "material_number": "CU-940-COMPRESSOR",
  "plant": "1040",
  "storage_location": "FG01",
  "delivery_block": null,
  "requested_delivery_date": "2026-11-04",
  "confirmed_quantity": 1.0,
  "net_weight_kg": 420.5
}`,
    },
    oracle: {
      name: "Oracle WMS / NetSuite",
      type: "REST JSON API Feed",
      desc: "Reads inventory staging bay status and picking wave completion percentage.",
      payload: `{
  "source_system": "ORACLE_WMS_TAMPA",
  "facility_code": "FL_DIST_04",
  "work_order_id": "WO-991204",
  "assembly_bay": "BAY_02",
  "staging_status": "READY_FOR_SUBASSEMBLY",
  "pick_completion_pct": 100.0,
  "qa_signoff": true,
  "timestamp_utc": "2026-10-24T14:22:00Z"
}`,
    },
    edi: {
      name: "Carrier EDI 214 / 315",
      type: "Ocean & Rail Telemetry Stream",
      desc: "Ingests carrier milestone events, container dwell flags, and port congestion delays.",
      payload: `{
  "source_standard": "ANSI_X12_EDI_214",
  "carrier_scac": "MAEU",
  "container_number": "MSKU9481023",
  "status_code": "OA",
  "status_description": "OUT_GATE_DELAY_PORT_DWELL",
  "port_unlocode": "USLAX",
  "dwell_duration_hours": 72,
  "calculated_delay_impact_days": 3.0,
  "updated_eta_dock": "2026-10-28"
}`,
    },
    csv: {
      name: "Flat-File CSV / Excel",
      type: "Secure SFTP / S3 Flat File Ingestion",
      desc: "Enables Day 1 pilot execution by reading everyday supplier spreadsheets without IT integration queues.",
      payload: `PO_NUMBER,VENDOR_CODE,PART_ID,COMMITTED_SHIP,EXPEDITE_FLAG
PO-88194-01,VEN-8810,CB-12-BOARD,2026-10-26,TRUE
PO-88194-02,VEN-9941,DM-88-MOTOR,2026-11-10,FALSE
PO-88194-03,VEN-1020,SK-40-SEAL,2026-10-24,FALSE`,
    },
  };

  const current = sources[activeSource];

  return (
    <div className="bg-surface-sheet rounded p-6 sm:p-8 border border-border-rule shadow-sheet space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-rule gap-3">
        <div>
          <span className="font-mono text-[11px] font-bold text-btn-cta uppercase tracking-wider block">
            Schema Inspector • Agave / Enterprise Model
          </span>
          <h3 className="font-serif text-[20px] font-semibold text-ink-primary mt-1">
            Read-Only Ingestion Payloads (Zero IT Overhaul)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
          <ShieldCheck size={14} className="text-btn-cta" />
          <span>Non-invasive read-only protocols</span>
        </div>
      </div>

      {/* Source Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["sap", "oracle", "edi", "csv"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSource(key)}
            className={`px-3 py-2 rounded font-mono text-[12px] transition-colors border ${
              activeSource === key
                ? "bg-ink-primary text-white border-ink-primary font-semibold"
                : "bg-surface-recessed text-ink-secondary border-border-rule hover:text-ink-primary"
            }`}
          >
            {sources[key].name}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="p-3 rounded bg-surface-recessed/40 border border-border-rule/60 text-[13px] font-sans text-ink-secondary">
        <span className="font-mono text-[11px] font-bold text-ink-primary uppercase block">
          Protocol: {current.type}
        </span>
        <p className="mt-1">{current.desc}</p>
      </div>

      {/* Monospace Code Payload */}
      <div className="rounded border border-border-rule overflow-hidden bg-[#141311]">
        <div className="px-4 py-2 bg-[#1A1815] border-b border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>Ingested Payload Preview</span>
          <span className="text-emerald-400">Validated 100% Traceable</span>
        </div>
        <pre className="p-4 font-mono text-[12px] text-[#E2E8F0] overflow-x-auto leading-relaxed">
          {current.payload}
        </pre>
      </div>

      <div className="text-[12px] font-mono text-ink-muted">
        Quant Fusion ingests only 4–6 relevant operational fields. It does not modify source databases or write back to ERP tables, ensuring 0% risk to production cores.
      </div>
    </div>
  );
}
