import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { formatDate, InsightCard } from "@/components/cards/InsightCard";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { VerifiedText } from "@/components/ui/Placeholder";
import { getInsight, getInsightSlugs, getInsights, getPages, getTeamMember } from "@/lib/content";
import { isInsightLive } from "@/lib/content/insights";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getInsightSlugs()).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const file = await getInsight((await params).slug);
  if (!file) return {};
  const { meta } = file;
  return pageMetadata({ title: meta.title, description: meta.excerpt.slice(0, 155) }, `/insights/${meta.slug}`, {
    type: "article",
    noindex: meta.sample,
  });
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [file, all, { insights: labels }] = await Promise.all([getInsight(slug), getInsights(), getPages()]);
  if (!file || !isInsightLive(file.meta)) notFound();
  const { meta, body } = file;
  const author = meta.author ? await getTeamMember(meta.author) : undefined;
  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  const related = all.filter((i) => i.slug !== meta.slug).sort((a, b) => Number(b.category === meta.category) - Number(a.category === meta.category)).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.excerpt,
          datePublished: meta.publishedAt,
          author: author?.name.verified ? { "@type": "Person", name: author.name.value } : { "@type": "Organization", name: "metadatum" },
          publisher: { "@type": "Organization", name: "metadatum", logo: { "@type": "ImageObject", url: absoluteUrl("/brand/metadatum-mark-512.png") } },
          mainEntityOfPage: absoluteUrl(`/insights/${meta.slug}`),
        }}
      />
      <article>
        <Container className="pt-10 md:pt-14">
          <Breadcrumbs
            items={[
              { label: "Insights", href: "/insights" },
              { label: meta.title, href: `/insights/${meta.slug}` },
            ]}
          />
          <header className="mx-auto mt-12 max-w-3xl md:mt-16">
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-muted">
              <span>{meta.category}</span>
              <time dateTime={meta.publishedAt} className="border-l border-line pl-3">
                {formatDate(meta.publishedAt)}
              </time>
              <span className="border-l border-line pl-3">{meta.readingMinutes} min read</span>
              {meta.sample && <span className="placeholder">Sample article</span>}
            </p>
            <h1 className="mt-5 text-h1">{meta.title}</h1>
            <p className="mt-6 text-body-lg text-muted">{meta.excerpt}</p>
            {/* A published team member, or the team when the author isn't public yet. */}
            <p className="mt-8 flex items-center gap-3 text-small">
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-mist">
                <span className="size-2.5 rounded-full bg-pink" />
              </span>
              <span>
                <span className="sr-only">{labels.by} </span>
                {author ? <VerifiedText field={author.name} /> : labels.teamByline}
                {author && (
                  <span className="block text-caption text-muted">
                    <VerifiedText field={author.role} />
                  </span>
                )}
              </span>
            </p>
          </header>
          <Reveal variant="image" className="relative mx-auto mt-12 aspect-[21/9] max-w-5xl rounded-media">
            <Photo name={meta.image} sizes="(min-width: 1024px) 1024px, 100vw" priority />
          </Reveal>
          <div className="prose-md mx-auto max-w-[68ch] py-16 md:py-20">{content}</div>
        </Container>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-mist py-(--section-y)">
          <Container>
            <h2 id="related-title" className="text-h2">
              {labels.related}
            </h2>
            <ul className="mt-10 grid gap-(--gutter) md:grid-cols-2 lg:grid-cols-3">
              {related.map((i) => (
                <li key={i.slug}>
                  <InsightCard insight={i} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
