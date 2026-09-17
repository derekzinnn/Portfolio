# CLAUDE.md - derek.dev.br

Personal portfolio for **Derek**, a full-stack developer (Node/Express/TS · React/Vite/TS · PostgreSQL/Prisma). Two audiences at once: **recruiters/hiring managers** (junior/internship) and **freelance clients** (proof of shipped, polished products).

**Design direction:** _"Living 3D hero, editorial body."_ An interactive 3D hero (the single "wow"), then a calm editorial body where the work is the spine. Palette/type/layout come from the locked Claude Design handoff ("Derek Portfolio - Editorial 3D"); the hero object itself was later changed at Derek's request (see below).

> **Writing rule (non-negotiable):** never use the em-dash character (U+2014). Use commas, colons, periods, parentheses, or a hyphen. Applies to copy, comments, docs, and commits. (Enforced across the repo; a memory note tracks it.)

---

## Status

### ✅ Implemented - full single-page site

- **Palette + type system** locked to the handoff (see below).
- **Hero: a 3D "cubo mágico" (Rubik's cube).** `components/three/rubiks-cube-hero.tsx` (raw `three`, lazy `ssr:false`). A real 3×3×3 cube that **assembles itself** on load (cubies fly in), then **solves itself in a loop** (records a random scramble, then replays it reversed to reach a perfect solved cube, holds, repeats) while the **whole cube tumbles on a diagonal world axis** (so it is almost never dead-on flat). **Drag to rotate** pauses the spin. Positioned relative to the viewport's right edge (see `resize()`), so it hugs the right at any width. Replaced the earlier draggable glass crystal.
- **Sections:** Hero → "What I do" strip → Selected work (4 alternating project rows) → About + capabilities → Contact (cursor-follow spotlight showpiece) → footer.
- **Content is real** in `lib/i18n.ts` (all copy, EN + PT) and `lib/constants.ts` (structure): `PROJECTS` (CutMakers / Inova Stok / Voluire Club / Nic Crochet) + `CAPABILITIES`.
- **Project previews** - poster + click-to-load (`components/sections/project-preview.tsx`): a screenshot poster (`next/image`) loads with the page (falls back to the striped placeholder); clicking mounts a sandboxed live `<iframe>` (desktop only, reduced-motion-aware). Login-gated projects (Inova Stok) are poster-only. Each card has an always-visible "Visit live ↗" link. Posters captured with `pnpm previews:capture`.
- **i18n (EN default / PT-BR)** - all copy in `lib/i18n.ts`; a navbar EN⇄PT toggle (`components/layout/language-toggle.tsx`) flips it. Locale is a `localStorage`-backed `useSyncExternalStore` (`hooks/use-locale.ts` → `useLocale` / `useT`); persists, no provider. Keeps `<html lang>` in sync.
- **CI/CD** - merge to `main` → GitHub Actions builds a Docker image, pushes to GHCR, SSHes to the VPS and runs `docker compose pull && up -d` (`.github/workflows/deploy.yml`, `Dockerfile`, `deploy/`).

### Recent fixes / decisions worth remembering

- **Reveal reduced-motion bug (fixed):** `components/motion/reveal.tsx` used to hide content (`opacity:0`) and, when reduced-motion resolved true after the first render, returned early without un-hiding, leaving the whole body invisible for reduced-motion visitors. Now it explicitly clears the hidden state under reduced motion. Always verify reveals with reduced-motion ON.
- **Nic Crochet** lives on its own domain **`niccrochet.com.br`** (not a derek.dev.br subdomain). Its live-embed iframe needs `frame-ancestors 'self' https://derek.dev.br` in that site's Caddyfile.

### ⏭️ Remaining before launch

- Real GitHub/LinkedIn handles are set. Email is Derek's real address.
- **Preview screenshots:** `pnpm previews:capture` (after `pnpm exec playwright install chromium` + `.env.local`) generates `public/previews/{nic-crochet,inova-stok}.webp`. Until captured, those cards show the striped placeholder.
- **OG image** + **favicon**.
- CI secrets + first-run steps live in `deploy/README.md`.

---

## Stack (exact)

| Concern           | Choice                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | **Next.js 16** (App Router) + **React 19** + **TypeScript strict**                                                              |
| Styling           | **Tailwind CSS v4** (CSS-first `@theme`) + **shadcn/ui** (`base-nova`, Base UI; only `button.tsx` present, unused)              |
| 3D                | **three** (raw, in a client component) - the Rubik's cube hero (hand-written, not R3F). R3F/drei remain installed but unused.   |
| Smooth scroll     | **lenis** (duration 1.15, `anchors:true`)                                                                                       |
| Scroll-in reveals | **animejs v4**                                                                                                                  |
| Hover / card lift | **CSS transitions**                                                                                                             |
| Showpiece         | Contact cursor-follow radial spotlight (no extra dep)                                                                           |
| Package manager   | **pnpm** (`CI=true` in non-TTY shells)                                                                                          |
| Deploy            | **OCI VPS**, docker-compose per project, **Caddy** reverse proxy; CI builds the image on GitHub → GHCR → VPS pulls. Not Vercel. |
| Output            | `next.config.ts`: `output: "standalone"` + `images.unoptimized` (no runtime sharp)                                              |

> Next 15 was specced; `create-next-app` ships **Next 16** (superset). Built on 16.

---

## Design system (source of truth: `app/globals.css`)

**Never hardcode hex/durations in components; reference tokens.**

### Color (locked)

- `--ink #102A43`: primary dark-blue background + text on light
- `--paper #EEF2F7`: light sections + text on dark
- `--accent #6C9BF5`: single soft-blue accent / CTA. No orange, no black (for the site chrome; the Rubik hero uses classic sticker colors by design).

On-dark tints = `text-paper/72` etc.; on-light tints = `text-ink/66`. Default theme is dark blue; `.surface-light` / `.surface-dark` flip semantic tokens per full-bleed section. Separator character used in copy is the middle dot "·" (never the em-dash).

### Typography

- **Hanken Grotesk** for everything (weights 400-800; var `--font-hanken`). Restraint via weight, not size. System monospace for small labels.
- Editorial type scale (exact clamps in `@theme`): `text-hero`, `text-statement`, `text-work`, `text-contact`, `text-about`, `text-project`, `text-lede`, `text-body`.

### Layout

Containers `max-w-[1320px]`, horizontal padding `clamp(20px,6vw,120px)`, per-section vertical padding clamps. Intrinsic responsiveness only (clamp / flex-wrap / grid auto-fit). `Section` + `Eyebrow` helpers in `components/layout/section.tsx`.

### Motion tokens

`lib/motion.ts` mirrors the CSS motion vars (`DURATION`, `EASE`, `EASE_ANIME`, `REVEAL`, `LENIS`). CSS keyframes `dotPulse` / `scrollPulse` / `rise` live in `globals.css`.

---

## Animation discipline - one job per library

| Library             | Sole responsibility                               | Where                                    |
| ------------------- | ------------------------------------------------- | ---------------------------------------- |
| **three**           | Hero Rubik's cube only                            | `components/three/rubiks-cube-hero.tsx`  |
| **lenis**           | Page-wide smooth scroll + anchor scroll           | `components/providers/smooth-scroll.tsx` |
| **anime.js**        | Scroll-in reveals (per-element delay)             | `components/motion/reveal.tsx`           |
| **CSS transitions** | Card lift + button/link hover, navbar toast morph | section/layout components                |
| **spotlight**       | The one showpiece: contact cursor-follow glow     | `components/sections/contact.tsx`        |

Scroll-in detection is a plain `IntersectionObserver` (`hooks/use-in-view.ts`). `<Reveal delay={ms}>` mirrors the design's data-reveal.

---

## Hero cube - engine + budget (`components/three/rubiks-cube-hero.tsx`)

- 27 cubies (black bodies + colored sticker planes on exterior faces), a valid Rubik color scheme, soft key/fill lights, subtle sheen.
- **Self-assembling + self-solving loop:** assemble (fly-in) → scramble N recorded moves → replay reversed to solve → hold on the solved cube → repeat. Layer turns use a temporary pivot + `attach`/`detach` (world-preserving), snapping cubie positions to the grid after each turn.
- **Idle diagonal tumble** of the whole cube via `rotateOnWorldAxis` on a diagonal axis, paused while dragging. **Grab-to-rotate** for fine pointers.
- Budget: `dpr` capped; **paused off-screen** via `IntersectionObserver`. Under **reduced motion** it still animates but slower/calmer (gentle scale-in, no explosion) rather than going static, because the cube is the hero. Position is computed in `resize()` relative to the half-view-width so it hugs the right wall on any viewport.
- Mounted via `next/dynamic({ ssr:false })` from `<Hero />`. Canvas is `pointer-events:none` by default; the engine flips it to `auto` for fine pointers so it is grabbable across the hero.

---

## Folder structure

```
app/                      # routes; globals.css holds the token system
components/
  ui/                     # shadcn button (Base UI; unused)
  sections/               # hero, positioning, featured-work, project-card, project-preview, about, contact
  three/                  # rubiks-cube-hero.tsx (raw three)
  motion/                 # anime.js reveal wrapper
  layout/                 # header (nav), footer, Section + Eyebrow, language-toggle, skip-link
  providers/              # Lenis SmoothScroll
hooks/                    # use-in-view, use-media-query, use-prefers-reduced-motion, use-scrolled, use-locale
lib/                      # constants (structure), i18n (EN/PT dict), motion tokens, utils (cn, getCssColor)
scripts/                  # capture-previews.ts (Playwright poster capture)
.github/workflows/        # deploy.yml (CI: build image -> GHCR -> SSH deploy)
deploy/                   # VPS docker-compose template + README (secrets, Caddy, first-run)
Dockerfile, .dockerignore # multi-stage Next standalone image
```

---

## Conventions (non-negotiable)

- **No em-dash (U+2014), ever.** Comma/colon/period/hyphen instead.
- **TypeScript strict**; no `any` without a justifying comment. Explicit prop types.
- **No magic colors/durations** in components; pull from tokens / constants. Exact one-off design values (clamps, rgba scrims, gradients) are inline by intent.
- **Naming:** PascalCase components, camelCase functions/vars, kebab-case files.
- **Accessibility (WCAG AA):** semantic landmarks, keyboard-focusable nav + CTAs, visible `focus-visible` rings (accent), `aria-hidden` on decorative layers.
- **ESLint:** Next 16 ships strict React Compiler rules (`react-hooks/purity`, `set-state-in-effect`). Use `useSyncExternalStore` for external state (media queries, scroll, locale); keep impure work (Math.random, Date, three.js) inside effects, not render.
- **Commits:** Conventional Commits.

## Commands (Windows - pnpm)

```
pnpm dev          # dev server (Turbopack) -> http://localhost:3000
pnpm build        # production build (standalone)
pnpm start        # serve the production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier write
pnpm previews:capture   # Playwright: regenerate public/previews/*.webp
```

> In non-interactive shells set `CI=true`. Native build scripts (`sharp`, `unrs-resolver`, `esbuild`) are pre-approved in `pnpm-workspace.yaml`.

## Reference

- Design handoff (read-only): the Claude Design export "Derek Portfolio - Editorial 3D" (`Derek Portfolio.dc.html` + `crystal.js`). It defines the palette/type/layout and the editorial body 1:1. The hero object diverges from it on purpose (Derek chose a Rubik's cube over the glass crystal).
