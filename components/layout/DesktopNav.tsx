"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MegaMenu, NavItem } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Node } from "@/components/ui/Node";
import { Chevron } from "./Chevron";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

const itemClasses =
  "inline-flex h-10 items-center gap-1.5 rounded-pill px-3.5 text-small font-medium text-ink transition-colors duration-200 ease-out " +
  "hover:bg-mist focus-visible:shadow-(--focus-ring)";

export function DesktopNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const baseId = useId();

  const schedule = useCallback((next: number | null, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  }, []);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(null);
  }, []);

  // Escape closes and returns focus to the trigger; clicks outside close.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggers.current[open]?.focus();
      close();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      ref={rootRef}
      className="hidden lg:block"
      onPointerLeave={(e) => e.pointerType === "mouse" && schedule(null, CLOSE_DELAY)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <ul className="flex items-center gap-0.5">
        {items.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (!item.menu) {
            return (
              <li key={item.href}>
                <NextLink
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemClasses, active && "bg-mist")}
                  onPointerEnter={(e) => e.pointerType === "mouse" && schedule(null, OPEN_DELAY)}
                >
                  {item.label}
                </NextLink>
              </li>
            );
          }
          const panelId = `${baseId}-panel-${i}`;
          const isOpen = open === i;
          return (
            <li key={item.href}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(itemClasses, (isOpen || active) && "bg-mist")}
                onClick={() => (isOpen ? close() : (clearTimeout(timer.current), setOpen(i)))}
                onPointerEnter={(e) => e.pointerType === "mouse" && schedule(i, open === null ? OPEN_DELAY : 0)}
              >
                {item.label}
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {items.map((item, i) =>
        item.menu ? (
          <div
            key={item.href}
            id={`${baseId}-panel-${i}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && clearTimeout(timer.current)}
            className={cn(
              "absolute inset-x-0 top-full border-t border-line bg-canvas shadow-(--shadow-menu)",
              "transition-[opacity,translate,visibility] duration-180 ease-out",
              open === i ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
            )}
          >
            <MegaPanel menu={item.menu} label={item.label} onNavigate={close} />
          </div>
        ) : null,
      )}
    </div>
  );
}

function MegaPanel({ menu, label, onNavigate }: { menu: MegaMenu; label: string; onNavigate: () => void }) {
  const hasFeature = Boolean(menu.feature);
  const linkClasses = "group block rounded-card py-2 focus-visible:shadow-(--focus-ring)";
  return (
    <Container className="py-10">
      <nav aria-label={label} className="grid grid-cols-12 gap-x-(--gutter)">
        <div className={cn(hasFeature ? "col-span-8" : "col-span-12")}>
          <NextLink
            href={menu.overview.href}
            onClick={onNavigate}
            className="link-underline mb-8 inline-block rounded-[2px] font-display text-h4 font-medium focus-visible:shadow-(--focus-ring)"
          >
            {menu.overview.label}
          </NextLink>
          <div className={cn("grid gap-x-(--gutter) gap-y-6", menu.columns.length > 1 ? "grid-cols-3" : "grid-cols-2")}>
            {menu.columns.map((col, ci) => (
              <div key={col.heading ?? ci} className={cn(menu.columns.length === 1 && "col-span-2")}>
                {col.heading && (
                  <p className="mb-3 flex items-center gap-2 text-caption text-muted">
                    {col.pillar && <Node pillar={col.pillar} size={8} />}
                    {col.heading}
                  </p>
                )}
                <ul className={cn(menu.columns.length === 1 && "grid grid-cols-2 gap-x-(--gutter)")}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <NextLink href={link.href} onClick={onNavigate} className={linkClasses}>
                        <span className="link-underline font-medium group-hover:bg-size-[100%_1px]">{link.label}</span>
                        {link.description && <span className="mt-1 block text-small text-muted">{link.description}</span>}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {menu.footer && (
            <div className="mt-6 border-t border-line pt-6">
              <NextLink href={menu.footer.href} onClick={onNavigate} className={linkClasses}>
                <span className="link-underline font-medium group-hover:bg-size-[100%_1px]">{menu.footer.label}</span>
                {menu.footer.description && <span className="mt-1 block text-small text-muted">{menu.footer.description}</span>}
              </NextLink>
            </div>
          )}
        </div>
        {menu.feature && (
          <div className="col-span-4 flex flex-col gap-3 rounded-card bg-mist p-8">
            <Node pillar="data" />
            <p className="font-display text-h3">{menu.feature.title}</p>
            <p className="text-small text-muted">{menu.feature.body}</p>
            <NextLink
              href={menu.feature.link.href}
              onClick={onNavigate}
              className="link-underline mt-auto self-start rounded-[2px] text-small font-medium focus-visible:shadow-(--focus-ring)"
            >
              {menu.feature.link.label}
            </NextLink>
          </div>
        )}
      </nav>
    </Container>
  );
}
