// Cliente para Arg Autos API (https://argautos.com/docs/api), una API publica
// y gratuita de valuaciones del mercado automotor argentino. Sin ARGAUTOS_API_KEY
// el limite es de 3 req/min por IP; con una key gratuita sube a 15 req/min.
const ARGAUTOS_BASE_URL = "https://argautos.com/api/v1";

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

async function argautosFetch<T>(path: string, revalidateSeconds: number): Promise<T> {
  const apiKey = process.env.ARGAUTOS_API_KEY;
  const res = await fetch(`${ARGAUTOS_BASE_URL}${path}`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Arg Autos API: limite de pedidos alcanzado, intenta de nuevo en un minuto.");
    }
    throw new Error(`Arg Autos API respondio ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchVehicleBrands(): Promise<VehicleBrandOption[]> {
  const data = await argautosFetch<{ data: VehicleBrandOption[] }>("/brands", 60 * 60 * 24);
  return data.data
    .map((b) => ({ id: b.id, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchVehicleModels(
  brandId: number,
  year: number,
): Promise<VehicleModelOption[]> {
  const data = await argautosFetch<{ data: VehicleModelOption[] }>(
    `/brands/${brandId}/models?year=${year}&per_page=100`,
    60 * 60 * 24,
  );
  return data.data
    .map((m) => ({ id: m.id, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchVehicleVersions(
  modelId: number,
  year: number,
): Promise<VehicleVersionOption[]> {
  const data = await argautosFetch<{ data: VehicleVersionOption[] }>(
    `/models/${modelId}/versions?year=${year}&per_page=100`,
    60 * 60 * 24,
  );
  return data.data.map((v) => ({ id: v.id, name: v.name }));
}

export async function fetchVehicleValueARS(versionId: number, year: number): Promise<number> {
  const data = await argautosFetch<{ data: { price: string }[] }>(
    `/versions/${versionId}/valuations?currency=ARS&year=${year}`,
    60 * 60,
  );
  const price = Number(data.data[0]?.price);
  if (!price || Number.isNaN(price)) {
    throw new Error("Arg Autos API no devolvio un valor para esa version.");
  }
  return price;
}
