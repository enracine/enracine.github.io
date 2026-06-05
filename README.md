# Enracine

*/ɑ̃.ʁa.sin/ — French, "to take root."*

**Research color, rooted in the world you've seen.** Upload a landscape photo, choose
how many colors you need, and Enracine derives a publication-ready scientific palette —
perceptually spaced, colorblind-safe, and grayscale-checked — with instant style tuning
and one-click export to Matplotlib / ggplot2 / CSS / JSON.

> The places you walked through deserve to take root in your figures.

**Live:** https://enracine.github.io

This is the **fully static** build — everything (image decode, OKLab k-means
extraction, palette selection, colorblind optimization, charts, export) runs in your
browser. No server, no upload, nothing leaves your device.

## How it works

1. **Decode + extract (browser).** The image is drawn to a `<canvas>`, downscaled,
   and clustered with a weighted **k-means in OKLab** into a 24-color candidate pool.
2. **Tune instantly.** Farthest-point selection under **CIEDE2000** (with an optional
   worst-case colorblind-safe mode), OKLCH style transforms, CVD simulation, quality
   metrics, and export — all client-side, zero wait.

Bilingual (English / 中文). Built with Next.js (App Router, static export) + culori.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build (static)

```bash
npm run build    # output: "export" → ./out  (a static site)
```

## Deploy to GitHub Pages

This repo is `enracine.github.io` (a user site served at the domain root).

1. Push to the `main` branch.
2. In **Settings → Pages → Build and deployment**, set **Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes `out/`
   on every push. The site goes live at https://enracine.github.io.

> A `.nojekyll` file is included so GitHub Pages serves the Next.js `_next/` assets.
> Because this is a root user site, no `basePath` is needed.

## License

© 2026 Junyu Xue. All rights reserved. · Contact: junyuxue@outlook.com
