// Shared color domain types used across server extraction and client rendering.

/** A candidate color from the extracted pool, with its share of the image. */
export type PoolColor = {
  /** sRGB hex, e.g. "#3b6ea5" */
  hex: string;
  /** Fraction of sampled pixels assigned to this cluster (0–1). */
  weight: number;
};

/** Style transforms applied to a selected palette, all in OKLCH. */
export type PaletteStyle = "original" | "vibrant" | "muted" | "soft";

/** Color-vision-deficiency simulation modes. */
export type CvdMode = "none" | "deuter" | "prot" | "trit";

/** Quality report for a palette (categorical research-figure suitability). */
export type PaletteMetrics = {
  /** Minimum pairwise CIEDE2000 between palette colors. */
  minDeltaE: number;
  /** Minimum pairwise CIEDE2000 after deuteranopia simulation. */
  cvdMinDeltaE: number;
  /** Minimum pairwise OKLab lightness gap (grayscale separability). */
  minLightnessGap: number;
  /** Distinct in normal vision (minDeltaE above threshold). */
  distinct: boolean;
  /** Safe for the most common color blindness. */
  cvdSafe: boolean;
  /** Distinguishable when printed in grayscale. */
  grayscaleSafe: boolean;
};

/** Result of analyzing whether the source image is too monochromatic. */
export type MonoReport = {
  isMono: boolean;
  /** Dominant hue in degrees (0–360), or null if achromatic. */
  baseHue: number | null;
  /** Weighted mean chroma of the pool (OKLCH C). */
  meanChroma: number;
};
