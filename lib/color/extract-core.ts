// Perceptual color-pool extraction via k-means in OKLab space.
// Pure TS (no sharp) so it can run on the server route or be unit-tested.
import { converter, formatHex, clampChroma } from "culori";
import type { PoolColor } from "./types";

const toOklab = converter("oklab");
const toOklch = converter("oklch");

export type Lab = { l: number; a: number; b: number };

/** Small deterministic PRNG so identical images yield identical palettes. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function dist2(p: Lab, q: Lab): number {
  const dl = p.l - q.l;
  const da = p.a - q.a;
  const db = p.b - q.b;
  return dl * dl + da * da + db * db;
}

/** Convert a packed sRGB byte triplet to OKLab. */
export function rgbByteToLab(r: number, g: number, b: number): Lab {
  const c = toOklab({ mode: "rgb", r: r / 255, g: g / 255, b: b / 255 });
  return { l: c.l as number, a: c.a as number, b: c.b as number };
}

/**
 * k-means++ seeded clustering. Returns cluster centers sorted by weight (share
 * of pixels), dropping near-empty clusters. Output is gamut-clamped sRGB hex.
 */
export function clusterPool(points: Lab[], k = 24, iterations = 12): PoolColor[] {
  if (points.length === 0) return [];
  const rng = mulberry32(0x9e3779b9 ^ points.length);
  const kk = Math.min(k, points.length);

  // k-means++ initialization.
  const centers: Lab[] = [points[Math.floor(rng() * points.length)]];
  while (centers.length < kk) {
    const d2: number[] = new Array(points.length);
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      let best = Infinity;
      for (const c of centers) best = Math.min(best, dist2(points[i], c));
      d2[i] = best;
      sum += best;
    }
    let target = rng() * sum;
    let chosen = points.length - 1;
    for (let i = 0; i < points.length; i++) {
      target -= d2[i];
      if (target <= 0) {
        chosen = i;
        break;
      }
    }
    centers.push(points[chosen]);
  }

  // Lloyd iterations.
  const assign = new Int32Array(points.length);
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < points.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = dist2(points[i], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      assign[i] = best;
    }
    const sumL = new Float64Array(centers.length);
    const sumA = new Float64Array(centers.length);
    const sumB = new Float64Array(centers.length);
    const count = new Int32Array(centers.length);
    for (let i = 0; i < points.length; i++) {
      const c = assign[i];
      sumL[c] += points[i].l;
      sumA[c] += points[i].a;
      sumB[c] += points[i].b;
      count[c]++;
    }
    for (let c = 0; c < centers.length; c++) {
      if (count[c] > 0) {
        centers[c] = { l: sumL[c] / count[c], a: sumA[c] / count[c], b: sumB[c] / count[c] };
      }
    }
  }

  // Final weights.
  const count = new Int32Array(centers.length);
  for (let i = 0; i < points.length; i++) count[assign[i]]++;

  const total = points.length;
  const pool: PoolColor[] = [];
  for (let c = 0; c < centers.length; c++) {
    const weight = count[c] / total;
    if (weight < 0.004) continue; // drop noise clusters (<0.4%)
    const lab = { mode: "oklab", l: centers[c].l, a: centers[c].a, b: centers[c].b };
    const hex = formatHex(clampChroma(toOklch(lab), "oklch"));
    pool.push({ hex, weight });
  }
  pool.sort((p, q) => q.weight - p.weight);
  return pool;
}
