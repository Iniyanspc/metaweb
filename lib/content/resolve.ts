import type { ArchitectureDiagram, Technology } from "./types";
import type { FlowNode } from "@/components/diagrams/ArchitectureFlow";

/** Swap technology slugs for display names; unknown or hidden slugs are dropped. */
export function techNames(slugs: string[], all: Technology[]) {
  return slugs.map((s) => all.find((t) => t.slug === s)?.name).filter((n): n is string => Boolean(n));
}

export function flowNodes(diagram: ArchitectureDiagram, all: Technology[]): FlowNode[] {
  return diagram.nodes.map((n) => ({ ...n, technologies: techNames(n.technologies ?? [], all) }));
}

export function groupTechnologies(all: Technology[], philosophy?: Record<string, string>) {
  const order: string[] = [];
  for (const t of all) if (!order.includes(t.category)) order.push(t.category);
  return order.map((category) => ({
    category,
    philosophy: philosophy?.[category],
    items: all.filter((t) => t.category === category).map((t) => t.name),
  }));
}
