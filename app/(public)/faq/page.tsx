"use client"

import { useState } from "react"
import Image from "next/image"
import { FAQS, FAQ_CATEGORIES } from "@/constants/site"
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [category, setCategory] = useState("todas")

  const filtered =
    category === "todas"
      ? FAQS
      : FAQS.filter((faq) => faq.category === category)

  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
            fill
            priority
          />
          <div className="absolute inset-0 bg-brand-dark/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            FAQ
          </span>
          <h1 className="mt-4 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.05] tracking-tight text-white max-w-3xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Resolvemos tus dudas sobre nuestros seguros y servicios. Si no
            encontras lo que buscas, escribinos por WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id)
                  setOpenIndex(null)
                }}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  category === cat.id
                    ? "bg-brand-dark text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50/50"
                >
                  <span className="pr-4 text-sm font-semibold text-brand-dark">
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
                    <p className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-500">
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

          <div className="mt-12 rounded-xl bg-bg-muted p-6 text-center">
            <p className="text-sm text-gray-500">
              No encontras lo que buscas?
            </p>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-rose px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" />
              Consultanos por WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
