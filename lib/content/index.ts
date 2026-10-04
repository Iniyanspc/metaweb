/**
 * The only module pages import content from. Swap `source` for a CMS adapter
 * that implements ContentSource; pages and components don't change.
 */
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
export const getNavigation = () => source.getNavigation();
export const getCapabilities = () => source.getCapabilities();
export const getIndustries = () => source.getIndustries();
export const getOtherIndustriesLine = () => source.getOtherIndustriesLine();
export const getProducts = () => source.getProducts();
export const getTeam = () => source.getTeam();
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
  return (await source.getCaseStudies()).filter(
    (cs) =>
      (!filter.industry || cs.industry === filter.industry) &&
      (!filter.capability || cs.capabilities.includes(filter.capability)),
  );
}

export async function getCaseStudy(slug: string) {
  return (await source.getCaseStudies()).find((cs) => cs.slug === slug);
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
  return (await source.getTeam()).find((m) => m.id === id);
}
