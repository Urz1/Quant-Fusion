"use client";

import React from "react";

interface KineticTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
  baseDelay?: number; // Starting delay in seconds
  wiggleInterval?: number; // Total cycle length in seconds
  staggerMs?: number; // Stagger between letters in ms
}

export function KineticText({
  text,
  className = "",
  letterClassName = "",
  baseDelay = 0.05,
  wiggleInterval = 7.5,
  staggerMs = 20,
}: KineticTextProps) {
  // Split by words first so word wrapping is preserved naturally
  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wIdx) => {
        const letters = Array.from(word);
        const wordNode = (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {letters.map((char, lIdx) => {
              const charIndex = globalCharIndex++;
              const entranceDelay = baseDelay + charIndex * (staggerMs / 1000);
              const wiggleDelay = baseDelay + 1.2 + charIndex * 0.04;

              return (
                <span
                  key={lIdx}
                  className={`inline-block transition-transform duration-200 hover:-translate-y-1.5 hover:rotate-3 hover:scale-110 cursor-default ${letterClassName}`}
                  style={{
                    animation: `letterEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}s both, letterWiggle 7s ease-in-out ${wiggleDelay}s infinite`,
                    transformOrigin: "bottom center",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );

        // Add space between words
        globalCharIndex++; // Count space in index
        return (
          <React.Fragment key={wIdx}>
            {wordNode}
            {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </React.Fragment>
        );
      })}
    </span>
  );
}

export function HeroKineticHeadline() {
  return (
    <h1 className="font-serif text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] font-semibold text-ink-primary leading-[1.14] sm:leading-[1.08] tracking-tight">
      <style jsx global>{`
        /* 1. Staggered Entrance Movement: letters spring up with micro-rotation */
        @keyframes letterEntrance {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          70% {
            transform: translateY(-2px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        /* 2. Occasional Wave/Wiggle: ripples sequentially across each letter every 7s */
        @keyframes letterWiggle {
          0%, 88%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          90% {
            transform: translateY(-6px) rotate(-3.5deg) scale(1.06);
            color: inherit;
          }
          93% {
            transform: translateY(2px) rotate(2.5deg) scale(0.98);
          }
          96% {
            transform: translateY(-2px) rotate(-1deg);
          }
          98% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>

      {/* Line 1: One order. Eight isolated systems. */}
      <span className="block">
        <KineticText
          text="One order. Eight isolated systems."
          baseDelay={0.05}
          staggerMs={18}
          letterClassName="text-ink-primary"
        />
      </span>

      {/* Line 2: One verified ship date. (Emerald Italic) */}
      <span className="block mt-1 sm:mt-0">
        <KineticText
          text="One verified ship date."
          baseDelay={0.25}
          staggerMs={18}
          letterClassName="italic font-normal text-btn-cta hover:text-emerald-500"
        />
      </span>
    </h1>
  );
}
