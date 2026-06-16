"use client"

import { motion } from "framer-motion"
import { WHY_US } from "@/constants/site"
import IconRenderer from "@/components/shared/IconRenderer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function WhyUs() {
  return (
    <section className="bg-bg-surface py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-16 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-2"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-rose">
              Por qué elegirnos
            </span>
            <h2 className="mt-3 font-display text-[clamp(32px,4vw,44px)] font-bold leading-[1.1] tracking-tight text-text-primary">
              Más que una
              <br />
              corredora de seguros
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
              No solo vendemos pólizas. Construimos relaciones de confianza que
              atraviesan generaciones.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-10 lg:col-span-3"
          >
            {WHY_US.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group flex gap-5 rounded-2xl border border-transparent p-5 transition-all hover:border-border hover:bg-bg-page"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-rose/10 to-brand-violet/10 ring-1 ring-brand-rose/10">
                  <IconRenderer name={item.icon} className="h-5 w-5 text-brand-rose" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
