import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages: `next build` writes plain files to out/.
 * No server at runtime, so: images are served as-is (no optimiser), each
 * route is a folder with index.html (trailing slashes), and the contact form
 * posts straight to a form service from the browser.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
