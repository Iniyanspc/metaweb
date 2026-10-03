import type { Capability } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Node } from "@/components/ui/Node";
import { lowerFirst } from "@/lib/text";
import { Card, CardLink } from "./Card";

export function CapabilityCard({ capability, wide = false }: { capability: Capability; wide?: boolean }) {
  return (
    <Card href={capability.cta.href} className={cn("h-full", wide && "md:p-10")}>
      <Node pillar={capability.pillar} />
      <h3 className={cn("mt-6", wide ? "text-h3" : "text-h4 font-sans font-semibold")}>{capability.name}</h3>
      <p className={cn("mt-3 text-muted", wide ? "text-body-lg" : "text-small")}>{capability.line}</p>
      {wide ? (
        <ul className="mt-6 grid gap-x-6 gap-y-2 text-small sm:grid-cols-2">
          {capability.services.slice(0, 6).map((s) => (
            <li key={s} className="flex items-baseline gap-2.5">
              <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-ink" />
              {s}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-caption text-muted">{capability.services.slice(0, 4).map((s, i) => (i === 0 ? s : lowerFirst(s))).join(", ")}</p>
      )}
      <CardLink href={capability.cta.href}>{capability.cta.label}</CardLink>
    </Card>
  );
}
