import type { ReactNode } from "react";
import type { Link as LinkType, Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
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
  children,
  className,
}: {
  title: string;
  titleLines?: string[];
  support?: string;
  pillar?: Pillar;
  breadcrumbs?: LinkType[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Container className={cn("pt-10 pb-16 md:pt-14 md:pb-24", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className={cn("flex flex-col gap-6", breadcrumbs && "mt-12 md:mt-16")}>
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
      </div>
    </Container>
  );
}
