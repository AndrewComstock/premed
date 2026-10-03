import type { NextConfig } from "next";

// Static export so the site can be hosted anywhere (S3, Azure Static Web Apps, GitHub Pages).
// Set NEXT_PUBLIC_BASE_PATH when serving from a sub-path, e.g. "/halcyra-site" on GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
