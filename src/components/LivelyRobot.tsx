"use client";

import React, { useEffect, useRef, useState } from "react";

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

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
      >
        <defs>
          {/* Dynamic 3D Spherical Head Gradient (shifts highlight with cursor) */}
          <radialGradient
            id="headSphere3D"
            cx={`${lightX}`}
            cy={`${lightY}`}
            r="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#475569" />
            <stop offset="28%" stopColor="#334155" />
            <stop offset="65%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B0F19" />
          </radialGradient>

          {/* 3D Head Rim Specular Reflection */}
          <linearGradient id="headRimGrad" x1="16" y1="12" x2="48" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
          </linearGradient>

          {/* 3D Visor Bezel Chamfer */}
          <linearGradient id="visorBezelGrad" x1="18" y1="15" x2="46" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0A0F1D" />
          </linearGradient>

          {/* Deep Visor Screen Glass */}
          <linearGradient id="visorGlassGrad" x1="20" y1="16" x2="44" y2="31" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#030712" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* 3D Torso Capsule Gradient */}
          <radialGradient
            id="torsoSphere3D"
            cx={`${torsoLightX}`}
            cy={`${torsoLightY}`}
            r="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#475569" />
            <stop offset="35%" stopColor="#334155" />
            <stop offset="75%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#080D1A" />
          </radialGradient>

          {/* Metallic Ear Dials */}
          <linearGradient id="dialGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Emerald Eye Glow Filter */}
          <filter id="eyeGlow3D" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Antenna Flare Glow */}
          <filter id="beaconGlow3D" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Volumetric Thruster Glow */}
          <filter id="thrusterGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow (2-tier volumetric projection) */}
        <ellipse
          cx="32"
          cy="61.5"
          rx="17"
          ry="3.8"
          fill="#020617"
          opacity="0.3"
          className="robot-shadow-core"
        />
        <ellipse
          cx="32"
          cy="61.5"
          rx="10"
          ry="2.2"
          fill="#000000"
          opacity="0.5"
          className="robot-shadow-core"
        />

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
            {/* Tapered Stem */}
            <path
              d="M 31 14 L 31.5 6 L 32.5 6 L 33 14 Z"
              fill="#475569"
              stroke="#1E293B"
              strokeWidth="0.6"
            />
            {/* Metallic collar ring */}
            <rect x="30" y="12" width="4" height="2" rx="0.8" fill="#64748B" stroke="#334155" strokeWidth="0.4" />

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

            {/* Glowing 3D Beacon Tip */}
            <circle
              cx="32"
              cy="4.5"
              r="4.2"
              fill="#10B981"
              filter="url(#beaconGlow3D)"
              className="robot-antenna-tip"
            />
            <circle cx="30.8" cy="3.2" r="1.5" fill="#ECFDF5" />
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
                fill="#0B0F19"
                stroke="#1E293B"
                strokeWidth="0.8"
              />
            )}
            {rightBevelWidth > 0 && (
              <path
                d={`M 49 13 C 50 13, ${49 + rightBevelWidth} 17, ${49 + rightBevelWidth} 24 C ${49 + rightBevelWidth} 31, 50 35, 49 35 Z`}
                fill="#0B0F19"
                stroke="#1E293B"
                strokeWidth="0.8"
              />
            )}

            {/* 3D Outer Head Shell (Volumetric Capsule) */}
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

            {/* 3D Specular Top-Light Curvature Glare */}
            <path
              d="M 20 14.5 Q 32 12.8 44 14.5"
              stroke="#CBD5E1"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Bottom ambient light bounce */}
            <path
              d="M 21 33.5 Q 32 35 43 33.5"
              stroke="#38BDF8"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* 3D Cylindrical Ear Dials */}
            {/* Left Ear */}
            <g transform="translate(11.5, 17.5)">
              <rect x="0" y="0" width="4.5" height="10" rx="2" fill="url(#dialGrad)" stroke="#1E293B" strokeWidth="0.8" />
              <line x1="1.5" y1="2" x2="1.5" y2="8" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
            </g>
            {/* Right Ear */}
            <g transform="translate(48, 17.5)">
              <rect x="0" y="0" width="4.5" height="10" rx="2" fill="url(#dialGrad)" stroke="#1E293B" strokeWidth="0.8" />
              <line x1="3" y1="2" x2="3" y2="8" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" />
            </g>

            {/* 3D Recessed Visor Bezel Ring */}
            <rect
              x="18"
              y="15.5"
              width="28"
              height="16"
              rx="6"
              fill="url(#visorBezelGrad)"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Deep Glass Chamber */}
            <rect
              x="19.2"
              y="16.7"
              width="25.6"
              height="13.6"
              rx="4.8"
              fill="url(#visorGlassGrad)"
            />

            {/* 3D Glass Dome Convex Glare (Moves with counter-parallax) */}
            <path
              d="M 21 18 C 27 16.8, 37 16.8, 43 18"
              stroke="#38BDF8"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.55"
              style={{
                transform: `translateX(${-eyeShiftX * 0.4}px)`,
                transition: "transform 0.1s ease-out",
              }}
            />

            {/* ================= 3D HOLOGRAPHIC DIGITAL EYES ================= */}
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
                    d="M 22.5 24.5 Q 25.5 20.8 28.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 35.5 24.5 Q 38.5 20.8 41.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              ) : (
                /* High-Intensity 3D Emerald Pupils */
                <g filter="url(#eyeGlow3D)">
                  {/* Left Eye */}
                  <rect x="23" y="20.5" width="5.8" height="6.4" rx="2.6" fill="#10B981" />
                  <circle cx="24.4" cy="22" r="1.3" fill="#FFFFFF" />
                  <circle cx="27" cy="25" r="0.7" fill="#6EE7B7" opacity="0.8" />

                  {/* Right Eye */}
                  <rect x="35.2" y="20.5" width="5.8" height="6.4" rx="2.6" fill="#10B981" />
                  <circle cx="36.6" cy="22" r="1.3" fill="#FFFFFF" />
                  <circle cx="39.2" cy="25" r="0.7" fill="#6EE7B7" opacity="0.8" />
                </g>
              )}
            </g>

            {/* LED Status Indicator / Smile */}
            <path
              d="M 28 28.5 Q 32 31.2 36 28.5"
              stroke="#34D399"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow3D)"
            />
          </g>

          {/* ================= 3D METALLIC NECK JOINT ================= */}
          <g transform="translate(28, 34.5)">
            <rect x="0" y="0" width="8" height="3" rx="1.5" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
            <circle cx="4" cy="1.5" r="1" fill="#64748B" />
          </g>

          {/* ================= 3D ROBOT TORSO ================= */}
          <g
            style={{
              transform: `perspective(450px) rotateY(${rotateY * 0.45}deg)`,
              transformOrigin: "32px 46px",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Torso Capsule with 3D Depth */}
            <rect
              x="17"
              y="37"
              width="30"
              height="19"
              rx="7.5"
              fill="url(#torsoSphere3D)"
              stroke="#475569"
              strokeWidth="1.4"
            />

            {/* Torso Top Highlight */}
            <path
              d="M 21 38.5 Q 32 37.5 43 38.5"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Recessed Chest Telemetry Console */}
            <rect
              x="21.5"
              y="40"
              width="21"
              height="12"
              rx="3.5"
              fill="#060A12"
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* Chest Status Gauges */}
            <rect x="23.5" y="42.5" width="8" height="2" rx="1" fill="#10B981" />
            <rect x="23.5" y="46" width="13" height="2" rx="1" fill="#0EA5E9" />
            <circle
              cx="39.5"
              cy="43.5"
              r="1.6"
              fill={isStreaming ? "#10B981" : "#F59E0B"}
              className={isStreaming ? "animate-pulse" : ""}
            />

            {/* Live Telemetry Pulse Line */}
            <path
              d="M 23.5 49.5 L 27.5 49.5 L 29 48 L 30.5 51 L 32 49.5 L 39.5 49.5"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.75"
              fill="none"
            />

            {/* ================= 3D LEFT ARM & SHOULDER ================= */}
            <circle cx="16" cy="40.5" r="2.8" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
            <path
              d="M 15.5 41 C 12 44, 11 48, 13 52.5"
              stroke="#334155"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand Mitten with metallic sensor */}
            <circle cx="13" cy="53.5" r="2.6" fill="#64748B" stroke="#1E293B" strokeWidth="0.8" />
            <circle cx="12.5" cy="53" r="0.8" fill="#CBD5E1" />

            {/* ================= 3D RIGHT ARM (ARTICULATED WAVING) ================= */}
            <circle cx="48" cy="40.5" r="2.8" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
            <g className="robot-arm-waving">
              <path
                d="M 48 40.5 C 54 42, 55 45, 54 50"
                stroke="#334155"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Waving Mitten with Emerald Sensor Dot */}
              <circle cx="54" cy="51" r="2.8" fill="#10B981" stroke="#059669" strokeWidth="0.8" />
              <circle cx="53.4" cy="50.2" r="1.1" fill="#FFFFFF" />
            </g>

            {/* ================= 3D ANTI-GRAVITY HOVER THRUSTERS ================= */}
            <rect x="22.5" y="55.5" width="7" height="3.5" rx="1.75" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
            <rect x="34.5" y="55.5" width="7" height="3.5" rx="1.75" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
            
            {/* Volumetric Plasma Halo Rings */}
            <ellipse
              cx="26"
              cy="59.5"
              rx="3"
              ry="1.3"
              fill="#38BDF8"
              filter="url(#thrusterGlow)"
              className="robot-thruster-glow"
            />
            <ellipse
              cx="38"
              cy="59.5"
              rx="3"
              ry="1.3"
              fill="#38BDF8"
              filter="url(#thrusterGlow)"
              className="robot-thruster-glow"
            />
            <ellipse cx="26" cy="59.5" rx="1.2" ry="0.6" fill="#FFFFFF" />
            <ellipse cx="38" cy="59.5" rx="1.2" ry="0.6" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}
