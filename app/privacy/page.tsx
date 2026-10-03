import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { legal } = await getPages();
  return pageMetadata(legal.privacy.seo, "/privacy", { noindex: true }); // noindex until real
}

export default async function PrivacyPage() {
  const { legal } = await getPages();
  return <PageHero title={legal.privacy.title} support={legal.privacy.support} breadcrumbs={[{ label: legal.privacy.title, href: "/privacy" }]} className="pb-(--section-y)" />;
}
