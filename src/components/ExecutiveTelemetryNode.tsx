"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, Bot } from "lucide-react";

interface ExecutiveTelemetryNodeProps {
  size?: "launcher" | "sm" | "md";
  isStreaming?: boolean;
  className?: string;
}

export function ExecutiveTelemetryNode({
  size = "launcher",
  isStreaming = false,
  className = "",
}: ExecutiveTelemetryNodeProps) {
  // Small avatar for chat message bubble (32x32)
  if (size === "sm") {
    return (
      <div
        className={`relative w-8 h-8 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-xs overflow-hidden ${className}`}
      >
        <div
          className={`absolute inset-0 rounded-full ${
            isStreaming ? "bg-emerald-400/20 animate-pulse" : "bg-emerald-500/10"
          }`}
        />
        <Sparkles className="w-4 h-4 text-emerald-400 relative z-10" />
      </div>
    );
  }

  // Medium avatar for chat modal header (36x36)
  if (size === "md") {
    return (
      <div
        className={`relative w-9 h-9 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-sm overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-radial from-emerald-500/20 via-transparent to-transparent" />
        <Sparkles className="w-4.5 h-4.5 text-emerald-400 relative z-10" />
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 shadow-xs" />
      </div>
    );
  }

  // Full Executive Floating Launcher (Crystal Clear, High-Contrast Pill on Desktop, Bold Circular Badge on Mobile)
  return (
    <div
      className={`group relative flex items-center select-none cursor-pointer transition-all duration-200 ${className}`}
    >
      {/* Ambient Emerald Halo Glow */}
      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-md pointer-events-none group-hover:bg-emerald-500/35 transition-all duration-300" />

      {/* Main Pill Dock Container */}
      <div className="relative flex items-center gap-2.5 h-12 px-3.5 sm:px-4 rounded-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 shadow-xl shadow-slate-950/20 text-white transition-all duration-300 group-hover:border-emerald-400/80 group-hover:shadow-emerald-500/15 group-hover:-translate-y-0.5 active:translate-y-0">
        
        {/* Luminous AI Sparkle Icon with Pulse */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shrink-0">
          <Sparkles className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isStreaming ? "animate-spin-slow" : ""}`} />
          {/* Active Status Pip */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        {/* Text Label: Crystal Clear Identity (Hidden on very narrow mobile screens, clearly visible on all others) */}
        <div className="flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-sans text-[13px] font-semibold text-white tracking-tight">
              Quant Fusion Copilot
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/90 mt-0.5 tracking-wide">
            {isStreaming ? "Generating answer..." : "Online • Decision Layer"}
          </span>
        </div>

        {/* Keyboard Shortcut Hint (Desktop only) */}
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-700/80 ml-1 shadow-2xs">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
