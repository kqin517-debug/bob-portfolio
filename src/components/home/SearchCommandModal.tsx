"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Code2, FolderGit2, X, ArrowRight } from "lucide-react";
import { featuredSnippets } from "@/data/snippets";
import { featuredProjects } from "@/data/projects";

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="w-full max-w-2xl rounded-3xl glass-panel border border-white/20 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="search-dialog-title" className="sr-only">
          {hasProjects ? "Search snippets and projects" : "Search snippets"}
        </h2>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-md">
          <Search className="w-5 h-5 text-blue-400" />
          <label htmlFor="search-input" className="sr-only">
            {hasProjects ? "Search snippets and projects" : "Search snippets"}
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              hasProjects
                ? "Search snippets, projects, tags..."
                : "Search snippets and tags (e.g. 'debounce', 'async')..."
            }
            className="flex-1 bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Snippets Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2">
              Code Snippets ({filteredSnippets.length})
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
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-blue-600/20 border border-white/5 hover:border-blue-400/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-300">
                        {snippet.title}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {snippet.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5">
                    {snippet.language}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-500 px-2 py-1">No matching snippets found.</p>
            )}
          </div>

          {/* Projects Section */}
          {hasProjects && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2">
                Projects ({filteredProjects.length})
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
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-purple-600/20 border border-white/5 hover:border-purple-400/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-purple-300">
                          {project.name}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 px-2 py-1">No matching projects found.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/50 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Tip: Press ESC to close</span>
          <span>⚡ Instant In-Memory Filter</span>
        </div>
      </div>
    </div>
  );
}
