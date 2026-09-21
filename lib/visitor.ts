// Identidad anonima del navegador + ultimo vehiculo que estaba cotizando, ambos
// en localStorage. El visitorId viaja en el header x-visitor-id (ver
// lib/consult-session.ts) para poder agrupar consultas de una misma persona a
// lo largo de varias visitas; el snapshot alimenta el popup "retomar cotizacion"
// (components/shared/ReturningVisitorPrompt.tsx). Todo se envuelve en try/catch:
// localStorage puede no existir (modo privado, storage bloqueado).
const VISITOR_KEY = "gb-visitor-id";
const SNAPSHOT_KEY = "gb-last-vehicle";
const SNAPSHOT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function getVisitorId(): string | undefined {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export interface VehicleSnapshot {
  vehicleType: "Auto" | "Moto";
  brand: string;
  model: string;
  version?: string;
  year: string;
  postalCode?: string;
  hasGnc?: boolean;
  valueARS?: number;
  manual?: boolean;
  // Ids del catalogo, para restaurar los selects de Auto sin volver a elegir.
  // Modelo y version pueden faltar si se abandono el formulario a mitad.
  ids?: { brandId: number; modelId?: number; versionId?: number };
  // Id de la fila Consult (x-consult-session) de esta cotizacion, para que al
  // retomarla el servidor siga la misma fila en vez de crear otra.
  consultId?: string;
  // Paso del formulario en que estaba (ver Cotizador). Puede faltar en snapshots viejos.
  step?: number;
  savedAt: number;
}

export function saveSnapshot(snap: Omit<VehicleSnapshot, "savedAt">) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ ...snap, savedAt: Date.now() }));
  } catch {}
}

export function clearSnapshot() {
  try {
    localStorage.removeItem(SNAPSHOT_KEY);
  } catch {}
}

// String crudo: lo consume useSyncExternalStore (que necesita un valor estable).
export function readSnapshotRaw(): string | null {
  try {
    return localStorage.getItem(SNAPSHOT_KEY);
  } catch {
    return null;
  }
}

export function parseSnapshot(raw: string | null): VehicleSnapshot | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as VehicleSnapshot;
    if (!s.vehicleType || !s.brand) return null;
    if (Date.now() - s.savedAt > SNAPSHOT_TTL_MS) return null;
    return s;
  } catch {
    return null;
  }
}
