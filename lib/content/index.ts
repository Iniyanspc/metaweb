/**
 * The only module pages import content from. Swap `source` for a CMS adapter
 * that implements ContentSource; pages and components don't change.
 */
import { isPublished } from "@/lib/publish";
import { readInsights } from "./insights";
import { staticSource } from "./source/static";
import type {
  Capability,
  HomeContent,
  PagesContent,
  CaseStudy,
  Industry,
  Navigation,
  Product,
  Role,
  SiteConfig,
  TeamMember,
  Technology,
  TechCategory,
} from "./types";

export interface ContentSource {
  getSite(): Promise<SiteConfig>;
  getHome(): Promise<HomeContent>;
  getPages(): Promise<PagesContent>;
  getNavigation(): Promise<Navigation>;
  getCapabilities(): Promise<Capability[]>;
  getIndustries(): Promise<Industry[]>;
  getOtherIndustriesLine(): Promise<string>;
  getProducts(): Promise<Product[]>;
  getCaseStudies(): Promise<CaseStudy[]>;
  getTeam(): Promise<TeamMember[]>;
  getTechnologies(): Promise<Technology[]>;
  getTechPhilosophy(): Promise<Record<TechCategory, string>>;
  getRoles(): Promise<Role[]>;
}

const source: ContentSource = staticSource;

export const getSite = () => source.getSite();
export const getHome = () => source.getHome();
export const getPages = () => source.getPages();
/** Navigation with links to unpublished sections removed. */
export async function getNavigation() {
  const [nav, hidden] = await Promise.all([source.getNavigation(), getHiddenRoutes()]);
  const keep = (href: string) => !hidden.has(href.replace(/[?#].*$/, ""));
  return {
    ...nav,
    primary: nav.primary
      .filter((item) => keep(item.href))
      .map((item) =>
        item.menu
          ? { ...item, menu: { ...item.menu, columns: item.menu.columns.map((c) => ({ ...c, links: c.links.filter((l) => keep(l.href)) })) } }
          : item,
      ),
    footer: nav.footer.map((col) => ({ ...col, links: col.links.filter((l) => keep(l.href)) })).filter((col) => col.links.length > 0),
  };
}
export const getCapabilities = () => source.getCapabilities();
export const getIndustries = () => source.getIndustries();
export const getOtherIndustriesLine = () => source.getOtherIndustriesLine();
/* Collections return published items only; drafts stay in data/ (see lib/publish.ts). */
export const getProducts = async () => (await source.getProducts()).filter(isPublished);
export const getTeam = async () => (await source.getTeam()).filter(isPublished);
export const getTechnologies = () => source.getTechnologies();
export const getTechPhilosophy = () => source.getTechPhilosophy();
export const getRoles = () => source.getRoles();

export async function getCapability(slug: string) {
  return (await source.getCapabilities()).find((c) => c.slug === slug);
}

export async function getIndustry(slug: string) {
  return (await source.getIndustries()).find((i) => i.slug === slug);
}

export async function getCaseStudies(filter: { industry?: string; capability?: string } = {}) {
  return (await source.getCaseStudies()).filter(isPublished).filter(
    (cs) =>
      (!filter.industry || cs.industry === filter.industry) &&
      (!filter.capability || cs.capabilities.includes(filter.capability)),
  );
}

/** A case study by slug, drafts included; pages check isPublished themselves. */
export async function getCaseStudy(slug: string) {
  return (await source.getCaseStudies()).find((cs) => cs.slug === slug);
}

/** Every case-study slug that gets a route, drafts included (static export needs at least one). */
export async function getCaseStudySlugs() {
  return (await source.getCaseStudies()).map((cs) => cs.slug);
}

/* ---------- Insights (MDX) ---------- */

export async function getInsights() {
  return (await readInsights()).map((f) => f.meta);
}

export async function getInsight(slug: string) {
  return (await readInsights({ includeSamples: true })).find((f) => f.meta.slug === slug);
}

/** Every article slug that gets a page, hidden samples included (static export needs at least one). */
export async function getInsightSlugs() {
  return (await readInsights({ includeSamples: true })).map((f) => f.meta.slug);
}

export async function getTeamMember(id: string) {
  return (await getTeam()).find((m) => m.id === id);
}

/** Which optional sections have anything published. Drives pages, menus, footer and sitemap. */
export async function getPublishedSections() {
  const [caseStudies, team, products, insights] = await Promise.all([getCaseStudies(), getTeam(), getProducts(), getInsights()]);
  return { caseStudies: caseStudies.length > 0, team: team.length > 0, products: products.length > 0, insights: insights.length > 0 };
}

/** Section routes to drop from navigation while they have nothing published. */
export async function getHiddenRoutes() {
  const s = await getPublishedSections();
  return new Set([
    ...(s.caseStudies ? [] : ["/case-studies"]),
    ...(s.team ? [] : ["/team"]),
    ...(s.products ? [] : ["/products"]),
    ...(s.insights ? [] : ["/insights"]),
  ]);
}
