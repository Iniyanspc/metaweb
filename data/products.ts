import { missing, type Product } from "@/lib/content/types";

/** Replace with real products. Never invent names or metrics. */
export const products: Product[] = [
  {
    slug: "product-1",
    published: false, // fill in, then set true
    name: missing("[PRODUCT NAME]"),
    category: "HRMS",
    problem: missing("[PROBLEM SOLVED]"),
    targetCustomer: missing("[TARGET CUSTOMER]"),
    capabilities: [],
    screenshots: [missing("[SCREENSHOT]")],
    technologies: [],
    status: "in-development",
    cta: { label: "Ask about early access", href: "/contact?topic=product" },
  },
];
