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
  /** Photo key from lib/images.ts. */
  image?: string;
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
  /** Photo key from lib/images.ts. */
  image?: string;
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
  /** Photo key from lib/images.ts. Never a photo implying it shows the client. */
  image?: string;
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
  /** Photo key from lib/images.ts. */
  image?: string;
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
  hero: { headline: string; support: string; cta: Cta; images: { main: string; detail: string } };
  trust: { line: string };
  problem: { headline: string; lines: string[]; turn: string; image: string };
  capabilities: { headline: string; support: string };
  foundation: {
    headline: string;
    support: string;
    flow: ArchitectureDiagram;
    closing: string[];
  };
  ai: { headline: string; support: string; flow: string[]; services: string[]; cta: Link; image: string };
  process: { headline: string; support: string; steps: { title: string; body: string }[]; image: string };
  industries: { headline: string; support: string; cta: Link; otherCta: Link };
  products: { headline: string; support: string; empty: string };
  caseStudies: { headline: string; support: string; cta: Link; more: string };
  technology: { headline: string; support: string; note: string; cta: Link };
  team: { headline: string; support: string; cta: Link };
  insights: { headline: string; cta: Link; empty: string };
  finalCta: { headline: string[]; support: string; cta: Link };
}

export interface PageIntro {
  title: string;
  /** Optional multi-line title (three-beat headlines); overrides `title` visually. */
  titleLines?: string[];
  support: string;
  /** Optional wide photo under the page hero (key from lib/images.ts). */
  image?: string;
  seo: SeoFields;
}

export interface PagesContent {
  solutions: PageIntro & {
    pillars: { pillar: Pillar; heading: string; line: string; capabilities: Slug[] }[];
    image: string;
    labels: { services: string };
  };
  solutionTemplate: {
    whatWeBuild: string;
    architecture: string;
    engagements: string;
    technologies: string;
    industries: string;
    caseStudies: string;
    noCaseStudies: string;
  };
  industries: PageIntro & { otherHeading: string; otherCta: Link };
  industryTemplate: {
    challenge: string;
    dataProblems: string;
    aiOpportunities: string;
    solutions: string;
    caseStudies: string;
    noCaseStudies: string;
  };
  products: PageIntro & { allLabel: string };
  caseStudies: PageIntro & { empty: string };
  caseStudyTemplate: {
    client: string;
    industry: string;
    challenge: string;
    approach: string;
    architecture: string;
    implementation: string;
    outcome: string;
    metrics: string;
  };
  about: PageIntro & {
    whoWeAre: { heading: string; body: string[] };
    beliefs: { heading: string; lines: string[] };
    mission: { heading: string; body: string };
    approach: { heading: string; support: string };
    philosophy: { heading: string; points: { title: string; body: string }[] };
    timeline: { heading: string; entries: { year: string; text: string }[] };
    locations: { heading: string };
    culture: { heading: string; points: { title: string; body: string }[] };
    leadership: { heading: string; cta: Link };
    careers: { heading: string; body: string; cta: Link };
  };
  team: PageIntro & { groupOrder: TeamGroup[] };
  technology: PageIntro & { note: string };
  insights: PageIntro & { allLabel: string; featuredLabel: string; empty: string; related: string; by: string };
  careers: PageIntro & {
    why: { heading: string; points: { title: string; body: string }[] };
    culture: { heading: string; body: string[] };
    learning: { heading: string; body: string };
    hiring: { heading: string; steps: { title: string; body: string }[] };
    benefits: { heading: string; items: string[] };
    roles: { heading: string; empty: string; apply: string };
  };
  contact: PageIntro & {
    form: {
      name: string;
      email: string;
      company: string;
      jobTitle: string;
      industry: string;
      industryOptions: string[];
      building: string;
      buildingOptions: string[];
      scope: string;
      scopeOptions: string[];
      message: string;
      submit: string;
      sending: string;
      success: string;
      errorEmail: string;
      errorRequired: string;
      errorServer: string;
    };
    details: { heading: string; email: string; phone: string; offices: string; response: string };
  };
  legal: { privacy: PageIntro; terms: PageIntro };
  notFound: { title: string; support: string; cta: Link };
}
