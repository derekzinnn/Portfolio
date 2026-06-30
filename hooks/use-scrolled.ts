"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * True once the page is scrolled past `threshold` px. Built on
 * useSyncExternalStore (SSR-safe, no setState-in-effect) like use-media-query.
 */
export function useScrolled(threshold = 24): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("scroll", callback, { passive: true });
    return () => window.removeEventListener("scroll", callback);
  }, []);

  const getSnapshot = useCallback(
    () => (window.scrollY || 0) > threshold,
    [threshold],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
