"use client"

import { motion } from "framer-motion"
import { SITE_CONFIG } from "@/constants/site"
import { MessageCircle, ArrowRight } from "lucide-react"

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-28 md:py-36">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-rose/10 via-brand-violet/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,75,140,0.06)_0%,_transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" aria-hidden="true">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="relative z-10 mx-auto max-w-[1200px] px-6 text-center"
      >
        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-[1.1] tracking-tight text-white">
          ¿Necesitás cotizar
          <br />
          un seguro?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/50">
          Escribinos por WhatsApp y te respondemos en minutos.
        </p>
        <div className="mt-10">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-brand-dark shadow-2xl transition-all hover:scale-[1.02] hover:shadow-white/20"
          >
            <MessageCircle className="h-5 w-5" />
            Escribinos ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
