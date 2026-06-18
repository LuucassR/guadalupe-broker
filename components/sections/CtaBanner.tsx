"use client"

import { motion } from "framer-motion"
import { SITE_CONFIG } from "@/constants/site"
import { MessageCircle, ArrowRight } from "lucide-react"

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,75,140,0.08)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mx-auto max-w-[1200px] px-6 text-center"
      >
        <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.08] tracking-tight text-white">
          Necesitas cotizar un seguro?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
          Escribinos por WhatsApp y te respondemos en minutos.
        </p>
        <div className="mt-8">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-brand-dark shadow-lg transition-all hover:brightness-110 hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" />
            Escribinos ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
