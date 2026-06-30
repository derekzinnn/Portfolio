import type { Project } from "@/lib/constants";

/**
 * Featured-work row: an editorial two-column article that alternates the mockup
 * side. Two readable layers — business description (clients) + tech highlight
 * and stack (recruiters). Hover lift is a CSS transition (no JS).
 */
export function ProjectCard({ project }: { project: Project }) {
  const imageOrder = project.imageSide === "left" ? 0 : 1;
  const textOrder = project.imageSide === "left" ? 1 : 0;

  return (
    <article className="flex flex-wrap items-center gap-[clamp(28px,5vw,72px)]">
      {/* Mockup placeholder */}
      <div
        role="img"
        aria-label={`${project.name} — ${project.mockup.label} mockup`}
        className="group relative aspect-[16/10] min-w-0 overflow-hidden rounded-[7px] border border-[rgba(238,242,247,0.1)] transition-[transform,border-color] duration-[550ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-[5px] hover:border-[rgba(238,242,247,0.24)]"
        style={{
          order: imageOrder,
          flex: "600 1 460px",
          background: project.mockup.gradient,
        }}
      >
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
          style={{ background: project.mockup.glow }}
        />
        <div
          aria-hidden="true"
          className="absolute top-[15px] left-[16px] flex gap-[6px]"
        >
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.16)]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.12)]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.09)]" />
        </div>
        <span className="text-paper/50 absolute bottom-[15px] left-[17px] font-mono text-[12px] tracking-[0.02em]">
          {project.mockup.label}
        </span>
      </div>

      {/* Copy */}
      <div
        className="flex min-w-0 flex-col gap-[clamp(14px,2vh,20px)]"
        style={{ order: textOrder, flex: "400 1 340px" }}
      >
        <div className="flex items-baseline gap-[12px]">
          <span className="text-accent font-mono text-[13px] font-medium">
            {project.index}
          </span>
          <span className="text-paper/50 text-[12px] tracking-[0.16em] uppercase">
            {project.category}
          </span>
        </div>

        <h3 className="text-project text-paper font-bold">{project.name}</h3>

        <p className="text-paper/74 max-w-[46ch] text-[clamp(15px,1.45vw,18px)] leading-[1.58]">
          {project.description}
        </p>

        <div className="my-[clamp(6px,1vh,10px)] h-px bg-[rgba(238,242,247,0.1)]" />

        <div className="flex items-start gap-[11px]">
          <span className="text-paper/42 pt-[2px] font-mono text-[11px] tracking-[0.12em] whitespace-nowrap uppercase">
            Tech
          </span>
          <span className="text-paper/64 text-[14px] leading-[1.5]">
            {project.techHighlight}
          </span>
        </div>

        <div className="mt-[2px] flex flex-wrap gap-[8px]">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-paper/80 rounded-full border border-[rgba(238,242,247,0.16)] bg-[rgba(238,242,247,0.02)] px-[12px] py-[6px] text-[12.5px] whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.href ?? "#contact"}
          className="text-paper focus-visible:ring-accent hover:border-accent mt-[6px] inline-flex items-center gap-[8px] self-start rounded-sm border-b border-[rgba(108,155,245,0.6)] pb-[3px] text-[14px] transition-[gap,border-color] duration-[250ms] hover:gap-[14px] focus-visible:ring-2 focus-visible:outline-none"
        >
          View case study <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
