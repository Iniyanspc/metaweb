"use client";

import type { CSSProperties } from "react";
import type { HomeContent, Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";
import { Icon, isIconName } from "@/components/ui/Icon";
import styles from "./FoundationFlow.module.css";

const DOT: Record<Pillar, string> = { data: "bg-pink", ai: "bg-violet", business: "bg-ink", bridge: "bg-soma" };
const ICON_TONE: Record<Pillar, string> = { data: "text-pink-ink", ai: "text-violet", business: "text-ink", bridge: "text-violet" };

/* Closing lines: Data, AI, Business. Pink is allowed here as large display text. */
const CLOSING_TONE = ["text-pink", "text-violet", "text-ink"];
const CLOSING_ALIGN = ["md:text-left", "md:text-center", "md:text-right"];

/**
 * Five numbered steps, horizontal from 1024px and vertical below, followed by
 * the closing lines. Timings live in FoundationFlow.module.css.
 */
export function FoundationFlow({ foundation }: { foundation: HomeContent["foundation"] }) {
  // Start a little before the section is fully in view so a normal scroll sees it all.
  const [ref, played] = useInViewOnce<HTMLDivElement>(0.35);
  const { steps, closing } = foundation;

  return (
    <div ref={ref} className={cn(styles.root, played && styles.played)}>
      <ol aria-label="From sources to business decisions" className="relative grid gap-6 lg:grid-cols-5 lg:gap-(--gutter)">
        {/* The edge: through the dots, vertical on mobile, horizontal on desktop. */}
        <span
          aria-hidden
          className="absolute top-2.5 bottom-2.5 left-[9px] w-0.5 bg-ink/15 lg:top-[82px] lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-0.5 lg:w-auto"
        >
          <span className={cn("absolute left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full lg:top-1/2 lg:left-0", styles.pulse)} />
        </span>

        {steps.map((step, i) => {
          const vars = { "--i": i } as CSSProperties;
          return (
            <li key={step.label} className="relative flex items-center gap-4 lg:flex-col lg:gap-0 lg:text-center">
              {/* Icon: pops in as the pulse arrives. Right of the label on mobile, above the node on desktop. */}
              <span
                aria-hidden
                style={vars}
                className={cn(
                  "order-last ml-auto grid size-12 shrink-0 place-items-center rounded-full border border-line bg-canvas shadow-[0_8px_20px_-12px_rgb(0_0_0/0.3)] lg:order-none lg:mb-4 lg:ml-0 lg:size-14",
                  ICON_TONE[step.pillar],
                  styles.icon,
                )}
              >
                {isIconName(step.icon) && <Icon name={step.icon} size={26} />}
              </span>
              <span aria-hidden style={vars} className={cn("relative size-5 shrink-0 rounded-full ring-4 ring-mist", DOT[step.pillar], styles.dot)} />
              <span className="flex flex-col lg:mt-3">
                <span className="text-caption text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-body font-medium">{step.label}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {/* Closing lines step across the page, left, centre, right, like the flow itself.
          Each line's first word carries its pillar colour; the rest is muted. */}
      <p className="mt-16 flex flex-col gap-1 font-display text-h2 md:mt-24 md:gap-2">
        {closing.map((line, i) => {
          const space = line.indexOf(" ");
          const word = space === -1 ? line : line.slice(0, space);
          const rest = space === -1 ? "" : line.slice(space);
          return (
            <span
              key={line}
              style={{ "--i": i } as CSSProperties}
              className={cn("block", CLOSING_ALIGN[i % CLOSING_ALIGN.length], styles.closing)}
            >
              <span className={cn("font-semibold", CLOSING_TONE[i % CLOSING_TONE.length])}>{word}</span>
              <span className="text-muted">{rest}</span>
            </span>
          );
        })}
      </p>
    </div>
  );
}
