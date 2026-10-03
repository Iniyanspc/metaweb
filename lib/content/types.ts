/**
 * metadatum content model.
 * Static data in /data and MDX in /content conform to these types today;
 * a CMS adapter will map into the same types later.
 */

/** A fact we either know, or must visibly mark as missing. Never fabricate. */
export type Verified<T> =
  | { verified: true; value: T }
  | { verified: false; placeholder: string };

export const known = <T,>(value: T): Verified<T> => ({ verified: true, value });
export const missing = (placeholder: string): Verified<never> => ({ verified: false, placeholder });

/** Colour meaning: pink = data, violet = intelligence, ink = business/outcomes, bridge = soma. */
export type Pillar = "data" | "ai" | "business" | "bridge";

export type Slug = string;

export interface Link {
  label: string;
  href: string;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SeoFields {
  title: string;
  description: string; // ≤155 chars, written per page
  ogImage?: string;
}

/* ---------- Site ---------- */

export interface SiteConfig {
  name: "metadatum";
  url: Verified<string>;
  legalEntity: Verified<string>;
  tagline: string;
  email: Verified<string>;
  phone: Verified<string>;
  offices: Verified<{ city: string; address: string }>[];
  social: { network: "linkedin" | "x" | "github" | "youtube"; url: Verified<string> }[];
  responseTime: Verified<string>;
  industriesServed: string[];
  clientLogos: Verified<Image & { name: string }>[];
}

/* ---------- Capabilities / solutions ---------- */

export interface Capability {
  slug: Slug;
  name: string;
  pillar: Pillar;
  line: string;
  services: string[];
  technologies: string[]; // slugs in technology.ts
  cta: Link;
  /** Wide card in the asymmetric capability grid. */
  featured?: boolean;
  /** Has its own /solutions/[slug] page. */
  hasPage: boolean;
  seo?: SeoFields;
  detail?: {
    headline: string;
    support: string;
    whatWeBuild: { title: string; body: string }[];
    architecture?: ArchitectureDiagram;
    engagements: { title: string; body: string }[];
  };
}

export interface ArchitectureDiagram {
  nodes: { id: string; label: string; pillar: Pillar; detail?: string; technologies?: string[] }[];
  edges: { from: string; to: string }[];
}

/* ---------- Industries ---------- */

export interface Industry {
  slug: Slug;
  name: string;
  icon: string;
  line: string;
  challenge: string;
  dataProblems: string[];
  aiOpportunities: string[];
  solutions: string[];
  hasPage: boolean;
  seo?: SeoFields;
}

/* ---------- Products ---------- */

export type ProductStatus = "concept" | "in-development" | "pilot" | "available";
export type ProductCategory =
  | "Data products" | "AI products" | "Analytics products" | "Business applications"
  | "HRMS" | "Industry SaaS" | "Custom platforms";

export interface Product {
  slug: Slug;
  name: Verified<string>;
  category: ProductCategory;
  problem: Verified<string>;
  targetCustomer: Verified<string>;
  capabilities: string[];
  screenshots: Verified<Image>[];
  technologies: string[];
  status: ProductStatus;
  cta: Link;
}

/* ---------- Case studies ---------- */

export interface Metric {
  value: Verified<number>;
  unit: string;   // "%", "hrs", "x"
  label: string;  // "reduction in processing time"
}

export interface CaseStudy {
  slug: Slug;
  client: Verified<string>;
  clientLogo?: Verified<Image>;
  industry: Slug;
  capabilities: Slug[];
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  architecture: { diagram?: ArchitectureDiagram; technologies: string[] };
  implementation: string;
  outcome: string;
  metrics: Metric[];
  featured?: boolean;
  publishedAt: Verified<string>;
  /** Client approved public naming. If false, render as "[INDUSTRY] organisation". */
  publicApproval: boolean;
}

/* ---------- People ---------- */

export type TeamGroup =
  | "Leadership" | "Engineering" | "Data" | "AI" | "Product" | "Business development" | "Operations";

export interface TeamMember {
  id: string;
  name: Verified<string>;
  role: Verified<string>;
  group: TeamGroup;
  bio: Verified<string>;
  experience: Verified<string>;
  expertise: string[];
  portrait: Verified<Image>;
  linkedin: Verified<string>;
  order: number;
}

/* ---------- Technology ---------- */

export type TechCategory =
  | "Cloud" | "Data engineering" | "Databases" | "AI / ML" | "Analytics"
  | "Backend" | "Frontend" | "DevOps" | "Infrastructure" | "Security";

export interface Technology {
  slug: Slug;
  name: string;
  category: TechCategory;
  /** We use this in delivery. Never implies partnership or certification. */
  inUse: boolean;
}

/* ---------- Insights (MDX frontmatter) ---------- */

export type InsightCategory =
  | "Data engineering" | "AI" | "Data architecture" | "Business intelligence"
  | "Digital transformation" | "Industry insights" | "Engineering" | "Product development";

export interface Insight {
  slug: Slug;
  title: string;
  excerpt: string;
  category: InsightCategory;
  author: Slug; // TeamMember.id
  publishedAt: string; // ISO
  readingMinutes: number; // computed at build
  /** Optional; without one, cards render an abstract node pattern seeded from the slug. */
  featuredImage?: Image;
  featured?: boolean;
  sample?: boolean; // sample content — excluded from sitemap; hidden when HIDE_SAMPLE_CONTENT=1
}

/* ---------- Careers ---------- */

export interface Role {
  slug: Slug;
  title: string;
  group: TeamGroup;
  location: Verified<string>;
  type: "Full-time" | "Contract" | "Internship";
  summary: string;
  applyUrl: Verified<string>;
}

/* ---------- Navigation ---------- */

export interface NavLink extends Link {
  description?: string;
}

export interface NavColumn {
  heading?: string;
  pillar?: Pillar;
  links: NavLink[];
}

export interface MegaMenu {
  /** Overview link shown at the top of the panel, e.g. "All solutions". */
  overview: Link;
  columns: NavColumn[];
  /** Optional mist panel on the right. */
  feature?: { title: string; body: string; link: Link };
  /** Optional trailing link under the columns. */
  footer?: NavLink;
}

export interface NavItem {
  label: string;
  href: string;
  menu?: MegaMenu;
}

export interface Navigation {
  primary: NavItem[];
  cta: Link;
  footer: { heading: string; links: Link[] }[];
  legal: Link[];
}

/* ---------- Page copy ---------- */

export interface Cta {
  primary: Link;
  secondary?: Link;
}

export interface HomeContent {
  hero: { headline: string; support: string; cta: Cta; diagramDescription: string };
  trust: { line: string };
  problem: { headline: string; lines: string[]; turn: string; support: string };
  capabilities: { headline: string };
  foundation: {
    headline: string;
    support: string;
    flow: ArchitectureDiagram;
    closing: string[];
  };
  ai: { headline: string; support: string; flow: string[]; services: string[]; cta: Link };
  process: { headline: string; support: string; steps: { title: string; body: string }[] };
  industries: { headline: string; support: string; cta: Link; otherCta: Link };
  products: { headline: string; support: string; empty: string };
  caseStudies: { headline: string; support: string; cta: Link; more: string };
  technology: { headline: string; support: string; note: string; cta: Link };
  team: { headline: string; support: string; cta: Link };
  insights: { headline: string; cta: Link; empty: string };
  finalCta: { headline: string[]; support: string; cta: Link };
}
