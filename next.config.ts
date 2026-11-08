import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully client-side site: export plain HTML/CSS/JS to `out/` for GitHub Pages.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
