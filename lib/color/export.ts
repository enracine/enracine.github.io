// Serialize a palette into ready-to-paste snippets for common research tools.
export type ExportFormat = "matplotlib" | "ggplot2" | "css" | "json";

export const EXPORT_LABELS: Record<ExportFormat, string> = {
  matplotlib: "Matplotlib",
  ggplot2: "ggplot2",
  css: "CSS",
  json: "JSON",
};

export const EXPORT_LANG: Record<ExportFormat, string> = {
  matplotlib: "python",
  ggplot2: "r",
  css: "css",
  json: "json",
};

export function serialize(palette: string[], format: ExportFormat): string {
  const quoted = palette.map((h) => `"${h}"`);
  switch (format) {
    case "matplotlib":
      return [
        "import matplotlib as mpl",
        "from cycler import cycler",
        "",
        `enracine = [${quoted.join(", ")}]`,
        'mpl.rcParams["axes.prop_cycle"] = cycler(color=enracine)',
      ].join("\n");
    case "ggplot2":
      return [
        `enracine <- c(${quoted.join(", ")})`,
        "",
        "# scale_color_manual(values = enracine)",
        "# scale_fill_manual(values = enracine)",
      ].join("\n");
    case "css":
      return [":root {", ...palette.map((h, i) => `  --enracine-${i + 1}: ${h};`), "}"].join("\n");
    case "json":
      return JSON.stringify(palette, null, 2);
    default:
      return palette.join("\n");
  }
}
