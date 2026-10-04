import { getIndustries, getIndustry } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getIndustries()).filter((i) => i.hasPage).map((i) => ({ slug: i.slug }));
}
export const alt = "metadatum industry";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const i = await getIndustry((await params).slug);
  return ogImage(i?.line ?? "Industries", i?.name);
}
