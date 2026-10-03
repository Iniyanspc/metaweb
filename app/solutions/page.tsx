import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Link } from "@/components/ui/Link";
import { Node } from "@/components/ui/Node";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getCapabilities, getHome, getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { solutions } = await getPages();
  return pageMetadata(solutions.seo, "/solutions");
}

export default async function SolutionsPage() {
  const [{ solutions }, capabilities, home] = await Promise.all([getPages(), getCapabilities(), getHome()]);
  return (
    <>
      <PageHero image={solutions.image} title={solutions.title} titleLines={solutions.titleLines} support={solutions.support} breadcrumbs={[{ label: "Solutions", href: "/solutions" }]} />
      {solutions.pillars.map((pillar, pi) => (
        <Section reveal key={pillar.heading} pillar={pillar.pillar} tone={pi % 2 === 0 ? "mist" : "canvas"} labelledBy={`pillar-${pillar.pillar}`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
            <header className="flex flex-col gap-5 lg:col-span-4">
              <Node pillar={pillar.pillar} size={14} />
              <h2 id={`pillar-${pillar.pillar}`} className="text-h2">
                {pillar.heading}
              </h2>
              <p className="text-body-lg text-muted">{pillar.line}</p>
            </header>
            <ul className="flex flex-col divide-y divide-line border-y border-line lg:col-span-8">
              {pillar.capabilities.map((slug) => {
                const c = capabilities.find((cap) => cap.slug === slug);
                if (!c) return null;
                return (
                  <li key={c.slug} id={c.slug} className="grid scroll-mt-24 items-center gap-6 py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
                    <ParallaxPhoto name={c.image ?? ""} speed={16} sizes="(min-width: 640px) 192px, 100vw" className="aspect-[4/3]" />
                    <div>
                      <h3 className="text-h3">{c.name}</h3>
                      <p className="mt-2 text-body text-muted">{c.line}</p>
                      <p className="mt-4 text-small font-medium">
                        <Link href={c.cta.href} underline="always">
                          {c.cta.label}
                        </Link>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>
      ))}
      <FinalCta {...home.finalCta} />
    </>
  );
}
