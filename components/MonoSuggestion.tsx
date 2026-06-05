"use client";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Props = {
  suggestion: string[];
  active: boolean;
  onToggle: (active: boolean) => void;
};

export default function MonoSuggestion({ suggestion, active, onToggle }: Props) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-warn">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm text-ink">
            <span className="font-semibold">{t.mono.title}</span>{" "}
            <span className="text-ink-soft">{t.mono.body}</span>
          </p>
          <div className="flex h-7 overflow-hidden rounded-lg border border-line">
            {suggestion.map((hex, i) => (
              <div key={i} className="flex-1" style={{ background: hex }} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onToggle(!active)}
            aria-pressed={active}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-ink"
            }`}
          >
            {active ? t.mono.using : t.mono.use}
          </button>
        </div>
      </div>
    </div>
  );
}
