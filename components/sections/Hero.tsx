"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"
import { ArrowRight, Star, ChevronDown } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden bg-brand-dark">
      <div className="absolute inset-0">
        <div className="absolute -top-1/4 -right-1/4 h-[80vmax] w-[80vmax] animate-morph bg-gradient-to-br from-brand-rose/20 via-brand-violet/10 to-transparent opacity-70 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[70vmax] w-[70vmax] animate-morph bg-gradient-to-tr from-brand-violet/15 via-brand-rose/10 to-transparent opacity-60 blur-3xl" style={{ animationDelay: "-3s", animationDuration: "18s" }} />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 animate-float rounded-full bg-gradient-to-br from-brand-rose/10 to-brand-violet/5 blur-2xl" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 animate-float rounded-full bg-gradient-to-tr from-brand-violet/10 to-brand-rose/5 blur-2xl" style={{ animationDuration: "14s", animationDelay: "-4s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(200,75,140,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(91,77,200,0.08)_0%,_transparent_50%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur"
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          4.9 · 39 opiniones en Google
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-display text-[clamp(48px,8vw,96px)] font-bold leading-[0.95] tracking-tight text-white"
        >
          Tu tranquilidad,{" "}
          <span className="bg-gradient-to-r from-brand-rose via-white to-brand-violet bg-clip-text text-transparent">
            nuestra promesa
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 md:text-lg"
        >
          Más de 60 años y tres generaciones protegiendo familias y empresas en Santa Fe. Encontramos la cobertura ideal para vos, sin vueltas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.45 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-br from-brand-rose to-brand-violet px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-2xl shadow-brand-rose/25 transition-all hover:shadow-amber-500/20 hover:scale-[1.02]"
          >
            Cotizá ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/nosotros"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold tracking-wide text-white/80 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
          >
            Conocé nuestra historia
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-white/30" />
      </motion.div>
    </section>
  )
}
