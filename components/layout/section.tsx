import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  /** Full-bleed surface; sections alternate dark-blue / white-ish. */
  surface?: "dark" | "light";
  /** Applied to the inner content column (use for vertical padding). */
  className?: string;
  children: React.ReactNode;
};

/** Full-bleed editorial section with a centered 1320px content column. */
export function Section({
  id,
  surface = "dark",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20",
        surface === "light" ? "surface-light" : "surface-dark",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1320px] px-[clamp(20px,6vw,120px)]",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Small uppercase eyebrow with the signature accent dot. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[12px] text-[13px] tracking-[0.18em] uppercase",
        className,
      )}
    >
      <span className="bg-accent h-[7px] w-[7px] rounded-full" />
      {children}
    </div>
  );
}
