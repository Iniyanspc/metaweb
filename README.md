# metadatum website

The corporate site for metadatum, live at https://themetadatum.com.
Next.js (App Router) exported as a static site and hosted on GitHub Pages.

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck && pnpm lint
pnpm build          # static site in out/
pnpm placeholders   # lists content still to fill in
```

## Deploy

Every push to `main` builds and publishes the site through
`.github/workflows/deploy.yml`. One-time setup on GitHub:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** `themetadatum.com` (also in `public/CNAME`).
3. **Settings → Secrets and variables → Actions → Variables:** add
   `NEXT_PUBLIC_WEB3FORMS_KEY` (free key from web3forms.com, registered to the
   address that should receive contact-form enquiries).

## Edit content

All copy lives in `data/` (homepage in `data/home.ts`, other pages in
`data/pages.ts`, company facts in `data/site.ts`) and articles in
`content/insights/*.mdx`. Photos are registered in `lib/images.ts`; client
logos live in `public/clients/`. Fields typed `missing("[…]")` show as a
visible placeholder until replaced with `known(…)`.

## Drafts and publishing

Unfinished content stays in the repo but off the live site (`lib/publish.ts`):

- **Case studies, team members, products:** each item has `published: true/false`
  in `data/`. **Articles** in `content/insights/` publish unless their frontmatter
  says `sample: true` or `published: false`.
- A section with nothing published disappears from its page, the menus, the
  footer and the sitemap, and its address returns 404.
- Single text blocks (about: mission, timeline; careers: learning, benefits)
  stay hidden while they contain a `[PLACEHOLDER]`; fill them in to show them.
- Preview everything, drafts included: `SHOW_DRAFTS=1 pnpm dev`
  (also enables the internal `/_styleguide`).

To publish: fill in the content, set `published: true`, push. Everything
waiting to be filled, reviewed or set up is tracked in **BACKLOG.md**.

## Static hosting constraints

The site has no server at runtime, so: no server actions or API routes (the
contact form posts to Web3Forms from the browser), no image optimiser (photos
are served as stored), and every dynamic route needs `generateStaticParams`.
`scripts/static-fixups.mjs` runs after `next build`: it removes routes for
unpublished sections (so they 404) and gives generated preview images a `.png`
extension so GitHub Pages serves the right content type.
