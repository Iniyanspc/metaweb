import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/cards/ProductCard";
import { CategoryFilter } from "@/components/sections/CategoryFilter";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { getHome, getPages, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { products } = await getPages();
  return pageMetadata(products.seo, "/products");
}

const GRID = "grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3";

export default async function ProductsPage() {
  const [{ products: page }, products, home] = await Promise.all([getPages(), getProducts(), getHome()]);
  const categories = [...new Set(products.map((p) => p.category))];
  const items = products.map((p) => ({ key: p.slug, category: p.category, node: <ProductCard product={p} /> }));
  const anyReal = products.some((p) => p.name.verified);

  return (
    <>
      <PageHero title={page.title} support={page.support} breadcrumbs={[{ label: "Products", href: "/products" }]} />
      <Container className="pb-(--section-y)">
        {!anyReal && (
          <p className="mb-10 text-body">
            <PlaceholderText text={home.products.empty} />
          </p>
        )}
        <Suspense fallback={<ul className={GRID}>{items.map((i) => <li key={i.key}>{i.node}</li>)}</ul>}>
          <CategoryFilter items={items} categories={categories} allLabel={page.allLabel} emptyLabel={home.products.empty} label="Filter products by category" gridClassName={GRID} />
        </Suspense>
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
