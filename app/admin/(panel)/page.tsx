import Link from "next/link";
import { ArrowRight, Bike, Car, CheckCircle2, CircleDashed, Layers, TrendingUp } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { STEP_LABEL, dashboardData, formatDateTime } from "@/lib/admin/consults";
import { requireAdmin } from "@/lib/admin/session";

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export default async function DashboardPage() {
  const user = await requireAdmin();
  const { auto, moto, unclassified, daily, recent } = await dashboardData();

  const complete = auto.complete + moto.complete;
  const incomplete = auto.incomplete + moto.incomplete;
  const total = complete + incomplete;
  const max = Math.max(1, ...daily.map((d) => d.complete + d.incomplete));

  const kpis = [
    { label: "Consultas totales", value: total, icon: Layers, tone: "bg-sky-50 text-sky-600" },
    { label: "Completas", value: complete, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Incompletas", value: incomplete, icon: CircleDashed, tone: "bg-amber-50 text-amber-600" },
    { label: "Conversión", value: `${pct(complete, total)}%`, icon: TrendingUp, tone: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Hola, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-500">Resumen de lo que los clientes consultan en el cotizador.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm">
            <span className={`mb-3 flex size-9 items-center justify-center rounded-[10px] ${tone}`}>
              <Icon className="size-[18px]" />
            </span>
            <p className="font-heading text-3xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading font-semibold">Últimos 14 días</h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <i className="size-2.5 rounded-sm bg-emerald-500" /> Completas
              </span>
              <span className="flex items-center gap-1.5">
                <i className="size-2.5 rounded-sm bg-amber-400" /> Incompletas
              </span>
            </div>
          </div>
          <div className="flex h-44 items-end gap-1.5 sm:gap-2">
            {daily.map((d) => {
              const sum = d.complete + d.incomplete;
              return (
                <div
                  key={d.day}
                  className="group flex h-full flex-1 flex-col justify-end"
                  title={`${d.day}: ${d.complete} completas, ${d.incomplete} incompletas`}
                >
                  <div
                    className="flex flex-col justify-end overflow-hidden rounded-t-md"
                    style={{ height: `${(sum / max) * 100}%`, minHeight: sum ? 4 : 0 }}
                  >
                    <div className="bg-amber-400" style={{ flex: d.incomplete }} />
                    <div className="bg-emerald-500" style={{ flex: d.complete }} />
                  </div>
                  <span className="mt-2 text-center text-[10px] text-slate-400">{d.day.slice(8)}</span>
                </div>
              );
            })}
          </div>
          {total === 0 && (
            <p className="mt-4 text-center text-sm text-slate-400">Todavía no hay consultas registradas.</p>
          )}
        </section>

        <section className="space-y-3">
          {[
            { label: "Autos", href: "/admin/autos", icon: Car, data: auto },
            { label: "Motos", href: "/admin/motos", icon: Bike, data: moto },
          ].map(({ label, href, icon: Icon, data }) => (
            <Link
              key={label}
              href={href}
              className="group block rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 font-heading font-semibold">
                  <Icon className="size-5 text-sky-600" /> {label}
                </span>
                <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500" />
              </div>
              <p className="font-heading mt-3 text-3xl font-semibold tabular-nums">{data.total}</p>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="bg-emerald-500" style={{ width: `${pct(data.complete, data.total)}%` }} />
                <div className="bg-amber-400" style={{ width: `${pct(data.incomplete, data.total)}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {data.complete} completas · {data.incomplete} incompletas
              </p>
            </Link>
          ))}
          {unclassified > 0 && (
            <p className="px-1 text-xs text-slate-400">
              {unclassified} consultas sin tipo de vehículo (llamadas parciales o inválidas).
            </p>
          )}
        </section>
      </div>

      <section className="rounded-[16px] border border-slate-200 bg-white shadow-sm">
        <h2 className="font-heading border-b border-slate-100 px-5 py-4 font-semibold">Actividad reciente</h2>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">Sin actividad todavía.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/consultas/${c.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-slate-100 text-slate-500">
                    {c.vehicleType === "Moto" ? <Bike className="size-4" /> : <Car className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {[c.brand, c.model].filter(Boolean).join(" ")
                        ? [c.brand, c.model, c.year].filter(Boolean).join(" ")
                        : "Consulta sin datos del vehículo"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {STEP_LABEL[c.lastStep] ?? c.lastStep} · {formatDateTime(c.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
