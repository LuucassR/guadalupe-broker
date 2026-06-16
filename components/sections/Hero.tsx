import Link from "next/link"
import { SITE_CONFIG, STATS } from "@/constants/site"
import { ArrowRight, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-bg-page pt-32 pb-20 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(200,75,140,0.2)] bg-[#FFF3F8] px-3.5 py-1.5 text-xs font-semibold text-brand-rose">
          <Star className="h-3.5 w-3.5 fill-current" />
          4.9 · 39 opiniones en Google
        </div>

        <h1 className="mt-6 max-w-3xl text-[clamp(36px,5vw,52px)] font-extrabold -tracking-[0.03em] text-text-primary leading-[1.1]">
          Tu tranquilidad,{" "}
          <span className="bg-gradient-to-r from-brand-rose to-brand-violet bg-clip-text text-transparent">
            nuestra prioridad.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          Más de 60 años y 3 generaciones protegiendo familias y empresas en
          Santa Fe. Encontramos la cobertura ideal para vos, sin vueltas.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-brand-rose to-brand-violet px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Cotizá ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-muted"
          >
            Conocé más
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white px-6 py-5 text-center md:px-8 md:py-6"
            >
              <div className="text-xl font-bold text-text-primary md:text-2xl">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
