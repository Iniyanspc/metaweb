import type { Navigation } from "@/lib/content/types";
import { capabilities } from "./capabilities";
import { industries } from "./industries";

const solution = (slug: string) => {
  const c = capabilities.find((cap) => cap.slug === slug);
  if (!c) throw new Error(`Unknown capability: ${slug}`);
  return { label: c.name, href: c.cta.href };
};

const industryLinks = industries.map((i) => ({
  label: i.name,
  href: i.hasPage ? `/industries/${i.slug}` : `/industries#${i.slug}`,
  description: i.line,
}));

export const navigation: Navigation = {
  primary: [
    {
      label: "Solutions",
      href: "/solutions",
      menu: {
        overview: { label: "All solutions", href: "/solutions" },
        columns: [
          { heading: "Data", pillar: "data", links: [solution("data-engineering"), solution("analytics")] },
          { heading: "Intelligence", pillar: "ai", links: [solution("ai")] },
          {
            heading: "Business",
            pillar: "business",
            links: [
              { label: "Custom products", href: "/solutions/custom-products" },
              solution("business-transformation"),
              solution("managed-engineering"),
            ],
          },
        ],
        feature: {
          title: "The foundation is data",
          body: "Every engagement starts with data your business can rely on.",
          link: { label: "See the architecture", href: "/solutions/data-engineering#architecture" },
        },
      },
    },
    {
      label: "Industries",
      href: "/industries",
      menu: {
        overview: { label: "All industries", href: "/industries" },
        columns: [{ links: industryLinks }],
        footer: {
          label: "Other industries",
          href: "/contact?topic=other-industry",
          description: "Tell us about your sector.",
        },
      },
    },
    { label: "Products", href: "/products" },
    { label: "Case studies", href: "/case-studies" },
    {
      label: "About",
      href: "/about",
      menu: {
        overview: { label: "About us", href: "/about" },
        columns: [
          {
            links: [
              { label: "Team", href: "/team", description: "The people who build it." },
              { label: "Technology", href: "/technology", description: "The tools we choose, and why." },
              { label: "Careers", href: "/careers", description: "Build the systems other systems depend on." },
            ],
          },
        ],
      },
    },
    { label: "Insights", href: "/insights" },
  ],
  cta: { label: "Talk to our team", href: "/contact" },
  footer: [
    {
      heading: "Solutions",
      links: capabilities.map((c) => ({ label: c.name, href: c.cta.href })),
    },
    {
      heading: "Industries",
      links: [...industryLinks.map(({ label, href }) => ({ label, href })), { label: "Other industries", href: "/contact?topic=other-industry" }],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Team", href: "/team" },
        { label: "Technology", href: "/technology" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Case studies", href: "/case-studies" },
        { label: "Products", href: "/products" },
        { label: "Insights", href: "/insights" },
      ],
    },
  ],
};
