"use client";

import { motion } from "framer-motion";
import { BRANCHES } from "@/constants/site";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";
import BranchCard from "@/components/shared/BranchCard";

export default function Sucursales() {
  return (
    <section className="bg-bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-300 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <SectionLabel>Sucursales</SectionLabel>
          <SectionTitle className="mt-4">Donde encontrarnos</SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Tres oficinas en Santa Fe, listas para atenderte en persona,
            por telefono o por WhatsApp.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <BranchCard branch={b} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
