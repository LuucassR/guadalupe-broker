"use client"

import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"
import { ArrowRight
 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/santafe/1920/1080"
          alt=""
          className="h-full w-full object-cover grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/50 to-brand-dark/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,75,140,0.15)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <h1 className="text-[clamp(3rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-white">
          Tu tranquilidad,{" "}
          <span className="bg-gradient-to-r from-brand-rose via-white to-brand-violet bg-clip-text text-transparent">
            nuestra herencia
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
          Mas de 60 anos y tres generaciones protegiendo familias y empresas
          en Santa Fe. Encontramos la cobertura ideal para vos.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-sm font-semibold tracking-wide text-brand-dark shadow-2xl transition-all hover:scale-[1.02] hover:shadow-white/20"
          >
            Cotiza ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
          >
            Nuestra historia
          </Link>
        </div>
      </div>
    </section>
  )
}
