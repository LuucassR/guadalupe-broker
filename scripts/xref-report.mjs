// Reporte del cross-reference auto CCA -> codigo de vehiculo de cada
// aseguradora (tabla ProviderVehicleXref, ver lib/quote-providers/vehicle-xref.ts).
// Lista las filas que conviene revisar a mano:
//   - code = null      -> el proveedor no matcheo el auto (no se puede cotizar)
//   - confidence < N    -> matcheo, pero la version elegida es dudosa
//
//   node scripts/xref-report.mjs                 # umbral de confianza 50
//   node scripts/xref-report.mjs --min 70        # mas estricto
//   node scripts/xref-report.mjs --provider cooperacion
//
// Para corregir una fila: editarla con source = "manual" (esas nunca se pisan).
import { PrismaClient } from "@prisma/client";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const minConfidence = Number(arg("min", "50"));
const providerFilter = arg("provider", null);

const prisma = new PrismaClient();

const rows = await prisma.providerVehicleXref.findMany({
  where: providerFilter ? { providerId: providerFilter } : undefined,
  orderBy: [{ providerId: "asc" }, { confidence: "asc" }],
});

const byProvider = new Map();
for (const r of rows) {
  if (!byProvider.has(r.providerId)) byProvider.set(r.providerId, []);
  byProvider.get(r.providerId).push(r);
}

for (const [provider, list] of byProvider) {
  const misses = list.filter((r) => !r.code);
  const lowConf = list.filter(
    (r) => r.code && r.confidence < minConfidence,
  );
  const manual = list.filter((r) => r.source === "manual");

  console.log(`\n== ${provider} ==`);
  console.log(
    `  total ${list.length} · sin match ${misses.length} · ` +
      `baja confianza (<${minConfidence}) ${lowConf.length} · manuales ${manual.length}`,
  );

  if (misses.length) {
    console.log("  -- sin match (code = null) --");
    for (const r of misses) {
      console.log(
        `     ccaVersionId=${r.ccaVersionId}  resuelto=${r.resolvedAt.toISOString().slice(0, 10)}`,
      );
    }
  }
  if (lowConf.length) {
    console.log("  -- baja confianza --");
    for (const r of lowConf) {
      console.log(
        `     ccaVersionId=${r.ccaVersionId}  code=${r.code}  conf=${r.confidence}  "${r.matchedLabel ?? ""}"`,
      );
    }
  }
}

if (rows.length === 0) {
  console.log("Sin filas en ProviderVehicleXref todavia.");
}

await prisma.$disconnect();
