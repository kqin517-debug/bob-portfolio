"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Code2,
  FolderGit2,
  Copy,
  Check,
  Terminal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { profileData } from "@/data/profile";

interface HeroCockpitProps {
  onNavigateSnippets: () => void;
  onNavigateProjects: () => void;
  onOpenSearch: () => void;
}

export function HeroCockpit({
  onNavigateSnippets,
  onNavigateProjects,
  onOpenSearch,
}: HeroCockpitProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("developer@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="overview" className="relative space-y-6">
      {/* Hero Banner Glass Container */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 md:p-10 border border-white/15">
        {/* Ambient Top Glow Orbs inside the card */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md shadow-sm text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-slate-200 font-medium">
              {profileData.status.label}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Crafting High-Performance Architecture &amp;{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                Glassmorphic
              </span>{" "}
              Web Interfaces
            </h1>
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl">
              {profileData.bio}
            </p>
          </div>

          {/* Current Focus Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Focus:
            </span>
            {profileData.focus.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onNavigateSnippets}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 border border-white/25 shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Explore Code Snippets</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onNavigateProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 backdrop-blur-md transition-all active:scale-[0.98]"
            >
              <FolderGit2 className="w-4 h-4 text-slate-400" />
              <span>View Open Source</span>
            </button>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-200 bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-white/30 backdrop-blur-md transition-all active:scale-[0.98]"
              title="Copy developer email"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Contact</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento Metrics Cards (Inspired by Figma Dashboard Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileData.metrics.map((metric, idx) => (
          <div
            key={metric.label}
            className="p-5 rounded-2xl glass-panel-subtle glass-panel-hover border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                {metric.label}
              </span>
              {metric.trend && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {metric.trend}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {metric.value}
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
