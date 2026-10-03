import NextLink from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Tone = "canvas" | "plum";
type Size = "md" | "lg";

const base =
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-medium whitespace-nowrap " +
  "transition-colors duration-200 ease-out focus-visible:shadow-(--focus-ring) force-focus:shadow-(--focus-ring) " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-small",
  lg: "h-13 px-7 text-body",
};

/* Primary hover fills with the soma gradient. It's a pseudo-element so the
   colour change can fade; gradients themselves can't transition. */
const somaHover =
  "before:absolute before:inset-0 before:-z-10 before:bg-soma before:opacity-0 before:transition-opacity before:duration-200 before:ease-out " +
  "hover:before:opacity-100 force-hover:before:opacity-100";

const variants: Record<Tone, Record<Variant, string>> = {
  canvas: {
    primary: cn("bg-ink text-canvas", somaHover),
    secondary:
      "border border-ink text-ink hover:bg-ink hover:text-canvas force-hover:bg-ink force-hover:text-canvas",
  },
  plum: {
    primary: cn("bg-canvas text-plum hover:text-canvas force-hover:text-canvas", somaHover),
    secondary:
      "border border-canvas text-canvas hover:bg-canvas hover:text-plum force-hover:bg-canvas force-hover:text-plum",
  },
};

interface StyleProps {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = "primary", tone = "canvas", size = "md", className }: Omit<StyleProps, "children">) {
  return cn(base, sizes[size], variants[tone][variant], className);
}

type ButtonAsLink = StyleProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof NextLink>, "href" | "className">;
type ButtonAsButton = StyleProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">;

/** Pill button. Label says what happens; never append arrows. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant, tone, size, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, tone, size, className });
  if (rest.href !== undefined) {
    return (
      <NextLink {...(rest as Omit<ButtonAsLink, keyof StyleProps>)} className={classes}>
        {children}
      </NextLink>
    );
  }
  const buttonProps = rest as Omit<ButtonAsButton, keyof StyleProps>;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
