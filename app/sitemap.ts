import type { MetadataRoute } from "next";
import { getCapabilities, getCaseStudies, getIndustries, getInsights } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [capabilities, industries, studies, insights] = await Promise.all([getCapabilities(), getIndustries(), getCaseStudies(), getInsights()]);
  const staticRoutes = ["/", "/solutions", "/industries", "/products", "/case-studies", "/about", "/team", "/technology", "/insights", "/careers", "/contact"];
  return [
    ...staticRoutes.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...capabilities.filter((c) => c.hasPage).map((c) => ({ url: absoluteUrl(`/solutions/${c.slug}`), priority: 0.8 })),
    ...industries.filter((i) => i.hasPage).map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), priority: 0.7 })),
    // Template case studies and sample articles stay out until they're real.
    ...studies.filter((s) => !s.title.includes("[")).map((s) => ({ url: absoluteUrl(`/case-studies/${s.slug}`), priority: 0.6 })),
    ...insights.filter((i) => !i.sample).map((i) => ({ url: absoluteUrl(`/insights/${i.slug}`), lastModified: i.publishedAt, priority: 0.5 })),
  ];
}
