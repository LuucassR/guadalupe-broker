"use client"

import { motion } from "framer-motion"
import { SITE_CONFIG, REVIEWS } from "@/constants/site"
import { Star } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function Reviews() {
  return (
    <section className="bg-bg-muted py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-rose">
            Testimonios
          </span>
          <h2 className="mt-3 font-display text-[clamp(32px,4vw,44px)] font-bold leading-[1.1] tracking-tight text-text-primary">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.name}
              variants={itemVariants}
              className="relative rounded-2xl bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,0.03),0_8px_32px_rgba(0,0,0,0.04)]"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-rose to-brand-violet text-sm font-bold text-white shadow-lg">
                  {review.initials}
                </span>
              </div>
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed italic text-text-secondary">
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {review.name}
                </p>
                <p className="text-xs text-text-muted">
                  Cliente de Guadalupe Broker
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href={SITE_CONFIG.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-brand-rose"
          >
            Ver todas las opiniones en Google
            <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
