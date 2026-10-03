import type { ReactNode } from "react";
import type { Link as LinkType, Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { Node } from "./Node";
import { PlaceholderText } from "./PlaceholderText";

/** Inner-page opening: breadcrumbs, pillar node, h1, support line, optional actions. */
export function PageHero({
  title,
  titleLines,
  support,
  pillar,
  breadcrumbs,
  image,
  children,
  className,
}: {
  title: string;
  titleLines?: string[];
  support?: string;
  pillar?: Pillar;
  breadcrumbs?: LinkType[];
  /** Wide photo below the heading (key from lib/images.ts). */
  image?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Container className={cn("pt-10 pb-16 md:pt-14 md:pb-24", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <Reveal className={cn("flex flex-col gap-6", breadcrumbs && "mt-12 md:mt-16")}>
        {pillar && <Node pillar={pillar} size={14} />}
        <h1 className="max-w-[20ch] text-h1">
          {titleLines
            ? titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            : title}
        </h1>
        {support && (
          <p className="max-w-[60ch] text-body-lg text-muted">
            <PlaceholderText text={support} />
          </p>
        )}
        {children}
      </Reveal>
      {image && (
        <ParallaxPhoto name={image} priority speed={40} delay={200} sizes="(min-width: 1280px) 1280px, 100vw" className="mt-12 aspect-[4/3] md:mt-16 md:aspect-[21/8]" />
      )}
    </Container>
  );
}
