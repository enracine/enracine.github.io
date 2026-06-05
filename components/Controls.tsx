"use client";
import type { CvdMode, PaletteStyle } from "@/lib/color/types";
import { useI18n } from "@/lib/i18n";

const STYLE_ORDER: PaletteStyle[] = ["original", "vibrant", "muted", "soft"];
const CVD_ORDER: CvdMode[] = ["none", "deuter", "prot", "trit"];

type Props = {
  count: number;
  style: PaletteStyle;
  cvd: CvdMode;
  cvdSafe: boolean;
  maxCount: number;
  onCount: (n: number) => void;
  onStyle: (s: PaletteStyle) => void;
  onCvd: (c: CvdMode) => void;
  onCvdSafe: (v: boolean) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
      {children}
    </span>
  );
}

export default function Controls({
  count,
  style,
  cvd,
  cvdSafe,
  maxCount,
  onCount,
  onStyle,
  onCvd,
  onCvdSafe,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-7">
      {/* Color count */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <FieldLabel>{t.ctrl.colors}</FieldLabel>
          <span className="tnum font-display text-2xl font-bold leading-none text-ink">
            {count}
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={maxCount}
          step={1}
          value={count}
          onChange={(e) => onCount(Number(e.target.value))}
          aria-label={t.ctrl.colors}
          className="w-full cursor-pointer accent-ink"
        />
        <div className="flex justify-between text-[11px] text-ink-faint tnum">
          <span>2</span>
          <span>{maxCount}</span>
        </div>
      </div>

      {/* Style */}
      <div className="space-y-3">
        <FieldLabel>{t.ctrl.style}</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_ORDER.map((value) => {
            const active = value === style;
            const s = t.styles[value];
            return (
              <button
                key={value}
                type="button"
                onClick={() => onStyle(value)}
                aria-pressed={active}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-card text-ink hover:border-line-strong"
                }`}
              >
                <span className="block text-sm font-semibold">{s.label}</span>
                <span className={`block text-[11px] ${active ? "text-paper/70" : "text-ink-faint"}`}>
                  {s.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colorblind-safe selection toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={cvdSafe}
        onClick={() => onCvdSafe(!cvdSafe)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-card px-3.5 py-3 text-left transition-colors hover:border-line-strong"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">{t.ctrl.cvdSafe}</span>
          <span className="block text-[11px] text-ink-faint">{t.ctrl.cvdSafeHint}</span>
        </span>
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            cvdSafe ? "bg-ink" : "bg-line-strong"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-transform ${
              cvdSafe ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>

      {/* Colorblind simulation */}
      <div className="space-y-3">
        <FieldLabel>{t.ctrl.simulate}</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {CVD_ORDER.map((m) => {
            const active = m === cvd;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onCvd(m)}
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-card text-ink-soft hover:border-line-strong"
                }`}
              >
                {t.cvd[m]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
