import Hero from "@/components/sections/Hero";
import QuickActions from "@/components/sections/QuickActions";
import BentoGrid from "@/components/sections/BentoGrid";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import PinnedShowcase from "@/components/sections/PinnedShowcase";
import Sucursales from "@/components/sections/Sucursales";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import CtaBanner from "@/components/sections/CtaBanner";
import Cotizador from "@/components/shared/Cotizador";
import Preloader from "@/components/shared/Preloader";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

export default function HomePage() {
  return (
    <Preloader>
      <Hero />
      <QuickActions />
      <BentoGrid />
      <section id="cotizador" className="bg-bg-muted scroll-mt-20 py-20 md:py-24">
        <div className="mx-auto max-w-300 px-6">
          <div className="mx-auto max-w-150">
            <SectionLabel>Cotizador</SectionLabel>
            <SectionTitle size="md" className="mt-4">
              Cotiza tu seguro de auto o moto en simples pasos
            </SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Completa el formulario y te enviamos la mejor opcion por
              WhatsApp.
            </p>
            <div className="mt-8">
              <Cotizador />
            </div>
          </div>
        </div>
      </section>
      <MarqueeStrip />
      <PinnedShowcase />
      <Sucursales />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </Preloader>
  );
}
