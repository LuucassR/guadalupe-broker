"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BENTO_ITEMS } from "@/constants/site"
import { ArrowUpRight } from "lucide-react"

export default function BentoGrid() {
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
            Coberturas
          </span>
          <h2 className="mt-4 text-[clamp(32px,4vw,44px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-3xl">
            Soluciones de seguro para cada aspecto de tu vida
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-flow-dense">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bg-white ${item.span}`}
            >
              <Link
                href={`/coberturas/${item.slug}`}
                className="block h-full"
              >
                <div className="relative h-full min-h-[240px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                        {item.slug}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60 max-w-md">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
