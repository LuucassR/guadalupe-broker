import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logConsult } from "@/lib/consult-log";
import { COVERAGE_TIERS } from "@/lib/pricing";

const vehicleDetailsSchema = z
  .object({
    vehicleType: z.enum(["Auto", "Moto"]).optional(),
    brand: z.string().max(60).optional(),
    model: z.string().max(60).optional(),
    year: z.string().max(4).optional(),
    hasGnc: z.boolean().optional(),
    postalCode: z.string().max(10).optional(),
    selectedTier: z.enum(COVERAGE_TIERS).optional(),
    franquiciaPct: z.number().min(0).max(20).optional(),
    estimatedPrice: z.number().nonnegative().optional(),
    quote: z
      .array(
        z.object({ tier: z.string(), label: z.string(), monthlyPrice: z.number() }),
      )
      .optional(),
  })
  .optional();

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(120),
  phone: z.string().trim().min(6, "Telefono invalido").max(30),
  email: z
    .union([z.email(), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  cobertura: z.string().max(60).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(40).optional().default("web"),
  details: vehicleDetailsSchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    logConsult(request, { step: "lead", error: "Datos invalidos" });
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        cobertura: parsed.data.cobertura,
        message: parsed.data.message,
        source: parsed.data.source,
        details: parsed.data.details,
      },
    });
    const d = parsed.data.details;
    logConsult(request, {
      step: "lead",
      vehicleType: d?.vehicleType,
      brand: d?.brand,
      model: d?.model,
      year: d?.year ? Number(d.year) || undefined : undefined,
      postalCode: d?.postalCode,
      hasGnc: d?.hasGnc,
      complete: true,
      leadId: lead.id,
    });
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("Error creando lead", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
