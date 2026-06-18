"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  q: string
  a: string
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map((faq, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
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
  )
}
