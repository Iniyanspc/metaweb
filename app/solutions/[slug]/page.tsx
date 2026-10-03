import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { ArchitectureFlow } from "@/components/diagrams/ArchitectureFlow";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/components/ui/Link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { getCapabilities, getCapability, getCaseStudies, getHome, getIndustries, getPages, getTechnologies } from "@/lib/content";
import { flowNodes, techNames } from "@/lib/content/resolve";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getCapabilities()).filter((c) => c.hasPage).map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const c = await getCapability((await params).slug);
  if (!c) return {};
  return pageMetadata(c.seo ?? { title: c.name, description: c.line }, `/solutions/${c.slug}`);
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const [c, { solutionTemplate: t }, technologies, industries, studies, home] = await Promise.all([
    getCapability(slug),
    getPages(),
    getTechnologies(),
    getIndustries(),
    getCaseStudies({ capability: slug }),
    getHome(),
  ]);
  if (!c?.hasPage) notFound();
  const d = c.detail;
  const techs = techNames(c.technologies, technologies);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.name,
          description: c.seo?.description ?? c.line,
          provider: { "@type": "Organization", name: "metadatum" },
          url: absoluteUrl(`/solutions/${c.slug}`),
        }}
      />
      <PageHero
        title={d?.headline ?? c.name}
        support={d?.support ?? c.line}
        pillar={c.pillar}
        breadcrumbs={[
          { label: "Solutions", href: "/solutions" },
          { label: c.name, href: `/solutions/${c.slug}` },
        ]}
      />

      {d && (
        <Section pillar={c.pillar} labelledBy="build-title" className="pt-0 md:pt-0">
          <SectionHeader id="build-title" title={t.whatWeBuild} />
          <ul className="grid gap-(--gutter) md:grid-cols-2">
            {d.whatWeBuild.map((item) => (
              <li key={item.title} className="rounded-card border border-line p-8">
                <h3 className="text-h4 font-semibold">{item.title}</h3>
                <p className="mt-3 text-body text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {d?.architecture && (
        <Section id="architecture" pillar="bridge" tone="mist" labelledBy="arch-title" className="scroll-mt-(--nav-height)">
          <SectionHeader id="arch-title" title={t.architecture} />
          <ArchitectureFlow nodes={flowNodes(d.architecture, technologies)} label={`${c.name} architecture`} />
        </Section>
      )}

      {d && (
        <Section pillar="business" labelledBy="engage-title">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
            <div className="lg:col-span-7">
              <SectionHeader id="engage-title" title={t.engagements} className="mb-8 md:mb-10" />
              <ul className="divide-y divide-line border-y border-line">
                {d.engagements.map((e) => (
                  <li key={e.title} className="grid gap-2 py-6 md:grid-cols-[14rem_1fr] md:gap-x-(--gutter)">
                    <h3 className="text-h4 font-semibold">{e.title}</h3>
                    <p className="text-body text-muted">{e.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            {techs.length > 0 && (
              <div className="lg:col-span-4 lg:col-start-9">
                <h2 className="text-h3">{t.technologies}</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {techs.map((name) => (
                    <li key={name}>
                      <Tag>{name}</Tag>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-caption text-muted">
                  <Link href="/technology" underline="always">
                    See all technologies
                  </Link>
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section pillar="business" tone="mist" labelledBy="related-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-4">
            <h2 className="text-h3">{t.industries}</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {industries
                .filter((i) => i.hasPage)
                .map((i) => (
                  <li key={i.slug}>
                    <Link href={`/industries/${i.slug}`} className="text-body">
                      {i.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="related-title" className="text-h3">
              {t.caseStudies}
            </h2>
            {studies.length ? (
              <ul className="mt-6 grid gap-(--gutter)">
                {studies.slice(0, 2).map((s) => (
                  <li key={s.slug}>
                    <CaseStudyCard study={s} industry={industries.find((i) => i.slug === s.industry)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-body text-muted">{t.noCaseStudies}</p>
            )}
          </div>
        </div>
      </Section>

      <FinalCta {...home.finalCta} />
    </>
  );
}
