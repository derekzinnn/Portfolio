"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Tracks the user's reduced-motion preference. SSR-safe (returns `false` until
 * mounted). Drives the static hero fallback and disables scroll-driven motion.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
