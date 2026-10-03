"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Sticky header. Gains a hairline once the page has scrolled, slides away while
 * reading downwards, and returns as soon as the visitor scrolls up. It never
 * hides while a menu is open or focus is inside it.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const header = ref.current;
      const engaged = Boolean(header?.contains(document.activeElement) || header?.querySelector('[aria-expanded="true"]'));
      setScrolled(y > 4);
      if (Math.abs(y - lastY) > 6) {
        setHidden(!engaged && y > lastY && y > 320);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-40 border-b bg-canvas/90 backdrop-blur-md transition-[transform,border-color] duration-300 ease-out motion-reduce:transition-none",
        scrolled ? "border-line" : "border-transparent",
        hidden && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
