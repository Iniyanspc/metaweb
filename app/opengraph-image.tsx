import { home } from "@/data/home";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "metadatum — AI and data engineering company";

export default function Image() {
  return ogImage(home.hero.tagLines.join("\n"));
}
