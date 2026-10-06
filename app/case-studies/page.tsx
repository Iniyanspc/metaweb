import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getCaseStudies, getHome, getIndustries, getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { caseStudies } = await getPages();
  return pageMetadata(caseStudies.seo, "/case-studies");
}

export default async function CaseStudiesPage() {
  const [{ caseStudies: page }, studies, industries, home] = await Promise.all([getPages(), getCaseStudies(), getIndustries(), getHome()]);
  // Nothing published yet: the section stays off the live site (see lib/publish.ts).
  if (studies.length === 0) notFound();
  const [feature, ...rest] = [...studies].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  const industryOf = (slug: string) => industries.find((i) => i.slug === slug);

  return (
    <>
      <PageHero title={page.title} support={page.support} breadcrumbs={[{ label: "Case studies", href: "/case-studies" }]} />
      <Container className="pb-(--section-y)">
        {feature && <CaseStudyCard study={feature} industry={industryOf(feature.industry)} variant="feature" />}
        {rest.length > 0 && (
          <ul className="mt-(--gutter) grid gap-(--gutter) md:grid-cols-2">
            {rest.map((s) => (
              <li key={s.slug}>
                <CaseStudyCard study={s} industry={industryOf(s.industry)} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-body text-muted">{page.empty}</p>
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
