import { missing, type SiteConfig } from "@/lib/content/types";

export const site: SiteConfig = {
  name: "metadatum",
  url: missing("[DOMAIN — e.g. https://metadatum.example]"),
  legalEntity: missing("[LEGAL ENTITY NAME]"),
  tagline: "We engineer the data and intelligence behind better businesses.",
  email: missing("[EMAIL]"),
  phone: missing("[PHONE]"),
  offices: [missing("[OFFICE LOCATION]")],
  social: [
    { network: "linkedin", url: missing("[LINKEDIN URL]") },
    { network: "github", url: missing("[GITHUB URL]") },
  ],
  responseTime: missing("[RESPONSE TIME — e.g. two working days]"),
  // Only list industries you have actually delivered in.
  industriesServed: ["Education", "Healthcare", "Logistics", "HR and workforce", "Government", "Retail"],
  clientLogos: Array.from({ length: 6 }, () => missing("[CLIENT LOGO]")),
};

// When a fact is confirmed, swap missing(...) for known(...) from "@/lib/content/types",
// e.g. email: known("hello@yourdomain.com")
