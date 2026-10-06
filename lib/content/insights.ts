import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { showDrafts } from "@/lib/publish";
import type { Insight, InsightCategory } from "./types";

const DIR = path.join(process.cwd(), "content/insights");
const WORDS_PER_MINUTE = 230;

export const INSIGHT_CATEGORIES = [
  "Data engineering",
  "AI",
  "Data architecture",
  "Business intelligence",
  "Digital transformation",
  "Industry insights",
  "Engineering",
  "Product development",
] as const satisfies readonly InsightCategory[];

const frontmatter = z.object({
  title: z.string(),
  excerpt: z.string(),
  category: z.enum(INSIGHT_CATEGORIES),
  author: z.string(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  featured: z.boolean().optional(),
  sample: z.boolean().optional(),
  published: z.boolean().optional(),
  image: z.string().optional(),
});

export interface InsightFile {
  meta: Insight;
  body: string;
}

/** True when an article belongs on the live site. */
export const isInsightLive = (meta: { sample?: boolean; published?: boolean }) => showDrafts || (!meta.sample && meta.published !== false);

/**
 * Articles in content/insights, newest first. Frontmatter is validated.
 * Drafts and samples are left out unless `includeSamples` is set (static export
 * still needs their routes; the pages themselves return not found).
 */
export async function readInsights({ includeSamples = false } = {}): Promise<InsightFile[]> {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  const all = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = frontmatter.safeParse(data);
      if (!parsed.success) throw new Error(`Invalid frontmatter in content/insights/${file}: ${parsed.error.message}`);
      const words = content.split(/\s+/).filter(Boolean).length;
      const meta: Insight = {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ""),
        readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      };
      return { meta, body: content };
    }),
  );
  return all
    .filter((f) => includeSamples || isInsightLive(f.meta))
    .sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt));
}
