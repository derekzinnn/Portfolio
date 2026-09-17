"use client";

import Link from "next/link";

import { useScrolled } from "@/hooks/use-scrolled";
import { useT } from "@/hooks/use-locale";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { NAV, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Nav - a full-width transparent bar over the hero that compresses into a
 * floating "toast" pill (fixed, top-center, margins on both sides) once the
 * page is scrolled. The morph is pure CSS transition between two class sets;
 * scroll state comes from useScrolled (no setState-in-effect). Anchor links are
 * smooth-scrolled by Lenis (anchors:true).
 */
export function Header() {
  const scrolled = useScrolled(24);
  const t = useT();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
        scrolled ? "px-4 pt-3 sm:pt-4" : "px-0 pt-0",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "flex w-full items-center justify-between border transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
          scrolled
            ? "max-w-[600px] gap-6 rounded-full border-[rgba(238,242,247,0.12)] bg-[rgba(16,42,67,0.72)] px-5 py-2.5 shadow-[0_10px_30px_rgba(5,10,22,0.4)] backdrop-blur-md"
            : "max-w-[1320px] gap-[18px] rounded-none border-transparent bg-transparent px-[clamp(20px,6vw,120px)] py-[clamp(15px,2.4vh,22px)]",
        )}
      >
        <Link
          href="#top"
          className={cn(
            "text-paper focus-visible:ring-accent rounded-sm font-bold tracking-[-0.01em] transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none",
            scrolled ? "text-[17px]" : "text-[19px]",
          )}
        >
          {SITE.name}
          <span className="text-accent">.</span>
        </Link>

        <div
          className={cn(
            "flex items-center text-[14px] tracking-[0.01em] transition-all duration-300",
            scrolled ? "gap-4 sm:gap-5" : "gap-[clamp(14px,2.2vw,30px)]",
          )}
        >
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-paper/72 hover:text-paper focus-visible:ring-accent rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {t.nav[id]}
            </a>
          ))}
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
