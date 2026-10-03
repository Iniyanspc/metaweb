import type { ReactNode } from "react";
import type { Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Node } from "./Node";

/**
 * Section heading block. The small pillar node is shown below 1024px when the
 * section sits on the axon (the axon carries it on desktop), and always otherwise.
 */
export function SectionHeader({
  id,
  title,
  support,
  pillar,
  axon = false,
  onDark = false,
  align = "left",
  action,
  as: Heading = "h2",
  className,
}: {
  id: string;
  title: ReactNode;
  support?: ReactNode;
  pillar?: Pillar;
  axon?: boolean;
  onDark?: boolean;
  align?: "left" | "center";
  /** Optional link or button aligned to the heading on wide screens. */
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        Boolean(action) && "md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-5", align === "center" && "items-center")}>
        {pillar && <Node pillar={pillar} onDark={onDark} className={cn(axon && "lg:hidden")} />}
        <Heading id={id} className={cn("max-w-[24ch]", Heading === "h1" ? "text-h1" : "text-h2")}>
          {title}
        </Heading>
        {support && (
          <p className={cn("text-body-lg", onDark ? "text-canvas/80" : "text-muted", align === "center" && "mx-auto")}>
            {support}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
