/**
 * Site-wide constants — structural data for the editorial-3D portfolio.
 * Translatable copy (headings, descriptions, categories) lives in lib/i18n.ts;
 * this file holds only language-neutral structure (slugs, stack, URLs, mockups).
 */

export const SITE = {
  name: "Derek",
  title: "Derek — Full-stack developer",
  description:
    "Full-stack developer. Marketplaces, inventory systems, and post-sale " +
    "platforms — designed, built, and shipped to production. Node, React, and " +
    "PostgreSQL, from schema to the last pixel.",
  url: "https://derek.dev.br",
  email: "derek.cavalcanti1@gmail.com",
  socials: {
    github: "https://github.com/derekzinnn",
    linkedin: "https://www.linkedin.com/in/derek-cavalcanti-893441300",
  },
} as const;

/** In-page navigation. Each id matches a section element id + a lib/i18n label. */
export const NAV = ["work", "about", "contact"] as const;

/**
 * Brand palette fallbacks. The runtime source of truth is CSS
 * (app/globals.css); the crystal reads CSS vars via getCssColor() and falls
 * back to these only during SSR.
 */
export const BRAND = {
  ink: "#102a43",
  paper: "#eef2f7",
  accent: "#6c9bf5",
} as const;

/**
 * Project preview (poster + click-to-load pattern — see components/sections/
 * project-preview.tsx):
 *  - poster → a screenshot in /public/previews (WebP, 1280×800). Shown by
 *    default; falls back to the striped placeholder until the file exists.
 *    Capture with `pnpm previews:capture` (scripts/capture-previews.ts).
 *  - embed  → live URL loaded in a sandboxed iframe ONLY when the visitor
 *    clicks the poster. Omit for login-gated apps (an iframe would just show a
 *    login wall) — the poster stays the primary preview.
 *
 * A live embed requires the target site to allow framing from this origin. In
 * that project's Caddyfile (docker-compose on the VPS) add:
 *   header Content-Security-Policy "frame-ancestors 'self' https://derek.dev.br"
 * and it must NOT send `X-Frame-Options: DENY` / `SAMEORIGIN`.
 */
export type ProjectPreview = {
  poster?: string;
  embed?: string;
};

export type Project = {
  /** Matches the copy key in lib/i18n.ts → dict[locale].work.projects. */
  slug: string;
  /** "01" / "02" / … */
  index: string;
  name: string;
  stack: string[];
  /** Which side the mockup sits on at wide widths. */
  imageSide: "left" | "right";
  /** Live site link — always shown as "Visit live ↗" (new tab) when absolute. */
  href?: string;
  /** Poster + optional live embed (see ProjectPreview). */
  preview: ProjectPreview;
  /** Browser-frame chrome: caption + gradient + placeholder glow. */
  mockup: {
    label: string;
    gradient: string;
    glow: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "cutmakers",
    index: "01",
    name: "CutMakers",
    stack: [
      "TypeScript",
      "Node · Express",
      "React · Vite",
      "PostgreSQL · Prisma",
      "PIX",
    ],
    imageSide: "left",
    href: "https://cutmakers.derek.dev.br/landingpage",
    // Go live: preview: { poster: "/previews/cutmakers.webp", embed: "https://cutmakers.derek.dev.br/landingpage" }
    preview: {},
    mockup: {
      label: "cutmakers — marketplace landing",
      gradient: "linear-gradient(160deg,#11182c,#0b1020)",
      glow: "radial-gradient(120% 85% at 82% 112%,rgba(108,155,245,0.12),transparent 58%)",
    },
  },
  {
    slug: "inova-stok",
    index: "02",
    name: "Inova Stok",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Event Sourcing", "OCI"],
    imageSide: "right",
    href: "https://inova.derek.dev.br",
    // Login-gated → poster only (a live iframe would just show the login page).
    preview: { poster: "/previews/inova-stok.webp" },
    mockup: {
      label: "inova stok — inventory console",
      gradient: "linear-gradient(160deg,#101830,#0a1322)",
      glow: "radial-gradient(120% 85% at 18% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
  {
    slug: "voluire-club",
    index: "03",
    name: "Voluire Club",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "RBAC", "RLS"],
    imageSide: "left",
    href: "https://voluireclub.com.br",
    preview: {},
    mockup: {
      label: "voluire club — buyer onboarding",
      gradient: "linear-gradient(160deg,#121529,#0b0f1e)",
      glow: "radial-gradient(120% 85% at 82% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
  {
    slug: "nic-crochet",
    index: "04",
    name: "Nic Crochet",
    stack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL"],
    imageSide: "right",
    href: "https://nic.derek.dev.br",
    // Public storefront → poster + click-to-load live embed.
    preview: {
      poster: "/previews/nic-crochet.webp",
      embed: "https://nic.derek.dev.br",
    },
    mockup: {
      label: "nic crochet — storefront",
      gradient: "linear-gradient(160deg,#12152b,#0a0e1f)",
      glow: "radial-gradient(120% 85% at 18% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
];

/** About → capabilities grid, grouped by area (no skill-percentage bars).
 *  `group` keys map to lib/i18n.ts → dict[locale].about.groups. */
export const CAPABILITIES: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Vite", "TypeScript", "Motion"] },
  { group: "Backend", items: ["Node.js", "Express", "TypeScript", "REST"] },
  { group: "Data", items: ["PostgreSQL", "Prisma", "Event Sourcing", "RLS"] },
  { group: "Infra", items: ["Oracle Cloud", "Vercel", "Docker", "CI/CD"] },
];
