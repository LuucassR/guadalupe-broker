import { NextResponse } from "next/server";
import { z } from "zod";
import { COVERAGE_TIERS } from "@/lib/pricing";
import { quoteAll, getProvider, runProvider } from "@/lib/quote-providers/registry";
import type { QuoteInput } from "@/lib/quote-providers/types";

const quoteSchema = z.object({
  vehicleType: z.enum(["Auto", "Moto"]),
  brand: z.string().min(1).max(60),
  model: z.string().min(1).max(60),
  version: z.string().max(120).optional(),
  year: z.number().int().min(1980).max(2100),
  vehicleValueARS: z.number().positive(),
  hasGnc: z.boolean(),
  gncValueARS: z.number().nonnegative().optional(),
  postalCode: z.string().min(1).max(10),
  catalogVersionId: z.number().int().positive().optional(),
  coverage: z.enum(COVERAGE_TIERS).optional(),
  driversUnder25: z.boolean().optional(),
  garageParking: z.boolean().optional(),
  zeroKm: z.boolean().optional(),
  trackingEquipment: z.boolean().optional(),
  providerCodes: z
    .record(z.string(), z.record(z.string(), z.union([z.string(), z.number()])))
    .optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data as QuoteInput;
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("provider");

  try {
    let results;
    if (providerId) {
      const provider = getProvider(providerId);
      if (!provider) {
        return NextResponse.json({ error: `Proveedor '${providerId}' desconocido` }, { status: 400 });
      }
      results = [await runProvider(provider, input)];
    } else {
      results = await quoteAll(input);
    }

    if (process.env.NODE_ENV === "production") {
      for (const r of results) delete r.raw;
    }
    return NextResponse.json({ data: results });
  } catch (err) {
    console.error("Error en /api/quote", err);
    const message = err instanceof Error ? err.message : "Error consultando proveedores";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
