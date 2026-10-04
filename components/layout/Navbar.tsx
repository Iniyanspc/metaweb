import NextLink from "next/link";
import { getNavigation } from "@/lib/content";
import { LogoHorizontal } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "./DesktopNav";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const nav = await getNavigation();
  return (
    <HeaderShell>
      <Container className="flex h-(--nav-height) items-center justify-between gap-6">
        <NextLink href="/" aria-label="metadatum home" className="shrink-0 rounded-[2px] focus-visible:shadow-(--focus-ring)">
          {/* Mark is 32px tall at desktop, 28px on mobile (the mark is ~87% of the lockup's height). */}
          <LogoHorizontal height={37} title="" className="hidden lg:block" />
          <LogoHorizontal height={32} title="" className="lg:hidden" />
        </NextLink>
        <nav aria-label="Main" className="hidden lg:block">
          <DesktopNav items={nav.primary} />
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <Button href={nav.cta.href}>{nav.cta.label}</Button>
          </div>
          <MobileMenu items={nav.primary} cta={nav.cta} logo={<LogoHorizontal tone="dark" height={32} title="metadatum home" />} />
        </div>
      </Container>
    </HeaderShell>
  );
}
