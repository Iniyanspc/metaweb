"use client";

import NextLink from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Capability, Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { Node } from "@/components/ui/Node";
import { Photo } from "@/components/ui/Photo";

/** Distance from the top of the viewport where the first card settles, and the step between cards. */
const STICK_TOP = 88;
const STEP = 16;

/**
 * Capabilities as a stack of large cards. Each card sticks as it reaches the
 * top; the next one slides up over it while the cards beneath ease back and
 * dim, so the six pile up like layers. A numbered rail tracks the active card
 * and jumps to any of them. Under reduced motion the cards simply list.
 */
export function CapabilityStack({
  capabilities,
  pillarLabels,
}: {
  capabilities: Capability[];
  pillarLabels: Record<Pillar, string>;
}) {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = cards.current;
      let current = 0;
      els.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        // A card becomes "current" once it has slid at least halfway over the one before.
        if (top <= STICK_TOP + i * STEP + el.offsetHeight * 0.5) current = i;
        // How far the next card has slid over this one: 0 = not at all, 1 = fully covered.
        const next = els[i + 1];
        if (!next) return;
        const height = el.offsetHeight;
        const gap = next.getBoundingClientRect().top - (STICK_TOP + i * STEP);
        const covered = Math.min(1, Math.max(0, 1 - gap / height));
        el.style.setProperty("--covered", covered.toFixed(3));
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = cards.current[i]?.parentElement;
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - STICK_TOP - i * STEP;
    window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="relative lg:grid lg:grid-cols-12 lg:gap-x-(--gutter)">
      {/* Rail: where you are in the six, and a shortcut to each. */}
      <nav aria-label="Capabilities" className="hidden lg:col-span-3 lg:block">
        <ol className="sticky flex flex-col gap-1" style={{ top: STICK_TOP }}>
          {capabilities.map((c, i) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={active === i ? "step" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-pill py-2 pr-3 text-left text-small transition-colors duration-300 focus-visible:shadow-(--focus-ring)",
                  active === i ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 shrink-0 rounded-full transition-all duration-500 ease-out",
                    active === i ? "w-8 bg-ink" : "w-3 bg-line group-hover:w-5 group-hover:bg-muted",
                  )}
                />
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("transition-opacity duration-300", active === i && "font-medium")}>{c.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <ol className="flex flex-col gap-6 lg:col-span-9 lg:gap-10">
        {capabilities.map((c, i) => {
          const dark = c.pillar === "ai";
          return (
            <li
              key={c.slug}
              className="motion-safe:sticky"
              style={{ top: STICK_TOP + i * STEP } as CSSProperties}
            >
              <article
                ref={(el) => {
                  cards.current[i] = el;
                }}
                aria-labelledby={`cap-${c.slug}`}
                className={cn(
                  "group relative grid origin-top overflow-hidden rounded-card border md:grid-cols-2 md:min-h-[min(30rem,68vh)]",
                  "transition-[filter] duration-200 motion-safe:[transform:scale(calc(1-var(--covered,0)*0.06))] motion-safe:[filter:brightness(calc(1-var(--covered,0)*0.25))]",
                  dark ? "border-plum bg-plum text-canvas" : "border-line bg-canvas",
                )}
              >
                <div className="flex flex-col p-6 md:p-10 lg:p-12">
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn("flex items-center gap-2.5 text-caption", dark ? "text-lilac" : "text-muted")}>
                      <Node pillar={c.pillar} size={10} onDark={dark} />
                      {pillarLabels[c.pillar]}
                    </span>
                    <span className={cn("font-display text-h4 tabular-nums", dark ? "text-canvas/40" : "text-ink/25")}>
                      {String(i + 1).padStart(2, "0")}
                      <span className="sr-only"> of {capabilities.length}</span>
                    </span>
                  </div>
                  <h3 id={`cap-${c.slug}`} className="mt-5 text-h3 md:mt-auto md:text-h2">
                    {c.name}
                  </h3>
                  <p className={cn("mt-3 max-w-[38ch] text-body md:mt-4 md:text-body-lg", dark ? "text-canvas/80" : "text-muted")}>{c.line}</p>
                  <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
                    {c.services.slice(0, 3).map((s) => (
                      <li
                        key={s}
                        className={cn("rounded-pill border px-3 py-1 text-caption", dark ? "border-canvas/25" : "border-line")}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 md:mt-8">
                    <NextLink href={c.cta.href} className={buttonClasses({ tone: dark ? "plum" : "canvas", variant: "secondary" })}>
                      {c.cta.label}
                    </NextLink>
                  </div>
                </div>
                <div className="relative order-first aspect-[2/1] overflow-hidden md:order-none md:aspect-auto">
                  <Photo
                    name={c.image}
                    alt=""
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                    className="transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
