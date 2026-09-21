import { createHmac, randomUUID } from "node:crypto";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";

// Registra cada llamada del cliente a la API en la tabla Consult (una fila por
// sesion del navegador, ver prisma/schema.prisma). Nunca debe romper ni demorar
// la respuesta: corre en after() y traga sus propios errores.

const SESSION_RE = /^[A-Za-z0-9_-]{8,64}$/;

export type ConsultStep = "brands" | "models" | "versions" | "value" | "quote" | "lead";

export interface ConsultEvent {
  step: ConsultStep;
  vehicleType?: "Auto" | "Moto";
  brand?: string;
  model?: string;
  version?: string;
  year?: number;
  vehicleValueARS?: number;
  postalCode?: string;
  hasGnc?: boolean;
  complete?: boolean;
  leadId?: string;
  error?: string;
  provider?: { id: string; ok: boolean; plans: number; minMonthly: number | null; error?: string };
}

// El ip nunca se guarda en claro: HMAC con un secreto del servidor.
function hashIp(request: Request): string | undefined {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return undefined;
  const secret = process.env.ADMIN_IP_HASH_SECRET ?? process.env.DATABASE_URL ?? "consult";
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

export function logConsult(request: Request, event: ConsultEvent) {
  const header = request.headers.get("x-consult-session") ?? "";
  // Sin sesion (llamada directa a la API) cada request queda como su propia fila.
  const sessionId = SESSION_RE.test(header) ? header : `req-${randomUUID()}`;
  const visitorHeader = request.headers.get("x-visitor-id") ?? "";
  const visitorId = SESSION_RE.test(visitorHeader) ? visitorHeader : undefined;
  const ipHash = hashIp(request);
  const userAgent = request.headers.get("user-agent")?.slice(0, 200) ?? undefined;

  after(async () => {
    try {
      const fields = {
        vehicleType: event.vehicleType,
        brand: event.brand,
        model: event.model,
        version: event.version,
        year: event.year,
        vehicleValueARS: event.vehicleValueARS,
        postalCode: event.postalCode,
        hasGnc: event.hasGnc,
        leadId: event.leadId,
        visitorId,
        lastError: event.error ?? null,
      };
      // undefined = "no toques este campo": una consulta parcial no pisa datos
      // que un paso anterior ya cargo.
      await prisma.consult.upsert({
        where: { sessionId },
        create: {
          sessionId,
          ...fields,
          lastStep: event.step,
          status: event.complete ? "complete" : "incomplete",
          ipHash,
          userAgent,
        },
        update: {
          ...fields,
          lastStep: event.step,
          requestCount: { increment: 1 },
          ...(event.complete ? { status: "complete" } : {}),
        },
      });

      if (event.provider) {
        // Varios proveedores cotizan en paralelo para la misma sesion: se
        // mezcla en jsonb en la DB para que ninguno pise al otro.
        const { id, ...result } = event.provider;
        await prisma.$executeRaw`
          UPDATE "Consult"
          SET "providerResults" = COALESCE("providerResults", '{}'::jsonb) || ${JSON.stringify({ [id]: result })}::jsonb
          WHERE "sessionId" = ${sessionId}`;
      }
    } catch (err) {
      console.error("No se pudo registrar la consulta", err);
    }
  });
}
