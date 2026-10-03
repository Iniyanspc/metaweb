import { getInsight } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "metadatum insight";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const file = await getInsight((await params).slug);
  return ogImage(file?.meta.title ?? "Insights", file?.meta.category);
}
