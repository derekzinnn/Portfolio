"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  dict,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

// localStorage-backed store (SSR-safe, no setState-in-effect) - same pattern as
// use-media-query / use-scrolled. Subscribers are notified on same-tab changes
// (setLocale) and cross-tab changes (the `storage` event).
let listeners: (() => void)[] = [];

function readLocale(): Locale {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return value === "pt" || value === "en" ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function subscribe(callback: () => void): () => void {
  listeners.push(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Persist and broadcast a new locale. Call from an event handler. */
export function setLocale(next: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* storage unavailable - stay on the current in-memory locale */
  }
  for (const notify of listeners) notify();
}

/** Current locale. Renders EN on the server / first paint, then syncs. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, readLocale, () => DEFAULT_LOCALE);
}

/** The active dictionary. */
export function useT(): Dictionary {
  return dict[useLocale()];
}
