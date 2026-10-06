import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getHome, getPages, getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { team } = await getPages();
  return pageMetadata(team.seo, "/team");
}

export default async function TeamPage() {
  const [{ team: page }, team, home] = await Promise.all([getPages(), getTeam(), getHome()]);
  // Nothing published yet: the section stays off the live site (see lib/publish.ts).
  if (team.length === 0) notFound();
  // Groups with no members are hidden, not shown empty.
  const groups = page.groupOrder.map((g) => ({ group: g, members: team.filter((m) => m.group === g) })).filter((g) => g.members.length);

  return (
    <>
      <PageHero
        title={page.title}
        support={page.support}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Team", href: "/team" },
        ]}
      />
      <Container className="flex flex-col gap-20 pb-(--section-y)">
        {groups.map(({ group, members }) => (
          <section key={group} aria-labelledby={`group-${group}`}>
            <h2 id={`group-${group}`} className="border-t border-line pt-8 text-h3">
              {group}
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-(--gutter) gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {members.map((m) => (
                <li key={m.id}>
                  <TeamMemberCard member={m} showBio />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
      <FinalCta {...home.finalCta} />
    </>
  );
}
