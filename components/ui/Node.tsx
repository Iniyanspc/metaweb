import type { Pillar } from "@/lib/content/types";
import { cn } from "@/lib/cn";

const fill: Record<Pillar, string> = {
  data: "bg-pink",
  ai: "bg-violet",
  business: "bg-ink",
  bridge: "bg-soma",
};

/** A pillar-coloured node: the site's smallest unit of colour meaning. */
export function Node({
  pillar,
  size = 12,
  onDark = false,
  className,
}: {
  pillar: Pillar;
  size?: number;
  /** On plum or ink, business nodes turn white and AI nodes lilac. */
  onDark?: boolean;
  className?: string;
}) {
  const colour = onDark && pillar === "business" ? "bg-canvas" : onDark && pillar === "ai" ? "bg-lilac" : fill[pillar];
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 rounded-full", colour, className)}
      style={{ width: size, height: size }}
    />
  );
}
