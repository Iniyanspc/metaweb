"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface TechGroup {
  category: string;
  philosophy?: string;
  items: string[];
}

/** ARIA tabs: arrow keys move between categories; chips are plain text, no vendor logos. */
export function TechTabs({ groups, label }: { groups: TechGroup[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (e: KeyboardEvent) => {
    const last = groups.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const group = groups[active];
  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="-mx-1 flex flex-wrap gap-2 px-1">
        {groups.map((g, i) => (
          <button
            key={g.category}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "h-10 rounded-pill border px-4 text-small font-medium transition-colors duration-160 focus-visible:shadow-(--focus-ring)",
              i === active ? "border-ink bg-ink text-canvas" : "border-line text-ink hover:border-ink",
            )}
          >
            {g.category}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`} tabIndex={0} className="mt-8 rounded-card focus-visible:shadow-(--focus-ring)">
        {group.philosophy && <p className="mb-6 text-body-lg text-muted">{group.philosophy}</p>}
        <ul className="flex flex-wrap gap-2">
          {group.items.map((item) => (
            <li key={item} className="rounded-pill border border-line px-4 py-2 text-small">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
