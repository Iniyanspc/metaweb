import type { ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";

/**
 * Shared card frame: 1px line border, 4px radius, no shadow. Border turns ink
 * on hover. When `href` is set the whole card is the link target.
 */
export function Card({
  href,
  padded = true,
  className,
  children,
}: {
  href?: string;
  /** False for cards with edge-to-edge media; the body then sets its own padding. */
  padded?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "group relative flex flex-col rounded-card border border-line bg-canvas transition-colors duration-160 ease-out",
    padded && "p-8",
    href && "hover:border-ink focus-within:border-ink",
    className,
  );
  if (!href) return <div className={classes}>{children}</div>;
  return (
    <div className={classes}>
      {children}
      {/* Stretched link: keeps the card's text selectable and the link name short. */}
      <NextLink href={href} className="absolute inset-0 rounded-card focus-visible:shadow-(--focus-ring)" aria-hidden tabIndex={-1} />
    </div>
  );
}

/** The card's visible text link; sits above the stretched link. */
export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-auto pt-6">
      <NextLink
        href={href}
        className="link-underline relative z-10 rounded-[2px] text-small font-medium group-hover:bg-size-[100%_1px] focus-visible:shadow-(--focus-ring)"
      >
        {children}
      </NextLink>
    </div>
  );
}
