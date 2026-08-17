import type { Metadata } from "next";
import Link from "next/link";
import { COVERAGES } from "@/constants/site";
import { ArrowUpRight } from "lucide-react";
import {
  Car,
  Home,
  HeartPulse,
  Store,
  Shield,
  Truck,
  Heart,
  Scale,
} from "lucide-react";
import InsurerBadges from "@/components/shared/InsurerBadges";
import AdvisorCta from "@/components/shared/AdvisorCta";
import PageHero from "@/components/shared/PageHero";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Coberturas | Guadalupe Broker",
};

const ICON_MAP: Record<string, typeof Car> = {
  Car,
  Home,
  HeartPulse,
  Store,
  Shield,
  Truck,
  Heart,
  Scale,
};

const GROUP_ORDER = ["personas", "empresas"] as const;
const GROUP_LABELS = {
  personas: "Para personas",
  empresas: "Para empresas",
};

export default function CoberturasPage() {
  return (
    <>
      <PageHero
        eyebrow="Coberturas"
        title="Todos los seguros que necesitas"
        description="Trabajamos con las principales aseguradoras del pais para ofrecerte la mejor proteccion para vos, tu familia y tu empresa."
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          {GROUP_ORDER.map((group) => {
            const items = COVERAGES.filter((c) => c.group === group);
            return (
              <div key={group} className="mb-12 last:mb-0">
                <h2 className="mb-6 text-xs font-bold tracking-[0.15em] text-gray-400 uppercase">
                  {GROUP_LABELS[group]}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => {
                    const Icon = ICON_MAP[c.icon];
                    return (
                      <Link
                        key={c.slug}
                        href={`/coberturas/${c.slug}`}
                        prefetch={true}
                        className="group border border-gray-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50"
                      >
                        <div className="bg-brand-accent-soft mb-4 flex h-10 w-10 items-center justify-center">
                          <Icon className="text-brand-accent h-5 w-5" />
                        </div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-brand-dark text-base font-bold">
                            {c.name}
                          </h3>
                          <ArrowUpRight className="group-hover:text-brand-purple mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-gray-500">
                          {c.tags}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {c.desc}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <SectionLabel>Aseguradoras</SectionLabel>
          <SectionTitle size="md" className="mt-4 max-w-2xl">
            Trabajamos con las mejores
          </SectionTitle>
          <div className="mt-8">
            <InsurerBadges />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6">
          <SectionLabel>Cotizador</SectionLabel>
          <SectionTitle size="md" className="mt-4">
            Auto o moto? Cotiza online
          </SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Para seguro de auto o moto, cotiza directamente en{" "}
            <Link
              href="/coberturas/automotor"
              prefetch={true}
              className="text-brand-accent font-medium hover:underline"
            >
              nuestra pagina de Automotor
            </Link>
            . Para el resto de las coberturas, un asesor te ayuda por
            WhatsApp.
          </p>
          <div className="mt-8">
            <AdvisorCta />
          </div>
        </div>
      </section>
    </>
  );
}
