"use client";

import { useState } from "react";
import Image from "next/image";

import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useT } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

type ProjectPreviewProps = {
  /** Project name — used for alt text, iframe title, and the button aria-label. */
  title: string;
  /** Monospace caption shown on the poster/placeholder. */
  label: string;
  /** Placeholder glow (radial-gradient), shown when there's no poster. */
  glow: string;
  /** Screenshot path in /public; falls back to the striped placeholder. */
  poster?: string;
  /** Live URL loaded on click. Omit to disable the embed (e.g. login-gated). */
  embed?: string;
};

/**
 * Poster + click-to-load preview. The screenshot loads with the page; the live
 * iframe is mounted only when the visitor clicks (deferring all its weight and,
 * for login-gated apps, avoiding a useless login-screen embed). On mobile the
 * iframe is never offered — poster + "Visit live" link only.
 *
 * Fills a positioned, fixed-aspect parent (the card's mockup frame) so there's
 * no layout shift. Requires the embedded site to allow framing from this origin
 * (`Content-Security-Policy: frame-ancestors …`) — see lib/constants.ts.
 */
export function ProjectPreview({
  title,
  label,
  glow,
  poster,
  embed,
}: ProjectPreviewProps) {
  const t = useT();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReduced = usePrefersReducedMotion();
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const hasPoster = !!poster && !posterError;
  const canEmbed = !!embed && !isMobile;

  return (
    <>
      {/* Striped placeholder — default backdrop + graceful fallback if no poster */}
      {!hasPoster && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(135deg,rgba(238,242,247,0.05) 0 1.5px,transparent 1.5px 13px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: glow }}
          />
        </>
      )}

      {/* Screenshot poster */}
      {poster && !posterError && (
        <Image
          src={poster}
          alt={t.preview.alt(title)}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover object-top"
          onError={() => setPosterError(true)}
        />
      )}

      {/* Live embed — mounted only after the visitor opts in */}
      {activated && embed && (
        <iframe
          src={embed}
          title={t.preview.title(title)}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 z-[1] h-full w-full border-0",
            prefersReduced ? "" : "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Loading state while the iframe boots */}
      {activated && !loaded && (
        <div className="text-paper/60 absolute inset-0 z-[2] flex items-center justify-center font-mono text-[12px] tracking-[0.04em]">
          {t.preview.loading}
        </div>
      )}

      {/* Click-to-load affordance (desktop only, before activation) */}
      {canEmbed && !activated && (
        <button
          type="button"
          onClick={() => setActivated(true)}
          aria-label={t.preview.loadAria(title)}
          className="group/live focus-visible:ring-accent absolute inset-0 z-[4] flex items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="bg-ink/70 text-paper ring-paper/20 flex items-center gap-[8px] rounded-full px-[16px] py-[9px] text-[13px] font-medium opacity-0 ring-1 backdrop-blur-sm transition-opacity duration-200 group-hover/live:opacity-100 group-focus-visible/live:opacity-100">
            <span aria-hidden="true">▶</span> {t.preview.viewLive}
          </span>
        </button>
      )}

      {/* Browser dots */}
      <div
        aria-hidden="true"
        className="absolute top-[15px] left-[16px] z-[3] flex gap-[6px]"
      >
        <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.16)]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.12)]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.09)]" />
      </div>

      {/* Caption / live badge */}
      {activated ? (
        <span className="text-paper/70 absolute bottom-[15px] left-[17px] z-[3] flex items-center gap-[7px] rounded-full bg-[rgba(16,42,67,0.6)] px-[10px] py-[4px] font-mono text-[11px] tracking-[0.04em] backdrop-blur-sm">
          <span className="bg-accent h-[6px] w-[6px] animate-pulse rounded-full" />
          {t.preview.live}
        </span>
      ) : (
        <span className="text-paper/50 absolute bottom-[15px] left-[17px] z-[3] font-mono text-[12px] tracking-[0.02em]">
          {label}
        </span>
      )}
    </>
  );
}
