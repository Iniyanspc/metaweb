# 05 — Content model, CMS readiness, SEO

## Content layer

```
lib/content/
  types.ts        // starter file — the schema
  index.ts        // async getters: getCapabilities(), getIndustry(slug), getCaseStudies({ industry }) …
  source/static.ts// reads from data/*.ts and content/insights/*.mdx
data/
  site.ts  capabilities.ts  industries.ts  products.ts  case-studies.ts
  team.ts  technology.ts  careers.ts  navigation.ts
content/insights/*.mdx   // frontmatter matches the Insight type
```

Pages import only from `lib/content/index.ts`. To move to a CMS (Sanity, Contentful, Payload, Strapi), add `source/cms.ts` implementing the same getters and switch the export in `index.ts`. Keep the types; map CMS responses into them.

All slugs are unique and used for `generateStaticParams`. Cross-references use slugs (e.g. a case study lists `industry: "healthcare"`, `capabilities: ["data-engineering"]`), and getters resolve them.

## The placeholder type

Any field that may be unknown is typed as `Verified<T>`:

```ts
type Verified<T> = { value: T; verified: true } | { placeholder: string; verified: false };
```

Components render `value` when verified, otherwise the `.placeholder` treatment with the label. `pnpm placeholders` lists every unverified field across `data/` and every bracketed token in MDX and components.

## SEO

- `metadata` / `generateMetadata` on every route: title (`Page — metadatum`), description (≤155 chars, written per page, not templated), canonical from `site.url`, Open Graph and Twitter cards.
- OG images via `opengraph-image.tsx`: white background, page title in Poppins, the mark bottom-right.
- `sitemap.ts` from all static and data-driven routes. `robots.ts` disallows `/_styleguide`.
- JSON-LD: `Organization` (name, url, logo; `sameAs` only from verified social links), `WebSite`, `BreadcrumbList` on nested pages, `Article` on insights, `Service` on solution pages.
- Target terms (use naturally in headings and descriptions, never stuffed): AI data engineering company, data engineering services, AI engineering company, data analytics company, custom software development, enterprise AI solutions, data pipeline development, AI application development.
- Semantic HTML: one `h1` per page, landmarks (`header`, `nav`, `main`, `footer`), sections with `aria-labelledby`.

## Performance budget

- First-load JS on `/` ≤ 90KB gzipped. The hero is the only client component above the fold.
- LCP element is the hero headline text, not an image.
- Fonts: two families, five weights total, preloaded by `next/font`.
- Images: AVIF/WebP via `next/image`, `sizes` set on every image, below-the-fold lazy.
- No third-party scripts at launch. Analytics added later behind consent.
