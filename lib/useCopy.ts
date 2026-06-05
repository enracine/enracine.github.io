"use client";
import { useCallback, useRef, useState } from "react";

/** Clipboard copy with a transient "copied" flag keyed by an arbitrary id. */
export function useCopy(timeout = 1400) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      setCopied(id);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), timeout);
    },
    [timeout],
  );

  return { copied, copy };
}
