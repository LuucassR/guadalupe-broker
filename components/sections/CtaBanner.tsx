"use client"

import { motion } from "framer-motion"
import { SITE_CONFIG } from "@/constants/site"
import { MessageCircle, ArrowRight } from "lucide-react"

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-rose via-brand-rose to-brand-violet py-32 md:py-48">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mx-auto max-w-[1200px] px-6 text-center"
      >
        <h2 className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.08] tracking-tight text-white">
          Necesitas cotizar un seguro?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/70">
          Escribinos por WhatsApp y te respondemos en minutos.
        </p>
        <div className="mt-10">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-sm font-bold text-brand-rose shadow-2xl transition-all hover:scale-[1.02] hover:shadow-white/30"
          >
            <MessageCircle className="h-5 w-5" />
            Escribinos ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
