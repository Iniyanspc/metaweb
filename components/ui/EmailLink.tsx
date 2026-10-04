"use client";

import { cn } from "@/lib/cn";

/**
 * Shows "user at domain" and opens the mail client on click. The address is
 * passed in two parts and only joined in the browser, at click time. Without
 * JavaScript the link falls back to the contact page.
 */
export function EmailLink({ user, domain, className }: { user: string; domain: string; className?: string }) {
  return (
    <a
      href="/contact"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${user}${String.fromCharCode(64)}${domain}`;
      }}
      className={cn("link-underline rounded-[2px] focus-visible:shadow-(--focus-ring)", className)}
    >
      {user} at {domain}
    </a>
  );
}
