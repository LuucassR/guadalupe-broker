"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SITE_CONFIG, COVERAGES } from "@/constants/site"
import IconRenderer from "@/components/shared/IconRenderer"
import { ArrowUpRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function CoverageGrid() {
  return (
    <section className="bg-bg-page py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-rose">
            Coberturas
          </span>
          <h2 className="mt-3 font-display text-[clamp(32px,4vw,44px)] font-bold leading-[1.1] tracking-tight text-text-primary">
            Encontrá el seguro
            <br />
            que necesitás
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {COVERAGES.map((item) => (
            <motion.div key={item.slug} variants={itemVariants}>
              <Link
                href={`/coberturas/${item.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all hover:border-brand-rose/30 hover:shadow-[0_8px_40px_rgba(200,75,140,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-rose/10 to-brand-violet/10 ring-1 ring-brand-rose/10">
                    <IconRenderer name={item.icon} className="h-5 w-5 text-brand-rose" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-text-muted transition-all group-hover:text-brand-rose group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-brand-rose/30 hover:bg-white hover:shadow-[0_4px_20px_rgba(200,75,140,0.06)]"
          >
            Consultá sin cargo
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
