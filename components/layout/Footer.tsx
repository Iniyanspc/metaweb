import { getNavigation, getSite } from "@/lib/content";
import { LogoHorizontal } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { Link } from "@/components/ui/Link";
import { VerifiedText } from "@/components/ui/Placeholder";

const SOCIAL_LABEL = { linkedin: "LinkedIn", x: "X", github: "GitHub", youtube: "YouTube" } as const;

export async function Footer() {
  const [site, nav] = await Promise.all([getSite(), getNavigation()]);
  return (
    <footer className="bg-ink text-canvas [&_::selection]:bg-pink">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--gutter)">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <LogoHorizontal tone="dark" height={44} />
            <p className="max-w-[32ch] text-body text-canvas/75">{site.tagline}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-(--gutter) gap-y-10 md:grid-cols-4 lg:col-span-8">
            {nav.footer.map((col) => (
              <div key={col.heading}>
                <h2 className="mb-4 font-sans text-caption text-canvas/60">{col.heading}</h2>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-small text-canvas/90 hover:text-canvas">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 grid gap-8 border-t border-canvas/15 pt-10 text-small md:grid-cols-3">
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-sans text-caption text-canvas/60">Contact</h2>
            <VerifiedText field={site.email} render={(email) => <Link href={`mailto:${email}`}>{email}</Link>} />
            <VerifiedText field={site.phone} render={(phone) => <Link href={`tel:${phone}`}>{phone}</Link>} />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-sans text-caption text-canvas/60">Offices</h2>
            {site.offices.map((office, i) => (
              <VerifiedText key={i} field={office} render={(o) => `${o.city}, ${o.address}`} />
            ))}
          </div>
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-sans text-caption text-canvas/60">Follow</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {site.social.map((s) => (
                <li key={s.network}>
                  {s.url.verified ? (
                    <Link href={s.url.value}>{SOCIAL_LABEL[s.network]}</Link>
                  ) : (
                    <span className="placeholder">{s.url.placeholder}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 text-caption text-canvas/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <VerifiedText field={site.legalEntity} />
          </p>
          <ul className="flex gap-6">
            {nav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
