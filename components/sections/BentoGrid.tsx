"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BENTO_ITEMS } from "@/constants/site"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

export default function BentoGrid() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Coberturas
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-3xl">
            Soluciones de seguro para cada aspecto de tu vida
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-flow-dense">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl bg-white ${item.span}`}
            >
              <Link
                href={`/coberturas/${item.slug}`}
                prefetch={true}
                className="block h-full"
              >
                <div className="relative h-full min-h-[220px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70">
                        {item.slug}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white md:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60 max-w-md">
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
