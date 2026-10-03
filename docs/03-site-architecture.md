# 03 — Site architecture

## Sitemap

```
/                               Home
/solutions                      Solutions overview
  /solutions/data-engineering
  /solutions/ai
  /solutions/analytics
  /solutions/custom-products
/industries                     Industries overview
  /industries/education
  /industries/healthcare
  /industries/logistics
  /industries/hr-workforce
/products                       Product portfolio
/case-studies                   Index
  /case-studies/[slug]          Detail template
/about
/team
/technology
/insights                       Index with category filter
  /insights/[slug]              MDX article
/careers
/contact
/_styleguide                    Internal, noindex
/privacy, /terms                Placeholder legal pages, noindex until real
```

Business transformation and managed engineering have no standalone routes yet. They live as sections on `/solutions` and are linked from capability cards with anchors (`/solutions#business-transformation`, `/solutions#managed-engineering`). Promote them to routes later by adding a `slug` in `data/capabilities.ts`.

## Navigation

Primary: Solutions, Industries, Products, Case studies, About, Insights. Contact is the CTA button ("Talk to our team"), not a nav item. Team, Technology, and Careers are reached from About's mega-menu and the footer. This keeps the bar to six items.

**Solutions mega-menu** — three columns by pillar, each headed by its coloured node:
- Data: Data engineering, Data and analytics
- Intelligence: AI engineering
- Business: Custom products, Business transformation, Managed engineering
- Right panel (mist): "The foundation is data" with a link to the architecture section on `/solutions/data-engineering`.

**Industries mega-menu** — list of five industries with one-line descriptions, plus "Other industries" linking to `/contact?topic=other-industry`.

**About mega-menu** — About us, Team, Technology, Careers.

Navbar: white, 72px, sticky. Gains a 1px line border once scrolled. Mobile (<1024px): logo + "Menu" text button; opens full-screen plum sheet with accordions for the three mega-menus and the CTA pinned at the bottom.

**Footer (ink):** horizontal dark lockup, one-line positioning, four link columns (Solutions, Industries, Company, Resources), contact placeholders, social placeholders, legal line `© [YEAR] [LEGAL ENTITY NAME]`.

## Homepage, in order

Pillar colour for the axon node in brackets.

1. **Hero** (bridge) — NetworkHero. Headline, support, two CTAs.
2. **Trust strip** (ink) — "Trusted by teams building what comes next." Six `[CLIENT LOGO]` slots, plus a row of industries served as text. No fake logos.
3. **The problem** (data) — "Data everywhere. Answers nowhere." Five short problem lines on the left; on the right, a small diagram of disconnected nodes that snaps into a connected ring on scroll-in (once). Closes with "We connect the pieces."
4. **Capabilities** (bridge) — six capabilities, asymmetric layout.
5. **The foundation is data** (data, mist) — ArchitectureFlow. The strongest section on the page; give it full width.
6. **AI on data you can trust** (ai, plum) — the only dark section on the homepage. Flow: Enterprise data → Knowledge → Models → AI applications → Business actions, drawn with lilac and white nodes. Service list in two columns.
7. **From business problem to working product** (business) — seven-step process as a horizontal timeline (vertical on mobile), each step with one sentence.
8. **Industries** (business) — expanding-row list. Each row: industry name, one line, three example solutions revealed on expand, link.
9. **Products** (bridge) — "Built by us, ready for you." Up to three product slots from `data/products.ts`. Show placeholder state elegantly if none are real yet.
10. **Case studies** (business, mist) — one featured, two compact.
11. **Technology** (data) — category tabs with technology names as text chips. No vendor logos (avoids implied partnership).
12. **Team** (business) — leadership row (placeholders), link to /team.
13. **Insights** (ai) — three latest articles.
14. **Final CTA** (bridge) — centred. The mark's soma at small scale above the headline. Primary CTA only.

## Page specs

**Solutions overview** — hero with the three-beat headline. Pillar sections, each listing its capabilities with key services. Business transformation and managed engineering sections with anchors.

**Solution detail template** (`/solutions/[slug]` data-driven, static params) — hero, "What we build" (services grid), architecture diagram specific to the solution (from data: nodes and edges), typical engagements, technologies, related industries, related case studies, CTA.

**Industries overview** — intro, five industry rows plus "Other industries" block: "We build domain-specific technology wherever complex data and business processes need to become simpler, smarter, and scalable."

**Industry detail template** — the industry's challenge, typical data problems, AI opportunities, solutions and applications we build, relevant case studies (placeholder if none), CTA.

**Products** — portfolio grid filtered by category. Card fields: name, category, problem solved, target customer, key capabilities, screenshot, technology, status (`concept | in development | pilot | available`), CTA. Status shown as a pill.

**Case study detail** — Client, Industry, Challenge, Approach, Architecture (diagram), Implementation, Outcome with metrics. Metrics marked `verified: false` render as placeholders and never animate.

**About** — who we are, what we believe (three-beat statement), mission, approach (the seven-step process, condensed), technology philosophy, timeline (`[YEAR]` placeholders), locations (`[OFFICE LOCATION]`), culture, leadership preview, careers link.

**Team** — grouped by Leadership, Engineering, Data, AI, Product, Business development, Operations. Groups with no members are hidden, not shown empty.

**Technology** — the ten categories from `data/technology.ts`, each with a short philosophy line and technology chips. A clear note: "Technologies we work with. Listing does not imply partnership or certification."

**Insights** — category filter (client-side, URL-synced via `?category=`), featured article, grid. Article page: title, author, date, category, reading time, featured image, MDX body with styled code blocks, tables, and callouts, related articles.

**Careers** — why work with us, engineering culture, learning, hiring process (a real sequence, numbered), benefits (placeholders), open positions from `data/careers.ts` (empty state: "No open roles right now. Send us your profile at [EMAIL].").

**Contact** — "Let's build what your business needs next." Form left (7 cols), contact details right (5 cols). Fields: Name, Work email, Company, Job title, Industry (select), What are you looking to build (select: Data platform, AI application, Analytics, Custom software, Not sure yet), Estimated project scope (select: Discovery only, Under 3 months, 3–6 months, 6+ months, Ongoing), Message. Validation with zod on client and server. Server action stub with a `TODO: wire to [EMAIL SERVICE]`. Honeypot field. Success state replaces the form: "Message sent. We'll reply within [RESPONSE TIME]."
