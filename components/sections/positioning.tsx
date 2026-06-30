import { Eyebrow, Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

/** "What I do" strip — one tight statement on a light surface. */
export function Positioning() {
  return (
    <Section surface="light" className="py-[clamp(88px,13vh,150px)]">
      <Reveal>
        <Eyebrow className="text-ink/50 mb-[clamp(26px,4vh,44px)]">
          What I do
        </Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-statement max-w-[24ch] font-bold text-balance">
          I&apos;m Derek — a full-stack developer who turns business problems
          into{" "}
          <span className="text-ink/40">polished, production software</span>.
        </p>
      </Reveal>
    </Section>
  );
}
