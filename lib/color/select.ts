// Pick N maximally-distinct colors from the candidate pool.
// Farthest-point sampling under CIEDE2000, seeded by the most dominant color
// so the palette stays faithful to the image while spreading for legibility.
//
// In colorblind-safe mode the distance becomes the WORST case across normal
// vision plus deuteranopia / protanopia / tritanopia simulation — so the chosen
// colors stay distinguishable for colorblind readers, not just typical vision.
import { differenceCiede2000 } from "culori";
import { simulatePalette } from "./cvd";
import type { PoolColor } from "./types";

const de = differenceCiede2000();

export type SelectOptions = { cvdSafe?: boolean };

export function selectPalette(
  pool: PoolColor[],
  n: number,
  opts: SelectOptions = {},
): string[] {
  if (pool.length === 0) return [];
  const target = Math.min(n, pool.length);
  const hexes = pool.map((p) => p.hex);

  // Distance between two pool entries (by index).
  let dist: (i: number, j: number) => number;
  if (opts.cvdSafe) {
    // Precompute each color as seen under the three deficiencies once.
    const simD = simulatePalette(hexes, "deuter");
    const simP = simulatePalette(hexes, "prot");
    const simT = simulatePalette(hexes, "trit");
    dist = (i, j) =>
      Math.min(
        de(hexes[i], hexes[j]),
        de(simD[i], simD[j]),
        de(simP[i], simP[j]),
        de(simT[i], simT[j]),
      );
  } else {
    dist = (i, j) => de(hexes[i], hexes[j]);
  }

  // Seed with the highest-weight (most dominant) color.
  const picked = [0];
  const chosen = new Set<number>([0]);

  while (picked.length < target) {
    let bestIdx = -1;
    let bestMinDist = -1;
    for (let i = 0; i < hexes.length; i++) {
      if (chosen.has(i)) continue;
      let minDist = Infinity;
      for (const p of picked) minDist = Math.min(minDist, dist(i, p));
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) break;
    picked.push(bestIdx);
    chosen.add(bestIdx);
  }

  return picked.map((i) => hexes[i]);
}
