// Importa la Tabla de Valuación de Automotores de la DNRPA (Dirección Nacional
// de los Registros Nacionales de la Propiedad del Automotor). Es la fuente
// oficial y gratuita de valor fiscal de vehículos usados y —a diferencia de la
// Lista de la CCA (scripts/import-cca-catalog.ts, sólo 2012+)— cubre año-modelo
// desde 0km hasta 2002, incluidos modelos ya discontinuados.
//
// La usa el multicotizador para los autos anteriores a 2012, donde la CCA no
// tiene datos (ver lib/vehicle-valuation.ts, catálogo "legacy").
//
//   pnpm import:dnrpa
//
// Requiere el binario `pdftotext` (paquete poppler-utils) en el PATH.
//
// OJO: es un valor FISCAL, típicamente por debajo del valor de mercado. El
// front lo muestra rotulado como "valor fiscal de referencia".
import { execFileSync } from "node:child_process";
import { PrismaClient, type Prisma } from "@prisma/client";

// Índice de disposiciones: https://www.dnrpa.gov.ar/valuacion/valuaciones.php
// El archivo vigente sigue el patrón informacion/DD-MM-AAAA.pdf. Tomamos el del
// 1° del mes actual y, si aún no salió, el del 1° del mes anterior.
const DNRPA_BASE = "https://www.dnrpa.gov.ar/valuacion/informacion";
const CATALOG_CACHE_KEY = "dnrpa:catalog";
const CATALOG_TTL_DAYS = 70; // la DNRPA actualiza ~cada 1-2 meses

const NUM_TOKEN_RE = /\d{4,}/g; // los valores fiscales siempre tienen 4+ dígitos

// Tipos de carrocería que consideramos "auto" (mismo alcance que la CCA:
// autos, pick-ups, todo terreno, utilitarios). El resto (camión, chasis,
// ómnibus, acoplado, cuatriciclo, etc.) se descarta.
const CAR_TYPE_RE =
  /\b(SEDAN|RURAL|COUPE|CONVERTIBLE|CABRIOLET|FAMILIAR|MONOVOLUMEN|MINIVAN|MINIBUS|FURGON(ETA)?|TODO ?TERRENO|PICK ?-? ?UP|VAN|WAGON|HATCHBACK|LIFTBACK|ROADSTER)\b/;
const NOT_CAR_TYPE_RE =
  /\b(CAMION|CHASIS|COLECTIVO|OMNIBUS|MICROOMNIBUS|ACOPLADO|SEMIRREMOLQUE|TRACTOR|CASA ?RODANTE|MOTOR ?HOME|CUATRICICLO|ARENERO|TRAILER|GRUA|HORMIGONERA)\b/;

interface YearColumn {
  label: string; // "0km" | "2025" ... "2002"
  start: number;
}

interface DnrpaRow {
  brandRaw: string; // marca cortada por columna, sin resolver
  brand?: string; // marca resuelta (2º paso)
  model: string;
  type: string;
  valuationsARS: Record<string, number>;
}

// Alineación monótona de los números de una fila a las columnas de año: los
// valores aparientan de izquierda a derecha en el mismo orden que los años del
// header y una fila sólo puede omitir columnas, nunca reordenarlas. Igual que
// el parser de la CCA.
function assignTokensToColumns(
  tokens: { str: string; start: number }[],
  columns: YearColumn[],
): { label: string; value: number }[] {
  const N = tokens.length;
  const M = columns.length;
  if (N === 0 || N > M) return [];

  const cost = (i: number, j: number) =>
    Math.abs(tokens[i].start + tokens[i].str.length / 2 - columns[j].start);
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: N + 1 }, () =>
    new Array(M + 1).fill(INF),
  );
  dp[0][0] = 0;
  for (let j = 1; j <= M; j++) dp[0][j] = 0;
  for (let i = 1; i <= N; i++) {
    for (let j = i; j <= M; j++) {
      const skipCol = dp[i][j - 1];
      const takeCol =
        dp[i - 1][j - 1] === INF ? INF : dp[i - 1][j - 1] + cost(i - 1, j - 1);
      dp[i][j] = Math.min(skipCol, takeCol);
    }
  }

  let i = N;
  let j = M;
  const assignment: number[] = new Array(N).fill(-1);
  while (i > 0 && j > 0) {
    const skipCol = dp[i][j - 1];
    const takeCol =
      dp[i - 1][j - 1] === INF ? INF : dp[i - 1][j - 1] + cost(i - 1, j - 1);
    if (takeCol <= skipCol) {
      assignment[i - 1] = j - 1;
      i--;
      j--;
    } else {
      j--;
    }
  }

  const out: { label: string; value: number }[] = [];
  for (let k = 0; k < N; k++) {
    if (assignment[k] === -1) continue;
    const value = Number(tokens[k].str);
    if (!Number.isFinite(value) || value <= 0) continue;
    out.push({ label: columns[assignment[k]].label, value });
  }
  return out;
}

interface HeaderCols {
  years: YearColumn[];
  marca: number;
  modelo: number;
  valueZone: number; // = years[0].start, donde empieza "0Km"
}

function parseHeader(line: string): HeaderCols | null {
  const marca = line.indexOf("Desc. marca");
  const modelo = line.indexOf("Desc. Modelo");
  if (marca < 0 || modelo < 0) return null;
  const years: YearColumn[] = [];
  const re = /0Km|20\d{2}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    years.push({
      label: m[0] === "0Km" ? "0km" : m[0],
      start: m.index,
    });
  }
  if (years.length < 20) return null;
  return { years, marca, modelo, valueZone: years[0].start };
}

const ROW_START_RE = /^[IN]\s+[0-9A-Z]+\s+[A-Z]\s/;

// Marcas reales de baja frecuencia que queremos conservar aunque tengan pocas
// filas (el filtro por frecuencia solo, si no, las tiraría junto con el ruido).
const RARE_REAL_BRANDS = new Set([
  "FERRARI", "LAMBORGHINI", "MASERATI", "MCLAREN", "LOTUS", "BENTLEY",
  "ROLLS ROYCE", "ASTON MARTIN", "BUGATTI", "HUMMER", "PONTIAC", "PLYMOUTH",
  "SAAB", "ROVER", "DACIA", "LADA", "GEO", "DAIHATSU", "PROTON", "TATA",
  "SANTANA", "GALLOPER", "ARO", "DAEWOO", "OPEL", "SEAT", "INFINITI",
  "CADILLAC", "GMC", "SSANGYONG", "ISUZU",
]);
// Marcas que no son autos (motos), fuera de alcance.
const NOT_CAR_BRAND_RE =
  /\b(HARLEY|DAVIDSON|ZANELLA|MOTOMEL|GILERA|YAMAHA|KAWASAKI|CORVEN|KYMCO|KELLER|GUERRERO)\b/;

function stripType(blob: string): { model: string; type: string } {
  // El blob es "modelo + tipo" pegados (con bleed de columnas). Buscamos una
  // frase de tipo conocida al final y la separamos.
  const TYPE_TAIL =
    /\s*(SEDAN(\s+\d\s+PUERTAS)?|RURAL(\s+\d\s+PUERTAS)?|COUPE.*|CONVERTIBLE.*|CABRIOLET.*|FAMILIAR.*|MONOVOLUMEN.*|MINIVAN.*|MINIBUS.*|FURGON(ETA)?.*|TODO ?TERRENO.*|PICK ?-? ?UP.*|VAN\b.*|WAGON.*|HATCHBACK.*|CHASIS.*|CAMION.*|UTILITARIO.*|SIN ESPECIFICACION.*)$/;
  const m = blob.match(TYPE_TAIL);
  if (m) {
    return {
      model: blob.slice(0, m.index).trim().replace(/\s+/g, " "),
      type: m[1].trim().replace(/\s+/g, " "),
    };
  }
  return { model: blob.trim().replace(/\s+/g, " "), type: "" };
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function parseDnrpaText(text: string): { rows: DnrpaRow[]; skipped: number } {
  const lines = text.split("\n");
  let cols: HeaderCols | null = null;
  let skipped = 0;
  const rows: DnrpaRow[] = [];

  // Acumulamos una "fila lógica" = la línea que arranca con I/N + su(s)
  // continuación(es) (nombres de modelo largos que wrappean a la línea de
  // abajo, arrastrando los valores).
  let buf: string[] = [];

  const flush = () => {
    if (buf.length === 0 || !cols) {
      buf = [];
      return;
    }
    const first = buf[0];
    // Marca por posición de columna (con margen para el bleed entre filas I y
    // N), sacándole cualquier resto de código numérico o un "Mod" corto pegado
    // adelante. La resolución final (frecuencia + substring) es un 2º paso.
    const brandRaw = normalize(
      first
        .slice(Math.max(0, cols.marca - 4), cols.modelo)
        .replace(/^[\s\d]+/, "")
        .replace(/^[A-Z0-9]{1,3}\s{2,}/, ""),
    );
    // modelo + tipo: entre la columna de modelo y la zona de valores.
    const blob = first
      .slice(cols.modelo, cols.valueZone)
      .replace(/\s+/g, " ")
      .trim();

    // Números de la zona de valores, de todas las líneas de la fila, en orden.
    const tokens: { str: string; start: number }[] = [];
    for (const l of buf) {
      const zone = l.slice(cols.valueZone - 3);
      let m: RegExpExecArray | null;
      NUM_TOKEN_RE.lastIndex = 0;
      while ((m = NUM_TOKEN_RE.exec(zone))) {
        tokens.push({ str: m[0], start: cols.valueZone - 3 + m.index });
      }
    }
    buf = [];

    if (!brandRaw || brandRaw.length < 2 || tokens.length === 0) {
      skipped++;
      return;
    }
    if (NOT_CAR_BRAND_RE.test(brandRaw)) return; // moto: fuera de alcance
    const { model, type } = stripType(blob);
    if (!model) {
      skipped++;
      return;
    }

    const typed = `${type} ${model}`;
    if (NOT_CAR_TYPE_RE.test(typed)) return; // camión/chasis/etc: fuera de alcance
    const looksCar =
      CAR_TYPE_RE.test(type) ||
      (type === "" && /\bPUERTAS\b/.test(blob)) ||
      CAR_TYPE_RE.test(model);
    if (!looksCar) return;

    const assigned = assignTokensToColumns(tokens, cols.years);
    if (assigned.length === 0) {
      skipped++;
      return;
    }
    const valuationsARS: Record<string, number> = {};
    for (const { label, value } of assigned) valuationsARS[label] = value;

    rows.push({ brandRaw, model, type, valuationsARS });
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    const header = parseHeader(line);
    if (header) {
      flush();
      cols = header;
      continue;
    }
    if (!cols) continue;
    if (/Vigencia\s+\d{2}\/\d{2}\/\d{4}/.test(line) && !ROW_START_RE.test(line)) {
      continue; // pie/encabezado de página
    }
    if (ROW_START_RE.test(line)) {
      flush();
      buf = [line];
    } else if (buf.length > 0 && line.trim() !== "") {
      buf.push(line); // continuación de un nombre de modelo largo
    } else {
      flush();
    }
  }
  flush();

  // --- 2º paso: resolver la marca ---------------------------------------
  // Las marcas OEM reales aparecen en decenas/cientos de filas; los artefactos
  // de bleed (códigos "Mod" tipo "AU", "BB", "A01") aparecen 1-20 veces. Una
  // marca válida = frecuente, o de la allowlist de exóticas. El resto se
  // resuelve por substring (p.ej. "AU VOLKSWAGEN" -> "VOLKSWAGEN",
  // "ENAULT" -> "RENAULT") o se descarta.
  const freq = new Map<string, number>();
  for (const r of rows) freq.set(r.brandRaw, (freq.get(r.brandRaw) ?? 0) + 1);
  const known = new Set<string>(RARE_REAL_BRANDS);
  for (const [b, n] of freq) if (n >= 20 && /^[A-Z][A-Z .]{2,}$/.test(b)) known.add(b);
  // Sacá los bleeds "MARCA + 1-3 letras" (ej. "SEAT C" de "SEAT CORDOBA") cuando
  // la marca base ya está: se resuelven a la base en el paso de abajo.
  for (const b of [...known])
    for (const k of known)
      if (k !== b && b.startsWith(k + " ") && b.length - k.length <= 3) {
        known.delete(b);
        break;
      }
  const knownList = [...known].sort((a, b) => b.length - a.length); // largas primero

  const resolveBrand = (raw: string): string | null => {
    if (known.has(raw)) return raw;
    for (const k of knownList) {
      if (raw === k) return k;
      if (raw.endsWith(" " + k) || raw.startsWith(k + " ")) return k;
      if (raw.length >= 4 && k.endsWith(raw)) return k; // "ENAULT" -> "RENAULT"
      if (raw.includes(k) && k.length >= 4) return k; // "AU VOLKSWAGEN"
    }
    return null;
  };

  let dropped = 0;
  const resolved: DnrpaRow[] = [];
  for (const r of rows) {
    const b = resolveBrand(r.brandRaw);
    if (!b) {
      dropped++;
      continue;
    }
    resolved.push({ ...r, brand: b });
  }

  return { rows: resolved, skipped: skipped + dropped };
}

// Hash estable (FNV-1a) para que un mismo nombre resuelva siempre al mismo id
// entre corridas (el UI guarda el id elegido). Igual que en la CCA.
function stableId(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 1;
}

async function downloadPdfText(): Promise<string> {
  const now = new Date();
  const candidates: string[] = [];
  for (const monthsBack of [0, 1, 2]) {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const dd = "01";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    candidates.push(`${DNRPA_BASE}/${dd}-${mm}-${d.getFullYear()}.pdf`);
  }
  for (const url of candidates) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100_000) continue; // no es el PDF real
    console.log(`PDF: ${url} (${(buf.length / 1e6).toFixed(1)} MB)`);
    try {
      return execFileSync("pdftotext", ["-layout", "-", "-"], {
        input: buf,
        maxBuffer: 1024 * 1024 * 128,
      }).toString("utf8");
    } catch (err) {
      throw new Error(
        "Falta el binario `pdftotext` (poppler-utils). En Debian/Ubuntu: " +
          `apt-get install -y poppler-utils. Original: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
  throw new Error(
    `No se pudo descargar la tabla DNRPA. Probé: ${candidates.join(", ")}. ` +
      "Ver el índice en https://www.dnrpa.gov.ar/valuacion/valuaciones.php",
  );
}

async function main() {
  const text = await downloadPdfText();

  console.log("Parseando tabla DNRPA...");
  const { rows, skipped } = parseDnrpaText(text);

  // brand -> model(+type) -> valuationsARS, dedup por (brand, model, type)
  const brandMap = new Map<
    string,
    Map<string, { model: string; type: string; valuationsARS: Record<string, number> }>
  >();
  for (const r of rows) {
    const rb = r.brand ?? r.brandRaw;
    if (!brandMap.has(rb)) brandMap.set(rb, new Map());
    const models = brandMap.get(rb)!;
    const key = `${r.model} ${r.type}`;
    const existing = models.get(key);
    if (existing) {
      for (const [y, v] of Object.entries(r.valuationsARS)) {
        existing.valuationsARS[y] = Math.max(existing.valuationsARS[y] ?? 0, v);
      }
    } else {
      models.set(key, { model: r.model, type: r.type, valuationsARS: { ...r.valuationsARS } });
    }
  }

  const brands = [...brandMap.entries()]
    .map(([name, models]) => ({
      id: stableId(`dnrpa::${name}`),
      name,
      models: [...models.values()]
        .map((m) => ({
          id: stableId(`dnrpa::${name}::${m.model}::${m.type}`),
          name: m.type ? `${m.model} (${m.type})` : m.model,
          valuationsARS: m.valuationsARS,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalModels = brands.reduce((a, b) => a + b.models.length, 0);
  console.log(
    `Parseadas ${brands.length} marcas, ${totalModels} modelos (${skipped} filas descartadas por ambiguas).`,
  );

  if (brands.length < 40 || totalModels < 3000) {
    throw new Error(
      `El catálogo DNRPA parseado se ve incompleto (${brands.length} marcas, ${totalModels} modelos). ` +
        "No se actualizó VehicleCatalogCache. Revisar el formato del PDF de este mes.",
    );
  }

  const prisma = new PrismaClient();
  try {
    await prisma.vehicleCatalogCache.upsert({
      where: { key: CATALOG_CACHE_KEY },
      create: {
        key: CATALOG_CACHE_KEY,
        payload: brands as unknown as Prisma.InputJsonValue,
        expiresAt: new Date(Date.now() + CATALOG_TTL_DAYS * 864e5),
      },
      update: {
        payload: brands as unknown as Prisma.InputJsonValue,
        expiresAt: new Date(Date.now() + CATALOG_TTL_DAYS * 864e5),
      },
    });
    console.log(`Catálogo DNRPA actualizado en VehicleCatalogCache ("${CATALOG_CACHE_KEY}").`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
