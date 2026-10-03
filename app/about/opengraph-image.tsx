import { pages } from "@/data/pages";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = pages.about.seo.title;

export default function Image() {
  return ogImage(pages.about.title, pages.about.seo.title);
}
