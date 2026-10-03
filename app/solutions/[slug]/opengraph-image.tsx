import { getCapability } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "metadatum solution";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCapability((await params).slug);
  return ogImage(c?.detail?.headline ?? c?.name ?? "Solutions", c?.name);
}
