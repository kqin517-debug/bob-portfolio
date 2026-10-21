"use client";

import React, { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Terminal,
  FileCode,
  Info,
  Clock,
  Layers,
} from "lucide-react";
import { featuredSnippets } from "@/data/snippets";

interface FeaturedSnippetsProps {
  selectedSnippetId: string;
  onSelectedSnippetChange: (id: string) => void;
  selectionNonce: number;
}

export function FeaturedSnippets({
  selectedSnippetId,
  onSelectedSnippetChange,
  selectionNonce,
}: FeaturedSnippetsProps) {
  const [activeTab, setActiveTab] = useState<"code" | "explanation">("code");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveTab("code");
    setCopied(false);
  }, [selectedSnippetId, selectionNonce]);

  const currentSnippet =
    featuredSnippets.find((s) => s.id === selectedSnippetId) ||
    featuredSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="snippets" className="space-y-5 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>FEATURED IMPLEMENTATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            精选代码速递 (Featured Snippets)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          精选最具工程复用价值与性能代表性的生产级代码实现，支持一键复制代码与查看设计哲学。
        </p>
      </div>

      {/* Snippet Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {featuredSnippets.map((snippet) => {
          const isSelected = snippet.id === selectedSnippetId;
          return (
            <button
              key={snippet.id}
              onClick={() => {
                onSelectedSnippetChange(snippet.id);
                setActiveTab("code");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-blue-600/20 border-blue-400/50 text-white shadow-glow"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: snippet.badgeColor }}
              />
              <span>{snippet.title.split("：")[0]}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {snippet.language}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Glass Code Terminal Window (VS Code Style with Glassmorphic Border) */}
      <div className="rounded-3xl glass-panel overflow-hidden border border-white/15 shadow-2xl">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            {/* Window controls */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 traffic-dot bg-[#FF5F56]" />
              <span className="w-3 h-3 traffic-dot bg-[#FFBD2E]" />
              <span className="w-3 h-3 traffic-dot bg-[#27C93F]" />
            </div>

            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

            {/* File Path Tab */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentSnippet.id}.{currentSnippet.language === "css" ? "css" : "ts"}</span>
            </div>
          </div>

          {/* Right Controls: Tab toggle & Copy Button */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-white/[0.04] p-0.5 border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === "code"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab("explanation")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === "explanation"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Explanation
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-slate-200 transition-all active:scale-95"
              title="Copy snippet code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-mono">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Snippet Context Bar */}
        <div className="px-6 py-3 bg-white/[0.015] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white tracking-tight">
              {currentSnippet.title}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] border border-white/10 text-slate-300">
              {currentSnippet.complexity}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentSnippet.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body: Code View or Explanation View */}
        {activeTab === "code" ? (
          <div className="p-4 sm:p-6 overflow-x-auto bg-[#0a1022]/45 backdrop-blur-md">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
              <code>
                {currentSnippet.code.split("\n").map((line, idx) => (
                  <div key={idx} className="table-row group hover:bg-white/[0.04]">
                    <span className="table-cell select-none pr-4 sm:pr-6 text-right text-slate-500 font-mono text-xs group-hover:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre">
                      {highlightSyntax(line)}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-5 bg-[#0a1022]/45 backdrop-blur-md text-sm leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> 核心原理解析 (Core Architecture)
              </h4>
              <p className="text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/10">
                {currentSnippet.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" /> 内存与复杂度指标
                </span>
                <p className="text-sm font-mono font-bold text-white">
                  {currentSnippet.complexity}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> 最近验证时间
                </span>
                <p className="text-sm font-mono font-bold text-white">
                  {currentSnippet.updatedAt}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Lightweight syntax highlighter for preview rendering
function highlightSyntax(line: string): React.ReactNode {
  // If comment line
  if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
    return <span className="token-comment">{line}</span>;
  }

  // Token regex replacement matching keywords, functions, types, strings
  const parts = line.split(/(\b(?:import|export|from|function|interface|const|let|var|return|async|await|new|type|as|default)\b|\b(?:useRef|useCallback|useEffect|setTimeout|clearTimeout|Promise|Set|Array|Object)\b|'[^']*'|"[^"]*"|`[^`]*`)/g);

  return parts.map((part, i) => {
    if (
      /^(import|export|from|function|interface|const|let|var|return|async|await|new|type|as|default)$/.test(
        part
      )
    ) {
      return (
        <span key={i} className="token-keyword">
          {part}
        </span>
      );
    }
    if (
      /^(useRef|useCallback|useEffect|setTimeout|clearTimeout|Promise|Set|Array|Object)$/.test(
        part
      )
    ) {
      return (
        <span key={i} className="token-function font-semibold">
          {part}
        </span>
      );
    }
    if (part.startsWith("'") || part.startsWith('"') || part.startsWith("`")) {
      return (
        <span key={i} className="token-string">
          {part}
        </span>
      );
    }
    return part;
  });
}
