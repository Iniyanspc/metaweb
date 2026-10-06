import type { MetadataRoute } from "next";
import { getCapabilities, getCaseStudies, getHiddenRoutes, getIndustries, getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [capabilities, industries, studies, insights, hidden] = await Promise.all([getCapabilities(), getIndustries(), getCaseStudies(), getInsights(), getHiddenRoutes()]);
  const staticRoutes = ["/", "/solutions", "/industries", "/products", "/case-studies", "/about", "/team", "/technology", "/insights", "/careers", "/contact"];
  return [
    ...staticRoutes.filter((p) => !hidden.has(p)).map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...capabilities.filter((c) => c.hasPage).map((c) => ({ url: absoluteUrl(`/solutions/${c.slug}`), priority: 0.8 })),
    ...industries.filter((i) => i.hasPage).map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), priority: 0.7 })),
    // Only published case studies and articles (the getters already filter drafts).
    ...studies.map((s) => ({ url: absoluteUrl(`/case-studies/${s.slug}`), priority: 0.6 })),
    ...insights.map((i) => ({ url: absoluteUrl(`/insights/${i.slug}`), lastModified: i.publishedAt, priority: 0.5 })),
  ];
}

// Written to a file at build time (static export).
export const dynamic = "force-static";
