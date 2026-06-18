import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { COVERAGES } from "@/constants/site"
import { ArrowUpRight } from "lucide-react"
import {
  Car,
  Home,
  HeartPulse,
  Store,
  Shield,
  Truck,
  Heart,
  Scale,
} from "lucide-react"
import InsurerBadges from "@/components/shared/InsurerBadges"
import Cotizador from "@/components/shared/Cotizador"

export const metadata: Metadata = {
  title: "Coberturas | Guadalupe Broker",
}

const ICON_MAP: Record<string, typeof Car> = {
  Car,
  Home,
  HeartPulse,
  Store,
  Shield,
  Truck,
  Heart,
  Scale,
}

const GROUP_ORDER = ["personas", "empresas"] as const
const GROUP_LABELS = {
  personas: "Para personas",
  empresas: "Para empresas",
}

export default function CoberturasPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
            fill
            priority
          />
          <div className="absolute inset-0 bg-brand-dark/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Coberturas
          </span>
          <h1 className="mt-4 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.05] tracking-tight text-white max-w-3xl">
            Todos los seguros que necesitas
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Trabajamos con las principales aseguradoras del pais para ofrecerte
            la mejor proteccion para vos, tu familia y tu empresa.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          {GROUP_ORDER.map((group) => {
            const items = COVERAGES.filter((c) => c.group === group)
            return (
              <div key={group} className="mb-12 last:mb-0">
                <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                  {GROUP_LABELS[group]}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => {
                    const Icon = ICON_MAP[c.icon]
                    return (
                      <Link
                        key={c.slug}
                        href={`/coberturas/${c.slug}`}
                        prefetch={true}
                        className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-rose/10">
                          <Icon className="h-5 w-5 text-brand-rose" />
                        </div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-bold text-brand-dark">
                            {c.name}
                          </h3>
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-rose" />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-gray-500">
                          {c.tags}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                          {c.desc}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Aseguradoras
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-2xl">
            Trabajamos con las mejores
          </h2>
          <div className="mt-8">
            <InsurerBadges />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Cotizador
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark">
            Cotiza en 3 pasos
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Selecciona la cobertura, completa tus datos y recibi la cotizacion
            por WhatsApp.
          </p>
          <div className="mt-8">
            <Cotizador />
          </div>
        </div>
      </section>
    </>
  )
}
