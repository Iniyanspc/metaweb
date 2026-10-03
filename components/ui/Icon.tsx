import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * In-repo icon set in the logo's language: 24px grid, 1.75 strokes, round
 * caps, nodes as 3px filled circles. Ink by default (currentColor).
 */

const n = (cx: number, cy: number) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.5} fill="currentColor" stroke="none" />;

const ICONS = {
  pipeline: (
    <>
      <path d="M4 12h16M8 12V8h8v4" />
      {n(4, 12)}
      {n(20, 12)}
      {n(12, 8)}
    </>
  ),
  warehouse: (
    <>
      <path d="M3 10.5 12 5l9 5.5V20H3zM7 20v-6h10v6M7 17h10" />
    </>
  ),
  lake: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.5" />
      <path d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  stream: (
    <>
      <path d="M3 8c3-2 5 2 9 0s6-2 9 0M3 13c3-2 5 2 9 0s6-2 9 0M3 18c3-2 5 2 9 0s6-2 9 0" />
    </>
  ),
  model: (
    <>
      <path d="M6 6l6 6M18 6l-6 6M12 12v7M6 6h12" />
      {n(6, 6)}
      {n(18, 6)}
      {n(12, 12)}
      {n(12, 19)}
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
      {n(10.5, 10.5)}
    </>
  ),
  agent: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21" />
      {n(12, 3)}
      {n(21, 12)}
      {n(12, 21)}
      {n(3, 12)}
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M7 16v-3M11 16V9M15 16v-5" />
    </>
  ),
  workflow: (
    <>
      <path d="M5 6h7v12h7" />
      {n(5, 6)}
      {n(12, 12)}
      {n(19, 18)}
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6z" />
      {n(12, 11.5)}
    </>
  ),
  cloud: (
    <>
      <path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9a4.5 4.5 0 0 1 0 9z" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.25" />
      <path d="M3.5 19c.6-3.1 2.8-5 5.5-5s4.9 1.9 5.5 5M15 14.2c2.6-.4 4.9 1.2 5.5 4.3" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h10v17M15 9h4v12M3 21h18M8.5 8h3M8.5 12h3M8.5 16h3" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="17.5" r="1.75" />
      <circle cx="17" cy="17.5" r="1.75" />
    </>
  ),
  "heart-pulse": (
    <>
      <path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z" />
      <path d="M6.5 12.5h3l1.5-2.5 2 4 1.5-1.5h3" />
    </>
  ),
  graduation: (
    <>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5zM6.5 11v5c1.5 1.5 3.4 2.5 5.5 2.5s4-1 5.5-2.5v-5M21.5 9v5" />
      {n(21.5, 14)}
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M9 7V4.5h6V7M3 12.5h18" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function isIconName(name: string): name is IconName {
  return name in ICONS;
}

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {ICONS[name]}
    </svg>
  );
}
