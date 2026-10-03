import type { TeamMember } from "@/lib/content/types";
import { NodePattern } from "@/components/ui/NodePattern";
import { VerifiedText } from "@/components/ui/Placeholder";
import { Link } from "@/components/ui/Link";

export function TeamMemberCard({ member, showBio = false }: { member: TeamMember; showBio?: boolean }) {
  return (
    <article className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-media">
        {member.portrait.verified ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap to next/image once real portraits exist
          <img src={member.portrait.value.src} alt="" width={member.portrait.value.width} height={member.portrait.value.height} className="size-full object-cover" />
        ) : (
          <NodePattern seed={member.id} accent="business" />
        )}
      </div>
      <h3 className="mt-5 text-h4 font-semibold">
        <VerifiedText field={member.name} />
      </h3>
      <p className="mt-1 text-small text-muted">
        <VerifiedText field={member.role} />
      </p>
      {showBio && (
        <p className="mt-3 text-small">
          <VerifiedText field={member.bio} />
        </p>
      )}
      {member.linkedin.verified && (
        <p className="mt-3 text-small">
          <Link href={member.linkedin.value}>LinkedIn</Link>
        </p>
      )}
    </article>
  );
}
