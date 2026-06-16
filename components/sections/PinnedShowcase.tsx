"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { WHY_US } from "@/constants/site"

gsap.registerPlugin(ScrollTrigger)

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: titleRef.current,
        pinSpacing: false,
      })

      const cards = gsap.utils.toArray<HTMLElement>(".showcase-card")
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-brand-dark overflow-hidden"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6 py-32 lg:flex-row lg:py-48">
        <div
          ref={titleRef}
          className="top-32 flex h-fit w-full flex-col lg:sticky lg:w-[35%]"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Por que nosotros
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.08] tracking-tight text-white">
            Tres generaciones protegiendo a Santa Fe
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/40">
            No solo vendemos polizas. Construimos relaciones de confianza que
            atraviesan generaciones en toda la provincia.
          </p>
        </div>

        <div
          ref={galleryRef}
          className="flex w-full flex-col gap-12 lg:w-[65%]"
        >
          {WHY_US.map((item, i) => (
            <div
              key={item.title}
              className="showcase-card flex flex-col gap-6 overflow-hidden rounded-3xl bg-brand-slate/50 ring-1 ring-white/5 md:flex-row"
            >
              <div className="relative h-56 w-full shrink-0 overflow-hidden md:h-auto md:w-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700"
                />
              </div>
              <div className="flex flex-col justify-center px-6 pb-6 md:px-8 md:py-8">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
