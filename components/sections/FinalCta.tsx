import type { Link as LinkType } from "@/lib/content/types";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";

/** Centred closing call to action over a slow-moving photo with a plum veil. */
export function FinalCta({
  headline,
  support,
  cta,
  id = "final-cta",
  image = "office-hallway",
}: {
  headline: string[];
  support: string;
  cta: LinkType;
  id?: string;
  image?: string;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="relative isolate overflow-hidden bg-plum text-canvas">
      <Parallax speed={-60} className="absolute inset-x-0 -top-[15%] -bottom-[15%] -z-10">
        <Photo name={image} alt="" sizes="100vw" />
      </Parallax>
      <span aria-hidden className="absolute inset-0 -z-10 bg-plum/85" />
      <Container className="py-(--section-y)">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id={`${id}-title`} className="text-h1">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-canvas/80">{support}</p>
          <div className="mt-10">
            <Button href={cta.href} tone="plum" size="lg">
              {cta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
