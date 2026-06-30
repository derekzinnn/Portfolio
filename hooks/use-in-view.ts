"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fire only once, then stop observing. Defaults to true. */
  once?: boolean;
  /** Viewport margin to trigger earlier/later. */
  rootMargin?: string;
  threshold?: number;
};

/**
 * Lightweight IntersectionObserver hook. Decouples scroll-in detection from any
 * animation library so anime.js owns the reveal itself (see <Reveal />).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = true,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
