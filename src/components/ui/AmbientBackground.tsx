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
          className="ambient-image object-cover object-center"
        />
      </div>
      <div className="ambient-tint absolute inset-0" />

      {/* Two static ambient light wells */}
      <div className="ambient-glow ambient-glow-a absolute -top-[20%] left-[12%] h-[700px] w-[700px] rounded-full" />
      <div className="ambient-glow ambient-glow-b absolute -bottom-[15%] right-[4%] h-[600px] w-[600px] rounded-full" />

      {/* Fine grid */}
      <div className="ambient-grid absolute inset-0" />

      {/* Cursor refraction, fine pointers only */}
      <div ref={spotlightRef} className="absolute inset-0" />

      {/* Edge vignette keeps the frame quiet */}
      <div className="ambient-vignette absolute inset-0" />
    </div>
  );
}
