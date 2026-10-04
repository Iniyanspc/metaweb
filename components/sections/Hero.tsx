import type { HomeContent } from "@/lib/content/types";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mark } from "@/components/brand/Logo";

/**
 * Homepage opening: a split hero (tagline, description and actions on the left,
 * the mark as the visual on the right), then the office photo drifting gently.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-(--section-y)">
      <Container className="pt-12 md:pt-20">
        {/* Split hero: text column on the left sharing one edge, the mark as the visual on the right. */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 id="hero-title" className="text-[clamp(2.25rem,1.4rem+3.2vw,3.75rem)] leading-[1.06] tracking-[-0.03em] text-balance">
                {hero.tagLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[46ch] text-body-lg text-muted">{hero.support}</p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap gap-3">
              <Button href={hero.cta.primary.href} size="lg">
                {hero.cta.primary.label}
              </Button>
              {hero.cta.secondary && (
                <Button href={hero.cta.secondary.href} variant="secondary" size="lg">
                  {hero.cta.secondary.label}
                </Button>
              )}
            </Reveal>
          </div>
          <Reveal variant="scale" delay={180} className="order-first lg:order-none lg:col-span-5 lg:flex lg:justify-center">
            <span className="relative inline-flex items-center justify-center">
              <Mark size={96} title="" className="relative size-24 lg:size-[clamp(14rem,22vw,19rem)]" />
            </span>
          </Reveal>
        </div>

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
