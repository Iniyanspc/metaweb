import type { CaseStudy, Industry } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { VerifiedText } from "@/components/ui/Placeholder";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Card, CardLink } from "./Card";
import { MetricValue } from "./MetricValue";

/** Client name, or "[Industry] organisation" until the client approves being named. */
export function ClientName({ study, industry }: { study: CaseStudy; industry?: Industry }) {
  if (!study.publicApproval) return <>{industry ? `${industry.name} organisation` : "Client organisation"}</>;
  return <VerifiedText field={study.client} />;
}

export function CaseStudyCard({
  study,
  industry,
  variant = "compact",
}: {
  study: CaseStudy;
  industry?: Industry;
  variant?: "feature" | "compact";
}) {
  const href = `/case-studies/${study.slug}`;
  const feature = variant === "feature";
  return (
    <Card href={href} padded={!feature} className={cn("h-full", feature && "md:grid md:grid-cols-[5fr_7fr]")}>
      {feature && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-card md:aspect-auto md:min-h-80 md:rounded-l-card md:rounded-tr-none">
          <Photo name={study.image} alt="" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      )}
      <div className={cn("flex flex-1 flex-col", feature && "p-8 md:p-10")}>
        <p className="text-caption text-muted">
          <ClientName study={study} industry={industry} />
          {industry && <span className="sr-only">, </span>}
          {industry && <span className="ml-3 border-l border-line pl-3">{industry.name}</span>}
        </p>
        <h3 className={cn("mt-4", feature ? "text-h3" : "text-h4 font-semibold")}>
          <PlaceholderText text={study.title} />
        </h3>
        <p className="mt-3 text-small text-muted">
          <PlaceholderText text={study.summary} />
        </p>
        {feature && study.metrics.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <dd className="font-display text-h3">
                  <MetricValue metric={m} />
                </dd>
                <dt className="mt-1 text-caption text-muted">{m.label}</dt>
              </div>
            ))}
          </dl>
        )}
        <CardLink href={href}>See the case study</CardLink>
      </div>
    </Card>
  );
}
