@AGENTS.md

# CLAUDE.md — metadatum website

Read this at the start of every session. It overrides other docs if they conflict.

## The company

metadatum is an AI and data engineering company. Positioning: **core data engineering + AI + business development.** It builds data platforms, pipelines, AI systems, analytics, and custom software, and it helps organisations work out what to build in the first place. Clients are enterprises, mid-sized companies, governments, and startups that need serious data infrastructure.

Brand line: *We engineer the data and intelligence behind better businesses.*
Core belief: *AI is only as good as the data beneath it.*

The name is always lowercase: **metadatum**. Never "Metadatum" or "MetaDatum", including at the start of a sentence (rephrase instead) and in `<title>` tags.

## Placeholder policy (strict)

Never fabricate. When a fact isn't in `data/`, render a visible placeholder in this exact form:

`[CLIENT NAME]` `[CLIENT LOGO]` `[METRIC — e.g. XX% reduction in processing time]` `[TEAM MEMBER NAME]` `[ROLE]` `[BIO]` `[OFFICE LOCATION]` `[EMAIL]` `[PHONE]` `[LINKEDIN URL]` `[PRODUCT NAME]` `[PRODUCT DESCRIPTION]` `[CERTIFICATION]` `[PARTNER LOGO]` `[DATE]` `[YEAR]`

Placeholders render with the `.placeholder` utility (dashed outline, plum text on plum-50) so they are impossible to miss in review. Logo slots render as dashed boxes with the bracketed label inside. Placeholder portraits are an abstract node pattern, never stock faces or generated people.

Technology names (e.g. Databricks, Azure, PySpark, Power BI) may appear as *technologies we work with*. Never imply certification or partnership with any vendor.

## Writing rules

- Short, specific, confident. Headlines ≤ 10 words. Body paragraphs ≤ 3 sentences.
- Sentence case everywhere: headings, buttons, nav, labels. No all-caps labels, no tracked-out eyebrows.
- Banned words: revolutionary, disruptive, next-generation, game-changing, cutting-edge, seamless, unlock, unleash, supercharge, harness, empower, synergy, best-in-class, world-class, leverage (as a verb).
- Buttons say what happens: "Talk to our team", "See the case study", "Send message". No arrows appended to button or link text.
- Don't join metadata with middle dots. Use separate elements or commas.

## Design rules (summary — full spec in docs/02)

- Canvas is white `#FFFFFF`. Text is ink `#000000`. True black, not tinted near-black.
- Colour carries meaning: **pink = data**, **violet = intelligence**, **ink = engineering and outcomes**, **soma gradient = the moment data becomes intelligence**. Don't use a colour where its meaning doesn't apply.
- The soma gradient appears at most twice per page and never as a background wash.
- Dark sections use **plum `#3D0B52`**, not black. The footer is ink.
- Pink `#F7147F` fails AA as small text on white. Use it for graphics, large display text (≥24px bold / ≥32px regular), and fills. For pink text at body size, use `--color-pink-ink` (`#C8076A`).
- Radii follow hierarchy (see docs/02). Not one radius on everything.
- One bold element per page. On the homepage it's the network hero. Everything else stays disciplined.
- Number markers only on real sequences (the pipeline flow, the delivery process, timelines).

## Code conventions

- App Router, Server Components by default. `"use client"` only for interactive leaves.
- Content lives in `data/` (typed by `lib/content/types.ts`) and `content/insights/*.mdx`. Components receive content via props. No copy inline in components except UI chrome (e.g. "Open menu").
- All content reads go through `lib/content/index.ts` (async functions) so a CMS can replace the static source without touching pages.
- Tailwind utilities reference tokens only (`bg-pink`, `text-ink`, `bg-plum`). No raw hex in components.
- Images through `next/image` with explicit sizes. SVG diagrams inline as components so they inherit tokens.
- Every interactive element is keyboard reachable with a visible focus ring (`--focus-ring`). Every animation has a `prefers-reduced-motion` path.
- Run `pnpm typecheck && pnpm lint && pnpm build` before reporting any phase complete.

## Decisions made during the build (override docs/)

- **The official logo is the neuron mark from `neuron-logo-brand-package`** (2026-10-04; replaces the earlier neuron-compact mark). No ring. Files in `public/brand/`, geometry generated into `components/brand/mark-geometry.ts`. Usage: clear space ≥ nucleus width; full mark ≥64px, small-size icon below; never recolour arms, add 3D/shadows/glow, reorder nodes or stretch it. Colour names: Neuron Pink, Synapse Violet, Nucleus blend, Axon Ink.
- **Chain colour follows the background:** black on white/mist, white on plum/ink. Spokes and soma keep their colours on both.
- The internal styleguide lives at `app/%5Fstyleguide` (folders starting with `_` are private in the App Router).
- Industries mega-menu lists the four industries plus "Custom enterprise solutions" (five rows), then "Other industries".
- **Redesign (2026-10-03, at the client's request) overrides docs/02 where they conflict:**
  - No network hero and no abstract node artwork. The logo appears in the navbar and footer only.
  - Real photography (Unsplash, registry in `lib/images.ts`, credits in `assets/images/CREDITS.md`) is used across the site. Never use photos of people to represent the metadatum team or clients; team portraits stay as placeholders until real ones arrive.
  - Scroll motion is allowed: `Reveal` (fade/slide/image clip on scroll-in), `Parallax`/`ParallaxPhoto` (layered drift), sticky process column, header that hides on scroll down. All of it is off under reduced motion and invisible-safe without JavaScript.
  - Keep copy short: headline, one line, a visual. Homepage sections: hero, trust strip, problem, capabilities, foundation, AI, process, industries, case study, final CTA.
  - **"The foundation is data" section is approved as-is. Do not change it.**
- **Hosting is GitHub Pages via static export** (`output: "export"`, 2026-10-04, client's choice). No server at runtime: no server actions, route handlers that read the request, cookies, headers, redirects or the image optimiser. Every dynamic route and per-route `opengraph-image` needs `generateStaticParams` and `dynamic = "force-static"`. The contact form posts to Web3Forms from the browser (`NEXT_PUBLIC_WEB3FORMS_KEY`). `pnpm build` runs `scripts/static-fixups.mjs` afterwards. Deploys run from `.github/workflows/deploy.yml` on push to `main`.
- Public email and phone are hidden for now (omitted from `data/site.ts`); when shown, the email is always masked ("user at domain") and the mailto is built on click.
- **Draft/publish (2026-10-07):** collection items carry `published`; getters in `lib/content` return published items only (`get*Slugs` include drafts for static params, pages `notFound()` drafts). Text blocks with a `[PLACEHOLDER]` are held back via `isReady`. Navigation, footer and sitemap drop unpublished sections. `SHOW_DRAFTS=1` previews everything. Never show placeholders on the live site.
