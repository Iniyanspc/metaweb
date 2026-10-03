import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Pill-shaped chip for technologies, categories and statuses. */
export function Tag({ children, tone = "line", className }: { children: ReactNode; tone?: "line" | "plum" | "ink"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-3 py-1 text-caption",
        tone === "line" && "border-line bg-canvas text-ink",
        tone === "plum" && "border-canvas/25 text-canvas",
        tone === "ink" && "border-ink bg-ink text-canvas",
        className,
      )}
    >
      {children}
    </span>
  );
}
