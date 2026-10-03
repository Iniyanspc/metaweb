import type { Insight } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { NodePattern } from "@/components/ui/NodePattern";
import { Card, CardLink } from "./Card";

export function formatDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function InsightCard({ insight, feature = false }: { insight: Insight; feature?: boolean }) {
  const href = `/insights/${insight.slug}`;
  return (
    <Card href={href} padded={false} className={cn("h-full", feature && "md:grid md:grid-cols-2")}>
      <div className={cn("relative aspect-[16/9] overflow-hidden rounded-t-card", feature && "md:aspect-auto md:rounded-l-card md:rounded-tr-none")}>
        <NodePattern seed={insight.slug} accent="ai" />
      </div>
      <div className={cn("flex flex-1 flex-col p-8", feature && "md:p-10")}>
        <p className="flex flex-wrap gap-x-3 text-caption text-muted">
          <span>{insight.category}</span>
          <time dateTime={insight.publishedAt} className="border-l border-line pl-3">
            {formatDate(insight.publishedAt)}
          </time>
          {insight.sample && <span className="placeholder">Sample</span>}
        </p>
        <h3 className={cn("mt-4", feature ? "text-h3" : "text-h4 font-semibold")}>{insight.title}</h3>
        <p className="mt-3 text-small text-muted">{insight.excerpt}</p>
        <CardLink href={href}>Read the article</CardLink>
      </div>
    </Card>
  );
}
