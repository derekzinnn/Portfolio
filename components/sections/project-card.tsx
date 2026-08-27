"use client";

import { useT } from "@/hooks/use-locale";
import type { Project } from "@/lib/constants";
import { ProjectPreview } from "@/components/sections/project-preview";

/**
 * Featured-work row: an editorial two-column article that alternates the mockup
 * side. Two readable layers — business description (clients) + tech highlight
 * and stack (recruiters). Copy comes from the active locale (lib/i18n.ts).
 */
export function ProjectCard({ project }: { project: Project }) {
  const t = useT();
  const copy = t.work.projects[project.slug];

  const imageOrder = project.imageSide === "left" ? 0 : 1;
  const textOrder = project.imageSide === "left" ? 1 : 0;
  const { mockup } = project;

  const external = !!project.href && project.href.startsWith("http");
  const href = project.href ?? "#contact";

  return (
    <article className="flex flex-wrap items-center gap-[clamp(28px,5vw,72px)]">
      {/* Mockup frame (browser-window chrome) hosting the preview */}
      <div
        className="group relative aspect-[16/10] min-w-0 overflow-hidden rounded-[7px] border border-[rgba(238,242,247,0.1)] transition-[transform,border-color] duration-[550ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-[5px] hover:border-[rgba(238,242,247,0.24)]"
        style={{
          order: imageOrder,
          flex: "600 1 460px",
          background: mockup.gradient,
        }}
      >
        <ProjectPreview
          title={project.name}
          label={mockup.label}
          glow={mockup.glow}
          poster={project.preview.poster}
          embed={project.preview.embed}
        />
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
            {copy.category}
          </span>
        </div>

        <h3 className="text-project text-paper font-bold">{project.name}</h3>

        <p className="text-paper/74 max-w-[46ch] text-[clamp(15px,1.45vw,18px)] leading-[1.58]">
          {copy.description}
        </p>

        <div className="my-[clamp(6px,1vh,10px)] h-px bg-[rgba(238,242,247,0.1)]" />

        <div className="flex items-start gap-[11px]">
          <span className="text-paper/42 pt-[2px] font-mono text-[11px] tracking-[0.12em] whitespace-nowrap uppercase">
            {t.work.techLabel}
          </span>
          <span className="text-paper/64 text-[14px] leading-[1.5]">
            {copy.techHighlight}
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
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-paper focus-visible:ring-accent hover:border-accent mt-[6px] inline-flex items-center gap-[8px] self-start rounded-sm border-b border-[rgba(108,155,245,0.6)] pb-[3px] text-[14px] transition-[gap,border-color] duration-[250ms] hover:gap-[14px] focus-visible:ring-2 focus-visible:outline-none"
        >
          {external ? t.work.visitLive : t.work.caseStudy}{" "}
          <span aria-hidden="true">{external ? "↗" : "→"}</span>
        </a>
      </div>
    </article>
  );
}
