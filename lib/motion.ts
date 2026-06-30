/**
 * Motion tokens — JS mirror of the CSS motion variables in app/globals.css.
 *
 * Animation roles (one job each), per the locked design:
 *  - three.js  → hero crystal only
 *  - lenis     → page-wide smooth scroll + nav anchor scrollTo
 *  - anime.js  → scroll-in reveals (content visible by default)
 *  - CSS       → card lift + button/link hover
 *  - showpiece → contact cursor-follow spotlight
 */

/** Durations in seconds. */
export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.78,
} as const;

/** Cubic-bezier control points. */
export const EASE = {
  outSoft: [0.22, 0.61, 0.36, 1],
  outGlide: [0.2, 0.7, 0.2, 1],
} as const;

/** anime.js v4 easing strings. */
export const EASE_ANIME = {
  outSoft: "cubicBezier(0.22, 0.61, 0.36, 1)",
} as const;

/** Scroll-in reveal config (anime.js) — matches the design exactly. */
export const REVEAL = {
  y: 26,
  duration: 780,
  ease: EASE_ANIME.outSoft,
} as const;

/** Lenis smooth-scroll config (matches the design). */
export const LENIS = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
} as const;
