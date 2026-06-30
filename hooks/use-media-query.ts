"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media-query subscription via useSyncExternalStore — avoids the
 * cascading-render pattern of setState-in-effect. Returns `false` on the server.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
