import type { SiteConfig } from "@/lib/content/types";
import { splitEmail } from "@/lib/email";
import { EmailLink } from "./EmailLink";
import { Link } from "./Link";
import { Placeholder } from "./Placeholder";

/** Masked, click-to-open email. */
export function SiteEmail({ site, className }: { site: SiteConfig; className?: string }) {
  if (!site.email.verified) return <Placeholder label={site.email.placeholder} />;
  const { user, domain } = splitEmail(site.email.value);
  return <EmailLink user={user} domain={domain} className={className} />;
}

/** Phone as a tel: link (spaces stripped for the dialler). */
export function SitePhone({ site, className }: { site: SiteConfig; className?: string }) {
  if (!site.phone.verified) return <Placeholder label={site.phone.placeholder} />;
  return (
    <Link href={`tel:${site.phone.value.replace(/\s/g, "")}`} className={className}>
      {site.phone.value}
    </Link>
  );
}
