import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin the workspace root to this project. Without it, Turbopack walks up and
// finds a stray lockfile in the home directory and infers the wrong root.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) for a small Docker image.
  output: "standalone",
  // Posters are already pre-sized WebP → skip the sharp-based optimizer so the
  // standalone runtime needs no native image binaries (simpler, smaller image).
  images: { unoptimized: true },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
