import type { NextConfig } from "next";

/**
 * The site is fully static: every page is pre-rendered at build time from the
 * YAML files in `content/`. There are no server actions, API routes, or
 * runtime data fetching, so the output deploys cleanly to Vercel or any
 * Node host (`npm run start`).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
