import { cn } from "@/lib/cn";

/** Disclosure caret in the icon set's stroke language. */
export function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden
      className={cn("transition-transform duration-200 ease-out", open && "rotate-180", className)}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
