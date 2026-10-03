/** Enterprise data → … → Business actions, drawn for plum: lilac nodes, white at the outcome. */
export function AiFlow({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="relative grid gap-6 sm:grid-cols-5 sm:gap-(--gutter)">
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-canvas/25 sm:top-[7px] sm:right-[10%] sm:bottom-auto sm:left-[10%] sm:h-0.5 sm:w-auto" />
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step} className="relative flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
            <span aria-hidden className={`relative size-4 shrink-0 rounded-full ring-4 ring-plum ${last ? "bg-canvas" : "bg-lilac"}`} />
            <span className={last ? "font-medium text-canvas" : "text-lilac"}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
