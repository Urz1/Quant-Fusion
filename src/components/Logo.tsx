"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "full" | "icon" | "stacked" | "compact";
  theme?: "light" | "dark";
  subtitle?: string;
  className?: string;
  href?: string;
}

export function Logo({
  variant = "full",
  theme = "light",
  subtitle = "Operations Decision Layer",
  className = "",
  href = "/",
}: LogoProps) {
  const isDark = theme === "dark";

  // SVG Mark: The Convergence Crucible (Isometric Q + F Fusion Mark)
  const mark = (
    <svg
      width="34"
      height="34"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105"
      aria-label="Quant Fusion Mark"
    >
      {/* Background Rounded Shield */}
      <rect
        width="44"
        height="44"
        rx="8"
        fill={isDark ? "#25211D" : "#1A1714"}
        stroke={isDark ? "#35302B" : "none"}
        strokeWidth={isDark ? 1 : 0}
      />
      {/* Isometric Outer Q Perimeter */}
      <path
        d="M22 8L34 15V27L22 34L10 27V15L22 8Z"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Converging Flow Lines fusing into Emerald Green Focal Node */}
      <path
        d="M16 20.5L22 24L28 20.5"
        stroke="#48C78E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 24V30"
        stroke="#48C78E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Central Decision Focal Node */}
      <circle cx="22" cy="24" r="2.5" fill="#48C78E" />
      {/* Q Dynamic Anchor Tangent */}
      <path
        d="M27 30L33 36"
        stroke="#48C78E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );

  const typography = (
    <div className={`flex flex-col ${variant === "stacked" ? "items-center text-center mt-2" : ""}`}>
      <span
        className={`font-serif text-[21px] font-semibold tracking-tight leading-none transition-colors ${
          isDark
            ? "text-white group-hover:text-emerald-300"
            : "text-ink-primary group-hover:text-link-interactive"
        }`}
      >
        Quant Fusion
      </span>
      {variant !== "compact" && subtitle && (
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.16em] mt-0.5 ${
            isDark ? "text-[#9E978E]" : "text-ink-muted"
          }`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 group select-none ${
        variant === "stacked" ? "flex-col items-center gap-1" : ""
      } ${className}`}
    >
      {mark}
      {variant !== "icon" && typography}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-btn-cta/40 focus-visible:ring-offset-2 rounded-md select-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}
