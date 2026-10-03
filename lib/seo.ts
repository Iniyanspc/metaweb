import type { Metadata } from "next";
import { site } from "@/data/site";
import type { SeoFields } from "./content/types";

/** Canonical origin: the verified site URL, else NEXT_PUBLIC_SITE_URL, else localhost. */
export const siteUrl = (site.url.verified ? site.url.value : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")).replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;

/** Per-page metadata: title, description, canonical, Open Graph and Twitter. */
export function pageMetadata(
  seo: SeoFields,
  path: string,
  opts: { noindex?: boolean; type?: "website" | "article" } = {},
): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${seo.title} — metadatum`,
      description: seo.description,
      url: path,
      siteName: "metadatum",
      type: opts.type ?? "website",
    },
    twitter: { card: "summary_large_image", title: `${seo.title} — metadatum`, description: seo.description },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
