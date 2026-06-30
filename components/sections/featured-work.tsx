import { Eyebrow, Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { PROJECTS } from "@/lib/constants";

/** Selected work — three production products, alternating editorial rows. */
export function FeaturedWork() {
  return (
    <Section id="work" surface="dark" className="py-[clamp(90px,14vh,170px)]">
      <Reveal>
        <Eyebrow className="text-paper/55 mb-[clamp(22px,3vh,34px)]">
          Selected work
        </Eyebrow>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="text-work font-bold text-balance">
          Three products,
          <br />
          shipped to production.
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="text-paper/68 mt-[clamp(20px,3vh,30px)] max-w-[52ch] text-[clamp(15px,1.5vw,18px)] leading-[1.6]">
          Each one is live software with real users — payments, inventory, and
          onboarding that had to work, not just demo well.
        </p>
      </Reveal>

      <div className="mt-[clamp(56px,9vh,104px)] flex flex-col gap-[clamp(72px,12vh,140px)]">
        {PROJECTS.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
