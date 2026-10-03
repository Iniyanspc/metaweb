"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* A knowledge-graph view drawn like a product visualisation: sources on the
   left, the intelligence layer in the middle, outcomes on the right. */

type Kind = "data" | "intel" | "hub" | "outcome" | "minor";
interface GNode {
  id: string;
  x: number;
  y: number;
  kind: Kind;
  label?: string;
}

const NODES: GNode[] = [
  { id: "erp", x: 46, y: 78, kind: "data", label: "ERP" },
  { id: "crm", x: 34, y: 142, kind: "data", label: "CRM" },
  { id: "sensors", x: 52, y: 206, kind: "data", label: "Sensors" },
  { id: "docs", x: 38, y: 270, kind: "data", label: "Documents" },
  { id: "apis", x: 58, y: 330, kind: "data", label: "APIs" },
  { id: "customers", x: 136, y: 104, kind: "intel", label: "Customers" },
  { id: "orders", x: 202, y: 128, kind: "intel", label: "Orders" },
  { id: "assets", x: 126, y: 286, kind: "intel", label: "Assets" },
  { id: "contracts", x: 206, y: 300, kind: "intel", label: "Contracts" },
  { id: "hub", x: 166, y: 204, kind: "hub", label: "Knowledge" },
  { id: "forecast", x: 278, y: 112, kind: "outcome", label: "Forecast" },
  { id: "alerts", x: 286, y: 204, kind: "outcome", label: "Alerts" },
  { id: "decisions", x: 272, y: 296, kind: "outcome", label: "Decisions" },
  { id: "m1", x: 98, y: 58, kind: "minor" },
  { id: "m2", x: 92, y: 176, kind: "minor" },
  { id: "m3", x: 104, y: 336, kind: "minor" },
  { id: "m4", x: 240, y: 62, kind: "minor" },
  { id: "m5", x: 238, y: 236, kind: "minor" },
  { id: "m6", x: 236, y: 350, kind: "minor" },
  { id: "m7", x: 300, y: 350, kind: "minor" },
  { id: "m8", x: 304, y: 58, kind: "minor" },
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
const FILL: Record<Kind, string> = {
  data: "var(--color-pink)",
  intel: "var(--color-lilac)",
  hub: "var(--color-lilac)",
  outcome: "var(--color-canvas)",
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
    <figure className="flex h-full flex-col overflow-hidden rounded-media bg-plum p-5 text-canvas">
      <figcaption className="flex items-center justify-between text-caption text-canvas/70">
        <span>{graph.caption}</span>
        <span aria-hidden className="flex gap-1">
          <span className="size-1.5 rounded-full bg-canvas/30" />
          <span className="size-1.5 rounded-full bg-canvas/30" />
          <span className="size-1.5 rounded-full bg-canvas/30" />
        </span>
      </figcaption>

      <svg viewBox="0 0 340 400" className="mt-2 block w-full flex-1" role="img" aria-label={graph.description}>
        <g stroke="var(--color-lilac)" strokeOpacity={0.28} strokeWidth={1}>
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
                <path d={d} fill="none" stroke="var(--color-pink)" strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray="14 600" strokeDashoffset={14}>
                  <animate attributeName="stroke-dashoffset" from="14" to="-600" dur={`${r.dur}s`} begin={`${r.begin}s`} repeatCount="indefinite" />
                </path>
                {/* Hidden until its first run, or it would sit at the SVG origin. */}
                <circle r={2.6} fill="var(--color-pink)" opacity={0}>
                  <set attributeName="opacity" to="1" begin={`${r.begin}s`} />
                  <animateMotion path={d} dur={`${r.dur}s`} begin={`${r.begin}s`} repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline" />
                  {/* SMIL can't read CSS variables: pink to lilac to white, as data becomes an outcome. */}
                  <animate attributeName="fill" values="#f7147f;#d9a6f0;#ffffff" dur={`${r.dur}s`} begin={`${r.begin}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

        {NODES.map((n) => (
          <g key={n.id}>
            {n.kind === "hub" && (
              <circle cx={n.x} cy={n.y} r={16} fill="none" stroke="var(--color-lilac)" strokeOpacity={0.45}>
                {animate && <animate attributeName="r" values="14;19;14" dur="3.2s" repeatCount="indefinite" />}
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r={RADIUS[n.kind]} fill={FILL[n.kind]} fillOpacity={n.kind === "minor" ? 0.5 : 1} />
            {n.label && (
              <text
                x={n.x}
                y={n.y + RADIUS[n.kind] + 12}
                textAnchor="middle"
                fontSize={9.5}
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

      <ul aria-hidden className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-canvas/70">
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pink" />
          {graph.legend.data}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-lilac" />
          {graph.legend.intelligence}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-canvas" />
          {graph.legend.outcomes}
        </li>
      </ul>
    </figure>
  );
}
