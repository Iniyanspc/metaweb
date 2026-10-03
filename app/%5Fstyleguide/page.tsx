import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LogoHorizontal, LogoStacked, Mark, type LogoTone, type MarkVariant } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/components/ui/Link";
import { Node } from "@/components/ui/Node";
import { LogoSlot, Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/* Internal reference page. Copy here is documentation, not site content. */

const colours = [
  { token: "canvas", hex: "#FFFFFF", role: "Page background", swatch: "bg-canvas" },
  { token: "ink", hex: "#000000", role: "Text, ink nodes, footer", swatch: "bg-ink" },
  { token: "pink", hex: "#F7147F", role: "Data. Graphics, fills, large display text only", swatch: "bg-pink" },
  { token: "pink-ink", hex: "#C8076A", role: "Pink at body text size (5.7:1)", swatch: "bg-pink-ink" },
  { token: "violet", hex: "#820AAA", role: "Intelligence. Graphics and text (8.2:1)", swatch: "bg-violet" },
  { token: "soma-from", hex: "#D00A88", role: "Gradient start", swatch: "bg-soma-from" },
  { token: "soma-to", hex: "#6C1198", role: "Gradient end", swatch: "bg-soma-to" },
  { token: "plum", hex: "#3D0B52", role: "Dark sections", swatch: "bg-plum" },
  { token: "plum-50", hex: "#F5EEF8", role: "Placeholder fill", swatch: "bg-plum-50" },
  { token: "lilac", hex: "#D9A6F0", role: "Violet on plum (7.8:1)", swatch: "bg-lilac" },
  { token: "mist", hex: "#F4F3F6", role: "Alternate section background", swatch: "bg-mist" },
  { token: "line", hex: "#E4E2E8", role: "Hairlines and borders", swatch: "bg-line" },
  { token: "muted", hex: "#5B5763", role: "Secondary text (≈7:1)", swatch: "bg-muted" },
];

const typeScale = [
  { name: "Display", cls: "text-display font-display", spec: "Poppins 500, 88 / 48" },
  { name: "H1", cls: "text-h1 font-display", spec: "Poppins 500, 64 / 40" },
  { name: "H2", cls: "text-h2 font-display", spec: "Poppins 500, 44 / 32" },
  { name: "H3", cls: "text-h3 font-display", spec: "Poppins 500, 28 / 24" },
  { name: "H4", cls: "text-h4 font-semibold", spec: "Instrument Sans 600, 20 / 18" },
  { name: "Body large", cls: "text-body-lg", spec: "Instrument Sans 400, 20 / 18" },
  { name: "Body", cls: "text-body", spec: "Instrument Sans 400, 17 / 16" },
  { name: "Small", cls: "text-small", spec: "Instrument Sans 400, 15 / 14" },
  { name: "Caption", cls: "text-caption font-medium", spec: "Instrument Sans 500, 13" },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160];

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-16">
      <h2 id={id} className="mb-10 text-h3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-caption text-muted">{children}</p>;
}

function Tile({ tone, children, label }: { tone: "canvas" | "mist" | "plum" | "ink"; children: ReactNode; label: string }) {
  const bg = { canvas: "bg-canvas border border-line", mist: "bg-mist", plum: "bg-plum", ink: "bg-ink" }[tone];
  return (
    <figure>
      <div className={cn("flex min-h-48 items-center justify-center rounded-card p-8", bg)}>{children}</div>
      <figcaption className="mt-3 text-caption text-muted">{label}</figcaption>
    </figure>
  );
}

const markTiles: { variant: MarkVariant; tone: "canvas" | "plum" | "ink"; label: string }[] = [
  { variant: "color", tone: "canvas", label: "Primary, light" },
  { variant: "color-dark", tone: "ink", label: "Dark background (ink)" },
  { variant: "color-dark", tone: "plum", label: "Dark background (plum)" },
  { variant: "mono-black", tone: "canvas", label: "Monochrome black" },
  { variant: "mono-white", tone: "plum", label: "Monochrome white" },
];

const lockupTiles: { tone: LogoTone; bg: "canvas" | "plum" | "ink"; label: string }[] = [
  { tone: "light", bg: "canvas", label: "Light" },
  { tone: "dark", bg: "ink", label: "Dark" },
  { tone: "mono", bg: "canvas", label: "Mono" },
  { tone: "mono-white", bg: "plum", label: "Mono white" },
];

const states = ["default", "hover", "focus", "disabled"] as const;
const force = (s: (typeof states)[number]) => (s === "hover" || s === "focus" ? s : undefined);

export default function Styleguide() {
  return (
    <>
      <Container className="pt-16 pb-8">
        <p className="text-caption text-muted">Internal, not indexed</p>
        <h1 className="mt-3 text-h1">Styleguide</h1>
        <p className="mt-4 text-body-lg text-muted">Every token, type style, logo variant and primitive, in every state.</p>
      </Container>

      <Container>
        <Block id="colour" title="Colour">
          <ul className="grid gap-x-(--gutter) gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {colours.map((c) => (
              <li key={c.token}>
                <div className={cn("h-24 rounded-card border border-line", c.swatch)} />
                <p className="mt-3 font-medium">{c.token}</p>
                <p className="text-small text-muted">{c.hex}</p>
                <p className="text-small text-muted">{c.role}</p>
              </li>
            ))}
            <li>
              <div className="h-24 rounded-card bg-soma" />
              <p className="mt-3 font-medium">Soma gradient</p>
              <p className="text-small text-muted">135°, soma-from to soma-to</p>
              <p className="text-small text-muted">Max two per viewport. Never a section background.</p>
            </li>
          </ul>
          <div className="mt-12 grid gap-(--gutter) md:grid-cols-3">
            <div className="rounded-card border border-line p-6">
              <p className="text-h3 font-semibold text-pink">Pink at 28px bold</p>
              <p className="mt-2 text-body text-pink-ink">Pink-ink at body size for inline text.</p>
              <Label>Pink on white ≈3.9:1, large text only</Label>
            </div>
            <div className="rounded-card bg-plum p-6 text-canvas">
              <p className="text-body">White on plum ≈15:1</p>
              <p className="mt-2 text-body text-lilac">Lilac on plum 7.8:1</p>
              <p className="mt-2 text-h3 font-semibold text-pink">Pink on plum, large only</p>
            </div>
            <div className="rounded-card border border-line p-6">
              <p className="text-body text-violet">Violet text on white 8.2:1</p>
              <p className="mt-2 text-body text-muted">Muted text on white ≈7:1</p>
            </div>
          </div>
        </Block>

        <Block id="type" title="Typography">
          <ul className="flex flex-col gap-10">
            {typeScale.map((t) => (
              <li key={t.name} className="grid gap-2 md:grid-cols-12 md:gap-x-(--gutter)">
                <div className="md:col-span-3">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-small text-muted">{t.spec}</p>
                </div>
                <p className={cn("md:col-span-9", t.cls)}>Data is infrastructure.</p>
              </li>
            ))}
          </ul>
          <div className="mt-16 md:pl-[25%]">
            <p className="mb-3 text-caption text-muted">Three-beat headline, each line a block</p>
            <p className="text-h1 font-display">
              <span className="block">Data is infrastructure.</span>
              <span className="block">AI is intelligence.</span>
              <span className="block">Business is the outcome.</span>
            </p>
          </div>
        </Block>

        <Block id="logo" title="Logo">
          <div className="grid gap-(--gutter) sm:grid-cols-2 lg:grid-cols-5">
            {markTiles.map((t) => (
              <Tile key={t.label} tone={t.tone} label={t.label}>
                <Mark variant={t.variant} size={128} />
              </Tile>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-end gap-10">
            {[16, 24, 32, 48, 64, 96].map((s) => (
              <figure key={s} className="flex flex-col items-center">
                <Mark size={s} />
                <figcaption className="mt-3 text-caption text-muted">{s}px{s <= 64 ? ", small-size" : ""}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 grid gap-(--gutter) md:grid-cols-2">
            {lockupTiles.map((t) => (
              <Tile key={t.label} tone={t.bg} label={`Horizontal lockup, ${t.label.toLowerCase()}`}>
                <LogoHorizontal tone={t.tone} height={64} />
              </Tile>
            ))}
            <Tile tone="canvas" label="Stacked lockup, light">
              <LogoStacked height={160} />
            </Tile>
            <Tile tone="ink" label="Stacked lockup, dark">
              <LogoStacked tone="dark" height={160} />
            </Tile>
          </div>
          <div className="mt-10 grid gap-(--gutter) md:grid-cols-2">
            <Tile tone="canvas" label="Navbar, desktop (mark 32px)">
              <LogoHorizontal height={41} />
            </Tile>
            <Tile tone="canvas" label="Navbar, mobile (mark 28px)">
              <LogoHorizontal height={36} />
            </Tile>
          </div>
        </Block>

        <Block id="nodes" title="Pillar nodes">
          <div className="flex flex-wrap gap-12">
            {(["data", "ai", "business", "bridge"] as const).map((p) => (
              <div key={p} className="flex flex-col items-start gap-3">
                <Node pillar={p} size={24} />
                <Node pillar={p} />
                <p className="text-small">{p}</p>
              </div>
            ))}
            <div className="flex gap-6 rounded-card bg-plum p-6">
              {(["data", "ai", "business", "bridge"] as const).map((p) => (
                <Node key={p} pillar={p} size={24} onDark />
              ))}
            </div>
          </div>
        </Block>

        <Block id="buttons" title="Buttons">
          {(["canvas", "plum"] as const).map((tone) => (
            <div key={tone} className={cn("mb-6 rounded-card p-8", tone === "plum" ? "bg-plum" : "border border-line")}>
              {(["primary", "secondary"] as const).map((variant) => (
                <div key={variant} className="mb-8 last:mb-0">
                  <p className={cn("mb-4 text-caption", tone === "plum" ? "text-canvas/70" : "text-muted")}>
                    {variant}, on {tone}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    {states.map((s) => (
                      <div key={s} className="flex flex-col items-start gap-2">
                        <Button variant={variant} tone={tone} data-force={force(s)} disabled={s === "disabled"}>
                          Talk to our team
                        </Button>
                        <span className={cn("text-caption", tone === "plum" ? "text-canvas/70" : "text-muted")}>{s}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-start gap-2">
                      <Button variant={variant} tone={tone} size="lg">
                        Send message
                      </Button>
                      <span className={cn("text-caption", tone === "plum" ? "text-canvas/70" : "text-muted")}>large</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Block>

        <Block id="links" title="Links">
          <div className="flex flex-wrap gap-10">
            {(["default", "hover", "focus"] as const).map((s) => (
              <div key={s} className="flex flex-col gap-2">
                <Link href="/solutions" data-force={s === "default" ? undefined : s}>
                  Explore our capabilities
                </Link>
                <span className="text-caption text-muted">{s}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Link href="/solutions" underline="always">
                See the case study
              </Link>
              <span className="text-caption text-muted">always underlined</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="https://example.com">External link</Link>
              <span className="text-caption text-muted">external, new tab</span>
            </div>
          </div>
        </Block>

        <Block id="placeholders" title="Placeholders">
          <p className="text-body">
            Delivered for <Placeholder label="[CLIENT NAME]" /> with <Placeholder label="[METRIC — e.g. XX% reduction in processing time]" />.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LogoSlot label="[CLIENT LOGO]" />
            <LogoSlot label="[PARTNER LOGO]" />
          </div>
        </Block>

        <Block id="shape" title="Shape, spacing, elevation">
          <div className="grid gap-(--gutter) md:grid-cols-4">
            <div>
              <div className="flex h-11 items-center justify-center rounded-pill border border-ink text-small">Pill</div>
              <Label>Buttons, inputs, tags</Label>
            </div>
            <div>
              <div className="h-24 rounded-card border border-line transition-colors duration-160 hover:border-ink" />
              <Label>Card 4px, border to ink on hover</Label>
            </div>
            <div>
              <div className="h-24 rounded-media bg-mist" />
              <Label>Media 2px</Label>
            </div>
            <div>
              <div className="h-24 rounded-card bg-canvas shadow-(--shadow-menu)" />
              <Label>Mega-menu shadow, the only shadow</Label>
            </div>
          </div>
          <ul className="mt-12 flex flex-wrap items-end gap-4">
            {spacing.map((s) => (
              <li key={s} className="flex flex-col items-center gap-2">
                <span className="block bg-pink" style={{ width: 12, height: s }} />
                <span className="text-caption text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Block>
      </Container>

      <div className="border-t border-line">
        <Container className="pt-16">
          <h2 className="text-h3">Sections on the axon</h2>
          <p className="mt-3 text-body text-muted">Canvas, mist and plum tones. The axon and its nodes show from 1024px.</p>
        </Container>
        <Section pillar="data" axon labelledBy="sg-s1">
          <SectionHeader id="sg-s1" pillar="data" axon title="Data everywhere. Answers nowhere." support="Canvas tone, data pillar." />
        </Section>
        <Section pillar="bridge" tone="mist" axon labelledBy="sg-s2">
          <SectionHeader
            id="sg-s2"
            pillar="bridge"
            axon
            title="The foundation is data."
            support="Mist tone, bridge pillar."
            action={<Button variant="secondary" href="/solutions">See data engineering</Button>}
          />
        </Section>
        <Section pillar="ai" tone="plum" axon labelledBy="sg-s3">
          <SectionHeader id="sg-s3" pillar="ai" axon onDark title="AI built on data your business can trust." support="Plum tone, AI pillar." />
          <div className="flex gap-4">
            <Button tone="plum" href="/solutions/ai">See AI engineering</Button>
            <Button tone="plum" variant="secondary" href="/contact">Talk to our team</Button>
          </div>
        </Section>
        <Section pillar="business" axon labelledBy="sg-s4">
          <SectionHeader id="sg-s4" pillar="business" axon title="From business problem to working product." support="Canvas tone, business pillar." />
        </Section>
      </div>
    </>
  );
}
