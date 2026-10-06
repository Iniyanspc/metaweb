import type { Metadata } from "next";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { ProcessTimeline } from "@/components/diagrams/ProcessTimeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { Button } from "@/components/ui/Button";
import { Node } from "@/components/ui/Node";
import { PageHero } from "@/components/ui/PageHero";
import { VerifiedText } from "@/components/ui/Placeholder";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getHome, getPages, getSite, getTeam } from "@/lib/content";
import { isReady } from "@/lib/publish";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getPages();
  return pageMetadata(about.seo, "/about");
}

export default async function AboutPage() {
  const [{ about: a }, home, site, team] = await Promise.all([getPages(), getHome(), getSite(), getTeam()]);
  const leadership = team.filter((m) => m.group === "Leadership").slice(0, 4);
  // Blocks with unfilled [PLACEHOLDERS] stay off the live site until filled (see lib/publish.ts).
  const showMission = isReady(a.mission.body);
  const milestones = a.timeline.entries.filter((e) => isReady(e.year) && isReady(e.text));

  return (
    <>
      <PageHero image={a.image} title={a.title} support={a.support} breadcrumbs={[{ label: "About", href: "/about" }]} />

      <Section reveal pillar="business" labelledBy="who-title" className="pt-0 md:pt-0">
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <h2 id="who-title" className="text-h3 lg:col-span-4">
            {a.whoWeAre.heading}
          </h2>
          <div className="flex flex-col gap-5 text-body-lg lg:col-span-8">
            {a.whoWeAre.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section reveal pillar="bridge" tone="mist" labelledBy="beliefs-title">
        <h2 id="beliefs-title" className="text-caption text-muted">
          {a.beliefs.heading}
        </h2>
        <p className="mt-6 font-display text-h1">
          {a.beliefs.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        {showMission && (
        <div className="mt-16 grid gap-6 border-t border-line pt-10 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <h2 className="text-h3 lg:col-span-4">{a.mission.heading}</h2>
          <p className="text-body-lg lg:col-span-8">
            <PlaceholderText text={a.mission.body} />
          </p>
        </div>
        )}
      </Section>

      <Section reveal pillar="business" labelledBy="approach-title">
        <SectionHeader id="approach-title" title={a.approach.heading} support={a.approach.support} />
        <ProcessTimeline steps={home.process.steps} label={a.approach.heading} />
      </Section>

      <Section reveal pillar="data" tone="mist" labelledBy="philosophy-title">
        <SectionHeader id="philosophy-title" title={a.philosophy.heading} />
        <ul className="grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-4">
          {a.philosophy.points.map((p) => (
            <li key={p.title} className="rounded-card border border-line bg-canvas p-8">
              <h3 className="text-h4 font-semibold">{p.title}</h3>
              <p className="mt-3 text-small text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section reveal pillar="business" labelledBy="timeline-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          {milestones.length > 0 && (
          <div className="lg:col-span-7">
            <h2 id="timeline-title" className="text-h2">
              {a.timeline.heading}
            </h2>
            <ol className="relative mt-10 flex flex-col gap-8 pl-10">
              <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-ink/15" />
              {milestones.map((e, i) => (
                <li key={i} className="relative">
                  <span aria-hidden className="absolute top-1 -left-10 size-4 rounded-full bg-ink ring-4 ring-canvas" />
                  <p className="text-caption text-muted">
                    <PlaceholderText text={e.year} />
                  </p>
                  <p className="mt-2 text-body">
                    <PlaceholderText text={e.text} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
          )}
          <div className={milestones.length > 0 ? "lg:col-span-4 lg:col-start-9" : "lg:col-span-12"}>
            <h2 id={milestones.length > 0 ? undefined : "timeline-title"} className="text-h3">{a.locations.heading}</h2>
            <ul className="mt-6 flex flex-col gap-3 text-body">
              {site.offices.map((o, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Node pillar="business" size={8} className="mt-2.5" />
                  <VerifiedText field={o} render={(v) => <address className="not-italic">{v.address}</address>} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section reveal pillar="business" tone="mist" labelledBy="culture-title">
        <SectionHeader id="culture-title" title={a.culture.heading} />
        <ul className="grid gap-(--gutter) md:grid-cols-3">
          {a.culture.points.map((p) => (
            <li key={p.title} className="border-t border-ink pt-6">
              <h3 className="text-h4 font-semibold">{p.title}</h3>
              <p className="mt-3 text-body text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section reveal pillar="business" labelledBy={leadership.length > 0 ? "leaders-title" : "careers-title"}>
        {leadership.length > 0 && (
        <>
        <SectionHeader
          id="leaders-title"
          title={a.leadership.heading}
          action={<Button href={a.leadership.cta.href} variant="secondary">{a.leadership.cta.label}</Button>}
        />
        <ul className="grid grid-cols-2 gap-(--gutter) gap-y-10 lg:grid-cols-4">
          {leadership.map((m) => (
            <li key={m.id}>
              <TeamMemberCard member={m} />
            </li>
          ))}
        </ul>
        </>
        )}
        <div className={`${leadership.length > 0 ? "mt-20 " : ""}flex flex-col gap-6 rounded-card border border-line p-8 md:flex-row md:items-center md:justify-between md:p-12`}>
          <div>
            <h2 id="careers-title" className="text-h3">{a.careers.heading}</h2>
            <p className="mt-3 text-body text-muted">{a.careers.body}</p>
          </div>
          <Button href={a.careers.cta.href} variant="secondary" className="self-start md:self-auto">
            {a.careers.cta.label}
          </Button>
        </div>
      </Section>

      <FinalCta {...home.finalCta} />
    </>
  );
}
