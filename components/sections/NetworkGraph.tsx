"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/content/types";

/* An organic knowledge graph. Data sources gather loosely on one side,
   the intelligence layer in the middle around Knowledge, outcomes on the
   far side; unlabelled nodes fill the space between. Positions come from a
   small deterministic force layout and edges join nearest neighbours, so it
   reads like a real graph rather than a drawn shape. Slow pulses take
   shortest paths through Knowledge, changing colour as they go.

   Layout runs in normalised flow space: u along the flow (0 → 1), v across
   it. Desktop maps u to x; phones map u to y so the graph fills a tall screen.
   Only + - * / and Math.sqrt are used so every engine computes identical
   positions (server and client markup must match). */

type Kind = "data" | "intel" | "hub" | "outcome" | "minor";
interface Seed {
  id: string;
  kind: Kind;
  label?: string;
  u: [number, number]; // allowed range along the flow
}
interface LNode {
  id: string;
  kind: Kind;
  label?: string;
  u: number;
  v: number;
  uMin: number;
  uMax: number;
}

const SEEDS: Seed[] = [
  // Sources
  ...["ERP", "CRM", "Sensors", "Documents", "APIs", "Spreadsheets", "Legacy databases", "Event streams"].map(
    (label): Seed => ({ id: label, kind: "data", label, u: [0.03, 0.22] }),
  ),
  // Intelligence, either side of the hub
  ...["Customers", "Products", "Suppliers"].map((label): Seed => ({ id: label, kind: "intel", label, u: [0.3, 0.44] })),
  ...["Orders", "Assets", "Contracts"].map((label): Seed => ({ id: label, kind: "intel", label, u: [0.56, 0.7] })),
  // Outcomes
  ...["Forecasts", "Alerts", "Decisions", "Actions", "Reports", "Dashboards"].map(
    (label): Seed => ({ id: label, kind: "outcome", label, u: [0.8, 0.97] }),
  ),
  // Unlabelled nodes give the graph its texture
  ...Array.from({ length: 30 }, (_, i): Seed => ({ id: `m${i}`, kind: "minor", u: [0.06, 0.94] })),
];

const ASPECT = 1.85; // flow axis is this much longer than the cross axis
const HUB = "Knowledge";

/** Deterministic PRNG (mulberry32). */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist = (a: LNode, b: LNode) => {
  const du = (a.u - b.u) * ASPECT;
  const dv = a.v - b.v;
  return Math.sqrt(du * du + dv * dv);
};

function buildGraph() {
  const rand = rng(20261004);
  const nodes: LNode[] = SEEDS.map((s) => ({
    id: s.id,
    kind: s.kind,
    label: s.label,
    u: s.u[0] + rand() * (s.u[1] - s.u[0]),
    v: 0.08 + rand() * 0.84,
    uMin: s.u[0],
    uMax: s.u[1],
  }));
  nodes.push({ id: HUB, kind: "hub", label: HUB, u: 0.5, v: 0.5, uMin: 0.5, uMax: 0.5 });

  // Relax: push apart anything closer than its comfort distance.
  const comfort = (n: LNode) => (n.kind === "hub" ? 0.26 : n.kind === "minor" ? 0.1 : 0.15);
  for (let iter = 0; iter < 160; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const want = (comfort(a) + comfort(b)) / 2;
        const d = dist(a, b) || 0.0001;
        if (d >= want) continue;
        const push = ((want - d) / d) * 0.5;
        const du = (a.u - b.u) * push;
        const dv = (a.v - b.v) * push;
        if (a.kind !== "hub") {
          a.u += du / ASPECT;
          a.v += dv;
        }
        if (b.kind !== "hub") {
          b.u -= du / ASPECT;
          b.v -= dv;
        }
      }
    }
    for (const n of nodes) {
      if (n.kind === "hub") continue;
      n.u = Math.min(n.uMax, Math.max(n.uMin, n.u));
      n.v = Math.min(0.94, Math.max(0.06, n.v));
    }
  }

  // Edges: each node to its nearest neighbours (no long jumps), intelligence to the hub.
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const edges = new Map<string, [LNode, LNode]>();
  const add = (a: LNode, b: LNode) => edges.set(key(a.id, b.id), [a, b]);
  for (const n of nodes) {
    const k = n.kind === "minor" ? 2 : 3;
    nodes
      .filter((m) => m !== n && Math.abs(m.u - n.u) < 0.2)
      .sort((a, b) => dist(n, a) - dist(n, b))
      .slice(0, k)
      .forEach((m) => add(n, m));
  }
  const hub = nodes.find((n) => n.kind === "hub")!;
  nodes.filter((n) => n.kind === "intel").forEach((n) => add(n, hub));

  // Make sure everything is one connected graph.
  const parent = new Map(nodes.map((n) => [n.id, n.id]));
  const find = (id: string): string => (parent.get(id) === id ? id : find(parent.get(id)!));
  const union = (a: string, b: string) => parent.set(find(a), find(b));
  edges.forEach(([a, b]) => union(a.id, b.id));
  for (const n of nodes) {
    if (find(n.id) === find(hub.id)) continue;
    const nearest = nodes.filter((m) => find(m.id) === find(hub.id)).sort((a, b) => dist(n, a) - dist(n, b))[0];
    add(n, nearest);
    union(n.id, nearest.id);
  }

  return { nodes, edges: [...edges.values()], hub };
}

const GRAPH = buildGraph();

/** Shortest path by distance (Dijkstra) between two node ids. */
function shortestPath(from: string, to: string): LNode[] {
  const { nodes, edges } = GRAPH;
  const adj = new Map<string, LNode[]>(nodes.map((n) => [n.id, []]));
  edges.forEach(([a, b]) => {
    adj.get(a.id)!.push(b);
    adj.get(b.id)!.push(a);
  });
  const best = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, string>();
  const open = new Set([from]);
  while (open.size) {
    const id = [...open].sort((a, b) => best.get(a)! - best.get(b)!)[0];
    open.delete(id);
    if (id === to) break;
    const here = nodes.find((n) => n.id === id)!;
    for (const nb of adj.get(id)!) {
      const cost = best.get(id)! + dist(here, nb);
      if (cost < (best.get(nb.id) ?? Infinity)) {
        best.set(nb.id, cost);
        prev.set(nb.id, id);
        open.add(nb.id);
      }
    }
  }
  const path: string[] = [to];
  while (path[0] !== from) path.unshift(prev.get(path[0])!);
  return path.map((id) => nodes.find((n) => n.id === id)!);
}

/* Each pulse: a source, through Knowledge, to an outcome. */
const PAIRS: [string, string, number][] = [
  ["ERP", "Forecasts", 0],
  ["Sensors", "Alerts", 3],
  ["Documents", "Decisions", 6],
  ["CRM", "Dashboards", 9],
  ["Event streams", "Actions", 12],
  ["Spreadsheets", "Reports", 15],
];
const ROUTES = PAIRS.map(([from, to, begin]) => {
  const first = shortestPath(from, HUB);
  const second = shortestPath(HUB, to);
  return { nodes: [...first, ...second.slice(1)], hubIndex: first.length - 1, begin };
});

/* Rich takes on the brand palette, each staying in its family.
   SMIL animations can't read CSS variables, so these are literal. */
const C = {
  pink: "#E5097A",
  pinkLight: "#F7147F",
  violet: "#7A0BB0",
  violetLight: "#9B2FCC",
  plum: "#3D0B52",
  minor: "#B9A7C6",
};
const FILL: Record<Kind, string> = { data: C.pink, intel: C.violet, hub: "", outcome: C.plum, minor: C.minor };

function tone(n: LNode) {
  if (n.kind === "data") return C.pinkLight;
  if (n.kind === "outcome") return C.plum;
  if (n.kind === "minor") return n.u < 0.38 ? C.pinkLight : n.u > 0.62 ? C.plum : C.violetLight;
  return C.violetLight;
}

interface Frame {
  id: string;
  w: number;
  h: number;
  pad: number;
  vertical: boolean;
  r: Record<Kind, number>;
  font: number;
  speed: number;
}

function Graph({ frame, animate, description, className }: { frame: Frame; animate: boolean; description: string; className: string }) {
  const { w, h, pad, vertical, r } = frame;
  const pos = (n: LNode) =>
    vertical ? { x: pad + n.v * (w - 2 * pad), y: pad + n.u * (h - 2 * pad) } : { x: pad + n.u * (w - 2 * pad), y: pad + n.v * (h - 2 * pad) };
  const hub = pos(GRAPH.hub);
  const id = (s: string) => `${frame.id}-${s.replace(/\W/g, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className={className} role="img" aria-label={description}>
      <defs>
        <linearGradient id={id("soma")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-soma-from)" />
          <stop offset="1" stopColor="var(--color-soma-to)" />
        </linearGradient>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor={C.violetLight} stopOpacity={0.3} />
          <stop offset="1" stopColor={C.violetLight} stopOpacity={0} />
        </radialGradient>
        {GRAPH.edges.map(([a, b]) => {
          const p = pos(a);
          const q = pos(b);
          return (
            <linearGradient key={`${a.id}-${b.id}`} id={id(`e-${a.id}-${b.id}`)} gradientUnits="userSpaceOnUse" x1={p.x} y1={p.y} x2={q.x} y2={q.y}>
              <stop offset="0" stopColor={tone(a)} />
              <stop offset="1" stopColor={tone(b)} />
            </linearGradient>
          );
        })}
      </defs>

      <circle cx={hub.x} cy={hub.y} r={r.hub * 5} fill={`url(#${id("glow")})`} />

      <g strokeLinecap="round">
        {GRAPH.edges.map(([a, b]) => {
          const p = pos(a);
          const q = pos(b);
          const quiet = a.kind === "minor" && b.kind === "minor";
          return (
            <line
              key={`${a.id}-${b.id}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke={`url(#${id(`e-${a.id}-${b.id}`)})`}
              strokeWidth={quiet ? r.minor * 0.35 : r.minor * 0.5}
              strokeOpacity={quiet ? 0.3 : 0.5}
            />
          );
        })}
      </g>

      {animate &&
        ROUTES.map((route, i) => {
          const pts = route.nodes.map(pos);
          let total = 0;
          let toHub = 0;
          pts.forEach((p, k) => {
            if (k === 0) return;
            const dx = p.x - pts[k - 1].x;
            const dy = p.y - pts[k - 1].y;
            total += Math.sqrt(dx * dx + dy * dy);
            if (k === route.hubIndex) toHub = total;
          });
          const hubAt = toHub / total;
          const d = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L");
          const end = pts[pts.length - 1];
          const dur = `${(total / frame.speed).toFixed(1)}s`;
          const begin = `${route.begin}s`;
          const f = (n: number) => n.toFixed(3);
          const colourTimes = `0;${f(hubAt)};0.97`;
          const colours = `${C.pinkLight};${C.violetLight};${C.plum}`;
          const hubTimes = `0;${f(hubAt - 0.012)};${f(hubAt)};${f(Math.min(hubAt + 0.07, 0.99))};1`;
          const trail = r.data * 3;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.pinkLight} strokeOpacity={0.8} strokeWidth={r.minor * 0.8} strokeLinecap="round" strokeDasharray={`${trail} ${Math.ceil(total) + 2 * trail}`} strokeDashoffset={trail} opacity={0}>
                <set attributeName="opacity" to="1" begin={begin} />
                <animate attributeName="stroke-dashoffset" from={`${trail}`} to={`${-Math.ceil(total)}`} dur={dur} begin={begin} repeatCount="indefinite" />
                <animate attributeName="stroke" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
              </path>
              {/* Hidden until its first run, or it would sit at the SVG origin. */}
              <circle r={r.minor * 1.2} fill={C.pinkLight} opacity={0}>
                <set attributeName="opacity" to="1" begin={begin} />
                <animateMotion path={d} dur={dur} begin={begin} repeatCount="indefinite" calcMode="paced" />
                <animate attributeName="fill" values={colours} keyTimes={colourTimes} calcMode="discrete" dur={dur} begin={begin} repeatCount="indefinite" />
              </circle>
              <circle cx={hub.x} cy={hub.y} r={r.hub * 1.2} fill="none" stroke={C.violetLight} strokeWidth={r.minor * 0.5} opacity={0}>
                <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
                <animate attributeName="r" values={`${r.hub * 1.2};${r.hub * 1.2};${r.hub * 1.2};${r.hub * 2.6};${r.hub * 2.6}`} keyTimes={hubTimes} dur={dur} begin={begin} repeatCount="indefinite" />
              </circle>
              <circle cx={end.x} cy={end.y} r={r.outcome * 1.2} fill="none" stroke={C.plum} strokeWidth={r.minor * 0.5} opacity={0}>
                <animate attributeName="opacity" values="0;0;0.8;0" keyTimes="0;0.96;0.975;1" dur={dur} begin={begin} repeatCount="indefinite" />
                <animate attributeName="r" values={`${r.outcome * 1.2};${r.outcome * 1.2};${r.outcome * 1.3};${r.outcome * 3}`} keyTimes="0;0.96;0.975;1" dur={dur} begin={begin} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

      {GRAPH.nodes.map((n) => {
        const p = pos(n);
        const rad = r[n.kind];
        return (
          <g key={n.id}>
            {n.kind === "hub" && (
              <circle cx={p.x} cy={p.y} r={rad * 1.6} fill="none" stroke={C.violetLight} strokeOpacity={0.45} strokeWidth={r.minor * 0.4}>
                {animate && <animate attributeName="r" values={`${rad * 1.5};${rad * 1.9};${rad * 1.5}`} dur="4s" repeatCount="indefinite" />}
              </circle>
            )}
            {n.kind !== "minor" && n.kind !== "hub" && <circle cx={p.x} cy={p.y} r={rad * 1.7} fill={FILL[n.kind]} fillOpacity={0.12} />}
            <circle cx={p.x} cy={p.y} r={rad} fill={n.kind === "hub" ? `url(#${id("soma")})` : FILL[n.kind]} fillOpacity={n.kind === "minor" ? 0.65 : 1} />
            {n.kind === "outcome" && <circle cx={p.x} cy={p.y} r={rad * 0.38} fill="var(--color-canvas)" />}
            {n.label && (
              <text
                x={p.x}
                y={p.y + rad * (n.kind === "hub" ? 2.4 : 1.7) + frame.font * 0.35}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={n.kind === "hub" ? frame.font * 1.15 : frame.font}
                fill={n.kind === "hub" ? "var(--color-ink)" : "var(--color-muted)"}
                fontWeight={n.kind === "hub" ? 600 : 500}
                fontFamily="var(--font-sans)"
                // A white halo lets edges pass cleanly behind the label.
                stroke="var(--color-canvas)"
                strokeWidth={frame.font * 0.35}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const WIDE: Frame = { id: "ngw", w: 1600, h: 860, pad: 70, vertical: false, r: { data: 11, intel: 10, hub: 20, outcome: 11, minor: 4 }, font: 17, speed: 80 };
const TALL: Frame = { id: "ngt", w: 420, h: 820, pad: 40, vertical: true, r: { data: 7, intel: 6.5, hub: 13, outcome: 7, minor: 2.6 }, font: 11.5, speed: 40 };

export function NetworkGraph({ graph, headingId }: { graph: HomeContent["hero"]["graph"]; headingId: string }) {
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
    <figure className="flex h-full flex-col text-ink">
      <figcaption>
        <h2 id={headingId} className="text-h2">
          {graph.caption}
        </h2>
      </figcaption>
      <div className="relative mt-6 min-h-0 flex-1">
        <Graph frame={WIDE} animate={animate} description={graph.description} className="absolute inset-0 hidden size-full md:block" />
        <Graph frame={TALL} animate={animate} description={graph.description} className="absolute inset-0 size-full md:hidden" />
      </div>
      <ul aria-hidden className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-body font-semibold text-ink">
        <li className="flex items-center gap-2.5">
          <span className="size-3.5 rounded-full" style={{ background: C.pink }} />
          {graph.legend.data}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="size-3.5 rounded-full" style={{ background: C.violet }} />
          {graph.legend.intelligence}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="size-3.5 rounded-full" style={{ background: C.plum }} />
          {graph.legend.outcomes}
        </li>
      </ul>
    </figure>
  );
}
