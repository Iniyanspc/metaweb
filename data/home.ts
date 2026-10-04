import type { HomeContent } from "@/lib/content/types";

/** Homepage copy, verbatim from docs/04-copy-deck.md unless noted. */

export const home: HomeContent = {
  hero: {
    // Client tagline (replaces the copy deck's "Engineering the data and intelligence behind better businesses.")
    headline: "In data lies intelligence. In intelligence lies better business.",
    tagLines: ["In data lies intelligence.", "In intelligence lies better business."],
    // First sentence leads; the rest follows in the muted tone.
    support:
      "Data holds the answers your business is looking for. We engineer the platforms that hold it, the AI that understands it, the agents that act on it, and the products that bring it to life.",
    cta: {
      primary: { label: "Talk to our team", href: "/contact" },
      secondary: { label: "Explore our capabilities", href: "#capabilities" },
    },
    images: { main: "office-open" },
    agent: {
      label: "What our agents do",
      acts: [
        { name: "Agents do the work", line: "They plan a task, use your systems and get it done." },
        { name: "They learn as they go", line: "Every run makes the next one sharper." },
        { name: "You stay in charge", line: "Ask in plain words. Approve what matters." },
      ],
      task: {
        goal: "Reorder stock running low",
        steps: [
          { text: "Read inventory data", kind: "data" },
          { text: "Check supplier contracts", kind: "data" },
          { text: "Forecast demand, next 30 days", kind: "reason" },
          { text: "Draft purchase orders", kind: "act" },
          { text: "Send for approval", kind: "act" },
        ],
        done: "Done",
        working: "Working",
      },
      loop: [
        { stage: "Perceive", note: "Reads three systems" },
        { stage: "Reason", note: "Picks a plan" },
        { stage: "Act", note: "Updates the ERP" },
        { stage: "Learn", note: "Logs the outcome" },
      ],
      chat: {
        question: "Which orders will miss their delivery date?",
        answer: "Three are at risk. I've rerouted two and flagged one for you.",
        chips: [{ label: "Rerouted" }, { label: "Rerouted" }, { label: "Needs review", review: true }],
        thinking: "Thinking",
      },
    },
    graph: {
      caption: "From sources to decisions",
      legend: { data: "Data", intelligence: "Intelligence", outcomes: "Outcomes" },
      description:
        "Illustration of a knowledge graph: data from ERP, CRM, sensors, documents, APIs, spreadsheets, legacy databases and event streams connects through customers, products, suppliers, orders, assets and contracts to knowledge at the centre, and on to forecasts, alerts, decisions, actions, reports and dashboards.",
    },
  },
  trust: { line: "Trusted by teams building what comes next." },
  problem: {
    headline: "Data everywhere. Answers nowhere.",
    // Trimmed from the copy deck's five lines to keep the section light.
    lines: [
      "Your data lives in a dozen systems that don't talk to each other.",
      "Business teams wait days for numbers that should take minutes.",
      "AI pilots stall because the data underneath isn't ready.",
    ],
    turn: "We connect the pieces.",
    image: "problem-cables",
  },
  capabilities: {
    headline: "Six ways we work. One foundation underneath.",
    support: "Pick one, or bring us the whole problem.",
  },
  foundation: {
    headline: "The foundation is data.",
    steps: [
      { label: "Sources", pillar: "data", icon: "lake" },
      { label: "Ingest and transform", pillar: "data", icon: "pipeline" },
      { label: "AI and analytics", pillar: "ai", icon: "model" },
      { label: "Applications", pillar: "business", icon: "code" },
      { label: "Business decisions", pillar: "business", icon: "briefcase" },
    ],
    // Client wording.
    closing: [
      { text: "Organise your data.", key: "data" },
      { text: "Build your AI.", key: "AI" },
      { text: "Ace the business decisions.", key: "business decisions" },
    ],
  },
  ai: {
    headline: "AI built on data your business can trust.",
    support:
      "Most AI projects don't fail at the model. They fail at the data. We build both, so what your AI says is grounded in what your business knows.",
    flow: ["Enterprise data", "Knowledge", "Models", "AI applications", "Business actions"],
    services: ["AI agents", "Document intelligence", "Enterprise search", "AI copilots"],
    cta: { label: "See AI engineering", href: "/solutions/ai" },
    image: "cap-ai",
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
    image: "process-whiteboard",
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
