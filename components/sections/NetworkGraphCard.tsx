"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* A knowledge-graph view drawn like a product visualisation, flowing left to
   right: sources, then the intelligence layer, then outcomes. Pulses change
   colour as data becomes intelligence and then an outcome. */

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

/* Routes the pulses travel. Every route passes through the Knowledge hub. */
const ROUTES: { path: string[]; dur: number; begin: number }[] = [
  { path: ["erp", "customers", "hub", "forecast"], dur: 3.6, begin: 0 },
  { path: ["sensors", "m2", "hub", "alerts"], dur: 3.2, begin: 1.1 },
  { path: ["docs", "contracts", "hub", "decisions"], dur: 3.8, begin: 2.0 },
  { path: ["crm", "customers", "hub", "m5", "decisions"], dur: 3.8, begin: 2.8 },
  { path: ["apis", "m3", "assets", "hub", "alerts"], dur: 4.2, begin: 0.6 },
];

const at = (id: string) => NODES.find((n) => n.id === id)!;

/* Brand palette on black: pink = data, lilac (violet on dark) = intelligence,
   white = outcomes (ink's role on dark), soma gradient = the hub.
   SMIL animations can't read CSS variables, so the pulse colours are literal. */
const PINK = "#F7147F";
const LILAC = "#D9A6F0";
const WHITE = "#FFFFFF";

const FILL: Record<Kind, string> = {
  data: "var(--color-pink)",
  intel: "var(--color-lilac)",
  hub: "url(#graph-soma)",
  outcome: "var(--color-ink)",
  minor: "var(--color-canvas)",
};
const EDGE: Record<Kind, string> = {
  data: "var(--color-pink)",
  intel: "var(--color-lilac)",
  hub: "var(--color-lilac)",
  outcome: "var(--color-canvas)",
  minor: "var(--color-canvas)",
};
const RADIUS: Record<Kind, number> = { data: 6, intel: 5, hub: 9, outcome: 6, minor: 2.2 };

/** Path data, total length, and the share of the trip completed on reaching the hub. */
function measure(path: string[]) {
  const pts = path.map(at);
  let total = 0;
  let toHub = 0;
  pts.forEach((p, i) => {
    if (i === 0) return;
    total += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
    if (p.id === "hub") toHub = total;
  });
  const d = "M" + pts.map((p) => `${p.x} ${p.y}`).join(" L");
  return { d, total, hubAt: toHub / total, end: pts[pts.length - 1] };
}

const ARRIVE = 0.96;
const f = (n: number) => n.toFixed(3);

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
  const hub = at("hub");

  return (
    <figure className="relative h-full overflow-hidden rounded-media bg-ink text-canvas">
      <figcaption className="absolute inset-x-5 top-4 z-10 flex items-center justify-between text-caption text-canvas/70">
        <span>{graph.caption}</span>
        <span aria-hidden className="flex gap-1">
          <span className="size-1.5 rounded-full bg-pink" />
          <span className="size-1.5 rounded-full bg-lilac" />
          <span className="size-1.5 rounded-full bg-canvas" />
        </span>
      </figcaption>

      <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 block size-full" role="img" aria-label={graph.description}>
        <defs>
          <linearGradient id="graph-soma" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
        </defs>

        <g strokeOpacity={0.28} strokeWidth={1}>
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={EDGE[p.kind]} />;
          })}
        </g>

        {animate &&
          ROUTES.map((r, i) => {
            const { d, total, hubAt, end } = measure(r.path);
            const dur = `${r.dur}s`;
            const begin = `${r.begin}s`;
            // Pink until the hub, lilac until the outcome, white on arrival.
            const colourTimes = `0;${f(hubAt)};${ARRIVE}`;
            const colours = `${PINK};${LILAC};${WHITE}`;
            return (
              <g key={i}>
                {/* A short trail moving with the pulse (both at constant speed, so they stay together). */}
                <path d={d} fill="none" stroke={PINK} strokeOpacity={0.7} strokeWidth={1.6} strokeLinecap="round" strokeDasharray={`16 ${Math.ceil(total) + 40}`} strokeDashoffset={16} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animate attributeName="stroke-dashoffset" from="16" to={`${-Math.ceil(total)}`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="stroke" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </path>
                {/* Hidden until its first run, or it would sit at the SVG origin. */}
                <circle r={3} fill={PINK} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion path={d} dur={dur} begin={begin} repeatCount="indefinite" calcMode="paced" />
                  <animate attributeName="fill" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
                {/* The hub flashes lilac as the pulse passes through it. */}
                <circle cx={hub.x} cy={hub.y} r={12} fill="none" stroke={LILAC} strokeWidth={1.5} opacity={0}>
                  <animate
                    attributeName="opacity"
                    values="0;0;0.9;0;0"
                    keyTimes={`0;${f(hubAt - 0.02)};${f(hubAt)};${f(Math.min(hubAt + 0.12, 0.99))};1`}
                    dur={dur}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="12;12;12;24;24"
                    keyTimes={`0;${f(hubAt - 0.02)};${f(hubAt)};${f(Math.min(hubAt + 0.12, 0.99))};1`}
                    dur={dur}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* The outcome rings out white on arrival. */}
                <circle cx={end.x} cy={end.y} r={7} fill="none" stroke={WHITE} strokeWidth={1.5} opacity={0}>
                  <animate attributeName="opacity" values="0;0;0.9;0" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.01};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="7;7;8;20" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.01};1`} dur={dur} begin={begin} repeatCount="indefinite" />
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
            <circle
              cx={n.x}
              cy={n.y}
              r={RADIUS[n.kind]}
              fill={FILL[n.kind]}
              fillOpacity={n.kind === "minor" ? 0.45 : 1}
              // Outcomes are white rings: where the line ends.
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
          <span className="size-2 rounded-full bg-pink" />
          {graph.legend.data}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-lilac" />
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
