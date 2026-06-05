// Research-figure quality metrics: categorical distinctness, colorblind safety,
// and grayscale separability — the three things journals actually care about.
import { converter, differenceCiede2000 } from "culori";
import { simulatePalette } from "./cvd";
import type { PaletteMetrics } from "./types";

const de = differenceCiede2000();
const toOklab = converter("oklab");

// Thresholds tuned for categorical (qualitative) palettes.
const DISTINCT_MIN = 12; // CIEDE2000 — comfortably separable
const CVD_MIN = 9; // still telling apart under simulation
const GRAY_MIN = 0.09; // OKLab lightness gap for print

function minPairwiseDe(palette: string[]): number {
  if (palette.length < 2) return Infinity;
  let min = Infinity;
  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      min = Math.min(min, de(palette[i], palette[j]));
    }
  }
  return min;
}

export function computeMetrics(palette: string[]): PaletteMetrics {
  const minDeltaE = minPairwiseDe(palette);
  const cvdMinDeltaE = minPairwiseDe(simulatePalette(palette, "deuter"));

  let minLightnessGap = Infinity;
  const ls = palette.map((h) => toOklab(h).l as number).sort((a, b) => a - b);
  for (let i = 1; i < ls.length; i++) {
    minLightnessGap = Math.min(minLightnessGap, ls[i] - ls[i - 1]);
  }

  const finite = (v: number) => (Number.isFinite(v) ? v : 999);
  return {
    minDeltaE: finite(minDeltaE),
    cvdMinDeltaE: finite(cvdMinDeltaE),
    minLightnessGap: Number.isFinite(minLightnessGap) ? minLightnessGap : 1,
    distinct: minDeltaE >= DISTINCT_MIN,
    cvdSafe: cvdMinDeltaE >= CVD_MIN,
    grayscaleSafe: (Number.isFinite(minLightnessGap) ? minLightnessGap : 1) >= GRAY_MIN,
  };
}
