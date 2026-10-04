/**
 * metadatum mark + lockups, rebuilt from the official neuron-logo-brand-package
 * (geometry generated into ./mark-geometry.ts).
 *
 * Brand rules: keep clear space of at least the nucleus width on every side;
 * use the full mark down to 64px and the small-size icon below that; never
 * recolour the arms, add 3D, shadows or glow, reorder nodes or stretch it.
 */
import { useId } from "react";
import { MARK, WORDMARK_HORIZONTAL, WORDMARK_STACKED } from "./mark-geometry";

type Role = "data" | "ai" | "outcome";

/**
 * color      — light backgrounds: pink/violet arms, black axon chain
 * color-dark — dark backgrounds: pink/violet arms, white axon chain
 * mono-black / mono-white — single colour, no sheen
 */
export type MarkVariant = "color" | "color-dark" | "mono-black" | "mono-white";

const ROLE_COLOUR: Record<Role, string> = {
  data: "var(--color-pink)",
  ai: "var(--color-violet)",
  outcome: "var(--color-ink)",
};

function palette(variant: MarkVariant) {
  const mono = variant === "mono-black" ? "var(--color-ink)" : variant === "mono-white" ? "var(--color-canvas)" : null;
  const chain = variant === "color-dark" ? "var(--color-canvas)" : "var(--color-ink)";
  return { mono, role: (r: Role) => mono ?? (r === "outcome" ? chain : ROLE_COLOUR[r]) };
}

/** The mark's shapes in the official coordinates. Shared by Mark and the lockups. */
function MarkShapes({ variant, simplified, sheen }: { variant: MarkVariant; simplified: boolean; sheen: boolean }) {
  // useId can contain characters that break url(#…) references in some browsers
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const c = palette(variant);
  const { arms, soma, sticks, chain } = MARK;
  // The soft colour sheen belongs to the full-size colour mark only.
  const withSheen = sheen && !c.mono && !simplified;
  const ref = (name: string) => `url(#${uid}-${name})`;

  return (
    <>
      {!c.mono && (
        <defs>
          {arms.map((a, i) => (
            <linearGradient key={i} id={`${uid}-arm${i}`} gradientUnits="userSpaceOnUse" x1={a.gradient.x1} y1={a.gradient.y1} x2={a.gradient.x2} y2={a.gradient.y2}>
              <stop offset="0" stopColor={a.gradient.from} />
              <stop offset="0.45" stopColor={c.role(a.role)} />
            </linearGradient>
          ))}
          {sticks.map((s, i) => (
            <linearGradient key={i} id={`${uid}-stick${i}`} gradientUnits="userSpaceOnUse" x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y}>
              <stop offset="0.15" stopColor={c.role(s.a.role)} />
              <stop offset="0.85" stopColor={c.role(s.b.role)} />
            </linearGradient>
          ))}
          <linearGradient id={`${uid}-soma`} gradientUnits="userSpaceOnUse" x1={soma.gradient.x1} y1={soma.gradient.y1} x2={soma.gradient.x2} y2={soma.gradient.y2}>
            <stop offset="0" stopColor="var(--color-soma-from)" />
            <stop offset="1" stopColor="var(--color-soma-to)" />
          </linearGradient>
          {withSheen && (
            <>
              <linearGradient id={`${uid}-sheen`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
                <stop offset="0" stopColor="#fff" stopOpacity={0.24} />
                <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`${uid}-sheen-axon`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
                <stop offset="0" stopColor="#fff" stopOpacity={0.2} />
                <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`${uid}-sheen-arm`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity={0.1} />
                <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </>
          )}
        </defs>
      )}

      {/* Arms and their terminal nodes */}
      {arms.map((a, i) => (
        <g key={i}>
          <path d={simplified ? a.dSmall : a.d} fill={c.mono ?? ref(`arm${i}`)} />
          {withSheen && <path d={a.d} fill={ref("sheen-arm")} />}
        </g>
      ))}
      {arms.map((a, i) => (
        <g key={i}>
          <circle cx={a.node.x} cy={a.node.y} r={a.node.r} fill={c.role(a.role)} />
          {withSheen && <circle cx={a.node.x} cy={a.node.y} r={a.node.r} fill={ref("sheen")} />}
        </g>
      ))}

      {/* Nucleus */}
      <circle cx={soma.x} cy={soma.y} r={soma.r} fill={c.mono ?? ref("soma")} />
      {withSheen && <circle cx={soma.x} cy={soma.y} r={soma.r} fill={ref("sheen")} />}

      {/* Synapse sticks */}
      {sticks.map((s, i) => (
        <g key={i}>
          <line x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke={c.mono ?? ref(`stick${i}`)} strokeWidth={simplified ? s.widthSmall : s.width} strokeLinecap="round" />
          {[s.a, s.b].map((n, k) => (
            <g key={k}>
              <circle cx={n.x} cy={n.y} r={simplified ? n.rSmall : n.r} fill={c.role(n.role)} />
              {withSheen && <circle cx={n.x} cy={n.y} r={n.r} fill={ref("sheen")} />}
            </g>
          ))}
        </g>
      ))}

      {/* Axon chain: the engineered path out */}
      <polyline
        points={chain.nodes.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke={c.role("outcome")}
        strokeWidth={simplified ? chain.widthSmall : chain.width}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {chain.nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={simplified ? n.rSmall : n.r} fill={c.role("outcome")} />
          {withSheen && <circle cx={n.x} cy={n.y} r={n.r} fill={ref("sheen-axon")} />}
        </g>
      ))}
    </>
  );
}

const a11y = (title: string) => (title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const });

export interface MarkProps {
  variant?: MarkVariant;
  /** Small-size icon (≤64px): heavier sticks and chain, no sheen. Defaults by size. */
  simplified?: boolean;
  /** Set false for the flat (no sheen) version. */
  sheen?: boolean;
  size?: number | string;
  /** Accessible name. Pass "" when the mark sits next to visible text. */
  title?: string;
  className?: string;
}

export function Mark({ variant = "color", simplified, sheen = true, size = 32, title = "metadatum", className }: MarkProps) {
  const small = simplified ?? (typeof size === "number" && size <= 64);
  return (
    <svg viewBox={small ? MARK.viewBoxSmall : MARK.viewBox} width={size} height={size} className={className} {...a11y(title)}>
      <MarkShapes variant={variant} simplified={small} sheen={sheen} />
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
    <svg viewBox={WORDMARK_HORIZONTAL.viewBox} height={height} width={(height * w) / h} className={className} {...a11y(title)}>
      {/* At navbar sizes the mark is under 64px, so it uses the small-size icon. */}
      <MarkShapes variant={markVariantFor(tone)} simplified={height <= 64} sheen />
      <path transform={`translate(${WORDMARK_HORIZONTAL.x} ${WORDMARK_HORIZONTAL.y})`} d={WORDMARK_HORIZONTAL.d} fill={wordmarkFill(tone)} />
    </svg>
  );
}

export function LogoStacked({ tone = "light", height = 160, title = "metadatum", className }: LockupProps) {
  const { w, h } = viewBoxSize(WORDMARK_STACKED.viewBox);
  return (
    <svg viewBox={WORDMARK_STACKED.viewBox} height={height} width={(height * w) / h} className={className} {...a11y(title)}>
      <MarkShapes variant={markVariantFor(tone)} simplified={height <= 96} sheen />
      <path transform={`translate(${WORDMARK_STACKED.x} ${WORDMARK_STACKED.y})`} d={WORDMARK_STACKED.d} fill={wordmarkFill(tone)} />
    </svg>
  );
}
