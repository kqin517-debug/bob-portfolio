"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FEEDBACK_DURATION = 1600;

export function useCopyEmail(email: string) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // 剪贴板不可用时保持原样，邮箱在首屏可见，可手动复制。
      return;
    }

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), FEEDBACK_DURATION);
  }, [email]);

  return { copied, copyEmail };
}
