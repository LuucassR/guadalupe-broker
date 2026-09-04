import type { CoverageTier } from "@/lib/pricing";

// Mapea el nombre de cobertura que devuelve un proveedor a uno de nuestros 3
// tiers. Lo usan todos los adapters para que la normalizacion sea consistente.
// Devuelve null si no matchea con confianza (mejor null que un tier equivocado).
const TIER_PATTERNS: [CoverageTier, RegExp][] = [
  ["todo-riesgo", /todo\s*riesgo|(^|\b)TR\b/i],
  ["terceros-completo", /terceros\s*completo|(^|\b)TC\b/i],
  ["rc", /responsab|(^|\b)RC\b/i],
];

export function matchCoverageTier(...names: (string | null | undefined)[]): CoverageTier | null {
  const haystack = names.filter(Boolean).join(" ");
  if (!haystack) return null;
  for (const [tier, pattern] of TIER_PATTERNS) {
    if (pattern.test(haystack)) return tier;
  }
  return null;
}
