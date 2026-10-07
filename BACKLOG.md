# Backlog — content and tasks for later

Everything here is kept, not dropped. Unfinished content stays in the repo as
drafts and the live site leaves it out (see "Drafts and publishing" in
README.md). Preview drafts with `SHOW_DRAFTS=1 pnpm dev`; list remaining
placeholders with `pnpm placeholders`. Fill-in questions for each item are in
LAUNCH-DETAILS.md.

Last updated: 2026-10-07.

---

## 1. Held back from the live site (drafts)

| Item | File | What's needed | To publish |
|---|---|---|---|
| Case study (template) | `data/case-studies.ts` | Real client (or anonymous), challenge, approach, delivery, outcome, 2 verifiable results, date, **client approval to publish** | Fill in, set `published: true`. Restores the homepage "Work that shipped." section, the Case studies page and menu link, "Related case studies" on the solution pages and "Relevant case studies" on the industry pages |
| "Case studies are being written up with our clients' approval" note | Removed 2026-10-07 | Decide whether to show a note like this while case studies are pending | Not needed once a case study is published |
| Team: 3 leadership entries | `data/team.ts` | Name, role, two-sentence bio, experience, LinkedIn, square portrait (≥800px) per person | Fill in, set `published: true` per person. Restores the Team page, About leadership section and About-menu link; articles can then credit authors |
| Product | `data/products.ts` | Name, category, problem solved, target customer, status, screenshot (16:10, ≥1600px) | Fill in, set `published: true`. Restores the Products page and menu link |
| About: company timeline | `data/pages.ts` → `about.timeline` | Three milestones: year and event | Replace the `[YEAR]` / `[MILESTONE]` text; each entry appears once filled |
| Careers: learning offer | `data/pages.ts` → `careers.learning` | What you offer (training budget, certifications, conference time, mentoring) | Replace the placeholder text |
| Careers: benefits | `data/pages.ts` → `careers.benefits` | Up to four benefits | Replace each `[BENEFIT]` |
| Careers: open roles | `data/careers.ts` | Title, team, location, type, summary, apply link | Add roles; the page currently says there are none and points to the contact page |
| Public email and phone | `data/site.ts` | Decide when to show them (founder@themetadatum.com, +91 80737 53030 are on file) | Uncomment the two lines; the email is always shown masked |
| Social links | `data/site.ts` | LinkedIn, GitHub, X, YouTube URLs | Replace `missing(...)` with `known("https://…")`; the footer "Follow" column appears |
| Article template | `content/insights/sample-data-contracts.mdx` | Nothing — writing template for new articles | Never published; copy it for new posts |

## 2. Published now, written by AI — please review

Live on the site, written to the brand rules, not yet reviewed by a person.

- **Insights articles (3, published 2026-10-07):** "Data contracts…", "Why AI pilots stall at the data, not the model", "One definition per metric…". General expertise, no client claims; credited to "The metadatum team".
- **Mission (About):** "Make reliable data and useful AI available to every organisation that needs it, not only the largest."
- **"What we help you do" (About)** and the **Solutions headline** now use your wording: "Organise your data. Build your AI. Ace the business decisions."
- **Solution detail pages** for AI engineering, Data and analytics, Custom products: "What we build", architecture steps, typical engagements.
- **About:** "Who we are", "How we work together", technology-philosophy explanations.
- **Careers:** "Why work with us", engineering culture, 5-step hiring process.
- **Industry pages:** challenge, data problems, AI opportunities and solutions for each industry.
- **Hero agent story:** the reorder-stock task, loop notes and delivery-risk chat (illustrations, not real projects).
- **Original brief copy** (marked `// copy deck` in `data/pages.ts`): most page headlines and intros.

## 3. Claims to verify (they state facts about the company)

| Claim | Where |
|---|---|
| Industries listed: Education, Healthcare, Logistics, HR and workforce (plus custom enterprise and "other") | Industries pages, menus, homepage |
| Technology list (Azure, AWS, GCP, Databricks, Spark, Kafka, dbt, Airflow, Kubernetes, Terraform…), marked "confirm each" | Technology page, solution pages |
| "A senior engineer, not a sales script, will read it" | Contact page |
| "Engineers, data specialists and product people who have shipped for governments and global enterprises" | Team page (hidden until team is published) |
| Permission to show the three client logos, especially the Government of Tamil Nadu emblem | Homepage trust strip |
| "We reply within two business days" | Contact page and form confirmation |

## 4. Setup and technical

- [ ] **Contact form key (blocking for enquiries):** add `NEXT_PUBLIC_WEB3FORMS_KEY` under GitHub → Settings → Secrets and variables → Actions → Variables (free key from web3forms.com, registered to founder@themetadatum.com), then re-run the deploy. Without it the form shows "didn't send".
- [ ] **Enforce HTTPS** in GitHub → Settings → Pages once offered.
- [ ] **Repository is public:** it exposes `docs/` (original brief), `CLAUDE.md`, `AGENTS.md`, this file and code comments. Either accept, remove them, or move to a private repo (GitHub Pages on a private repo needs a paid plan).
- [ ] **Photo sizes:** static hosting serves photos as stored (no per-device resizing). Optional: pre-generate smaller sizes for phones.
- [ ] **Analytics:** none installed. Add later (e.g. Plausible, or GA4 with a consent banner).
- [ ] **Phase 6 audit:** keyboard walkthrough, accessibility (axe), contrast and Lighthouse checks.
- [ ] **Stock photos:** all from Unsplash (credits in `assets/images/CREDITS.md`). Replace with your own office and team photography when available.
