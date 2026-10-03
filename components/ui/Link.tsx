import NextLink from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentPropsWithoutRef<typeof NextLink>, "href"> & {
  href: string;
  /** Underline is hidden until hover (default) or always shown. */
  underline?: "hover" | "always";
};

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

/** Text link. Underline grows from the left on hover and focus. */
export function Link({ href, underline = "hover", className, children, ...rest }: Props) {
  const classes = cn(
    "link-underline rounded-[2px] focus-visible:shadow-(--focus-ring)",
    underline === "always" && "bg-size-[100%_1px]",
    "force-hover:bg-size-[100%_1px] force-focus:shadow-(--focus-ring)",
    className,
  );
  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
}
