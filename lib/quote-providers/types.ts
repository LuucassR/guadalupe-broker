import type { CoverageTier } from "@/lib/pricing";

// Contrato generico del multicotizador: cada aseguradora / agregador se conecta
// implementando `QuoteProvider`. El nucleo (types, registry, /api/quote) no
// conoce ningun proveedor puntual. Ver docs/quote-providers.md.

// Input agnostico de proveedor, armado con lo que ya sabe el Cotizador.
export interface QuoteInput {
  vehicleType: "Auto" | "Moto";
  brand: string;
  model: string;
  version?: string;
  year: number;
  vehicleValueARS: number;
  hasGnc: boolean;
  gncValueARS?: number;
  postalCode: string;
  // Id estable de la version del catalogo CCA que eligio el usuario (ver
  // lib/vehicle-valuation.ts). Es *nuestro* id, agnostico de proveedor: cada
  // adapter lo traduce a su propio codigo de vehiculo via lib/quote-providers/
  // vehicle-xref.ts. Sin esto, un proveedor que necesite el codigo solo puede
  // cotizar si se lo pasan por `providerCodes`.
  catalogVersionId?: number;
  coverage?: CoverageTier; // filtro opcional
  driversUnder25?: boolean;
  garageParking?: boolean;
  zeroKm?: boolean;
  trackingEquipment?: boolean;
  // Codigos de catalogo propios de cada proveedor, ya resueltos por quien
  // llama, indexados por id de proveedor.
  // Ej: { sancor: { vehicleCode: "12345", cityCode: 6700 } }
  providerCodes?: Record<string, Record<string, string | number>>;
}

export interface QuotePlan {
  planId: string;
  planName: string;
  coverage: CoverageTier | null; // normalizacion best-effort, puede ser null
  coverageRawName: string;
  monthlyPremium: number | null;
  totalPremium: number | null;
  insuredSumARS: number | null;
  currency: "ARS";
  notes?: string;
}

export interface ProviderQuoteResult {
  providerId: string;
  providerName: string;
  ok: boolean;
  plans: QuotePlan[];
  error?: string; // presente cuando ok === false
  raw?: unknown; // solo en dev, se descarta en produccion
}

export interface QuoteProvider {
  id: string; // "sancor"
  name: string; // "Sancor Seguros"
  enabled(): boolean; // estan las env vars requeridas
  quote(input: QuoteInput): Promise<ProviderQuoteResult>;
}
