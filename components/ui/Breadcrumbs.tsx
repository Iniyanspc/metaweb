import NextLink from "next/link";
import type { Link as LinkType } from "@/lib/content/types";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

/** Visible trail plus BreadcrumbList JSON-LD. The last item is the current page. */
export function Breadcrumbs({ items }: { items: LinkType[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-muted">
          {trail.map((item, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <NextLink href={item.href} className="link-underline rounded-[2px] focus-visible:shadow-(--focus-ring)">
                      {item.label}
                    </NextLink>
                    <span aria-hidden className="size-1 rounded-full bg-muted/40" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
