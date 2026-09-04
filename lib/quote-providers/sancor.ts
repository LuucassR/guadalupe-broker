// Adapter de Sancor Seguros para el multicotizador. Implementa el contrato
// generico `QuoteProvider` (ver lib/quote-providers/types.ts). El nucleo no
// conoce este archivo salvo por la unica linea que lo registra en registry.ts.
//
// APIs (ambiente PRE de Grupo Sancor):
//  - POST {base}/v2/security/auth0/token       -> genera el Bearer (TokenGenerator-V2)
//  - POST {base}/quotations/vehicle/automotive -> cotizacion
// Contratos en docs/specs/sancor-*.json y la tabla de mapeo en docs/quote-providers.md.
import type {
  QuoteInput,
  QuoteProvider,
  QuotePlan,
  ProviderQuoteResult,
} from "./types";
import { matchCoverageTier } from "./normalize";

const DEFAULT_BASE_URL =
  "https://external-pre-api.gruposancorseguros.com/apissa/pre-catalog";
const TOKEN_PATH = "/v2/security/auth0/token";
const REQUEST_TIMEOUT_MS = 8000;
const TOKEN_EXPIRY_MARGIN_MS = 60_000; // renovar 1 min antes del vencimiento

interface SancorConfig {
  baseUrl: string;
  clientId: string; // "Clave" del portal -> header gss_apiclient_id / X-IBM-Client-Id
  clientSecret?: string; // "Secreto" del portal -> header gss_apiclient_secret / X-IBM-Client-Secret
  authToken?: string; // Bearer pegado a mano (override para pruebas)
  tokenUrl: string; // endpoint de TokenGenerator-V2
  intermediaryUser?: string; // usuario del intermediario (lo crea la Compania)
  intermediaryPassword?: string;
  appClient: string; // TokenGenerateRequest.app_client (nombre de la app del portal)
  producerCode?: string;
  organizerCode?: string;
  statisticCode?: string;
  productCode: number;
  currencyCode: number;
  coverModuleCodes: number[];
}

// Unico requisito para considerar el proveedor "configurado" es la Clave. El
// token y los codigos de negocio se validan por separado en quote() y devuelven
// un ok:false explicativo si faltan.
function readConfig(): SancorConfig | null {
  const clientId = process.env.SANCOR_API_CLIENT_ID;
  if (!clientId) return null;

  const baseUrl = process.env.SANCOR_API_BASE_URL || DEFAULT_BASE_URL;
  return {
    baseUrl,
    clientId,
    clientSecret: process.env.SANCOR_API_CLIENT_SECRET || undefined,
    authToken: process.env.SANCOR_API_AUTH_TOKEN || undefined,
    tokenUrl: process.env.SANCOR_TOKEN_URL || `${baseUrl}${TOKEN_PATH}`,
    intermediaryUser: process.env.SANCOR_INTERMEDIARY_USER || undefined,
    intermediaryPassword: process.env.SANCOR_INTERMEDIARY_PASSWORD || undefined,
    // "repositorio" del token Auth0 (TokenGenerateRequest.app_client). NO es el
    // nombre de la app del portal; es un identificador del lado de Sancor.
    // "Ceibo" es el unico valor que probamos que llega a Auth0 (ver docs).
    appClient: process.env.SANCOR_APP_CLIENT || "Ceibo",
    producerCode: process.env.SANCOR_PRODUCER_CODE || undefined,
    organizerCode: process.env.SANCOR_ORGANIZER_CODE || undefined,
    statisticCode: process.env.SANCOR_STATISTIC_CODE || undefined,
    productCode: Number(process.env.SANCOR_PRODUCT_CODE) || 24,
    currencyCode: Number(process.env.SANCOR_CURRENCY_CODE) || 1,
    coverModuleCodes: (process.env.SANCOR_COVER_MODULE_CODES || "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0),
  };
}

// --- Token Auth0 (TokenGenerator-V2) ----------------------------------------
// Cache en memoria del proceso: el token dura ~1h (expires_in).
let tokenCache: { header: string; expiresAt: number } | null = null;

interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

// Devuelve el valor listo para el header Authorization ("Bearer xxx"), o null si
// no hay con que generarlo. Lanza si el endpoint responde error.
async function getAuthorizationHeader(
  config: SancorConfig,
): Promise<string | null> {
  if (config.authToken) return config.authToken; // override manual
  if (!config.intermediaryUser || !config.intermediaryPassword) return null;

  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.header;

  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      gss_apiclient_id: config.clientId,
      "X-IBM-Client-Id": config.clientId,
    },
    body: JSON.stringify({
      username: config.intermediaryUser,
      password: config.intermediaryPassword,
      app_client: config.appClient,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo generar el token de Sancor (TokenGenerator respondio ${res.status}).`,
    );
  }
  const data = (await res.json().catch(() => null)) as TokenResponse | null;
  if (!data?.access_token) {
    throw new Error("TokenGenerator de Sancor no devolvio access_token.");
  }

  const ttlMs = (data.expires_in ?? 3600) * 1000;
  const header = `Bearer ${data.access_token}`;
  tokenCache = {
    header,
    expiresAt: Date.now() + ttlMs - TOKEN_EXPIRY_MARGIN_MS,
  };
  return header;
}

// --- Respuesta de Sancor (subset de lo que consumimos) -----------------------
interface SancorPlan {
  module?: {
    coverageCode?: number;
    coverageName?: string;
    coverageAbbreviatedName?: string;
    message?: string;
    observations?: string;
  };
  quotaPremiumMonthly?: number;
  premium?: number;
  vehicleInsuredSum?: number;
  premiumTotals?: { quotaAmount?: number; quotationPremium?: number };
}

interface SancorResponse {
  vehicleQuotation?: { quotationCode?: number; plans?: SancorPlan[] };
  messages?: { status?: string; code?: string; text?: string; help?: string }[];
}

function buildBody(
  config: SancorConfig,
  input: QuoteInput,
  vehicleCode: string,
  cityCode?: number,
) {
  const now = new Date();
  const oneYear = new Date(now);
  oneYear.setFullYear(oneYear.getFullYear() + 1);

  return {
    vehicleQuotation: {
      // Sin SANCOR_COVER_MODULE_CODES no mandamos el campo: Sancor cotiza todos
      // los modulos del producto. Con la lista, filtramos a esos offeringCode.
      ...(config.coverModuleCodes.length > 0
        ? {
            coverModuleCodes: config.coverModuleCodes.map((offeringCode) => ({
              offeringCode,
            })),
          }
        : {}),
      currencyCode: config.currencyCode,
      policyPeriodStartEffectiveDate: now.toISOString(),
      policyPeriodEndEffectiveDate: oneYear.toISOString(),
      conditionCode: 4, // Consumidor Final
      // `intermediary` solo si tenemos los codigos del broker. Si no, se omite
      // y Sancor deberia tomar el intermediario del usuario del token.
      ...(config.producerCode && config.organizerCode
        ? {
            intermediary: {
              prodProducerCode: Number(config.producerCode),
              upperProducerCode: Number(config.organizerCode),
              ...(config.statisticCode
                ? { statisticCode: Number(config.statisticCode) }
                : {}),
            },
          }
        : {}),
      policyVigencyCode: 1, // Anual
      policyPaymentPeriodicityCode: 5, // Mensual
      policyQuotas: 1,
      productCode: config.productCode,
      zone: {
        postalCode: Number(input.postalCode),
        ...(cityCode ? { cityCode } : {}),
      },
      vehicle: {
        vehicleCode,
        vehicleYear: input.year,
        yearSuggestedValue: input.vehicleValueARS,
        vehicleUseTypeCode: 2, // Particular
        vehicleTrackingEquipment: Boolean(input.trackingEquipment),
        zeroKM: Boolean(input.zeroKm),
        gncInformation: input.hasGnc
          ? { hasGNC: true, accesoryInsuredSum: input.gncValueARS ?? 0 }
          : { hasGNC: false },
      },
      ...(input.driversUnder25 !== undefined
        ? { driversUnder25: input.driversUnder25 }
        : {}),
      ...(input.garageParking !== undefined
        ? { garageParking: input.garageParking }
        : {}),
    },
  };
}

function mapPlans(plans: SancorPlan[]): QuotePlan[] {
  return plans.map((p, i) => {
    const rawName =
      p.module?.coverageName ||
      p.module?.coverageAbbreviatedName ||
      `Plan ${i + 1}`;
    return {
      planId: String(p.module?.coverageCode ?? i),
      planName: rawName,
      coverage: matchCoverageTier(
        p.module?.coverageAbbreviatedName,
        p.module?.coverageName,
      ),
      coverageRawName: rawName,
      monthlyPremium:
        p.quotaPremiumMonthly ?? p.premiumTotals?.quotaAmount ?? null,
      totalPremium: p.premium ?? p.premiumTotals?.quotationPremium ?? null,
      insuredSumARS: p.vehicleInsuredSum ?? null,
      currency: "ARS",
      notes: p.module?.message || p.module?.observations || undefined,
    };
  });
}

export const sancorProvider: QuoteProvider = {
  id: "sancor",
  name: "Sancor Seguros",

  enabled() {
    return readConfig() !== null;
  },

  async quote(input: QuoteInput): Promise<ProviderQuoteResult> {
    const base = { providerId: "sancor", providerName: "Sancor Seguros" };
    const config = readConfig();
    if (!config) {
      return {
        ...base,
        ok: false,
        plans: [],
        error: "Sancor no esta configurado (faltan env vars SANCOR_*).",
      };
    }

    // Nota: NO exigimos productor/organizador. Es una cotizacion de pre-venta
    // (no emision, no requiere `person`); si Sancor deriva el intermediario del
    // token o los pide, su respuesta lo dira. Ver docs/quote-providers.md.
    const codes = input.providerCodes?.sancor ?? {};
    const vehicleCode =
      codes.vehicleCode != null ? String(codes.vehicleCode) : "";
    if (!vehicleCode) {
      return {
        ...base,
        ok: false,
        plans: [],
        error: "Falta el vehicleCode de Sancor para este vehiculo.",
      };
    }
    const cityCode =
      codes.cityCode != null ? Number(codes.cityCode) : undefined;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // La "Clave" del portal viaja como client id. Mandamos los dos nombres de
      // header que usa el gateway de Sancor (IBM API Connect) por las dudas.
      gss_apiclient_id: config.clientId,
      "X-IBM-Client-Id": config.clientId,
    };
    if (config.clientSecret) {
      headers.gss_apiclient_secret = config.clientSecret;
      headers["X-IBM-Client-Secret"] = config.clientSecret;
    }

    const authorization = await getAuthorizationHeader(config);
    if (!authorization) {
      return {
        ...base,
        ok: false,
        plans: [],
        error:
          "Falta el token de Sancor: defini SANCOR_INTERMEDIARY_USER + SANCOR_INTERMEDIARY_PASSWORD (o pega un Bearer en SANCOR_API_AUTH_TOKEN).",
      };
    }
    headers.Authorization = authorization;

    const body = buildBody(config, input, vehicleCode, cityCode);
    const res = await fetch(`${config.baseUrl}/quotations/vehicle/automotive`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (res.status === 204) {
      return { ...base, ok: true, plans: [] };
    }

    const data = (await res.json().catch(() => null)) as SancorResponse | null;

    if (!res.ok) {
      const text =
        data?.messages
          ?.map((m) => m.text)
          .filter(Boolean)
          .join("; ") || `Sancor respondio ${res.status}`;
      throw new Error(text);
    }

    const plans = mapPlans(data?.vehicleQuotation?.plans ?? []);
    return { ...base, ok: true, plans, raw: data };
  },
};
