"use client";

import { useCopyText } from "@/lib/useCopyText";

export function useCopyEmail(email: string) {
  const { copied, copyText } = useCopyText(email);
  return { copied, copyEmail: copyText };
}
