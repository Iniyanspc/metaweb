import { cn } from "@/lib/cn";

/** A real sequence, so numbered. Horizontal from 1024px, vertical below. */
export function ProcessTimeline({
  steps,
  label,
  onDark = false,
  compact = false,
}: {
  steps: { title: string; body: string }[];
  label: string;
  onDark?: boolean;
  compact?: boolean;
}) {
  return (
    <ol aria-label={label} className={cn("relative grid gap-8 lg:gap-(--gutter)", !compact && "lg:grid-cols-7")}>
      <span
        aria-hidden
        className={cn(
          "absolute top-2 bottom-2 left-[7px] w-0.5",
          !compact && "lg:top-[7px] lg:right-[calc((100%-6*var(--gutter))/7)] lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-auto",
          onDark ? "bg-canvas/25" : "bg-ink/15",
        )}
      />
      {steps.map((step, i) => (
        <li key={step.title} className={cn("relative pl-10", !compact && "lg:pt-10 lg:pl-0")}>
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 left-0 size-4 rounded-full ring-4",
              !compact && "lg:top-0",
              onDark ? "bg-canvas ring-plum" : "bg-ink ring-canvas",
            )}
          />
          <p className={cn("text-caption", onDark ? "text-canvas/70" : "text-muted")}>{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 text-h4 font-semibold">{step.title}</h3>
          <p className={cn("mt-2 text-small", onDark ? "text-canvas/80" : "text-muted")}>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
