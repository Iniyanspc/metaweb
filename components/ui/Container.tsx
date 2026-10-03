import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Max 1280px content width with the fluid outer page margin. */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[calc(var(--container-site)+2*var(--page-margin))] px-(--page-margin)", className)}>
      {children}
    </Tag>
  );
}
