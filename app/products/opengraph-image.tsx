import { pages } from "@/data/pages";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";
export const alt = pages.products.seo.title;

export default function Image() {
  return ogImage(pages.products.title, pages.products.seo.title);
}
