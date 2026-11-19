"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Check, Layers, RotateCw } from "lucide-react";

export interface OrderPart {
  id: string;
  name: string;
  source: string;
  system: string;
  status: string;
  statusType: "ok" | "warn" | "danger";
  criticalPath: boolean;
  offsetY: number; // Exploded vertical separation in px
  offsetX: number; // Exploded horizontal separation in px
  color: string;
}

interface ExplodedOrderViewerProps {
  scenario: "baseline" | "portDelay" | "airFreight";
  isAssembled: boolean;
  onPartClick?: (partId: string) => void;
  compact?: boolean;
}

export function ExplodedOrderViewer({ scenario, isAssembled, onPartClick, compact = false }: ExplodedOrderViewerProps) {
  // Arc rotation angle in degrees (-20 to +20)
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [selectedPartId, setSelectedPartId] = useState<string>("board");
  const containerRef = useRef<HTMLDivElement>(null);

  // Scale offsets if compact
  const yFactor = compact ? 0.6 : 1;
  const xFactor = compact ? 0.6 : 1;

  // Parts definition based on active scenario
  const parts: OrderPart[] = [
    {
      id: "housing",
      name: "304 Stainless Frame & Chassis",
      source: "Bay 2 Staged",
      system: "Oracle WMS",
      status: "In Stock",
      statusType: "ok",
      criticalPath: false,
      offsetY: isAssembled ? 0 : Math.round(-55 * yFactor),
      offsetX: isAssembled ? 0 : Math.round(-20 * xFactor),
      color: "#6B665C",
    },
    {
      id: "motor",
      name: "200HP Inverter Drive Motor",
      source: "Plant 4 Allocated",
      system: "SAP ECC RFC",
      status: "Allocated",
      statusType: "ok",
      criticalPath: false,
      offsetY: isAssembled ? 0 : Math.round(-15 * yFactor),
      offsetX: isAssembled ? 0 : 0,
      color: "#4A463F",
    },
    {
      id: "board",
      name: "Microprocessor Control Module",
      source:
        scenario === "baseline"
          ? "Maersk #441 (On Schedule)"
          : scenario === "portDelay"
          ? "Port LA Dwell (+3d Delay)"
          : "Atlas Air AWB (Expedited)",
      system: scenario === "airFreight" ? "Air Cargo EDI" : "Ocean EDI 214",
      status:
        scenario === "baseline"
          ? "Normal Transit"
          : scenario === "portDelay"
          ? "CRITICAL PATH DELAY"
          : "Expedited Transit",
      statusType: scenario === "portDelay" ? "danger" : scenario === "baseline" ? "ok" : "ok",
      criticalPath: scenario === "portDelay",
      // When delayed, the control board slides further out along the critical path line
      offsetY: isAssembled ? 0 : Math.round((scenario === "portDelay" ? 48 : 28) * yFactor),
      offsetX: isAssembled ? 0 : Math.round((scenario === "portDelay" ? 42 : 20) * xFactor),
      color: scenario === "portDelay" ? "#B91C1C" : "#0F663E",
    },
    {
      id: "gasket",
      name: "Thermal Seal & Fastener Kit",
      source: "Tool Crib 03",
      system: "Fastenal Vending",
      status: "Available",
      statusType: "ok",
      criticalPath: false,
      offsetY: isAssembled ? 0 : Math.round(68 * yFactor),
      offsetX: isAssembled ? 0 : Math.round(-10 * xFactor),
      color: "#8C8478",
    },
  ];

  // Mouse drag handlers for limited rotation arc
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const newRot = Math.max(-22, Math.min(22, rotation + deltaX * 0.25));
    setRotation(newRot);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setRotation((prev) => Math.max(-22, prev - 4));
    } else if (e.key === "ArrowRight") {
      setRotation((prev) => Math.min(22, prev + 4));
    }
  };

  const activePart = parts.find((p) => p.id === selectedPartId) || parts[2];

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Exploded Technical Drawing of Multi-Part Order. Use left and right arrow keys to rotate."
      className={
        compact
          ? "relative bg-surface-canvas/60 rounded border border-border-rule/80 p-2.5 sm:p-3 select-none cursor-grab active:cursor-grabbing focus:outline-link-interactive overflow-hidden"
          : "relative bg-surface-canvas/80 rounded border border-border-rule p-4 sm:p-5 select-none cursor-grab active:cursor-grabbing focus:outline-link-interactive overflow-hidden"
      }
    >
      {/* Top Controls & Explanation */}
      <div
        className={`flex items-center justify-between ${
          compact ? "pb-1.5 mb-0.5" : "pb-3"
        } border-b border-border-rule text-[11px] font-mono text-ink-muted`}
      >
        <div className="flex items-center gap-1.5">
          <Layers size={compact ? 12 : 13} className="text-btn-cta" />
          <span className="font-semibold text-ink-primary uppercase tracking-wider text-[10px] sm:text-[11px]">
            {isAssembled ? "Assembled Order Chassis" : compact ? "BOM Assembly Status" : "Exploded BOM Technical Drawing"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-ink-muted">
            {isAssembled ? "100% Synced" : "Drag ±20°"}
          </span>
          <button
            onClick={() => setRotation(0)}
            className="p-0.5 rounded hover:bg-surface-recessed text-ink-secondary"
            title="Reset rotation"
            aria-label="Reset rotation to 0 degrees"
          >
            <RotateCw size={compact ? 10 : 12} />
          </button>
        </div>
      </div>

      {/* Main SVG Matte Ink Technical Canvas */}
      <div
        className={`relative ${
          compact ? "h-[115px] sm:h-[125px]" : "h-[220px] sm:h-[250px]"
        } w-full flex items-center justify-center my-0.5`}
      >
        <svg
          viewBox={compact ? "-140 -85 280 170" : "-160 -110 320 220"}
          className={`w-full h-full ${
            compact ? "max-h-[125px]" : "max-h-[250px]"
          } overflow-visible transition-transform duration-300 ease-out`}
          style={{
            transform: `perspective(600px) rotateY(${rotation}deg) rotateX(12deg)`,
          }}
        >
          {/* Isometric Construction Axis Guides (Subtle Ink-ruled lines) */}
          <g stroke="#D5D0C5" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="-130" y1="75" x2="130" y2="-75" />
            <line x1="-130" y1="-75" x2="130" y2="75" />
            <line x1="0" y1="-100" x2="0" y2="100" />
          </g>

          {/* Part 1: Top Chassis Housing */}
          <g
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: `translate(${parts[0].offsetX}px, ${parts[0].offsetY}px)`,
            }}
            onClick={() => setSelectedPartId("housing")}
          >
            {/* Ink Isometric Prism */}
            <polygon
              points="0,-35 60,-10 0,15 -60,-10"
              fill="#FFFFFF"
              stroke="#1A1714"
              strokeWidth="1.5"
              className="group-hover:stroke-btn-cta transition-colors"
            />
            <polygon
              points="-60,-10 0,15 0,35 -60,10"
              fill="#ECE8DF"
              stroke="#1A1714"
              strokeWidth="1.5"
            />
            <polygon
              points="0,15 60,-10 60,10 0,35"
              fill="#DFDACF"
              stroke="#1A1714"
              strokeWidth="1.5"
            />
            {/* Technical Detail Louvers */}
            <line x1="-30" y1="-5" x2="30" y2="-5" stroke="#6B665C" strokeWidth="0.8" />
            <line x1="-25" y1="2" x2="25" y2="2" stroke="#6B665C" strokeWidth="0.8" />
          </g>

          {/* Part 2: Inverter Drive Motor Core */}
          <g
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: `translate(${parts[1].offsetX}px, ${parts[1].offsetY}px)`,
            }}
            onClick={() => setSelectedPartId("motor")}
          >
            <ellipse
              cx="0"
              cy="0"
              rx="32"
              ry="16"
              fill="#FFFFFF"
              stroke="#1A1714"
              strokeWidth="1.5"
              className="group-hover:stroke-btn-cta transition-colors"
            />
            <path
              d="M -32,0 C -32,12 32,12 32,0 L 32,18 C 32,30 -32,30 -32,18 Z"
              fill="#ECE8DF"
              stroke="#1A1714"
              strokeWidth="1.5"
            />
            {/* Axle pin */}
            <circle cx="0" cy="0" r="4" fill="#1A1714" />
          </g>

          {/* Part 3: Microprocessor Control Board (THE CRITICAL PATH PART) */}
          <g
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: `translate(${parts[2].offsetX}px, ${parts[2].offsetY}px)`,
            }}
            onClick={() => setSelectedPartId("board")}
          >
            {/* Critical Path Red Aura when delayed */}
            {parts[2].criticalPath && (
              <polygon
                points="0,-22 48,-4 0,14 -48,-4"
                fill="none"
                stroke="#B91C1C"
                strokeWidth="3.5"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            )}
            <polygon
              points="0,-18 42,-2 0,14 -42,-2"
              fill={parts[2].criticalPath ? "#FEE2E2" : "#DCFCE7"}
              stroke={parts[2].criticalPath ? "#B91C1C" : "#0F663E"}
              strokeWidth={parts[2].criticalPath ? "2" : "1.5"}
            />
            <polygon
              points="-42,-2 0,14 0,22 -42,6"
              fill={parts[2].criticalPath ? "#FECACA" : "#BBF7D0"}
              stroke={parts[2].criticalPath ? "#B91C1C" : "#0F663E"}
              strokeWidth="1.2"
            />
            <polygon
              points="0,14 42,-2 42,6 0,22"
              fill={parts[2].criticalPath ? "#FCA5A5" : "#86EFAC"}
              stroke={parts[2].criticalPath ? "#B91C1C" : "#0F663E"}
              strokeWidth="1.2"
            />
            {/* Integrated Circuit Pins */}
            <rect x="-10" y="2" width="20" height="8" fill="#1A1714" rx="1" />
            <circle cx="-6" cy="6" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Part 4: Base Gasket Seal Kit */}
          <g
            className="transition-all duration-500 ease-out cursor-pointer group"
            style={{
              transform: `translate(${parts[3].offsetX}px, ${parts[3].offsetY}px)`,
            }}
            onClick={() => setSelectedPartId("gasket")}
          >
            <polygon
              points="0,-12 50,6 0,24 -50,6"
              fill="#FFFFFF"
              stroke="#6B665C"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              className="group-hover:stroke-btn-cta transition-colors"
            />
          </g>

          {/* Critical Path Leader Line & Callout Badge */}
          {!isAssembled && (
            <g className="transition-opacity duration-300">
              {parts[2].criticalPath ? (
                <>
                  {/* Red Leader Line to delayed Control Board */}
                  <polyline
                    points={`${parts[2].offsetX + 42},${parts[2].offsetY} ${parts[2].offsetX + 75},${parts[2].offsetY - 20} ${parts[2].offsetX + 115},${parts[2].offsetY - 20}`}
                    fill="none"
                    stroke="#B91C1C"
                    strokeWidth="1.2"
                  />
                  <circle cx={parts[2].offsetX + 42} cy={parts[2].offsetY} r="2.5" fill="#B91C1C" />
                  <text
                    x={parts[2].offsetX + 78}
                    y={parts[2].offsetY - 24}
                    fill="#B91C1C"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    CRITICAL PATH BOTTLENECK
                  </text>
                  <text
                    x={parts[2].offsetX + 78}
                    y={parts[2].offsetY - 12}
                    fill="#4A463F"
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    Port LA Dwell (+3 Days)
                  </text>
                </>
              ) : (
                <>
                  {/* Green Leader Line for on-schedule */}
                  <polyline
                    points={`${parts[2].offsetX + 42},${parts[2].offsetY} ${parts[2].offsetX + 70},${parts[2].offsetY - 15} ${parts[2].offsetX + 105},${parts[2].offsetY - 15}`}
                    fill="none"
                    stroke="#0F663E"
                    strokeWidth="1"
                  />
                  <circle cx={parts[2].offsetX + 42} cy={parts[2].offsetY} r="2" fill="#0F663E" />
                  <text
                    x={parts[2].offsetX + 72}
                    y={parts[2].offsetY - 18}
                    fill="#0F663E"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SYNCHRONIZED
                  </text>
                </>
              )}
            </g>
          )}
        </svg>

        {/* Snap-Together Badge when Assembled */}
        {isAssembled && (
          <div className="absolute top-3 left-3 bg-surface-sheet px-2.5 py-1 rounded border border-btn-cta/40 text-[10px] font-mono text-btn-cta font-bold shadow-xs flex items-center gap-1.5 animate-in fade-in zoom-in-95">
            <Check size={12} strokeWidth={3} />
            <span>ALL COMPONENTS RECONCILED • READY TO SHIP</span>
          </div>
        )}
      </div>

      {/* Part Inspection Pill Bar (Full Mode Only) */}
      {!compact && (
        <div className="pt-2 border-t border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-ink-muted shrink-0 text-[10px] uppercase">Inspect:</span>
            {parts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPartId(p.id)}
                className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap transition-colors ${
                  selectedPartId === p.id
                    ? "bg-ink-primary text-white font-semibold"
                    : "bg-surface-sheet text-ink-secondary border border-border-rule hover:text-ink-primary"
                }`}
              >
                {p.id === "board" && p.criticalPath ? (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle size={11} className="text-amber-500 shrink-0" />
                    <span>Control Module</span>
                  </span>
                ) : (
                  p.name.split(" ")[0]
                )}
              </button>
            ))}
          </div>

          {/* Active Part Detail Badge */}
          <div className="text-right shrink-0">
            <span className="text-ink-muted text-[10px]">{activePart.system}: </span>
            <span
              className={`font-semibold ${
                activePart.statusType === "danger"
                  ? "text-friction-crimson"
                  : activePart.statusType === "warn"
                  ? "text-amber-800"
                  : "text-btn-cta"
              }`}
            >
              {activePart.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
