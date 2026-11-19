"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms
  threshold?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
  scale?: boolean;
  duration?: number;
  distance?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.05,
  direction = "up",
  blur = false,
  scale = false,
  duration = 180,
  distance = 6,
}: ScrollRevealProps) {
  // Always render visible immediately so page navigation is sub-second with zero blank delay
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's reduced-motion preference immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    // If already in or near viewport on mount, trigger immediately
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight + 80 && rect.bottom >= -80) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px 80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    const scaleStr = scale ? " scale(0.98)" : "";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)${scaleStr}`;
      case "down":
        return `translate3d(0, -${distance}px, 0)${scaleStr}`;
      case "left":
        return `translate3d(${distance}px, 0, 0)${scaleStr}`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)${scaleStr}`;
      default:
        return scale ? "scale(0.98)" : "none";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: blur ? (isVisible ? "blur(0px)" : "blur(1.5px)") : "none",
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
