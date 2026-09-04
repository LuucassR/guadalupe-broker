# Graph Report - guadalupe-broker  (2026-09-02)

## Corpus Check
- 73 files · ~53,144 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 476 nodes · 722 edges · 34 communities (22 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c64e2a64`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.ts
- dependencies
- Lucas David Rossi
- devDependencies
- compilerOptions
- SITE_CONFIG
- sancor.ts
- CLAUDE.md
- pricing.ts
- pnpm ignoredBuiltDependencies config
- Sancor Seguros (`sancor`)
- app/layout.tsx
- globe.svg
- bitrix24.ts
- Preloader.tsx
- cooperacion-smoke.mjs
- Que hay hoy (nivel gratis)
- Family Protection / Insurance Emotional Appeal Concept
- Next.js
- Vercel
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- window.svg (browser window icon)
- quote-cooperacion.spec.ts
- file.svg (generic file/document icon)
- cooperacion.ts
- sancor-smoke.mjs
- cotizador-ui.spec.ts
- quote-api.spec.ts
- import-cca-catalog.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `SectionLabel()` - 12 edges
3. `SectionTitle()` - 11 edges
4. `SITE_CONFIG` - 11 edges
5. `scripts` - 11 edges
6. `Sancor Seguros (`sancor`)` - 10 edges
7. `Cooperación Seguros (`cooperacion`)` - 9 edges
8. `Lucas David Rossi` - 9 edges
9. `Cotizador()` - 8 edges
10. `CoverageTier` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Platform (deployment)` --semantically_similar_to--> `Vercel (CV deployment)`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `JCRossi Automotores - Dealership Website`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `YaMayorista - E-Commerce`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `generateMetadata()` --references--> `COVERAGES`  [EXTRACTED]
  app/(public)/coberturas/[slug]/page.tsx → constants/site.ts
- `CoverageDetailPage()` --references--> `COVERAGES`  [EXTRACTED]
  app/(public)/coberturas/[slug]/page.tsx → constants/site.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **JCRossi Automotores tech stack (Next.js, TypeScript, Tailwind CSS, Vercel, AWS)** — public_cv_jcrossi_automotores, public_cv_nextjs_stack, public_cv_typescript_stack, public_cv_tailwind_stack, public_cv_vercel_stack, public_cv_aws_stack [EXTRACTED 1.00]
- **Lucas Rossi's professional experience entries** — public_cv_lucas_rossi, public_cv_stealth_startup_role, public_cv_digital_forensics_role, public_cv_yamayorista, public_cv_jcrossi_automotores [EXTRACTED 1.00]
- **YaMayorista tech stack (React, Supabase, Prisma, PostgreSQL, TypeScript, Vercel)** — public_cv_yamayorista, public_cv_supabase_stack, public_cv_prisma_stack, public_cv_postgresql_stack, public_cv_typescript_stack, public_cv_vercel_stack [EXTRACTED 1.00]

## Communities (34 total, 12 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.06
Nodes (48): metadata, GROUP_LABELS, GROUP_ORDER, ICON_MAP, metadata, CoverageDetailPage(), generateMetadata(), ICON_MAP (+40 more)

### Community 1 - "dependencies"
Cohesion: 0.08
Nodes (25): ai, @ai-sdk/anthropic, framer-motion, gsap, @gsap/react, lucide-react, next, dependencies (+17 more)

### Community 2 - "Lucas David Rossi"
Cohesion: 0.11
Nodes (25): AI & LLMs (LLM, Prompt Engineering, AI Agents, RAG, LangChain, Claude), AWS (EC2, S3, RDS), CS50 Python, CS50 SQL, CS50X - Computer Science (HarvardX), Digital Forensics Specialist (Independent / Legal Services), Docker / Docker Compose, JCRossi Automotores - Dealership Website (+17 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (39): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @playwright/test, prettier, prettier-plugin-tailwindcss (+31 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "SITE_CONFIG"
Cohesion: 0.25
Nodes (7): Footer(), NAV_LINKS, NAV_LINKS, Navbar(), WhatsAppFAB(), WhatsAppIcon(), SITE_CONFIG

### Community 6 - "sancor.ts"
Cohesion: 0.11
Nodes (22): POST(), quoteSchema, CoverageTier, cooperacionProvider, mapPlans(), matchCoverageTier(), TIER_PATTERNS, getEnabledProviders() (+14 more)

### Community 7 - "CLAUDE.md"
Cohesion: 0.22
Nodes (7): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, graphify, graphify, Working rules

### Community 8 - "pricing.ts"
Cohesion: 0.06
Nodes (55): leadSchema, vehicleDetailsSchema, GET(), Cotizador(), CURRENT_YEAR, digitCount(), fetchVehicleLookup(), YEARS (+47 more)

### Community 9 - "pnpm ignoredBuiltDependencies config"
Cohesion: 0.47
Nodes (6): pnpm ignoredBuiltDependencies config, prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver

### Community 10 - "Sancor Seguros (`sancor`)"
Cohesion: 0.07
Nodes (27): Agregar un proveedor nuevo, Alta en el portal (una sola vez), Autenticación, Autenticación (2 piezas), Convención de env vars, Cooperación Seguros (`cooperacion`), Debug sin Next, El contrato `QuoteProvider` (+19 more)

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, outfit, sourceSans

### Community 12 - "globe.svg"
Cohesion: 0.50
Nodes (3): Globe icon (world/network icon), Next.js default template asset, public/ directory (static assets)

### Community 15 - "cooperacion-smoke.mjs"
Cohesion: 0.22
Nodes (4): authHeaders, cp, env, quoteBody

### Community 16 - "Que hay hoy (nivel gratis)"
Cohesion: 0.29
Nodes (6): Como correrlo a mano (después de la primera vez), Limitaciones conocidas (léelas antes de confiar el número a un cliente), Puesta en marcha (una sola vez), Que hay hoy (nivel gratis), Subir de nivel más adelante, Valuacion de autos del multicotizador

### Community 28 - "cooperacion.ts"
Cohesion: 0.09
Nodes (26): CatalogEntity, CooperacionConfig, CooperacionQuoteRow, CooperacionResponse, getAuthorizationHeader(), LocalidadRow, makeLiveResolver(), resolveMarca() (+18 more)

### Community 29 - "sancor-smoke.mjs"
Cohesion: 0.18
Nodes (7): clientHeaders, end, env, moduleCodes, now, quoteBody, vehicleCode

### Community 30 - "cotizador-ui.spec.ts"
Cohesion: 0.25
Nodes (5): BRANDS, MODELS, PROVIDER_COLUMNS, PROVIDER_PLANS, VERSIONS

### Community 34 - "import-cca-catalog.ts"
Cohesion: 0.22
Nodes (12): @prisma/client, @prisma/client, assignTokensToColumns(), Column, downloadAndExtractText(), main(), parseCcaText(), ParsedBrand (+4 more)

## Ambiguous Edges - Review These
- `Next.js (CV stack)` → `YaMayorista - E-Commerce`  [AMBIGUOUS]
  public/CV.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **206 isolated node(s):** `metadata`, `Props`, `ICON_MAP`, `metadata`, `ICON_MAP` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Next.js (CV stack)` and `YaMayorista - E-Commerce`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `CoverageTier` connect `sancor.ts` to `pricing.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `import-cca-catalog.ts`, `devDependencies`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `metadata`, `Props`, `ICON_MAP` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06027306027306027 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Lucas David Rossi` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._