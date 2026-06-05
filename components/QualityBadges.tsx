"use client";
import { Check, Minus, Eye, Printer, Shapes } from "lucide-react";
import type { PaletteMetrics } from "@/lib/color/types";
import { useI18n, fill } from "@/lib/i18n";

type Props = { metrics: PaletteMetrics };

function Badge({
  ok,
  icon,
  label,
  value,
}: {
  ok: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-2.5">
      <span className={`shrink-0 ${ok ? "text-ok" : "text-warn"}`}>{icon}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-ink">
          {label}
          {ok ? (
            <Check className="h-3.5 w-3.5 text-ok" strokeWidth={2.5} />
          ) : (
            <Minus className="h-3.5 w-3.5 text-warn" strokeWidth={2.5} />
          )}
        </span>
        <span className="block text-[11px] text-ink-faint tnum">{value}</span>
      </span>
    </div>
  );
}

export default function QualityBadges({ metrics }: Props) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <Badge
        ok={metrics.distinct}
        icon={<Shapes className="h-4 w-4" strokeWidth={1.75} />}
        label={t.quality.distinct}
        value={fill(t.quality.distinctValue, metrics.minDeltaE.toFixed(1))}
      />
      <Badge
        ok={metrics.cvdSafe}
        icon={<Eye className="h-4 w-4" strokeWidth={1.75} />}
        label={t.quality.cvd}
        value={fill(t.quality.cvdValue, metrics.cvdMinDeltaE.toFixed(1))}
      />
      <Badge
        ok={metrics.grayscaleSafe}
        icon={<Printer className="h-4 w-4" strokeWidth={1.75} />}
        label={t.quality.gray}
        value={fill(t.quality.grayValue, metrics.minLightnessGap.toFixed(2))}
      />
    </div>
  );
}
