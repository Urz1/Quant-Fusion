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
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    mascot: "w-20 h-22 sm:w-22 sm:h-24",
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

      if (distance < 5) {
        targetX = 0;
        targetY = 0;
      } else {
        // Clamp normalized look target between -1 and 1
        const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.75;
        targetX = Math.max(-1, Math.min(1, deltaX / Math.min(maxDist, 600)));
        targetY = Math.max(-1, Math.min(1, deltaY / Math.min(maxDist, 500)));
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
    setTimeout(() => setIsClicked(false), 600);
    if (onClick) onClick();
  };

  // 3D head rotation angles calculated from cursor position
  const rotateY = lookPos.x * (isLargeMascot ? 22 : 14);
  const rotateX = -lookPos.y * (isLargeMascot ? 18 : 10);
  const eyeShiftX = lookPos.x * (isLargeMascot ? 4 : 2.5);
  const eyeShiftY = lookPos.y * (isLargeMascot ? 3 : 1.8);

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
      aria-label="Quant Fusion AI Assistant Robot Mascot"
    >
      <style jsx>{`
        /* Idle occasional wave: rests, waves 3 times, then rests for ~7 seconds */
        @keyframes robotWaveIdle {
          0%, 65%, 100% {
            transform: rotate(0deg);
          }
          70% {
            transform: rotate(-36deg) translateY(-2px);
          }
          74% {
            transform: rotate(-8deg) translateY(-1px);
          }
          78% {
            transform: rotate(-36deg) translateY(-2px);
          }
          82% {
            transform: rotate(-10deg) translateY(-1px);
          }
          86% {
            transform: rotate(-32deg) translateY(-2px);
          }
          92% {
            transform: rotate(0deg);
          }
        }

        /* Continuous friendly wave when streaming, hovered, or forced */
        @keyframes robotWaveActive {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-38deg) translateY(-2px);
          }
          50% {
            transform: rotate(-10deg) translateY(-1px);
          }
          75% {
            transform: rotate(-34deg) translateY(-2px);
          }
        }

        /* Floating hover physics */
        @keyframes robotFloatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(0.8deg);
          }
        }

        /* Dynamic shadow scaling with hover altitude */
        @keyframes shadowScale {
          0%, 100% {
            transform: scale(1);
            opacity: 0.28;
          }
          50% {
            transform: scale(0.82);
            opacity: 0.14;
          }
        }

        /* Digital LED eyes natural blink */
        @keyframes robotBlink {
          0%, 93%, 100% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.12);
          }
        }

        /* Antenna beacon glow pulse */
        @keyframes antennaPulse {
          0%, 100% {
            opacity: 0.85;
            filter: drop-shadow(0 0 3px #34D399);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 6px #10B981) drop-shadow(0 0 10px #34D399);
          }
        }

        /* Processing radar waves from antenna when streaming */
        @keyframes radarPing {
          0% {
            r: 4px;
            opacity: 0.9;
          }
          100% {
            r: 14px;
            opacity: 0;
          }
        }

        .robot-floating-root {
          animation: robotFloatSlow 3.2s ease-in-out infinite;
        }

        .robot-contact-shadow {
          animation: shadowScale 3.2s ease-in-out infinite;
          transform-origin: 32px 61px;
        }

        .robot-blinking-eyes {
          transform-origin: 32px 24px;
          animation: robotBlink 4.8s ease-in-out infinite;
        }

        .robot-antenna-tip {
          animation: antennaPulse 2s ease-in-out infinite;
        }

        .robot-arm-waving {
          transform-origin: 48px 36px;
          animation: ${isStreaming || forceWave || isHovered
            ? "robotWaveActive 0.9s ease-in-out infinite"
            : "robotWaveIdle 8.5s ease-in-out infinite"};
        }
      `}</style>

      {/* Optional Speech Bubble Tooltip (Mascot Mode) */}
      {isLargeMascot && bubbleVisible && (
        <div
          className="absolute -top-12 right-0 sm:right-2 z-50 pointer-events-none transform -translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="relative px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-[11px] font-sans font-medium shadow-xl border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>{speechText}</span>
            <span className="ml-1 px-1 py-0.2 rounded bg-white/10 text-[9px] font-mono text-slate-300">
              ⌘K
            </span>
            {/* Speech bubble tail pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/95 border-b border-r border-emerald-500/30 transform rotate-45" />
          </div>
        </div>
      )}

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
      >
        <defs>
          {/* Metallic Head Radial Gradient */}
          <radialGradient
            id="robotHeadGrad"
            cx="26"
            cy="18"
            r="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#334155" />
            <stop offset="45%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#090D16" />
          </radialGradient>

          {/* Visor Glass Gradient */}
          <linearGradient
            id="visorGrad"
            x1="20"
            y1="16"
            x2="44"
            y2="31"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#050811" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Torso Gloss Gradient */}
          <linearGradient
            id="torsoGrad"
            x1="18"
            y1="36"
            x2="46"
            y2="55"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0A0F1D" />
          </linearGradient>

          {/* Emerald Eye Glow Filter */}
          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Antenna Flare Glow */}
          <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ground Contact Shadow */}
        <ellipse
          cx="32"
          cy="61"
          rx="15"
          ry="3"
          fill="#0F172A"
          className="robot-contact-shadow"
        />

        {/* Floating Root Body Group */}
        <g className="robot-floating-root">
          {/* ================= ANTENNA ================= */}
          <line
            x1="32"
            y1="14"
            x2="32"
            y2="6"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Radar ripple rings when actively streaming */}
          {isStreaming && (
            <circle
              cx="32"
              cy="5"
              r="8"
              fill="none"
              stroke="#10B981"
              strokeWidth="1"
              style={{ animation: "radarPing 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite" }}
            />
          )}

          {/* Glowing Beacon Tip */}
          <circle
            cx="32"
            cy="5"
            r="3.8"
            fill="#10B981"
            filter="url(#beaconGlow)"
            className="robot-antenna-tip"
          />
          <circle cx="31" cy="4" r="1.3" fill="#ECFDF5" />

          {/* ================= 3D INTERACTIVE HEAD ================= */}
          <g
            style={{
              transform: `perspective(300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformOrigin: "32px 25px",
              transition: "transform 0.08s ease-out",
            }}
          >
            {/* Outer Head Shell (Glossy Curvature) */}
            <rect
              x="15"
              y="12"
              width="34"
              height="23"
              rx="9"
              fill="url(#robotHeadGrad)"
              stroke="#475569"
              strokeWidth="1.6"
            />

            {/* Specular Top-Light Gloss Highlight */}
            <path
              d="M 21 14.5 Q 32 13 43 14.5"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* Side Ear Bolts / Joint Dials */}
            <rect x="12" y="18" width="3.5" height="9" rx="1.75" fill="#475569" stroke="#334155" strokeWidth="0.8" />
            <rect x="48.5" y="18" width="3.5" height="9" rx="1.75" fill="#475569" stroke="#334155" strokeWidth="0.8" />
            <circle cx="13.7" cy="22.5" r="1" fill="#94A3B8" />
            <circle cx="50.3" cy="22.5" r="1" fill="#94A3B8" />

            {/* Visor Screen Outer Bezel */}
            <rect
              x="18"
              y="15.5"
              width="28"
              height="16"
              rx="6"
              fill="url(#visorGrad)"
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* Visor Glass Curved Specular Glare (Moves opposite to cursor for parallax) */}
            <path
              d="M 20 17.5 C 26 16.5, 38 16.5, 44 17.5"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.5"
              style={{
                transform: `translateX(${-eyeShiftX * 0.4}px)`,
                transition: "transform 0.1s ease-out",
              }}
            />

            {/* ================= INTERACTIVE DIGITAL EYES & SMILE ================= */}
            <g
              className="robot-blinking-eyes"
              style={{
                transform: `translate(${eyeShiftX}px, ${eyeShiftY}px)`,
                transition: "transform 0.08s ease-out",
              }}
            >
              {isHovered ? (
                /* Cheerful Arc Eyes on Hover (^ _ ^) */
                <g filter="url(#eyeGlow)">
                  <path
                    d="M 22.5 24.5 Q 25.5 21 28.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 35.5 24.5 Q 38.5 21 41.5 24.5"
                    stroke="#10B981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              ) : (
                /* Normal High-Intensity Emerald Pupils */
                <g filter="url(#eyeGlow)">
                  {/* Left Eye */}
                  <rect x="23" y="20.5" width="5.5" height="6" rx="2.5" fill="#10B981" />
                  <circle cx="24.5" cy="22" r="1.3" fill="#ECFDF5" />

                  {/* Right Eye */}
                  <rect x="35.5" y="20.5" width="5.5" height="6" rx="2.5" fill="#10B981" />
                  <circle cx="37" cy="22" r="1.3" fill="#ECFDF5" />
                </g>
              )}
            </g>

            {/* Friendly LED Smile */}
            <path
              d="M 27.5 28.5 Q 32 31.5 36.5 28.5"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#eyeGlow)"
            />
          </g>

          {/* ================= ROBOT NECK JOINT ================= */}
          <rect x="28.5" y="34.5" width="7" height="3" rx="1.5" fill="#475569" stroke="#334155" strokeWidth="0.8" />

          {/* ================= ROBOT BODY / TORSO ================= */}
          <g
            style={{
              transform: `perspective(300px) rotateY(${rotateY * 0.4}deg)`,
              transformOrigin: "32px 46px",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Torso Capsule Shell */}
            <rect
              x="17"
              y="37"
              width="30"
              height="19"
              rx="7"
              fill="url(#torsoGrad)"
              stroke="#475569"
              strokeWidth="1.6"
            />

            {/* Chest Display Console */}
            <rect
              x="21.5"
              y="40"
              width="21"
              height="12"
              rx="3.5"
              fill="#080C14"
              stroke="#1E293B"
              strokeWidth="1"
            />

            {/* Chest Status Telemetry */}
            <rect x="24" y="42.5" width="8" height="2" rx="1" fill="#10B981" />
            <rect x="24" y="46" width="13" height="2" rx="1" fill="#0EA5E9" />
            <circle
              cx="39.5"
              cy="43.5"
              r="1.6"
              fill={isStreaming ? "#10B981" : "#F59E0B"}
              className={isStreaming ? "animate-pulse" : ""}
            />

            {/* Heartbeat pulse LED wave */}
            <path
              d="M 24 49.5 L 28 49.5 L 29.5 48 L 31 51 L 32.5 49.5 L 39 49.5"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
              fill="none"
            />

            {/* ================= LEFT ARM (RESTING WITH BALL JOINT) ================= */}
            <circle cx="16" cy="40.5" r="2.5" fill="#64748B" />
            <path
              d="M 15.5 41 C 12 44, 11 48, 13 52.5"
              stroke="#475569"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand Mitten */}
            <circle cx="13" cy="53.5" r="2.5" fill="#64748B" stroke="#334155" strokeWidth="0.8" />

            {/* ================= RIGHT ARM (ARTICULATED WAVING ARM) ================= */}
            <circle cx="48" cy="40.5" r="2.5" fill="#64748B" />
            <g className="robot-arm-waving">
              {/* Arm segment raised in a friendly wave */}
              <path
                d="M 48 40.5 C 54 42, 55 45, 54 50"
                stroke="#475569"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Waving Mitten with Emerald Sensor Dot */}
              <circle cx="54" cy="51" r="2.7" fill="#10B981" stroke="#059669" strokeWidth="0.8" />
              <circle cx="53.5" cy="50" r="1" fill="#ECFDF5" />
            </g>

            {/* ================= HOVER THRUSTER BASE ================= */}
            <rect x="22.5" y="55.5" width="7" height="3.5" rx="1.75" fill="#475569" />
            <rect x="34.5" y="55.5" width="7" height="3.5" rx="1.75" fill="#475569" />
            {/* Anti-Gravity Cyan Jet Glow */}
            <ellipse cx="26" cy="59.5" rx="2.5" ry="1" fill="#38BDF8" opacity="0.6" />
            <ellipse cx="38" cy="59.5" rx="2.5" ry="1" fill="#38BDF8" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
