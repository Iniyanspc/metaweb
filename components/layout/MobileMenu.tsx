"use client";

import NextLink from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Link, NavItem } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { Chevron } from "./Chevron";

/**
 * Below 1024px: "Menu" opens a full-screen plum sheet. Native <dialog> gives
 * focus containment, Escape to close, and an inert page behind it.
 */
export function MobileMenu({ items, cta, logo }: { items: NavItem[]; cta: Link; logo: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const baseId = useId();

  const close = () => dialog.current?.close();
  const rowClasses =
    "flex w-full items-center justify-between rounded-card py-4 text-left font-display text-h3 text-canvas focus-visible:shadow-(--focus-ring)";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="inline-flex h-10 items-center rounded-pill border border-ink px-4 text-small font-medium focus-visible:shadow-(--focus-ring)"
      >
        Menu
      </button>
      <dialog
        ref={dialog}
        aria-label="Site menu"
        onClose={() => setExpanded(null)}
        className={cn(
          "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-plum p-0 text-canvas backdrop:bg-transparent",
          "opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-240 ease-out translate-y-2",
          "open:translate-y-0 open:opacity-100 starting:open:translate-y-2 starting:open:opacity-0",
          "[&_::selection]:bg-lilac [&_::selection]:text-plum",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-(--nav-height) shrink-0 items-center justify-between px-(--page-margin)">
            <NextLink href="/" onClick={close} className="rounded-[2px] focus-visible:shadow-(--focus-ring)">
              {logo}
            </NextLink>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 items-center rounded-pill border border-canvas px-4 text-small font-medium focus-visible:shadow-(--focus-ring)"
            >
              Close
            </button>
          </div>
          <nav aria-label="Main" className="flex-1 overflow-y-auto px-(--page-margin) pb-8">
            <ul className="divide-y divide-canvas/15">
              {items.map((item, i) => {
                if (!item.menu) {
                  return (
                    <li key={item.href}>
                      <NextLink href={item.href} onClick={close} className={rowClasses}>
                        {item.label}
                      </NextLink>
                    </li>
                  );
                }
                const isOpen = expanded === i;
                const listId = `${baseId}-list-${i}`;
                const links = [item.menu.overview, ...item.menu.columns.flatMap((c) => c.links), ...(item.menu.footer ? [item.menu.footer] : [])];
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={listId}
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className={rowClasses}
                    >
                      {item.label}
                      <Chevron open={isOpen} className="size-4" />
                    </button>
                    <ul id={listId} hidden={!isOpen} className="pb-4">
                      {links.map((link) => (
                        <li key={link.href}>
                          <NextLink
                            href={link.href}
                            onClick={close}
                            className="block rounded-card py-2.5 text-body text-canvas/85 hover:text-canvas focus-visible:shadow-(--focus-ring)"
                          >
                            {link.label}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="shrink-0 border-t border-canvas/15 px-(--page-margin) py-5">
            <NextLink href={cta.href} onClick={close} className={buttonClasses({ tone: "plum", size: "lg", className: "w-full" })}>
              {cta.label}
            </NextLink>
          </div>
        </div>
      </dialog>
    </div>
  );
}
