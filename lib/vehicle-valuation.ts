// Fuente de valuaciones de autos: catalogo propio armado con la Lista de
// Precios oficial de la CCA (Camara del Comercio Automotor), importada una
// vez por mes por scripts/import-cca-catalog.ts (ver ese archivo y
// docs/vehicle-valuation.md para como correr el import y como migrar a otra
// fuente de datos mas adelante). Los precios de la CCA estan en USD; se
// convierten a ARS aca mismo con la cotizacion oficial del dia (Bluelytics).
//
// Reemplaza a Arg Autos API: esa API tenia un limite de 3 pedidos/min sin key
// que el flujo de cotizacion (4 llamados seguidos: marcas, modelos, versiones,
// valor) superaba con un solo usuario.
import { prisma } from "@/lib/prisma";

const CATALOG_CACHE_KEY = "cca:catalog";
const LEGACY_CACHE_KEY = "dnrpa:catalog"; // años < 2012, ver scripts/import-dnrpa-catalog.ts
const FX_CACHE_KEY = "fx:usd-ars";
const FX_TTL_MS = 60 * 60 * 1000; // 1 hora, igual que hacia Arg Autos con Bluelytics

// La CCA sólo publica año-modelo 2012+. Para autos más viejos usamos la tabla de
// valuación de la DNRPA (valor FISCAL, ver import-dnrpa-catalog.ts). El front lo
// rotula como "valor fiscal de referencia".
export const LEGACY_MAX_YEAR = 2011;
export const isLegacyYear = (year: number) =>
  year >= 2002 && year <= LEGACY_MAX_YEAR;

export interface VehicleBrandOption {
  id: number;
  name: string;
}

export interface VehicleModelOption {
  id: number;
  name: string;
}

export interface VehicleVersionOption {
  id: number;
  name: string;
}

interface CatalogVersion {
  id: number;
  name: string;
  valuationsUSD: Record<string, number>; // clave = anio ("2024") o "0km"
}

interface CatalogModel {
  id: number;
  name: string;
  versions: CatalogVersion[];
}

interface CatalogBrand {
  id: number;
  name: string;
  models: CatalogModel[];
}

// Catálogo DNRPA (años < 2012). No tiene nivel "versión": el "modelo" ya es la
// granularidad de versión, y el valor viene en ARS (sin conversión).
interface LegacyModel {
  id: number;
  name: string;
  valuationsARS: Record<string, number>;
}
interface LegacyBrand {
  id: number;
  name: string;
  models: LegacyModel[];
}

// Cache en memoria del proceso para no pegarle a Postgres en cada request de
// un mismo flujo de cotizacion (marcas -> modelos -> versiones -> valor).
let catalogMemo: { brands: CatalogBrand[]; loadedAt: number } | null = null;
const CATALOG_MEMO_TTL_MS = 5 * 60 * 1000;

async function loadCatalog(): Promise<CatalogBrand[]> {
  if (catalogMemo && Date.now() - catalogMemo.loadedAt < CATALOG_MEMO_TTL_MS) {
    return catalogMemo.brands;
  }
  const row = await prisma.vehicleCatalogCache.findUnique({ where: { key: CATALOG_CACHE_KEY } });
  if (!row) {
    throw new Error(
      "Todavia no se importo el catalogo de autos. Correr `npm run import:cca` (ver docs/vehicle-valuation.md).",
    );
  }
  const brands = row.payload as unknown as CatalogBrand[];
  catalogMemo = { brands, loadedAt: Date.now() };
  return brands;
}

let legacyMemo: { brands: LegacyBrand[]; loadedAt: number } | null = null;

async function loadLegacyCatalog(): Promise<LegacyBrand[]> {
  if (legacyMemo && Date.now() - legacyMemo.loadedAt < CATALOG_MEMO_TTL_MS) {
    return legacyMemo.brands;
  }
  const row = await prisma.vehicleCatalogCache.findUnique({
    where: { key: LEGACY_CACHE_KEY },
  });
  if (!row) {
    throw new Error(
      "Todavia no se importo la tabla DNRPA (autos < 2012). Correr `npm run import:dnrpa`.",
    );
  }
  const brands = row.payload as unknown as LegacyBrand[];
  legacyMemo = { brands, loadedAt: Date.now() };
  return brands;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();

async function legacyBrandByAnyId(id: number): Promise<LegacyBrand | undefined> {
  const [cca, legacy] = await Promise.all([loadCatalog(), loadLegacyCatalog()]);
  const direct = legacy.find((b) => b.id === id);
  if (direct) return direct;
  const ccaName = cca.find((b) => b.id === id)?.name;
  if (!ccaName) return undefined;
  return legacy.find((b) => norm(b.name) === norm(ccaName));
}

async function getUsdArsRate(): Promise<number> {
  const cached = await prisma.vehicleCatalogCache.findUnique({ where: { key: FX_CACHE_KEY } });
  if (cached && cached.expiresAt > new Date()) {
    return (cached.payload as { rate: number }).rate;
  }

  const res = await fetch("https://api.bluelytics.com.ar/v2/latest");
  if (!res.ok) {
    if (cached) return (cached.payload as { rate: number }).rate; // dato viejo es mejor que nada
    throw new Error(`No se pudo obtener la cotizacion USD/ARS (Bluelytics respondio ${res.status}).`);
  }
  const data = (await res.json()) as { oficial: { value_sell: number } };
  const rate = data.oficial.value_sell;

  await prisma.vehicleCatalogCache.upsert({
    where: { key: FX_CACHE_KEY },
    create: { key: FX_CACHE_KEY, payload: { rate }, expiresAt: new Date(Date.now() + FX_TTL_MS) },
    update: { payload: { rate }, expiresAt: new Date(Date.now() + FX_TTL_MS) },
  });
  return rate;
}

export async function fetchVehicleBrands(): Promise<VehicleBrandOption[]> {
  // Unión de marcas CCA (2012+) y DNRPA (< 2012). Se elige antes que el año, así
  // que mostramos las de ambos catálogos; si una marca no tiene modelos para el
  // año elegido, el paso siguiente queda vacío y cae al "no encuentro mi auto".
  const [cca, legacy] = await Promise.all([
    loadCatalog(),
    loadLegacyCatalog().catch(() => [] as LegacyBrand[]),
  ]);
  const byName = new Map<string, VehicleBrandOption>();
  for (const b of cca) byName.set(norm(b.name), { id: b.id, name: b.name });
  for (const b of legacy)
    if (!byName.has(norm(b.name)))
      byName.set(norm(b.name), { id: b.id, name: b.name });
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchVehicleModels(
  brandId: number,
  year: number,
): Promise<VehicleModelOption[]> {
  const yearKey = String(year);

  if (isLegacyYear(year)) {
    const brand = await legacyBrandByAnyId(brandId);
    if (!brand) return [];
    return brand.models
      .filter((m) => m.valuationsARS[yearKey] !== undefined)
      .map((m) => ({ id: m.id, name: m.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const brands = await loadCatalog();
  const brand = brands.find((b) => b.id === brandId);
  if (!brand) return [];
  return brand.models
    .filter((m) => m.versions.some((v) => v.valuationsUSD[yearKey] !== undefined))
    .map((m) => ({ id: m.id, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchVehicleVersions(
  modelId: number,
  year: number,
): Promise<VehicleVersionOption[]> {
  // El catálogo DNRPA no tiene nivel "versión" — el modelo ya lo es. El front
  // saltea este paso para años < 2012.
  if (isLegacyYear(year)) return [];

  const brands = await loadCatalog();
  const yearKey = String(year);
  for (const brand of brands) {
    const model = brand.models.find((m) => m.id === modelId);
    if (!model) continue;
    return model.versions
      .filter((v) => v.valuationsUSD[yearKey] !== undefined)
      .map((v) => ({ id: v.id, name: v.name }));
  }
  return [];
}

export async function fetchVehicleValueARS(
  versionId: number,
  year: number,
): Promise<number> {
  const yearKey = String(year);

  if (isLegacyYear(year)) {
    // `versionId` en años < 2012 es el id del modelo DNRPA (el front usa el
    // mismo id porque no hay paso de versión). Valor ya en ARS.
    const legacy = await loadLegacyCatalog();
    for (const brand of legacy) {
      const model = brand.models.find((m) => m.id === versionId);
      if (!model) continue;
      const valueARS = model.valuationsARS[yearKey];
      if (valueARS === undefined) {
        throw new Error(
          "La tabla DNRPA no tiene un valor para ese modelo en ese año.",
        );
      }
      return Math.round(valueARS);
    }
    throw new Error("Modelo no encontrado en la tabla DNRPA.");
  }

  const brands = await loadCatalog();
  for (const brand of brands) {
    for (const model of brand.models) {
      const version = model.versions.find((v) => v.id === versionId);
      if (!version) continue;
      const priceUSD = version.valuationsUSD[yearKey];
      if (priceUSD === undefined) {
        throw new Error("El catalogo no tiene un valor para esa version en ese anio.");
      }
      const rate = await getUsdArsRate();
      return Math.round(priceUSD * rate);
    }
  }
  throw new Error("Version de vehiculo no encontrada en el catalogo.");
}
