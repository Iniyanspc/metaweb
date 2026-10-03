import { missing, type CaseStudy } from "@/lib/content/types";

/**
 * Case-study template. Copy this object per engagement.
 * Metrics with verified:false render as placeholders and never animate.
 * Set publicApproval:false until the client has approved being named.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "case-study-template",
    client: missing("[CLIENT NAME]"),
    clientLogo: missing("[CLIENT LOGO]"),
    industry: "healthcare",
    capabilities: ["data-engineering", "ai"],
    title: "[CASE STUDY TITLE]",
    summary: "[ONE-SENTENCE SUMMARY]",
    challenge: "[What was happening? Two to three sentences in the client's terms.]",
    approach: "[What did we build?]",
    architecture: { technologies: [] },
    implementation: "[How was it delivered? Phases, team shape, timeline.]",
    outcome: "[What changed for the business?]",
    metrics: [
      { value: missing("[XX]"), unit: "%", label: "reduction in processing time" },
      { value: missing("[XX]"), unit: "hrs", label: "saved per week" },
    ],
    featured: true,
    publishedAt: missing("[DATE]"),
    publicApproval: false,
  },
];
