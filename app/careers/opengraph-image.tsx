import { pages } from "@/data/pages";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = pages.careers.seo.title;

export default function Image() {
  return ogImage(pages.careers.title, pages.careers.seo.title);
}
