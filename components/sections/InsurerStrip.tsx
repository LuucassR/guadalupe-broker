"use client"

import { motion } from "framer-motion"
import { INSURERS } from "@/constants/site"

const TICK = " · "

export default function InsurerStrip() {
  const items = [...INSURERS, ...INSURERS]

  return (
    <section className="border-y border-border bg-bg-surface py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-bold uppercase tracking-[0.15em] text-text-muted"
        >
          Trabajamos con las mejores compañías
        </motion.p>

        <div className="relative overflow-hidden">
          <div className="flex animate-[marquee_24s_linear_infinite] gap-12 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex items-center gap-12 text-sm font-medium tracking-wide text-text-secondary"
              >
                {name}
                {i < items.length - 1 && (
                  <span className="text-brand-rose/30">{TICK}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
