# Graph Report - guadalupe-broker  (2026-09-18)

## Corpus Check
- 101 files · ~67,049 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 616 nodes · 1078 edges · 35 communities (25 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20d8513a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.ts
- vehicle-valuation.ts
- Lucas David Rossi
- package.json
- compilerOptions
- import-dnrpa-catalog.ts
- session.ts
- CLAUDE.md
- pricing.ts
- pnpm ignoredBuiltDependencies config
- Cooperación Seguros (`cooperacion`)
- app/layout.tsx
- globe.svg
- bitrix24.ts
- scripts
- cooperacion-smoke.mjs
- Valuacion de autos del multicotizador
- Family Protection / Insurance Emotional Appeal Concept
- Next.js
- Vercel
- eslint.config.mjs
- ai-agent.ts
- permissions.ts
- postcss.config.mjs
- window.svg (browser window icon)
- setup-db-roles.ts
- devDependencies
- file.svg (generic file/document icon)
- cooperacion.ts
- sancor-smoke.mjs
- cotizador-ui.spec.ts
- proxy.ts
- sancor.ts
- import-cca-catalog.ts
- consults.ts

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 26 edges
2. `react` - 18 edges
3. `compilerOptions` - 16 edges
4. `scripts` - 15 edges
5. `Cotizador()` - 12 edges
6. `SectionLabel()` - 12 edges
7. `SectionTitle()` - 11 edges
8. `SITE_CONFIG` - 11 edges
9. `Cooperación Seguros (`cooperacion`)` - 11 edges
10. `formatPriceARS()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Platform (deployment)` --semantically_similar_to--> `Vercel (CV deployment)`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `JCRossi Automotores - Dealership Website`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `YaMayorista - E-Commerce`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `PanelLayout()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/admin/(panel)/layout.tsx → lib/admin/session.ts
- `DashboardPage()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/admin/(panel)/page.tsx → lib/admin/session.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **JCRossi Automotores tech stack (Next.js, TypeScript, Tailwind CSS, Vercel, AWS)** — public_cv_jcrossi_automotores, public_cv_nextjs_stack, public_cv_typescript_stack, public_cv_tailwind_stack, public_cv_vercel_stack, public_cv_aws_stack [EXTRACTED 1.00]
- **Lucas Rossi's professional experience entries** — public_cv_lucas_rossi, public_cv_stealth_startup_role, public_cv_digital_forensics_role, public_cv_yamayorista, public_cv_jcrossi_automotores [EXTRACTED 1.00]
- **YaMayorista tech stack (React, Supabase, Prisma, PostgreSQL, TypeScript, Vercel)** — public_cv_yamayorista, public_cv_supabase_stack, public_cv_prisma_stack, public_cv_postgresql_stack, public_cv_typescript_stack, public_cv_vercel_stack [EXTRACTED 1.00]

## Communities (35 total, 10 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.05
Nodes (59): metadata, metadata, GROUP_LABELS, GROUP_ORDER, ICON_MAP, metadata, ICON_MAP, Props (+51 more)

### Community 1 - "vehicle-valuation.ts"
Cohesion: 0.19
Nodes (20): GET(), CatalogBrand, CatalogModel, CatalogVersion, fetchVehicleBrands(), fetchVehicleModels(), fetchVehicleValueARS(), fetchVehicleVersions() (+12 more)

### Community 2 - "Lucas David Rossi"
Cohesion: 0.11
Nodes (25): AI & LLMs (LLM, Prompt Engineering, AI Agents, RAG, LangChain, Claude), AWS (EC2, S3, RDS), CS50 Python, CS50 SQL, CS50X - Computer Science (HarvardX), Digital Forensics Specialist (Independent / Legal Services), Docker / Docker Compose, JCRossi Automotores - Dealership Website (+17 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (37): LoadingSplash(), Preloader(), dependencies, ai, @ai-sdk/anthropic, framer-motion, gsap, @gsap/react (+29 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "import-dnrpa-catalog.ts"
Cohesion: 0.26
Nodes (12): assignTokensToColumns(), DnrpaRow, downloadPdfText(), HeaderCols, main(), normalize(), parseDnrpaText(), parseHeader() (+4 more)

### Community 6 - "session.ts"
Cohesion: 0.13
Nodes (21): logoutAction(), loginAction(), LoginState, LoginForm(), LoginPage(), PanelLayout(), NAV, Props (+13 more)

### Community 7 - "CLAUDE.md"
Cohesion: 0.22
Nodes (7): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, graphify, graphify, Working rules

### Community 8 - "pricing.ts"
Cohesion: 0.07
Nodes (57): Cotizador(), CURRENT_YEAR, digitCount(), fetchVehicleLookup(), isLegacyYear(), YEARS, PriceComparison(), PriceComparisonProps (+49 more)

### Community 9 - "pnpm ignoredBuiltDependencies config"
Cohesion: 0.47
Nodes (6): pnpm ignoredBuiltDependencies config, prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver

### Community 10 - "Cooperación Seguros (`cooperacion`)"
Cohesion: 0.06
Nodes (30): Agregar un proveedor nuevo, Alta en el portal (una sola vez), Autenticación, Autenticación (2 piezas), Convención de env vars, Cooperación Seguros (`cooperacion`), Debug sin Next, El contrato `QuoteProvider` (+22 more)

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, outfit, sourceSans

### Community 12 - "globe.svg"
Cohesion: 0.50
Nodes (3): Globe icon (world/network icon), Next.js default template asset, public/ directory (static assets)

### Community 14 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, admin:seed, build, cooperacion:smoke, db:roles, dev, import:cca, import:dnrpa (+7 more)

### Community 15 - "cooperacion-smoke.mjs"
Cohesion: 0.22
Nodes (4): authHeaders, cp, env, quoteBody

### Community 16 - "Valuacion de autos del multicotizador"
Cohesion: 0.25
Nodes (7): Autos anteriores a 2012 (DNRPA), Como correrlo a mano (después de la primera vez), Limitaciones conocidas (léelas antes de confiar el número a un cliente), Puesta en marcha (una sola vez), Que hay hoy (nivel gratis), Subir de nivel más adelante, Valuacion de autos del multicotizador

### Community 22 - "permissions.ts"
Cohesion: 0.33
Nodes (4): AdminRole, Permission, PERMISSIONS, ROLES

### Community 25 - "setup-db-roles.ts"
Cohesion: 0.60
Nodes (4): lit(), main(), prisma, upsertRole()

### Community 26 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, @playwright/test, prettier, prettier-plugin-tailwindcss, tailwindcss, @tailwindcss/postcss (+5 more)

### Community 28 - "cooperacion.ts"
Cohesion: 0.07
Nodes (35): CatalogEntity, catalogGet(), CooperacionConfig, CooperacionQuoteRow, CooperacionResponse, getAuthorizationHeader(), GncRow, LocalidadRow (+27 more)

### Community 29 - "sancor-smoke.mjs"
Cohesion: 0.18
Nodes (7): clientHeaders, end, env, moduleCodes, now, quoteBody, vehicleCode

### Community 30 - "cotizador-ui.spec.ts"
Cohesion: 0.12
Nodes (10): BRANDS, MODELS, PROVIDER_COLUMNS, PROVIDER_PLANS, VERSIONS, AUTO_BODY, AUTO_BODY, AUTO_BODY_XREF (+2 more)

### Community 33 - "sancor.ts"
Cohesion: 0.09
Nodes (27): leadSchema, POST(), vehicleDetailsSchema, POST(), quoteSchema, ConsultEvent, ConsultStep, hashIp() (+19 more)

### Community 34 - "import-cca-catalog.ts"
Cohesion: 0.26
Nodes (11): assignTokensToColumns(), Column, downloadAndExtractText(), looksLikeStrayVersionLine(), main(), parseCcaText(), ParsedBrand, ParsedModel (+3 more)

### Community 35 - "consults.ts"
Cohesion: 0.09
Nodes (30): ConsultDetailPage(), Providers, DashboardPage(), pct(), ConsultsSection(), Props, Providers, TABS (+22 more)

## Ambiguous Edges - Review These
- `Next.js (CV stack)` → `YaMayorista - E-Commerce`  [AMBIGUOUS]
  public/CV.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **257 isolated node(s):** `metadata`, `Props`, `ICON_MAP`, `metadata`, `ICON_MAP` (+252 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 304 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Next.js (CV stack)` and `YaMayorista - E-Commerce`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `lucide-react` connect `site.ts` to `pricing.ts`, `package.json`, `consults.ts`, `session.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `consults.ts` to `import-cca-catalog.ts`, `package.json`, `import-dnrpa-catalog.ts`, `session.ts`, `setup-db-roles.ts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `react` connect `site.ts` to `pricing.ts`, `package.json`, `session.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `metadata`, `Props`, `ICON_MAP` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05089108910891089 - nodes in this community are weakly interconnected._
- **Should `Lucas David Rossi` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._