import type { ReactNode } from "react";
import type { Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "./Container";
import { Node } from "./Node";

export type SectionTone = "canvas" | "mist" | "plum";

const tones: Record<SectionTone, string> = {
  canvas: "bg-canvas text-ink",
  mist: "bg-mist text-ink",
  plum: "bg-plum text-canvas",
};

/**
 * Wraps every page section. On the homepage (`axon`), column 1 holds a segment
 * of the axon line and this section's pillar node from 1024px up; adjacent
 * segments join into one continuous line.
 */
export function Section({
  id,
  labelledBy,
  pillar,
  tone = "canvas",
  axon = false,
  reveal = false,
  className,
  children,
}: {
  id?: string;
  /** id of the section's heading, for aria-labelledby. */
  labelledBy?: string;
  pillar: Pillar;
  tone?: SectionTone;
  /** Sit on the homepage axon. "start" and "end" cap the line at this section's node. */
  axon?: boolean | "start" | "end";
  /** Fade the section's content up as it scrolls into view. */
  reveal?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-pillar={pillar}
      className={cn("relative py-(--section-y)", tones[tone], className)}
    >
      <Container className="relative">
        {axon ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-(--gutter)">
            <div aria-hidden className="relative hidden lg:block">
              <span
                className={cn(
                  "absolute left-1/2 w-0.5 -translate-x-1/2",
                  axon === "start" ? "top-6" : "top-[calc(-1*var(--section-y))]",
                  axon === "end" ? "h-[calc(var(--section-y)+24px)]" : "bottom-[calc(-1*var(--section-y))]",
                  tone === "plum" ? "bg-canvas/30" : "bg-ink",
                )}
              />
              {/* Node sits level with the section heading's first line. */}
              <span className={cn("absolute top-3 left-1/2 -translate-x-1/2 rounded-full p-1", tones[tone])}>
                <Node pillar={pillar} size={14} onDark={tone === "plum"} className="block" />
              </span>
            </div>
            <div className="lg:col-span-11">{children}</div>
          </div>
        ) : reveal ? (
          <Reveal>{children}</Reveal>
        ) : (
          children
        )}
      </Container>
    </section>
  );
}
