import { cn } from "@/lib/cn";

/** Small deterministic PRNG so the same seed always draws the same pattern. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Abstract node-and-edge artwork used wherever a portrait or image is missing.
 * Never a stock face or a generated person. Fills its (relatively positioned) parent.
 */
export function NodePattern({
  seed,
  className,
  tone = "mist",
  accent = "data",
}: {
  seed: string;
  className?: string;
  tone?: "mist" | "plum";
  accent?: "data" | "ai" | "business";
}) {
  const rand = rng(seed);
  const count = 7 + Math.floor(rand() * 4);
  const nodes = Array.from({ length: count }, () => ({ x: 12 + rand() * 76, y: 12 + rand() * 76, r: 1.6 + rand() * 2.4 }));
  const hub = nodes[0];
  const accentFill = accent === "data" ? "var(--color-pink)" : accent === "ai" ? "var(--color-violet)" : "var(--color-ink)";
  const dark = tone === "plum";
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("absolute inset-0 block size-full", dark ? "bg-plum" : "bg-mist", className)}
    >
      <g stroke={dark ? "var(--color-lilac)" : "var(--color-muted)"} strokeOpacity={dark ? 0.5 : 0.35} strokeWidth={0.6}>
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={i % 3 === 0 ? hub.x : nodes[i].x} y1={i % 3 === 0 ? hub.y : nodes[i].y} x2={n.x} y2={n.y} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 0 ? 5 : n.r}
          fill={i === 0 ? accentFill : dark ? "var(--color-canvas)" : "var(--color-ink)"}
          fillOpacity={i === 0 ? 1 : 0.8}
        />
      ))}
    </svg>
  );
}
