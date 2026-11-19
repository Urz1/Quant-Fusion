"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Globe, 
  Map as MapIcon, 
  Compass, 
  Ship, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  RotateCcw,
  Play,
  Pause,
  Layers
} from "lucide-react";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import worldData from "world-atlas/countries-110m.json";

import {
  CountryTariffData,
  HtsProduct,
  HTS_PRODUCTS,
  ORIGIN_HUBS,
  DESTINATION_PORT as BASE_DESTINATION_PORT,
} from "@/data/tariffData";

export type { CountryTariffData, HtsProduct };
export { HTS_PRODUCTS, ORIGIN_HUBS };

export const DESTINATION_PORT = {
  ...BASE_DESTINATION_PORT,
  facility: "Pier 400 Container Terminal",
};

const MILESTONES = [
  {
    step: 0,
    label: "Oct 01 Baseline",
    statusBadge: "WTO MFN Statutory",
    summary: "Standard Column 1 Rates Apply",
    description: "Tariffs reflect baseline pre-litigation schedules. Reciprocal surcharges stay inactive.",
    dateStr: "October 1, 2026",
    reciprocalFactor: 0.0,
  },
  {
    step: 1,
    label: "Nov 15 Court Stay",
    statusBadge: "Interim Federal Injunction",
    summary: "Interim Judicial Stay Active",
    description: "Federal appellate court halts emergency IEEPA broad mandate. Baseline Section 301 remains.",
    dateStr: "November 15, 2026",
    reciprocalFactor: 0.25,
  },
  {
    step: 2,
    label: "Dec 01 Mandate",
    statusBadge: "Reciprocal Duty Effective",
    summary: "Full Statutory Reciprocal In Effect",
    description: "Statutory reciprocal tariffs apply to all customs entries on or after December 01.",
    dateStr: "December 01, 2026",
    reciprocalFactor: 1.0,
  },
];

// Extract Real World GeoJSON Features (177 Sovereign Nations)
const worldGeoData = topojson.feature(
  worldData as any,
  (worldData as any).objects.countries
) as any;

const graticuleGenerator = d3Geo.geoGraticule10();

// =============================================================================
// COMPONENT
// =============================================================================

export function TradeGaugeGlobe({ className = "" }: { className?: string }) {
  // Mode: 3D Orthographic Globe vs Flat Equirectangular Map
  const [viewMode, setViewMode] = useState<"globe" | "flat">("globe");

  // Center coordinates for Globe in degrees
  const [centerLon, setCenterLon] = useState<number>(115);
  const [centerLat, setCenterLat] = useState<number>(22);

  // Auto-Rotation state: defaults to TRUE
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const autoRotateReqRef = useRef<number | null>(null);

  // Dragging & Click interaction state
  const isPointerActiveRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartAngles = useRef({ lon: 115, lat: 22 });
  
  // Subtle feedback toast when user clicks to pause/play
  const [clickFeedback, setClickFeedback] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = useCallback((msg: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setClickFeedback(msg);
    feedbackTimeoutRef.current = setTimeout(() => {
      setClickFeedback(null);
    }, 1800);
  }, []);

  // Vessel animation progress along Great Circle route (0.0 to 1.0)
  const [vesselProgress, setVesselProgress] = useState<number>(0.35);

  // Selected Product & Selected Origin Country
  const [selectedProduct, setSelectedProduct] = useState<HtsProduct>(HTS_PRODUCTS[0]);
  const [selectedCountry, setSelectedCountry] = useState<CountryTariffData>(ORIGIN_HUBS[0]); // Default Vietnam
  const [hoveredCountry, setHoveredCountry] = useState<CountryTariffData | null>(null);

  // Timeline Step (0 = Oct 01, 1 = Nov 15, 2 = Dec 01)
  const [timelineStep, setTimelineStep] = useState<number>(1);
  const activeMilestone = MILESTONES[timelineStep];

  // Canvas / SVG Dimensions
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 560, height: 460 });

  // Handle responsive resizing
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = Math.min(Math.max(w * 0.85, 340), 480);
        setCanvasSize({ width: Math.round(w), height: Math.round(h) });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous Auto-Rotation Loop when active
  useEffect(() => {
    if (!isAutoRotating || viewMode === "flat") {
      if (autoRotateReqRef.current) cancelAnimationFrame(autoRotateReqRef.current);
      return;
    }

    let lastTimestamp = performance.now();
    let accumulatedDelta = 0;

    function step(timestamp: number) {
      if (typeof document !== "undefined" && document.hidden) {
        autoRotateReqRef.current = requestAnimationFrame(step);
        return;
      }

      const delta = Math.min(timestamp - lastTimestamp, 100);
      lastTimestamp = timestamp;
      accumulatedDelta += delta;

      // Throttle React state updates to ~25 FPS (40ms interval) to keep JS event loop completely fluid
      if (accumulatedDelta < 40) {
        autoRotateReqRef.current = requestAnimationFrame(step);
        return;
      }

      const stepDelta = accumulatedDelta;
      accumulatedDelta = 0;

      // Rotate eastward slowly (~12 degrees/sec)
      setCenterLon((prev) => {
        let next = prev + (stepDelta * 0.012);
        if (next > 180) next -= 360;
        return Math.round(next * 10) / 10;
      });

      // Animate vessel progress
      setVesselProgress((prev) => (prev + (stepDelta * 0.00008)) % 1);

      autoRotateReqRef.current = requestAnimationFrame(step);
    }

    autoRotateReqRef.current = requestAnimationFrame(step);

    return () => {
      if (autoRotateReqRef.current) cancelAnimationFrame(autoRotateReqRef.current);
    };
  }, [isAutoRotating, viewMode]);

  // Radius for 3D globe based on canvas size
  const radius = Math.min(canvasSize.width, canvasSize.height) * 0.42;
  const cx = canvasSize.width / 2;
  const cy = canvasSize.height / 2;

  // Real D3-Geo Projections
  const orthographicProjection = useMemo(() => {
    return d3Geo
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .rotate([-centerLon, -centerLat])
      .clipAngle(90);
  }, [radius, cx, cy, centerLon, centerLat]);

  const equirectangularProjection = useMemo(() => {
    return d3Geo
      .geoEquirectangular()
      .fitExtent(
        [[20, 20], [canvasSize.width - 20, canvasSize.height - 20]],
        { type: "Sphere" }
      );
  }, [canvasSize]);

  // Active projection based on viewMode
  const activeProjection = viewMode === "globe" ? orthographicProjection : equirectangularProjection;
  const pathGenerator = useMemo(() => d3Geo.geoPath(activeProjection), [activeProjection]);

  // Render Real World Graticules
  const graticulePath = useMemo(() => {
    return pathGenerator(graticuleGenerator) || "";
  }, [pathGenerator]);

  // Render Globe Outline / Horizon Circle
  const spherePath = useMemo(() => {
    return pathGenerator({ type: "Sphere" }) || "";
  }, [pathGenerator]);

  // Great Circle Route between Selected Country and Port of Los Angeles
  const greatCircleInterpolator = useMemo(() => {
    return d3Geo.geoInterpolate(
      [selectedCountry.lon, selectedCountry.lat],
      [DESTINATION_PORT.lon, DESTINATION_PORT.lat]
    );
  }, [selectedCountry]);

  // Generate 40 geodetic points along the great circle arc
  const routePathData = useMemo(() => {
    const coords: [number, number][] = [];
    for (let i = 0; i <= 36; i++) {
      coords.push(greatCircleInterpolator(i / 36));
    }
    const lineGeo = { type: "LineString", coordinates: coords };
    return pathGenerator(lineGeo as any) || "";
  }, [greatCircleInterpolator, pathGenerator]);

  // Current vessel position on the route
  const currentVesselCoord = useMemo(() => {
    return greatCircleInterpolator(vesselProgress);
  }, [greatCircleInterpolator, vesselProgress]);

  const projectedVesselPoint = useMemo(() => {
    return activeProjection(currentVesselCoord);
  }, [activeProjection, currentVesselCoord]);

  // Check if point is on visible hemisphere in globe view
  const isCoordVisible = useCallback(
    (lon: number, lat: number) => {
      if (viewMode === "flat") return true;
      const toRad = Math.PI / 180;
      const lambda = lon * toRad;
      const phi = lat * toRad;
      const lambda0 = centerLon * toRad;
      const phi0 = centerLat * toRad;

      const cosC =
        Math.sin(phi0) * Math.sin(phi) +
        Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
      return cosC >= 0.05;
    },
    [viewMode, centerLon, centerLat]
  );

  // ===========================================================================
  // INTERACTIVE CLICK & DRAG HANDLERS (Stop on Click, Start on Click Again!)
  // ===========================================================================

  const onPointerDown = (clientX: number, clientY: number) => {
    isPointerActiveRef.current = true;
    hasDraggedRef.current = false;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartAngles.current = { lon: centerLon, lat: centerLat };
  };

  const onPointerMove = (clientX: number, clientY: number) => {
    if (!isPointerActiveRef.current || viewMode === "flat") return;
    const dx = clientX - dragStartPos.current.x;
    const dy = clientY - dragStartPos.current.y;

    // Detect if movement exceeds click threshold (6px)
    if (!hasDraggedRef.current) {
      if (Math.hypot(dx, dy) > 6) {
        hasDraggedRef.current = true;
        // Pause auto-rotation while user is actively dragging to inspect
        setIsAutoRotating(false);
      } else {
        return;
      }
    }

    const sensitivity = 0.45;
    let newLon = (dragStartAngles.current.lon - dx * sensitivity) % 360;
    if (newLon < -180) newLon += 360;
    if (newLon > 180) newLon -= 360;

    let newLat = dragStartAngles.current.lat + dy * sensitivity;
    newLat = Math.max(-65, Math.min(65, newLat));

    setCenterLon(Math.round(newLon * 10) / 10);
    setCenterLat(Math.round(newLat * 10) / 10);
  };

  const onPointerUp = () => {
    if (!isPointerActiveRef.current) return;
    const wasDragging = hasDraggedRef.current;
    isPointerActiveRef.current = false;
    hasDraggedRef.current = false;

    // IF IT WAS A PURE CLICK/TAP ON THE GLOBE (Not a drag):
    // TOGGLE AUTO-ROTATION! (If stopped, starts spinning. If spinning, stops!)
    if (!wasDragging && viewMode === "globe") {
      setIsAutoRotating((prev) => {
        const nextState = !prev;
        showFeedback(nextState ? "Auto-Spin Resumed" : "Auto-Spin Paused");
        return nextState;
      });
    }
  };

  // Corridor focus presets
  const focusCorridor = (targetLon: number, targetLat: number, countryId?: string) => {
    setCenterLon(targetLon);
    setCenterLat(targetLat);
    setIsAutoRotating(false);
    showFeedback("Auto-Spin Paused (Corridor Focus)");
    if (countryId) {
      const match = ORIGIN_HUBS.find((h) => h.id === countryId);
      if (match) setSelectedCountry(match);
    }
  };

  // Calculated duty rates
  const calculatedDuties = useMemo(() => {
    const base = selectedProduct.baseRatesByCountry[selectedCountry.id] ?? selectedCountry.baseRate;
    const sec301 = selectedCountry.section301;
    const reciprocalEffective = selectedCountry.reciprocalProposal * activeMilestone.reciprocalFactor;
    const totalRate = Math.round((base + sec301 + reciprocalEffective) * 10) / 10;

    const poVal = selectedCountry.samplePoValue ?? 125000;
    const baseCost = (poVal * base) / 100;
    const sec301Cost = (poVal * sec301) / 100;
    const reciprocalCost = (poVal * reciprocalEffective) / 100;
    const totalDutyCost = Math.round(baseCost + sec301Cost + reciprocalCost);

    const baselineCost = Math.round((poVal * (base + sec301)) / 100);
    const exposureDelta = totalDutyCost - baselineCost;

    return {
      baseRate: base,
      sec301Rate: sec301,
      reciprocalEffective,
      totalRate,
      poValue: poVal,
      totalDutyCost,
      exposureDelta,
    };
  }, [selectedProduct, selectedCountry, activeMilestone]);

  // Map country numeric IDs to our known hub objects
  const numericIdToHub = useMemo(() => {
    const map = new Map<string, CountryTariffData>();
    ORIGIN_HUBS.forEach((hub) => map.set(hub.numericId, hub));
    return map;
  }, []);

  return (
    <div className={`w-full bg-surface-sheet text-ink-primary rounded-xl border border-border-rule shadow-sheet overflow-hidden font-sans ${className}`}>
      
      {/* =======================================================================
          TOP BAR: CONSOLE HEADER & CONTROLS
      ======================================================================= */}
      <div className="p-4 sm:p-5 border-b border-border-rule bg-surface-canvas/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAutoRotating ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="font-mono text-[11px] uppercase tracking-wider text-btn-cta font-bold">
              TradeGauge™ Landed Cost Foresight
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-ink-secondary border border-border-rule">
              Natural Earth 110m Cartography
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-recessed text-btn-cta border border-border-rule font-medium">
              177 Sovereign Boundaries
            </span>
          </div>
          <h3 className="font-serif text-[20px] sm:text-[24px] font-semibold text-ink-primary mt-1">
            Global Tariff Exposure & Maritime In-Transit Simulator
          </h3>
        </div>

        {/* View Mode & Auto-Spin Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          
          {/* Auto-Rotation Toggle Button */}
          {viewMode === "globe" && (
            <button
              onClick={() => {
                setIsAutoRotating(!isAutoRotating);
                showFeedback(!isAutoRotating ? "Auto-Spin Resumed" : "Auto-Spin Paused");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono border transition-all ${
                isAutoRotating
                  ? "bg-surface-sheet text-btn-cta border-btn-cta/40 shadow-xs font-medium"
                  : "bg-surface-recessed/60 text-ink-secondary border-border-rule hover:text-ink-primary hover:bg-surface-recessed"
              }`}
              title={isAutoRotating ? "Click to pause automatic rotation" : "Click to resume automatic rotation"}
            >
              {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
              <span>{isAutoRotating ? "Auto-Spin Active" : "Auto-Spin Paused"}</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="inline-flex items-center p-1 rounded-lg bg-surface-recessed/60 border border-border-rule text-[12px] font-mono">
            <button
              onClick={() => setViewMode("globe")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                viewMode === "globe"
                  ? "bg-ink-primary text-white font-semibold shadow-xs"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              <Globe size={14} />
              <span>3D Globe</span>
            </button>
            <button
              onClick={() => setViewMode("flat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                viewMode === "flat"
                  ? "bg-ink-primary text-white font-semibold shadow-xs"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
            >
              <MapIcon size={14} />
              <span>Flat Map</span>
            </button>
          </div>

        </div>
      </div>

      {/* =======================================================================
          SUB-BAR: PRODUCT PICKER & CORRIDOR FOCUS PRESETS (ZERO OVERLAP GUARANTEED)
      ======================================================================= */}
      <div className="px-4 py-3 bg-surface-recessed/30 border-b border-border-rule flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-[12px]">
        {/* Left: Product Picker with strict max-width constraints */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
          <span className="text-ink-muted font-mono shrink-0 flex items-center gap-1.5">
            <Layers size={13} className="text-btn-cta" />
            <span>Product HTS:</span>
          </span>
          <div className="relative min-w-0 w-full sm:w-auto flex-1 max-w-full sm:max-w-md xl:max-w-lg">
            <select
              value={selectedProduct.code}
              onChange={(e) => {
                const found = HTS_PRODUCTS.find((p) => p.code === e.target.value);
                if (found) setSelectedProduct(found);
              }}
              className="w-full bg-surface-sheet text-ink-primary border border-border-rule rounded px-3 py-1.5 text-[12px] font-mono focus:outline-hidden focus:border-btn-cta cursor-pointer truncate shadow-xs"
            >
              {HTS_PRODUCTS.map((p) => (
                <option key={p.code} value={p.code}>
                  HTS {p.code} • {p.name} ({p.bomItem})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Corridor Focus Chips with dedicated wrapping space */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono shrink-0 pt-1 xl:pt-0">
          <span className="text-ink-muted mr-1 hidden sm:inline">Corridor Focus:</span>
          <button
            onClick={() => focusCorridor(115, 20, "vietnam")}
            className={`px-2.5 py-1 rounded border transition-colors ${
              centerLon > 60 && centerLon < 160
                ? "bg-btn-cta text-white border-btn-cta font-medium shadow-xs"
                : "bg-surface-sheet text-ink-secondary border-border-rule hover:text-ink-primary hover:bg-surface-recessed"
            }`}
          >
            Transpacific Asia
          </button>
          <button
            onClick={() => focusCorridor(15, 45, "germany")}
            className={`px-2.5 py-1 rounded border transition-colors ${
              centerLon > -30 && centerLon < 60
                ? "bg-btn-cta text-white border-btn-cta font-medium shadow-xs"
                : "bg-surface-sheet text-ink-secondary border-border-rule hover:text-ink-primary hover:bg-surface-recessed"
            }`}
          >
            Transatlantic Europe
          </button>
          <button
            onClick={() => focusCorridor(-100, 30, "mexico")}
            className={`px-2.5 py-1 rounded border transition-colors ${
              centerLon < -60 && centerLon > -140
                ? "bg-btn-cta text-white border-btn-cta font-medium shadow-xs"
                : "bg-surface-sheet text-ink-secondary border-border-rule hover:text-ink-primary hover:bg-surface-recessed"
            }`}
          >
            Nearshore Americas
          </button>
        </div>
      </div>

      {/* =======================================================================
          MAIN WORKSPACE: REALISTIC GLOBE / MAP & INSPECTION PANEL
      ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* Globe Surface Column (7 Cols on desktop) */}
        <div 
          ref={containerRef}
          className="lg:col-span-7 bg-[#F4F1EA] relative flex items-center justify-center min-h-[340px] sm:min-h-[460px] p-2 select-none overflow-hidden border-b lg:border-b-0 lg:border-r border-border-rule"
          onMouseDown={(e) => onPointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 1) {
              onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={onPointerUp}
          style={{ touchAction: "none" }}
        >
          {/* Subtle Archival Nautical Coordinate Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: "radial-gradient(rgba(26, 23, 20, 0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />
          {/* Soft Vignette Depth */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(223,218,207,0.4)_100%)]" />

          {/* Floating Auto-Spin Feedback Pill */}
          {clickFeedback && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#17202E]/95 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-[11px] font-mono shadow-lg flex items-center gap-1.5 pointer-events-none backdrop-blur-xs">
              {isAutoRotating ? <Play size={11} className="fill-emerald-400" /> : <Pause size={11} className="fill-amber-400 text-amber-400" />}
              <span className={isAutoRotating ? "text-emerald-300 font-semibold" : "text-amber-300 font-semibold"}>
                {clickFeedback}
              </span>
            </div>
          )}

          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            className={`cursor-grab active:cursor-grabbing w-full h-auto ${viewMode === "globe" ? "max-h-[480px]" : "max-h-[440px]"}`}
            viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          >
            <defs>
              {/* Realistic Ocean Depth Spherical Gradient */}
              <radialGradient id="realOceanGradient" cx="38%" cy="35%" r="68%">
                <stop offset="0%" stopColor="#1A2536" />
                <stop offset="45%" stopColor="#121924" />
                <stop offset="80%" stopColor="#0C1018" />
                <stop offset="100%" stopColor="#06080D" />
              </radialGradient>

              {/* Atmospheric Edge Glow Gradient */}
              <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="88%" stopColor="#48C78E" stopOpacity="0" />
                <stop offset="96%" stopColor="#48C78E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.45" />
              </radialGradient>

              {/* Specular Sun Glint on Upper Ocean */}
              <radialGradient id="specularGlint" cx="36%" cy="32%" r="40%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Clip path for 3D Globe Sphere */}
              <clipPath id="globeSphereClip">
                <path d={spherePath} />
              </clipPath>

              {/* Glowing Route Pulse */}
              <linearGradient id="vesselRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#48C78E" stopOpacity="0.4" />
                <stop offset="65%" stopColor="#48C78E" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* 3D GLOBE MODE */}
            {viewMode === "globe" ? (
              <>
                {/* External Atmospheric Halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 14}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  opacity="0.35"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 4}
                  fill="none"
                  stroke="#48C78E"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Ocean Sphere Surface */}
                <path
                  d={spherePath}
                  fill="url(#realOceanGradient)"
                  stroke="#253347"
                  strokeWidth="1.5"
                />

                {/* Clipped Real World Features */}
                <g clipPath="url(#globeSphereClip)">
                  {/* Specular Ambient Reflection */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="url(#specularGlint)"
                    className="pointer-events-none"
                  />

                  {/* Latitude & Longitude Graticules */}
                  <path
                    d={graticulePath}
                    fill="none"
                    stroke="#253245"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                    opacity="0.8"
                  />

                  {/* Real World Country Polygons (177 Sovereign Nations) */}
                  {worldGeoData.features.map((feature: any) => {
                    const featureId = String(feature.id);
                    const isSelected = selectedCountry.numericId === featureId;
                    const hub = numericIdToHub.get(featureId);
                    const isDestination = featureId === DESTINATION_PORT.numericId;

                    // Shading logic: selected country gets emerald highlight, known hubs get tint
                    let fill = "#272E3A"; // Default realistic landmass slate
                    let stroke = "#3D4A5E";
                    let strokeWidth = 0.6;

                    if (isSelected) {
                      fill = "#0F663E"; // Emerald green for active sourcing origin
                      stroke = "#48C78E";
                      strokeWidth = 1.4;
                    } else if (isDestination) {
                      fill = "#2A2C38"; // US Destination slate
                      stroke = "#F59E0B";
                      strokeWidth = 1.0;
                    } else if (hub) {
                      fill = "#313B4D"; // Sourcing partner tint
                      stroke = "#546682";
                      strokeWidth = 0.8;
                    }

                    const d = pathGenerator(feature);
                    if (!d) return null;

                    return (
                      <path
                        key={feature.id}
                        d={d}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        className="transition-colors duration-150 cursor-pointer"
                        onMouseEnter={() => {
                          if (hub) setHoveredCountry(hub);
                        }}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hub) {
                            setSelectedCountry(hub);
                            setIsAutoRotating(false);
                            showFeedback(`Inspecting ${hub.name}`);
                          }
                        }}
                      />
                    );
                  })}

                  {/* Great Circle Maritime Route */}
                  {routePathData && (
                    <path
                      d={routePathData}
                      fill="none"
                      stroke="url(#vesselRouteGradient)"
                      strokeWidth="2.6"
                      strokeDasharray="6 3"
                      className="animate-pulse"
                    />
                  )}

                  {/* In-Transit Container Vessel on Route */}
                  {projectedVesselPoint && isCoordVisible(currentVesselCoord[0], currentVesselCoord[1]) && (
                    <g transform={`translate(${projectedVesselPoint[0]}, ${projectedVesselPoint[1]})`}>
                      <circle r="8" fill="#48C78E" fillOpacity="0.3" className="animate-ping" />
                      <circle r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                      <g transform="translate(8, -8)">
                        <rect x="-2" y="-10" width="86" height="14" rx="3" fill="#0F172A" fillOpacity="0.9" stroke="#10B981" strokeWidth="0.8" />
                        <text x="2" y="1" fill="#6EE7B7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          MSKU-90812 (ETA 11/24)
                        </text>
                      </g>
                    </g>
                  )}

                  {/* Internal Atmospheric Rim Glow */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="url(#atmosphereGlow)"
                    className="pointer-events-none"
                  />
                </g>
              </>
            ) : (
              /* FLAT MAP MODE: REALISTIC EQUIRECTANGULAR CARTOGRAPHY */
              <g>
                {/* Flat Ocean Background */}
                <rect
                  x="16"
                  y="16"
                  width={canvasSize.width - 32}
                  height={canvasSize.height - 32}
                  fill="#121924"
                  stroke="#2E3A4E"
                  strokeWidth="1.5"
                  rx="6"
                />

                {/* Flat Graticules */}
                <path
                  d={graticulePath}
                  fill="none"
                  stroke="#1E2A3C"
                  strokeWidth="0.7"
                  strokeDasharray="2 4"
                />

                {/* All 177 Real Countries on Flat Map */}
                {worldGeoData.features.map((feature: any) => {
                  const featureId = String(feature.id);
                  const isSelected = selectedCountry.numericId === featureId;
                  const hub = numericIdToHub.get(featureId);
                  const isDestination = featureId === DESTINATION_PORT.numericId;

                  let fill = "#272E3A";
                  let stroke = "#3D4A5E";
                  let strokeWidth = 0.6;

                  if (isSelected) {
                    fill = "#0F663E";
                    stroke = "#48C78E";
                    strokeWidth = 1.4;
                  } else if (isDestination) {
                    fill = "#2A2C38";
                    stroke = "#F59E0B";
                    strokeWidth = 1.0;
                  } else if (hub) {
                    fill = "#313B4D";
                    stroke = "#546682";
                    strokeWidth = 0.8;
                  }

                  const d = pathGenerator(feature);
                  if (!d) return null;

                  return (
                    <path
                      key={feature.id}
                      d={d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      className="transition-colors duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hub) setSelectedCountry(hub);
                      }}
                    />
                  );
                })}

                {/* Active Shipping Route on Flat Map */}
                {routePathData && (
                  <path
                    d={routePathData}
                    fill="none"
                    stroke="url(#vesselRouteGradient)"
                    strokeWidth="2.2"
                    strokeDasharray="5 3"
                  />
                )}

                {/* Flat Map Vessel Icon */}
                {projectedVesselPoint && (
                  <g transform={`translate(${projectedVesselPoint[0]}, ${projectedVesselPoint[1]})`}>
                    <circle r="7" fill="#48C78E" fillOpacity="0.35" className="animate-ping" />
                    <circle r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                )}
              </g>
            )}

            {/* Destination Port Marker: Port of Los Angeles */}
            {(() => {
              const destPt = activeProjection([DESTINATION_PORT.lon, DESTINATION_PORT.lat]);
              if (!destPt) return null;
              if (viewMode === "globe" && !isCoordVisible(DESTINATION_PORT.lon, DESTINATION_PORT.lat)) return null;

              return (
                <g transform={`translate(${destPt[0]}, ${destPt[1]})`} className="pointer-events-none">
                  <circle r="8" fill="#F59E0B" fillOpacity="0.25" className="animate-ping" />
                  <circle r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                  <g transform="translate(8, 3)">
                    <rect x="-2" y="-11" width="86" height="15" rx="3" fill="#0F172A" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="0.8" />
                    <text x="2" y="0" fill="#FDE68A" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      PORT LA (USLAX)
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* Sourcing Hub Origin Pins */}
            {ORIGIN_HUBS.map((hub) => {
              const pt = activeProjection([hub.lon, hub.lat]);
              if (!pt) return null;
              if (viewMode === "globe" && !isCoordVisible(hub.lon, hub.lat)) return null;

              const isSelected = selectedCountry.id === hub.id;
              const rate = (selectedProduct.baseRatesByCountry[hub.id] ?? hub.baseRate) +
                hub.section301 +
                hub.reciprocalProposal * activeMilestone.reciprocalFactor;
              const displayRate = Math.round(rate * 10) / 10;

              return (
                <g
                  key={hub.id}
                  transform={`translate(${pt[0]}, ${pt[1]})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCountry(hub);
                    setIsAutoRotating(false);
                    showFeedback(`Focused on ${hub.name}`);
                  }}
                  className="cursor-pointer group"
                >
                  {isSelected && (
                    <circle r="13" fill="#48C78E" fillOpacity="0.3" className="animate-pulse" />
                  )}

                  <circle
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? "#48C78E" : "#94A3B8"}
                    stroke={isSelected ? "#FFFFFF" : "#0F172A"}
                    strokeWidth="1.5"
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Country Name & Live Rate Tag */}
                  <g transform="translate(8, -2)">
                    <rect
                      x="-2"
                      y="-10"
                      width={displayRate > 0 ? 76 : 58}
                      height="15"
                      rx="3"
                      fill="#0F172A"
                      fillOpacity="0.9"
                      stroke={isSelected ? "#48C78E" : "#334155"}
                      strokeWidth="1"
                    />
                    <text
                      x="2"
                      y="1"
                      fill={isSelected ? "#FFFFFF" : "#E2E8F0"}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {hub.code} {displayRate > 0 ? `${displayRate}%` : "0%"}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Interactive Drag & Auto-Spin Guide Cue Badge */}
          <div className="absolute bottom-3 left-3 bg-[#1C1814]/90 backdrop-blur-xs px-2.5 py-1.5 rounded border border-[#35302B] text-[10px] font-mono text-[#9E978E] flex items-center gap-2">
            <Compass size={13} className={`text-btn-cta ${isAutoRotating ? "animate-spin-slow" : ""}`} />
            <span>
              {viewMode === "globe"
                ? "Drag to rotate • Click globe to pause/resume spin"
                : "Equirectangular 177-Country Projection"}
            </span>
          </div>

          {/* Reset View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              focusCorridor(115, 20, "vietnam");
              setIsAutoRotating(true);
              showFeedback("Reset View & Auto-Spin Active");
            }}
            className="absolute bottom-3 right-3 p-1.5 rounded bg-[#1C1814]/90 border border-[#35302B] text-[#9E978E] hover:text-white transition-colors"
            title="Reset View to Asia Hub & Restart Spin"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Right Inspection Column (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-sheet border-t lg:border-t-0 lg:border-l border-border-rule p-4 sm:p-5 lg:p-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Country Header */}
            <div className="flex items-start justify-between pb-3 border-b border-border-rule">
              <div>
                <span className="font-mono text-[10px] text-btn-cta uppercase tracking-wider block font-semibold">
                  Origin Country & Port of Lading
                </span>
                <h4 className="font-serif text-[22px] sm:text-[24px] font-bold text-ink-primary mt-0.5">
                  {selectedCountry.name} ({selectedCountry.code})
                </h4>
                <div className="text-[12px] font-sans text-ink-secondary mt-0.5">
                  Primary Port: <span className="font-mono text-ink-primary font-medium">{selectedCountry.port}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-ink-muted block">Transit to LA</span>
                <span className="font-mono text-[15px] font-bold text-btn-cta">
                  {selectedCountry.transitDaysToLA} Days
                </span>
              </div>
            </div>

            {/* Duty Breakdown */}
            <div className="space-y-2">
              <span className="font-sans text-[11px] text-ink-muted uppercase tracking-wider block font-semibold">
                Statutory Duty Components ({selectedProduct.code})
              </span>
              
              <div className="p-3 bg-surface-recessed/40 rounded border border-border-rule space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-ink-secondary">1. Base Column 1 (MFN):</span>
                  <span className="font-mono tabular-nums text-ink-primary font-medium">{calculatedDuties.baseRate.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-sans text-ink-secondary">2. Section 301 Surcharge:</span>
                  <span className={`font-mono tabular-nums ${calculatedDuties.sec301Rate > 0 ? "text-friction-crimson font-semibold" : "text-ink-muted"}`}>
                    {calculatedDuties.sec301Rate > 0 ? `+${calculatedDuties.sec301Rate.toFixed(1)}%` : "0.0%"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-sans text-ink-secondary">3. Reciprocal Action ({activeMilestone.label}):</span>
                  <span className={`font-mono tabular-nums ${calculatedDuties.reciprocalEffective > 0 ? "text-amber-700 font-semibold" : "text-ink-muted"}`}>
                    {calculatedDuties.reciprocalEffective > 0 ? `+${calculatedDuties.reciprocalEffective.toFixed(1)}%` : "0.0% (Stayed)"}
                  </span>
                </div>

                <div className="pt-2 border-t border-border-rule flex items-center justify-between text-[14px]">
                  <span className="font-serif text-ink-primary font-semibold">Total Landed Duty Rate:</span>
                  <span className="font-mono font-bold text-btn-cta text-[17px]">
                    {calculatedDuties.totalRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Active In-Transit Shipment Alert */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Ship size={14} className="text-amber-700" />
                  ACTIVE SHIPMENT IN TRANSIT
                </span>
                <span className="text-ink-secondary">{selectedCountry.samplePoNumber}</span>
              </div>

              <div className="font-sans text-[13px] text-ink-secondary leading-snug">
                Vessel <span className="font-semibold text-ink-primary">CMA CGM Marco Polo</span> carrying 420x {selectedProduct.bomItem} units.
                Estimated arrival at Pier 400: <span className="font-semibold text-ink-primary">Nov 24, 2026</span>.
              </div>

              <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono">
                {timelineStep === 2 ? (
                  <>
                    <span className="text-friction-crimson font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Exceeds Dec 01 Enactment
                    </span>
                    <span className="text-friction-crimson font-bold">
                      +${calculatedDuties.exposureDelta.toLocaleString()} Cash Delta
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-btn-cta font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Arrives Inside Stay Window
                    </span>
                    <span className="text-ink-secondary">
                      Duty: ${calculatedDuties.totalDutyCost.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Sourcing Action CTA */}
          <div className="pt-3 border-t border-border-rule flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-ink-muted font-mono truncate max-w-[220px] sm:max-w-none">
              Route: {selectedCountry.typicalVesselRoute}
            </span>
            <span className="text-btn-cta font-mono font-medium flex items-center gap-1 hover:underline cursor-pointer shrink-0">
              Alternative Port <ArrowRight size={12} />
            </span>
          </div>

        </div>

      </div>

      {/* =======================================================================
          BOTTOM TIMELINE SCRUBBER: STATUTORY ENFORCEMENT DATE CONTROL
      ======================================================================= */}
      <div className="p-4 sm:p-5 bg-surface-canvas/60 border-t border-border-rule space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-btn-cta" />
            <span className="uppercase text-ink-primary font-semibold tracking-wider">
              Regulatory Enforcement Timeline Scrubber:
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/30">
              {activeMilestone.statusBadge}
            </span>
          </div>
          <div className="text-ink-muted">
            Effective Date: <span className="text-ink-primary font-medium">{activeMilestone.dateStr}</span>
          </div>
        </div>

        <div className="relative pt-2 pb-1 px-1">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={timelineStep}
            onChange={(e) => setTimelineStep(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-surface-recessed rounded-lg appearance-none cursor-pointer accent-btn-cta"
          />

          <div className="grid grid-cols-3 text-center mt-2 font-mono text-[11px] gap-2">
            {MILESTONES.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setTimelineStep(idx)}
                className={`text-left sm:text-center transition-colors ${
                  timelineStep === idx ? "text-btn-cta font-bold" : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                <div className="font-semibold">{m.label}</div>
                <div className="text-[10px] text-ink-muted/80 hidden sm:block">{m.summary}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Info size={12} className="text-btn-cta shrink-0" />
            <span>{activeMilestone.description}</span>
          </div>
          <div className="text-[10px] text-ink-muted/80 shrink-0">
            Source: USITC HTS & Federal Register Feeds
          </div>
        </div>
      </div>
    </div>
  );
}
