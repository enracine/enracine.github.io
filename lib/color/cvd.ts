// Color-vision-deficiency simulation (Machado et al., via culori filters).
import { formatHex, filterDeficiencyDeuter, filterDeficiencyProt, filterDeficiencyTrit } from "culori";
import type { CvdMode } from "./types";

const deuter = filterDeficiencyDeuter(1);
const prot = filterDeficiencyProt(1);
const trit = filterDeficiencyTrit(1);

export const CVD_LABELS: Record<CvdMode, string> = {
  none: "Normal vision",
  deuter: "Deuteranopia",
  prot: "Protanopia",
  trit: "Tritanopia",
};

function filterFor(mode: CvdMode) {
  switch (mode) {
    case "deuter":
      return deuter;
    case "prot":
      return prot;
    case "trit":
      return trit;
    default:
      return null;
  }
}

export function simulateHex(hex: string, mode: CvdMode): string {
  const f = filterFor(mode);
  return f ? formatHex(f(hex)) : hex;
}

export function simulatePalette(palette: string[], mode: CvdMode): string[] {
  const f = filterFor(mode);
  return f ? palette.map((h) => formatHex(f(h))) : palette.slice();
}
