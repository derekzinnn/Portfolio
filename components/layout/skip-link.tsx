"use client";

import { useT } from "@/hooks/use-locale";

/** Visually-hidden skip link (first focusable element). Localized. */
export function SkipLink() {
  const t = useT();

  return (
    <a
      href="#main"
      className="focus:bg-accent focus:text-ink sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2"
    >
      {t.skip}
    </a>
  );
}
