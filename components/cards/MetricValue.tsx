import type { Metric } from "@/lib/content/types";
import { Placeholder } from "@/components/ui/Placeholder";

/** Verified metrics show their number; unverified ones are placeholders and never animate. */
export function MetricValue({ metric }: { metric: Metric }) {
  if (!metric.value.verified) return <Placeholder label={`${metric.value.placeholder}${metric.unit}`} className="text-h4" />;
  return (
    <>
      {metric.value.value}
      {metric.unit}
    </>
  );
}
