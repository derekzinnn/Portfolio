"use client";

import dynamic from "next/dynamic";

// Lazy, client-only: keeps the three.js bundle out of the initial render.
const CrystalHero = dynamic(
  () => import("@/components/three/crystal-hero").then((m) => m.CrystalHero),
  { ssr: false },
);

/** CSS rise entrance (opaque-safe; disabled under reduced motion via globals). */
const rise = (delay: number): React.CSSProperties => ({
  animation: "rise .85s cubic-bezier(.22,.61,.36,1) both",
  animationDelay: `${delay}ms`,
});

export function Hero() {
  return (
    <section
      id="top"
      className="surface-dark relative h-[100svh] min-h-screen overflow-hidden"
    >
      {/* Depth gradient behind the crystal */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 74% 50%,rgba(22,38,63,0.78),transparent 58%)",
        }}
      />

      {/* The crystal — fills the hero, grabbable across the whole area */}
      <CrystalHero
        align="right"
        className="absolute inset-0 z-[1] block h-full w-full"
      />

      {/* Legibility scrim over the copy column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg,rgba(16,42,67,0.85) 0%,rgba(16,42,67,0.42) 38%,transparent 62%)",
        }}
      />

      {/* Copy column */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-center px-[clamp(20px,6vw,120px)]"
        style={{ maxWidth: "min(62%,760px)" }}
      >
        <div
          className="text-paper/66 mb-[clamp(18px,2.6vh,30px)] flex items-center gap-[11px] text-[clamp(11px,1vw,13px)] tracking-[0.2em] uppercase"
          style={rise(60)}
        >
          <span
            className="bg-accent h-[7px] w-[7px] rounded-full"
            style={{ animation: "dotPulse 2.6s infinite" }}
          />
          Full-stack developer — available for work
        </div>

        <h1 className="text-hero text-paper font-bold text-balance">
          <span className="block" style={rise(150)}>
            Real products,
          </span>
          <span className="block" style={rise(250)}>
            built end to end<span className="text-accent">.</span>
          </span>
        </h1>

        <p
          className="text-lede text-paper/74 mt-[clamp(20px,3vh,30px)] max-w-[42ch]"
          style={rise(400)}
        >
          Marketplaces, inventory systems, and post-sale platforms — designed,
          built, and shipped to production. Node, React, and PostgreSQL, from
          schema to the last pixel.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="text-paper/50 pointer-events-none absolute bottom-[clamp(28px,5vh,52px)] left-[clamp(20px,6vw,120px)] z-[3] flex items-center gap-[14px] text-[12px] tracking-[0.18em] uppercase"
        style={rise(560)}
      >
        <span className="relative block h-[42px] w-px overflow-hidden rounded-[1px] bg-[rgba(238,242,247,0.22)]">
          <span
            className="bg-accent absolute top-0 left-0 h-[40%] w-full"
            style={{
              animation: "scrollPulse 2.2s cubic-bezier(.6,0,.4,1) infinite",
            }}
          />
        </span>
        Scroll
      </div>

      {/* Drag affordance */}
      <div
        aria-hidden="true"
        className="text-paper/40 pointer-events-none absolute right-[clamp(20px,5vw,52px)] bottom-[clamp(28px,5vh,52px)] z-[3] flex items-center gap-[8px] font-mono text-[11px] tracking-[0.12em] uppercase"
      >
        <span className="text-[14px] leading-none">⟲</span> Drag to rotate
      </div>
    </section>
  );
}
