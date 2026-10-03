"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { MARK_GEOMETRY, markNode, type MarkNode } from "./Logo";
import styles from "./NetworkHero.module.css";

/** Tight crop around the mark; labels overflow into the surrounding layout. */
const VIEWBOX = "-142 -138 265 245";
const LABEL_SIZE = 7;
const ROLE_FILL = { data: "var(--color-pink)", ai: "var(--color-violet)", outcome: "var(--color-ink)" } as const;

/* Load-sequence phase and stagger index for each node. */
const PHASE: Record<string, { cls: "dataNode" | "aiNode" | "chainNode"; i: number }> = {
  erp: { cls: "dataNode", i: 0 },
  crm: { cls: "dataNode", i: 1 },
  docs: { cls: "dataNode", i: 2 },
  iot: { cls: "dataNode", i: 3 },
  apis: { cls: "dataNode", i: 4 },
  models: { cls: "aiNode", i: 0 },
  knowledge: { cls: "aiNode", i: 1 },
  quality: { cls: "aiNode", i: 2 },
  governance: { cls: "aiNode", i: 3 },
  search: { cls: "aiNode", i: 4 },
  decisions: { cls: "chainNode", i: 0 },
  actions: { cls: "chainNode", i: 1 },
  outcomes: { cls: "chainNode", i: 2 },
};

/* Labels sit outward from the soma, except where that would collide. */
const LABEL_OVERRIDE: Record<string, "above" | "below"> = {
  decisions: "below",
  actions: "above",
  quality: "below",
};

function labelPosition(n: MarkNode) {
  const { soma } = MARK_GEOMETRY;
  const gap = n.r + 5;
  const override = LABEL_OVERRIDE[n.id];
  if (override === "above") return { x: n.x, y: n.y - gap - 1, anchor: "middle" as const, baseline: "auto" as const };
  if (override === "below") return { x: n.x, y: n.y + gap, anchor: "middle" as const, baseline: "hanging" as const };
  const dx = n.x - soma.x;
  const dy = n.y - soma.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x: n.x + ux * gap,
    y: n.y + uy * gap,
    anchor: ux < -0.35 ? ("end" as const) : ux > 0.35 ? ("start" as const) : ("middle" as const),
    baseline: uy < -0.35 ? ("auto" as const) : uy > 0.35 ? ("hanging" as const) : ("middle" as const),
  };
}

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function NetworkDiagram({ description, hint }: { description: string; hint: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { soma, spokes, sticks, chain, nodes } = MARK_GEOMETRY;
  const chainNodes = chain.nodes.map(markNode);
  const activeLabel = active ? markNode(active).label : null;

  // Data packets: each pink spoke delivers into the soma; APIs delivers into Quality.
  const packets = [
    ...spokes
      .map((s) => markNode(s.to))
      .filter((n) => n.role === "data")
      .map((n) => ({ id: n.id, from: n, to: soma })),
    { id: "apis", from: markNode("apis"), to: markNode("quality") },
  ];

  return (
    <div id="network-hero" suppressHydrationWarning className="relative">
      <svg viewBox={VIEWBOX} className={styles.svg} role="group" aria-labelledby="network-hero-desc">
        <defs>
          {spokes.map((s) => (
            <linearGradient key={s.to} id={`nh-${s.to}`} gradientUnits="userSpaceOnUse" x1={s.gradient.x1} y1={s.gradient.y1} x2={s.gradient.x2} y2={s.gradient.y2}>
              <stop offset="0" stopColor={s.gradient.from} />
              <stop offset="0.45" stopColor={ROLE_FILL[markNode(s.to).role]} />
            </linearGradient>
          ))}
          {sticks.map((s) => {
            const a = markNode(s.from);
            const b = markNode(s.to);
            return (
              <linearGradient key={s.from} id={`nh-${s.from}`} gradientUnits="userSpaceOnUse" x1={a.x} y1={a.y} x2={b.x} y2={b.y}>
                <stop offset="0.15" stopColor={ROLE_FILL[a.role]} />
                <stop offset="0.85" stopColor={ROLE_FILL[b.role]} />
              </linearGradient>
            );
          })}
          <linearGradient id="nh-soma" gradientUnits="userSpaceOnUse" x1={soma.gradient.x1} y1={soma.gradient.y1} x2={soma.gradient.x2} y2={soma.gradient.y2}>
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
        </defs>

        <g aria-hidden>
          {spokes.map((s) => {
            const n = markNode(s.to);
            const phase = PHASE[n.id];
            return (
              <path
                key={s.to}
                d={s.d}
                fill={`url(#nh-${s.to})`}
                className={n.role === "data" ? styles.dataSpoke : styles.aiEdge}
                style={vars({ "--i": phase.i })}
              />
            );
          })}
          {sticks.map((s) => {
            const a = markNode(s.from);
            const b = markNode(s.to);
            return (
              <line
                key={s.from}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={`url(#nh-${s.from})`}
                strokeWidth={s.width}
                className={styles.aiEdge}
                style={vars({ "--i": PHASE[s.from].i })}
              />
            );
          })}
          {packets.map((p, i) => (
            <circle
              key={p.id}
              cx={p.to.x}
              cy={p.to.y}
              r={5}
              fill="var(--color-pink)"
              className={styles.packet}
              style={vars({ "--i": i, "--dx": `${p.from.x - p.to.x}px`, "--dy": `${p.from.y - p.to.y}px` })}
            />
          ))}
          <circle cx={soma.x} cy={soma.y} r={soma.r} fill="var(--color-line)" className={cn(styles.grows, styles.somaBase)} />
          <circle cx={soma.x} cy={soma.y} r={soma.r} fill="url(#nh-soma)" className={styles.somaFill} />
          <polyline
            points={chainNodes.map((n) => `${n.x},${n.y}`).join(" ")}
            pathLength={1}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={chain.width}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={styles.chainLine}
          />
        </g>

        {nodes.map((n) => {
          const phase = PHASE[n.id];
          const label = labelPosition(n);
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={n.label}
              aria-pressed={active === n.id}
              data-active={active === n.id ? "" : undefined}
              className={styles.node}
              onClick={() => setActive((a) => (a === n.id ? null : n.id))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive((a) => (a === n.id ? null : n.id));
                }
              }}
            >
              <circle cx={n.x} cy={n.y} r={n.r + 8} fill="transparent" />
              <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none" stroke="var(--color-violet)" strokeWidth={1.5} className={styles.ring} />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={ROLE_FILL[n.role]}
                className={cn(styles.grows, styles[phase.cls])}
                style={vars({ "--i": phase.i })}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                dominantBaseline={label.baseline}
                fontSize={LABEL_SIZE}
                className={styles.label}
                aria-hidden
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Below 1024px labels can't fit beside the nodes; a tap names the node here. */}
      <p aria-live="polite" className="mt-3 min-h-[1.4em] text-caption text-muted lg:hidden">
        {activeLabel ?? hint}
      </p>

      <div id="network-hero-desc" className="sr-only">
        <p>{description}</p>
      </div>
    </div>
  );
}
