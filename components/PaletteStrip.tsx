"use client";
import { Check, Copy } from "lucide-react";
import { readableInk } from "@/lib/color/readable";
import { useCopy } from "@/lib/useCopy";
import { useI18n, fill } from "@/lib/i18n";

type Props = {
  palette: string[];
  /** Colorblind-simulated version, shown as a secondary row when present. */
  simulated: string[] | null;
  simLabel: string;
};

export default function PaletteStrip({ palette, simulated, simLabel }: Props) {
  const { copied, copy } = useCopy();
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex overflow-hidden rounded-2xl border border-line">
        {palette.map((hex, i) => {
          const ink = readableInk(hex);
          const isCopied = copied === `sw-${i}`;
          return (
            <button
              key={`${hex}-${i}`}
              type="button"
              onClick={() => copy(hex, `sw-${i}`)}
              title={`Copy ${hex}`}
              className="group relative min-w-0 flex-1 cursor-pointer transition-[flex-grow] duration-300 hover:flex-[1.6]"
              style={{ background: hex }}
            >
              <span
                className="flex h-32 w-full flex-col items-start justify-end p-2.5 sm:h-44"
                style={{ color: ink }}
              >
                <span className="flex max-w-full items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                  ) : (
                    <Copy className="hidden h-3.5 w-3.5 shrink-0 group-hover:inline" strokeWidth={2} />
                  )}
                  <span className="truncate font-mono text-[11px] font-medium uppercase tracking-wide tnum">
                    {isCopied ? t.palette.copied : hex}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {simulated && (
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {fill(t.palette.asSeen, simLabel, "mode")}
          </span>
          <div className="flex h-9 overflow-hidden rounded-lg border border-line">
            {simulated.map((hex, i) => (
              <div key={`sim-${i}`} className="flex-1" style={{ background: hex }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
