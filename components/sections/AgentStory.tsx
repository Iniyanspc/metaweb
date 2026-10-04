"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";

/* The hero's picture-in-picture card: a three-act story of what our agents do.
   Each act opens with a title card, then plays: (1) an agent works a task step
   by step, (2) one lap of the perceive, reason, act, learn loop, (3) a question
   answered with the actions taken. Then it loops. One clock drives everything;
   it pauses off screen and in background tabs. Reduced motion gets a static
   summary of the three acts. */

type Story = HomeContent["hero"]["agent"];

const PINK = "var(--color-pink)";
const VIOLET = "var(--color-violet)";
const PLUM = "var(--color-plum)";
const KIND_COLOUR = { data: PINK, reason: VIOLET, act: PLUM } as const;

/** Playback speed: 2 = twice the original pace. Every duration below divides by it. */
const SPEED = 2;
const TITLE_MS = 2000 / SPEED;
const STEP_MS = 900 / SPEED;
const STAGE_MS = 1400 / SPEED;
const CHAR_MS = 38 / SPEED;

/** Phase lengths in ms, derived from the copy so longer text gets more time. */
function timeline(story: Story) {
  const task = story.task.steps.length * STEP_MS + 1400 / SPEED;
  const loop = story.loop.length * STAGE_MS + 600 / SPEED;
  const { question, answer, chips } = story.chat;
  const chat = (question.length + answer.length) * CHAR_MS + (900 + chips.length * 350 + 2200) / SPEED;
  const phases = [
    { act: 0, kind: "title" as const, ms: TITLE_MS },
    { act: 0, kind: "scene" as const, ms: task },
    { act: 1, kind: "title" as const, ms: TITLE_MS },
    { act: 1, kind: "scene" as const, ms: loop },
    { act: 2, kind: "title" as const, ms: TITLE_MS },
    { act: 2, kind: "scene" as const, ms: chat },
  ];
  const actTotals = [0, 1, 2].map((a) => phases.filter((p) => p.act === a).reduce((n, p) => n + p.ms, 0));
  return { phases, total: phases.reduce((n, p) => n + p.ms, 0), actTotals };
}

function useStoryClock(total: number, active: boolean) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Cap the step so a long pause (tab switch) doesn't skip ahead.
      setMs((m) => (m + Math.min(now - last, 100)) % total);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, active]);
  return ms;
}

const enter = "motion-safe:animate-[pip-in_600ms_var(--ease-out)_both]";

export function AgentStory({ story }: { story: Story }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const el = ref.current;
    const io = el ? new IntersectionObserver(([e]) => setVisible(e.isIntersecting)) : null;
    if (el && io) io.observe(el);
    return () => {
      mq.removeEventListener("change", sync);
      io?.disconnect();
    };
  }, []);

  const { phases, total, actTotals } = timeline(story);
  const ms = useStoryClock(total, visible && !reduced);

  // Which phase are we in, and how far into it?
  let rest = ms;
  let index = 0;
  while (index < phases.length - 1 && rest >= phases[index].ms) rest -= phases[index++].ms;
  const phase = phases[index];
  const actStart = phases.slice(0, index).filter((p) => p.act === phase.act).reduce((n, p) => n + p.ms, 0);
  const actProgress = (actStart + rest) / actTotals[phase.act];

  return (
    <div ref={ref} data-agent-story className="flex size-full flex-col overflow-hidden rounded-media border border-line bg-canvas p-4 text-ink sm:p-5">
      <div className="flex items-center justify-between gap-4 text-caption text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet" />
          {story.label}
        </span>
        {!reduced && (
          <span aria-hidden className="flex w-24 gap-1">
            {story.acts.map((_, a) => (
              <span key={a} className="h-1 flex-1 overflow-hidden rounded-pill bg-line">
                <span className="block h-full rounded-pill bg-ink" style={{ width: `${a < phase.act ? 100 : a > phase.act ? 0 : actProgress * 100}%` }} />
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="relative mt-3 min-h-0 flex-1">
        {reduced ? (
          <Summary story={story} />
        ) : phase.kind === "title" ? (
          <TitleCard key={`t${phase.act}`} index={phase.act} act={story.acts[phase.act]} />
        ) : phase.act === 0 ? (
          <TaskScene key="s0" story={story} elapsed={rest} />
        ) : phase.act === 1 ? (
          <LoopScene key="s1" story={story} elapsed={rest} />
        ) : (
          <ChatScene key="s2" story={story} elapsed={rest} />
        )}
      </div>
      {/* Screen readers get the whole story once, not the moving parts. */}
      <p className="sr-only">{story.acts.map((a) => `${a.name}. ${a.line}`).join(" ")}</p>
    </div>
  );
}

function TitleCard({ index, act }: { index: number; act: { name: string; line: string } }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 flex flex-col justify-center rounded-card bg-plum px-6 text-canvas", enter)}>
      <span className="text-caption text-lilac">{String(index + 1).padStart(2, "0")}</span>
      <span className="mt-1 font-display text-h4 font-medium sm:text-h3">{act.name}</span>
      <span className="mt-2 text-small text-canvas/80">{act.line}</span>
    </div>
  );
}

function Scene({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className={cn("absolute inset-0", enter)}>
      {children}
    </div>
  );
}

/* Act 1: a task worked step by step. */
function TaskScene({ story, elapsed }: { story: Story; elapsed: number }) {
  const { task } = story;
  const finished = Math.min(task.steps.length, Math.floor(elapsed / STEP_MS));
  return (
    <Scene>
      <p className="text-small">
        <span className="text-muted">Goal: </span>
        <span className="font-semibold">{task.goal}</span>
      </p>
      <ol className="mt-2.5 flex flex-col gap-1.5 text-small">
        {task.steps.map((step, i) => {
          const done = i < finished;
          const working = i === finished;
          return (
            <li key={step.text} className={cn("flex items-center gap-3 transition-opacity duration-300", !done && !working && "opacity-40")}>
              <span
                className={cn("grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-300", working && "animate-pulse")}
                style={{ background: done || working ? KIND_COLOUR[step.kind] : "var(--color-line)" }}
              >
                {done && (
                  <svg viewBox="0 0 12 12" className="size-2.5">
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="flex-1 truncate">{step.text}</span>
              <span className="text-caption text-muted">{done ? task.done : working ? task.working : ""}</span>
            </li>
          );
        })}
      </ol>
    </Scene>
  );
}

/* Act 2: one lap of the agent loop. */
function LoopScene({ story, elapsed }: { story: Story; elapsed: number }) {
  const stages = story.loop;
  const lap = stages.length * STAGE_MS;
  const t = Math.min(elapsed / lap, 1);
  const active = Math.min(stages.length - 1, Math.floor(elapsed / STAGE_MS));
  const colours = [PINK, VIOLET, PLUM, VIOLET];
  const cx = 160;
  const cy = 80;
  const rx = 104;
  const ry = 46;
  const at = (f: number) => {
    const a = f * Math.PI * 2 - Math.PI / 2;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  };
  const dot = at(t);
  return (
    <Scene>
      <svg viewBox="0 0 320 150" className="absolute inset-0 size-full overflow-visible">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--color-line)" strokeWidth={2} />
        {/* The lap so far, drawn in violet behind the travelling dot. */}
<path
          d={`M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry}`}
          fill="none"
          stroke={VIOLET}
          strokeOpacity={0.5}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={`${t} 1`}
        />
        <circle cx={dot.x} cy={dot.y} r={4.5} fill={VIOLET} />
        {stages.map((s, i) => {
          const p = at(i / stages.length);
          const on = i <= active;
          const anchor = p.x > cx + 5 ? "start" : p.x < cx - 5 ? "end" : "middle";
          const dx = anchor === "start" ? 14 : anchor === "end" ? -14 : 0;
          const dy = p.y < cy - 5 ? -13 : p.y > cy + 5 ? 21 : 4;
          return (
            <g key={s.stage} opacity={on ? 1 : 0.4} style={{ transition: "opacity 300ms" }}>
              <circle cx={p.x} cy={p.y} r={i === active ? 9 : 7} fill={colours[i % colours.length]} style={{ transition: "r 300ms" }} />
              <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fontSize={12} fontWeight={600} fill="var(--color-ink)" fontFamily="var(--font-sans)">
                {s.stage}
              </text>
            </g>
          );
        })}
        <text key={active} x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill="var(--color-muted)" fontFamily="var(--font-sans)" className="motion-safe:animate-[pip-in_400ms_var(--ease-out)_both]">
          {stages[active].note}
        </text>
      </svg>
    </Scene>
  );
}

/* Act 3: ask in plain words, see what was done. */
function ChatScene({ story, elapsed }: { story: Story; elapsed: number }) {
  const { question, answer, chips, thinking } = story.chat;
  const chars = Math.floor(elapsed / CHAR_MS);
  const pauseChars = Math.round(900 / SPEED / CHAR_MS);
  const q = question.slice(0, chars);
  const answerChars = chars - question.length - pauseChars;
  const a = answerChars > 0 ? answer.slice(0, answerChars) : "";
  const answerDoneAt = (question.length + answer.length + pauseChars) * CHAR_MS;
  const shown = elapsed > answerDoneAt ? Math.min(chips.length, Math.floor((elapsed - answerDoneAt) / (350 / SPEED)) + 1) : 0;
  return (
    <Scene>
      <div className="flex h-full flex-col justify-end gap-2 text-small">
        <p className="self-end rounded-card bg-ink px-3 py-2 text-canvas">{q || " "}</p>
        {chars > question.length + 4 && (
          <div className="self-start">
            <p className="rounded-card bg-mist px-3 py-2">{a || <span className="animate-pulse text-muted">{thinking}…</span>}</p>
            <div className="mt-2 flex min-h-6 flex-wrap gap-1.5">
              {chips.slice(0, shown).map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-0.5 text-caption motion-safe:animate-[pip-in_300ms_var(--ease-out)_both]">
                  <span className="size-1.5 rounded-full" style={{ background: c.review ? PINK : VIOLET }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}

/* Reduced motion: the three acts as a still list. */
function Summary({ story }: { story: Story }) {
  return (
    <ol className="flex h-full flex-col justify-center gap-3">
      {story.acts.map((a, i) => (
        <li key={a.name} className="flex gap-3">
          <span className="text-caption text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span className="block text-small font-semibold">{a.name}</span>
            <span className="block text-caption text-muted">{a.line}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
