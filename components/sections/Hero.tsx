import type { HomeContent } from "@/lib/content/types";
import { Parallax } from "@/components/motion/Parallax";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mark } from "@/components/brand/Logo";
import { AgentStory } from "./AgentStory";

/**
 * Homepage opening: the two-line tagline with the mark on its right, the
 * description on a base line under both, actions, then the office photo with
 * a picture-in-picture card telling the agent story.
 */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const split = hero.support.indexOf(". ");
  const lead = split === -1 ? hero.support : hero.support.slice(0, split + 1);
  const rest = split === -1 ? "" : hero.support.slice(split + 2);
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pb-(--section-y)">
      <Container className="pt-12 md:pt-20">
        {/* Tagline (two lines) with the mark on its right, then the description as one
            line underneath both, like a base. From md up the tagline, mark and base line
            all scale from the row's width (container query units) so they stay in step. */}
        <div className="@container">
          <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between md:gap-10 md:[--tag:clamp(2rem,5.15cqi,4.5rem)]">
            <Reveal className="min-w-0">
              <h1 id="hero-title" className="text-h2 text-pretty md:text-(length:--tag) md:leading-[1.06] md:tracking-[-0.03em]">
                {hero.tagLines.map((line) => (
                  <span key={line} className="block md:whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal variant="scale" delay={150} className="shrink-0">
              <Mark size={72} title="" className="md:size-[calc(var(--tag)*2.4)]" />
            </Reveal>
          </div>
          <Reveal delay={260}>
            <div className="mt-8 border-t border-line pt-6">
              <p className="max-w-[72ch] text-body-lg text-muted">
                {/* The first sentence is the lead, set in ink. */}
                <span className="text-ink">{lead}</span> {rest}
              </p>
            </div>
          </Reveal>
          <Reveal delay={360} className="mt-8 flex flex-wrap gap-3 md:justify-end">
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

        <div className="relative mt-12 md:mt-16 md:mb-20">
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
          {/* Picture in picture: the agent story in a 16:9 card, overlapping the photo's lower
              right (clear of the people) and drifting faster than the photo. */}
          <Parallax speed={-70} className="absolute right-[2%] -bottom-20 hidden w-[46%] min-w-80 md:block xl:w-[35%]">
            <Reveal variant="scale" delay={550} className="aspect-[16/9] rounded-media shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)] ring-8 ring-canvas">
              <AgentStory story={hero.agent} />
            </Reveal>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
