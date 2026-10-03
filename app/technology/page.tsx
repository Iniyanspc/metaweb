import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getHome, getPages, getTechnologies, getTechPhilosophy } from "@/lib/content";
import { groupTechnologies } from "@/lib/content/resolve";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { technology } = await getPages();
  return pageMetadata(technology.seo, "/technology");
}

export default async function TechnologyPage() {
  const [{ technology: page }, technologies, philosophy, home] = await Promise.all([getPages(), getTechnologies(), getTechPhilosophy(), getHome()]);
  const groups = groupTechnologies(technologies, philosophy);

  return (
    <>
      <PageHero
        title={page.title}
        support={page.support}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Technology", href: "/technology" },
        ]}
      >
        <p className="text-small text-muted">{page.note}</p>
      </PageHero>
      <Container className="pb-(--section-y)">
        <ul className="border-b border-line">
          {groups.map((g) => (
            <li key={g.category} className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-x-(--gutter)">
              <div className="lg:col-span-5">
                <h2 className="text-h3">{g.category}</h2>
                {g.philosophy && <p className="mt-3 text-body text-muted">{g.philosophy}</p>}
              </div>
              <ul className="flex flex-wrap content-start gap-2 lg:col-span-6 lg:col-start-7">
                {g.items.map((name) => (
                  <li key={name} className="rounded-pill border border-line px-4 py-2 text-small">
                    {name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
