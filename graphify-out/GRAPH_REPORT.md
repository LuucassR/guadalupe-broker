# Graph Report - guadalupe-broker  (2026-09-03)

## Corpus Check
- 75 files · ~58,561 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 511 nodes · 775 edges · 40 communities (28 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c64e2a64`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/page.tsx
- dependencies
- Lucas David Rossi
- devDependencies
- compilerOptions
- import-dnrpa-catalog.ts
- site.ts
- CLAUDE.md
- pricing.ts
- pnpm ignoredBuiltDependencies config
- Cooperación Seguros (`cooperacion`)
- app/layout.tsx
- globe.svg
- bitrix24.ts
- Preloader.tsx
- cooperacion-smoke.mjs
- Valuacion de autos del multicotizador
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
- Cotizador.tsx
- import-cca-catalog.ts
- xref-report.mjs
- [slug]/page.tsx
- Footer.tsx
- coberturas/page.tsx
- clientes/page.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 13 edges
3. `SectionLabel()` - 12 edges
4. `SectionTitle()` - 11 edges
5. `SITE_CONFIG` - 11 edges
6. `Cooperación Seguros (`cooperacion`)` - 11 edges
7. `Sancor Seguros (`sancor`)` - 10 edges
8. `Cotizador()` - 9 edges
9. `Lucas David Rossi` - 9 edges
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

## Communities (40 total, 12 thin omitted)

### Community 0 - "(public)/page.tsx"
Cohesion: 0.14
Nodes (17): metadata, VALUES, metadata, BentoGrid(), SPANS, CtaBanner(), HowItWorks(), PinnedShowcase() (+9 more)

### Community 1 - "dependencies"
Cohesion: 0.08
Nodes (25): ai, @ai-sdk/anthropic, framer-motion, gsap, @gsap/react, lucide-react, next, dependencies (+17 more)

### Community 2 - "Lucas David Rossi"
Cohesion: 0.11
Nodes (25): AI & LLMs (LLM, Prompt Engineering, AI Agents, RAG, LangChain, Claude), AWS (EC2, S3, RDS), CS50 Python, CS50 SQL, CS50X - Computer Science (HarvardX), Digital Forensics Specialist (Independent / Legal Services), Docker / Docker Compose, JCRossi Automotores - Dealership Website (+17 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @playwright/test, prettier, prettier-plugin-tailwindcss (+33 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "import-dnrpa-catalog.ts"
Cohesion: 0.24
Nodes (12): assignTokensToColumns(), DnrpaRow, downloadPdfText(), HeaderCols, main(), normalize(), parseDnrpaText(), parseHeader() (+4 more)

### Community 6 - "site.ts"
Cohesion: 0.16
Nodes (10): Hero(), SLIDES, STATS, MarqueeStrip(), InsurerBadges(), COVERAGE_DETAILS, COVERAGE_FAQ_MAP, Insurer (+2 more)

### Community 7 - "CLAUDE.md"
Cohesion: 0.22
Nodes (7): 1. Think Before Coding, 2. Simplicity First, 3. Surgical Changes, 4. Goal-Driven Execution, graphify, graphify, Working rules

### Community 8 - "pricing.ts"
Cohesion: 0.08
Nodes (37): leadSchema, vehicleDetailsSchema, PriceComparison(), PriceComparisonProps, Fetched, Plan, PROVIDER_COLUMNS, ProviderColumn (+29 more)

### Community 9 - "pnpm ignoredBuiltDependencies config"
Cohesion: 0.47
Nodes (6): pnpm ignoredBuiltDependencies config, prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver

### Community 10 - "Cooperación Seguros (`cooperacion`)"
Cohesion: 0.06
Nodes (29): Agregar un proveedor nuevo, Alta en el portal (una sola vez), Autenticación, Autenticación (2 piezas), Convención de env vars, Cooperación Seguros (`cooperacion`), Debug sin Next, El contrato `QuoteProvider` (+21 more)

### Community 11 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, outfit, sourceSans

### Community 12 - "globe.svg"
Cohesion: 0.50
Nodes (3): Globe icon (world/network icon), Next.js default template asset, public/ directory (static assets)

### Community 15 - "cooperacion-smoke.mjs"
Cohesion: 0.22
Nodes (4): authHeaders, cp, env, quoteBody

### Community 16 - "Valuacion de autos del multicotizador"
Cohesion: 0.25
Nodes (7): Autos anteriores a 2012 (DNRPA), Como correrlo a mano (después de la primera vez), Limitaciones conocidas (léelas antes de confiar el número a un cliente), Puesta en marcha (una sola vez), Que hay hoy (nivel gratis), Subir de nivel más adelante, Valuacion de autos del multicotizador

### Community 28 - "cooperacion.ts"
Cohesion: 0.05
Nodes (48): POST(), quoteSchema, CatalogEntity, CooperacionConfig, cooperacionProvider, CooperacionQuoteRow, CooperacionResponse, getAuthorizationHeader() (+40 more)

### Community 29 - "sancor-smoke.mjs"
Cohesion: 0.18
Nodes (7): clientHeaders, end, env, moduleCodes, now, quoteBody, vehicleCode

### Community 30 - "cotizador-ui.spec.ts"
Cohesion: 0.25
Nodes (5): BRANDS, MODELS, PROVIDER_COLUMNS, PROVIDER_PLANS, VERSIONS

### Community 33 - "Cotizador.tsx"
Cohesion: 0.14
Nodes (26): GET(), Cotizador(), CURRENT_YEAR, digitCount(), fetchVehicleLookup(), isLegacyYear(), YEARS, FranquiciaPct (+18 more)

### Community 34 - "import-cca-catalog.ts"
Cohesion: 0.21
Nodes (13): @prisma/client, @prisma/client, assignTokensToColumns(), Column, downloadAndExtractText(), looksLikeStrayVersionLine(), main(), parseCcaText() (+5 more)

### Community 35 - "xref-report.mjs"
Cohesion: 0.33
Nodes (4): byProvider, minConfidence, prisma, providerFilter

### Community 36 - "[slug]/page.tsx"
Cohesion: 0.20
Nodes (10): CoverageDetailPage(), generateMetadata(), ICON_MAP, Props, AdvisorCta(), FaqAccordion(), FaqItem, COVERAGES (+2 more)

### Community 37 - "Footer.tsx"
Cohesion: 0.24
Nodes (7): Footer(), NAV_LINKS, NAV_LINKS, Navbar(), WhatsAppFAB(), WhatsAppIcon(), BRANCHES

### Community 38 - "coberturas/page.tsx"
Cohesion: 0.20
Nodes (7): GROUP_LABELS, GROUP_ORDER, ICON_MAP, metadata, PageHero(), FAQ_CATEGORIES, FAQS

### Community 39 - "clientes/page.tsx"
Cohesion: 0.39
Nodes (4): metadata, Testimonials(), GoogleRatingCard(), REVIEWS

## Ambiguous Edges - Review These
- `Next.js (CV stack)` → `YaMayorista - E-Commerce`  [AMBIGUOUS]
  public/CV.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **222 isolated node(s):** `metadata`, `Props`, `ICON_MAP`, `metadata`, `ICON_MAP` (+217 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Next.js (CV stack)` and `YaMayorista - E-Commerce`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `CoverageTier` connect `pricing.ts` to `Cotizador.tsx`, `cooperacion.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `import-cca-catalog.ts`, `devDependencies`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `import-cca-catalog.ts` to `dependencies`, `import-dnrpa-catalog.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `metadata`, `Props`, `ICON_MAP` to the rest of the system?**
  _222 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._