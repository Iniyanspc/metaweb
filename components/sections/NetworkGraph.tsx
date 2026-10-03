"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* The knowledge graph as an infinity loop. Sources sit on the left lobe,
   outcomes on the right, the intelligence layer on the four arms, and
   Knowledge at the crossing. Pulses travel the curve itself, slowly,
   changing colour as data becomes intelligence and then an outcome. */

const W = 480;
const H = 270;
const CX = W / 2;
const CY = H / 2;
const A = 190; // half-width of the infinity
const STRETCH = 1.45; // taller lobes than a pure lemniscate

const deg = (d: number) => (d * Math.PI) / 180;

/** Lemniscate of Bernoulli. t=0° right tip, 90° and 270° the crossing, 180° left tip. */
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

/* Faint spokes from each lobe centre, mirrored left and right. */
const SPOKES: [string, string][] = [
  ...["erp", "crm", "sensors", "docs", "apis", "customers", "assets"].map((id) => ["lf", id] as [string, string]),
  ...["forecast", "alerts", "decisions", "actions", "reports", "orders", "contracts"].map((id) => ["rf", id] as [string, string]),
];

/* Pulses: a source travels the curve through the crossing to an outcome on
   the other lobe. Upper-left arms cross to lower-right and lower-left to
   upper-right, exactly as the infinity does. */
const ROUTES: { from: number; to: number; begin: number }[] = [
  { from: 140, to: 40, begin: 0 }, // ERP → Reports
  { from: 220, to: 320, begin: 3.5 }, // APIs → Forecast
  { from: 180, to: 0, begin: 7 }, // Sensors → (right tip) Decisions
  { from: 160, to: 20, begin: 10.5 }, // CRM → Actions
  { from: 200, to: 340, begin: 14 }, // Documents → Alerts
];
const SPEED = 30; // user units per second: slow and steady

/** Path along the curve from one parameter to another, through the crossing. */
function routePath(from: number, to: number) {
  // Upper-left sources run down in t through 90°; lower-left sources run up through 270°.
  const dir = from < 180 || (from === 180 && to <= 90) ? -1 : 1;
  const target = dir === -1 ? (to > from ? to - 360 : to) : to < from ? to + 360 : to;
  const pts: { x: number; y: number }[] = [];
  for (let t = from; dir === -1 ? t >= target : t <= target; t += dir * 2) pts.push(curve(t));
  pts.push(curve(target));
  let total = 0;
  let toHub = 0;
  const crossing = dir === -1 ? 90 : 270;
  pts.forEach((p, i) => {
    if (i === 0) return;
    total += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
    const t = from + dir * 2 * i;
    if (toHub === 0 && (dir === -1 ? t <= crossing : t >= crossing)) toHub = total;
  });
  const d = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L");
  return { d, total, hubAt: toHub / total, end: curve(to) };
}

/** The whole infinity as one smooth closed path. */
const INFINITY = (() => {
  const pts: string[] = [];
  for (let t = 0; t <= 360; t += 2) {
    const p = curve(t);
    pts.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
})();

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
          {/* The loop shifts colour left to right: data, intelligence at the crossing, outcomes. */}
          <linearGradient id="ng-loop" gradientUnits="userSpaceOnUse" x1={CX - A} y1={CY} x2={CX + A} y2={CY}>
            <stop offset="0" stopColor={C.pinkLight} />
            <stop offset="0.5" stopColor={C.violetLight} />
            <stop offset="1" stopColor={C.plum} />
          </linearGradient>
          <radialGradient id="ng-glow">
            <stop offset="0" stopColor={C.violetLight} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.violetLight} stopOpacity={0} />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={52} fill="url(#ng-glow)" />

        {/* Spokes inside each lobe */}
        <g strokeWidth={1} strokeOpacity={0.22}>
          {SPOKES.map(([a, b]) => {
            const p = at(a);
            const q = at(b);
            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={p.x < CX ? C.pinkLight : C.plum} />;
          })}
        </g>

        {/* The infinity */}
        <path d={INFINITY} fill="none" stroke="url(#ng-loop)" strokeWidth={2.2} strokeOpacity={0.55} />

        {animate &&
          ROUTES.map((r, i) => {
            const { d, total, hubAt, end } = routePath(r.from, r.to);
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
