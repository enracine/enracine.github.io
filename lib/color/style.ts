// Style transforms in OKLCH (perceptually uniform), gamut-clamped back to sRGB.
import { converter, formatHex, clampChroma } from "culori";
import type { PaletteStyle } from "./types";

const toOklch = converter("oklch");

type Oklch = { mode: "oklch"; l: number; c: number; h: number };

function mapHex(hex: string, fn: (c: Oklch) => Oklch): string {
  const src = toOklch(hex);
  const next: Oklch = {
    mode: "oklch",
    l: src.l as number,
    c: (src.c as number) ?? 0,
    h: (src.h as number) ?? 0,
  };
  return formatHex(clampChroma(fn(next), "oklch"));
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function applyStyle(palette: string[], style: PaletteStyle): string[] {
  switch (style) {
    case "vibrant":
      // Push chroma up, nudge mid-lightness toward punchier tones.
      return palette.map((hex) =>
        mapHex(hex, (c) => ({ ...c, c: c.c * 1.45 + 0.02, l: clamp(c.l, 0.45, 0.82) })),
      );
    case "muted":
      // Editorial, desaturated — Morandi-like restraint.
      return palette.map((hex) => mapHex(hex, (c) => ({ ...c, c: c.c * 0.5 })));
    case "soft":
      // Pastel: lift lightness, ease chroma.
      return palette.map((hex) =>
        mapHex(hex, (c) => ({ ...c, l: clamp(c.l * 0.55 + 0.4, 0, 0.95), c: c.c * 0.65 })),
      );
    case "original":
    default:
      return palette.slice();
  }
}
