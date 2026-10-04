import { known, missing, type SiteConfig } from "@/lib/content/types";

export const site: SiteConfig = {
  name: "metadatum",
  url: known("https://themetadatum.com"),
  legalEntity: known("Metadatum Technology Private Limited"),
  tagline: "We engineer the data and intelligence behind better businesses.",
  // Public email and phone are hidden for now. To show them, add for example:
  //   email: known("founder@themetadatum.com"),  (rendered masked, never as a plain address)
  //   phone: known("+91 80737 53030"),
  // Contact-form enquiries go to the address registered with the Web3Forms key
  // (NEXT_PUBLIC_WEB3FORMS_KEY), set up for founder@themetadatum.com; it never appears in the code.
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
  // Clients who have agreed to be shown. Files live in public/clients/.
  clientLogos: [
    known({ name: "Government of Tamil Nadu, State Planning Commission", src: "/clients/tn-state-planning-commission.png", alt: "Government of Tamil Nadu, State Planning Commission", width: 530, height: 93 }),
    known({ name: "USF", src: "/clients/usf.png", alt: "USF", width: 761, height: 250 }),
    known({ name: "Vattara", src: "/clients/vattara.png", alt: "Vattara", width: 636, height: 87 }),
  ],
};

// When a fact is confirmed, swap missing(...) for known(...) from "@/lib/content/types",
// e.g. email: known("hello@yourdomain.com")
