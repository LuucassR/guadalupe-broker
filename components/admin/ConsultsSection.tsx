import Link from "next/link";
import { Bike, Car, ChevronLeft, ChevronRight, Inbox, Search, UserRound } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  STEP_LABEL,
  formatARS,
  formatDateTime,
  identifyVisitors,
  listConsults,
  sectionCounts,
  type StatusFilter,
  type VehicleSection,
} from "@/lib/admin/consults";

interface Props {
  vehicleType: VehicleSection;
  searchParams: { status?: string; q?: string; page?: string };
}

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "complete", label: "Completas" },
  { key: "incomplete", label: "Incompletas" },
];

type Providers = Record<string, { ok: boolean; plans: number; minMonthly: number | null }>;

export default async function ConsultsSection({ vehicleType, searchParams }: Props) {
  const status: StatusFilter =
    searchParams.status === "complete" || searchParams.status === "incomplete"
      ? searchParams.status
      : "all";
  const q = searchParams.q?.trim() || undefined;
  const page = Number(searchParams.page) || 1;

  const [counts, list] = await Promise.all([
    sectionCounts(vehicleType),
    listConsults({ vehicleType, status, q, page }),
  ]);

  const contacts = await identifyVisitors(list.rows.map((c) => c.visitorId));

  const base = vehicleType === "Auto" ? "/admin/autos" : "/admin/motos";
  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status: status === "all" ? undefined : status, q, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };

  const Icon = vehicleType === "Auto" ? Car : Bike;
  const title = vehicleType === "Auto" ? "Autos" : "Motos";
  const rate = counts.total ? Math.round((counts.complete / counts.total) * 100) : 0;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20">
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Consultas de {title}</h1>
          <p className="text-sm text-slate-500">
            Todo lo que los clientes consultaron a la API, completo o a medias.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, tone: "text-slate-900" },
          { label: "Completas", value: counts.complete, tone: "text-emerald-600" },
          { label: "Incompletas", value: counts.incomplete, tone: "text-amber-600" },
          { label: "Conversión", value: `${rate}%`, tone: "text-sky-600" },
        ].map((k) => (
          <div key={k.label} className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{k.label}</p>
            <p className={`font-heading mt-1 text-2xl font-semibold ${k.tone}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[16px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-[10px] bg-slate-100 p-1">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={href({ status: t.key === "all" ? undefined : t.key, page: undefined })}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  status === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <form action={base} className="relative sm:w-72">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Marca, modelo, CP o sesión…"
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </form>
        </div>

        {list.rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Inbox className="size-10 text-slate-300" />
            <p className="font-medium text-slate-700">Sin consultas todavía</p>
            <p className="max-w-sm text-sm text-slate-500">
              Cuando un cliente use el cotizador de {title.toLowerCase()} vas a verlo acá.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Vehículo</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">CP</th>
                  <th className="px-4 py-3">Último paso</th>
                  <th className="px-4 py-3">Aseguradoras</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.rows.map((c) => {
                  const providers = (c.providerResults ?? {}) as Providers;
                  return (
                    <tr key={c.id} className="group transition hover:bg-slate-50">
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                        {formatDateTime(c.updatedAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/consultas/${c.id}`}
                          className="font-medium text-slate-900 group-hover:text-sky-700"
                        >
                          {[c.brand, c.model].filter(Boolean).join(" ") || "Sin datos del vehículo"}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {[c.version, c.year].filter(Boolean).join(" · ")}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700">{formatARS(c.vehicleValueARS)}</td>
                      <td className="px-4 py-3.5 text-slate-700">{c.postalCode ?? "—"}</td>
                      <td className="px-4 py-3.5 text-slate-600">{STEP_LABEL[c.lastStep] ?? c.lastStep}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(providers).map(([id, r]) => (
                            <span
                              key={id}
                              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                r.ok && r.plans > 0
                                  ? "bg-sky-50 text-sky-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <span className="capitalize">{id}</span>
                              {r.ok && r.plans > 0 ? ` · ${r.plans}` : " · sin precio"}
                            </span>
                          ))}
                          {Object.keys(providers).length === 0 && <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {(() => {
                          const who = c.visitorId ? contacts.get(c.visitorId) : undefined;
                          return who ? (
                            <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-700">
                              <UserRound className="size-3.5 text-violet-500" />
                              <span className="font-medium">{who.name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Anónimo</span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {list.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            <span>
              Página {list.page} de {list.pages} · {list.total} consultas
            </span>
            <div className="flex gap-2">
              {list.page > 1 && (
                <Link
                  href={href({ page: String(list.page - 1) })}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="size-4" /> Anterior
                </Link>
              )}
              {list.page < list.pages && (
                <Link
                  href={href({ page: String(list.page + 1) })}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Siguiente <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
