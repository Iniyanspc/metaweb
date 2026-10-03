"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* The knowledge graph, with its nodes arranged in an infinity: sources around
   the left loop, outcomes around the right, the intelligence layer on the
   four arms, and Knowledge at the crossing. Nodes are joined by straight
   edges; slow pulses hop node to node, changing colour as data becomes
   intelligence and then an outcome. The curve only places the nodes. */

const W = 480;
const H = 270;
const CX = W / 2;
const CY = H / 2;
const A = 190; // half-width of the infinity
const STRETCH = 1.45; // taller lobes than a pure lemniscate

const deg = (d: number) => (d * Math.PI) / 180;

/** Lemniscate of Bernoulli, used to place nodes. t=0° right tip, 90°/270° the crossing, 180° left tip. */
function curve(tDeg: number) {
  const t = deg(tDeg);
  const s = Math.sin(t);
  const c = Math.cos(t);
  const k = 1 + s * s;
  return { x: CX + (A * c) / k, y: CY + (STRETCH * A * s * c) / k };
}

type Kind = "data" | "intel" | "hub" | "outcome" | "relay";
interface GNode {
  id: string;
  t?: number; // position on the curve, degrees
  x: number;
  y: number;
  kind: Kind;
  label?: string;
}

const onCurve = (id: string, t: number, kind: Kind, label: string): GNode => ({ id, t, kind, label, ...curve(t) });

// Lobe centres, used for spokes and for placing labels outside the loops.
const LEFT_FOCUS = { x: CX - A * 0.62, y: CY };
const RIGHT_FOCUS = { x: CX + A * 0.62, y: CY };

const NODES: GNode[] = [
  // Left lobe: data sources, top to bottom
  onCurve("erp", 140, "data", "ERP"),
  onCurve("crm", 160, "data", "CRM"),
  onCurve("sensors", 180, "data", "Sensors"),
  onCurve("docs", 200, "data", "Documents"),
  onCurve("apis", 220, "data", "APIs"),
  // The four arms into the crossing: intelligence
  onCurve("customers", 121, "intel", "Customers"),
  onCurve("assets", 239, "intel", "Assets"),
  onCurve("orders", 301, "intel", "Orders"),
  onCurve("contracts", 59, "intel", "Contracts"),
  // Right lobe: outcomes, top to bottom
  onCurve("forecast", 320, "outcome", "Forecast"),
  onCurve("alerts", 340, "outcome", "Alerts"),
  onCurve("decisions", 0, "outcome", "Decisions"),
  onCurve("actions", 20, "outcome", "Actions"),
  onCurve("reports", 40, "outcome", "Reports"),
  // The crossing
  { id: "hub", x: CX, y: CY, kind: "hub", label: "Knowledge" },
  // Lobe centres: quiet relays that tie each loop together
  { id: "lf", ...LEFT_FOCUS, kind: "relay" },
  { id: "rf", ...RIGHT_FOCUS, kind: "relay" },
];

const at = (id: string) => NODES.find((n) => n.id === id)!;

/* Straight edges, listed as mirrored pairs: a chain around each loop, the
   arms into the crossing, and spokes from each loop's centre. */
const EDGES: [string, string][] = [
  // Around the loops
  ["customers", "erp"], ["orders", "forecast"],
  ["erp", "crm"], ["forecast", "alerts"],
  ["crm", "sensors"], ["alerts", "decisions"],
  ["sensors", "docs"], ["decisions", "actions"],
  ["docs", "apis"], ["actions", "reports"],
  ["apis", "assets"], ["reports", "contracts"],
  // Cross-links that tie each loop to its arms
  ["crm", "customers"], ["alerts", "orders"],
  ["docs", "assets"], ["actions", "contracts"],
  // The arms into the crossing
  ["customers", "hub"], ["orders", "hub"],
  ["assets", "hub"], ["contracts", "hub"],
  // Spokes from each loop's centre
  ["lf", "erp"], ["rf", "forecast"],
  ["lf", "crm"], ["rf", "alerts"],
  ["lf", "sensors"], ["rf", "decisions"],
  ["lf", "docs"], ["rf", "actions"],
  ["lf", "apis"], ["rf", "reports"],
  ["lf", "customers"], ["rf", "orders"],
  ["lf", "assets"], ["rf", "contracts"],
];

/* Pulse routes through Knowledge, crossing over as the infinity does:
   upper-left to lower-right, lower-left to upper-right. */
const ROUTES: { path: string[]; begin: number }[] = [
  { path: ["erp", "customers", "hub", "contracts", "reports"], begin: 0 },
  { path: ["apis", "assets", "hub", "orders", "forecast"], begin: 3.5 },
  { path: ["sensors", "lf", "customers", "hub", "contracts", "rf", "decisions"], begin: 7 },
  { path: ["crm", "erp", "customers", "hub", "contracts", "reports", "actions"], begin: 10.5 },
  { path: ["docs", "apis", "assets", "hub", "orders", "forecast", "alerts"], begin: 14 },
];
const SPEED = 30; // user units per second: slow and steady

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
  const d = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L");
  return { d, total, hubAt: toHub / total, end: pts[pts.length - 1] };
}

/* Rich takes on the brand palette, each staying in its family.
   SMIL animations can't read CSS variables, so these are literal. */
const C = {
  pink: "#E5097A",
  pinkLight: "#F7147F",
  violet: "#7A0BB0",
  violetLight: "#9B2FCC",
  plum: "#3D0B52",
  relay: "#B9A7C6",
};
const NODE_COLOUR: Record<Kind, string> = { data: C.pink, intel: C.violet, hub: "url(#ng-soma)", outcome: C.plum, relay: C.relay };
const RADIUS: Record<Kind, number> = { data: 7, intel: 6.5, hub: 13, outcome: 7, relay: 3 };

/* Edge colour follows the layers it joins: data → intelligence → outcome. */
function tone(n: GNode) {
  if (n.kind === "data") return C.pinkLight;
  if (n.kind === "outcome") return C.plum;
  if (n.kind === "relay") return n.x < CX ? C.pinkLight : C.plum;
  return C.violetLight;
}

/** Labels sit outside the loops: away from the lobe centre, or above/below on the arms. */
function labelProps(n: GNode) {
  if (n.kind === "hub") return { x: n.x, y: n.y + 40, textAnchor: "middle" as const, dominantBaseline: "hanging" as const };
  const gap = RADIUS[n.kind] + 9;
  if (n.kind === "intel") {
    const up = n.y < CY;
    return { x: n.x, y: up ? n.y - gap : n.y + gap, textAnchor: "middle" as const, dominantBaseline: up ? ("auto" as const) : ("hanging" as const) };
  }
  const focus = n.x < CX ? LEFT_FOCUS : RIGHT_FOCUS;
  const dx = n.x - focus.x;
  const dy = n.y - focus.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x: n.x + ux * gap,
    y: n.y + uy * gap,
    textAnchor: ux < -0.3 ? ("end" as const) : ux > 0.3 ? ("start" as const) : ("middle" as const),
    dominantBaseline: uy < -0.5 ? ("auto" as const) : uy > 0.5 ? ("hanging" as const) : ("middle" as const),
  };
}

const ARRIVE = 0.97;
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

  return (
    <figure className="text-ink">
      <figcaption className="text-center text-caption text-muted">{graph.caption}</figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="mt-6 block aspect-[16/9] w-full overflow-visible" role="img" aria-label={graph.description}>
        <defs>
          <linearGradient id="ng-soma" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            return (
              <linearGradient key={`${a}-${b}`} id={`ng-e-${a}-${b}`} gradientUnits="userSpaceOnUse" x1={p.x} y1={p.y} x2={q.x} y2={q.y}>
                <stop offset="0" stopColor={tone(p)} />
                <stop offset="1" stopColor={tone(q)} />
              </linearGradient>
            );
          })}
          <radialGradient id="ng-glow">
            <stop offset="0" stopColor={C.violetLight} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.violetLight} stopOpacity={0} />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={52} fill="url(#ng-glow)" />

        <g strokeLinecap="round">
          {EDGES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            const spoke = p.kind === "relay";
            return (
              <line
                key={`${a}-${b}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke={`url(#ng-e-${a}-${b})`}
                strokeWidth={spoke ? 1 : 1.6}
                strokeOpacity={spoke ? 0.22 : 0.5}
              />
            );
          })}
        </g>

        {animate &&
          ROUTES.map((r, i) => {
            const { d, total, hubAt, end } = measure(r.path);
            const dur = `${(total / SPEED).toFixed(1)}s`;
            const begin = `${r.begin}s`;
            // Pink until the crossing, violet until the outcome, plum on arrival.
            const colourTimes = `0;${f(hubAt)};${ARRIVE}`;
            const colours = `${C.pinkLight};${C.violetLight};${C.plum}`;
            const hubTimes = `0;${f(hubAt - 0.015)};${f(hubAt)};${f(Math.min(hubAt + 0.08, 0.99))};1`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={C.pinkLight} strokeOpacity={0.8} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={`26 ${Math.ceil(total) + 60}`} strokeDashoffset={26} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animate attributeName="stroke-dashoffset" from="26" to={`${-Math.ceil(total)}`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="stroke" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </path>
                {/* Hidden until its first run, or it would sit at the SVG origin. */}
                <circle r={3.8} fill={C.pinkLight} opacity={0}>
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion path={d} dur={dur} begin={begin} repeatCount="indefinite" calcMode="paced" />
                  <animate attributeName="fill" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
                <circle cx={CX} cy={CY} r={15} fill="none" stroke={C.violetLight} strokeWidth={1.5} opacity={0}>
                  <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="15;15;15;32;32" keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
                <circle cx={end.x} cy={end.y} r={9} fill="none" stroke={C.plum} strokeWidth={1.5} opacity={0}>
                  <animate attributeName="opacity" values="0;0;0.8;0" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.005};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                  <animate attributeName="r" values="9;9;10;22" keyTimes={`0;${ARRIVE - 0.01};${ARRIVE + 0.005};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

        {NODES.map((n) => (
          <g key={n.id}>
            {n.kind === "hub" && (
              <circle cx={n.x} cy={n.y} r={21} fill="none" stroke={C.violetLight} strokeOpacity={0.45} strokeWidth={1.2}>
                {animate && <animate attributeName="r" values="19;24;19" dur="4s" repeatCount="indefinite" />}
              </circle>
            )}
            {n.kind !== "relay" && n.kind !== "hub" && <circle cx={n.x} cy={n.y} r={RADIUS[n.kind] + 5} fill={NODE_COLOUR[n.kind]} fillOpacity={0.12} />}
            <circle cx={n.x} cy={n.y} r={RADIUS[n.kind]} fill={NODE_COLOUR[n.kind]} />
            {n.kind === "outcome" && <circle cx={n.x} cy={n.y} r={2.8} fill="var(--color-canvas)" />}
            {n.label && (
              <text
                {...labelProps(n)}
                // Larger on small screens, where the whole graph is drawn small.
                className="text-[12px] sm:text-[10px] md:text-[8.5px]"
                fill={n.kind === "hub" ? "var(--color-ink)" : "var(--color-muted)"}
                fontWeight={n.kind === "hub" ? 600 : 500}
                fontFamily="var(--font-sans)"
                // A white halo lets lines pass cleanly behind the label.
                stroke="var(--color-canvas)"
                strokeWidth={4}
                strokeLinejoin="round"
                paintOrder="stroke"
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
