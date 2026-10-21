"use client";

import { Check, Copy } from "lucide-react";
import { useCopyText } from "@/lib/useCopyText";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "复制引用",
  copiedLabel = "已复制",
  className = "",
}: CopyButtonProps) {
  const { copied, copyText } = useCopyText(text);

  return (
    <button
      type="button"
      onClick={copyText}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={className}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0" />
      )}
      <span>{copied ? copiedLabel : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
