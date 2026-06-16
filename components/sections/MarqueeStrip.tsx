"use client"

import { INSURERS } from "@/constants/site"

export default function MarqueeStrip() {
  const doubled = [...INSURERS, ...INSURERS, ...INSURERS]

  return (
    <section className="border-t border-b border-border/50 bg-white py-16">
      <span className="mx-auto mb-8 block max-w-[1200px] px-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
        Companias aliadas
      </span>

      <div className="relative overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-16 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-16 text-sm font-semibold tracking-widest uppercase text-gray-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
