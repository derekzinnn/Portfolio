import type { Project } from "@/lib/constants";
import { LivePreview } from "@/components/sections/live-preview";

/**
 * Featured-work row: an editorial two-column article that alternates the mockup
 * side. Two readable layers — business description (clients) + tech highlight
 * and stack (recruiters). The mockup frame hosts a flexible preview: striped
 * placeholder, a screenshot, or a live (scaled) iframe — see lib/constants.ts.
 */
export function ProjectCard({ project }: { project: Project }) {
  const imageOrder = project.imageSide === "left" ? 0 : 1;
  const textOrder = project.imageSide === "left" ? 1 : 0;
  const { preview, mockup } = project;

  const external = !!project.href && project.href.startsWith("http");
  const href = project.href ?? "#contact";

  return (
    <article className="flex flex-wrap items-center gap-[clamp(28px,5vw,72px)]">
      {/* Mockup frame (browser-window chrome) hosting the preview */}
      <div
        role={preview.type === "iframe" ? undefined : "img"}
        aria-label={
          preview.type === "iframe"
            ? undefined
            : `${project.name} — ${mockup.label} mockup`
        }
        className="group relative aspect-[16/10] min-w-0 overflow-hidden rounded-[7px] border border-[rgba(238,242,247,0.1)] transition-[transform,border-color] duration-[550ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-[5px] hover:border-[rgba(238,242,247,0.24)]"
        style={{
          order: imageOrder,
          flex: "600 1 460px",
          background: mockup.gradient,
        }}
      >
        {/* Striped texture — placeholder, and a loading backdrop for live previews */}
        {preview.type !== "image" && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(135deg,rgba(238,242,247,0.05) 0 1.5px,transparent 1.5px 13px)",
            }}
          />
        )}
        {preview.type === "placeholder" && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: mockup.glow }}
          />
        )}

        {preview.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary preview source (local or external); next/image adds no benefit here
          <img
            src={preview.src}
            alt={`${project.name} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}

        {preview.type === "iframe" && (
          <LivePreview url={preview.url} title={project.name} />
        )}

        {/* Browser dots */}
        <div
          aria-hidden="true"
          className="absolute top-[15px] left-[16px] z-[2] flex gap-[6px]"
        >
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.16)]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.12)]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[rgba(238,242,247,0.09)]" />
        </div>

        {/* Caption / live badge */}
        {preview.type === "iframe" ? (
          <span className="text-paper/70 absolute bottom-[15px] left-[17px] z-[2] flex items-center gap-[7px] rounded-full bg-[rgba(16,42,67,0.6)] px-[10px] py-[4px] font-mono text-[11px] tracking-[0.04em] backdrop-blur-sm">
            <span className="bg-accent h-[6px] w-[6px] animate-pulse rounded-full" />
            Live
          </span>
        ) : (
          <span className="text-paper/50 absolute bottom-[15px] left-[17px] z-[2] font-mono text-[12px] tracking-[0.02em]">
            {mockup.label}
          </span>
        )}

        {/* Click-through to the live site (covers the preview) */}
        {external && preview.type !== "placeholder" && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name}`}
            className="focus-visible:ring-accent absolute inset-0 z-[3] focus-visible:ring-2 focus-visible:outline-none"
          />
        )}
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
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-paper focus-visible:ring-accent hover:border-accent mt-[6px] inline-flex items-center gap-[8px] self-start rounded-sm border-b border-[rgba(108,155,245,0.6)] pb-[3px] text-[14px] transition-[gap,border-color] duration-[250ms] hover:gap-[14px] focus-visible:ring-2 focus-visible:outline-none"
        >
          {external ? "Visit live site" : "View case study"}{" "}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
