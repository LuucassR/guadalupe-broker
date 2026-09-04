// Prueba directa de las APIs de Sancor con lo que haya en .env, sin levantar
// Next. Genera el token (TokenGenerator-V2) y, si sale, pide una cotizacion.
//
//   node scripts/sancor-smoke.mjs
//   node scripts/sancor-smoke.mjs --vehicle-code 12345 --cp 3000 --value 25000000
//
// No es un test automatizado: imprime crudo lo que responde cada endpoint para
// depurar credenciales / codigos. Ver docs/quote-providers.md.
import { readFileSync } from "node:fs";

// --- .env minimalista ------------------------------------------------------
function loadEnv() {
  let raw = "";
  try {
    raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
  } catch {
    return {};
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith("#")) continue;
    v = v.replace(/\s+#.*$/, "").trim(); // comentario al final
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};

const BASE =
  env.SANCOR_API_BASE_URL ||
  "https://external-pre-api.gruposancorseguros.com/apissa/pre-catalog";
const KEY = env.SANCOR_API_CLIENT_ID;
const SECRET = env.SANCOR_API_CLIENT_SECRET;
const USER = env.SANCOR_INTERMEDIARY_USER;
const PASS = env.SANCOR_INTERMEDIARY_PASSWORD;
const APP_CLIENT = env.SANCOR_APP_CLIENT || "Ceibo";
const TOKEN_URL = env.SANCOR_TOKEN_URL || `${BASE}/v2/security/auth0/token`;

if (!KEY) {
  console.error("Falta SANCOR_API_CLIENT_ID en .env");
  process.exit(1);
}

const clientHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  gss_apiclient_id: KEY,
  "X-IBM-Client-Id": KEY,
  ...(SECRET
    ? { gss_apiclient_secret: SECRET, "X-IBM-Client-Secret": SECRET }
    : {}),
};

async function post(url, headers, body) {
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

console.log("BASE      :", BASE);
console.log("CLIENT_ID :", KEY.slice(0, 6) + "…");
console.log("USER      :", USER || "(sin definir)");
console.log("APP_CLIENT :", APP_CLIENT);
console.log("");

// --- 1) Token ------------------------------------------------------------
console.log("== TokenGenerator-V2 ==");
if (!USER || !PASS) {
  console.log(
    "Sin SANCOR_INTERMEDIARY_USER / _PASSWORD, no se puede generar token.\n",
  );
  process.exit(0);
}
const tok = await post(TOKEN_URL, clientHeaders, {
  username: USER,
  password: PASS,
  app_client: APP_CLIENT,
});
console.log("HTTP", tok.status);
console.log(JSON.stringify(tok.json, null, 2));

const accessToken =
  tok.json && typeof tok.json === "object" ? tok.json.access_token : null;
if (!accessToken) {
  console.log(
    "\nNo se obtuvo access_token. Revisar usuario/password y app_client.",
  );
  process.exit(0);
}

// --- 2) Cotizacion -----------------------------------------------------
console.log("\n== Cotizacion automotive ==");
const vehicleCode = arg("vehicle-code", "");
if (!vehicleCode) {
  console.log(
    "Pasá --vehicle-code <codigo Sancor> para probar la cotizacion (falta el mapeo del catalogo).",
  );
  process.exit(0);
}
const now = new Date();
const end = new Date(now);
end.setFullYear(end.getFullYear() + 1);
const moduleCodes = (env.SANCOR_COVER_MODULE_CODES || "")
  .split(",")
  .map((s) => Number(s.trim()))
  .filter((n) => Number.isFinite(n) && n > 0);
const quoteBody = {
  vehicleQuotation: {
    // Sin lista -> no se manda el campo y Sancor cotiza todas las coberturas.
    ...(moduleCodes.length
      ? {
          coverModuleCodes: moduleCodes.map((offeringCode) => ({
            offeringCode,
          })),
        }
      : {}),
    currencyCode: Number(env.SANCOR_CURRENCY_CODE) || 1,
    policyPeriodStartEffectiveDate: now.toISOString(),
    policyPeriodEndEffectiveDate: end.toISOString(),
    conditionCode: 4,
    ...(env.SANCOR_PRODUCER_CODE && env.SANCOR_ORGANIZER_CODE
      ? {
          intermediary: {
            prodProducerCode: Number(env.SANCOR_PRODUCER_CODE),
            upperProducerCode: Number(env.SANCOR_ORGANIZER_CODE),
          },
        }
      : {}),
    policyVigencyCode: 1,
    policyPaymentPeriodicityCode: 5,
    policyQuotas: 1,
    productCode: Number(env.SANCOR_PRODUCT_CODE) || 24,
    zone: { postalCode: Number(arg("cp", "3000")) },
    vehicle: {
      vehicleCode,
      vehicleYear: Number(arg("year", "2022")),
      yearSuggestedValue: Number(arg("value", "25000000")),
      vehicleUseTypeCode: 2,
      vehicleTrackingEquipment: false,
      zeroKM: false,
      gncInformation: { hasGNC: false },
    },
  },
};
const quote = await post(
  `${BASE}/quotations/vehicle/automotive`,
  { ...clientHeaders, Authorization: `Bearer ${accessToken}` },
  quoteBody,
);
console.log("HTTP", quote.status);
console.log(JSON.stringify(quote.json, null, 2));
