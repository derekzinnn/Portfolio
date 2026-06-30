"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { LENIS } from "@/lib/motion";

/**
 * Page-wide smooth scroll — Lenis's ONLY job in this project. Anchor links are
 * handled natively by Lenis (`anchors: true`), so the rest of the app can use
 * plain <a href="#id"> without touching the scroll library.
 *
 * Disabled entirely when the user prefers reduced motion (native scroll).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: LENIS.duration,
      easing: LENIS.easing,
      smoothWheel: true,
      anchors: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return <>{children}</>;
}
