"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { EXPORT_LABELS, serialize, type ExportFormat } from "@/lib/color/export";
import { useCopy } from "@/lib/useCopy";
import { useI18n } from "@/lib/i18n";

const FORMATS: ExportFormat[] = ["matplotlib", "ggplot2", "css", "json"];

export default function ExportPanel({ palette }: { palette: string[] }) {
  const [format, setFormat] = useState<ExportFormat>("matplotlib");
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  const code = serialize(palette, format);
  const isCopied = copied === "export";

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-line px-2 py-2">
        <div className="flex flex-wrap gap-1">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              aria-pressed={f === format}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                f === format ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper"
              }`}
            >
              {EXPORT_LABELS[f]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => copy(code, "export")}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-ok" strokeWidth={2.5} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          )}
          {isCopied ? t.exportPanel.copied : t.exportPanel.copy}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-ink">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
