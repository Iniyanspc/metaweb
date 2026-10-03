/**
 * metadatum mark + lockups.
 *
 * MARK_GEOMETRY is the single source of truth for the mark's node positions.
 *
 * Geometry is taken from the official neuron-compact vectors
 * (icon_primary.svg, and favicon_small.svg for the small-size variant).
 * The official mark has no ring.
 */
import { useId } from "react";
import { WORDMARK_HORIZONTAL, WORDMARK_STACKED } from "./wordmark";

export type NodeRole = "data" | "ai" | "outcome";

export interface MarkNode {
  id: string;
  x: number;
  y: number;
  r: number;
  /** Radius in the small-size icon, where it differs. */
  rSmall?: number;
  role: NodeRole;
  /** What the node stands for (data source, model, outcome); not rendered by the logo. */
  label: string;
}

export interface LinearGradientSpec {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Tapered dendrite from the soma to a terminal node. */
export interface MarkSpoke {
  to: string;
  d: string;
  dSmall: string;
  /** Colour leaves the soma as `from` and settles into the node's role colour by 45%. */
  gradient: LinearGradientSpec & { from: string };
}

/** Detached two-node stick (quality → APIs, governance → search). */
export interface MarkStick {
  from: string;
  to: string;
  width: number;
  widthSmall: number;
}

export interface MarkGeometry {
  viewBox: string;
  viewBoxSmall: string;
  soma: { x: number; y: number; r: number; gradient: LinearGradientSpec };
  nodes: readonly MarkNode[];
  spokes: readonly MarkSpoke[];
  sticks: readonly MarkStick[];
  /** The engineered path out, drawn as one polyline through these nodes. */
  chain: { nodes: readonly string[]; width: number; widthSmall: number };
}

export const MARK_GEOMETRY: MarkGeometry = {
  viewBox: "-172 -175 318 318",
  viewBoxSmall: "-154 -157 282 282",
  soma: { x: -9, y: -9, r: 27, gradient: { x1: -36, y1: -15, x2: 18, y2: -3 } },
  nodes: [
    // Pink spokes — data sources arriving
    { id: "erp", x: -93, y: -81, r: 15.5, role: "data", label: "ERP" },
    { id: "crm", x: -122, y: -21, r: 15.5, role: "data", label: "CRM" },
    { id: "docs", x: -110, y: 39, r: 15.5, role: "data", label: "Documents" },
    { id: "iot", x: -40, y: 48, r: 13, role: "data", label: "Sensors and IoT" },
    // Violet spokes — intelligence
    { id: "models", x: -24, y: -118, r: 15.5, role: "ai", label: "Models" },
    { id: "knowledge", x: 49, y: -108, r: 15.5, role: "ai", label: "Knowledge" },
    // Sticks — checks on the way in and out
    { id: "quality", x: 35, y: -23, r: 8, rSmall: 10, role: "ai", label: "Quality" },
    { id: "apis", x: 84, y: -46, r: 11.5, role: "data", label: "APIs" },
    { id: "governance", x: 4, y: 39, r: 8, rSmall: 10, role: "data", label: "Governance" },
    { id: "search", x: 16, y: 91, r: 11.5, role: "ai", label: "Search" },
    // Chain — the engineered path out
    { id: "decisions", x: 36, y: 19, r: 12.5, rSmall: 14, role: "outcome", label: "Decisions" },
    { id: "actions", x: 76, y: 29, r: 12.5, rSmall: 14, role: "outcome", label: "Actions" },
    { id: "outcomes", x: 106, y: 69, r: 12.5, rSmall: 14, role: "outcome", label: "Outcomes" },
  ],
  spokes: [
    {
      to: "models",
      d: "M-7.44 -31.42 C-12.67 -62.8 -17.44 -97.46 -15.51 -110.56 L-30.17 -108.55 C-24.77 -96.45 -20 -61.79 -16.56 -30.17 Z",
      dSmall: "M-5.06 -31.75 C-10.19 -63.14 -14.96 -97.8 -13.92 -110.78 L-31.75 -108.33 C-27.25 -96.11 -22.48 -61.45 -18.93 -29.84 Z",
      gradient: { x1: -12, y1: -30.79, x2: -22.84, y2: -109.55, from: "#A40D8F" },
    },
    {
      to: "knowledge",
      d: "M6.09 -25.66 C22.34 -55.18 41.07 -87.15 51.08 -96.9 L38.31 -104.39 C34.69 -90.89 15.96 -58.92 -1.85 -30.31 Z",
      dSmall: "M8.16 -24.44 C24.5 -53.91 43.23 -85.88 52.46 -96.09 L36.93 -105.19 C32.53 -92.15 13.8 -60.18 -3.92 -31.52 Z",
      gradient: { x1: 2.12, y1: -27.98, x2: 44.69, y2: -100.64, from: "#890F93" },
    },
    {
      to: "erp",
      d: "M-22.71 -26.81 C-47.63 -46.98 -74.39 -69.92 -81.71 -81.07 L-91.34 -69.83 C-79.2 -64.3 -52.44 -41.36 -28.7 -19.82 Z",
      dSmall: "M-21.15 -28.63 C-46 -48.88 -72.76 -71.82 -80.67 -82.29 L-92.38 -68.62 C-80.83 -62.4 -54.07 -39.46 -30.26 -18 Z",
      gradient: { x1: -25.7, y1: -23.32, x2: -86.53, y2: -75.45, from: "#BD0B8B" },
    },
    {
      to: "crm",
      d: "M-30.39 -15.9 C-63.54 -18.51 -99.91 -22.37 -112.74 -27.46 L-114.3 -12.74 C-100.69 -15.02 -64.33 -11.15 -31.36 -6.75 Z",
      dSmall: "M-30.14 -18.28 C-63.28 -21 -99.64 -24.86 -112.57 -29.05 L-114.47 -11.15 C-100.95 -12.53 -64.59 -8.67 -31.62 -4.36 Z",
      gradient: { x1: -30.88, y1: -11.32, x2: -113.52, y2: -20.1, from: "#C70B8A" },
    },
    {
      to: "docs",
      d: "M-30.84 -3.71 C-59.83 11.06 -92.14 26.42 -105.48 28.66 L-99.12 42.02 C-88.96 33.1 -56.65 17.74 -26.9 4.6 Z",
      dSmall: "M-31.87 -5.88 C-60.9 8.8 -93.21 24.16 -106.16 27.21 L-98.44 43.47 C-87.89 35.36 -55.58 20 -25.87 6.77 Z",
      gradient: { x1: -28.87, y1: 0.44, x2: -102.3, y2: 35.34, from: "#C30B8A" },
    },
    {
      to: "iot",
      d: "M-23.55 8.13 C-29.59 21.12 -37.1 34.93 -43.08 38.18 L-30.08 45.25 C-30.6 38.46 -23.09 24.65 -15.47 12.52 Z",
      dSmall: "M-25.66 6.98 C-31.79 19.92 -39.3 33.73 -44.49 37.42 L-28.68 46.02 C-28.41 39.66 -20.89 25.85 -13.36 13.67 Z",
      gradient: { x1: -19.51, y1: 10.33, x2: -36.58, y2: 41.72, from: "#B10C8D" },
    },
  ],
  sticks: [
    { from: "quality", to: "apis", width: 4.6, widthSmall: 7 },
    { from: "governance", to: "search", width: 4.6, widthSmall: 7 },
  ],
  chain: { nodes: ["decisions", "actions", "outcomes"], width: 3.5, widthSmall: 7 },
};

export function markNode(id: string): MarkNode {
  const n = MARK_GEOMETRY.nodes.find((node) => node.id === id);
  if (!n) throw new Error(`Unknown mark node: ${id}`);
  return n;
}

/**
 * color      — light backgrounds: pink/violet spokes, black chain
 * color-dark — dark backgrounds: pink/violet spokes, white chain
 * mono-black / mono-white — single colour
 */
export type MarkVariant = "color" | "color-dark" | "mono-black" | "mono-white";

const ROLE_COLOUR: Record<NodeRole, string> = {
  data: "var(--color-pink)",
  ai: "var(--color-violet)",
  outcome: "var(--color-ink)",
};

function palette(variant: MarkVariant) {
  const mono = variant === "mono-black" ? "var(--color-ink)" : variant === "mono-white" ? "var(--color-canvas)" : null;
  const chain = variant === "color-dark" ? "var(--color-canvas)" : "var(--color-ink)";
  return {
    mono,
    role: (role: NodeRole) => mono ?? (role === "outcome" ? chain : ROLE_COLOUR[role]),
  };
}

/** The mark's shapes, in MARK_GEOMETRY coordinates. Shared by Mark and the lockups. */
function MarkShapes({ variant, simplified }: { variant: MarkVariant; simplified: boolean }) {
  // useId can contain characters that break url(#…) references in some browsers
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const c = palette(variant);
  const { soma, spokes, sticks, chain } = MARK_GEOMETRY;
  const r = (n: MarkNode) => (simplified && n.rSmall) || n.r;
  const chainNodes = chain.nodes.map(markNode);

  return (
    <>
      {!c.mono && (
        <defs>
          {spokes.map((s) => (
            <linearGradient key={s.to} id={`${uid}-${s.to}`} gradientUnits="userSpaceOnUse" {...pick(s.gradient)}>
              <stop offset="0" stopColor={s.gradient.from} />
              <stop offset="0.45" stopColor={c.role(markNode(s.to).role)} />
            </linearGradient>
          ))}
          {sticks.map((s) => {
            const a = markNode(s.from);
            const b = markNode(s.to);
            return (
              <linearGradient key={s.from} id={`${uid}-${s.from}`} gradientUnits="userSpaceOnUse" x1={a.x} y1={a.y} x2={b.x} y2={b.y}>
                <stop offset="0.15" stopColor={c.role(a.role)} />
                <stop offset="0.85" stopColor={c.role(b.role)} />
              </linearGradient>
            );
          })}
          <linearGradient id={`${uid}-soma`} gradientUnits="userSpaceOnUse" {...pick(soma.gradient)}>
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
        </defs>
      )}
      {spokes.map((s) => {
        const n = markNode(s.to);
        return (
          <g key={s.to}>
            <path d={simplified ? s.dSmall : s.d} fill={c.mono ?? `url(#${uid}-${s.to})`} />
            <circle cx={n.x} cy={n.y} r={r(n)} fill={c.role(n.role)} />
          </g>
        );
      })}
      <circle cx={soma.x} cy={soma.y} r={soma.r} fill={c.mono ?? `url(#${uid}-soma)`} />
      {sticks.map((s) => {
        const a = markNode(s.from);
        const b = markNode(s.to);
        return (
          <g key={s.from}>
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={c.mono ?? `url(#${uid}-${s.from})`}
              strokeWidth={simplified ? s.widthSmall : s.width}
            />
            <circle cx={a.x} cy={a.y} r={r(a)} fill={c.role(a.role)} />
            <circle cx={b.x} cy={b.y} r={r(b)} fill={c.role(b.role)} />
          </g>
        );
      })}
      <polyline
        points={chainNodes.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke={c.role("outcome")}
        strokeWidth={simplified ? chain.widthSmall : chain.width}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {chainNodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={r(n)} fill={c.role(n.role)} />
      ))}
    </>
  );
}

function pick({ x1, y1, x2, y2 }: LinearGradientSpec) {
  return { x1, y1, x2, y2 };
}

export interface MarkProps {
  variant?: MarkVariant;
  /** Small-size icon (≤64px): thicker sticks and chain, tighter crop. */
  simplified?: boolean;
  size?: number | string;
  /** Accessible name. Pass "" when the mark sits next to visible text. */
  title?: string;
  className?: string;
}

export function Mark({ variant = "color", simplified, size = 32, title = "metadatum", className }: MarkProps) {
  const small = simplified ?? (typeof size === "number" && size <= 64);
  return (
    <svg
      viewBox={small ? MARK_GEOMETRY.viewBoxSmall : MARK_GEOMETRY.viewBox}
      width={size}
      height={size}
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <MarkShapes variant={variant} simplified={small} />
    </svg>
  );
}

/* ---------- Lockups ----------
   Mark and outlined Poppins wordmark in the official lockup viewBoxes. */

export type LogoTone = "light" | "dark" | "mono" | "mono-white";

function markVariantFor(tone: LogoTone): MarkVariant {
  return tone === "dark" ? "color-dark" : tone === "mono" ? "mono-black" : tone === "mono-white" ? "mono-white" : "color";
}

function wordmarkFill(tone: LogoTone) {
  return tone === "dark" || tone === "mono-white" ? "var(--color-canvas)" : "var(--color-ink)";
}

function viewBoxSize(viewBox: string) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return { w, h };
}

interface LockupProps {
  tone?: LogoTone;
  /** Rendered height in px. */
  height?: number;
  /** Accessible name. Pass "" when a parent link already names it. */
  title?: string;
  className?: string;
}

export function LogoHorizontal({ tone = "light", height = 40, title = "metadatum", className }: LockupProps) {
  const { w, h } = viewBoxSize(WORDMARK_HORIZONTAL.viewBox);
  return (
    <svg
      viewBox={WORDMARK_HORIZONTAL.viewBox}
      height={height}
      width={(height * w) / h}
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <MarkShapes variant={markVariantFor(tone)} simplified={height <= 48} />
      <path transform={`translate(${WORDMARK_HORIZONTAL.x} ${WORDMARK_HORIZONTAL.y})`} d={WORDMARK_HORIZONTAL.d} fill={wordmarkFill(tone)} />
    </svg>
  );
}

export function LogoStacked({ tone = "light", height = 160, title = "metadatum", className }: LockupProps) {
  const { w, h } = viewBoxSize(WORDMARK_STACKED.viewBox);
  return (
    <svg
      viewBox={WORDMARK_STACKED.viewBox}
      height={height}
      width={(height * w) / h}
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <MarkShapes variant={markVariantFor(tone)} simplified={height <= 96} />
      <path transform={`translate(${WORDMARK_STACKED.x} ${WORDMARK_STACKED.y})`} d={WORDMARK_STACKED.d} fill={wordmarkFill(tone)} />
    </svg>
  );
}
