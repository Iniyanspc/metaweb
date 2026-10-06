/**
 * Draft and publish. Unfinished content stays in data/ and content/, but the
 * live site leaves it out:
 *
 * - Collection items (case studies, team members, products, articles) carry a
 *   `published` flag; drafts are filtered out. A section with nothing
 *   published disappears from its page, the menus, the footer and the sitemap.
 * - Single text blocks are held back while they still contain a [PLACEHOLDER].
 *
 * Preview drafts locally with:  SHOW_DRAFTS=1 pnpm dev
 */
export const showDrafts = process.env.SHOW_DRAFTS === "1";

/** True when an item should appear on the site. */
export const isPublished = (item: { published: boolean }) => showDrafts || item.published;

const PLACEHOLDER = /\[[A-Z][^\]]*\]/;

/** True when a piece of text has no unfilled [PLACEHOLDER] (or drafts are being previewed). */
export const isReady = (text: string) => showDrafts || !PLACEHOLDER.test(text);
