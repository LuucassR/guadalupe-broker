# Graph Report - guadalupe-broker  (2026-08-13)

## Corpus Check
- Corpus is ~19,045 words - fits in a single context window. You may not need a graph.

## Summary
- 234 nodes · 279 edges · 28 communities (17 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 188,010 input · 20,888 output

## Community Hubs (Navigation)
- Public Site Pages & Content
- Runtime Dependencies
- README & Resume Docs
- Dev Tooling Dependencies
- TypeScript Compiler Config
- Coverage & About Pages
- Site Layout Shell
- TypeScript Project References
- Package Manifest
- PNPM Workspace Config
- Shared TypeScript Types
- Root App Layout
- Globe Icon Asset
- Bitrix24 CRM Integration
- Hero Family Image
- Next.js Logo Asset
- Vercel Logo Asset
- ESLint Config
- AI Agent System Prompt
- Next.js Config
- PostCSS Config
- Window Icon Asset
- File Icon Asset

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `SITE_CONFIG` - 10 edges
3. `Lucas David Rossi` - 9 edges
4. `YaMayorista - E-Commerce` - 8 edges
5. `include` - 7 edges
6. `JCRossi Automotores - Dealership Website` - 7 edges
7. `COVERAGES` - 6 edges
8. `Cotizador()` - 5 edges
9. `scripts` - 5 edges
10. `guadalupe-broker (Next.js project)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `JCRossi Automotores - Dealership Website`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `guadalupe-broker (Next.js project)` --semantically_similar_to--> `YaMayorista - E-Commerce`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf
- `Vercel Platform (deployment)` --semantically_similar_to--> `Vercel (CV deployment)`  [INFERRED] [semantically similar]
  README.md → public/CV.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **JCRossi Automotores tech stack (Next.js, TypeScript, Tailwind CSS, Vercel, AWS)** — public_cv_jcrossi_automotores, public_cv_nextjs_stack, public_cv_typescript_stack, public_cv_tailwind_stack, public_cv_vercel_stack, public_cv_aws_stack [EXTRACTED 1.00]
- **YaMayorista tech stack (React, Supabase, Prisma, PostgreSQL, TypeScript, Vercel)** — public_cv_yamayorista, public_cv_supabase_stack, public_cv_prisma_stack, public_cv_postgresql_stack, public_cv_typescript_stack, public_cv_vercel_stack [EXTRACTED 1.00]
- **Lucas Rossi's professional experience entries** — public_cv_lucas_rossi, public_cv_stealth_startup_role, public_cv_digital_forensics_role, public_cv_yamayorista, public_cv_jcrossi_automotores [EXTRACTED 1.00]

## Communities (28 total, 11 thin omitted)

### Community 0 - "Public Site Pages & Content"
Cohesion: 0.08
Nodes (28): metadata, ICON_MAP, Props, BentoGrid(), ICONS, CtaBanner(), Hero(), PinnedShowcase() (+20 more)

### Community 1 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (27): ai, @ai-sdk/anthropic, framer-motion, gsap, @gsap/react, lucide-react, next, dependencies (+19 more)

### Community 2 - "README & Resume Docs"
Cohesion: 0.11
Nodes (25): AI & LLMs (LLM, Prompt Engineering, AI Agents, RAG, LangChain, Claude), AWS (EC2, S3, RDS), CS50 Python, CS50 SQL, CS50X - Computer Science (HarvardX), Digital Forensics Specialist (Independent / Legal Services), Docker / Docker Compose, JCRossi Automotores - Dealership Website (+17 more)

### Community 3 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+13 more)

### Community 4 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 5 - "Coverage & About Pages"
Cohesion: 0.14
Nodes (10): GROUP_LABELS, GROUP_ORDER, ICON_MAP, metadata, metadata, TIMELINE, VALUES, MarqueeStrip() (+2 more)

### Community 6 - "Site Layout Shell"
Cohesion: 0.24
Nodes (6): Footer(), NAV_LINKS, NAV_LINKS, Navbar(), WhatsAppFAB(), BRANCHES

### Community 7 - "TypeScript Project References"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "Package Manifest"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 9 - "PNPM Workspace Config"
Cohesion: 0.47
Nodes (6): pnpm ignoredBuiltDependencies config, prisma, @prisma/client, @prisma/engines, sharp, unrs-resolver

### Community 10 - "Shared TypeScript Types"
Cohesion: 0.33
Nodes (5): BranchInfo, CoverageItem, ReviewItem, StatItem, WhyUsItem

### Community 12 - "Globe Icon Asset"
Cohesion: 0.50
Nodes (3): Globe icon (world/network icon), Next.js default template asset, public/ directory (static assets)

## Ambiguous Edges - Review These
- `YaMayorista - E-Commerce` → `Next.js (CV stack)`  [AMBIGUOUS]
  public/CV.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **107 isolated node(s):** `metadata`, `Props`, `ICON_MAP`, `metadata`, `ICON_MAP` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `YaMayorista - E-Commerce` and `Next.js (CV stack)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Config` to `TypeScript Project References`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `metadata`, `Props`, `ICON_MAP` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Site Pages & Content` be split into smaller, more focused modules?**
  _Cohesion score 0.07585568917668825 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._