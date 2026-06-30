"use client";

import { useEffect, useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SITE } from "@/lib/constants";

/**
 * Contact — home of the single showpiece: a cursor-follow radial spotlight that
 * tracks the pointer across the section (the one indulgent effect on the page).
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const spot = spotRef.current;
    if (!sec || !spot) return;

    const onMove = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spot.style.background = `radial-gradient(440px circle at ${x}% ${y}%, rgba(108,155,245,0.18), rgba(108,155,245,0.06) 38%, transparent 66%)`;
      spot.style.opacity = "1";
    };
    const onLeave = () => {
      spot.style.opacity = "0";
    };

    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    return () => {
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="surface-dark relative scroll-mt-20 overflow-hidden"
    >
      {/* Cursor-follow spotlight */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-[400ms]"
      />
      {/* Static corner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(820px circle at 72% -5%,rgba(108,155,245,0.1),transparent 52%)",
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1320px] px-[clamp(20px,6vw,120px)] py-[clamp(96px,16vh,200px)]">
        <Reveal>
          <div className="text-paper/55 mb-[clamp(24px,3.5vh,40px)] flex items-center gap-[12px] text-[13px] tracking-[0.18em] uppercase">
            <span className="bg-accent h-[7px] w-[7px] rounded-full" /> Contact
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="text-contact font-bold text-balance">
            Let&apos;s build
            <br />
            something real<span className="text-accent">.</span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-paper/72 mt-[clamp(24px,3.5vh,36px)] max-w-[52ch] text-[clamp(15px,1.6vw,20px)] leading-[1.55]">
            Open to junior and internship developer roles, and to freelance
            projects. The fastest way to reach me is email — I usually reply
            within a day.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-[clamp(34px,5vh,52px)] flex flex-wrap gap-[14px]">
            <a
              href={`mailto:${SITE.email}`}
              className="bg-accent text-ink focus-visible:ring-paper inline-flex items-center gap-[9px] rounded-full px-[26px] py-[15px] text-[15px] font-semibold shadow-[0_8px_30px_rgba(108,155,245,0.18)] transition-[transform,box-shadow,filter] duration-[250ms] hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(108,155,245,0.3)] hover:brightness-105 focus-visible:ring-2 focus-visible:outline-none"
            >
              {SITE.email} <span aria-hidden="true">→</span>
            </a>
            <a
              href={SITE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper focus-visible:ring-accent inline-flex items-center gap-[9px] rounded-full border border-[rgba(238,242,247,0.22)] px-[24px] py-[14px] text-[15px] font-medium transition-[border-color,background] duration-[250ms] hover:border-[rgba(238,242,247,0.5)] hover:bg-[rgba(238,242,247,0.04)] focus-visible:ring-2 focus-visible:outline-none"
            >
              GitHub
            </a>
            <a
              href={SITE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper focus-visible:ring-accent inline-flex items-center gap-[9px] rounded-full border border-[rgba(238,242,247,0.22)] px-[24px] py-[14px] text-[15px] font-medium transition-[border-color,background] duration-[250ms] hover:border-[rgba(238,242,247,0.5)] hover:bg-[rgba(238,242,247,0.04)] focus-visible:ring-2 focus-visible:outline-none"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="text-paper/45 mt-[clamp(30px,4.5vh,46px)] text-[13px] tracking-[0.04em]">
            {SITE.location}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
