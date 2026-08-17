import { CAR_BRANDS, MOTO_BRANDS, type VehicleType, type BrandTier } from "@/constants/vehicles";

export const COVERAGE_TIERS = ["rc", "terceros-completo", "todo-riesgo"] as const;
export type CoverageTier = (typeof COVERAGE_TIERS)[number];

export const FRANQUICIA_OPTIONS = [0, 5, 10, 15, 20] as const;
export type FranquiciaPct = (typeof FRANQUICIA_OPTIONS)[number];

export interface VehicleQuoteInput {
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: string;
  hasGnc: boolean;
  postalCode: string;
}

export interface TierPrice {
  tier: CoverageTier;
  label: string;
  monthlyPrice: number;
  benefits: string[];
}

export interface QuoteResult {
  tiers: TierPrice[];
  brandTier: BrandTier;
  vehicleAgeYears: number;
}

// --- Tabla de tarifas placeholder ---------------------------------------
// Valores ilustrativos de punto de partida, NO son tarifas reales de
// ninguna aseguradora. Ajustar estas constantes a medida que haya datos
// de mercado reales. Todo precio mostrado al usuario se presenta siempre
// como estimado (ver PriceComparison.tsx).

export const BASE_MONTHLY_RATE: Record<VehicleType, number> = {
  Auto: 15000, // ARS/mes, base RC para un vehiculo de gama "mid"
  Moto: 7000,
};

export const TIER_MULTIPLIER: Record<CoverageTier, number> = {
  rc: 1,
  "terceros-completo": 1.65,
  "todo-riesgo": 2.8,
};

export const BRAND_TIER_MULTIPLIER: Record<BrandTier, number> = {
  economy: 0.85,
  mid: 1,
  premium: 1.45,
};

export const VEHICLE_AGE_BRACKETS: { maxAgeYears: number; factor: number }[] = [
  { maxAgeYears: 2, factor: 1.2 },
  { maxAgeYears: 5, factor: 1.08 },
  { maxAgeYears: 10, factor: 1.0 },
  { maxAgeYears: 15, factor: 0.9 },
  { maxAgeYears: Infinity, factor: 0.8 },
];

// GNC solo eleva riesgo de incendio/robo, no aplica a RC pura.
export const GNC_SURCHARGE_PCT = 0.08;

// Heuristica simple por prefijo de codigo postal, no es un mapa de riesgo real.
const ZONE_MULTIPLIER_BY_PREFIX: Record<string, number> = {
  "1": 1.2,
  "2": 1.05,
  "3": 1.0,
  "4": 1.0,
  "5": 1.05,
  "6": 1.0,
  "7": 1.0,
  "8": 1.1,
  "9": 1.1,
};
const DEFAULT_ZONE_MULTIPLIER = 1.05;

// A mayor franquicia, mayor descuento. Solo aplica a Todo Riesgo.
export const FRANQUICIA_DISCOUNT: Record<FranquiciaPct, number> = {
  0: 0,
  5: 0.05,
  10: 0.1,
  15: 0.16,
  20: 0.22,
};

const TIER_LABELS: Record<CoverageTier, string> = {
  rc: "Responsabilidad Civil",
  "terceros-completo": "Terceros Completo",
  "todo-riesgo": "Todo Riesgo",
};

const TIER_BENEFITS: Record<CoverageTier, string[]> = {
  rc: [
    "Cobertura obligatoria por ley",
    "Danos a terceros (personas y bienes)",
    "Defensa legal y penal",
  ],
  "terceros-completo": [
    "Todo lo de Responsabilidad Civil",
    "Incendio total y parcial",
    "Robo o hurto total del vehiculo",
    "Rotura de cristales",
  ],
  "todo-riesgo": [
    "Todo lo de Terceros Completo",
    "Danos parciales propios, con o sin culpa",
    "Granizo, inundacion y fenomenos climaticos",
    "Auto sustituto durante la reparacion",
  ],
};

export function getZoneMultiplier(postalCode: string): number {
  const prefix = postalCode.trim()[0];
  return (prefix && ZONE_MULTIPLIER_BY_PREFIX[prefix]) || DEFAULT_ZONE_MULTIPLIER;
}

function getAgeFactor(ageYears: number): number {
  return (
    VEHICLE_AGE_BRACKETS.find((b) => ageYears <= b.maxAgeYears)?.factor ?? 0.8
  );
}

function getBrandTier(vehicleType: VehicleType, brandName: string): BrandTier {
  const list = vehicleType === "Moto" ? MOTO_BRANDS : CAR_BRANDS;
  return list.find((b) => b.name === brandName)?.tier ?? "mid";
}

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function calculateAutoMotoQuote(
  input: VehicleQuoteInput,
  franquiciaPct: FranquiciaPct = 0,
): QuoteResult {
  const currentYear = new Date().getFullYear();
  const brandTier = getBrandTier(input.vehicleType, input.brand);
  const vehicleAgeYears = Math.max(0, currentYear - (Number(input.year) || currentYear));
  const ageFactor = getAgeFactor(vehicleAgeYears);
  const zoneMultiplier = getZoneMultiplier(input.postalCode);
  const base = BASE_MONTHLY_RATE[input.vehicleType];

  const tiers: TierPrice[] = COVERAGE_TIERS.map((tier) => {
    const gncMultiplier = tier !== "rc" && input.hasGnc ? 1 + GNC_SURCHARGE_PCT : 1;
    let price =
      base *
      TIER_MULTIPLIER[tier] *
      BRAND_TIER_MULTIPLIER[brandTier] *
      ageFactor *
      zoneMultiplier *
      gncMultiplier;
    if (tier === "todo-riesgo") {
      price *= 1 - (FRANQUICIA_DISCOUNT[franquiciaPct] ?? 0);
    }
    return {
      tier,
      label: TIER_LABELS[tier],
      monthlyPrice: roundToNearest(price, 500),
      benefits: TIER_BENEFITS[tier],
    };
  });

  return { tiers, brandTier, vehicleAgeYears };
}

export function formatPriceARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
