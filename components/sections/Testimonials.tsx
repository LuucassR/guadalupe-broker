"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { REVIEWS } from "@/constants/site";
import { Star, ArrowRight } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";
import GoogleRatingCard from "@/components/shared/GoogleRatingCard";

export default function Testimonials() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-300 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <SectionLabel>Testimonios</SectionLabel>
          <SectionTitle className="mt-4">
            La confianza se construye con los años
          </SectionTitle>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GoogleRatingCard />
          </motion.div>

          {REVIEWS.slice(0, 2).map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.08 }}
              className="flex h-full flex-col border border-gray-100 bg-white p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                {/* iniciales como placeholder hasta tener foto/logo real del cliente */}
                <div className="bg-brand-accent-soft text-brand-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {review.initials}
                </div>
                <div className="text-left">
                  <p className="text-brand-dark text-sm font-semibold">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cliente de Guadalupe Broker
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/clientes"
          prefetch={true}
          className="text-brand-accent group mt-8 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          Ver todas las opiniones
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
