import { NetworkHero } from "@/components/brand/NetworkHero";
import { CapabilityCard } from "@/components/cards/CapabilityCard";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { InsightCard } from "@/components/cards/InsightCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { AiFlow } from "@/components/diagrams/AiFlow";
import { ArchitectureFlow } from "@/components/diagrams/ArchitectureFlow";
import { ProblemNetwork } from "@/components/diagrams/ProblemNetwork";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { IndustryRows } from "@/components/sections/IndustryRows";
import { TechTabs } from "@/components/sections/TechTabs";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { LogoSlot } from "@/components/ui/Placeholder";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getCapabilities,
  getCaseStudies,
  getHome,
  getIndustries,
  getInsights,
  getOtherIndustriesLine,
  getProducts,
  getSite,
  getTeam,
  getTechnologies,
} from "@/lib/content";
import { flowNodes, groupTechnologies } from "@/lib/content/resolve";

export default async function Home() {
  const [home, site, capabilities, industries, otherLine, products, caseStudies, team, technologies, insights] = await Promise.all([
    getHome(),
    getSite(),
    getCapabilities(),
    getIndustries(),
    getOtherIndustriesLine(),
    getProducts(),
    getCaseStudies(),
    getTeam(),
    getTechnologies(),
    getInsights(),
  ]);

  const featured = capabilities.filter((c) => c.featured);
  const rest = capabilities.filter((c) => !c.featured);
  const [featuredStudy, ...otherStudies] = [...caseStudies].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  const leadership = team.filter((m) => m.group === "Leadership").slice(0, 4);
  const realProducts = products.filter((p) => p.name.verified);

  return (
    <>
      <NetworkHero hero={home.hero} />

      {/* 2 — Trust strip */}
      <Section pillar="business" axon labelledBy="trust-title" className="py-16 md:py-20">
        <h2 id="trust-title" className="text-h4 font-semibold">
          {home.trust.line}
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {site.clientLogos.map((logo, i) => (
            <li key={i}>
              {logo.verified ? (
                // eslint-disable-next-line @next/next/no-img-element -- swap to next/image once real logos exist
                <img src={logo.value.src} alt={logo.value.name} width={160} height={64} className="h-16 w-40 object-contain" />
              ) : (
                <LogoSlot label={logo.placeholder} className="w-full" />
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-small text-muted">
          <span className="sr-only">Industries we serve: </span>
          {site.industriesServed.join(", ")}
        </p>
      </Section>

      {/* 3 — The problem */}
      <Section pillar="data" axon labelledBy="problem-title">
        <div className="grid items-center gap-12 lg:grid-cols-11 lg:gap-x-(--gutter)">
          <div className="lg:col-span-6">
            <SectionHeader id="problem-title" pillar="data" axon title={home.problem.headline} className="mb-10 md:mb-10" />
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {home.problem.lines.map((line) => (
                <li key={line} className="py-4 text-body-lg">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-8">
            <ProblemNetwork />
            <div>
              <p className="font-display text-h3">{home.problem.turn}</p>
              <p className="mt-3 text-body text-muted">{home.problem.support}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4 — Capabilities: two wide (data and AI engineering), four narrow */}
      <Section id="capabilities" pillar="bridge" axon labelledBy="capabilities-title" className="scroll-mt-(--nav-height)">
        <SectionHeader id="capabilities-title" pillar="bridge" axon title={home.capabilities.headline} />
        <ul className="grid gap-(--gutter) md:grid-cols-2">
          {featured.map((c) => (
            <li key={c.slug}>
              <CapabilityCard capability={c} wide />
            </li>
          ))}
        </ul>
        <ul className="mt-(--gutter) grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((c) => (
            <li key={c.slug}>
              <CapabilityCard capability={c} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 5 — The foundation is data */}
      <Section pillar="data" tone="mist" axon labelledBy="foundation-title">
        <SectionHeader id="foundation-title" pillar="data" axon title={home.foundation.headline} support={home.foundation.support} />
        <ArchitectureFlow nodes={flowNodes(home.foundation.flow, technologies)} label="From sources to business outcomes" />
        <p className="mt-12 font-display text-h2 lg:mt-4">
          {home.foundation.closing.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Section>

      {/* 6 — AI on data you can trust (the only plum section) */}
      <Section pillar="ai" tone="plum" axon labelledBy="ai-title">
        <SectionHeader id="ai-title" pillar="ai" axon onDark title={home.ai.headline} support={home.ai.support} />
        <AiFlow steps={home.ai.flow} label="From enterprise data to business actions" />
        <div className="mt-16 grid gap-10 border-t border-canvas/15 pt-12 lg:grid-cols-11 lg:gap-x-(--gutter)">
          <ul className="grid gap-x-(--gutter) gap-y-3 sm:grid-cols-2 lg:col-span-7">
            {home.ai.services.map((s) => (
              <li key={s} className="flex items-baseline gap-3 text-body">
                <span aria-hidden className="size-2 shrink-0 translate-y-[-2px] rounded-full bg-lilac" />
                {s}
              </li>
            ))}
          </ul>
          <div className="lg:col-span-3 lg:col-start-9 lg:justify-self-end">
            <Button href={home.ai.cta.href} tone="plum">
              {home.ai.cta.label}
            </Button>
          </div>
        </div>
      </Section>

      {/* 7 — From business problem to working product */}
      <Section pillar="business" axon labelledBy="process-title">
        <SectionHeader id="process-title" pillar="business" axon title={home.process.headline} support={home.process.support} />
        <ProcessTimeline steps={home.process.steps} label="How we deliver" />
      </Section>

      {/* 8 — Industries */}
      <Section pillar="business" axon labelledBy="industries-title">
        <SectionHeader
          id="industries-title"
          pillar="business"
          axon
          title={home.industries.headline}
          support={home.industries.support}
          action={<Button href={home.industries.cta.href} variant="secondary">{home.industries.cta.label}</Button>}
        />
        <IndustryRows industries={industries} />
        <p className="mt-8 max-w-[60ch] text-body text-muted">
          {otherLine}{" "}
          <Link href={home.industries.otherCta.href} underline="always" className="text-ink">
            {home.industries.otherCta.label}
          </Link>
        </p>
      </Section>

      {/* 9 — Products */}
      <Section pillar="bridge" axon labelledBy="products-title">
        <SectionHeader id="products-title" pillar="bridge" axon title={home.products.headline} support={home.products.support} />
        {realProducts.length === 0 && (
          <p className="mb-10 text-body">
            <PlaceholderText text={home.products.empty} />
          </p>
        )}
        <ul className="grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 10 — Case studies: one featured, compact list */}
      <Section pillar="business" tone="mist" axon labelledBy="cases-title">
        <SectionHeader
          id="cases-title"
          pillar="business"
          axon
          title={home.caseStudies.headline}
          support={home.caseStudies.support}
          action={<Button href={home.caseStudies.cta.href} variant="secondary">{home.caseStudies.cta.label}</Button>}
        />
        {featuredStudy && <CaseStudyCard study={featuredStudy} industry={industries.find((i) => i.slug === featuredStudy.industry)} variant="feature" />}
        {otherStudies.length > 0 ? (
          <ul className="mt-(--gutter) grid gap-(--gutter) md:grid-cols-2">
            {otherStudies.slice(0, 2).map((s) => (
              <li key={s.slug}>
                <CaseStudyCard study={s} industry={industries.find((i) => i.slug === s.industry)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-small text-muted">{home.caseStudies.more}</p>
        )}
      </Section>

      {/* 11 — Technology */}
      <Section pillar="data" axon labelledBy="tech-title">
        <SectionHeader
          id="tech-title"
          pillar="data"
          axon
          title={home.technology.headline}
          support={home.technology.support}
          action={<Button href={home.technology.cta.href} variant="secondary">{home.technology.cta.label}</Button>}
        />
        <TechTabs groups={groupTechnologies(technologies)} label="Technology categories" />
        <p className="mt-10 text-caption text-muted">{home.technology.note}</p>
      </Section>

      {/* 12 — Team */}
      <Section pillar="business" axon labelledBy="team-title">
        <SectionHeader
          id="team-title"
          pillar="business"
          axon
          title={home.team.headline}
          support={home.team.support}
          action={<Button href={home.team.cta.href} variant="secondary">{home.team.cta.label}</Button>}
        />
        <ul className="grid grid-cols-2 gap-(--gutter) gap-y-10 lg:grid-cols-4">
          {leadership.map((m) => (
            <li key={m.id}>
              <TeamMemberCard member={m} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 13 — Insights */}
      <Section pillar="ai" axon labelledBy="insights-title">
        <SectionHeader
          id="insights-title"
          pillar="ai"
          axon
          title={home.insights.headline}
          action={<Button href={home.insights.cta.href} variant="secondary">{home.insights.cta.label}</Button>}
        />
        {insights.length === 0 ? (
          <p className="text-body text-muted">{home.insights.empty}</p>
        ) : (
          <ul className="grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <InsightCard insight={a} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* 14 — Final CTA */}
      <FinalCta {...home.finalCta} axon="end" />
    </>
  );
}
