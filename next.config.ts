import type { NextConfig } from "next";

/**
 * The site is fully static: every page is pre-rendered at build time from the
 * YAML files in `content/`. There are no server actions, API routes, or
 * runtime data fetching. `output: "export"` writes HTML to `out/` for GitHub
 * Pages; Vercel and other hosts serve the same build.
 *
 * Set NEXT_PUBLIC_BASE_PATH=/lasso-web when building for the default GitHub
 * Pages project URL (https://mdovale.github.io/lasso-web). Omit for a custom
 * domain at the site root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
