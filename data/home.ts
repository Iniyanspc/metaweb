import type { HomeContent } from "@/lib/content/types";
import { capabilities } from "./capabilities";

/** Homepage copy, verbatim from docs/04-copy-deck.md. */

const dataEngineering = capabilities.find((c) => c.slug === "data-engineering");
if (!dataEngineering?.detail?.architecture) throw new Error("data-engineering architecture missing");

export const home: HomeContent = {
  hero: {
    headline: "Engineering the data and intelligence behind better businesses.",
    support:
      "Data platforms, AI systems and custom software for enterprises and governments. Built from the pipeline up, and run for the long term.",
    cta: {
      primary: { label: "Talk to our team", href: "/contact" },
      secondary: { label: "Explore our capabilities", href: "#capabilities" },
    },
    diagramDescription:
      "Diagram of the metadatum mark as a system. Data from ERP, CRM, documents, sensors and APIs flows into a central platform, where it is checked for quality and governance, becomes models, knowledge and search, and leaves as decisions, actions and outcomes.",
  },
  trust: { line: "Trusted by teams building what comes next." },
  problem: {
    headline: "Data everywhere. Answers nowhere.",
    lines: [
      "Your data lives in a dozen systems that don't talk to each other.",
      "Pipelines work until the day they quietly don't.",
      "Business teams wait days for numbers that should take minutes.",
      "AI pilots stall because the data underneath isn't ready.",
      "Custom tools drift away from the processes they were built for.",
    ],
    turn: "We connect the pieces.",
    support: "Data, systems, people, processes and AI, engineered into one foundation your business can build on.",
  },
  capabilities: { headline: "Six ways we work. One foundation underneath." },
  foundation: {
    headline: "The foundation is data.",
    support:
      "Before AI, analytics or automation can create value, an organisation needs data it can rely on. That is where every engagement begins.",
    flow: dataEngineering.detail.architecture,
    closing: ["Data is infrastructure.", "AI is intelligence.", "Business is the outcome."],
  },
  ai: {
    headline: "AI built on data your business can trust.",
    support:
      "Most AI projects don't fail at the model. They fail at the data. We build both, so what your AI says is grounded in what your business knows.",
    flow: ["Enterprise data", "Knowledge", "Models", "AI applications", "Business actions"],
    services: [
      "Generative AI applications",
      "AI agents",
      "Document intelligence",
      "Enterprise search",
      "Retrieval-augmented applications",
      "AI copilots",
      "Workflow automation",
      "Predictive models",
    ],
    cta: { label: "See AI engineering", href: "/solutions/ai" },
  },
  process: {
    headline: "From business problem to working product.",
    support: "Some clients arrive with a specification. Most arrive with a problem. We're built for both.",
    steps: [
      { title: "Understand", body: "Map the process, the people and the data as they really are." },
      { title: "Design", body: "Shape the product around the decision it needs to support." },
      { title: "Architect", body: "Choose the simplest architecture that will still hold at scale." },
      { title: "Build", body: "Ship in short cycles you can see and steer." },
      { title: "Integrate", body: "Connect to the systems you already run." },
      { title: "Deploy", body: "Release with monitoring, documentation and handover." },
      { title: "Scale", body: "Operate, measure and improve as usage grows." },
    ],
  },
  industries: {
    headline: "Domain knowledge, engineered.",
    support: "We work where complex data meets complex operations.",
    cta: { label: "See all industries", href: "/industries" },
    otherCta: { label: "Tell us about yours", href: "/contact?topic=other-industry" },
  },
  products: {
    headline: "Built by us. Ready for you.",
    support: "Alongside client work, we build products for problems we keep seeing.",
    empty: "Our first products are in development. [PRODUCT NAME] and others will be listed here.",
  },
  caseStudies: {
    headline: "Work that shipped.",
    support: "What was broken, what we built, and what changed.",
    cta: { label: "See all case studies", href: "/case-studies" },
    more: "More case studies are being written up with our clients' approval.",
  },
  technology: {
    headline: "The right tool, not the fashionable one.",
    support:
      "We choose technology for fit, cost and longevity, and we work across the major clouds and open-source ecosystems.",
    note: "Technologies we work with. Listing does not imply partnership or certification.",
    cta: { label: "See our technology", href: "/technology" },
  },
  team: {
    headline: "The people who build it.",
    support:
      "Engineers, data specialists and product people who have shipped for governments and global enterprises.",
    cta: { label: "Meet the team", href: "/team" },
  },
  insights: {
    headline: "Notes from the work.",
    cta: { label: "Read all insights", href: "/insights" },
    empty: "Our first articles are on the way.",
  },
  finalCta: {
    headline: ["Have a complex problem?", "Let's engineer the solution."],
    support:
      "Tell us what you're trying to build, improve, automate or understand. We'll help you find the technology path forward.",
    cta: { label: "Talk to our team", href: "/contact" },
  },
};
