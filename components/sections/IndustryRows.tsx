import type { Industry } from "@/lib/content/types";
import { Icon, isIconName } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Link";
import { lowerFirst } from "@/lib/text";

/** Expanding-row list. Native <details>, so it works without JavaScript. */
export function IndustryRows({ industries, headingLevel = "h3" }: { industries: Industry[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="border-t border-line">
      {industries.map((industry) => (
        <li key={industry.slug} id={industry.slug} className="scroll-mt-24 border-b border-line">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-5 rounded-card py-6 focus-visible:shadow-(--focus-ring) md:gap-8 [&::-webkit-details-marker]:hidden">
              {isIconName(industry.icon) && <Icon name={industry.icon} size={28} className="hidden sm:block" />}
              <span className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                <Heading className="font-display text-h3 md:w-[40%] md:shrink-0">{industry.name}</Heading>
                <span className="text-small text-muted md:text-body">{industry.line}</span>
              </span>
              <span aria-hidden className="relative size-5 shrink-0">
                <span className="absolute top-1/2 left-0 h-0.5 w-5 -translate-y-1/2 bg-ink" />
                <span className="absolute top-0 left-1/2 h-5 w-0.5 -translate-x-1/2 bg-ink transition-transform duration-200 group-open:scale-y-0" />
              </span>
            </summary>
            <div className="pb-8 sm:pl-[60px] md:pl-[calc(28px+2rem)]">
              <p className="text-caption text-muted">Solutions we build</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {industry.solutions.slice(0, 3).map((s) => (
                  <li key={s} className="rounded-pill border border-line px-4 py-2 text-small">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-small font-medium">
                {industry.hasPage ? (
                  <Link href={`/industries/${industry.slug}`} underline="always">
                    {`See ${lowerFirst(industry.name)}`}
                  </Link>
                ) : (
                  <Link href={`/contact?topic=${industry.slug}`} underline="always">
                    Talk to us about your organisation
                  </Link>
                )}
              </p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
