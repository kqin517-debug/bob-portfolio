"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "bob-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark"
    );
  }, []);

  const applyTheme = (next: Theme) => {
    const root = document.documentElement;

    root.classList.toggle("light", next === "light");
    root.classList.toggle("dark", next === "dark");

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 隐私模式下无法持久化时，本次会话内仍然可以切换。
    }

    setTheme(next);
  };

  return { theme, applyTheme };
}
