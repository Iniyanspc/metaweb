import type { Metadata } from "next";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { VerifiedText } from "@/components/ui/Placeholder";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getHome, getPages, getRoles, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { careers } = await getPages();
  return pageMetadata(careers.seo, "/careers");
}

export default async function CareersPage() {
  const [{ careers: c }, roles, site, home] = await Promise.all([getPages(), getRoles(), getSite(), getHome()]);
  const emptyText = site.email.verified ? c.roles.empty.replace("[EMAIL]", site.email.value) : c.roles.empty;

  return (
    <>
      <PageHero
        title={c.title}
        support={c.support}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
        ]}
      >
        <div>
          <Button href="#roles">{c.roles.heading}</Button>
        </div>
      </PageHero>

      <Section pillar="business" labelledBy="why-title" className="pt-0 md:pt-0">
        <SectionHeader id="why-title" title={c.why.heading} />
        <ul className="grid gap-(--gutter) md:grid-cols-3">
          {c.why.points.map((p) => (
            <li key={p.title} className="border-t border-ink pt-6">
              <h3 className="text-h4 font-semibold">{p.title}</h3>
              <p className="mt-3 text-body text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section pillar="data" tone="mist" labelledBy="culture-title">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-(--gutter)">
          <div>
            <h2 id="culture-title" className="text-h3">
              {c.culture.heading}
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-body">
              {c.culture.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-h3">{c.learning.heading}</h2>
            <p className="mt-5 text-body">
              <PlaceholderText text={c.learning.body} />
            </p>
          </div>
        </div>
      </Section>

      <Section pillar="business" labelledBy="hiring-title">
        <SectionHeader id="hiring-title" title={c.hiring.heading} />
        <ProcessTimeline steps={c.hiring.steps} label={c.hiring.heading} compact />
      </Section>

      <Section pillar="business" tone="mist" labelledBy="benefits-title">
        <h2 id="benefits-title" className="text-h3">
          {c.benefits.heading}
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {c.benefits.items.map((b, i) => (
            <li key={i}>
              <PlaceholderText text={b} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="roles" pillar="business" labelledBy="roles-title" className="scroll-mt-(--nav-height)">
        <SectionHeader id="roles-title" title={c.roles.heading} />
        {roles.length === 0 ? (
          <p className="text-body-lg">
            <PlaceholderText text={emptyText} />
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {roles.map((r) => (
              <li key={r.slug} className="grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-x-(--gutter)">
                <div className="md:col-span-6">
                  <h3 className="text-h4 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-small text-muted">{r.summary}</p>
                </div>
                <p className="flex flex-wrap gap-x-3 text-small text-muted md:col-span-3">
                  <span>{r.group}</span>
                  <span className="border-l border-line pl-3">{r.type}</span>
                  <span className="border-l border-line pl-3">
                    <VerifiedText field={r.location} />
                  </span>
                </p>
                <div className="md:col-span-3 md:justify-self-end">
                  {r.applyUrl.verified ? (
                    <Button href={r.applyUrl.value} variant="secondary">
                      {c.roles.apply}
                    </Button>
                  ) : (
                    <VerifiedText field={r.applyUrl} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <FinalCta {...home.finalCta} />
    </>
  );
}
