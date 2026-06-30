/**
 * Site-wide constants — content + data shapes for the editorial-3D portfolio.
 * Copy mirrors the locked Claude Design handoff (Derek Portfolio).
 *
 * TODO(derek): swap the placeholder GitHub/LinkedIn handles for the real ones.
 */

export const SITE = {
  name: "Derek",
  title: "Derek — Full-stack developer",
  description:
    "Full-stack developer. Marketplaces, inventory systems, and post-sale " +
    "platforms — designed, built, and shipped to production. Node, React, and " +
    "PostgreSQL, from schema to the last pixel.",
  url: "https://derek.dev.br",
  locale: "pt-BR",
  email: "derek.cavalcanti1@gmail.com",
  location: "Brazil · Remote-friendly · PT & EN",
  socials: {
    github: "https://github.com/derek", // TODO(derek): real handle
    linkedin: "https://linkedin.com/in/derek", // TODO(derek): real handle
  },
} as const;

/** In-page navigation. `id` matches a section element id in app/page.tsx. */
export const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

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
 * What renders inside a project's mockup frame:
 *  - placeholder → the striped mockup (default, before the site is live)
 *  - image       → a screenshot, e.g. { type: "image", src: "/work/cutmakers.png" }
 *  - iframe      → a live, scaled embed of the running site
 *
 * To show a REAL live preview once the subdomain is up, flip `preview` to
 * `{ type: "iframe", url: <live url> }`. The embedded site MUST allow framing
 * from this origin — on its OCI nginx server block add:
 *   add_header Content-Security-Policy "frame-ancestors 'self' https://derek.dev.br";
 * and it must NOT send `X-Frame-Options: DENY` / `SAMEORIGIN`.
 * (Dashboards behind auth will frame their login screen — prefer a screenshot
 * for those, or a public landing route.)
 */
export type ProjectPreview =
  | { type: "placeholder" }
  | { type: "image"; src: string }
  | { type: "iframe"; url: string };

export type Project = {
  slug: string;
  /** "01" / "02" / "03". */
  index: string;
  /** Eyebrow category, e.g. "Flagship · Marketplace". */
  category: string;
  name: string;
  /** Business description — problem + outcome, for clients. */
  description: string;
  /** One technical highlight, for recruiters. */
  techHighlight: string;
  stack: string[];
  /** Which side the mockup sits on at wide widths. */
  imageSide: "left" | "right";
  /** Live site / case-study link (opens in a new tab when absolute). */
  href?: string;
  /** Visual shown in the mockup frame (see ProjectPreview). */
  preview: ProjectPreview;
  /** Browser-frame chrome shown around every preview type. */
  mockup: {
    /** Monospace caption. */
    label: string;
    /** Base panel gradient (also the loading backdrop for live previews). */
    gradient: string;
    /** Soft-blue glow overlay (radial-gradient). */
    glow: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "cutmakers",
    index: "01",
    category: "Flagship · Marketplace",
    name: "CutMakers",
    description:
      "A two-sided marketplace connecting video creators with freelance editors — handling discovery, contracts, PIX escrow payments, and trust between strangers, end to end.",
    techHighlight:
      "Role-based dashboards, real-time chat, and a review system layered over a PIX escrow flow.",
    stack: [
      "TypeScript",
      "Node · Express",
      "React · Vite",
      "PostgreSQL · Prisma",
      "PIX",
    ],
    imageSide: "left",
    href: "https://cutmakers.derek.dev.br/landingpage",
    // Public landing page (not auth-gated) — ideal live preview. Go live:
    // preview: { type: "iframe", url: "https://cutmakers.derek.dev.br/landingpage" }
    preview: { type: "placeholder" },
    mockup: {
      label: "cutmakers — marketplace landing",
      gradient: "linear-gradient(160deg,#11182c,#0b1020)",
      glow: "radial-gradient(120% 85% at 82% 112%,rgba(108,155,245,0.12),transparent 58%)",
    },
  },
  {
    slug: "inova-stok",
    index: "02",
    category: "Production · Inventory",
    name: "Inova Stok",
    description:
      "A single-tenant inventory system for a car dealership where every stock movement is an event — fully auditable, reversible, and running in production.",
    techHighlight:
      "Event-sourced stock model deployed to production on Oracle Cloud Infrastructure.",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Event Sourcing", "OCI"],
    imageSide: "right",
    href: "https://inovastok.derek.dev.br",
    // Go live: preview: { type: "iframe", url: "https://inovastok.derek.dev.br" }
    preview: { type: "placeholder" },
    mockup: {
      label: "inova stok — inventory console",
      gradient: "linear-gradient(160deg,#101830,#0a1322)",
      glow: "radial-gradient(120% 85% at 18% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
  {
    slug: "voluire-club",
    index: "03",
    category: "Client · Real estate",
    name: "Voluire Club",
    description:
      "A post-sale platform built for a paying real-estate client — onboarding buyers and guiding them through everything that happens after the purchase is signed.",
    techHighlight:
      "RBAC and row-level security with QR-code onboarding for new buyers.",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "RBAC", "RLS"],
    imageSide: "left",
    href: "https://voluireclub.com.br",
    // Go live: preview: { type: "iframe", url: "https://voluireclub.com.br" }
    preview: { type: "placeholder" },
    mockup: {
      label: "voluire club — buyer onboarding",
      gradient: "linear-gradient(160deg,#121529,#0b0f1e)",
      glow: "radial-gradient(120% 85% at 82% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
  {
    slug: "nic-crochet",
    index: "04",
    category: "Client · Storefront",
    name: "Nic Crochet",
    // TODO(derek): confirm Nic Crochet copy + stack.
    description:
      "A handmade-crochet storefront for an independent maker — a product catalog, custom-order requests, and a calm shopping experience built to turn browsers into buyers.",
    techHighlight:
      "Product catalog and custom-order flow with an admin to manage pieces and orders.",
    stack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL"],
    imageSide: "right",
    href: "https://nic-crochet.derek.dev.br",
    // Public storefront — ideal live preview. Go live:
    // preview: { type: "iframe", url: "https://nic-crochet.derek.dev.br" }
    preview: { type: "placeholder" },
    mockup: {
      label: "nic crochet — storefront",
      gradient: "linear-gradient(160deg,#12152b,#0a0e1f)",
      glow: "radial-gradient(120% 85% at 18% 112%,rgba(108,155,245,0.1),transparent 58%)",
    },
  },
];

/** About → capabilities grid, grouped by area (no skill-percentage bars). */
export const CAPABILITIES: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Vite", "TypeScript", "Motion"] },
  { group: "Backend", items: ["Node.js", "Express", "TypeScript", "REST"] },
  { group: "Data", items: ["PostgreSQL", "Prisma", "Event Sourcing", "RLS"] },
  { group: "Infra", items: ["Oracle Cloud", "Vercel", "Docker", "CI/CD"] },
];
