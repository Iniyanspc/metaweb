import type { Link as LinkType } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

/** Centred closing call to action. The mark's soma at small scale sits above the headline. */
export function FinalCta({
  headline,
  support,
  cta,
  axon,
  id = "final-cta",
}: {
  headline: string[];
  support: string;
  cta: LinkType;
  axon?: boolean | "end";
  id?: string;
}) {
  return (
    <Section pillar="bridge" axon={axon} labelledBy={`${id}-title`}>
      <div className="flex flex-col items-center text-center">
        <span aria-hidden className="size-12 rounded-full bg-soma" />
        <h2 id={`${id}-title`} className="mt-8 text-h1">
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-muted">{support}</p>
        <div className="mt-10">
          <Button href={cta.href} size="lg">
            {cta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
