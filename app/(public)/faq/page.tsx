"use client";

import { useState } from "react";
import { FAQS, FAQ_CATEGORIES } from "@/constants/site";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import PageHero from "@/components/shared/PageHero";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [category, setCategory] = useState("todas");

  const filtered =
    category === "todas"
      ? FAQS
      : FAQS.filter((faq) => faq.category === category);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        description="Resolvemos tus dudas sobre nuestros seguros y servicios. Si no encontras lo que buscas, escribinos por WhatsApp."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 text-xs font-semibold transition-colors ${
                  category === cat.id
                    ? "bg-brand-dark text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden border border-gray-100 bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50/50"
                >
                  <span className="text-brand-dark pr-4 text-sm font-semibold">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === i
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-sm text-gray-400">
              No encontramos preguntas para esta categoria.
            </p>
          )}

          <div className="bg-bg-muted mt-12 p-6 text-center">
            <p className="text-sm text-gray-600">No encontras lo que buscas?</p>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-purple hover:bg-brand-purple-hover mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Consultanos por WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
