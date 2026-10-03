import type { HomeContent } from "@/lib/content/types";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mark } from "@/components/brand/Logo";

/**
 * Homepage opening: the tagline with the mark on its right, the description and actions
 * below, then the office photo drifting gently as the page scrolls.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-(--section-y)">
      <Container className="pt-12 md:pt-20">
        {/* Tagline with the mark on its right. From md up both are sized from one value,
            --tag, which scales with the row's width so the tagline holds two lines and the
            mark is exactly two line-heights tall. */}
        <div className="@container">
          <div className="flex items-start gap-5 md:items-center md:gap-10 md:[--tag:clamp(2rem,5.1cqi,4.25rem)]">
            <Reveal className="min-w-0 flex-1">
              <h1 id="hero-title" className="text-h1 md:text-(length:--tag) md:leading-[1.05]">
                {hero.tagLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal variant="scale" delay={120} className="shrink-0">
              <Mark size={56} title="" className="md:size-[calc(var(--tag)*2.1)]" />
            </Reveal>
          </div>
        </div>
        <Reveal delay={240} className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <p className="max-w-[56ch] text-body-lg text-muted">{hero.support}</p>
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

        <div className="mt-12 md:mt-16">
          <ParallaxPhoto
            name={hero.images.main}
            priority
            speed={50}
            delay={250}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
            // Frame low so the people at the table stay in view.
            imageClassName="object-[45%_75%]"
          />
        </div>
      </Container>
    </section>
  );
}
