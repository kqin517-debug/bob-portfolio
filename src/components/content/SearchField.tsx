"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-14 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-accent/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/20 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="清除搜索"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
