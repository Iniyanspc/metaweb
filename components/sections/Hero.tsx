import type { HomeContent } from "@/lib/content/types";
import { Parallax } from "@/components/motion/Parallax";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mark } from "@/components/brand/Logo";
import { NetworkGraphCard } from "./NetworkGraphCard";

/**
 * Homepage opening: the mark beside the tagline, the description and actions
 * below, then the office photo with a live knowledge-graph card beside it.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-(--section-y)">
      <Container className="pt-12 md:pt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {/* The mark leads the tagline: data in, intelligence at the centre, business out. */}
          <Reveal variant="scale" className="shrink-0">
            <Mark size={168} title="" className="hidden size-[clamp(7rem,4rem+6vw,10.5rem)] md:block" />
            <Mark size={64} title="" className="md:hidden" />
          </Reveal>
          <div className="min-w-0 flex-1">
            <Reveal delay={120}>
              <h1 id="hero-title" className="text-h1">
                {hero.tagLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={260} className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <p className="max-w-[52ch] text-body-lg text-muted">{hero.support}</p>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button href={hero.cta.primary.href} size="lg">
                  {hero.cta.primary.label}
                </Button>
                {hero.cta.secondary && (
                  <Button href={hero.cta.secondary.href} variant="secondary" size="lg">
                    {hero.cta.secondary.label}
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Photo and graph side by side: the graph never covers the photo. They drift at different speeds. */}
        <div className="mt-12 grid gap-(--gutter) md:mt-16 lg:grid-cols-12 lg:items-stretch">
          <ParallaxPhoto
            name={hero.images.main}
            priority
            speed={50}
            delay={250}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[16/9] lg:col-span-6"
            // Frame low so the people at the table stay in view.
            imageClassName="object-[45%_75%]"
          />
          <Parallax speed={-24} className="lg:col-span-6">
            <Reveal variant="scale" delay={450} className="aspect-[16/9] rounded-media">
              <NetworkGraphCard graph={hero.graph} />
            </Reveal>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
