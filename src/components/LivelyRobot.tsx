"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Robot3DCanvas = dynamic(
  () => import("@/components/Robot3DCanvas").then((mod) => mod.Robot3DCanvas),
  { ssr: false }
);

interface LivelyRobotProps {
  size?: "sm" | "md" | "lg" | "xl" | "mascot";
  className?: string;
  isStreaming?: boolean;
  interactive?: boolean;
  forceWave?: boolean;
  trackCursor?: boolean;
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
}

export function LivelyRobot({
  size = "md",
  className = "",
  isStreaming = false,
  interactive = true,
  forceWave = false,
  trackCursor = true,
  showSpeechBubble = false,
  speechText = "Hi! Ask me anything",
  onClick,
}: LivelyRobotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lookPos, setLookPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(showSpeechBubble);
  const [is3DReady, setIs3DReady] = useState(false);

  // Dimension mapping
  const dimensionMap = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-18 h-18",
    mascot: "w-24 h-26 sm:w-28 sm:h-30",
  };

  const dim = dimensionMap[size] || dimensionMap.md;
  const isLargeMascot = size === "mascot" || size === "xl";

  // Real-time cursor tracking across viewport
  useEffect(() => {
    if (!trackCursor || typeof window === "undefined") return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 4) {
        targetX = 0;
        targetY = 0;
      } else {
        const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.7;
        targetX = Math.max(-1, Math.min(1, deltaX / Math.min(maxDist, 550)));
        targetY = Math.max(-1, Math.min(1, deltaY / Math.min(maxDist, 450)));
      }
    };

    // Smooth lerp animation loop
    const animate = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      setLookPos({
        x: Math.round(currentX * 100) / 100,
        y: Math.round(currentY * 100) / 100,
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [trackCursor]);

  // Click bounce reaction
  const handleClick = (e: React.MouseEvent) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    if (onClick) onClick();
  };

  // 3D physics angles calculated from cursor position
  const rotateY = lookPos.x * (isLargeMascot ? 26 : 18);
  const rotateX = -lookPos.y * (isLargeMascot ? 20 : 14);
  const eyeShiftX = lookPos.x * (isLargeMascot ? 5 : 3);
  const eyeShiftY = lookPos.y * (isLargeMascot ? 3.5 : 2.2);

  // Dynamic 3D lighting coordinates that move across the metallic spherical shell
  const lightX = 26 + lookPos.x * 12;
  const lightY = 16 + lookPos.y * 10;
  const torsoLightX = 28 + lookPos.x * 10;
  const torsoLightY = 42 + lookPos.y * 8;

  // 3D side bevel extrusion widths (shows physical thickness as robot turns)
  const leftBevelWidth = Math.max(0, -lookPos.x * 3.5);
  const rightBevelWidth = Math.max(0, lookPos.x * 3.5);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        setBubbleVisible(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setBubbleVisible(showSpeechBubble);
      }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dim} ${className} ${
        interactive ? "cursor-pointer" : ""
      } transition-transform duration-300 ${isClicked ? "scale-90" : isHovered ? "scale-105" : "scale-100"}`}
      style={{ perspective: "450px" }}
      aria-label="Quant Fusion 3D AI Assistant Robot"
    >
      <style jsx>{`
        /* Idle occasional wave */
        @keyframes robotWaveIdle {
          0%, 68%, 100% {
            transform: rotate(0deg);
          }
          72% {
            transform: rotate(-36deg) translateY(-2px);
          }
          76% {
            transform: rotate(-10deg) translateY(-1px);
          }
          80% {
            transform: rotate(-34deg) translateY(-2px);
          }
          84% {
            transform: rotate(-12deg) translateY(-1px);
          }
          88% {
            transform: rotate(-30deg) translateY(-2px);
          }
          93% {
            transform: rotate(0deg);
          }
        }

        /* Continuous friendly wave when streaming, hovered, or forced */
        @keyframes robotWaveActive {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-38deg) translateY(-2.5px);
          }
          50% {
            transform: rotate(-12deg) translateY(-1px);
          }
          75% {
            transform: rotate(-34deg) translateY(-2px);
          }
        }

        /* 3D floating hover physics with slight roll */
        @keyframes robotFloat3D {
          0%, 100% {
            transform: translateY(0px) rotateZ(0deg);
          }
          50% {
            transform: translateY(-5px) rotateZ(1.2deg);
          }
        }

        /* Dynamic 3D ground contact shadow */
        @keyframes shadowScale3D {
          0%, 100% {
            transform: scale(1);
            opacity: 0.38;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.2;
          }
        }

        /* Digital LED eyes natural blink */
        @keyframes robotBlink {
          0%, 93%, 100% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.1);
          }
        }

        /* Antenna beacon glow pulse */
        @keyframes antennaPulse {
          0%, 100% {
            opacity: 0.85;
            filter: drop-shadow(0 0 3px #10B981);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 7px #34D399) drop-shadow(0 0 12px #10B981);
          }
        }

        /* Anti-gravity plasma thruster pulse */
        @keyframes plasmaThrusterPulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.15);
          }
        }

        /* Radar ping when actively streaming */
        @keyframes radarPing {
          0% {
            r: 4px;
            opacity: 0.9;
          }
          100% {
            r: 15px;
            opacity: 0;
          }
        }

        .robot-floating-3d {
          animation: robotFloat3D 3.2s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .robot-shadow-core {
          animation: shadowScale3D 3.2s ease-in-out infinite;
          transform-origin: 32px 61px;
        }

        .robot-blinking-eyes {
          transform-origin: 32px 24px;
          animation: robotBlink 4.6s ease-in-out infinite;
        }

        .robot-antenna-tip {
          animation: antennaPulse 2.2s ease-in-out infinite;
        }

        .robot-thruster-glow {
          animation: plasmaThrusterPulse 1.8s ease-in-out infinite;
          transform-origin: 32px 58px;
        }

        .robot-arm-waving {
          transform-origin: 49px 38px;
          animation: ${isStreaming || forceWave || isHovered
            ? "robotWaveActive 0.85s ease-in-out infinite"
            : "robotWaveIdle 8.5s ease-in-out infinite"};
        }
      `}</style>

      {/* Optional Speech Bubble Tooltip (Mascot Mode) */}
      {isLargeMascot && bubbleVisible && (
        <div
          className="absolute -top-12 right-0 sm:right-2 z-50 pointer-events-none transform -translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="relative px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-[11px] font-sans font-medium shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>{speechText}</span>
            <span className="ml-1 px-1 py-0.2 rounded bg-white/10 text-[9px] font-mono text-slate-300">
              ⌘K
            </span>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-950/95 border-b border-r border-emerald-500/40 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Real WebGL 3D Mesh Layer for Large Mascot & XL with Full 360° Orbit */}
      {isLargeMascot && (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            is3DReady ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Robot3DCanvas
            size={size}
            isStreaming={isStreaming}
            interactive={interactive}
            forceWave={forceWave}
            trackCursor={trackCursor}
            onClick={onClick}
            onReady={() => setIs3DReady(true)}
          />
        </div>
      )}

      {/* Instant 0ms Vector Placeholder (Kept active for small sizes and initial load) */}
      <svg
        viewBox="0 0 64 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible drop-shadow-[0_14px_28px_rgba(0,0,0,0.45)] transition-opacity duration-300 ${
          is3DReady && isLargeMascot ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <defs>
          {/* Dynamic 3D Spherical Head Gradient with Specular Keylight */}
          <radialGradient
            id="headSphere3D"
            cx={`${lightX}`}
            cy={`${lightY}`}
            r="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="14%" stopColor="#64748B" />
            <stop offset="36%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="92%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#050811" />
          </radialGradient>

          {/* 3D Head Specular Glare Gradient */}
          <radialGradient id="headGlossGrad" cx="0.4" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#CBD5E1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
          </radialGradient>

          {/* 3D Head Rim Specular Reflection */}
          <linearGradient id="headRimGrad" x1="16" y1="12" x2="48" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#64748B" stopOpacity="0.3" />
            <stop offset="85%" stopColor="#0F172A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.45" />
          </linearGradient>

          {/* 3D Visor Outer Bezel Chamfer */}
          <linearGradient id="visorBezelGrad" x1="17" y1="14" x2="47" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="30%" stopColor="#1E293B" />
            <stop offset="80%" stopColor="#0B0F19" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Deep Visor Screen Glass Cavity */}
          <radialGradient id="visorCavityGrad" cx="32" cy="23" r="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A111E" />
            <stop offset="65%" stopColor="#040812" />
            <stop offset="100%" stopColor="#010307" />
          </radialGradient>

          {/* 3D Convex Glass Dome Reflection (Curved Acrylic Bubble) */}
          <linearGradient id="visorGlassGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#E0F2FE" stopOpacity="0.28" />
            <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* 3D Torso Capsule Spherical Gradient */}
          <radialGradient
            id="torsoSphere3D"
            cx={`${torsoLightX}`}
            cy={`${torsoLightY}`}
            r="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="16%" stopColor="#64748B" />
            <stop offset="42%" stopColor="#334155" />
            <stop offset="76%" stopColor="#1E293B" />
            <stop offset="94%" stopColor="#0D1322" />
            <stop offset="100%" stopColor="#04070F" />
          </radialGradient>

          {/* Metallic Ball Joint Gradient */}
          <radialGradient id="ballJointGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="40%" stopColor="#475569" />
            <stop offset="85%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B0F19" />
          </radialGradient>

          {/* Cylindrical Dial Metallic Gradients */}
          <linearGradient id="dialGradLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="35%" stopColor="#94A3B8" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="dialGradRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="65%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Thruster Bell Metallic Nozzle Gradient */}
          <linearGradient id="thrusterNozzleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="85%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0A0F1D" />
          </linearGradient>

          {/* Soft Diffused Floor Shadow Filter */}
          <filter id="softFloorShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" />
          </filter>
          <filter id="tightCoreShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>

          {/* Emerald Eye Glow Filter */}
          <filter id="eyeGlow3D" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Antenna Flare Glow */}
          <filter id="beaconGlow3D" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Volumetric Thruster Plasma Glow */}
          <filter id="thrusterGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ground Contact Shadow (Multi-tier blurred Gaussian projection) */}
        <g className="robot-shadow-core">
          {/* Broad soft ambient shadow */}
          <ellipse
            cx="32"
            cy="62.5"
            rx="18"
            ry="4.2"
            fill="#020617"
            opacity="0.35"
            filter="url(#softFloorShadow)"
          />
          {/* Concentrated tight contact core shadow */}
          <ellipse
            cx="32"
            cy="62.5"
            rx="10"
            ry="2.4"
            fill="#000000"
            opacity="0.55"
            filter="url(#tightCoreShadow)"
          />
        </g>

        {/* Floating Root Body Group with 3D Parallax */}
        <g className="robot-floating-3d">
          
          {/* ================= 3D ANTENNA ================= */}
          <g
            style={{
              transform: `perspective(450px) rotateX(${rotateX * 0.8}deg) rotateY(${rotateY * 0.8}deg)`,
              transformOrigin: "32px 14px",
              transition: "transform 0.08s ease-out",
            }}
          >
            {/* Cylindrical Turret Socket Base with Bevel */}
            <ellipse cx="32" cy="12.5" rx="3.5" ry="1.4" fill="#1E293B" stroke="#0F172A" strokeWidth="0.5" />
            <ellipse cx="32" cy="12" rx="2.8" ry="1" fill="#475569" />
            <ellipse cx="32" cy="11.8" rx="1.8" ry="0.6" fill="#0B0F19" />

            {/* Tapered Chrome Stem with Side Highlight */}
            <path
              d="M 31.2 12 L 31.6 5.5 L 32.4 5.5 L 32.8 12 Z"
              fill="#64748B"
              stroke="#1E293B"
              strokeWidth="0.4"
            />
            {/* Stem Specular Highlight */}
            <line x1="31.8" y1="11.5" x2="31.8" y2="6" stroke="#E2E8F0" strokeWidth="0.5" strokeLinecap="round" />

            {/* Radar ripple rings when actively streaming */}
            {isStreaming && (
              <circle
                cx="32"
                cy="4.5"
                r="7"
                fill="none"
                stroke="#10B981"
                strokeWidth="1.2"
                style={{ animation: "radarPing 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite" }}
              />
            )}

            {/* Glowing 3D Beacon Tip with Spherical Shading */}
            <circle
              cx="32"
              cy="4.5"
              r="4.2"
              fill="#10B981"
              filter="url(#beaconGlow3D)"
              className="robot-antenna-tip"
            />
            {/* Spherical Inner Core Highlight */}
            <circle cx="31.2" cy="3.6" r="2.2" fill="#34D399" />
            <circle cx="30.6" cy="3" r="1.1" fill="#FFFFFF" />
          </g>

          {/* ================= 3D INTERACTIVE HEAD CHASSIS ================= */}
          <g
            style={{
              transform: `perspective(450px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformOrigin: "32px 24px",
              transition: "transform 0.08s ease-out",
            }}
          >
            {/* 3D Extrusion Side Flanks (give physical depth when rotating left or right) */}
            {leftBevelWidth > 0 && (
              <path
                d={`M 15 13 C 14 13, ${15 - leftBevelWidth} 17, ${15 - leftBevelWidth} 24 C ${15 - leftBevelWidth} 31, 14 35, 15 35 Z`}
                fill="#070B14"
                stroke="#1E293B"
                strokeWidth="0.8"
              />
            )}
            {rightBevelWidth > 0 && (
              <path
                d={`M 49 13 C 50 13, ${49 + rightBevelWidth} 17, ${49 + rightBevelWidth} 24 C ${49 + rightBevelWidth} 31, 50 35, 49 35 Z`}
                fill="#070B14"
                stroke="#1E293B"
                strokeWidth="0.8"
              />
            )}

            {/* 3D Outer Head Shell (Volumetric Capsule with Spherical Normal Gradient) */}
            <rect
              x="15"
              y="12"
              width="34"
              height="23"
              rx="9.5"
              fill="url(#headSphere3D)"
              stroke="url(#headRimGrad)"
              strokeWidth="1.4"
            />

            {/* Volumetric Top-Left Specular Gloss Spot */}
            <ellipse
              cx="25"
              cy="15"
              rx="6"
              ry="2"
              transform="rotate(-8 25 15)"
              fill="url(#headGlossGrad)"
              opacity="0.8"
            />

            {/* Top Curvature Rim Light Reflection */}
            <path
              d="M 21 13.8 Q 32 12.6 43 13.8"
              stroke="#F1F5F9"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Bottom ambient thruster bounce light */}
            <path
              d="M 21 34 Q 32 35.5 43 34"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* ================= 3D CYLINDRICAL EAR DIALS ================= */}
            {/* Left Ear Assembly */}
            <g transform="translate(10.5, 17)">
              {/* Ear base connector cylinder */}
              <rect x="1" y="1" width="4.5" height="10" rx="1.5" fill="url(#dialGradLeft)" stroke="#0F172A" strokeWidth="0.7" />
              {/* Outer circular dial plate */}
              <ellipse cx="1.5" cy="6" rx="1.4" ry="4.5" fill="#475569" stroke="#64748B" strokeWidth="0.6" />
              <ellipse cx="1.5" cy="6" rx="0.7" ry="2.2" fill="#1E293B" />
              {/* Accent indicator line */}
              <line x1="2.8" y1="2.5" x2="2.8" y2="9.5" stroke="#CBD5E1" strokeWidth="0.7" strokeLinecap="round" />
            </g>

            {/* Right Ear Assembly */}
            <g transform="translate(48, 17)">
              {/* Ear base connector cylinder */}
              <rect x="0" y="1" width="4.5" height="10" rx="1.5" fill="url(#dialGradRight)" stroke="#0F172A" strokeWidth="0.7" />
              {/* Outer circular dial plate */}
              <ellipse cx="4.5" cy="6" rx="1.4" ry="4.5" fill="#475569" stroke="#64748B" strokeWidth="0.6" />
              <ellipse cx="4.5" cy="6" rx="0.7" ry="2.2" fill="#1E293B" />
              {/* Accent indicator line */}
              <line x1="1.8" y1="2.5" x2="1.8" y2="9.5" stroke="#CBD5E1" strokeWidth="0.7" strokeLinecap="round" />
            </g>

            {/* ================= 3D RECESSED VISOR HELMET ================= */}
            {/* 1. Visor Outer Bezel Chamfer Frame */}
            <rect
              x="17.5"
              y="15"
              width="29"
              height="17"
              rx="6.5"
              fill="url(#visorBezelGrad)"
              stroke="#0B0F19"
              strokeWidth="0.8"
            />

            {/* 2. Deep Cavity Chamber (Recessed Inner Void) */}
            <rect
              x="18.8"
              y="16.2"
              width="26.4"
              height="14.6"
              rx="5.2"
              fill="url(#visorCavityGrad)"
              stroke="#000000"
              strokeWidth="1.2"
            />

            {/* Ambient internal eye bounce glow inside chamber */}
            <ellipse
              cx={`${32 + eyeShiftX * 0.6}`}
              cy={`${23.5 + eyeShiftY * 0.6}`}
              rx="10"
              ry="5"
              fill="#10B981"
              opacity="0.12"
            />

            {/* 3. Recessed Glowing Holographic Digital Eyes */}
            <g
              className="robot-blinking-eyes"
              style={{
                transform: `translate(${eyeShiftX}px, ${eyeShiftY}px)`,
                transition: "transform 0.08s ease-out",
              }}
            >
              {isHovered ? (
                /* Cheerful Arc Eyes (^ _ ^) */
                <g filter="url(#eyeGlow3D)">
                  <path
                    d="M 22.5 24.5 Q 25.5 20.2 28.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 35.5 24.5 Q 38.5 20.2 41.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              ) : (
                /* High-Intensity 3D Emerald Pupils with Specular Center Glow */
                <g filter="url(#eyeGlow3D)">
                  {/* Left Eye */}
                  <rect x="23" y="20.2" width="5.8" height="6.6" rx="2.8" fill="#10B981" />
                  <rect x="23.6" y="20.8" width="4.6" height="5.4" rx="2.2" fill="#34D399" />
                  <circle cx="24.6" cy="21.8" r="1.3" fill="#FFFFFF" />
                  <circle cx="27" cy="25" r="0.7" fill="#A7F3D0" opacity="0.9" />

                  {/* Right Eye */}
                  <rect x="35.2" y="20.2" width="5.8" height="6.6" rx="2.8" fill="#10B981" />
                  <rect x="35.8" y="20.8" width="4.6" height="5.4" rx="2.2" fill="#34D399" />
                  <circle cx="36.8" cy="21.8" r="1.3" fill="#FFFFFF" />
                  <circle cx="39.2" cy="25" r="0.7" fill="#A7F3D0" opacity="0.9" />
                </g>
              )}

              {/* Digital LED Status Smile */}
              <path
                d="M 28 28.6 Q 32 31.4 36 28.6"
                stroke="#34D399"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                filter="url(#eyeGlow3D)"
              />
            </g>

            {/* 4. CONVEX ACRYLIC / GLASS DOME REFLECTIONS (Rendered on top of eyes for authentic 3D depth) */}
            {/* Curved Upper Dome Specular Arc */}
            <path
              d="M 20 17.2 C 24 16.2, 40 16.2, 44 17.2 C 43 21.5, 21 21.5, 20 17.2 Z"
              fill="url(#visorGlassGloss)"
              style={{
                transform: `translateX(${-eyeShiftX * 0.4}px)`,
                transition: "transform 0.08s ease-out",
              }}
            />

            {/* Convex Glass Specular Highlight Streak */}
            <ellipse
              cx={`${23.8 - eyeShiftX * 0.3}`}
              cy="18.2"
              rx="3.8"
              ry="1.3"
              transform="rotate(-12 23.8 18.2)"
              fill="#FFFFFF"
              opacity="0.8"
            />

            {/* Subtle Lower Glass Convex Bounce Reflection */}
            <path
              d="M 21.5 29.5 Q 32 31.2 42.5 29.5"
              stroke="#38BDF8"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* Ambient Occlusion Chin Crease */}
            <path
              d="M 20 34.5 Q 32 36.5 44 34.5"
              stroke="#030712"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* ================= 3D METALLIC NECK JOINT & CAST SHADOW ================= */}
          <g transform="translate(27, 34.2)">
            {/* Dark titanium ribbed neck cylinder */}
            <rect x="0" y="0" width="10" height="3.6" rx="1.8" fill="#1E293B" stroke="#0B0F19" strokeWidth="0.8" />
            <circle cx="5" cy="1.8" r="1.1" fill="#64748B" />
          </g>
          {/* Ambient occlusion shadow cast by head onto upper torso */}
          <ellipse cx="32" cy="37.4" rx="11" ry="2.2" fill="#020617" opacity="0.8" />

          {/* ================= 3D ROBOT TORSO ================= */}
          <g
            style={{
              transform: `perspective(450px) rotateY(${rotateY * 0.45}deg)`,
              transformOrigin: "32px 46px",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Torso Capsule with 3D Spherical Volume */}
            <rect
              x="16.5"
              y="37"
              width="31"
              height="19.5"
              rx="8"
              fill="url(#torsoSphere3D)"
              stroke="#334155"
              strokeWidth="1.2"
            />

            {/* Torso Top Curvature Highlight */}
            <path
              d="M 21 38.6 Q 32 37.4 43 38.6"
              stroke="#E2E8F0"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Torso Specular Glare Dot */}
            <ellipse
              cx="25"
              cy="39.5"
              rx="5"
              ry="1.8"
              transform="rotate(-8 25 39.5)"
              fill="url(#headGlossGrad)"
              opacity="0.6"
            />

            {/* Recessed Chest Telemetry Console with Metallic Bezel */}
            <rect
              x="21"
              y="40.5"
              width="22"
              height="12"
              rx="3.5"
              fill="#050811"
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* Inner Monitor Shadow */}
            <rect
              x="21.8"
              y="41.3"
              width="20.4"
              height="10.4"
              rx="2.6"
              fill="#02040A"
            />

            {/* Chest Status Gauges with Glowing LEDs */}
            <rect x="23.5" y="42.8" width="8" height="2" rx="1" fill="#10B981" />
            <rect x="23.5" y="46.2" width="13" height="2" rx="1" fill="#0EA5E9" />
            <circle
              cx="39.5"
              cy="43.8"
              r="1.6"
              fill={isStreaming ? "#10B981" : "#F59E0B"}
              className={isStreaming ? "animate-pulse" : ""}
            />

            {/* Live Telemetry Heartbeat Waveform */}
            <path
              d="M 23.5 49.6 L 27.5 49.6 L 29 48.2 L 30.5 51.2 L 32 49.6 L 39.5 49.6"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
              fill="none"
            />

            {/* ================= 3D LEFT ARM & SHOULDER ================= */}
            {/* Shaded 3D Ball Joint Shoulder */}
            <circle cx="15.5" cy="41" r="3.2" fill="url(#ballJointGrad)" stroke="#0F172A" strokeWidth="0.8" />
            <circle cx="14.8" cy="40.2" r="1" fill="#CBD5E1" opacity="0.8" />

            {/* Cylindrical Bicep Segment with Shading */}
            <path
              d="M 15 41.5 C 11.5 44.5, 10.5 48.5, 12.8 53"
              stroke="#334155"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 15 41.5 C 11.5 44.5, 10.5 48.5, 12.8 53"
              stroke="#64748B"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            {/* Left Hand Mitten Sphere with Specular Highlight */}
            <circle cx="12.8" cy="53.8" r="2.8" fill="url(#ballJointGrad)" stroke="#0F172A" strokeWidth="0.8" />
            <circle cx="12.2" cy="53" r="1.1" fill="#E2E8F0" opacity="0.85" />
            <circle cx="13.2" cy="54.2" r="0.9" fill="#10B981" />

            {/* ================= 3D RIGHT ARM (ARTICULATED WAVING) ================= */}
            {/* Shaded 3D Ball Joint Shoulder */}
            <circle cx="48.5" cy="41" r="3.2" fill="url(#ballJointGrad)" stroke="#0F172A" strokeWidth="0.8" />
            <circle cx="47.8" cy="40.2" r="1" fill="#CBD5E1" opacity="0.8" />

            <g className="robot-arm-waving">
              <path
                d="M 48.5 41 C 54.5 42.5, 55.5 45.5, 54.5 50.5"
                stroke="#334155"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 48.5 41 C 54.5 42.5, 55.5 45.5, 54.5 50.5"
                stroke="#64748B"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              {/* Waving Mitten with Emerald Sensor Dot */}
              <circle cx="54.5" cy="51.5" r="3" fill="#10B981" stroke="#047857" strokeWidth="0.9" />
              <circle cx="53.8" cy="50.6" r="1.2" fill="#FFFFFF" />
            </g>

            {/* ================= 3D ANTI-GRAVITY HOVER THRUSTERS ================= */}
            {/* Left Thruster Metallic Bell */}
            <path
              d="M 21.5 56 L 20.8 59.2 Q 25.5 60.6 30.2 59.2 L 29.5 56 Z"
              fill="url(#thrusterNozzleGrad)"
              stroke="#0F172A"
              strokeWidth="0.8"
            />
            <ellipse cx="25.5" cy="59.2" rx="4.5" ry="1.4" fill="#0A0F1D" stroke="#334155" strokeWidth="0.6" />

            {/* Right Thruster Metallic Bell */}
            <path
              d="M 34.5 56 L 33.8 59.2 Q 38.5 60.6 43.2 59.2 L 42.5 56 Z"
              fill="url(#thrusterNozzleGrad)"
              stroke="#0F172A"
              strokeWidth="0.8"
            />
            <ellipse cx="38.5" cy="59.2" rx="4.5" ry="1.4" fill="#0A0F1D" stroke="#334155" strokeWidth="0.6" />
            
            {/* Volumetric Plasma Halo Flames (British Racing Emerald / Mint Plasma) */}
            <ellipse
              cx="25.5"
              cy="61.2"
              rx="3.2"
              ry="1.8"
              fill="#10B981"
              filter="url(#thrusterGlow)"
              className="robot-thruster-glow"
            />
            <ellipse
              cx="38.5"
              cy="61.2"
              rx="3.2"
              ry="1.8"
              fill="#10B981"
              filter="url(#thrusterGlow)"
              className="robot-thruster-glow"
            />
            {/* White-Hot Plasma Center Jet */}
            <ellipse cx="25.5" cy="60.8" rx="1.5" ry="0.8" fill="#FFFFFF" />
            <ellipse cx="38.5" cy="60.8" rx="1.5" ry="0.8" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}
