import { NextResponse } from "next/server";
import { z } from "zod";
import { logConsult, type ConsultEvent } from "@/lib/consult-log";
import { COVERAGE_TIERS } from "@/lib/pricing";
import { quoteAll, getProvider, runProvider } from "@/lib/quote-providers/registry";
import type { QuoteInput } from "@/lib/quote-providers/types";

const quoteSchema = z
  .object({
    vehicleType: z.enum(["Auto", "Moto"]),
    brand: z.string().min(1).max(60),
    model: z.string().min(1).max(60),
    version: z.string().max(120).optional(),
    year: z.number().int().min(1980).max(2100),
    vehicleValueARS: z.number().nonnegative(),
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
  })
  // Las motos no tienen valuacion propia (Cooperación usa su tabla): valor 0 OK.
  .refine((q) => q.vehicleType === "Moto" || q.vehicleValueARS > 0, {
    path: ["vehicleValueARS"],
    message: "vehicleValueARS debe ser positivo",
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
    // Consulta incompleta: se registra igual, con lo poco valido que traiga.
    const b = (body ?? {}) as Record<string, unknown>;
    logConsult(request, {
      step: "quote",
      vehicleType: b.vehicleType === "Auto" || b.vehicleType === "Moto" ? b.vehicleType : undefined,
      brand: typeof b.brand === "string" ? b.brand.slice(0, 60) : undefined,
      model: typeof b.model === "string" ? b.model.slice(0, 60) : undefined,
      error: "Datos invalidos",
    });
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data as QuoteInput;
  const vehicle = {
    step: "quote" as const,
    vehicleType: input.vehicleType,
    brand: input.brand,
    model: input.model,
    version: input.version,
    year: input.year,
    vehicleValueARS: input.vehicleValueARS,
    postalCode: input.postalCode,
    hasGnc: input.hasGnc,
  };
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

    // Un evento por proveedor; la consulta queda "complete" si alguno cotizo.
    for (const r of results) {
      const prices = r.plans.map((p) => p.monthlyPremium).filter((n): n is number => n != null);
      const event: ConsultEvent = {
        ...vehicle,
        complete: r.ok && r.plans.length > 0,
        error: r.ok ? undefined : r.error,
        provider: {
          id: r.providerId,
          ok: r.ok,
          plans: r.plans.length,
          minMonthly: prices.length ? Math.min(...prices) : null,
          error: r.error,
        },
      };
      logConsult(request, event);
    }

    if (process.env.NODE_ENV === "production") {
      for (const r of results) delete r.raw;
    }
    return NextResponse.json({ data: results });
  } catch (err) {
    console.error("Error en /api/quote", err);
    const message = err instanceof Error ? err.message : "Error consultando proveedores";
    logConsult(request, { ...vehicle, error: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
