import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { STEP_LABEL, formatARS, formatDateTime, identifyVisitors } from "@/lib/admin/consults";
import { prisma } from "@/lib/prisma";

type Providers = Record<
  string,
  { ok: boolean; plans: number; minMonthly: number | null; error?: string }
>;

export default async function ConsultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.consult.findUnique({ where: { id } });
  if (!c) notFound();
  // Contacto: el lead de esta misma consulta o, si abandono, el que la misma
  // persona (mismo visitorId) dejo en otra visita.
  const own = c.leadId
    ? await prisma.lead.findUnique({
        where: { id: c.leadId },
        select: { name: true, phone: true, email: true },
      })
    : null;
  const viaVisitor = !own && c.visitorId ? (await identifyVisitors([c.visitorId])).get(c.visitorId) : undefined;
  const lead = own ?? viaVisitor ?? null;
  const visits = c.visitorId
    ? await prisma.consult.count({ where: { visitorId: c.visitorId } })
    : 0;
  const providers = (c.providerResults ?? {}) as Providers;
  const back = c.vehicleType === "Moto" ? "/admin/motos" : "/admin/autos";

  const rows: [string, string][] = [
    ["Tipo", c.vehicleType ?? "—"],
    ["Marca", c.brand ?? "—"],
    ["Modelo", c.model ?? "—"],
    ["Versión", c.version ?? "—"],
    ["Año", c.year?.toString() ?? "—"],
    ["Valor del vehículo", formatARS(c.vehicleValueARS)],
    ["Código postal", c.postalCode ?? "—"],
    ["GNC", c.hasGnc == null ? "—" : c.hasGnc ? "Sí" : "No"],
  ];

  return (
    <div className="space-y-6">
      <Link href={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-sky-700">
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {[c.brand, c.model].filter(Boolean).join(" ") || "Consulta sin datos del vehículo"}
        </h1>
        <StatusBadge status={c.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="font-heading mb-4 font-semibold">Vehículo consultado</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{k}</dt>
                <dd className="mt-0.5 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="font-heading mt-8 mb-3 font-semibold">Cotizaciones por aseguradora</h2>
          {Object.keys(providers).length === 0 ? (
            <p className="text-sm text-slate-400">No llegó a cotizar.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-[12px] border border-slate-200">
              {Object.entries(providers).map(([pid, r]) => (
                <li key={pid} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="font-medium capitalize">{pid}</span>
                  {r.ok && r.plans > 0 ? (
                    <span className="text-slate-600">
                      {r.plans} planes · desde <b className="text-slate-900">{formatARS(r.minMonthly)}</b>/mes
                    </span>
                  ) : (
                    <span className="truncate text-slate-400">{r.error ?? "Sin precios"}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-heading mb-3 font-semibold">Seguimiento</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Último paso</dt>
                <dd className="font-medium">{STEP_LABEL[c.lastStep] ?? c.lastStep}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Llamadas a la API</dt>
                <dd className="font-medium">{c.requestCount}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Inicio</dt>
                <dd className="font-medium">{formatDateTime(c.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Última actividad</dt>
                <dd className="font-medium">{formatDateTime(c.updatedAt)}</dd>
              </div>
              {c.lastError && (
                <div>
                  <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Último error</dt>
                  <dd className="font-medium text-rose-600">{c.lastError}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-heading mb-3 font-semibold">Contacto</h2>
            {lead ? (
              <dl className="space-y-2 text-sm">
                <dd className="font-medium">{lead.name}</dd>
                <dd className="text-slate-600">{lead.phone}</dd>
                {lead.email && <dd className="text-slate-600">{lead.email}</dd>}
              </dl>
            ) : (
              <p className="text-sm text-slate-400">
                {c.visitorId
                  ? "Anónimo: todavía no dejó sus datos en ninguna visita."
                  : "El cliente no dejó sus datos."}
              </p>
            )}
            {viaVisitor && (
              <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
                Identificado por otra consulta del mismo navegador.
              </p>
            )}
            {c.visitorId && (
              <p className="mt-3 text-xs text-slate-400">
                {visits} {visits === 1 ? "consulta" : "consultas"} de este visitante
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
