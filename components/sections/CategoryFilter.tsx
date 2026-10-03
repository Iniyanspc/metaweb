"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FilterItem {
  key: string;
  category: string;
  node: ReactNode;
}

/**
 * Client-side category filter, synced to ?category= so filtered views can be
 * shared. Items arrive server-rendered; this only decides which to show.
 */
export function CategoryFilter({
  items,
  categories,
  allLabel,
  emptyLabel,
  label,
  gridClassName,
  lead,
  leadKey,
}: {
  items: FilterItem[];
  categories: string[];
  allLabel: string;
  emptyLabel: string;
  label: string;
  gridClassName: string;
  /** Shown above the grid only when no filter is active (e.g. a featured item). */
  lead?: ReactNode;
  /** Key of the item shown as `lead`, so it isn't repeated in the unfiltered grid. */
  leadKey?: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = params.get("category");
  const active = requested && categories.includes(requested) ? requested : null;
  const visible = active ? items.filter((i) => i.category === active) : items.filter((i) => !lead || i.key !== leadKey);

  const select = (category: string | null) => {
    const next = new URLSearchParams(params);
    if (category) next.set("category", category);
    else next.delete("category");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {[null, ...categories].map((c) => {
          const pressed = c === active;
          return (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={pressed}
              onClick={() => select(c)}
              className={cn(
                "h-10 rounded-pill border px-4 text-small font-medium transition-colors duration-160 focus-visible:shadow-(--focus-ring)",
                pressed ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
              )}
            >
              {c ?? allLabel}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "item" : "items"}
      </p>
      {!active && lead && <div className="mt-10">{lead}</div>}
      {visible.length === 0 && !active && lead ? null : visible.length ? (
        <ul className={cn("mt-10", gridClassName)}>
          {visible.map((i) => (
            <li key={i.key}>{i.node}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-body text-muted">{emptyLabel}</p>
      )}
    </div>
  );
}
