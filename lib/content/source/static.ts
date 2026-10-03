/**
 * Static content source: reads from /data. A CMS source (source/cms.ts) can
 * implement the same ContentSource interface and be swapped in lib/content/index.ts.
 */
import { capabilities } from "@/data/capabilities";
import { caseStudies } from "@/data/case-studies";
import { roles } from "@/data/careers";
import { industries, otherIndustries } from "@/data/industries";
import { navigation } from "@/data/navigation";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { team } from "@/data/team";
import { technologies, techPhilosophy } from "@/data/technology";
import type { ContentSource } from "../index";

export const staticSource: ContentSource = {
  async getSite() {
    return site;
  },
  async getNavigation() {
    return navigation;
  },
  async getCapabilities() {
    return capabilities;
  },
  async getIndustries() {
    return industries;
  },
  async getOtherIndustriesLine() {
    return otherIndustries;
  },
  async getProducts() {
    return products;
  },
  async getCaseStudies() {
    return caseStudies;
  },
  async getTeam() {
    return [...team].sort((a, b) => a.order - b.order);
  },
  async getTechnologies() {
    return technologies.filter((t) => t.inUse);
  },
  async getTechPhilosophy() {
    return techPhilosophy;
  },
  async getRoles() {
    return roles;
  },
};
