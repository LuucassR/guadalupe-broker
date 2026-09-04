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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seguros de auto, moto y más en Santa Fe | Guadalupe Broker",
  description:
    "Cotizá tu seguro de auto o moto en minutos y compará precios de varias aseguradoras. Corredora de seguros con más de 60 años y 3 generaciones en Santa Fe.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Preloader>
      <Hero />
      <QuickActions />
      <BentoGrid />
      <section
        id="cotizador"
        className="bg-bg-muted scroll-mt-20 py-20 md:py-24"
      >
        <div className="mx-auto max-w-300 px-6">
          <div className="mx-auto max-w-150">
            <SectionLabel>Cotizador</SectionLabel>
            <SectionTitle size="md" className="mt-4">
              Cotizá tu seguro de auto o moto en simples pasos
            </SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Completá el formulario y compará coberturas y precios al instante.
              Un asesor confirma la mejor opción por WhatsApp.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-4xl">
            <Cotizador />
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
