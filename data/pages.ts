import type { PagesContent } from "@/lib/content/types";

/**
 * Copy for every page except the homepage (data/home.ts).
 * Lines marked "copy deck" are verbatim from docs/04-copy-deck.md; the rest is
 * first-draft copy written to the brand rules. Edit freely. Bracketed tokens
 * render as visible placeholders until replaced.
 */
export const pages: PagesContent = {
  solutions: {
    title: "Organise your data. Build your AI. Ace the business decisions.",
    // Client wording, matching the homepage foundation section.
    titleLines: ["Organise your data.", "Build your AI.", "Ace the business decisions."],
    support:
      "Three disciplines, one team, one architecture. We take you from business problem to running system without handing you between vendors.", // copy deck
    image: "hero-team",
    seo: {
      title: "Solutions",
      description:
        "Data engineering, AI engineering, analytics and custom software from one team, built on one architecture and run for the long term.",
    },
    pillars: [
      {
        pillar: "data",
        heading: "Data",
        line: "The foundation. Pipelines, platforms and analytics your business can rely on.",
        capabilities: ["data-engineering", "analytics"],
      },
      {
        pillar: "ai",
        heading: "Intelligence",
        line: "Built on the foundation, never floating above it.",
        capabilities: ["ai"],
      },
      {
        pillar: "business",
        heading: "Business",
        line: "Where it turns into something the business uses, and keeps using.",
        capabilities: ["custom-products", "business-transformation", "managed-engineering"],
      },
    ],
    labels: { services: "Key services" },
  },

  solutionTemplate: {
    whatWeBuild: "What we build",
    architecture: "How it's architected",
    engagements: "Typical engagements",
    technologies: "Technologies we work with",
    industries: "Where we apply it",
    caseStudies: "Related case studies",
    noCaseStudies: "Case studies for this work are being written up with our clients' approval.",
  },

  industries: {
    title: "Domain knowledge, engineered.", // copy deck
    support: "We work where complex data meets complex operations.", // copy deck
    image: "library-old",
    seo: {
      title: "Industries",
      description:
        "Data platforms, AI and custom software for education, healthcare, logistics and HR, built around how each sector actually works.",
    },
    otherHeading: "Other industries",
    otherCta: { label: "Tell us about your sector", href: "/contact?topic=other-industry" },
  },

  industryTemplate: {
    challenge: "The challenge",
    dataProblems: "Typical data problems",
    aiOpportunities: "Where AI helps",
    solutions: "What we build",
    caseStudies: "Relevant case studies",
    noCaseStudies: "Case studies in this sector are being written up with our clients' approval.",
  },

  products: {
    title: "Built by us. Ready for you.", // copy deck
    support: "Alongside client work, we build products for problems we keep seeing.", // copy deck
    seo: {
      title: "Products",
      description: "Products built by metadatum for problems we see again and again in data, AI and business operations.",
    },
    allLabel: "All products",
  },

  caseStudies: {
    title: "Work that shipped.", // copy deck
    support: "What was broken, what we built, and what changed.", // copy deck
    seo: {
      title: "Case studies",
      description: "How metadatum engineers data platforms, AI systems and custom software, and what changed for each client's business.",
    },
    empty: "More case studies are being written up with our clients' approval.",
  },

  caseStudyTemplate: {
    client: "Client",
    industry: "Industry",
    challenge: "The challenge",
    approach: "Our approach",
    architecture: "Architecture",
    implementation: "Implementation",
    outcome: "The outcome",
    metrics: "Results",
  },

  about: {
    title: "We engineer the data and intelligence behind better businesses.", // copy deck
    support: "An engineering company whose foundation is data.",
    image: "office-floor",
    seo: {
      title: "About",
      description:
        "metadatum is an AI and data engineering company. We build the pipelines and platforms first, then the intelligence, then the products people use.",
    },
    whoWeAre: {
      heading: "Who we are",
      body: [
        "We build data platforms, pipelines, AI systems, analytics and custom software, and we help organisations work out what to build in the first place.",
        "We build the foundation first, then the intelligence on top, then the products people actually use. And we stay to run them.",
      ],
    },
    beliefs: { heading: "What we help you do", lines: ["Organise your data.", "Build your AI.", "Ace the business decisions."] }, // client wording
    mission: {
      heading: "Our mission",
      // Drafted copy, published for launch; review it in BACKLOG.md.
      body: "Make reliable data and useful AI available to every organisation that needs it, not only the largest.",
    },
    approach: { heading: "How we work", support: "Seven steps, from the first conversation to a system that keeps improving." },
    philosophy: {
      heading: "Technology philosophy",
      points: [
        // copy deck: "Simple before clever. Open standards before lock-in. Observable by default. Built to be handed over."
        { title: "Simple before clever.", body: "The best architecture is the simplest one that will still hold at scale." },
        { title: "Open standards before lock-in.", body: "Open formats and portable tools, so your data outlives any single vendor." },
        { title: "Observable by default.", body: "If we can't see it working, we haven't finished building it." },
        { title: "Built to be handed over.", body: "Documented, tested and owned by your team when we step back." },
      ],
    },
    timeline: {
      heading: "Our story so far",
      entries: [
        { year: "[YEAR]", text: "[MILESTONE — e.g. metadatum founded]" },
        { year: "[YEAR]", text: "[MILESTONE]" },
        { year: "[YEAR]", text: "[MILESTONE]" },
      ],
    },
    locations: { heading: "Where we are" },
    culture: {
      heading: "How we work together",
      points: [
        { title: "Own the outcome", body: "We measure our work by what changes for the client, not by what we shipped." },
        { title: "Say it plainly", body: "Clear writing, honest estimates, and bad news early." },
        { title: "Leave it better", body: "Every system we touch should be easier to run when we leave than when we arrived." },
      ],
    },
    leadership: { heading: "Leadership", cta: { label: "Meet the team", href: "/team" } },
    careers: {
      heading: "Work with us",
      body: "We hire engineers who care about correctness, clarity and the people who'll use what they build.",
      cta: { label: "See careers", href: "/careers" },
    },
  },

  team: {
    title: "The people who build it.", // copy deck
    support: "Engineers, data specialists and product people who have shipped for governments and global enterprises.", // copy deck
    seo: {
      title: "Team",
      description: "Meet the engineers, data specialists and product people at metadatum.",
    },
    groupOrder: ["Leadership", "Engineering", "Data", "AI", "Product", "Business development", "Operations"],
  },

  technology: {
    title: "The right tool, not the fashionable one.", // copy deck
    support:
      "We choose technology for fit, cost and longevity, and we work across the major clouds and open-source ecosystems.", // copy deck
    seo: {
      title: "Technology",
      description: "The clouds, data platforms, AI frameworks and engineering tools metadatum works with, and how we choose between them.",
    },
    note: "Technologies we work with. Listing does not imply partnership or certification.", // copy deck
  },

  insights: {
    title: "Notes from the work.", // copy deck
    support: "What we've learned building data platforms, AI systems and software for real organisations.",
    seo: {
      title: "Insights",
      description: "Articles on data engineering, AI, data architecture and product development from the metadatum team.",
    },
    allLabel: "All",
    featuredLabel: "Featured",
    empty: "No articles in this category yet.",
    related: "Related articles",
    by: "Written by",
    teamByline: "The metadatum team",
  },

  careers: {
    title: "Build the systems other systems depend on.", // copy deck
    support: "We hire engineers who care about correctness, clarity and the people who'll use what they build.", // copy deck
    image: "hero-code",
    seo: {
      title: "Careers",
      description: "Join metadatum to build data platforms, AI systems and software that organisations depend on every day.",
    },
    why: {
      heading: "Why work with us",
      points: [
        { title: "Real systems", body: "Your work runs in production for organisations that depend on it." },
        { title: "The whole stack", body: "Data, AI and software in one team, so you see how the pieces fit." },
        { title: "Room to own", body: "Small teams, clear problems, and the trust to solve them your way." },
      ],
    },
    culture: {
      heading: "Engineering culture",
      body: [
        "We review each other's code, write things down, and test what matters.",
        "We prefer boring technology that works over new technology that might.",
      ],
    },
    learning: {
      heading: "Learning",
      body: "[LEARNING BUDGET AND PROGRAMME — describe what you offer, e.g. conference time, certifications, mentoring]",
    },
    hiring: {
      heading: "How we hire",
      steps: [
        { title: "Introduction", body: "A short call about what you want to work on next." },
        { title: "Technical conversation", body: "A discussion of work you've done, not a quiz." },
        { title: "Working session", body: "A realistic problem, worked through together." },
        { title: "Meet the team", body: "Time with the people you'd work alongside." },
        { title: "Offer", body: "A clear offer, and an answer to every question you have." },
      ],
    },
    benefits: { heading: "Benefits", items: ["[BENEFIT]", "[BENEFIT]", "[BENEFIT]", "[BENEFIT]"] },
    roles: {
      heading: "Open positions",
      empty: "No open roles right now. Send us your profile at [EMAIL].", // copy deck
      emptyNoEmail: "No open roles right now. Tell us about yourself through our contact page.",
      apply: "Apply for this role",
    },
  },

  contact: {
    title: "Let's build what your business needs next.", // copy deck
    support: "Tell us about the problem. A senior engineer, not a sales script, will read it.", // copy deck
    seo: {
      title: "Contact",
      description: "Tell metadatum about the data, AI or software problem you're trying to solve. A senior engineer will read it and reply.",
    },
    form: {
      name: "Name",
      email: "Work email",
      company: "Company",
      jobTitle: "Job title",
      industry: "Industry",
      industryOptions: ["Education", "Healthcare", "Logistics and supply chain", "HR and workforce", "Government", "Retail", "Other"],
      building: "What are you looking to build",
      buildingOptions: ["Data platform", "AI application", "Analytics", "Custom software", "Not sure yet"], // copy deck
      scope: "Estimated project scope",
      scopeOptions: ["Discovery only", "Under 3 months", "3–6 months", "6+ months", "Ongoing"], // copy deck
      message: "Message",
      submit: "Send message", // copy deck
      sending: "Sending",
      success: "Message sent. We'll reply within [RESPONSE TIME].", // copy deck
      errorEmail: "Enter a work email so we can reply.", // copy deck
      errorRequired: "This field is required.",
      errorServer: "Your message didn't send. Check your connection and try again, or email us at [EMAIL].", // copy deck
      errorServerNoEmail: "Your message didn't send. Check your connection and try again.",
    },
    details: { heading: "Other ways to reach us", email: "Email", phone: "Phone", offices: "Office", response: "We reply within" },
  },


  notFound: {
    title: "This page isn't in the pipeline.", // copy deck
    support: "The link may be old or mistyped.", // copy deck
    cta: { label: "Go to the homepage", href: "/" }, // copy deck
  },
};
