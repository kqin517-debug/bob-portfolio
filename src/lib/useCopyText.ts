"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FEEDBACK_DURATION = 1600;

export function useCopyText(text: string) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 剪贴板不可用时保持原样，内容仍在页面上可手动复制。
      return;
    }

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), FEEDBACK_DURATION);
  }, [text]);

  return { copied, copyText };
}
