import { Eyebrow, Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CAPABILITIES } from "@/lib/constants";

/** About + capabilities grid (grouped by area; no skill-percentage bars). */
export function About() {
  return (
    <Section id="about" surface="light" className="py-[clamp(90px,14vh,170px)]">
      <Reveal>
        <Eyebrow className="text-ink/50 mb-[clamp(30px,4.5vh,52px)]">
          About
        </Eyebrow>
      </Reveal>

      <div className="flex flex-wrap gap-[clamp(36px,6vw,90px)]">
        <Reveal className="min-w-0 flex-[1_1_320px]">
          <h2 className="text-about mb-[clamp(18px,2.4vh,26px)] font-bold">
            Hi — I&apos;m Derek.
          </h2>
          <p className="text-ink/66 mb-[18px] max-w-[42ch] text-[clamp(15px,1.45vw,18px)] leading-[1.62]">
            I build full-stack web applications end to end — comfortable in a
            PostgreSQL schema, a TypeScript service, and a React component in
            the same afternoon.
          </p>
          <p className="text-ink/66 max-w-[42ch] text-[clamp(15px,1.45vw,18px)] leading-[1.62]">
            I care about software that actually ships: clear data models, honest
            interfaces, and code the next developer can read. The projects here
            are live products with real users — not demos.
          </p>
        </Reveal>

        <Reveal delay={80} className="min-w-0 flex-[1.5_1_420px]">
          <div className="text-ink/40 mb-[clamp(20px,3vh,30px)] text-[12px] tracking-[0.16em] uppercase">
            Capabilities
          </div>
          <div
            className="grid gap-[clamp(24px,3vw,42px)]"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,185px),1fr))",
            }}
          >
            {CAPABILITIES.map((capability) => (
              <div key={capability.group}>
                <div className="text-ink/42 mb-[14px] text-[12px] tracking-[0.14em] uppercase">
                  {capability.group}
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {capability.items.map((item) => (
                    <span
                      key={item}
                      className="text-ink/78 rounded-full border border-[rgba(16,42,67,0.14)] px-[12px] py-[6px] text-[13px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
