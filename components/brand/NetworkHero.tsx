import type { HomeContent } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { NetworkDiagram } from "./NetworkDiagram";

/* Runs before first paint: play the load sequence on the first view of the
   session only, and never when the visitor prefers reduced motion. */
const PLAY_ONCE = `(function(){try{var r=document.getElementById("network-hero");if(!r||sessionStorage.getItem("md-hero")||matchMedia("(prefers-reduced-motion: reduce)").matches)return;sessionStorage.setItem("md-hero","1");r.setAttribute("data-play","")}catch(e){}})()`;

export function NetworkHero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <Section pillar="bridge" axon="start" labelledBy="hero-title" className="pt-10 pb-(--section-y) lg:pt-16">
      <div className="grid items-center gap-y-8 lg:grid-cols-11 lg:gap-x-(--gutter)">
        <div className="w-[280px] lg:col-span-6 lg:col-start-6 lg:row-start-1 lg:w-auto lg:pl-[8%]">
          <NetworkDiagram description={hero.diagramDescription} hint="Tap a node to name it." />
        </div>
        <script dangerouslySetInnerHTML={{ __html: PLAY_ONCE }} />
        <div className="relative z-10 lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <h1 id="hero-title" className="max-w-[14ch] text-display">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-[44ch] text-body-lg text-muted lg:mt-8">{hero.support}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10">
            <Button href={hero.cta.primary.href} size="lg">
              {hero.cta.primary.label}
            </Button>
            {hero.cta.secondary && (
              <Button href={hero.cta.secondary.href} variant="secondary" size="lg">
                {hero.cta.secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
