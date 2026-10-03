"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* A knowledge graph on a symmetric grid, mirrored top to bottom around the
   Knowledge hub: five sources, a diamond of four intelligence nodes, three
   outcomes. Pulses change colour as data becomes intelligence, then an outcome. */

type Kind = "data" | "intel" | "hub" | "outcome" | "relay";
type LabelSide = "left" | "right" | "above" | "below";
interface GNode {
  id: string;
  x: number;
  y: number;
  kind: Kind;
  label?: string;
  side?: LabelSide;
}

const W = 480;
const H = 270;
const CY = H / 2;

const NODES: GNode[] = [
  // Sources: one column, evenly spaced around the centre line
  { id: "erp", x: 78, y: CY - 100, kind: "data", label: "ERP", side: "left" },
  { id: "crm", x: 78, y: CY - 50, kind: "data", label: "CRM", side: "left" },
  { id: "sensors", x: 78, y: CY, kind: "data", label: "Sensors", side: "left" },
  { id: "docs", x: 78, y: CY + 50, kind: "data", label: "Documents", side: "left" },
  { id: "apis", x: 78, y: CY + 100, kind: "data", label: "APIs", side: "left" },
  // Relays between sources and the intelligence layer (mirrored pair)
  { id: "r1", x: 128, y: CY - 26, kind: "relay" },
  { id: "r2", x: 128, y: CY + 26, kind: "relay" },
  // Intelligence: a diamond around the hub
  { id: "customers", x: 170, y: CY - 66, kind: "intel", label: "Customers", side: "above" },
  { id: "orders", x: 310, y: CY - 66, kind: "intel", label: "Orders", side: "above" },
  { id: "assets", x: 170, y: CY + 66, kind: "intel", label: "Assets", side: "below" },
  { id: "contracts", x: 310, y: CY + 66, kind: "intel", label: "Contracts", side: "below" },
  { id: "hub", x: 240, y: CY, kind: "hub", label: "Knowledge", side: "below" },
  // Relays before the outcomes (mirrored pair)
  { id: "r3", x: 362, y: CY - 100, kind: "relay" },
  { id: "r4", x: 362, y: CY + 100, kind: "relay" },
  // Outcomes: one column, evenly spaced
  { id: "forecast", x: 404, y: CY - 60, kind: "outcome", label: "Forecast", side: "right" },
  { id: "alerts", x: 404, y: CY, kind: "outcome", label: "Alerts", side: "right" },
  { id: "decisions", x: 404, y: CY + 60, kind: "outcome", label: "Decisions", side: "right" },
];

/* Listed as mirrored pairs so the drawing stays symmetric. */
const EDGES: [string, string][] = [
  ["erp", "customers"], ["apis", "assets"],
  ["crm", "customers"], ["docs", "assets"],
  ["crm", "r1"], ["docs", "r2"],
  ["sensors", "r1"], ["sensors", "r2"],
  ["r1", "hub"], ["r2", "hub"],
  ["customers", "hub"], ["assets", "hub"],
  ["orders", "hub"], ["contracts", "hub"],
  ["customers", "orders"], ["assets", "contracts"],
  ["orders", "r3"], ["contracts", "r4"],
  ["r3", "forecast"], ["r4", "decisions"],
  ["orders", "forecast"], ["contracts", "decisions"],
  ["hub", "forecast"], ["hub", "decisions"],
  ["hub", "alerts"],
];

/* Pulse routes, also in mirrored pairs; every route passes through the hub. */
const ROUTES: { path: string[]; dur: number; begin: number }[] = [
  { path: ["erp", "customers", "hub", "forecast"], dur: 3.6, begin: 0 },
  { path: ["apis", "assets", "hub", "decisions"], dur: 3.6, begin: 1.8 },
  { path: ["sensors", "r1", "hub", "alerts"], dur: 3.0, begin: 0.9 },
  { path: ["crm", "customers", "orders", "hub", "decisions"], dur: 4.4, begin: 2.6 },
  { path: ["docs", "assets", "contracts", "hub", "forecast"], dur: 4.4, begin: 0.4 },
];

const at = (id: string) => NODES.find((n) => n.id === id)!;

/* Rich takes on the brand palette, each staying in its family.
   SMIL animations can't read CSS variables, so these are literal. */
const C = {
  pink: "#E5097A", // data: a deeper, richer pink
  pinkLight: "#F7147F",
  violet: "#7A0BB0", // intelligence: saturated violet
  violetLight: "#9B2FCC",
  plum: "#3D0B52", // outcomes: brand plum, ink's family on light
  relay: "#B9A7C6", // muted lilac-grey for structural relays
};

const NODE_COLOUR: Record<Kind, string> = {
  data: C.pink,
  intel: C.violet,
  hub: "url(#ng-soma)",
  outcome: C.plum,
  relay: C.relay,
};
const RADIUS: Record<Kind, number> = { data: 7, intel: 7, hub: 12, outcome: 8, relay: 3 };

/* Edge colour follows the layers it joins: data → intelligence → outcome. */
function edgeColours(a: GNode, b: GNode): [string, string] {
  const tone = (n: GNode) =>
    n.kind === "data" ? C.pinkLight : n.kind === "outcome" ? C.plum : n.kind === "relay" ? (n.x < 240 ? C.pinkLight : C.violetLight) : C.violetLight;
  return [tone(a), tone(b)];
}

/** Path data, length, and the share of the trip completed on reaching the hub. */
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

function labelProps(n: GNode) {
  const gap = RADIUS[n.kind] + 9;
  switch (n.side) {
    case "left":
      return { x: n.x - gap, y: n.y, textAnchor: "end" as const, dominantBaseline: "middle" as const };
    case "right":
      return { x: n.x + gap, y: n.y, textAnchor: "start" as const, dominantBaseline: "middle" as const };
    case "above":
      return { x: n.x, y: n.y - gap - 2, textAnchor: "middle" as const, dominantBaseline: "auto" as const };
    default:
      // The hub's label clears its glow ring.
      return { x: n.x, y: n.y + (n.kind === "hub" ? 34 : gap + 2), textAnchor: "middle" as const, dominantBaseline: "hanging" as const };
  }
}

const ARRIVE = 0.96;
const f = (n: number) => n.toFixed(3);

export function NetworkGraph({ graph }: { graph: HomeContent["hero"]["graph"] }) {
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
    <figure className="text-ink">
      <figcaption className="text-center text-caption text-muted">{graph.caption}</figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="mt-6 block aspect-[16/9] w-full overflow-visible" role="img" aria-label={graph.description}>
        <defs>
          <linearGradient id="ng-soma" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
          <radialGradient id="ng-glow">
            <stop offset="0" stopColor={C.violetLight} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.violetLight} stopOpacity={0} />
          </radialGradient>
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            const [from, to] = edgeColours(p, q);
            return (
              <linearGradient key={`${a}-${b}`} id={`ng-e-${a}-${b}`} gradientUnits="userSpaceOnUse" x1={p.x} y1={p.y} x2={q.x} y2={q.y}>
                <stop offset="0" stopColor={from} />
                <stop offset="1" stopColor={to} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Soft glow behind the hub */}
        <circle cx={hub.x} cy={hub.y} r={48} fill="url(#ng-glow)" />

        <g strokeOpacity={0.4} strokeWidth={1.2} strokeLinecap="round">
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={`url(#ng-e-${a}-${b})`} />;
          })}
        </g>

        {animate &&
          ROUTES.map((r, i) => {
            const { d, total, hubAt, end } = measure(r.path);
            const dur = `${r.dur}s`;
            const begin = `${r.begin}s`;
            // Pink until the hub, violet until the outcome, plum on arrival.
            const colourTimes = `0;${f(hubAt)};${ARRIVE}`;
            const colours = `${C.pinkLight};${C.violetLight};${C.plum}`;
            const hubTimes = `0;${f(hubAt - 0.02)};${f(hubAt)};${f(Math.min(hubAt + 0.12, 0.99))};1`;
            return (
              <g key={i}>
                {/* A short trail moving with the pulse (both at constant speed, so they stay together). */}
                <path d={d} fill="none" stroke={C.pinkLight} strokeOpacity={0.75} strokeWidth={2} strokeLinecap="round" strokeDasharray={`18 ${Math.ceil(total) + 40}`} strokeDashoffset={18} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animate attributeName="stroke-dashoffset" from="18" to={`${-Math.ceil(total)}`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="stroke" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </path>
                {/* Hidden until its first run, or it would sit at the SVG origin. */}
                <circle r={3.4} fill={C.pinkLight} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion path={d} dur={dur} begin={begin} repeatCount="indefinite" calcMode="paced" />
                  <animate attributeName="fill" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
                {/* The hub flashes violet as the pulse passes through it. */}
                <circle cx={hub.x} cy={hub.y} r={14} fill="none" stroke={C.violetLight} strokeWidth={1.5} opacity={0}>
                  <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="14;14;14;28;28" keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
                {/* The outcome rings out plum on arrival. */}
                <circle cx={end.x} cy={end.y} r={9} fill="none" stroke={C.plum} strokeWidth={1.5} opacity={0}>
                  <animate attributeName="opacity" values="0;0;0.8;0" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.01};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="9;9;10;22" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.01};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

        {NODES.map((n) => (
          <g key={n.id}>
            {n.kind === "hub" && (
              <circle cx={n.x} cy={n.y} r={20} fill="none" stroke={C.violetLight} strokeOpacity={0.45} strokeWidth={1.2}>
                {animate && <animate attributeName="r" values="18;23;18" dur="3.2s" repeatCount="indefinite" />}
              </circle>
            )}
            {/* Halo: a soft ring in the node's own colour gives depth on white. */}
            {n.kind !== "relay" && n.kind !== "hub" && <circle cx={n.x} cy={n.y} r={RADIUS[n.kind] + 5} fill={NODE_COLOUR[n.kind]} fillOpacity={0.12} />}
            <circle cx={n.x} cy={n.y} r={RADIUS[n.kind]} fill={NODE_COLOUR[n.kind]} />
            {n.kind === "outcome" && <circle cx={n.x} cy={n.y} r={3} fill="var(--color-canvas)" />}
            {n.label && (
              <text
                {...labelProps(n)}
                // Larger on small screens, where the whole graph is drawn small.
                className="text-[12px] sm:text-[10px] md:text-[8.5px]"
                fill={n.kind === "hub" ? "var(--color-ink)" : "var(--color-muted)"}
                fontWeight={n.kind === "hub" ? 600 : 500}
                fontFamily="var(--font-sans)"
              >
                {n.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      <ul aria-hidden className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-caption text-muted">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: C.pink }} />
          {graph.legend.data}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: C.violet }} />
          {graph.legend.intelligence}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: C.plum }} />
          {graph.legend.outcomes}
        </li>
      </ul>
    </figure>
  );
}
