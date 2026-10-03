import NextLink from "next/link";
import type { Capability } from "@/lib/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Node } from "@/components/ui/Node";
import { Photo } from "@/components/ui/Photo";

/** Photo, name, one line. The whole card is the link; the photo eases in on hover. */
export function CapabilityCard({ capability, delay = 0 }: { capability: Capability; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <NextLink
        href={capability.cta.href}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-canvas transition-colors duration-200 hover:border-ink focus-visible:shadow-(--focus-ring)"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Photo
            name={capability.image}
            alt=""
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <span className="flex items-center gap-3">
            <Node pillar={capability.pillar} size={10} />
            <span className="text-h4 font-semibold">{capability.name}</span>
          </span>
          <span className="mt-3 text-small text-muted">{capability.line}</span>
          <span className="mt-auto pt-6 text-small font-medium">
            <span className="link-underline group-hover:bg-size-[100%_1px]">{capability.cta.label}</span>
          </span>
        </div>
      </NextLink>
    </Reveal>
  );
}
