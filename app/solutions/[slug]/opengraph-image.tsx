import { getCapabilities, getCapability } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getCapabilities()).filter((c) => c.hasPage).map((c) => ({ slug: c.slug }));
}
export const alt = "metadatum solution";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCapability((await params).slug);
  return ogImage(c?.detail?.headline ?? c?.name ?? "Solutions", c?.name);
}
