// Pick a legible ink color (near-black or near-white) to sit on a given swatch.
import { converter } from "culori";

const toOklab = converter("oklab");

export function readableInk(hex: string): string {
  const l = (toOklab(hex).l as number) ?? 0.5;
  return l > 0.62 ? "#18181b" : "#fafafa";
}
