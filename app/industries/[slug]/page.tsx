import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon, isIconName } from "@/components/ui/Icon";
import { Node } from "@/components/ui/Node";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getCaseStudies, getHome, getIndustries, getIndustry, getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getIndustries()).filter((i) => i.hasPage).map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const i = await getIndustry((await params).slug);
  if (!i) return {};
  return pageMetadata(i.seo ?? { title: `${i.name} technology`, description: `${i.line} ${i.challenge}`.slice(0, 155) }, `/industries/${i.slug}`);
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const [industry, { industryTemplate: t }, studies, home] = await Promise.all([getIndustry(slug), getPages(), getCaseStudies({ industry: slug }), getHome()]);
  if (!industry?.hasPage) notFound();

  return (
    <>
      <PageHero
        image={industry.image}
        title={industry.name}
        support={industry.line}
        breadcrumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
      >
        {isIconName(industry.icon) && <Icon name={industry.icon} size={32} className="order-first" />}
      </PageHero>

      <Section reveal pillar="business" labelledBy="challenge-title" className="pt-0 md:pt-0">
        <div className="grid gap-6 border-t border-line pt-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <h2 id="challenge-title" className="text-h3 lg:col-span-4">
            {t.challenge}
          </h2>
          <p className="font-display text-h3 lg:col-span-8">{industry.challenge}</p>
        </div>
      </Section>

      <Section reveal pillar="data" tone="mist" labelledBy="problems-title">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-(--gutter)">
          <div>
            <Node pillar="data" size={14} />
            <h2 id="problems-title" className="mt-5 text-h3">
              {t.dataProblems}
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {industry.dataProblems.map((p) => (
                <li key={p} className="py-4 text-body">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Node pillar="ai" size={14} />
            <h2 className="mt-5 text-h3">{t.aiOpportunities}</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {industry.aiOpportunities.map((p) => (
                <li key={p} className="py-4 text-body">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section reveal pillar="business" labelledBy="solutions-title">
        <h2 id="solutions-title" className="text-h2">
          {t.solutions}
        </h2>
        <ul className="mt-10 grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-3">
          {industry.solutions.map((s) => (
            <li key={s} className="flex items-center gap-4 rounded-card border border-line p-6 text-body font-medium">
              <Node pillar="business" size={10} />
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {/* Relevant case studies appear once one is published (BACKLOG.md). */}
      {studies.length > 0 && (
        <Section reveal pillar="business" tone="mist" labelledBy="cases-title">
          <h2 id="cases-title" className="text-h2">
            {t.caseStudies}
          </h2>
          <ul className="mt-10 grid gap-(--gutter) md:grid-cols-2">
            {studies.map((s) => (
              <li key={s.slug}>
                <CaseStudyCard study={s} industry={industry} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <FinalCta {...home.finalCta} />
    </>
  );
}
