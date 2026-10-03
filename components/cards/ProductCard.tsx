import type { Product, ProductStatus } from "@/lib/content/types";
import { VerifiedText } from "@/components/ui/Placeholder";
import { Tag } from "@/components/ui/Tag";
import { Card, CardLink } from "./Card";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  concept: "Concept",
  "in-development": "In development",
  pilot: "Pilot",
  available: "Available",
};

export function ProductCard({ product }: { product: Product }) {
  const shot = product.screenshots[0];
  return (
    <Card padded={false} className="h-full">
      <div className="aspect-[16/10] overflow-hidden rounded-t-card border-b border-line">
        {shot?.verified ? (
          // eslint-disable-next-line @next/next/no-img-element -- replaced by next/image once real screenshots exist
          <img src={shot.value.src} alt={shot.value.alt} width={shot.value.width} height={shot.value.height} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-mist">
            <span className="placeholder text-caption">{shot?.verified === false ? shot.placeholder : "[SCREENSHOT]"}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{product.category}</Tag>
          <Tag tone={product.status === "available" ? "ink" : "line"}>{STATUS_LABEL[product.status]}</Tag>
        </div>
        <h3 className="mt-5 text-h4 font-semibold">
          <VerifiedText field={product.name} />
        </h3>
        <dl className="mt-4 grid gap-3 text-small">
          <div>
            <dt className="text-caption text-muted">Problem solved</dt>
            <dd className="mt-1">
              <VerifiedText field={product.problem} />
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Built for</dt>
            <dd className="mt-1">
              <VerifiedText field={product.targetCustomer} />
            </dd>
          </div>
        </dl>
        <CardLink href={product.cta.href}>{product.cta.label}</CardLink>
      </div>
    </Card>
  );
}
