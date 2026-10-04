import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SiteEmail, SitePhone } from "@/components/ui/ContactDetails";
import { VerifiedText } from "@/components/ui/Placeholder";
import { maskEmail } from "@/lib/email";
import { getPages, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getPages();
  return pageMetadata(contact.seo, "/contact");
}

export default async function ContactPage() {
  const [{ contact: c }, site] = await Promise.all([getPages(), getSite()]);
  // Fill site facts into the form copy here, on the server; the email goes in masked.
  const formCopy = {
    ...c.form,
    success: site.responseTime.verified ? c.form.success.replace("[RESPONSE TIME]", site.responseTime.value) : c.form.success,
    errorServer: site.email.verified ? c.form.errorServer.replace("[EMAIL]", maskEmail(site.email.value)) : c.form.errorServer,
  };
  return (
    <>
      <PageHero title={c.title} support={c.support} breadcrumbs={[{ label: "Contact", href: "/contact" }]} />
      <Container className="pb-(--section-y)">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="lg:col-span-7">
            <Suspense>
              <ContactForm copy={formCopy} />
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
                    <SiteEmail site={site} />
                  </dd>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.phone}</dt>
                  <dd>
                    <SitePhone site={site} />
                  </dd>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-caption text-muted">{c.details.offices}</dt>
                  {site.offices.map((o, i) => (
                    <dd key={i}>
                      <VerifiedText field={o} render={(v) => <address className="not-italic">{v.address}</address>} />
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
