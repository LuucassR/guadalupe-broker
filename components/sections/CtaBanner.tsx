"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/constants/site";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="bg-brand-dark relative overflow-hidden py-24 md:py-32">
      <span
        aria-hidden
        className="font-heading pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-[12%] text-[42vw] leading-none font-black text-white/4 select-none md:translate-x-[8%] md:text-[26vw]"
      >
        60
      </span>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mx-auto max-w-300 px-6"
      >
        <div className="max-w-xl">
          <div className="bg-brand-purple mb-6 h-px w-16" />
          <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] leading-[1.08] font-bold tracking-tight text-white">
            60 años cotizando tranquilidad para Santa Fe
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-300">
            Escribinos por WhatsApp y te respondemos en minutos, sin
            vueltas.
          </p>
          <div className="mt-8">
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-brand-purple hover:bg-brand-purple-hover inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Escribinos ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
