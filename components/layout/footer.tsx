export function Footer() {
  return (
    <footer className="surface-dark text-paper/45 border-t border-[rgba(238,242,247,0.08)]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-[14px] px-[clamp(20px,6vw,120px)] py-[clamp(28px,4vh,40px)] text-[13px]">
        <span>© 2026 Derek</span>
        <span className="font-mono tracking-[0.02em]">
          built with three.js · lenis · anime.js
        </span>
      </div>
    </footer>
  );
}
