# CLAUDE.md — derek.dev.br

Personal portfolio for **Derek**, a full-stack developer (Node/Express/TS · React/Vite/TS · PostgreSQL/Prisma). Two audiences at once: **recruiters/hiring managers** (junior/internship) and **freelance clients** (proof of shipped, polished products).

**Design direction:** _"Living 3D hero, editorial body."_ A draggable glass-crystal hero (the single "wow"), then a calm editorial body where the work is the spine. Built to the **locked Claude Design handoff** ("Derek Portfolio — Editorial 3D"), recreated faithfully on the Next.js + R3F stack.

---

## Status

### ✅ Implemented — full single-page site, matches the design

- **Palette + type system** locked to the handoff (see below); old orange/navy/Syne system fully removed.
- **Hero:** literal faceted **glass crystal** (icosahedron), **grab-to-rotate** (no auto-spin), inertia glide, render-on-demand. Ported from the design's `crystal.js` into `components/three/crystal-hero.tsx` (raw `three`, lazy `ssr:false`).
- **Sections:** Hero → "What I do" strip → Selected work (3 alternating project rows) → About + capabilities → Contact (cursor-follow spotlight showpiece) → footer.
- **Content is real** (from the design) in `lib/constants.ts`: `PROJECTS` (CutMakers / Inova Stok / Voluire Club) + `CAPABILITIES`.
- Verified: `pnpm lint` + `pnpm typecheck` green; dev server serves `/` 200, compiles clean.

### ⏭️ Remaining before launch

- Real **GitHub/LinkedIn** handles in `lib/constants.ts` (`SITE.socials`, currently `github.com/derek` placeholders). Email is set to Derek's real address (design showed a placeholder `hello@derek.dev`).
- Replace the **striped mockup placeholders** with real project screenshots.
- **OG image** + **favicon**.
- Run a clean `pnpm build` before deploy.

---

## Stack (exact)

| Concern           | Choice                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework         | **Next.js 16** (App Router) + **React 19** + **TypeScript strict**                                                                               |
| Styling           | **Tailwind CSS v4** (CSS-first `@theme`) + **shadcn/ui** (`base-nova`, Base UI — only `button.tsx` present, currently unused)                    |
| 3D                | **three** (raw, in a client component) — the crystal. R3F/drei remain installed but the hero is hand-written for 1:1 fidelity with `crystal.js`. |
| Smooth scroll     | **lenis** (duration 1.15, `anchors:true`)                                                                                                        |
| Scroll-in reveals | **animejs v4**                                                                                                                                   |
| Hover / card lift | **CSS transitions**                                                                                                                              |
| Showpiece         | Contact **cursor-follow radial spotlight** (no extra dep)                                                                                        |
| Package manager   | **pnpm** (`CI=true` in non-TTY shells)                                                                                                           |
| Deploy            | Vercel                                                                                                                                           |

> Next 15 was specced; `create-next-app` ships **Next 16** (superset). Built on 16.

---

## Design system (source of truth: `app/globals.css`)

**Never hardcode hex/durations in components — reference tokens.**

### Color (locked)

- `--ink #102A43` — primary dark-blue background + text on light
- `--paper #EEF2F7` — light sections + text on dark
- `--accent #6C9BF5` — single soft-blue accent / CTA. **No orange, no black.**

On-dark tints = `text-paper/72` etc. (→ `rgba(238,242,247,0.72)`); on-light tints = `text-ink/66` (→ `rgba(16,42,67,0.66)`). Default theme is dark blue; `.surface-light` / `.surface-dark` flip the semantic tokens per full-bleed section. Direct utilities: `bg-ink`, `text-paper`, `text-accent`, `ring-accent`.

### Typography

- **Hanken Grotesk** for everything (weights 400–800; var `--font-hanken` → `font-sans`/`font-display`). Restraint via **weight**, not size. System monospace (`font-mono`) for small technical labels.
- Editorial type scale (exact clamps in `@theme`): `text-hero`, `text-statement`, `text-work`, `text-contact`, `text-about`, `text-project`, `text-lede`, `text-body`.

### Layout

Containers `max-w-[1320px]`, horizontal padding `clamp(20px,6vw,120px)`, per-section vertical padding clamps. Intrinsic responsiveness only (clamp / flex-wrap / grid auto-fit) — matches the design's no-media-query approach. `Section` + `Eyebrow` helpers in `components/layout/section.tsx`.

### Motion tokens

`lib/motion.ts` mirrors the CSS motion vars: `DURATION`, `EASE`, `EASE_ANIME`, `REVEAL` (y 26, 780ms, outSoft), `LENIS` (duration 1.15 + easing). CSS keyframes `dotPulse` / `scrollPulse` / `rise` live in `globals.css`.

---

## Animation discipline — ONE job per library

| Library             | Sole responsibility                            | Where                                    |
| ------------------- | ---------------------------------------------- | ---------------------------------------- |
| **three**           | Hero crystal only                              | `components/three/crystal-hero.tsx`      |
| **lenis**           | Page-wide smooth scroll + anchor scroll        | `components/providers/smooth-scroll.tsx` |
| **anime.js**        | Scroll-in reveals (with per-element delay)     | `components/motion/reveal.tsx`           |
| **CSS transitions** | Card lift + button/link hover                  | section components                       |
| **spotlight**       | The one showpiece — contact cursor-follow glow | `components/sections/contact.tsx`        |

Scroll-in detection is a plain `IntersectionObserver` (`hooks/use-in-view.ts`) so anime.js stays decoupled from scroll. `<Reveal delay={ms}>` mirrors the design's `data-reveal` / `data-reveal-delay`.

---

## Hero crystal — engine + budget (`components/three/crystal-hero.tsx`)

- Faceted **glass icosahedron** (`MeshPhysicalMaterial`, `flatShading`, `DoubleSide`, opacity ~0.5, procedural cube env-map) + **soft-blue additive core** + **white `EdgesGeometry`** overlay; resting three-quarter pose.
- **Grab-to-rotate, no auto-spin:** still until dragged; on release glides to a stop (inertia + friction), then the render loop **halts** (idle = no work). Drag for **fine pointers only** (touch keeps the page scrollable). Reduced-motion → static frame, drag without inertia.
- `dpr` capped (`min(devicePixelRatio, coarse?1.5:2)`); **paused off-screen** via `IntersectionObserver`; `ACESFilmicToneMapping`, sRGB. Accent read from CSS (`getCssColor('--accent')`); `BRAND` in `lib/constants.ts` is the SSR fallback.
- Mounted via `next/dynamic({ ssr:false })` from `<Hero />` → kept out of first paint. Canvas is `pointer-events:none` by default; the engine flips it to `auto` for fine pointers so the gem is grabbable across the whole hero (scrims + copy column are `pointer-events:none`).

---

## Folder structure

```
app/                      # routes; globals.css holds the token system
components/
  ui/                     # shadcn button (Base UI; currently unused)
  sections/               # hero, positioning, featured-work, project-card, about, contact
  three/                  # crystal-hero.tsx (raw three)
  motion/                 # anime.js reveal wrapper
  layout/                 # header (nav), footer, Section + Eyebrow
  providers/              # Lenis SmoothScroll
hooks/                    # use-in-view, use-media-query, use-prefers-reduced-motion
lib/                      # constants (site/nav/projects/capabilities/brand), motion tokens, utils (cn, getCssColor)
```

---

## Conventions (non-negotiable)

- **TypeScript strict**; no `any` without a justifying comment. Explicit prop types.
- **No magic colors/durations** in components — pull from tokens (`globals.css`) / constants (`lib/`). Exact one-off design values (clamps, rgba scrims, gradients) are inline by intent to match the handoff 1:1.
- **Naming:** PascalCase components, camelCase functions/vars, **kebab-case files**.
- **Accessibility (WCAG AA):** semantic landmarks, keyboard-focusable nav + CTAs, visible `focus-visible` rings (accent), `aria-hidden` on decorative layers, scrims keep hero text legible over the crystal.
- **ESLint:** Next 16 ships strict React Compiler rules (`react-hooks/purity`, `set-state-in-effect`). Use `useSyncExternalStore` for media queries (`use-media-query.ts`); toggle scroll-driven nav styling on the DOM node directly (see `header.tsx`); keep impure work out of render.
- **Commits:** Conventional Commits.

## Commands (Windows — pnpm)

```
pnpm dev          # dev server (Turbopack) → http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier write
```

> In non-interactive shells set `CI=true`. Native build scripts (`sharp`, `unrs-resolver`) are pre-approved in `pnpm-workspace.yaml → onlyBuiltDependencies`.

## Reference

- Design handoff source (read-only): the Claude Design export "Derek Portfolio — Editorial 3D" — `Derek Portfolio.dc.html` + `crystal.js`. Recreate visual output 1:1; that file is the spec for any future section work.
