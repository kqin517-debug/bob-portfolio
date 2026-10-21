"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Check, AlertCircle, FileCode } from "lucide-react";
import { featuredSnippets } from "@/data/snippets";

interface FeaturedSnippetsProps {
  selectedSnippetId: string;
  onSelectedSnippetChange: (id: string) => void;
  selectionNonce: number;
}

type CopyState = "idle" | "copied" | "error";

export function FeaturedSnippets({
  selectedSnippetId,
  onSelectedSnippetChange,
  selectionNonce,
}: FeaturedSnippetsProps) {
  const [activeTab, setActiveTab] = useState<"code" | "explanation">("code");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<number | null>(null);

  const currentSnippet =
    featuredSnippets.find((s) => s.id === selectedSnippetId) ||
    featuredSnippets[0];

  useEffect(() => {
    setActiveTab("code");
    setCopyState("idle");
  }, [selectedSnippetId, selectionNonce]);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <section id="snippets" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Snippets
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            代码片段
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
          本页收录的代码实现，支持一键复制与查看说明。
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {featuredSnippets.map((snippet) => {
          const isSelected = snippet.id === selectedSnippetId;
          return (
            <button
              key={snippet.id}
              onClick={() => {
                onSelectedSnippetChange(snippet.id);
                setActiveTab("code");
              }}
              aria-pressed={isSelected}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                isSelected
                  ? "border-accent/40 bg-accent-soft text-white"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:text-slate-100"
              }`}
            >
              {snippet.title.split("：")[0]}
              <span
                className={`ml-2 font-mono text-[11px] uppercase ${
                  isSelected ? "text-accent" : "text-muted"
                }`}
              >
                {snippet.language}
              </span>
            </button>
          );
        })}
      </div>

      <div className="code-surface overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="traffic-dot h-3 w-3 bg-[#FF5F56]" />
              <span className="traffic-dot h-3 w-3 bg-[#FFBD2E]" />
              <span className="traffic-dot h-3 w-3 bg-[#27C93F]" />
            </div>

            <span className="hidden h-4 w-px bg-white/[0.08] sm:block" />

            <div className="hidden items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-400 sm:flex">
              <FileCode className="h-3.5 w-3.5 text-muted" />
              {currentSnippet.id}.
              {currentSnippet.language === "css" ? "css" : "ts"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5 text-[11px]">
              <button
                onClick={() => setActiveTab("code")}
                aria-pressed={activeTab === "code"}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  activeTab === "code"
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-slate-200"
                }`}
              >
                代码
              </button>
              <button
                onClick={() => setActiveTab("explanation")}
                aria-pressed={activeTab === "explanation"}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  activeTab === "explanation"
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-slate-200"
                }`}
              >
                说明
              </button>
            </div>

            <button
              onClick={handleCopy}
              title="复制代码"
              className={`flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] transition-colors hover:bg-white/[0.06] ${
                copyState === "error"
                  ? "text-amber-300"
                  : copyState === "copied"
                    ? "text-emerald-300"
                    : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {copyState === "copied" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  已复制
                </>
              ) : copyState === "error" ? (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  复制失败
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  复制
                </>
              )}
            </button>
            <span aria-live="polite" className="sr-only">
              {copyState === "copied"
                ? "代码已复制到剪贴板"
                : copyState === "error"
                  ? "复制失败，请手动选择代码"
                  : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 text-xs sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <h3 className="truncate font-medium text-slate-100">
              {currentSnippet.title}
            </h3>
            <span className="shrink-0 rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-slate-400">
              {currentSnippet.complexity}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentSnippet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-accent/20 bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {activeTab === "code" ? (
          <div className="overflow-x-auto bg-[#070910]">
            <pre className="p-4 font-mono text-[12px] leading-[1.7] text-slate-300 sm:p-5 sm:text-[13px]">
              <code className="inline-block min-w-full">
                {currentSnippet.code.split("\n").map((line, idx) => (
                  <div
                    key={idx}
                    className="table-row group hover:bg-white/[0.03]"
                  >
                    <span className="table-cell select-none pr-4 text-right font-mono text-xs text-muted group-hover:text-slate-400 sm:pr-6">
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
          <div className="space-y-6 bg-[#070910] p-5 text-sm leading-[1.8] sm:p-7">
            <div className="space-y-2">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                核心思路
              </h4>
              <p className="text-pretty text-slate-300">
                {currentSnippet.explanation}
              </p>
            </div>

            <div className="grid gap-3 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted">复杂度</span>
                <span className="font-mono text-slate-300">
                  {currentSnippet.complexity}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted">更新于</span>
                <span className="font-mono text-slate-300">
                  {currentSnippet.updatedAt}
                </span>
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
  if (
    line.trim().startsWith("//") ||
    line.trim().startsWith("/*") ||
    line.trim().startsWith("*")
  ) {
    return <span className="token-comment">{line}</span>;
  }

  const parts = line.split(
    /(\b(?:import|export|from|function|interface|const|let|var|return|async|await|new|type|as|default)\b|\b(?:useRef|useCallback|useEffect|setTimeout|clearTimeout|Promise|Set|Array|Object)\b|'[^']*'|"[^"]*"|`[^`]*`)/g
  );

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
