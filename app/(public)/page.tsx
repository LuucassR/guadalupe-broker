import Hero from "@/components/sections/Hero"
import BentoGrid from "@/components/sections/BentoGrid"
import MarqueeStrip from "@/components/sections/MarqueeStrip"
import PinnedShowcase from "@/components/sections/PinnedShowcase"
import Testimonials from "@/components/sections/Testimonials"
import CtaBanner from "@/components/sections/CtaBanner"
import Cotizador from "@/components/shared/Cotizador"
import Preloader from "@/components/shared/Preloader"

export default function HomePage() {
  return (
    <Preloader>
      <Hero />
      <BentoGrid />
      <section className="py-20 md:py-24 bg-bg-muted">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto max-w-[600px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
              Cotizador
            </span>
            <h2 className="mt-4 text-[clamp(24px,3vw,32px)] font-bold leading-[1.08] tracking-tight text-brand-dark">
              Cotiza tu seguro en 3 pasos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Completa el formulario y te enviamos la mejor opcion por WhatsApp.
            </p>
            <div className="mt-8">
              <Cotizador />
            </div>
          </div>
        </div>
      </section>
      <MarqueeStrip />
      <PinnedShowcase />
      <Testimonials />
      <CtaBanner />
    </Preloader>
  )
}
