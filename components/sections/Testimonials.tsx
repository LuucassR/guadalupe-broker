"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { REVIEWS } from "@/constants/site"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i === 0 ? REVIEWS.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === REVIEWS.length - 1 ? 0 : i + 1))

  return (
    <section className="py-32 md:py-48">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Testimonios
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-2xl">
            La confianza se construye con los anos
          </h2>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: REVIEWS[index].rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xl leading-relaxed text-gray-700 md:text-2xl">
                &ldquo;{REVIEWS[index].text}&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-rose to-brand-violet text-sm font-bold text-white">
                  {REVIEWS[index].initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-brand-dark">
                    {REVIEWS[index].name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Cliente de Guadalupe Broker
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-brand-rose hover:text-brand-rose"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-brand-rose"
                      : "w-1.5 bg-gray-300"
                  }`}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-brand-rose hover:text-brand-rose"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
