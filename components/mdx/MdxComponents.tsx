import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Node } from "@/components/ui/Node";

/** Highlighted note inside an article. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="not-prose flex gap-4 rounded-card border border-line bg-mist p-6 text-body">
      <Node pillar="ai" size={10} className="mt-2" />
      <div className="[&>p+p]:mt-3">
        {title && <p className="font-semibold">{title}</p>}
        <div className="mt-1 text-muted">{children}</div>
      </div>
    </aside>
  );
}

/** Components available inside content/insights/*.mdx. */
export const mdxComponents = {
  Callout,
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};
