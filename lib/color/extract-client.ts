// Client-side perceptual color-pool extraction — the static build's replacement
// for the server `/api/extract` route. Decodes the image with Canvas, downscales,
// then runs the same OKLab k-means as the server (extract-core is isomorphic).
import { clusterPool, rgbByteToLab, type Lab } from "./extract-core";
import type { PoolColor } from "./types";

const SAMPLE_EDGE = 132; // longest edge after downscale — enough signal, fast

export async function extractPoolFromFile(file: File, k = 24): Promise<PoolColor[]> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, SAMPLE_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close?.();
    throw new Error("Canvas 2D context unavailable.");
  }
  // Composite onto white so transparency matches the server's flatten behavior.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const { data } = ctx.getImageData(0, 0, w, h);
  const points: Lab[] = [];
  for (let i = 0; i + 3 < data.length; i += 4) {
    points.push(rgbByteToLab(data[i], data[i + 1], data[i + 2]));
  }
  return clusterPool(points, k);
}
