"use client";

import { useEffect, useRef } from "react";
import { animate, stagger as animeStagger } from "animejs";

import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { REVEAL } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay before the reveal fires, in ms (mirrors data-reveal-delay). */
  delay?: number;
  /** Stagger the container's direct children instead of revealing as one block. */
  staggerChildren?: boolean;
  /** Stagger step in ms (only with staggerChildren). */
  stagger?: number;
};

/**
 * Scroll-in reveal powered by anime.js — the project's single owner of
 * entrance/reveal motion. Detection is delegated to a plain IntersectionObserver
 * (useInView) so the animation library stays decoupled from scroll.
 *
 * Under prefers-reduced-motion the content renders immediately with no motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  staggerChildren = false,
  stagger = 90,
}: RevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const played = useRef(false);

  const collectTargets = (node: HTMLDivElement): HTMLElement[] =>
    staggerChildren ? (Array.from(node.children) as HTMLElement[]) : [node];

  // Apply the hidden starting state up front so nothing flashes before reveal.
  useEffect(() => {
    if (prefersReduced || !ref.current) return;
    for (const el of collectTargets(ref.current)) {
      el.style.opacity = "0";
      el.style.transform = `translateY(${REVEAL.y}px)`;
      el.style.willChange = "opacity, transform";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, staggerChildren]);

  useEffect(() => {
    if (prefersReduced || !inView || played.current || !ref.current) return;
    played.current = true;

    const targets = collectTargets(ref.current);
    animate(targets, {
      opacity: [0, 1],
      translateY: [REVEAL.y, 0],
      duration: REVEAL.duration,
      ease: REVEAL.ease,
      delay: staggerChildren ? animeStagger(stagger, { start: delay }) : delay,
      onComplete: () => {
        for (const el of targets) el.style.willChange = "auto";
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, prefersReduced, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
