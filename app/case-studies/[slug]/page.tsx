import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientName } from "@/components/cards/CaseStudyCard";
import { MetricValue } from "@/components/cards/MetricValue";
import { ArchitectureFlow } from "@/components/diagrams/ArchitectureFlow";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { Link } from "@/components/ui/Link";
import { NodePattern } from "@/components/ui/NodePattern";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Tag } from "@/components/ui/Tag";
import { getCapabilities, getCaseStudies, getCaseStudy, getHome, getIndustries, getPages, getTechnologies } from "@/lib/content";
import { flowNodes, techNames } from "@/lib/content/resolve";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const s = await getCaseStudy((await params).slug);
  if (!s) return {};
  const unverified = /\[/.test(s.title);
  return pageMetadata(
    { title: unverified ? "Case study" : s.title, description: unverified ? "A metadatum case study." : s.summary.slice(0, 155) },
    `/case-studies/${s.slug}`,
    // Template case studies stay out of search until real content replaces them.
    { noindex: unverified },
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-x-(--gutter)">
      <h2 className="text-h3 lg:col-span-4">{title}</h2>
      <div className="text-body-lg lg:col-span-8">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const [study, { caseStudyTemplate: t }, industries, capabilities, technologies, home] = await Promise.all([
    getCaseStudy(slug),
    getPages(),
    getIndustries(),
    getCapabilities(),
    getTechnologies(),
    getHome(),
  ]);
  if (!study) notFound();
  const industry = industries.find((i) => i.slug === study.industry);
  const caps = capabilities.filter((c) => study.capabilities.includes(c.slug));
  const techs = techNames(study.architecture.technologies, technologies);

  return (
    <>
      <PageHero
        title={study.title}
        support={study.summary}
        breadcrumbs={[
          { label: "Case studies", href: "/case-studies" },
          { label: /\[/.test(study.title) ? "Case study" : study.title, href: `/case-studies/${study.slug}` },
        ]}
      >
        <dl className="mt-4 flex flex-wrap gap-x-12 gap-y-4 text-small">
          <div>
            <dt className="text-caption text-muted">{t.client}</dt>
            <dd className="mt-1 font-medium">
              <ClientName study={study} industry={industry} />
            </dd>
          </div>
          {industry && (
            <div>
              <dt className="text-caption text-muted">{t.industry}</dt>
              <dd className="mt-1 font-medium">
                <Link href={`/industries/${industry.slug}`}>{industry.name}</Link>
              </dd>
            </div>
          )}
          {caps.length > 0 && (
            <div>
              <dt className="text-caption text-muted">Capabilities</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {caps.map((c) => (
                  <Tag key={c.slug}>{c.name}</Tag>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </PageHero>

      <Container>
        <div className="relative aspect-[21/9] overflow-hidden rounded-media">
          <NodePattern seed={study.slug} accent="data" />
        </div>
      </Container>

      <Container className="py-(--section-y)">
        <Block title={t.challenge}>
          <PlaceholderText text={study.challenge} />
        </Block>
        <Block title={t.approach}>
          <PlaceholderText text={study.approach} />
        </Block>
        <Block title={t.architecture}>
          {study.architecture.diagram ? (
            <ArchitectureFlow nodes={flowNodes(study.architecture.diagram, technologies)} label={t.architecture} surface="canvas" />
          ) : null}
          {techs.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {techs.map((name) => (
                <li key={name}>
                  <Tag>{name}</Tag>
                </li>
              ))}
            </ul>
          ) : (
            !study.architecture.diagram && <PlaceholderText text="[ARCHITECTURE — diagram nodes and technologies used]" />
          )}
        </Block>
        <Block title={t.implementation}>
          <PlaceholderText text={study.implementation} />
        </Block>
        <Block title={t.outcome}>
          <PlaceholderText text={study.outcome} />
          {study.metrics.length > 0 && (
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              {study.metrics.map((m) => (
                <div key={m.label} className="border-t border-ink pt-4">
                  <dd className="font-display text-h2">
                    <MetricValue metric={m} />
                  </dd>
                  <dt className="mt-2 text-small text-muted">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </Block>
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
