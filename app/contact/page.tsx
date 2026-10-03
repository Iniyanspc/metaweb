import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Link } from "@/components/ui/Link";
import { PageHero } from "@/components/ui/PageHero";
import { VerifiedText } from "@/components/ui/Placeholder";
import { getPages, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getPages();
  return pageMetadata(contact.seo, "/contact");
}

export default async function ContactPage() {
  const [{ contact: c }, site] = await Promise.all([getPages(), getSite()]);
  return (
    <>
      <PageHero title={c.title} support={c.support} breadcrumbs={[{ label: "Contact", href: "/contact" }]} />
      <Container className="pb-(--section-y)">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-7">
            <Suspense>
              <ContactForm copy={c.form} />
            </Suspense>
          </div>
          <aside aria-labelledby="details-title" className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-card bg-mist p-8">
              <h2 id="details-title" className="text-h4 font-semibold">
                {c.details.heading}
              </h2>
              <dl className="mt-6 flex flex-col gap-5 text-small">
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.email}</dt>
                  <dd>
                    <VerifiedText field={site.email} render={(e) => <Link href={`mailto:${e}`}>{e}</Link>} />
                  </dd>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.phone}</dt>
                  <dd>
                    <VerifiedText field={site.phone} render={(p) => <Link href={`tel:${p}`}>{p}</Link>} />
                  </dd>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.offices}</dt>
                  {site.offices.map((o, i) => (
                    <dd key={i}>
                      <VerifiedText field={o} render={(v) => `${v.city}, ${v.address}`} />
                    </dd>
                  ))}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.response}</dt>
                  <dd>
                    <VerifiedText field={site.responseTime} />
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
