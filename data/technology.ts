import type { Technology } from "@/lib/content/types";

/**
 * Technologies we work with. Edit freely: set inUse:false to hide, add new ones.
 * Listing a technology never implies partnership or certification.
 * Seeded as a starting list — confirm each one before launch.
 */
export const technologies: Technology[] = [
  { slug: "azure", name: "Microsoft Azure", category: "Cloud", inUse: true },
  { slug: "aws", name: "AWS", category: "Cloud", inUse: true },
  { slug: "gcp", name: "Google Cloud", category: "Cloud", inUse: true },
  { slug: "databricks", name: "Databricks", category: "Data engineering", inUse: true },
  { slug: "apache-spark", name: "Apache Spark / PySpark", category: "Data engineering", inUse: true },
  { slug: "azure-data-factory", name: "Azure Data Factory", category: "Data engineering", inUse: true },
  { slug: "airflow", name: "Apache Airflow", category: "Data engineering", inUse: true },
  { slug: "dbt", name: "dbt", category: "Data engineering", inUse: true },
  { slug: "kafka", name: "Apache Kafka", category: "Data engineering", inUse: true },
  { slug: "delta-lake", name: "Delta Lake", category: "Databases", inUse: true },
  { slug: "postgresql", name: "PostgreSQL", category: "Databases", inUse: true },
  { slug: "sql", name: "SQL Server", category: "Databases", inUse: true },
  { slug: "vector-search", name: "Vector databases", category: "AI / ML", inUse: true },
  { slug: "llm-apis", name: "LLM APIs (Claude, OpenAI, open models)", category: "AI / ML", inUse: true },
  { slug: "langgraph", name: "LangChain / LangGraph", category: "AI / ML", inUse: true },
  { slug: "mlflow", name: "MLflow", category: "AI / ML", inUse: true },
  { slug: "power-bi", name: "Power BI", category: "Analytics", inUse: true },
  { slug: "python", name: "Python / FastAPI", category: "Backend", inUse: true },
  { slug: "typescript", name: "TypeScript / Node.js", category: "Backend", inUse: true },
  { slug: "nextjs", name: "React / Next.js", category: "Frontend", inUse: true },
  { slug: "github-actions", name: "GitHub Actions", category: "DevOps", inUse: true },
  { slug: "docker", name: "Docker", category: "DevOps", inUse: true },
  { slug: "terraform", name: "Terraform", category: "Infrastructure", inUse: true },
  { slug: "kubernetes", name: "Kubernetes", category: "Infrastructure", inUse: true },
  { slug: "entra-id", name: "Microsoft Entra ID", category: "Security", inUse: true },
  { slug: "key-vault", name: "Secrets management (Key Vault, Vault)", category: "Security", inUse: true },
];

export const techPhilosophy: Record<Technology["category"], string> = {
  Cloud: "Cloud-agnostic by design. We build where your data and contracts already live.",
  "Data engineering": "Open formats and tested transformations, so your data outlives any single tool.",
  Databases: "The right store for the access pattern, not one database for everything.",
  "AI / ML": "Model-agnostic, evaluated before release, and grounded in governed data.",
  Analytics: "One semantic layer, so every dashboard tells the same story.",
  Backend: "Boring, well-typed services that are easy to hand over.",
  Frontend: "Fast, accessible interfaces your teams want to use.",
  DevOps: "Everything in version control, everything deployable on demand.",
  Infrastructure: "Infrastructure as code, reviewed like any other code.",
  Security: "Least privilege, encrypted by default, audited from day one.",
};
