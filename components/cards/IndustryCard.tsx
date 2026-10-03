import NextLink from "next/link";
import type { Industry } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";

/** Full-bleed photo tile with the industry name over a soft gradient. */
export function IndustryCard({ industry, tall = false, delay = 0 }: { industry: Industry; tall?: boolean; delay?: number }) {
  const href = industry.hasPage ? `/industries/${industry.slug}` : `/contact?topic=${industry.slug}`;
  return (
    <Reveal variant="image" delay={delay} className="h-full rounded-card">
      <NextLink
        href={href}
        className={cn(
          "group relative flex h-full flex-col justify-end overflow-hidden rounded-card focus-visible:shadow-(--focus-ring)",
          tall ? "min-h-[28rem]" : "min-h-72",
        )}
      >
        <Photo name={industry.image} alt="" sizes="(min-width: 1024px) 33vw, 100vw" className="transition-transform duration-700 ease-out group-hover:scale-105" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/0" />
        <span className="relative p-6 text-canvas [text-shadow:0_1px_12px_rgb(0_0_0/0.35)] md:p-8">
          <span className="block font-display text-h3">{industry.name}</span>
          <span className="mt-2 block max-w-[40ch] text-small text-canvas/85">{industry.line}</span>
        </span>
      </NextLink>
    </Reveal>
  );
}
