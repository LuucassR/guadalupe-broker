// Bot de importacion del catalogo de valuaciones: descarga la Lista de
// Precios oficial de la CCA (Camara del Comercio Automotor, cca.org.ar) en
// PDF, la parsea a marca -> modelo -> version -> precio USD por anio-modelo,
// y la deja en VehicleCatalogCache para que lib/vehicle-valuation.ts la lea
// sin pegarle a ninguna API en cada cotizacion.
//
// Uso manual:      npm run import:cca
// Uso automatico:  .github/workflows/import-cca-catalog.yml (corre 1 vez/mes)
//
// Requiere el binario `pdftotext` (paquete poppler-utils) en el PATH.
//
// Ver docs/vehicle-valuation.md para el detalle del formato del PDF, las
// limitaciones conocidas del parser y como migrar a otra fuente de datos.
import { execFileSync } from "node:child_process";
import { PrismaClient, type Prisma } from "@prisma/client";

const CCA_PDF_URL = "https://www.cca.org.ar/descargas/precios/Autos.pdf";
const CATALOG_CACHE_KEY = "cca:catalog";
const CATALOG_TTL_DAYS = 40; // la CCA publica ~mensual; da margen si el import de un mes falla

const YEAR_HEADER_RE = /(0\s*Km|\d{4})/g;
const NUM_TOKEN_RE = /-?\d[\d.,]*\d|-?\d/g;

interface Column {
  label: string;
  start: number;
}

interface ParsedVersion {
  name: string;
  valuationsUSD: Record<string, number>;
}

interface ParsedModel {
  name: string;
  versions: ParsedVersion[];
}

interface ParsedBrand {
  name: string;
  models: ParsedModel[];
}

function parseHeaderColumns(line: string): Column[] {
  const cols: Column[] = [];
  let m: RegExpExecArray | null;
  YEAR_HEADER_RE.lastIndex = 0;
  while ((m = YEAR_HEADER_RE.exec(line))) {
    const label = m[1].replace(/\s+/g, " ").trim() === "0 Km" ? "0km" : m[1];
    cols.push({ label, start: m.index });
  }
  return cols;
}

// Asigna cada numero de una fila a una columna (anio) preservando el orden:
// los numeros de una fila siempre aparecen de izquierda a derecha en el mismo
// orden que los anios del header, una fila solo puede omitir columnas, nunca
// reordenarlas ni repetirlas. Por eso esto es una alineacion monotona (tipo
// distancia de edicion) en vez de "columna mas cercana": la columna mas
// cercana por posicion falla en filas con muchos anios seguidos porque el PDF
// no tiene el espaciado de columnas perfectamente uniforme en todas las
// paginas.
function assignTokensToColumns(
  tokens: { str: string; start: number }[],
  columns: Column[],
): { label: string; value: number }[] {
  const N = tokens.length;
  const M = columns.length;
  if (N === 0 || N > M) return [];

  const cost = (i: number, j: number) =>
    Math.abs(tokens[i].start + tokens[i].str.length / 2 - columns[j].start);
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(INF));
  dp[0][0] = 0;
  for (let j = 1; j <= M; j++) dp[0][j] = 0;
  for (let i = 1; i <= N; i++) {
    for (let j = i; j <= M; j++) {
      const skipCol = dp[i][j - 1];
      const takeCol = dp[i - 1][j - 1] === INF ? INF : dp[i - 1][j - 1] + cost(i - 1, j - 1);
      dp[i][j] = Math.min(skipCol, takeCol);
    }
  }

  let i = N;
  let j = M;
  const assignment: number[] = new Array(N).fill(-1);
  while (i > 0 && j > 0) {
    const skipCol = dp[i][j - 1];
    const takeCol = dp[i - 1][j - 1] === INF ? INF : dp[i - 1][j - 1] + cost(i - 1, j - 1);
    if (takeCol <= skipCol) {
      assignment[i - 1] = j - 1;
      i--;
      j--;
    } else {
      j--;
    }
  }

  const result: { label: string; value: number }[] = [];
  for (let k = 0; k < N; k++) {
    if (assignment[k] === -1) continue;
    const value = Number(tokens[k].str.replace(/\./g, "").replace(/,/g, "."));
    if (!Number.isFinite(value) || value <= 0) continue;
    result.push({ label: columns[assignment[k]].label, value });
  }
  return result;
}

// El PDF de la CCA a veces trae una fila de VERSION sin ningun precio (todas las
// columnas de anio vacias). Al no tener digitos despues de la columna 0, el
// parser la tomaria como un encabezado de modelo nuevo y le robaria las
// versiones siguientes al modelo real (ej. Toyota Yaris: la fila sin precio
// "5P 1,5 XLS 4AT 2022" se colaba como modelo y se llevaba las versiones
// "4P 1,5 ..." del sedan). Se reconoce por el prefijo de puertas ("5P", "4P",
// ...) que ningun nombre de modelo real usa, y se descarta.
function looksLikeStrayVersionLine(label: string): boolean {
  return /^\d+\s*P\b/i.test(label);
}

function parseCcaText(text: string): { brands: ParsedBrand[]; skipped: number } {
  const lines = text.split("\n");
  let columns: Column[] | null = null;
  const brands: ParsedBrand[] = [];
  let curBrand: ParsedBrand | null = null;
  let curModel: ParsedModel | null = null;
  let prevBlank = true;
  let skipped = 0;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");

    if (/Autos - Pick Ups - Todo Terreno - Utilitarios/.test(line) || /Visite Nuestro Sitio/.test(line)) {
      continue; // encabezado/pie de pagina repetido, no cuenta como linea en blanco
    }

    if (/0\s*Km/.test(line) && (line.match(/\b(19|20)\d{2}\b/g) ?? []).length >= 5) {
      columns = parseHeaderColumns(line);
      continue;
    }

    if (line.trim() === "") {
      prevBlank = true;
      continue;
    }

    if (!columns) continue; // texto antes del primer header de columnas (portada)

    const nameEnd = columns[0].start;
    const namePart = line.slice(0, Math.min(nameEnd, line.length));
    const restPart = line.slice(nameEnd);

    if (!/\d/.test(restPart)) {
      // Sin numeros = encabezado de marca o de modelo. Una marca nueva viene
      // siempre precedida de una linea en blanco; un modelo nuevo, no.
      const label = line.trim();
      if (!label) {
        prevBlank = true;
        continue;
      }
      if (prevBlank) {
        curBrand = { name: label, models: [] };
        brands.push(curBrand);
        curModel = null;
      } else if (looksLikeStrayVersionLine(label)) {
        // Fila de version sin precios: no es un modelo. Se descarta y se
        // mantiene el modelo actual para que las versiones que siguen queden
        // donde corresponde.
        skipped++;
        prevBlank = false;
        continue;
      } else {
        if (!curBrand) {
          curBrand = { name: "(SIN MARCA)", models: [] };
          brands.push(curBrand);
        }
        curModel = { name: label, versions: [] };
        curBrand.models.push(curModel);
      }
      prevBlank = false;
      continue;
    }

    prevBlank = false;
    const versionName = namePart.trim();
    if (!versionName || !curBrand || !curModel) {
      skipped++;
      continue;
    }

    const tokens: { str: string; start: number }[] = [];
    let m: RegExpExecArray | null;
    NUM_TOKEN_RE.lastIndex = 0;
    while ((m = NUM_TOKEN_RE.exec(restPart))) {
      tokens.push({ str: m[0], start: nameEnd + m.index });
    }

    const assigned = assignTokensToColumns(tokens, columns);
    if (assigned.length === 0) {
      skipped++;
      continue;
    }

    const valuationsUSD: Record<string, number> = {};
    for (const { label, value } of assigned) valuationsUSD[label] = value;
    curModel.versions.push({ name: versionName, valuationsUSD });
  }

  return { brands, skipped };
}

// Hash estable (FNV-1a de 32 bits) para que un mismo nombre siempre resuelva
// al mismo id numerico entre corridas del import - evita que los ids salten
// de un mes a otro (el UI de Cotizador.tsx guarda el id seleccionado).
function stableId(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 1; // positivo, cabe en un Int
}

async function downloadAndExtractText(): Promise<string> {
  const res = await fetch(CCA_PDF_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`No se pudo descargar el PDF de la CCA (status ${res.status}).`);
  const buf = Buffer.from(await res.arrayBuffer());
  try {
    return execFileSync("pdftotext", ["-layout", "-", "-"], {
      input: buf,
      maxBuffer: 1024 * 1024 * 64,
    }).toString("utf8");
  } catch (err) {
    throw new Error(
      "No se encontro el binario `pdftotext` (paquete poppler-utils). " +
        "En Debian/Ubuntu: apt-get install -y poppler-utils. " +
        `Error original: ${err instanceof Error ? err.message : err}`,
    );
  }
}

async function main() {
  console.log(`Descargando ${CCA_PDF_URL} ...`);
  const text = await downloadAndExtractText();

  console.log("Parseando PDF...");
  const { brands: parsedBrands, skipped } = parseCcaText(text);

  const brands = parsedBrands.map((b) => ({
    id: stableId(b.name),
    name: b.name,
    models: b.models.map((m) => ({
      id: stableId(`${b.name}::${m.name}`),
      name: m.name,
      versions: m.versions.map((v) => ({
        id: stableId(`${b.name}::${m.name}::${v.name}`),
        name: v.name,
        valuationsUSD: v.valuationsUSD,
      })),
    })),
  }));

  const totalModels = brands.reduce((a, b) => a + b.models.length, 0);
  const totalVersions = brands.reduce((a, b) => a + b.models.reduce((a2, m) => a2 + m.versions.length, 0), 0);
  console.log(
    `Parseadas ${brands.length} marcas, ${totalModels} modelos, ${totalVersions} versiones ` +
      `(${skipped} filas omitidas por ambiguas - ver docs/vehicle-valuation.md).`,
  );

  if (brands.length < 30 || totalVersions < 3000) {
    // El PDF de agosto 2026 (release de referencia) da 65 marcas y ~6000
    // versiones. Si un mes viene muy por debajo, algo cambio en el formato
    // del PDF y es mas seguro no pisar el catalogo anterior que dejarlo a medias.
    throw new Error(
      `El catalogo parseado se ve incompleto (${brands.length} marcas, ${totalVersions} versiones). ` +
        "No se actualizo VehicleCatalogCache. Revisar el formato del PDF de este mes.",
    );
  }

  const prisma = new PrismaClient();
  try {
    await prisma.vehicleCatalogCache.upsert({
      where: { key: CATALOG_CACHE_KEY },
      create: {
        key: CATALOG_CACHE_KEY,
        payload: brands as unknown as Prisma.InputJsonValue,
        expiresAt: new Date(Date.now() + CATALOG_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
      update: {
        payload: brands as unknown as Prisma.InputJsonValue,
        expiresAt: new Date(Date.now() + CATALOG_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });
    console.log("Catalogo actualizado en VehicleCatalogCache.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
