import { pages } from "@/data/pages";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = pages.caseStudies.seo.title;

export default function Image() {
  return ogImage(pages.caseStudies.title, pages.caseStudies.seo.title);
}
