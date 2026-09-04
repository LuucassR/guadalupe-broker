// Adapter de Cooperación Seguros para el multicotizador. Implementa el contrato
// generico `QuoteProvider` (ver lib/quote-providers/types.ts). El nucleo no
// conoce este archivo salvo por la unica linea que lo registra en registry.ts.
//
// APIs (ambiente de testing de Cooperación Seguros):
//  - POST {base}/token                            -> Bearer (OAuth2 client_credentials)
//  - POST {base}/Presupuesto/Vehiculo/Localidades -> idLocalidad a partir del CP
//  - POST {base}/Presupuesto/Vehiculo/Cotizar     -> cotizacion
// Fuente: PDF "API-Servicios_Cotizacion_Suscripcion_v1.4" (Cotización/Suscripción
// de Vehículos, Cooperación Seguros). Tabla de mapeo en docs/quote-providers.md.
//
// Alcance: SOLO cotizacion de pre-venta (endpoint "Cotizar Vehículo", igual que
// el adapter de Sancor). La suscripcion / emision, carga de imagenes y beneficios
// adicionales del PDF quedan fuera: necesitan un tomador real y no encajan en el
// contrato `QuoteProvider`.
import { request as httpsRequest } from "node:https";
import type {
  QuoteInput,
  QuoteProvider,
  QuotePlan,
  ProviderQuoteResult,
} from "./types";
import { matchCoverageTier } from "./normalize";
import {
  resolveProviderVehicleCode,
  normalizeLabel,
  canonicalBrand,
  versionMatchScore,
  type LiveResolver,
} from "./vehicle-xref";

// Host verificado con las credenciales del broker (ESALES). El host `apipre.`
// que menciona el PDF las rechaza con 401: el ambiente "PRE" es un nivel de
// acceso, no un host distinto.
const DEFAULT_BASE_URL = "https://api.cooperacionseguros.com.ar";
const TOKEN_PATH = "/token";
const REQUEST_TIMEOUT_MS = 10_000;
const TOKEN_EXPIRY_MARGIN_MS = 60_000; // renovar 1 min antes del vencimiento

interface CooperacionConfig {
  baseUrl: string;
  clientId: string; // credencial OAuth2 (la da la Compania)
  clientSecret: string;
  authToken?: string; // Bearer pegado a mano (override para pruebas)
  tokenUrl: string;
  usuarioId: string; // "pwNNNNNN" del usuario consumidor del servicio
  producerCode: string; // CodigoProductor del broker
  razonSocial: string; // nombre con el que sale la cotizacion (anonima)
  nroDocumento: string; // DNI placeholder: es una cotizacion sin cliente
  email: string; // email con el que sale la cotizacion
  conditionCode: number; // CondicionFiscal — 5 = Consumidor Final
  useCode: number; // CodigoUso — 1 = Particular
}

// `enabled()` solo exige las credenciales OAuth2. El resto (usuarioId, productor,
// codigo de vehiculo, localidad) se valida en quote() y devuelve un ok:false
// explicativo si falta, sin tumbar al resto del batch.
function readConfig(): CooperacionConfig | null {
  const clientId = process.env.COOPERACION_CLIENT_ID;
  const clientSecret = process.env.COOPERACION_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const baseUrl = process.env.COOPERACION_API_BASE_URL || DEFAULT_BASE_URL;
  return {
    baseUrl,
    clientId,
    clientSecret,
    authToken: process.env.COOPERACION_API_AUTH_TOKEN || undefined,
    tokenUrl: process.env.COOPERACION_TOKEN_URL || `${baseUrl}${TOKEN_PATH}`,
    usuarioId: process.env.COOPERACION_USUARIO_ID || "",
    producerCode: process.env.COOPERACION_PRODUCER_CODE || "",
    razonSocial: process.env.COOPERACION_QUOTE_RAZON_SOCIAL || "Consulta Web",
    nroDocumento: process.env.COOPERACION_QUOTE_DOC || "11111111",
    email:
      process.env.COOPERACION_QUOTE_EMAIL ||
      "cotizaciones@guadalupebroker.com.ar",
    conditionCode: Number(process.env.COOPERACION_CONDITION_CODE) || 5,
    useCode: Number(process.env.COOPERACION_USE_CODE) || 1,
  };
}

// --- Token OAuth2 (client_credentials) -------------------------------------
// Cache en memoria del proceso: el token dura ~1h (expires_in).
let tokenCache: { header: string; expiresAt: number } | null = null;

interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

// Devuelve el valor listo para el header Authorization ("Bearer xxx"). Lanza si
// el endpoint de token responde error.
async function getAuthorizationHeader(
  config: CooperacionConfig,
): Promise<string> {
  if (config.authToken) return config.authToken; // override manual
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.header;

  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo generar el token de Cooperación (el servicio de token respondio ${res.status}).`,
    );
  }
  const data = (await res.json().catch(() => null)) as TokenResponse | null;
  if (!data?.access_token) {
    throw new Error(
      "El servicio de token de Cooperación no devolvio access_token.",
    );
  }

  const ttlMs = (data.expires_in ?? 3600) * 1000;
  const header = `Bearer ${data.access_token}`;
  tokenCache = {
    header,
    expiresAt: Date.now() + ttlMs - TOKEN_EXPIRY_MARGIN_MS,
  };
  return header;
}

// --- GET con body -----------------------------------------------------------
// Cooperación expone `/Localidades` (y el catalogo de vehiculos) como GET *con
// body JSON*. fetch()/undici prohiben GET con body, asi que para esas llamadas
// usamos node:https, que lo permite mientras el Content-Length viaje explicito.
function getJsonWithBody<T>(
  url: string,
  authorization: string,
  payload: unknown,
): Promise<{ status: number; data: T | null }> {
  const body = Buffer.from(JSON.stringify(payload));
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
          Accept: "application/json",
          Authorization: authorization,
        },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          let data: T | null = null;
          try {
            data = raw ? (JSON.parse(raw) as T) : null;
          } catch {
            data = null;
          }
          resolve({ status: res.statusCode ?? 0, data });
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("timeout de Cooperación")));
    req.end(body);
  });
}

// --- Localidades: CP -> idLocalidad (obligatorio para cotizar) --------------
interface LocalidadRow {
  idLocalidad?: number;
  localidad?: string;
  codigoPostal?: string;
  provincia?: string;
}

// `Cotizar` exige `IdLocalidad` y solo sale del servicio de Localidades. Si el
// que llama ya lo resolvio, lo pasa por providerCodes y nos ahorramos la vuelta.
async function resolveIdLocalidad(
  config: CooperacionConfig,
  authorization: string,
  postalCode: string,
  override?: number,
): Promise<number | null> {
  if (override && Number.isFinite(override)) return override;

  const { status, data } = await getJsonWithBody<
    LocalidadRow[] | { localidades?: LocalidadRow[] }
  >(`${config.baseUrl}/Presupuesto/Vehiculo/Localidades`, authorization, {
    CodigoPostal: String(postalCode),
    UsuarioId: config.usuarioId,
  });
  if (status < 200 || status >= 300 || !data) return null;

  const list = Array.isArray(data) ? data : (data.localidades ?? []);
  return list.find((r) => r.idLocalidad != null)?.idLocalidad ?? null;
}

// --- GNC: si PoseeGNC=true, CodigoGnc TIENE que ser un código válido de la
// tabla de Cooperación. Mandar 0 -> "codigo de GNC Incorrecto: 0". Traemos la
// lista y elegimos un default razonable (2da generación si está). Cacheada por
// proceso: la tabla es estática.
interface GncRow {
  codigo?: number;
  valor?: number;
  detalle?: string;
}
let gncCache: number | null | undefined;

async function resolveCodigoGnc(
  config: CooperacionConfig,
  authorization: string,
): Promise<number | null> {
  if (gncCache !== undefined) return gncCache;

  const { status, data } = await getJsonWithBody<
    GncRow[] | { gnc?: GncRow[] }
  >(`${config.baseUrl}/Presupuesto/Vehiculo/Gnc`, authorization, {
    UsuarioId: config.usuarioId,
  });
  const list = Array.isArray(data) ? data : (data?.gnc ?? []);
  const rows = list.filter((r) => Number(r.codigo) > 0);
  if (status < 200 || status >= 300 || rows.length === 0) {
    gncCache = null;
    return null;
  }
  const pick =
    rows.find((r) => /\b2\b|2da|2ª|segunda/i.test(r.detalle ?? "")) ?? rows[0];
  gncCache = Number(pick.codigo);
  return gncCache;
}

// --- Respuesta de Cooperación (subset de lo que consumimos) ----------------
// El PDF documenta las claves en dos casings (tabla vs. ejemplo); leemos ambos.
interface CooperacionQuoteRow {
  planCobertura?: string;
  plancobertura?: string;
  detalleCobertura?: string;
  detallecobertura?: string;
  valorVehiculo?: number;
  premio?: number; // premio del periodo (cuatrimestral, meses = 4)
  premioMensual?: number;
  franquicia?: number;
  servicioGrua?: boolean;
  serviciogrua?: boolean;
  topeKmsGrua?: string;
}

interface CooperacionResponse {
  cotizacionesAutomotor?: CooperacionQuoteRow[];
  Cotizacionesautomotor?: CooperacionQuoteRow[];
  mensaje?: string;
  Mensaje?: string;
  message?: string;
}

type VehicleId = {
  key: "CodigoVehiculoCMP" | "CodigoInfoAuto";
  value: number;
};

// --- Catalogo de vehiculos de Cooperación: brand/model/version -> CMP ------
// Cadena `Tipos -> Marcas -> Modelos -> Versiones` (todos GET con querystring,
// bajo `/Vehiculo/*`, NO `/Presupuesto/Vehiculo/*`). Devuelve el
// `codigoVehiculoCMP` de la version que mejor matchea el auto que eligio el
// usuario en nuestro catalogo CCA. El resultado lo cachea (y reintenta) la capa
// generica de vehicle-xref.ts — aca solo esta el walk especifico de Cooperación.
interface TipoEntity {
  codigoTipoVehiculo?: string;
  descripcion?: string;
}
interface CatalogEntity {
  id?: number;
  codigo?: string;
  descripcion?: string;
}
interface VersionEntity {
  modelo?: string;
  codigoVehiculoCMP?: number;
}

async function catalogGet<T>(
  config: CooperacionConfig,
  authorization: string,
  path: string,
): Promise<T[]> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: authorization },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) return [];
  const data = (await res.json().catch(() => null)) as {
    entities?: T[];
  } | null;
  return data?.entities ?? [];
}

// `/Vehiculo/Tipos` es estatico: lo cacheamos por proceso y tipo de vehiculo.
const tipoCache = new Map<string, string | null>();

async function resolveTipo(
  config: CooperacionConfig,
  authorization: string,
  vehicleType: "Auto" | "Moto",
): Promise<string | null> {
  const key = `${config.baseUrl}:${vehicleType}`;
  const memo = tipoCache.get(key);
  if (memo !== undefined) return memo;

  const rows = await catalogGet<TipoEntity>(
    config,
    authorization,
    "/Vehiculo/Tipos",
  );
  const want = vehicleType === "Moto" ? "MOTO" : "AUTOMOVIL";
  const hit =
    rows.find((r) => normalizeLabel(r.descripcion ?? "") === want) ??
    rows.find((r) => normalizeLabel(r.descripcion ?? "").includes(want));
  const code = hit?.codigoTipoVehiculo ?? null;
  tipoCache.set(key, code);
  return code;
}

async function resolveMarca(
  config: CooperacionConfig,
  authorization: string,
  tipo: string,
  brand: string,
): Promise<string | null> {
  const target = canonicalBrand(brand);
  const q = target.replace(/[^A-Z0-9]/g, "").slice(0, 3);
  let rows = await catalogGet<CatalogEntity>(
    config,
    authorization,
    `/Vehiculo/Marcas?codigoTipoVehiculo=${tipo}&marca=${encodeURIComponent(q)}`,
  );
  if (rows.length === 0) {
    rows = await catalogGet<CatalogEntity>(
      config,
      authorization,
      `/Vehiculo/Marcas?codigoTipoVehiculo=${tipo}`,
    );
  }
  const exact = rows.find((r) => canonicalBrand(r.descripcion ?? "") === target);
  const partial = rows.find(
    (r) =>
      canonicalBrand(r.descripcion ?? "").includes(target) ||
      target.includes(canonicalBrand(r.descripcion ?? "")),
  );
  return (exact ?? partial)?.codigo ?? null;
}

async function resolveModelo(
  config: CooperacionConfig,
  authorization: string,
  tipo: string,
  codigoMarca: string,
  model: string,
): Promise<number | null> {
  const target = normalizeLabel(model);
  const q = target.split(" ")[0]?.slice(0, 12) ?? "";
  const base = `/Vehiculo/Modelos?codigoMarca=${codigoMarca}&codigoTipoVehiculo=${tipo}`;
  let rows = await catalogGet<CatalogEntity>(
    config,
    authorization,
    q.length >= 3 ? `${base}&modelo=${encodeURIComponent(q)}` : base,
  );
  if (rows.length === 0 && q.length >= 3) {
    rows = await catalogGet<CatalogEntity>(config, authorization, base);
  }
  const exact = rows.find((r) => normalizeLabel(r.descripcion ?? "") === target);
  if (exact?.id != null) return exact.id;
  // mejor coincidencia parcial: la que comparte mas tokens con el modelo pedido
  const wanted = new Set(target.split(" ").filter(Boolean));
  let best: { id: number; score: number } | null = null;
  for (const r of rows) {
    if (r.id == null) continue;
    const toks = normalizeLabel(r.descripcion ?? "")
      .split(" ")
      .filter(Boolean);
    if (toks.length === 0) continue;
    const hit = toks.filter((t) => wanted.has(t)).length;
    const score = hit / Math.max(wanted.size, toks.length);
    if (score > 0 && (!best || score > best.score))
      best = { id: r.id, score };
  }
  return best?.id ?? null;
}

async function resolveVersionCMP(
  config: CooperacionConfig,
  authorization: string,
  tipo: string,
  codigoMarca: string,
  idModelo: number,
  version: string | undefined,
): Promise<{ cmp: number; label: string; score: number } | null> {
  const rows = (
    await catalogGet<VersionEntity>(
      config,
      authorization,
      `/Vehiculo/Versiones?CodigoTipoVehiculo=${tipo}&CodigoMarca=${codigoMarca}&IdModelo=${idModelo}`,
    )
  ).filter((r) => Number(r.codigoVehiculoCMP) > 0 && r.modelo);

  if (rows.length === 0) return null;
  if (rows.length === 1) {
    return {
      cmp: Number(rows[0].codigoVehiculoCMP),
      label: rows[0].modelo ?? "",
      score: version ? versionMatchScore(version, rows[0].modelo ?? "") : 40,
    };
  }
  if (!version) {
    // sin version no podemos desambiguar: primera opcion, confianza minima
    return { cmp: Number(rows[0].codigoVehiculoCMP), label: rows[0].modelo ?? "", score: 10 };
  }
  let best: { cmp: number; label: string; score: number } | null = null;
  for (const r of rows) {
    const score = versionMatchScore(version, r.modelo ?? "");
    if (!best || score > best.score)
      best = {
        cmp: Number(r.codigoVehiculoCMP),
        label: r.modelo ?? "",
        score,
      };
  }
  return best;
}

// LiveResolver para vehicle-xref.ts: hace la cadena completa del catalogo.
function makeLiveResolver(config: CooperacionConfig): LiveResolver {
  return async (ref) => {
    const authorization = await getAuthorizationHeader(config);
    const tipo = await resolveTipo(config, authorization, ref.vehicleType);
    if (!tipo) return null;
    const codigoMarca = await resolveMarca(
      config,
      authorization,
      tipo,
      ref.brand,
    );
    if (!codigoMarca) return null;
    const idModelo = await resolveModelo(
      config,
      authorization,
      tipo,
      codigoMarca,
      ref.model,
    );
    if (idModelo == null) return null;
    const match = await resolveVersionCMP(
      config,
      authorization,
      tipo,
      codigoMarca,
      idModelo,
      ref.version,
    );
    if (!match) return null;
    return {
      code: String(match.cmp),
      codeKind: "codigoVehiculoCMP",
      matchedLabel: match.label,
      confidence: match.score,
    };
  };
}

function buildBody(
  config: CooperacionConfig,
  input: QuoteInput,
  vehicleId: VehicleId,
  idLocalidad: number,
  codigoGnc: number,
  valorVehiculo: number, // 0 = no mandarlo (Cooperación usa su propia tabla)
) {
  return {
    idAplicacion: "",
    UsuarioId: config.usuarioId,
    RazonSocial: config.razonSocial,
    // "Enviar uno u otro pero nunca ambos": mandamos NroDocumento, no cuitCuil.
    NroDocumento: Number(config.nroDocumento),
    Email: config.email,
    CodigoProductor: config.producerCode,
    CondicionFiscal: config.conditionCode,
    Categoria: 0, // "colocar 0 por el momento" (PDF)
    // "Enviar uno u otro pero nunca ambos": CodigoVehiculoCMP o CodigoInfoAuto.
    [vehicleId.key]: vehicleId.value,
    CodigoUso: config.useCode,
    IdLocalidad: idLocalidad,
    CodigoPostal: String(input.postalCode), // la API lo valida como string
    Anio: input.year,
    // El PDF marca ValorVehiculo como "Deprecado". En la práctica, si Cooperación
    // NO tiene valor para ese CMP+año devuelve sólo el plan "A" (RC) con
    // valorVehiculo: 0; mandar nuestro valor destraba el resto de las coberturas.
    // Pero si nuestro valor difiere mucho del suyo, rechaza el pedido entero
    // ("La suma ingresada es superior al máximo permitido"). Por eso quote()
    // primero pide SIN este campo y sólo reintenta CON él si hizo falta.
    ...(valorVehiculo > 0
      ? { ValorVehiculo: Math.round(valorVehiculo) }
      : {}),
    // Sólo declaramos GNC si tenemos un código válido: con PoseeGNC=true y
    // CodigoGnc<=0 Cooperación rechaza todo el pedido ("codigo de GNC Incorrecto").
    PoseeGNC: input.hasGnc && codigoGnc > 0,
    CodigoGnc: codigoGnc > 0 ? codigoGnc : 0,
    CotizaAP: false, // no cotizamos Accidentes a Pasajeros
    CantidadMeses: 4, // obligatorio 4 — facturacion cuatrimestral
    GrabarPresupuesto: false, // solo cotizamos, no suscribimos
    AplicarMaxDescuentos: true,
  };
}

function mapPlans(rows: CooperacionQuoteRow[]): QuotePlan[] {
  return rows.map((r, i) => {
    const planCode = r.planCobertura ?? r.plancobertura ?? String(i);
    const rawName =
      r.detalleCobertura ?? r.detallecobertura ?? `Plan ${planCode}`;
    const franquicia = r.franquicia ?? 0;
    const grua = r.servicioGrua ?? r.serviciogrua ?? false;

    const notes = ["Premio cuatrimestral (4 meses)"];
    if (franquicia > 0) {
      notes.push(
        `franquicia $${Math.round(franquicia).toLocaleString("es-AR")}`,
      );
    }
    if (grua && r.topeKmsGrua) notes.push(`grúa ${r.topeKmsGrua}`);

    return {
      planId: String(planCode),
      planName: rawName,
      coverage: matchCoverageTier(planCode, rawName),
      coverageRawName: rawName,
      monthlyPremium: r.premioMensual ?? null,
      totalPremium: r.premio ?? null,
      insuredSumARS: r.valorVehiculo ?? null,
      currency: "ARS",
      notes: notes.join(" · "),
    };
  });
}

export const cooperacionProvider: QuoteProvider = {
  id: "cooperacion",
  name: "Cooperación Seguros",

  enabled() {
    return readConfig() !== null;
  },

  async quote(input: QuoteInput): Promise<ProviderQuoteResult> {
    const base = {
      providerId: "cooperacion",
      providerName: "Cooperación Seguros",
    };

    const config = readConfig();
    if (!config) {
      return {
        ...base,
        ok: false,
        plans: [],
        error:
          "Cooperación no esta configurado (faltan COOPERACION_CLIENT_ID / COOPERACION_CLIENT_SECRET).",
      };
    }
    if (!config.usuarioId || !config.producerCode) {
      return {
        ...base,
        ok: false,
        plans: [],
        error:
          "Faltan datos del broker para cotizar en Cooperación (COOPERACION_USUARIO_ID y/o COOPERACION_PRODUCER_CODE).",
      };
    }

    // Codigo del vehiculo. Orden de resolucion:
    //  1. override explicito en `providerCodes.cooperacion` (CMP o Infoauto)
    //  2. cross-reference persistente contra el catalogo de Cooperación a
    //     partir de `catalogVersionId` (ver lib/quote-providers/vehicle-xref.ts)
    const codes = input.providerCodes?.cooperacion ?? {};
    const cmp = Number(codes.codigoVehiculoCMP ?? codes.codigoVehiculoCmp ?? 0);
    const infoauto = Number(codes.codigoInfoAuto ?? codes.codigoInfoauto ?? 0);
    let vehicleId: VehicleId | null =
      cmp > 0
        ? { key: "CodigoVehiculoCMP", value: cmp }
        : infoauto > 0
          ? { key: "CodigoInfoAuto", value: infoauto }
          : null;

    if (!vehicleId && input.catalogVersionId) {
      const resolved = await resolveProviderVehicleCode(
        "cooperacion",
        {
          catalogVersionId: input.catalogVersionId,
          vehicleType: input.vehicleType,
          brand: input.brand,
          model: input.model,
          version: input.version,
          year: input.year,
        },
        makeLiveResolver(config),
      );
      if (resolved && Number(resolved.code) > 0) {
        vehicleId = {
          key:
            resolved.codeKind === "codigoInfoAuto"
              ? "CodigoInfoAuto"
              : "CodigoVehiculoCMP",
          value: Number(resolved.code),
        };
      }
    }

    if (!vehicleId) {
      return {
        ...base,
        ok: false,
        plans: [],
        error: input.catalogVersionId
          ? "No encontramos este vehículo en el catálogo de Cooperación."
          : "Falta el codigo de vehiculo de Cooperación (providerCodes.cooperacion.codigoVehiculoCMP / codigoInfoAuto, o catalogVersionId).",
      };
    }

    const authorization = await getAuthorizationHeader(config);

    const idLocalidad = await resolveIdLocalidad(
      config,
      authorization,
      input.postalCode,
      codes.idLocalidad != null ? Number(codes.idLocalidad) : undefined,
    );
    if (!idLocalidad) {
      return {
        ...base,
        ok: false,
        plans: [],
        error: `Cooperación no devolvio ninguna localidad para el CP ${input.postalCode} (o pasá providerCodes.cooperacion.idLocalidad).`,
      };
    }

    // GNC: código explícito si vino por providerCodes; si no y el usuario marcó
    // "tiene GNC", lo resolvemos contra la tabla de Cooperación. Si no se puede
    // resolver, se cotiza sin GNC (mejor que romper todo el pedido).
    let codigoGnc = codes.codigoGnc != null ? Number(codes.codigoGnc) : 0;
    if (input.hasGnc && codigoGnc <= 0) {
      codigoGnc = (await resolveCodigoGnc(config, authorization)) ?? 0;
    }

    // Pide una cotización con el `valorVehiculo` dado (0 = no mandar el campo).
    // Devuelve {status, data} o lanza si la request de red falla.
    const cotizar = async (valorVehiculo: number) => {
      const res = await fetch(
        `${config.baseUrl}/Presupuesto/Vehiculo/Cotizar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify(
            buildBody(
              config,
              input,
              vehicleId,
              idLocalidad,
              codigoGnc,
              valorVehiculo,
            ),
          ),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );
      const data =
        res.status === 204
          ? null
          : ((await res.json().catch(() => null)) as CooperacionResponse | null);
      const rows =
        data?.cotizacionesAutomotor ?? data?.Cotizacionesautomotor ?? [];
      return { ok: res.ok, status: res.status, data, rows };
    };

    // 1) Sin ValorVehiculo: Cooperación usa su propia tabla (sin riesgo de que
    //    rechace el pedido por "suma superior al máximo").
    let attempt = await cotizar(0);

    // 2) Si sólo trajo el plan RC porque no tenía valor propio, reintentar con
    //    nuestro valor (CCA/DNRPA) para destrabar el resto de las coberturas.
    //    Si ese reintento falla (valor fuera de rango, etc.), nos quedamos con
    //    lo del paso 1.
    const needsValue =
      attempt.ok &&
      attempt.rows.length <= 1 &&
      !attempt.rows.some((r) => (r.valorVehiculo ?? 0) > 0) &&
      input.vehicleValueARS > 0;
    if (needsValue) {
      const retry = await cotizar(input.vehicleValueARS);
      if (retry.ok && retry.rows.length > attempt.rows.length) attempt = retry;
    }

    if (!attempt.ok) {
      const d = attempt.data;
      const msg =
        d?.mensaje ??
        d?.Mensaje ??
        d?.message ??
        `Cooperación respondio ${attempt.status}`;
      throw new Error(
        typeof msg === "string"
          ? msg
          : `Cooperación respondio ${attempt.status}`,
      );
    }

    return {
      ...base,
      ok: true,
      plans: mapPlans(attempt.rows),
      raw: attempt.data,
    };
  },
};
