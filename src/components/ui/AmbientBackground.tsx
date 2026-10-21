"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/utils";

export function AmbientBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const spotlight = spotlightRef.current;
    if (!finePointer || reducedMotion || !spotlight) return;

    let rafId = 0;
    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spotlight.style.background = `radial-gradient(600px circle at ${event.clientX}px ${event.clientY}px, rgba(143, 168, 255, 0.07), rgba(110, 139, 255, 0.03) 45%, transparent 75%)`;
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
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint blue texture: present, never the subject */}
      <div className="absolute inset-0">
        <Image
          src={assetPath("/images/bg-wave.jpg")}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.28] blur-[1.5px] brightness-75 saturate-[0.55]"
        />
      </div>
      <div className="absolute inset-0 bg-[#05060b]/60" />

      {/* Two static ambient light wells */}
      <div className="absolute -top-[20%] left-[12%] h-[700px] w-[700px] rounded-full bg-[#4a5a9e]/20 blur-[140px]" />
      <div className="absolute -bottom-[15%] right-[4%] h-[600px] w-[600px] rounded-full bg-[#6e7ff3]/12 blur-[140px]" />

      {/* Fine grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.18] mix-blend-overlay" />

      {/* Cursor refraction, fine pointers only */}
      <div ref={spotlightRef} className="absolute inset-0" />

      {/* Edge vignette keeps the frame quiet */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgba(3,4,8,0.6)_85%,rgba(3,4,8,0.85)_100%)]" />
    </div>
  );
}
