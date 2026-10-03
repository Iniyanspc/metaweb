"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

/* Scattered positions snap into a connected ring once, on scroll-in. */
const COUNT = 8;
const CENTER = 100;
const RADIUS = 62;
const SCATTER = [
  [28, 40], [150, 22], [178, 112], [120, 182], [36, 150], [90, 70], [160, 168], [62, 104],
];

const ring = Array.from({ length: COUNT }, (_, i) => {
  const a = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + RADIUS * Math.cos(a), y: CENTER + RADIUS * Math.sin(a) };
});

export function ProblemNetwork() {
  const [ref, connected] = useInViewOnce<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className="mx-auto w-full max-w-sm">
      <svg viewBox="0 0 200 200" aria-hidden className="block w-full overflow-visible">
        <g
          className="transition-opacity delay-500 duration-500 ease-out motion-reduce:transition-none"
          style={{ opacity: connected ? 1 : 0 }}
          stroke="var(--color-pink)"
          strokeWidth={1.5}
        >
          {ring.map((p, i) => {
            const q = ring[(i + 1) % COUNT];
            return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
          })}
        </g>
        {ring.map((p, i) => {
          const [sx, sy] = SCATTER[i];
          const style: CSSProperties = {
            transform: connected ? "translate(0px, 0px)" : `translate(${sx - p.x}px, ${sy - p.y}px)`,
            transitionDelay: `${i * 40}ms`,
          };
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i % 3 === 0 ? 9 : 7}
              className={cn("transition-transform duration-700 ease-out motion-reduce:transition-none", i % 2 ? "fill-pink" : "fill-ink")}
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}
