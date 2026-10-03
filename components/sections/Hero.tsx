import type { HomeContent } from "@/lib/content/types";
import { Parallax } from "@/components/motion/Parallax";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Homepage opening: headline and actions, then a layered photo band. The two
 * photos and the caption card move at different speeds to give the page depth.
 */
export function Hero({ hero, caption }: { hero: HomeContent["hero"]; caption: string[] }) {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-(--section-y)">
      <Container className="pt-12 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-(--gutter)">
          <Reveal className="lg:col-span-8">
            <h1 id="hero-title" className="max-w-[17ch] text-display">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={150} className="flex flex-col gap-8 lg:col-span-4 lg:pb-3">
            <p className="text-body-lg text-muted">{hero.support}</p>
            <div className="flex flex-wrap gap-3">
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

        <div className="relative mt-12 md:mt-16">
          <ParallaxPhoto name={hero.images.main} priority speed={50} delay={250} sizes="(min-width: 1280px) 1280px, 100vw" className="aspect-[4/3] md:aspect-[21/9]" />
          {/* Second layer: a smaller photo that overlaps the band's lower edge and moves faster. */}
          <Parallax speed={-70} className="absolute -bottom-16 right-[4%] hidden w-[30%] md:block">
            <ParallaxPhoto name={hero.images.detail} speed={20} delay={550} sizes="400px" className="aspect-[4/5] shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)] ring-8 ring-canvas" />
          </Parallax>
          {/* Third layer: the three-beat line on a white card. */}
          <Parallax speed={-30} className="absolute -bottom-10 left-[4%] hidden md:block">
            <Reveal delay={700} className="rounded-card bg-canvas px-7 py-6 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.3)]">
              <p className="font-display text-h4 font-medium">
                {caption.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
