"use client";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";

type ChartType = "bar" | "line" | "area" | "pie" | "scatter";

/** A visible series: its palette color plus its original index (data seed). */
type Series = { color: string; idx: number };

type Props = {
  /** Effective colors to render (already CVD-simulated upstream if needed). */
  colors: string[];
};

// Deterministic pseudo-random in [0,1) from two integers — stable per render.
function rand(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const W = 560;
const H = 264;
const PAD = 30;
const CATS = 5;
const PLOT_W = W - PAD * 2;
const PLOT_H = H - PAD * 2;

const TYPES: ChartType[] = ["bar", "line", "area", "pie", "scatter"];
const EMPTY: ReadonlySet<number> = new Set();

export default function ChartPreview({ colors }: Props) {
  const { t } = useI18n();
  const [type, setType] = useState<ChartType>("bar");
  // Hidden series, scoped to the current palette size so it resets on count change.
  const [hidden, setHidden] = useState<{ n: number; set: Set<number> }>({ n: 0, set: new Set() });
  const n = colors.length;

  const activeHidden = hidden.n === n ? hidden.set : EMPTY;

  function toggle(i: number) {
    const base = hidden.n === n ? new Set(hidden.set) : new Set<number>();
    if (base.has(i)) {
      base.delete(i);
    } else {
      if (n - base.size <= 1) return; // always keep at least one series visible
      base.add(i);
    }
    setHidden({ n, set: base });
  }

  // value[series][category] in [0.12, 1], indexed by original color position.
  const values = useMemo(() => {
    const v: number[][] = [];
    for (let s = 0; s < n; s++) {
      v.push(Array.from({ length: CATS }, (_, c) => 0.12 + rand(s + 1, c + 3) * 0.82));
    }
    return v;
  }, [n]);

  const series: Series[] = colors
    .map((color, idx) => ({ color, idx }))
    .filter((s) => !activeHidden.has(s.idx));

  const xAt = (c: number) => PAD + (c / (CATS - 1)) * PLOT_W;
  const yAt = (vv: number) => PAD + (1 - vv) * PLOT_H;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {TYPES.map((ty) => (
          <button
            key={ty}
            type="button"
            onClick={() => setType(ty)}
            aria-pressed={ty === type}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              ty === type ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper"
            }`}
          >
            {t.charts[ty]}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Sample ${type} chart rendered with the current palette`}
      >
        {type !== "pie" &&
          [0, 0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1={PAD}
              x2={W - PAD}
              y1={PAD + g * PLOT_H}
              y2={PAD + g * PLOT_H}
              stroke={g === 1 ? "#d4d4d8" : "#ececee"}
              strokeWidth={1}
            />
          ))}

        {type === "bar" && <Bars series={series} values={values} />}
        {type === "line" && <Lines series={series} values={values} xAt={xAt} yAt={yAt} />}
        {type === "area" && <Areas series={series} values={values} xAt={xAt} />}
        {type === "pie" && <Pie series={series} values={values} />}
        {type === "scatter" && <Scatter series={series} values={values} />}
      </svg>

      {/* Clickable legend — toggle series to test which colors work together. */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {colors.map((c, i) => {
            const off = activeHidden.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={!off}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors hover:border-line-strong"
                style={{ borderColor: off ? "transparent" : "var(--color-line)" }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
                  style={{ background: c, opacity: off ? 0.25 : 1 }}
                />
                <span className={off ? "text-ink-faint line-through" : "text-ink-soft"}>
                  {t.charts.series} {i + 1}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-ink-faint">{t.charts.toggleHint}</p>
      </div>
    </div>
  );
}

function Bars({ series, values }: { series: Series[]; values: number[][] }) {
  const n = series.length;
  const groupW = PLOT_W / CATS;
  const barW = (groupW * 0.82) / n;
  const rects: React.ReactNode[] = [];
  for (let c = 0; c < CATS; c++) {
    for (let p = 0; p < n; p++) {
      const v = values[series[p].idx][c];
      const h = v * PLOT_H;
      rects.push(
        <rect
          key={`${c}-${p}`}
          x={PAD + c * groupW + groupW * 0.09 + p * barW}
          y={H - PAD - h}
          width={Math.max(barW - 1.5, 1)}
          height={h}
          rx={1.5}
          fill={series[p].color}
        />,
      );
    }
  }
  return <>{rects}</>;
}

function Lines({
  series,
  values,
  xAt,
  yAt,
}: {
  series: Series[];
  values: number[][];
  xAt: (c: number) => number;
  yAt: (v: number) => number;
}) {
  return (
    <>
      {series.map((s, p) => (
        <g key={p}>
          <polyline
            points={values[s.idx].map((v, c) => `${xAt(c)},${yAt(v)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {values[s.idx].map((v, c) => (
            <circle key={c} cx={xAt(c)} cy={yAt(v)} r={3.2} fill={s.color} />
          ))}
        </g>
      ))}
    </>
  );
}

function Areas({
  series,
  values,
  xAt,
}: {
  series: Series[];
  values: number[][];
  xAt: (c: number) => number;
}) {
  const totals = Array.from({ length: CATS }, (_, c) =>
    series.reduce((sum, s) => sum + values[s.idx][c], 0),
  );
  const maxTotal = Math.max(...totals, 1e-6);
  const yAt = (v: number) => PAD + (1 - v / maxTotal) * PLOT_H;

  const cum = Array.from({ length: CATS }, () => 0);
  const bands: React.ReactNode[] = [];
  for (let p = 0; p < series.length; p++) {
    const lower = cum.slice();
    const upper = cum.map((acc, c) => acc + values[series[p].idx][c]);
    const top = upper.map((v, c) => `${xAt(c)},${yAt(v)}`);
    const bottom = Array.from(
      { length: CATS },
      (_, c) => `${xAt(CATS - 1 - c)},${yAt(lower[CATS - 1 - c])}`,
    ).join(" ");
    bands.push(
      <polygon key={p} points={`${top.join(" ")} ${bottom}`} fill={series[p].color} fillOpacity={0.85} />,
    );
    for (let c = 0; c < CATS; c++) cum[c] = upper[c];
  }
  return <>{bands}</>;
}

function Pie({ series, values }: { series: Series[]; values: number[][] }) {
  const weights = series.map((s) => values[s.idx].reduce((a, b) => a + b, 0));
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(PLOT_H / 2, H / 2 - PAD * 0.5);
  const inner = r * 0.56;
  const p = (rad: number, ang: number) => `${cx + rad * Math.cos(ang)},${cy + rad * Math.sin(ang)}`;

  const slices: React.ReactNode[] = [];
  let angle = -Math.PI / 2;
  for (let s = 0; s < weights.length; s++) {
    const a0 = angle;
    const a1 = angle + (weights[s] / total) * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = [
      `M ${p(r, a0)}`,
      `A ${r} ${r} 0 ${large} 1 ${p(r, a1)}`,
      `L ${p(inner, a1)}`,
      `A ${inner} ${inner} 0 ${large} 0 ${p(inner, a0)}`,
      "Z",
    ].join(" ");
    slices.push(<path key={s} d={d} fill={series[s].color} stroke="#ffffff" strokeWidth={1.5} />);
  }
  return <>{slices}</>;
}

const MARKERS = ["circle", "square", "triangle", "diamond"] as const;

function Scatter({ series, values }: { series: Series[]; values: number[][] }) {
  const nodes: React.ReactNode[] = [];
  for (let p = 0; p < series.length; p++) {
    const { idx, color } = series[p];
    const baseX = 0.16 + (p / Math.max(series.length - 1, 1)) * 0.6;
    const baseY = 0.25 + values[idx][0] * 0.5;
    const marker = MARKERS[idx % MARKERS.length];
    for (let q = 0; q < 9; q++) {
      const jx = (rand(idx + 1, q + 11) - 0.5) * 0.3;
      const jy = (rand(idx + 7, q + 3) - 0.5) * 0.3;
      const x = PAD + (baseX + jx) * PLOT_W;
      const y = PAD + (1 - (baseY + jy)) * PLOT_H;
      nodes.push(<Marker key={`${p}-${q}`} kind={marker} x={x} y={y} fill={color} />);
    }
  }
  return <>{nodes}</>;
}

function Marker({
  kind,
  x,
  y,
  fill,
}: {
  kind: (typeof MARKERS)[number];
  x: number;
  y: number;
  fill: string;
}) {
  const r = 4.2;
  if (kind === "square") {
    return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1} fill={fill} fillOpacity={0.9} />;
  }
  if (kind === "triangle") {
    return (
      <path d={`M ${x} ${y - r * 1.2} L ${x + r * 1.1} ${y + r} L ${x - r * 1.1} ${y + r} Z`} fill={fill} fillOpacity={0.9} />
    );
  }
  if (kind === "diamond") {
    return (
      <path d={`M ${x} ${y - r * 1.3} L ${x + r * 1.1} ${y} L ${x} ${y + r * 1.3} L ${x - r * 1.1} ${y} Z`} fill={fill} fillOpacity={0.9} />
    );
  }
  return <circle cx={x} cy={y} r={r} fill={fill} fillOpacity={0.9} />;
}
