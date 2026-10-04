import { getInsight, getInsightSlugs } from "@/lib/content";
import { OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getInsightSlugs()).map((slug) => ({ slug }));
}
export const alt = "metadatum insight";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const file = await getInsight((await params).slug);
  return ogImage(file?.meta.title ?? "Insights", file?.meta.category);
}
