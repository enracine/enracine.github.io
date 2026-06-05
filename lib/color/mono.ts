// Detect monochromatic source images and propose harmonious extensions
// (analogous + sequential) so a flat photo still yields a usable palette.
import { converter, formatHex, clampChroma } from "culori";
import type { PoolColor, MonoReport } from "./types";

const toOklch = converter("oklch");

const MONO_CHROMA = 0.045; // weighted-mean OKLCH chroma below this reads as flat

export function analyzeMono(pool: PoolColor[]): MonoReport {
  if (pool.length === 0) return { isMono: false, baseHue: null, meanChroma: 0 };

  let meanChroma = 0;
  let sinSum = 0;
  let cosSum = 0;
  let chromaWeight = 0;
  for (const p of pool) {
    const c = toOklch(p.hex);
    const chroma = (c.c as number) ?? 0;
    const hue = (c.h as number) ?? 0;
    meanChroma += chroma * p.weight;
    if (chroma > 0.02) {
      const rad = (hue * Math.PI) / 180;
      sinSum += Math.sin(rad) * p.weight * chroma;
      cosSum += Math.cos(rad) * p.weight * chroma;
      chromaWeight += p.weight * chroma;
    }
  }

  let baseHue: number | null = null;
  if (chromaWeight > 0) {
    baseHue = (Math.atan2(sinSum, cosSum) * 180) / Math.PI;
    if (baseHue < 0) baseHue += 360;
  }

  return { isMono: meanChroma < MONO_CHROMA, baseHue, meanChroma };
}

/**
 * Build a harmonious suggestion set of `n` colors anchored on `baseHue`:
 * an analogous fan combined with a light→dark sequential ramp.
 */
export function suggestHarmony(baseHue: number | null, n: number): string[] {
  const hue = baseHue ?? 220; // default to a calm blue when achromatic
  const out: string[] = [];
  const spread = 48; // degrees of analogous fan
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const h = hue + (t - 0.5) * spread;
    const l = 0.4 + t * 0.42; // sequential lightness ramp
    const c = 0.11 - Math.abs(t - 0.5) * 0.05; // richest in the middle
    out.push(formatHex(clampChroma({ mode: "oklch", l, c, h }, "oklch")));
  }
  return out;
}
