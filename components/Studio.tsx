"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Eye } from "lucide-react";
import type { CvdMode, MonoReport, PaletteStyle, PoolColor } from "@/lib/color/types";
import { selectPalette } from "@/lib/color/select";
import { applyStyle } from "@/lib/color/style";
import { simulatePalette } from "@/lib/color/cvd";
import { computeMetrics } from "@/lib/color/metrics";
import { analyzeMono, suggestHarmony } from "@/lib/color/mono";
import { extractPoolFromFile } from "@/lib/color/extract-client";
import { useI18n, fill } from "@/lib/i18n";
import Dropzone from "./Dropzone";
import Controls from "./Controls";
import PaletteStrip from "./PaletteStrip";
import QualityBadges from "./QualityBadges";
import ChartPreview from "./ChartPreview";
import ExportPanel from "./ExportPanel";
import MonoSuggestion from "./MonoSuggestion";

const MAX_COLORS = 12;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
      {children}
    </h2>
  );
}

export default function Studio() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pool, setPool] = useState<PoolColor[] | null>(null);
  const [mono, setMono] = useState<MonoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [count, setCount] = useState(5);
  const [style, setStyle] = useState<PaletteStyle>("original");
  const [cvd, setCvd] = useState<CvdMode>("none");
  const [cvdSafe, setCvdSafe] = useState(false);
  const [useHarmony, setUseHarmony] = useState(false);

  const urlRef = useRef<string | null>(null);
  useEffect(() => () => void (urlRef.current && URL.revokeObjectURL(urlRef.current)), []);

  const onFile = useCallback(async (file: File) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setImageUrl(url);
    setLoading(true);
    setHasError(false);
    setUseHarmony(false);
    try {
      const nextPool = await extractPoolFromFile(file);
      if (nextPool.length === 0) throw new Error("No colors extracted.");
      setPool(nextPool);
      setMono(analyzeMono(nextPool));
    } catch {
      setHasError(true);
      setPool(null);
      setMono(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const maxCount = useMemo(() => {
    if (useHarmony) return MAX_COLORS;
    if (!pool) return MAX_COLORS;
    return Math.max(2, Math.min(MAX_COLORS, pool.length));
  }, [pool, useHarmony]);

  // Derive a count within the achievable range instead of storing it clamped.
  const effCount = Math.min(Math.max(2, count), maxCount);

  const basePalette = useMemo(() => {
    if (useHarmony && mono) return suggestHarmony(mono.baseHue, effCount);
    if (pool) return selectPalette(pool, effCount, { cvdSafe });
    return [];
  }, [pool, mono, useHarmony, effCount, cvdSafe]);

  const styled = useMemo(() => applyStyle(basePalette, style), [basePalette, style]);
  const simulated = useMemo(
    () => (cvd === "none" ? null : simulatePalette(styled, cvd)),
    [styled, cvd],
  );
  const chartColors = simulated ?? styled;
  const metrics = useMemo(() => computeMetrics(styled), [styled]);

  const hasResult = styled.length > 0;
  const cvdLabel = t.cvd[cvd];

  // When the palette can't be colorblind-safe, explain why and what to do — so a
  // red badge reads as an image limit + actionable fix, not a broken algorithm.
  const cvdAdvice = useMemo<string | null>(() => {
    if (!pool || useHarmony || metrics.cvdSafe) return null;
    if (!cvdSafe) return t.cvdAdvice.enable;
    // Colorblind-safe mode is on but still unsafe: find the largest count that
    // *would* be safe for this photo, and suggest it.
    let bestSafeN = 0;
    for (let nn = 2; nn <= maxCount; nn++) {
      const pal = applyStyle(selectPalette(pool, nn, { cvdSafe: true }), style);
      if (computeMetrics(pal).cvdSafe) bestSafeN = nn;
    }
    return bestSafeN >= 2 ? fill(t.cvdAdvice.limit, String(bestSafeN), "n") : t.cvdAdvice.none;
  }, [pool, useHarmony, metrics.cvdSafe, cvdSafe, style, maxCount, t]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
      {/* ── Inputs ───────────────────────────────────────────── */}
      <div className="space-y-7 lg:sticky lg:top-6 lg:self-start">
        <Dropzone imageUrl={imageUrl} loading={loading} onFile={onFile} />

        {hasError && (
          <p className="rounded-xl border border-warn/40 bg-warn/5 px-4 py-3 text-sm text-warn">
            {t.errors.generic}
          </p>
        )}

        {pool && (
          <Controls
            count={effCount}
            style={style}
            cvd={cvd}
            cvdSafe={cvdSafe}
            maxCount={maxCount}
            onCount={setCount}
            onStyle={setStyle}
            onCvd={setCvd}
            onCvdSafe={setCvdSafe}
          />
        )}

        {pool && mono?.isMono && (
          <MonoSuggestion
            suggestion={suggestHarmony(mono.baseHue, Math.max(effCount, 5))}
            active={useHarmony}
            onToggle={setUseHarmony}
          />
        )}
      </div>

      {/* ── Outputs ──────────────────────────────────────────── */}
      <div className="min-w-0 space-y-8">
        {!hasResult ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-card/50 px-8 text-center">
            <p className="font-display text-xl font-semibold text-ink">{t.empty.title}</p>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">{t.empty.desc}</p>
          </div>
        ) : (
          <>
            <section className="space-y-3 animate-rise">
              <div className="flex items-center justify-between">
                <SectionTitle>{t.sec.palette}</SectionTitle>
                {cvd !== "none" && (
                  <span className="text-[11px] font-medium text-ink-faint">
                    {fill(t.palette.simulating, cvdLabel, "mode")}
                  </span>
                )}
              </div>
              <PaletteStrip palette={styled} simulated={simulated} simLabel={cvdLabel} />
            </section>

            <section className="space-y-3">
              <SectionTitle>{t.sec.quality}</SectionTitle>
              <QualityBadges metrics={metrics} />
              {cvdAdvice && (
                <p className="flex items-start gap-2 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                  <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} />
                  <span>{cvdAdvice}</span>
                </p>
              )}
            </section>

            <section className="space-y-3">
              <SectionTitle>{t.sec.preview}</SectionTitle>
              <div className="rounded-2xl border border-line bg-card p-5">
                <ChartPreview colors={chartColors} />
              </div>
            </section>

            <section className="space-y-3">
              <SectionTitle>{t.sec.export}</SectionTitle>
              <ExportPanel palette={styled} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
