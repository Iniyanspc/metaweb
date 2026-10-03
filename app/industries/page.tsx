import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getHome, getIndustries, getOtherIndustriesLine, getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { industries } = await getPages();
  return pageMetadata(industries.seo, "/industries");
}

export default async function IndustriesPage() {
  const [{ industries: page }, industries, otherLine, home] = await Promise.all([getPages(), getIndustries(), getOtherIndustriesLine(), getHome()]);
  return (
    <>
      <PageHero image={page.image} title={page.title} support={page.support} breadcrumbs={[{ label: "Industries", href: "/industries" }]} />
      <Container className="pb-(--section-y)">
        <ul className="grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <li key={industry.slug} id={industry.slug} className="scroll-mt-24">
              <IndustryCard industry={industry} delay={(i % 3) * 90} />
            </li>
          ))}
        </ul>
        <section aria-labelledby="other-title" className="mt-16 grid gap-6 rounded-card bg-mist p-8 md:grid-cols-12 md:items-center md:gap-x-(--gutter) md:p-12">
          <div className="md:col-span-8">
            <h2 id="other-title" className="text-h3">
              {page.otherHeading}
            </h2>
            <p className="mt-3 text-body text-muted">{otherLine}</p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href={page.otherCta.href} variant="secondary">
              {page.otherCta.label}
            </Button>
          </div>
        </section>
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
