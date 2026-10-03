import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { ArchitectureFlow } from "@/components/diagrams/ArchitectureFlow";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { CapabilityStack } from "@/components/sections/CapabilityStack";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { NetworkGraph } from "@/components/sections/NetworkGraph";
import { Button } from "@/components/ui/Button";
import { LogoSlot } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { getCapabilities, getCaseStudies, getHome, getIndustries, getPages, getSite, getTechnologies } from "@/lib/content";
import type { Pillar } from "@/lib/content/types";
import { flowNodes } from "@/lib/content/resolve";

export default async function Home() {
  const [home, site, capabilities, industries, caseStudies, technologies, pages] = await Promise.all([
    getHome(),
    getSite(),
    getCapabilities(),
    getIndustries(),
    getCaseStudies(),
    getTechnologies(),
    getPages(),
  ]);
  const pillarLabels = Object.fromEntries(pages.solutions.pillars.map((p) => [p.pillar, p.heading])) as Record<Pillar, string>;
  pillarLabels.bridge ??= "Data and intelligence";
  const [featuredStudy] = [...caseStudies].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

  return (
    <>
      <Hero hero={home.hero} />

      {/* The knowledge graph, on its own in open white space */}
      <section aria-label={home.hero.graph.caption} className="pb-(--section-y)">
        <div className="mx-auto w-full max-w-[calc(64rem+2*var(--page-margin))] px-(--page-margin)">
          <Reveal variant="fade">
            <NetworkGraph graph={home.hero.graph} />
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section aria-labelledby="trust-title" className="border-y border-line py-12 md:py-16">
        <div className="mx-auto w-full max-w-[calc(var(--container-site)+2*var(--page-margin))] px-(--page-margin)">
          <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            <h2 id="trust-title" className="shrink-0 text-small font-medium text-muted lg:max-w-[16ch]">
              {home.trust.line}
            </h2>
            <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {site.clientLogos.map((logo, i) => (
                <li key={i}>
                  {logo.verified ? (
                    // eslint-disable-next-line @next/next/no-img-element -- swap to next/image once real logos exist
                    <img src={logo.value.src} alt={logo.value.name} width={160} height={64} className="h-14 w-full object-contain" />
                  ) : (
                    <LogoSlot label={logo.placeholder} className="h-14 w-full" />
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* The problem */}
      <Section pillar="data" tone="mist" labelledBy="problem-title">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <ParallaxPhoto name={home.problem.image} speed={60} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] lg:col-span-5" />
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2 id="problem-title" className="text-h2">
                {home.problem.headline}
              </h2>
            </Reveal>
            <ul className="mt-10 flex flex-col gap-5">
              {home.problem.lines.map((line, i) => (
                <Reveal as="li" key={line} delay={100 + i * 90} className="flex items-baseline gap-4 text-body-lg">
                  <span aria-hidden className="size-2 shrink-0 translate-y-[-3px] rounded-full bg-pink" />
                  {line}
                </Reveal>
              ))}
            </ul>
            <Reveal delay={420}>
              <p className="mt-12 border-t border-line pt-8 font-display text-h3">{home.problem.turn}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Capabilities */}
      <Section id="capabilities" pillar="bridge" labelledBy="capabilities-title" className="scroll-mt-(--nav-height)">
        <Reveal>
          <SectionHeader id="capabilities-title" title={home.capabilities.headline} support={home.capabilities.support} />
        </Reveal>
        <CapabilityStack capabilities={capabilities} pillarLabels={pillarLabels} />
      </Section>

      {/* The foundation is data — kept exactly as approved */}
      <Section pillar="data" tone="mist" labelledBy="foundation-title">
        <SectionHeader id="foundation-title" pillar="data" title={home.foundation.headline} support={home.foundation.support} />
        <ArchitectureFlow nodes={flowNodes(home.foundation.flow, technologies)} label="From sources to business outcomes" />
        <p className="mt-12 font-display text-h2 lg:mt-4">
          {home.foundation.closing.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Section>

      {/* AI — the only plum section */}
      <Section pillar="ai" tone="plum" labelledBy="ai-title">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 id="ai-title" className="max-w-[18ch] text-h2">
                {home.ai.headline}
              </h2>
              <p className="mt-6 text-body-lg text-canvas/80">{home.ai.support}</p>
            </Reveal>
            <Reveal delay={150}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {home.ai.services.map((s) => (
                  <li key={s}>
                    <Tag tone="plum">{s}</Tag>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href={home.ai.cta.href} tone="plum">
                  {home.ai.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>
          <ParallaxPhoto name={home.ai.image} speed={50} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] lg:col-span-5 lg:col-start-8" />
        </div>
      </Section>

      {/* Process: the left column stays put while the steps scroll past */}
      <Section pillar="business" labelledBy="process-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 id="process-title" className="text-h2">
                  {home.process.headline}
                </h2>
                <p className="mt-5 text-body-lg text-muted">{home.process.support}</p>
              </Reveal>
              <ParallaxPhoto name={home.process.image} speed={30} sizes="(min-width: 1024px) 40vw, 100vw" className="mt-10 hidden aspect-[4/3] lg:block" />
            </div>
          </div>
          <ol className="flex flex-col lg:col-span-6 lg:col-start-7">
            {home.process.steps.map((step, i) => (
              <Reveal as="li" key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-8 last:border-b">
                <span className="font-display text-h3 text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-h4 font-semibold">{step.title}</span>
                  <span className="mt-2 block text-body text-muted">{step.body}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Industries */}
      <Section pillar="business" tone="mist" labelledBy="industries-title">
        <Reveal>
          <SectionHeader
            id="industries-title"
            title={home.industries.headline}
            support={home.industries.support}
            action={
              <Button href={home.industries.cta.href} variant="secondary">
                {home.industries.cta.label}
              </Button>
            }
          />
        </Reveal>
        <ul className="grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {industries.map((industry, i) => (
            <li key={industry.slug} className={i === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : undefined}>
              <IndustryCard industry={industry} tall={i === 0} delay={(i % 3) * 90} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Case studies */}
      {featuredStudy && (
        <Section pillar="business" labelledBy="cases-title">
          <Reveal>
            <SectionHeader
              id="cases-title"
              title={home.caseStudies.headline}
              support={home.caseStudies.support}
              action={
                <Button href={home.caseStudies.cta.href} variant="secondary">
                  {home.caseStudies.cta.label}
                </Button>
              }
            />
          </Reveal>
          <Reveal variant="scale">
            <CaseStudyCard study={featuredStudy} industry={industries.find((i) => i.slug === featuredStudy.industry)} variant="feature" />
          </Reveal>
        </Section>
      )}

      <FinalCta {...home.finalCta} />
    </>
  );
}
