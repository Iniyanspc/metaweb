"use client";

/* Four candidate illustrations of agentic AI for the hero's picture-in-picture
   card (preview only, see /_preview/agentic). Each runs a short loop and shows
   its finished state when the visitor prefers reduced motion. */

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const PINK = "var(--color-pink)";
const VIOLET = "var(--color-violet)";
const PLUM = "var(--color-plum)";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Advances a counter every `ms` milliseconds, wrapping at `length`. */
function useTicker(length: number, ms: number, paused: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => (t + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, paused]);
  return paused ? length - 1 : tick;
}

/** The 16:9 card: white, hairline border, small header. */
export function PipFrame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex aspect-[16/9] flex-col overflow-hidden rounded-media border border-line bg-canvas p-4 text-ink sm:p-5", className)}>
      <div className="flex items-center justify-between text-caption text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet" />
          {label}
        </span>
        <span aria-hidden className="flex gap-1">
          <span className="size-1.5 rounded-full bg-line" />
          <span className="size-1.5 rounded-full bg-line" />
          <span className="size-1.5 rounded-full bg-line" />
        </span>
      </div>
      <div className="relative mt-3 min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ---------- A. Agent at work: a task timeline ---------- */

const SCENARIOS = [
  {
    goal: "Reorder stock running low",
    steps: [
      { text: "Read inventory data", kind: "data" },
      { text: "Check supplier contracts", kind: "data" },
      { text: "Forecast demand, next 30 days", kind: "reason" },
      { text: "Draft purchase orders", kind: "act" },
      { text: "Send for approval", kind: "act" },
    ],
  },
  {
    goal: "Match this month's invoices",
    steps: [
      { text: "Read 1,240 invoices", kind: "data" },
      { text: "Pull purchase orders from ERP", kind: "data" },
      { text: "Match and flag mismatches", kind: "reason" },
      { text: "Post matched invoices", kind: "act" },
      { text: "Route 12 exceptions to finance", kind: "act" },
    ],
  },
  {
    goal: "Staff next week's shifts",
    steps: [
      { text: "Read rosters and leave requests", kind: "data" },
      { text: "Check demand forecast", kind: "data" },
      { text: "Plan cover for every shift", kind: "reason" },
      { text: "Draft the schedule", kind: "act" },
      { text: "Send to managers to approve", kind: "act" },
    ],
  },
] as const;
const KIND_COLOUR = { data: PINK, reason: VIOLET, act: PLUM } as const;

export function AgentTimeline() {
  const reduced = useReducedMotion();
  // Per scenario: 5 steps + 2 beats of rest.
  const BEATS = 7;
  const tick = useTicker(SCENARIOS.length * BEATS, 1100, reduced);
  const scenario = SCENARIOS[Math.floor(tick / BEATS) % SCENARIOS.length];
  const progress = reduced ? 5 : tick % BEATS; // steps finished so far
  return (
    <PipFrame label="Agent at work">
      <p className="text-small">
        <span className="text-muted">Goal: </span>
        <span className="font-semibold">{scenario.goal}</span>
      </p>
      <ol className="mt-3 flex flex-col gap-1.5 text-small">
        {scenario.steps.map((step, i) => {
          const done = i < progress;
          const working = i === progress && progress < 5;
          return (
            <li key={step.text} className={cn("flex items-center gap-3 transition-opacity duration-300", !done && !working && "opacity-40")}>
              <span
                className={cn("relative grid size-4 shrink-0 place-items-center rounded-full", working && "motion-safe:animate-pulse")}
                style={{ background: done || working ? KIND_COLOUR[step.kind] : "var(--color-line)" }}
              >
                {done && (
                  <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="flex-1 truncate">{step.text}</span>
              <span className="text-caption text-muted">{done ? "Done" : working ? "Working" : ""}</span>
            </li>
          );
        })}
      </ol>
    </PipFrame>
  );
}

/* ---------- B. The agent loop ---------- */

const LOOP = [
  { stage: "Perceive", note: "Reads three systems", colour: PINK },
  { stage: "Reason", note: "Picks a plan", colour: VIOLET },
  { stage: "Act", note: "Updates the ERP", colour: PLUM },
  { stage: "Learn", note: "Logs the outcome", colour: VIOLET },
];

export function AgentLoop() {
  const reduced = useReducedMotion();
  const tick = useTicker(LOOP.length, 1500, reduced);
  const active = reduced ? -1 : tick;
  // Ring geometry in a 320×150 drawing.
  const cx = 160;
  const cy = 80;
  const rx = 104;
  const ry = 46;
  const pts = LOOP.map((_, i) => {
    const a = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  return (
    <PipFrame label="The agent loop">
      <svg viewBox="0 0 320 150" className="absolute inset-0 size-full overflow-visible" role="img" aria-label="Perceive, reason, act, learn, in a continuous loop">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--color-line)" strokeWidth={2} />
        {!reduced && (
          <circle r={4} fill={VIOLET}>
            <animateMotion dur="6s" repeatCount="indefinite" path={`M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx - 0.01} ${cy - ry} Z`} />
          </circle>
        )}
        {LOOP.map((s, i) => {
          const p = pts[i];
          const on = i === active || active === -1;
          const anchor = p.x > cx + 5 ? "start" : p.x < cx - 5 ? "end" : "middle";
          const dx = anchor === "start" ? 14 : anchor === "end" ? -14 : 0;
          const dy = p.y < cy - 5 ? -13 : p.y > cy + 5 ? 21 : 4;
          return (
            <g key={s.stage} style={{ transition: "opacity 300ms" }} opacity={on ? 1 : 0.45}>
              <circle cx={p.x} cy={p.y} r={on ? 9 : 7} fill={s.colour} style={{ transition: "r 300ms" }} />
              <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fontSize={12} fontWeight={600} fill="var(--color-ink)" fontFamily="var(--font-sans)">
                {s.stage}
              </text>
            </g>
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill="var(--color-muted)" fontFamily="var(--font-sans)">
          {active === -1 ? "Perceive, reason, act, learn" : LOOP[active].note}
        </text>
      </svg>
    </PipFrame>
  );
}

/* ---------- C. Agent and tools ---------- */

const TOOLS = ["SQL", "CRM", "Email", "Calendar", "Search", "Approvals"];

export function AgentTools() {
  const reduced = useReducedMotion();
  // Six tool calls, then the result shows for two beats.
  const tick = useTicker(TOOLS.length + 2, 900, reduced);
  const calling = reduced ? -1 : tick < TOOLS.length ? tick : -1;
  const showResult = reduced || tick >= TOOLS.length;
  const cx = 160;
  const cy = 66;
  const spots = TOOLS.map((_, i) => {
    const a = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + 118 * Math.cos(a), y: cy + 50 * Math.sin(a) };
  });
  return (
    <PipFrame label="Agent and tools">
      <svg viewBox="0 0 320 150" className="absolute inset-0 size-full" role="img" aria-label="An agent calling SQL, CRM, email, calendar, search and approvals tools to complete a task">
        {spots.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={i === calling ? PINK : "var(--color-line)"} strokeWidth={i === calling ? 2 : 1.2} style={{ transition: "stroke 200ms" }} />
        ))}
        <circle cx={cx} cy={cy} r={16} fill={VIOLET} />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="white" fontFamily="var(--font-sans)">
          Agent
        </text>
        {TOOLS.map((t, i) => {
          const p = spots[i];
          const on = i === calling;
          return (
            <g key={t}>
              <rect x={p.x - 30} y={p.y - 11} width={60} height={22} rx={11} fill={on ? "var(--color-ink)" : "var(--color-canvas)"} stroke={on ? "var(--color-ink)" : "var(--color-line)"} style={{ transition: "fill 200ms" }} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={500} fill={on ? "white" : "var(--color-ink)"} fontFamily="var(--font-sans)">
                {t}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        className={cn(
          "absolute inset-x-6 bottom-0 rounded-card bg-mist px-3 py-2 text-caption transition-[opacity,translate] duration-500 ease-out",
          showResult ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <span className="font-semibold">PO #4821 drafted.</span> <span className="text-muted">Awaiting approval.</span>
      </div>
    </PipFrame>
  );
}

/* ---------- D. Conversation to action ---------- */

const QUESTION = "Which orders will miss their delivery date?";
const ANSWER = "Three are at risk. I've rerouted two and flagged one for you.";
const CHIPS = [
  { label: "Rerouted", colour: VIOLET },
  { label: "Rerouted", colour: VIOLET },
  { label: "Needs review", colour: PINK },
];

export function AgentChat() {
  const reduced = useReducedMotion();
  // Timeline in 60ms frames: type question, pause, type answer, show chips, hold.
  const qEnd = QUESTION.length;
  const aStart = qEnd + 12;
  const aEnd = aStart + ANSWER.length;
  const total = aEnd + 8 + CHIPS.length * 6 + 40;
  const f = useTicker(total, 45, reduced);
  const frame = reduced ? total : f;
  const q = QUESTION.slice(0, Math.min(frame, qEnd));
  const a = frame > aStart ? ANSWER.slice(0, Math.min(frame - aStart, ANSWER.length)) : "";
  const chips = frame > aEnd + 8 ? Math.min(CHIPS.length, Math.floor((frame - aEnd - 8) / 6) + 1) : 0;
  return (
    <PipFrame label="Ask, then act">
      <div className="flex h-full flex-col justify-end gap-2 text-small">
        <p className="self-end rounded-card bg-ink px-3 py-2 text-canvas">{q || " "}</p>
        {frame > qEnd + 4 && (
          <div className="self-start">
            <p className="rounded-card bg-mist px-3 py-2">{a || <span className="text-muted motion-safe:animate-pulse">Thinking…</span>}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CHIPS.slice(0, chips).map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-0.5 text-caption">
                  <span className="size-1.5 rounded-full" style={{ background: c.colour }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PipFrame>
  );
}
