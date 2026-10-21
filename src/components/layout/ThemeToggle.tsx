"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const { theme, applyTheme } = useTheme();

  return (
    <span
      role="group"
      aria-label="外观"
      className="flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5"
    >
      <button
        type="button"
        onClick={() => applyTheme("dark")}
        aria-pressed={theme === "dark"}
        title="深色模式"
        className={`rounded-md p-1.5 transition-colors ${
          theme === "dark"
            ? "bg-accent/15 text-accent"
            : "text-muted hover:bg-white/[0.04] hover:text-slate-200"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => applyTheme("light")}
        aria-pressed={theme === "light"}
        title="浅色模式"
        className={`rounded-md p-1.5 transition-colors ${
          theme === "light"
            ? "bg-accent/15 text-accent"
            : "text-muted hover:bg-white/[0.04] hover:text-slate-200"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
