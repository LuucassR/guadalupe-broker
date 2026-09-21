import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const PAGE_SIZE = 20;
export const TZ = "America/Argentina/Buenos_Aires";

export type VehicleSection = "Auto" | "Moto";
export type StatusFilter = "all" | "complete" | "incomplete";

export const STEP_LABEL: Record<string, string> = {
  brands: "Eligió tipo / marcas",
  models: "Eligió marca y año",
  versions: "Eligió modelo",
  value: "Obtuvo valuación",
  quote: "Cotizó",
  lead: "Dejó sus datos",
};

export interface ConsultFilters {
  vehicleType?: VehicleSection;
  status?: StatusFilter;
  q?: string;
  page?: number;
}

const buildWhere = ({ vehicleType, status, q }: ConsultFilters): Prisma.ConsultWhereInput => ({
  ...(vehicleType ? { vehicleType } : {}),
  ...(status === "complete" || status === "incomplete" ? { status } : {}),
  ...(q
    ? {
        OR: [
          { brand: { contains: q, mode: "insensitive" } },
          { model: { contains: q, mode: "insensitive" } },
          { postalCode: { contains: q } },
          { sessionId: { contains: q } },
        ],
      }
    : {}),
});

export async function listConsults(filters: ConsultFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const where = buildWhere(filters);
  const [rows, total] = await Promise.all([
    prisma.consult.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.consult.count({ where }),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export interface VisitorContact {
  name: string;
  phone: string;
  email: string | null;
}

// Si una persona dejo un lead en cualquier visita, todas sus consultas (tambien
// las incompletas) quedan asociadas a ese contacto via el visitorId. Devuelve el
// contacto mas reciente por visitorId.
export async function identifyVisitors(visitorIds: (string | null)[]) {
  const ids = [...new Set(visitorIds.filter((v): v is string => Boolean(v)))];
  const contacts = new Map<string, VisitorContact>();
  if (ids.length === 0) return contacts;

  const withLead = await prisma.consult.findMany({
    where: { visitorId: { in: ids }, leadId: { not: null } },
    orderBy: { updatedAt: "desc" },
    select: { visitorId: true, leadId: true },
  });
  const leads = await prisma.lead.findMany({
    where: { id: { in: withLead.map((c) => c.leadId!) } },
    select: { id: true, name: true, phone: true, email: true },
  });
  const byLead = new Map(leads.map((l) => [l.id, l]));
  for (const c of withLead) {
    const lead = byLead.get(c.leadId!);
    if (c.visitorId && lead && !contacts.has(c.visitorId)) contacts.set(c.visitorId, lead);
  }
  return contacts;
}

export async function sectionCounts(vehicleType: VehicleSection) {
  const [complete, incomplete] = await Promise.all([
    prisma.consult.count({ where: { vehicleType, status: "complete" } }),
    prisma.consult.count({ where: { vehicleType, status: "incomplete" } }),
  ]);
  return { complete, incomplete, total: complete + incomplete };
}

export async function dashboardData(days = 14) {
  const [auto, moto, unclassified, daily, recent] = await Promise.all([
    sectionCounts("Auto"),
    sectionCounts("Moto"),
    prisma.consult.count({ where: { vehicleType: null } }),
    prisma.$queryRaw<{ day: string; complete: number; incomplete: number }[]>`
      SELECT to_char(d.day, 'YYYY-MM-DD') AS day,
             COUNT(c.*) FILTER (WHERE c."status" = 'complete')::int   AS complete,
             COUNT(c.*) FILTER (WHERE c."status" = 'incomplete')::int AS incomplete
      FROM generate_series(
             (now() AT TIME ZONE ${TZ})::date - ${days - 1}::int,
             (now() AT TIME ZONE ${TZ})::date, '1 day') AS d(day)
      LEFT JOIN "Consult" c
        ON (c."createdAt" AT TIME ZONE ${TZ})::date = d.day::date
      GROUP BY d.day ORDER BY d.day`,
    prisma.consult.findMany({ orderBy: { updatedAt: "desc" }, take: 8 }),
  ]);
  return { auto, moto, unclassified, daily, recent };
}

export const formatDateTime = (d: Date) =>
  new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

export const formatARS = (n: number | null | undefined) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
