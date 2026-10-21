"use client";

import { useEffect, useState } from "react";

export function ShortcutHint({ className = "" }: { className?: string }) {
  const [label, setLabel] = useState("Ctrl K");

  useEffect(() => {
    if (/Mac|iPhone|iPad|iPod/.test(navigator.platform)) {
      setLabel("⌘ K");
    }
  }, []);

  return <kbd className={className}>{label}</kbd>;
}
