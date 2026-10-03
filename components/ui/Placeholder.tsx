import type { ReactNode } from "react";
import type { Verified } from "@/lib/content/types";
import { cn } from "@/lib/cn";

/** Inline bracketed placeholder. Impossible to miss in review. */
export function Placeholder({ label, className }: { label: string; className?: string }) {
  return <span className={cn("placeholder", className)}>{label}</span>;
}

/** Renders a verified value, or the placeholder treatment when it isn't known yet. */
export function VerifiedText<T>({
  field,
  render,
  className,
}: {
  field: Verified<T>;
  render?: (value: T) => ReactNode;
  className?: string;
}) {
  if (!field.verified) return <Placeholder label={field.placeholder} className={className} />;
  return <>{render ? render(field.value) : (field.value as ReactNode)}</>;
}

/** Dashed 160×64 slot for a logo we don't have yet. */
export function LogoSlot({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-16 w-40 items-center justify-center rounded-media border border-dashed border-plum bg-plum-50 px-2 text-center text-caption text-plum",
        className,
      )}
    >
      {label}
    </span>
  );
}
