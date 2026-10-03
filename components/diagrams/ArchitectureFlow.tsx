"use client";

import { useId, useState } from "react";
import type { Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";
import styles from "./ArchitectureFlow.module.css";

const DOT: Record<Pillar, string> = { data: "bg-pink", ai: "bg-violet", business: "bg-ink", bridge: "bg-soma" };

export interface FlowNode {
  id: string;
  label: string;
  pillar: Pillar;
  detail?: string;
  /** Technology names, already resolved from slugs. */
  technologies: string[];
}

/**
 * Sources → … → Business outcomes. Horizontal from 1024px, vertical below.
 * A real sequence, so numbered. Each node discloses its detail on click.
 */
export function ArchitectureFlow({
  nodes,
  label,
  surface = "mist",
}: {
  nodes: FlowNode[];
  label: string;
  /** Background the diagram sits on, so node halos match it. */
  surface?: "mist" | "canvas";
}) {
  const [open, setOpen] = useState<string | null>(nodes[0]?.id ?? null);
  const [ref, played] = useInViewOnce<HTMLDivElement>(0.4);
  const baseId = useId();

  return (
    <div ref={ref} className={cn("relative", played && styles.played)}>
      <ol aria-label={label} className="relative grid gap-0 lg:grid-cols-8 lg:gap-(--gutter) lg:pb-44">
        {/* The edge: vertical on mobile (through the dots), horizontal on desktop. */}
        <span aria-hidden className="absolute top-5 bottom-5 left-[9px] w-0.5 bg-ink/15 lg:top-[9px] lg:right-[calc(100%/16)] lg:bottom-auto lg:left-[calc(100%/16)] lg:h-0.5 lg:w-auto">
          <span className={cn("absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full lg:top-1/2 lg:left-0 lg:translate-y-[-50%]", styles.pulse)} />
        </span>
        {nodes.map((n, i) => {
          const isOpen = open === n.id;
          const panelId = `${baseId}-${n.id}`;
          return (
            <li key={n.id} className="relative lg:static">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : n.id)}
                className="group flex w-full items-start gap-4 rounded-card py-3 text-left focus-visible:shadow-(--focus-ring) lg:flex-col lg:items-center lg:gap-3 lg:py-0 lg:text-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-0.5 size-5 shrink-0 rounded-full ring-4 transition-[box-shadow] duration-200 lg:mt-0",
                    surface === "mist" ? "ring-mist" : "ring-canvas",
                    DOT[n.pillar],
                    isOpen &&
                      (surface === "mist"
                        ? "shadow-[0_0_0_7px_var(--color-mist),0_0_0_9px_var(--color-ink)]"
                        : "shadow-[0_0_0_7px_var(--color-canvas),0_0_0_9px_var(--color-ink)]"),
                  )}
                />
                <span className="flex flex-col lg:items-center">
                  <span className="text-caption text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("link-underline font-medium group-hover:bg-size-[100%_1px]", isOpen && "bg-size-[100%_1px]")}>{n.label}</span>
                </span>
              </button>
              <div
                id={panelId}
                hidden={!isOpen}
                className="pb-4 pl-9 lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-36 lg:pb-0 lg:pl-0"
              >
                <div className="lg:mx-auto lg:max-w-2xl lg:border-t lg:border-ink/15 lg:pt-6 lg:text-center">
                  {n.detail && <p className="text-body lg:mx-auto">{n.detail}</p>}
                  {n.technologies.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2 lg:justify-center" aria-label={`Example technologies for ${n.label}`}>
                      {n.technologies.map((t) => (
                        <li key={t} className="rounded-pill border border-line bg-canvas px-3 py-1 text-caption">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
