import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/_styleguide"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

// Written to a file at build time (static export).
export const dynamic = "force-static";
