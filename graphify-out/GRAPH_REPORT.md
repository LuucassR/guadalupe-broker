# Graph Report - guadalupe-broker  (2026-08-17)

## Corpus Check
- 53 files · ~34,429 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 314 nodes · 484 edges · 24 communities (13 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c52c433c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.ts
- dependencies
- Lucas David Rossi
- devDependencies
- compilerOptions
- (public)/page.tsx
- pricing.ts
- CLAUDE.md
- pnpm ignoredBuiltDependencies config
- app/layout.tsx
- globe.svg
- bitrix24.ts
- Preloader.tsx
- Family Protection / Insurance Emotional Appeal Concept
- Next.js
- Vercel
- eslint.config.mjs
- ai-agent.ts
- next.config.ts
- postcss.config.mjs
- window.svg (browser window icon)
- leads/route.ts
- file.svg (generic file/document icon)

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `SectionLabel()` - 12 edges
3. `SectionTitle()` - 11 edges
4. `SITE_CONFIG` - 11 edges
5. `Lucas David Rossi` - 9 edges
6. `YaMayorista - E-Commerce` - 8 edges
7. `Cotizador()` - 7 edges
8. `include` - 7 edges
9. `JCRossi Automotores - Dealership Website` - 7 edges
10. `PageHero()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Platform (deployment)` --semantically_similar_to--> `Vercel (CV deployment)`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `JCRossi Automotores - Dealership Website`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `YaMayorista - E-Commerce`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `GET()` --calls--> `fetchVehicleBrands()`  [EXTRACTED]
  app/api/vehicle-lookup/route.ts → lib/vehicle-valuation.ts
- `GET()` --calls--> `fetchVehicleModels()`  [EXTRACTED]
  app/api/vehicle-lookup/route.ts → lib/vehicle-valuation.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **JCRossi Automotores tech stack (Next.js, TypeScript, Tailwind CSS, Vercel, AWS)** — public_cv_jcrossi_automotores, public_cv_nextjs_stack, public_cv_typescript_stack, public_cv_tailwind_stack, public_cv_vercel_stack, public_cv_aws_stack [EXTRACTED 1.00]
- **Lucas Rossi's professional experience entries** — public_cv_lucas_rossi, public_cv_stealth_startup_role, public_cv_digital_forensics_role, public_cv_yamayorista, public_cv_jcrossi_automotores [EXTRACTED 1.00]
- **YaMayorista tech stack (React, Supabase, Prisma, PostgreSQL, TypeScript, Vercel)** — public_cv_yamayorista, public_cv_supabase_stack, public_cv_prisma_stack, public_cv_postgresql_stack, public_cv_typescript_stack, public_cv_vercel_stack [EXTRACTED 1.00]

## Communities (24 total, 11 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.07
Nodes (29): ICON_MAP, Props, Footer(), NAV_LINKS, NAV_LINKS, Navbar(), WhatsAppFAB(), CtaBanner() (+21 more)

### Community 1 - "dependencies"
Cohesion: 0.07
Nodes (27): ai, @ai-sdk/anthropic, framer-motion, gsap, @gsap/react, lucide-react, next, dependencies (+19 more)

### Community 2 - "Lucas David Rossi"
Cohesion: 0.11
Nodes (25): AI & LLMs (LLM, Prompt Engineering, AI Agents, RAG, LangChain, Claude), AWS (EC2, S3, RDS), CS50 Python, CS50 SQL, CS50X - Computer Science (HarvardX), Digital Forensics Specialist (Independent / Legal Services), Docker / Docker Compose, JCRossi Automotores - Dealership Website (+17 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (30): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+22 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (23): metadata, GROUP_LABELS, GROUP_ORDER, ICON_MAP, metadata, metadata, VALUES, BentoGrid() (+15 more)

### Community 6 - "pricing.ts"
Cohesion: 0.07
Nodes (45): GET(), Cotizador(), CURRENT_YEAR, extractYearFromVersionName(), fetchVehicleLookup(), YEARS, PriceComparison(), PriceComparisonProps (+37 more)

### Community 7 - "CLAUDE.md"
Cohesion: 0.22
Nodes (7): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, graphify, graphify, Working rules

### Community 9 - "pnpm ignoredBuiltDependencies config"
Cohesion: 0.47
Nodes (6): pnpm ignoredBuiltDependencies config, prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, outfit, sourceSans

### Community 12 - "globe.svg"
Cohesion: 0.50
Nodes (3): Globe icon (world/network icon), Next.js default template asset, public/ directory (static assets)

### Community 26 - "leads/route.ts"
Cohesion: 0.29
Nodes (5): leadSchema, vehicleDetailsSchema, COVERAGE_TIERS, globalForPrisma, prisma

## Ambiguous Edges - Review These
- `Next.js (CV stack)` → `YaMayorista - E-Commerce`  [AMBIGUOUS]
  public/CV.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **130 isolated node(s):** `metadata`, `Props`, `ICON_MAP`, `metadata`, `ICON_MAP` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Next.js (CV stack)` and `YaMayorista - E-Commerce`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `SITE_CONFIG` connect `site.ts` to `(public)/page.tsx`, `pricing.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `metadata`, `Props`, `ICON_MAP` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0730804810360777 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Lucas David Rossi` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._