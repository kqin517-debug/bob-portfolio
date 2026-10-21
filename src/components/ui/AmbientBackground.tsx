"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/utils";

export function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Layer 1: Enhanced Luminous Chromatic Wave Background */}
      {/* Boosted brightness & saturation so the radiant wave shines brightly through glass */}
      <div className="absolute inset-0 scale-105 opacity-95 blur-[10px] contrast-115 brightness-135 saturate-135 transition-transform duration-1000 ease-out">
        <Image
          src={assetPath("/images/bg-wave.jpg")}
          alt="Chromatic Glass Background Wave"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
      </div>

      {/* Layer 2: Vibrant Radiant Atmospheric Aurora Lights (Multiple Floating Light Wells) */}
      {/* Light Well 1: Radiant Azure / Electric Cyan - Centered behind Main Content & Hero */}
      <div className="absolute top-[5%] left-[25%] w-[850px] h-[750px] rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-500/35 to-indigo-600/20 blur-[100px] animate-aurora-slow mix-blend-screen" />

      {/* Light Well 2: Vivid Royal Purple & Magenta Glow - Behind Navigation & Bento */}
      <div className="absolute -top-[10%] -left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-500/35 via-purple-600/30 to-fuchsia-600/20 blur-[110px] animate-aurora-reverse mix-blend-screen" />

      {/* Light Well 3: Luminous Emerald & Aquamarine - Bottom & Right Section (Figma #21FF6B energy) */}
      <div className="absolute top-[40%] -right-[5%] w-[750px] h-[750px] rounded-full bg-gradient-to-bl from-teal-400/30 via-emerald-500/25 to-blue-600/25 blur-[120px] animate-aurora-drift mix-blend-screen" />

      {/* Light Well 4: Center Radiant Core - Adds luminous ambient lift across the whole screen */}
      <div className="absolute top-[20%] left-[35%] w-[600px] h-[500px] rounded-full bg-blue-400/20 blur-[90px] animate-pulse-slow mix-blend-screen" />

      {/* Layer 3: Interactive Dynamic Cursor Refraction Spotlight */}
      {isMounted && mousePos.x > 0 && (
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(140, 180, 255, 0.22), rgba(99, 140, 255, 0.08) 45%, transparent 75%)`,
          }}
        />
      )}

      {/* Layer 4: Architectural Glass Micro Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-45 mix-blend-overlay" />

      {/* Layer 5: Very Soft Edge Vignette (Non-intrusive, keeps edges elegant while keeping 90% of screen bright) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_50%,rgba(6,9,16,0.35)_85%,rgba(6,9,16,0.65)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070913]/40" />
    </div>
  );
}
