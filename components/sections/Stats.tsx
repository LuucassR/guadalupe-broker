"use client"

import { motion } from "framer-motion"
import { STATS } from "@/constants/site"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function Stats() {
  return (
    <section className="border-b border-border bg-bg-surface">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 divide-x divide-border md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="px-8 py-10 text-center md:py-12"
            >
              <div className="font-display text-[clamp(32px,3vw,40px)] font-bold leading-none tracking-tight text-text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
