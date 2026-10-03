# 02 — Design system

## Colour

All colours sampled from the logo asset sheet unless marked *derived*.

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#FFFFFF` | Page background |
| `--color-ink` | `#000000` | Text, ink nodes, footer background |
| `--color-pink` | `#F7147F` | Data. Graphics, fills, large display text |
| `--color-pink-ink` | `#C8076A` *derived* | Pink at body text size (5.7:1 on white) |
| `--color-violet` | `#820AAA` | Intelligence. Graphics and text (8.2:1 on white) |
| `--color-soma-from` | `#D00A88` | Gradient start |
| `--color-soma-to` | `#6C1198` | Gradient end |
| `--color-plum` | `#3D0B52` | Dark sections (from the knock-out tile) |
| `--color-lilac` | `#D9A6F0` *derived* | Violet on plum (7.8:1) |
| `--color-mist` | `#F4F3F6` | Alternate section background, from the asset sheet canvas |
| `--color-line` | `#E4E2E8` *derived* | Hairlines and borders on white |
| `--color-muted` | `#5B5763` *derived* | Secondary text (≈7:1 on white) |

**Contrast rules.** Pink on white is ≈3.9:1, so pink text must be ≥24px bold or ≥32px regular. White on plum ≈15:1. Pink on plum ≈3.9:1, large text only. Verify every pairing you use with a contrast checker in Phase 6.

**Proportion.** Roughly 85% white and mist, 10% ink, 5% brand colour. If a screen looks pink, it's wrong.

**Soma gradient.** `linear-gradient(135deg, var(--color-soma-from), var(--color-soma-to))`. Allowed on: the hero soma, primary button hover fill, the single "data becomes intelligence" node in diagrams, and the final CTA soma. Maximum two appearances per viewport. Never a section background.

## Typography

Two families, clearly distinct, chosen for this brand:

- **Display: Poppins** (500, 600). The wordmark is set in Poppins, so headlines speak in the same voice as the logo. Geometric, round counters echo the ring and nodes. Used only at ≥24px, with tight tracking.
- **Text: Instrument Sans** (400, 500, 600). A narrower, editorial grotesque that reads well at length and keeps Poppins from feeling friendly-startup. Used for body, UI, nav, forms, captions.

Both via `next/font/google`, `display: swap`, latin subset, only the weights listed.

| Style | Family | Size (desktop / mobile) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display | Poppins | 88 / 48 | 500 | 1.02 | -0.035em |
| H1 | Poppins | 64 / 40 | 500 | 1.05 | -0.03em |
| H2 | Poppins | 44 / 32 | 500 | 1.1 | -0.025em |
| H3 | Poppins | 28 / 24 | 500 | 1.2 | -0.015em |
| H4 | Instrument Sans | 20 / 18 | 600 | 1.3 | -0.005em |
| Body large | Instrument Sans | 20 / 18 | 400 | 1.55 | 0 |
| Body | Instrument Sans | 17 / 16 | 400 | 1.6 | 0 |
| Small | Instrument Sans | 15 / 14 | 400 | 1.5 | 0 |
| Caption | Instrument Sans | 13 / 13 | 500 | 1.4 | 0.01em |

`clamp()` between mobile and desktop values (already in `globals.css`). Body measure ≤ 68ch. Display measure ≤ 18ch, H2 ≤ 24ch. No italics or single-word colour accents in headlines.

Three-beat brand headlines are set as separate lines, each `<span class="block">`, all ink:

> Data is infrastructure.
> AI is intelligence.
> Business is the outcome.

## Grid and spacing

- 12-column grid, max content width 1280px, gutters 24px (16px mobile), outer margin `clamp(20px, 5vw, 80px)`.
- The axon column: on ≥1024px, column 1 is reserved for the axon line and section nodes; content starts at column 2.
- Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section vertical padding 128 desktop, 96 tablet, 64 mobile.
- Default alignment: left. Centre only the final CTA.

## Shape

Radii follow hierarchy, not habit:

| Element | Radius |
|---|---|
| Buttons, inputs, tags | pill (echoing the node) |
| Cards and panels | 4px |
| Media (screenshots, photos) | 2px |
| Nodes in diagrams | full circle |

No drop shadows on cards. Elevation is a 1px `--color-line` border that turns ink on hover. The only shadow in the system is the mega-menu panel.

## Iconography

A small in-repo set (~20 icons) on a 24px grid in the logo's language: 1.75px strokes, round caps, nodes as 3px filled circles. Pipeline, warehouse, lake, stream, model, document, search, agent, dashboard, workflow, shield, cloud, code, people, building, truck, heart-pulse, graduation, briefcase, plus. Ink by default; pillar colour only inside pillar-specific contexts.

## Motion

Principle: motion explains flow. If an animation doesn't show something moving from one state or place to another, cut it.

| Moment | Spec |
|---|---|
| Network hero load | Once per session (sessionStorage flag). Ring stroke draws 0–600ms. Pink nodes travel inward along spokes 300–1100ms, staggered 60ms. Soma fills with gradient 1000–1300ms. Violet nodes scale 0.6→1 1100–1500ms. Black chain lights node by node 1400–2000ms. Easing `var(--ease-out)`. |
| Pipeline diagram (foundation section) | When ≥40% in view, a single pink pulse travels the flow over 2.4s, turning violet after the platform node and ink after applications. Once. |
| Hover on cards and links | Border to ink, 160ms. Link underline grows from left, 200ms. Nothing scales or lifts. |
| Mega-menu | Opacity + 8px translate, 180ms. |
| Mobile menu | Full-screen plum sheet, 240ms. |
| Counters | Only where a real number exists. Placeholder metrics never animate. |

No scroll-triggered fade-ups on every section. No parallax. `prefers-reduced-motion: reduce` → every element renders in its end state with no transition.

## Signature components

### NetworkHero

The logo mark rebuilt as an interactive SVG system diagram on the right seven columns; headline on the left five, overlapping the ring's left edge slightly.

```
┌────────────────────────────────────────────────────────────┐
│ ●  Engineering the data        ╭──────────────╮            │
│ │  and intelligence behind    ╱  ●    ●       ╲            │
│ │  better businesses.        │ ●─╲  │  ╱ ●     │           │
│ │                            │ ●──── ◉ ──●      │          │
│ │  Supporting copy           │ ●─╱    ╲ ●─●     │          │
│ │  [Talk to our team]        │    ●     ●─●─●   │          │
│ │  Explore our capabilities   ╲                ╱            │
│ │                             ╰──────────────╯             │
└─┴──────────────────────────────────────────────────────────┘
  └ axon starts here
```

- Geometry comes from `components/brand/Logo.tsx` (`MARK_GEOMETRY`) so hero and logo can never drift apart.
- Pink nodes labelled: ERP, CRM, Documents, Sensors and IoT, APIs.
- Violet nodes: Models, Knowledge, Search. Small hollow nodes: Quality, Governance.
- Black chain: Decisions, Actions, Outcomes.
- Labels appear on hover and keyboard focus (each node is focusable with `role="button"` and `aria-label`). A visually hidden list describes the whole diagram for screen readers.
- Mobile: mark above the headline at 280px, tap shows label in a caption line below.
- Hand-built SVG. No canvas, WebGL, or Lottie. Target <8KB.

### ArchitectureFlow

Vertical on mobile, horizontal on desktop. Sources → Ingestion → Transformation → Data platform → Analytics → AI → Applications → Business outcomes. Pink through Transformation, the Data platform node is the soma (gradient), violet for Analytics and AI, ink after. Each node expands on click to show 2–3 example technologies from `data/technology.ts`. Real sequence, so numbered.

### Section

Wraps every homepage section. Props: `pillar` (`data | ai | business | bridge`), `tone` (`canvas | mist | plum`). Renders the axon node in the pillar colour.

### Cards

`CapabilityCard`, `IndustryCard`, `ProductCard`, `CaseStudyCard`, `InsightCard`, `TeamMemberCard`. Shared: 1px line border, 4px radius, 32px padding, no shadow, pillar node top-left. Avoid identical three-card rows: capabilities use a 2-wide + 4-narrow asymmetric layout (data and AI engineering wide); industries use a list with expanding rows; case studies use one large feature plus a compact list.

### Buttons

- Primary: ink fill, white text, pill. Hover: soma gradient fill.
- Secondary: transparent, 1px ink border. Hover: ink fill, white text.
- On plum: primary is white fill with plum text; secondary is white border.
- Focus ring: `--focus-ring` token.

### Placeholders

`.placeholder` — dashed 1px plum border, `#F5EEF8` background, plum text, the literal bracketed label. Logo slots 160×64. Portraits: square, mist background, abstract node pattern seeded from the person's id.
