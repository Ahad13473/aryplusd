import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Runtime data (database, key, downloads) lives in the project root, never in the build.
  outputFileTracingExcludes: {
    "*": [
      "db/**",
      "storage/**",
      "src/**",
      "prisma/**",
      "*.log",
      "*.md",
      ".idea/**",
      "*.config.{ts,mjs}",
      "tsconfig*",
      "bun.lock",
      "components.json",
    ],
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Quiet dev server: no per-request log lines and no "Compiling" badge.
  logging: { incomingRequests: false },
  devIndicators: false,
  // Keep Turbopack's peak memory low so dev compiles fit in small-RAM environments.
  experimental: {
    turbopackMemoryLimit: 512,
  },
};

export default nextConfig;
