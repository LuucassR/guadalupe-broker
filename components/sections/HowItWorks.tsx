"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { HOW_TO_HIRE } from "@/constants/site";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.55"],
  });

  return (
    <section ref={sectionRef} className="py-20 md:py-24">
      <div className="mx-auto max-w-300 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <SectionLabel>Como funciona</SectionLabel>
          <SectionTitle className="mt-4">
            Cotizar tu seguro es asi de simple
          </SectionTitle>
        </motion.div>

        <div className="relative">
          <div className="absolute top-5 right-0 left-0 hidden h-px bg-gray-200 md:block">
            <motion.div
              style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
              className="bg-brand-purple h-px w-full origin-left"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {HOW_TO_HIRE.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <span className="bg-brand-dark relative z-10 flex h-10 w-10 items-center justify-center text-sm font-bold text-white">
                  {step.step}
                </span>
                <h3 className="text-brand-dark mt-4 text-base font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
