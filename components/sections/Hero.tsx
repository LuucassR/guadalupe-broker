"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES, INSURERS, COVERAGES } from "@/constants/site";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { image: "/homePageImage.jpg" },
  { image: COVERAGES[0].image },
  { image: COVERAGES[1].image },
];

const STATS = [
  { value: "60+", label: "años" },
  { value: "3", label: "generaciones" },
  { value: `${BRANCHES.length}`, label: "sucursales" },
  { value: `${INSURERS.length}`, label: "aseguradoras" },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % SLIDES.length);

  return (
    <section className="relative flex min-h-160 flex-col justify-end overflow-hidden pt-24 md:min-h-180 md:pt-32">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[slide].image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="from-brand-dark/90 via-brand-dark/40 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>

      <button
        onClick={prev}
        aria-label="Imagen anterior"
        className="absolute top-1/2 left-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Imagen siguiente"
        className="absolute top-1/2 right-4 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="relative z-10 mx-auto w-full max-w-300 px-6 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl bg-white/50 p-8 shadow-[0_24px_60px_-24px_rgba(11,31,51,0.5)] md:p-10"
        >
          <span className="text-brand-purple text-[11px] font-bold tracking-[0.2em] uppercase">
            Corredora de seguros · Santa Fe
          </span>
          <h1 className="font-heading text-brand-dark mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.15] font-bold tracking-tight">
            Somos un broker de seguros especializado en identificar y
            administrar riesgos, ofreciendo la mejor alternativa
            costo-beneficio.
          </h1>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="#cotizador"
              className="group bg-brand-purple hover:bg-brand-purple-hover inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-purple-900/10 transition-colors"
            >
              Cotiza ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/nosotros"
              prefetch={true}
              className="inline-flex items-center gap-2.5 border border-gray-200 px-7 py-3.5 text-sm font-semibold tracking-wide text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Nuestra historia
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap gap-x-10 gap-y-4"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-2xl font-bold text-white">
                {s.value}
              </p>
              <p className="text-xs text-gray-300">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
