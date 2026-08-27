"use client";

import { useEffect } from "react";

import { setLocale, useLocale, useT } from "@/hooks/use-locale";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

/** Simple EN ⇄ PT segmented toggle. Also keeps <html lang> in sync. */
export function LanguageToggle() {
  const locale = useLocale();
  const t = useT();

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  return (
    <div
      role="group"
      aria-label={t.toggleAria}
      className="flex items-center gap-[2px] rounded-full border border-[rgba(238,242,247,0.14)] p-[2px] font-mono text-[11px]"
    >
      {OPTIONS.map((option) => {
        const active = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLocale(option.code)}
            aria-pressed={active}
            className={cn(
              "focus-visible:ring-accent rounded-full px-[8px] py-[3px] tracking-[0.06em] transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "bg-accent text-ink font-semibold"
                : "text-paper/55 hover:text-paper",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
