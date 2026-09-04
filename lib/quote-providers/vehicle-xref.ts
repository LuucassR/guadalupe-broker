// Cross-reference persistente y auto-poblado entre el catalogo propio (CCA, ver
// lib/vehicle-valuation.ts) y el codigo de vehiculo de cada aseguradora.
//
// El problema: el multicotizador conoce el auto por la version del catalogo CCA
// que eligio el usuario (`catalogVersionId`), pero cada proveedor cotiza contra
// su propio catalogo, con ids propios (Cooperación: `CodigoVehiculoCMP`; otro
// puede pedir un codigo Infoauto, etc.). Este modulo es la unica pieza que
// resuelve ese salto, igual para todos los proveedores:
//
//   resolveProviderVehicleCode("cooperacion", ref, liveResolver)
//
//  1. busca la fila (providerId, ccaVersionId) en `ProviderVehicleXref`
//  2. si no esta (o el "no match" cacheado ya envejecio) llama al `liveResolver`
//     del proveedor — el unico codigo especifico de cada aseguradora, hace el
//     walk de SU catalogo y devuelve un `ResolvedCode` o null
//  3. guarda el resultado (code o null-miss) con source "auto" y lo devuelve
//
// Las filas con source "manual" (las corrige un operador cuando la heuristica
// erro) nunca se pisan. Ver docs/quote-providers.md.
import { prisma } from "@/lib/prisma";

// Re-intento de un "no match" cacheado: el catalogo del proveedor puede sumar
// modelos nuevos, asi que un null viejo no es definitivo.
const MISS_RETRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

// Lo que el proveedor necesita para buscar el auto en su catalogo. Es un subset
// de QuoteInput; `catalogVersionId` es el id estable del catalogo CCA (clave del
// cache), el resto es para el match por texto.
export interface VehicleRef {
  catalogVersionId: number;
  vehicleType: "Auto" | "Moto";
  brand: string;
  model: string;
  version?: string;
  year: number;
}

export interface ResolvedCode {
  code: string;
  codeKind: string; // "codigoVehiculoCMP" | "codigoInfoAuto" | ...
  matchedLabel?: string; // fila del catalogo del proveedor con la que matcheo
  confidence: number; // 0-100 — que tan seguro es el match de la version
}

// El walk del catalogo propio de cada proveedor. Devuelve null si no encuentra
// el auto. Puede lanzar (problema de red / token): eso NO se cachea como miss,
// se propaga para que el quote falle con su mensaje.
export type LiveResolver = (ref: VehicleRef) => Promise<ResolvedCode | null>;

interface XrefRow {
  code: string | null;
  codeKind: string;
  matchedLabel: string | null;
  confidence: number;
  source: string;
  resolvedAt: Date;
}

function toResolved(row: XrefRow): ResolvedCode | null {
  if (!row.code) return null;
  return {
    code: row.code,
    codeKind: row.codeKind,
    matchedLabel: row.matchedLabel ?? undefined,
    confidence: row.confidence,
  };
}

export async function resolveProviderVehicleCode(
  providerId: string,
  ref: VehicleRef,
  live: LiveResolver,
): Promise<ResolvedCode | null> {
  const where = {
    providerId_ccaVersionId: {
      providerId,
      ccaVersionId: ref.catalogVersionId,
    },
  };

  const cached = (await prisma.providerVehicleXref.findUnique({
    where,
  })) as XrefRow | null;

  if (cached) {
    // Una correccion manual manda siempre, aunque sea un "no cotizar este auto"
    // (code null). Un match auto vale mientras no haya envejecido el miss.
    if (cached.source === "manual") return toResolved(cached);
    const isMiss = !cached.code;
    const stale =
      isMiss && Date.now() - cached.resolvedAt.getTime() > MISS_RETRY_MS;
    if (!stale) return toResolved(cached);
  }

  const resolved = await live(ref);

  await prisma.providerVehicleXref.upsert({
    where,
    create: {
      providerId,
      ccaVersionId: ref.catalogVersionId,
      code: resolved?.code ?? null,
      codeKind: resolved?.codeKind ?? "unknown",
      matchedLabel: resolved?.matchedLabel ?? null,
      confidence: resolved?.confidence ?? 0,
      source: "auto",
    },
    update: {
      code: resolved?.code ?? null,
      codeKind: resolved?.codeKind ?? "unknown",
      matchedLabel: resolved?.matchedLabel ?? null,
      confidence: resolved?.confidence ?? 0,
      source: "auto",
    },
  });

  return resolved;
}

// --- helpers de match por texto (los usan los liveResolver de cada proveedor) --

// Normaliza para comparar: mayusculas, sin acentos, sin puntuacion, 1 espacio.
export function normalizeLabel(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Alias de marca conocidos (CCA vs. catalogos de aseguradoras).
const BRAND_ALIASES: Record<string, string> = {
  VW: "VOLKSWAGEN",
  VOLKSWAGEN: "VOLKSWAGEN",
  "MERCEDES BENZ": "MERCEDES BENZ",
  "MERCEDES-BENZ": "MERCEDES BENZ",
  MERCEDESBENZ: "MERCEDES BENZ",
  CHEVROLET: "CHEVROLET",
  GM: "CHEVROLET",
};

export function canonicalBrand(s: string): string {
  const n = normalizeLabel(s);
  return BRAND_ALIASES[n] ?? n;
}

// Score 0-100 de solapamiento de tokens entre la version que eligio el usuario
// (CCA, ej. "5P 1,5 XS") y una fila del catalogo del proveedor (ej. "ETIOS 1.5
// 5 PTAS XS"). Sirve para elegir la mejor de varias versiones candidatas y para
// registrar la confianza del match.
export function versionMatchScore(userVersion: string, candidate: string): number {
  const canon = (s: string) =>
    normalizeLabel(s)
      .replace(/\bPTAS?\b/g, "P")
      .replace(/\bPUERTAS?\b/g, "P")
      .replace(/(\d)\s*P\b/g, "$1P")
      .replace(/,/g, ".")
      .split(" ")
      .filter(Boolean);

  const a = new Set(canon(userVersion));
  const b = new Set(canon(candidate));
  if (a.size === 0) return 0;

  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  return Math.round((hit / a.size) * 100);
}
