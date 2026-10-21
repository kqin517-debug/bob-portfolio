"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Code2, FolderGit2, X, ArrowRight } from "lucide-react";
import { featuredSnippets } from "@/data/snippets";
import { featuredProjects } from "@/data/projects";
import { ShortcutHint } from "@/components/ui/ShortcutHint";

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet: (id: string) => void;
  onSelectProject: () => void;
}

export function SearchCommandModal({
  isOpen,
  onClose,
  onSelectSnippet,
  onSelectProject,
}: SearchCommandModalProps) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setQuery("");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;

      const opener = openerRef.current;
      if (opener && opener !== document.body && opener.isConnected) {
        const rect = opener.getBoundingClientRect();
        const isVisible =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.right > 0 &&
          rect.left < window.innerWidth;
        if (isVisible) {
          opener.focus({ preventScroll: true });
        }
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.isComposing) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.getClientRects().length > 0);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasProjects = featuredProjects.length > 0;
  const normalizedQuery = query.toLowerCase();
  const filteredSnippets = featuredSnippets.filter(
    (s) =>
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  const filteredProjects = featuredProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.technologies.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[60] flex items-start justify-center bg-black/75 px-4 pt-16 backdrop-blur-lg sm:pt-24"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="flex max-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0c13]/95 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="search-dialog-title" className="sr-only">
          搜索代码片段
        </h2>

        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 focus-within:bg-white/[0.02] focus-within:ring-1 focus-within:ring-inset focus-within:ring-accent/30">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <label htmlFor="search-input" className="sr-only">
            搜索代码片段
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              hasProjects
                ? "搜索代码片段、项目或标签…"
                : "搜索代码片段或标签，例如 debounce、async…"
            }
            className="flex-1 border-none bg-transparent text-sm text-white placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="关闭搜索"
            className="rounded-lg p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="space-y-1.5">
            <span className="px-2 font-mono text-[11px] tracking-wider text-muted">
              代码片段（{filteredSnippets.length}）
            </span>
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  type="button"
                  onClick={() => {
                    onSelectSnippet(snippet.id);
                    onClose();
                  }}
                  className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-left transition-colors hover:border-accent/20 hover:bg-accent-soft"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-white/[0.04] p-2 text-slate-400 transition-colors group-hover:text-accent">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {snippet.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {snippet.description}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-muted">
                    {snippet.language}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-2 py-1 text-xs text-muted">
                没有找到匹配的代码片段。
              </p>
            )}
          </div>

          {hasProjects && (
            <div className="space-y-1.5 pt-2">
              <span className="px-2 font-mono text-[11px] tracking-wider text-muted">
                项目（{filteredProjects.length}）
              </span>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onSelectProject();
                      onClose();
                    }}
                    className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-left transition-colors hover:border-accent/20 hover:bg-accent-soft"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-white/[0.04] p-2 text-slate-400 transition-colors group-hover:text-accent">
                        <FolderGit2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {project.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-slate-300" />
                  </button>
                ))
              ) : (
                <p className="px-2 py-1 text-xs text-muted">
                  没有找到匹配的项目。
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-5 py-3 font-mono text-[11px] text-muted">
          <span>ESC 关闭</span>
          <span className="flex items-center gap-1.5">
            打开
            <ShortcutHint className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
