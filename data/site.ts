import { known, missing, type SiteConfig } from "@/lib/content/types";

export const site: SiteConfig = {
  name: "metadatum",
  url: known("https://themetadatum.com"),
  legalEntity: known("Metadatum Technology Private Limited"),
  tagline: "We engineer the data and intelligence behind better businesses.",
  // Rendered masked ("founder at themetadatum.com"); never as a plain address in markup.
  email: known("founder@themetadatum.com"),
  phone: known("+91 80737 53030"),
  offices: [
    known({
      city: "Chennai",
      address: "S94, 2nd Floor, Phase III, Spencer Plaza Mall, Anna Road, Chennai, Tamil Nadu 600002, India",
    }),
  ],
  social: [
    { network: "linkedin", url: missing("[LINKEDIN URL]") },
    { network: "github", url: missing("[GITHUB URL]") },
  ],
  responseTime: known("two business days"),
  // Only list industries you have actually delivered in.
  industriesServed: ["Education", "Healthcare", "Logistics", "HR and workforce", "Government", "Retail"],
  clientLogos: Array.from({ length: 6 }, () => missing("[CLIENT LOGO]")),
};

// When a fact is confirmed, swap missing(...) for known(...) from "@/lib/content/types",
// e.g. email: known("hello@yourdomain.com")
