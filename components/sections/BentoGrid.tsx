"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { COVERAGES } from "@/constants/site";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

const SPANS: Record<string, string> = {
  automotor: "sm:col-span-2 sm:row-span-2",
  hogar: "sm:col-span-2 sm:row-span-1",
};

export default function BentoGrid() {
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
          <SectionLabel>Coberturas</SectionLabel>
          <SectionTitle className="mt-4">
            Una cobertura para cada aspecto de tu vida
          </SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Elegi el seguro que necesitas y te asesoramos sin costo para
            encontrar la mejor opcion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:grid-rows-3 sm:h-[600px]">
          {COVERAGES.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`${SPANS[c.slug] ?? ""} h-56 sm:h-full`}
            >
              <Link
                href={`/coberturas/${c.slug}`}
                prefetch={true}
                className="group relative flex h-full w-full flex-col justify-end overflow-hidden"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="from-brand-dark/90 via-brand-dark/20 absolute inset-0 bg-linear-to-t to-transparent" />
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-white/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                <div className="relative p-5">
                  <h3 className="font-heading text-base font-bold text-white">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gray-300">
                    {c.tags}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
