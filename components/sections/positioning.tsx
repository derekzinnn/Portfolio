"use client";

import { Eyebrow, Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useT } from "@/hooks/use-locale";

/** "What I do" strip - one tight statement on a light surface. */
export function Positioning() {
  const t = useT();

  return (
    <Section surface="light" className="py-[clamp(88px,13vh,150px)]">
      <Reveal>
        <Eyebrow className="text-ink/50 mb-[clamp(26px,4vh,44px)]">
          {t.positioning.eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-statement max-w-[24ch] font-bold text-balance">
          {t.positioning.pre}
          <span className="text-ink/40">{t.positioning.accent}</span>
          {t.positioning.post}
        </p>
      </Reveal>
    </Section>
  );
}
