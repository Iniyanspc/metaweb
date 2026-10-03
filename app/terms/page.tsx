import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { legal } = await getPages();
  return pageMetadata(legal.terms.seo, "/terms", { noindex: true }); // noindex until real
}

export default async function TermsPage() {
  const { legal } = await getPages();
  return <PageHero title={legal.terms.title} support={legal.terms.support} breadcrumbs={[{ label: legal.terms.title, href: "/terms" }]} className="pb-(--section-y)" />;
}
