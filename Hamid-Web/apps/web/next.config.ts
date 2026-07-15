import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Monorepo: trace files from the workspace root, not just this app,
  // so packages/db and packages/core are included in the standalone build.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: [
      // Seed data placeholder images — replace via the dashboard Media Library.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Self-hosted MinIO / S3-compatible media.
      {
        protocol: process.env.MINIO_USE_SSL === "true" ? "https" : "http",
        hostname: process.env.MINIO_PUBLIC_HOSTNAME ?? "localhost",
      },
    ],
  },
};

export default nextConfig;
