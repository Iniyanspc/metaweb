import type { SiteConfig } from "@/lib/content/types";
import { splitEmail } from "@/lib/email";
import { EmailLink } from "./EmailLink";
import { Link } from "./Link";

/** Masked, click-to-open email; nothing when the site has no public email. */
export function SiteEmail({ site, className }: { site: SiteConfig; className?: string }) {
  if (!site.email?.verified) return null;
  const { user, domain } = splitEmail(site.email.value);
  return <EmailLink user={user} domain={domain} className={className} />;
}

/** Phone as a tel: link (spaces stripped for the dialler); nothing when unset. */
export function SitePhone({ site, className }: { site: SiteConfig; className?: string }) {
  if (!site.phone?.verified) return null;
  return (
    <Link href={`tel:${site.phone.value.replace(/\s/g, "")}`} className={className}>
      {site.phone.value}
    </Link>
  );
}
