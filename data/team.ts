import { missing, type TeamMember } from "@/lib/content/types";

/** Add people here. Groups with no members are hidden on /team. */
const placeholderPerson = (id: string, group: TeamMember["group"], order: number): TeamMember => ({
  id,
  name: missing("[TEAM MEMBER NAME]"),
  role: missing("[ROLE]"),
  group,
  bio: missing("[TEAM MEMBER BIO — two sentences, verified]"),
  experience: missing("[YEARS / PRIOR ORGANISATIONS — verified]"),
  expertise: [],
  portrait: missing("[PORTRAIT]"),
  linkedin: missing("[LINKEDIN URL]"),
  order,
});

export const team: TeamMember[] = [
  placeholderPerson("leader-1", "Leadership", 1),
  placeholderPerson("leader-2", "Leadership", 2),
  placeholderPerson("leader-3", "Leadership", 3),
];
