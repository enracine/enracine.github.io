// Minimal ambient typings for culori v4 (ships no types, no @types package).
// Only the surface we actually use is declared; colors are loose objects.
declare module "culori" {
  export type Color = Record<string, number | string | undefined>;
  export function converter(mode: string): (c: unknown) => Color;
  export function parse(input: string): Color | undefined;
  export function formatHex(c: unknown): string;
  export function formatRgb(c: unknown): string;
  export function clampChroma(c: unknown, mode?: string): Color;
  export function differenceCiede2000(): (a: unknown, b: unknown) => number;
  export function differenceEuclidean(mode?: string): (a: unknown, b: unknown) => number;
  export function wcagContrast(a: unknown, b: unknown): number;
  export function filterDeficiencyDeuter(severity?: number): (c: unknown) => Color;
  export function filterDeficiencyProt(severity?: number): (c: unknown) => Color;
  export function filterDeficiencyTrit(severity?: number): (c: unknown) => Color;
}
