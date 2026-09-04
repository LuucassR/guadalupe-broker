// Prueba directa de las APIs de Cooperación Seguros con lo que haya en .env, sin
// levantar Next. Genera el token (OAuth2 client_credentials), resuelve la
// localidad a partir del CP y, si se pasa un codigo de vehiculo, pide una
// cotizacion.
//
//   node scripts/cooperacion-smoke.mjs
//   node scripts/cooperacion-smoke.mjs --cmp 28571 --cp 2600 --year 2022 --value 25000000
//   node scripts/cooperacion-smoke.mjs --infoauto 9100011 --cp 5000
//
// No es un test automatizado: imprime crudo lo que responde cada endpoint para
// depurar credenciales / codigos. Ver docs/quote-providers.md.
import { readFileSync } from "node:fs";
import { request as httpsRequest } from "node:https";

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
    v = v.replace(/\s+#.*$/, "").trim();
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
  env.COOPERACION_API_BASE_URL || "https://api.cooperacionseguros.com.ar";
const CLIENT_ID = env.COOPERACION_CLIENT_ID;
const CLIENT_SECRET = env.COOPERACION_CLIENT_SECRET;
const TOKEN_URL = env.COOPERACION_TOKEN_URL || `${BASE}/token`;
const USUARIO_ID = env.COOPERACION_USUARIO_ID || "";
const PRODUCER = env.COOPERACION_PRODUCER_CODE || "";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Falta COOPERACION_CLIENT_ID / COOPERACION_CLIENT_SECRET en .env",
  );
  process.exit(1);
}

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

// Cooperación sirve /Localidades como GET *con body*; fetch no lo permite.
function getWithBody(url, headers, body) {
  const buf = Buffer.from(JSON.stringify(body));
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: "GET",
        headers: { ...headers, "Content-Length": buf.length },
        timeout: 20000,
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          let json;
          try {
            json = JSON.parse(raw);
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, json });
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.end(buf);
  });
}

console.log("BASE       :", BASE);
console.log("CLIENT_ID  :", CLIENT_ID.slice(0, 6) + "…");
console.log("USUARIO_ID :", USUARIO_ID || "(sin definir)");
console.log("PRODUCER   :", PRODUCER || "(sin definir)");
console.log("");

// --- 1) Token ------------------------------------------------------------
console.log("== Token (OAuth2 client_credentials) ==");
const tok = await post(
  TOKEN_URL,
  { "Content-Type": "application/json", Accept: "application/json" },
  { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET },
);
console.log("HTTP", tok.status);
console.log(JSON.stringify(tok.json, null, 2));

const accessToken =
  tok.json && typeof tok.json === "object" ? tok.json.access_token : null;
if (!accessToken) {
  console.log("\nNo se obtuvo access_token. Revisar clientId / clientSecret.");
  process.exit(0);
}
const authHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// --- 2) Localidades: CP -> idLocalidad --------------------------------
const cp = arg("cp", "2600");
console.log(`\n== Localidades (CP ${cp}) ==`);
const loc = await getWithBody(
  `${BASE}/Presupuesto/Vehiculo/Localidades`,
  authHeaders,
  {
    CodigoPostal: String(cp),
    UsuarioId: USUARIO_ID,
  },
);
console.log("HTTP", loc.status);
console.log(JSON.stringify(loc.json, null, 2));

let idLocalidad = Number(arg("localidad", "")) || null;
if (!idLocalidad) {
  const list = Array.isArray(loc.json)
    ? loc.json
    : (loc.json?.localidades ?? []);
  idLocalidad = list.find((r) => r?.idLocalidad != null)?.idLocalidad ?? null;
}

// --- 3) Cotizacion ---------------------------------------------------
console.log("\n== Cotizar Vehículo ==");
const cmp = Number(arg("cmp", "")) || 0;
const infoauto = Number(arg("infoauto", "")) || 0;
if (!cmp && !infoauto) {
  console.log(
    "Pasá --cmp <CodigoVehiculoCMP> o --infoauto <CodigoInfoAuto> para probar la cotizacion.",
  );
  process.exit(0);
}
if (!idLocalidad) {
  console.log(
    "No se pudo resolver idLocalidad (pasá --localidad <id> o revisá el CP).",
  );
  process.exit(0);
}

const vehKey = cmp ? "CodigoVehiculoCMP" : "CodigoInfoAuto";
const quoteBody = {
  idAplicacion: "",
  UsuarioId: USUARIO_ID,
  RazonSocial: env.COOPERACION_QUOTE_RAZON_SOCIAL || "Consulta Web",
  NroDocumento: Number(env.COOPERACION_QUOTE_DOC || "11111111"),
  Email: env.COOPERACION_QUOTE_EMAIL || "cotizaciones@guadalupebroker.com.ar",
  CodigoProductor: PRODUCER,
  CondicionFiscal: Number(env.COOPERACION_CONDITION_CODE) || 5,
  Categoria: 0,
  [vehKey]: cmp || infoauto,
  CodigoUso: Number(env.COOPERACION_USE_CODE) || 1,
  IdLocalidad: idLocalidad,
  CodigoPostal: String(cp),
  Anio: Number(arg("year", "2022")),
  PoseeGNC: false,
  CodigoGnc: 0,
  CotizaAP: false,
  CantidadMeses: 4,
  GrabarPresupuesto: false,
  AplicarMaxDescuentos: true,
};
console.log("body:", JSON.stringify(quoteBody, null, 2));
const quote = await post(
  `${BASE}/Presupuesto/Vehiculo/Cotizar`,
  authHeaders,
  quoteBody,
);
console.log("HTTP", quote.status);
console.log(JSON.stringify(quote.json, null, 2));
