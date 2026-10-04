import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AgentChat, AgentLoop, AgentTimeline, AgentTools } from "@/components/sections/agentic/AgenticSamples";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Agentic AI card options",
  robots: { index: false, follow: false },
};

/* Internal preview: the four picture-in-picture options, each in place over
   the hero photo. Not linked from the site. */

const OPTIONS: { key: string; title: string; note: string; card: ReactNode }[] = [
  { key: "A", title: "A. Agent at work", note: "A real task, step by step: read data, reason, act, hand over for approval. Loops through three business tasks.", card: <AgentTimeline /> },
  { key: "B", title: "B. The agent loop", note: "Perceive, reason, act, learn: a pulse travels the loop and each stage lights in turn.", card: <AgentLoop /> },
  { key: "C", title: "C. Agent and tools", note: "The agent calls each tool in turn, then a result slides in.", card: <AgentTools /> },
  { key: "D", title: "D. Ask, then act", note: "A question types in, the agent answers, and the actions it took appear as chips.", card: <AgentChat /> },
];

export default function AgenticPreview() {
  return (
    <Container className="py-16">
      <p className="text-caption text-muted">Internal preview, not indexed</p>
      <h1 className="mt-3 text-h2">Agentic AI card: four options</h1>
      <p className="mt-3 text-body-lg text-muted">Each card is 16:9 and sits where it would in the hero. Pick one and it replaces the logo card.</p>
      <div className="mt-16 flex flex-col gap-28">
        {OPTIONS.map((o) => (
          <section key={o.key} aria-labelledby={`opt-${o.key}`}>
            <h2 id={`opt-${o.key}`} className="text-h3">
              {o.title}
            </h2>
            <p className="mt-2 text-body text-muted">{o.note}</p>
            <div className="relative mt-8 mb-16">
              <div className="relative aspect-[21/9] overflow-hidden rounded-media">
                <Photo name="office-open" sizes="(min-width: 1280px) 1280px, 100vw" className="object-[45%_75%]" />
              </div>
              <div className="absolute right-[4%] -bottom-16 w-[36%] min-w-80 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)] ring-8 ring-canvas">{o.card}</div>
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
