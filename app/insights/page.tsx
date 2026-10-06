import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InsightCard } from "@/components/cards/InsightCard";
import { CategoryFilter } from "@/components/sections/CategoryFilter";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getInsights, getPages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { insights } = await getPages();
  return pageMetadata(insights.seo, "/insights");
}

const GRID = "grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3";

export default async function InsightsPage() {
  const [{ insights: page }, insights] = await Promise.all([getPages(), getInsights()]);
  // Nothing published yet: the section stays off the live site (see lib/publish.ts).
  if (insights.length === 0) notFound();
  const featured = insights.find((i) => i.featured);
  const categories = [...new Set(insights.map((i) => i.category))];
  // The featured article leads the unfiltered view; filtered views list everything matching.
  const items = insights.map((i) => ({ key: i.slug, category: i.category, node: <InsightCard insight={i} /> }));
  const unfiltered = items.filter((i) => i.key !== featured?.slug);

  return (
    <>
      <PageHero title={page.title} support={page.support} breadcrumbs={[{ label: "Insights", href: "/insights" }]} />
      <Container className="pb-(--section-y)">
        {insights.length === 0 ? (
          <p className="text-body text-muted">{page.empty}</p>
        ) : (
          <Suspense
            fallback={
              <>
                {featured && <InsightCard insight={featured} feature />}
                {unfiltered.length > 0 && <ul className={`mt-10 ${GRID}`}>{unfiltered.map((i) => <li key={i.key}>{i.node}</li>)}</ul>}
              </>
            }
          >
            <CategoryFilter
              items={items}
              categories={categories}
              allLabel={page.allLabel}
              emptyLabel={page.empty}
              label="Filter articles by category"
              gridClassName={GRID}
              lead={featured ? <InsightCard insight={featured} feature /> : undefined}
              leadKey={featured?.slug}
            />
          </Suspense>
        )}
      </Container>
    </>
  );
}
