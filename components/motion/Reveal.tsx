"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { observeOnce } from "./observer";

export type RevealVariant = "up" | "fade" | "left" | "right" | "scale" | "image";

/**
 * Plays an entrance once when the element scrolls into view.
 * Without JavaScript, or with reduced motion, content is simply visible.
 * "image" clips the frame open while the picture settles from a slight zoom.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** Milliseconds; use for staggering siblings. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.setAttribute("data-shown", ""));
  }, []);
  return (
    <Tag ref={ref} data-reveal={variant} className={cn("reveal", className)} style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
