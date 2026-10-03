"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* A knowledge-graph view drawn like a product visualisation, flowing left to
   right: sources, then the intelligence layer, then outcomes. */

type Kind = "data" | "intel" | "hub" | "outcome" | "minor";
interface GNode {
  id: string;
  x: number;
  y: number;
  kind: Kind;
  label?: string;
}

const NODES: GNode[] = [
  // Sources, left
  { id: "erp", x: 60, y: 60, kind: "data", label: "ERP" },
  { id: "crm", x: 48, y: 99, kind: "data", label: "CRM" },
  { id: "sensors", x: 68, y: 138, kind: "data", label: "Sensors" },
  { id: "docs", x: 54, y: 176, kind: "data", label: "Documents" },
  { id: "apis", x: 78, y: 213, kind: "data", label: "APIs" },
  // Intelligence layer, middle
  { id: "customers", x: 179, y: 72, kind: "intel", label: "Customers" },
  { id: "orders", x: 274, y: 80, kind: "intel", label: "Orders" },
  { id: "hub", x: 228, y: 134, kind: "hub", label: "Knowledge" },
  { id: "assets", x: 171, y: 189, kind: "intel", label: "Assets" },
  { id: "contracts", x: 280, y: 194, kind: "intel", label: "Contracts" },
  // Outcomes, right
  { id: "forecast", x: 383, y: 77, kind: "outcome", label: "Forecast" },
  { id: "alerts", x: 402, y: 134, kind: "outcome", label: "Alerts" },
  { id: "decisions", x: 383, y: 189, kind: "outcome", label: "Decisions" },
  // Unlabelled texture
  { id: "m1", x: 121, y: 51, kind: "minor" },
  { id: "m2", x: 119, y: 119, kind: "minor" },
  { id: "m3", x: 125, y: 211, kind: "minor" },
  { id: "m4", x: 329, y: 48, kind: "minor" },
  { id: "m5", x: 327, y: 138, kind: "minor" },
  { id: "m6", x: 331, y: 222, kind: "minor" },
  { id: "m7", x: 428, y: 221, kind: "minor" },
  { id: "m8", x: 432, y: 49, kind: "minor" },
];

const EDGES: [string, string][] = [
  ["erp", "customers"], ["erp", "m1"], ["m1", "customers"], ["crm", "customers"], ["crm", "m2"],
  ["sensors", "m2"], ["m2", "hub"], ["sensors", "assets"], ["docs", "assets"], ["docs", "contracts"],
  ["apis", "m3"], ["m3", "assets"], ["apis", "contracts"],
  ["customers", "hub"], ["customers", "orders"], ["orders", "hub"], ["assets", "hub"], ["contracts", "hub"],
  ["orders", "m4"], ["m4", "forecast"], ["m8", "forecast"], ["hub", "forecast"], ["hub", "alerts"],
  ["hub", "m5"], ["m5", "decisions"], ["contracts", "decisions"], ["contracts", "m6"], ["m6", "m7"], ["m7", "decisions"],
  ["orders", "forecast"],
];

/* Routes the pulses travel, source to outcome. */
const ROUTES: { path: string[]; dur: number; begin: number }[] = [
  { path: ["erp", "customers", "hub", "forecast"], dur: 3.6, begin: 0 },
  { path: ["sensors", "m2", "hub", "alerts"], dur: 3.2, begin: 1.1 },
  { path: ["docs", "contracts", "hub", "decisions"], dur: 3.8, begin: 2.0 },
  { path: ["crm", "customers", "orders", "forecast"], dur: 3.4, begin: 2.8 },
  { path: ["apis", "m3", "assets", "hub", "alerts"], dur: 4.2, begin: 0.6 },
];

const at = (id: string) => NODES.find((n) => n.id === id)!;
/* Black and white only: groups differ by tone and shape, not colour. */
const FILL: Record<Kind, string> = {
  data: "var(--color-canvas)",
  intel: "#8c8c8c",
  hub: "var(--color-canvas)",
  outcome: "var(--color-ink)",
  minor: "var(--color-canvas)",
};
const RADIUS: Record<Kind, number> = { data: 6, intel: 5, hub: 9, outcome: 6, minor: 2.2 };

export function NetworkGraphCard({ graph }: { graph: HomeContent["hero"]["graph"] }) {
  // Pulses run only when motion is welcome; SMIL ignores CSS media queries.
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <figure className="relative h-full overflow-hidden rounded-media bg-ink text-canvas">
      <figcaption className="absolute inset-x-5 top-4 z-10 flex items-center justify-between text-caption text-canvas/70">
        <span>{graph.caption}</span>
        <span aria-hidden className="flex gap-1">
          <span className="size-1.5 rounded-full bg-canvas/30" />
          <span className="size-1.5 rounded-full bg-canvas/30" />
          <span className="size-1.5 rounded-full bg-canvas/30" />
        </span>
      </figcaption>

      <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 block size-full" role="img" aria-label={graph.description}>
        <g stroke="var(--color-canvas)" strokeOpacity={0.2} strokeWidth={1}>
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
          })}
        </g>

        {animate &&
          ROUTES.map((r, i) => {
            const d = "M" + r.path.map((id) => `${at(id).x} ${at(id).y}`).join(" L");
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="var(--color-canvas)" strokeOpacity={0.6} strokeWidth={1.4} strokeDasharray="14 600" strokeDashoffset={14}>
                  <animate attributeName="stroke-dashoffset" from="14" to="-600" dur={`${r.dur}s`} begin={`${r.begin}s`} repeatCount="indefinite" />
                </path>
                {/* Hidden until its first run, or it would sit at the SVG origin. */}
                <circle r={2.6} fill="var(--color-canvas)" opacity={0}>
                  <set attributeName="opacity" to="1" begin={`${r.begin}s`} />
                  <animateMotion path={d} dur={`${r.dur}s`} begin={`${r.begin}s`} repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline" />
                </circle>
              </g>
            );
          })}

        {NODES.map((n) => (
          <g key={n.id}>
            {n.kind === "hub" && (
              <circle cx={n.x} cy={n.y} r={16} fill="none" stroke="var(--color-canvas)" strokeOpacity={0.4}>
                {animate && <animate attributeName="r" values="14;19;14" dur="3.2s" repeatCount="indefinite" />}
              </circle>
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={RADIUS[n.kind]}
              fill={FILL[n.kind]}
              fillOpacity={n.kind === "minor" ? 0.45 : 1}
              // Outcomes are hollow white rings, the end of the line.
              {...(n.kind === "outcome" ? { stroke: "var(--color-canvas)", strokeWidth: 2 } : {})}
            />
            {n.label && (
              <text
                x={n.x}
                // The hub's label clears its pulsing ring.
                y={n.y + (n.kind === "hub" ? 32 : RADIUS[n.kind] + 12)}
                textAnchor="middle"
                fontSize={10}
                fill="var(--color-canvas)"
                fillOpacity={n.kind === "hub" ? 0.95 : 0.7}
                fontFamily="var(--font-sans)"
              >
                {n.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      <ul aria-hidden className="absolute bottom-4 left-5 z-10 flex flex-wrap gap-x-4 gap-y-1 text-caption text-canvas/70">
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-canvas" />
          {graph.legend.data}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#8c8c8c]" />
          {graph.legend.intelligence}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-canvas" />
          {graph.legend.outcomes}
        </li>
      </ul>
    </figure>
  );
}
