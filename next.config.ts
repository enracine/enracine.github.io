import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site for GitHub Pages — no server, all work runs in the browser.
  output: "export",
  // Plain <img> tags are used; disable the Image Optimization server.
  images: { unoptimized: true },
  // enracine.github.io is a user/root site served at "/", so no basePath needed.
  // (If this ever moves to a project subpath, set basePath/assetPrefix here and
  //  prefix the absolute /logo.png and font references accordingly.)
};

export default nextConfig;
