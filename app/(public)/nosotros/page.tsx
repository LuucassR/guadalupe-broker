import type { Metadata } from "next";
import { BRANCHES, TIMELINE } from "@/constants/site";
import {
  Building2,
  ShieldCheck,
  Users,
  Target,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import InsurerBadges from "@/components/shared/InsurerBadges";
import PageHero from "@/components/shared/PageHero";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";
import BranchCard from "@/components/shared/BranchCard";

export const metadata: Metadata = {
  title: "Nosotros | Guadalupe Broker",
};

const VALUES = [
  {
    icon: Target,
    title: "Excelencia",
    desc: "Nuestro objetivo es la satisfaccion de nuestros clientes, gracias a la funcionalidad, servicios y atencion que brindamos.",
  },
  {
    icon: Heart,
    title: "Atencion personalizada",
    desc: "Nuestros clientes no son solo un numero. Brindamos asesoramiento adaptado a cada caso particular.",
  },
  {
    icon: Clock,
    title: "Amplia disponibilidad",
    desc: "Tres oficinas a disposicion con variedad de horarios para darte respuestas cuando lo necesites.",
  },
  {
    icon: Sparkles,
    title: "6 decadas de experiencia",
    desc: "Sabemos como hacer nuestro trabajo, y estaremos felices de volcar nuestra experiencia en tu beneficio.",
  },
  {
    icon: Users,
    title: "Somos un equipo",
    desc: "Contamos con personas capacitadas, dispuestas a resolver tus problemas.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Mas de 60 años protegiendo Santa Fe"
        description="Somos un corredor de seguros independiente con historia familiar. Trabajamos para vos, no para las aseguradoras."
        image="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1920&q=80"
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-gray-100 bg-white p-6">
              <Building2 className="text-brand-accent h-6 w-6" />
              <p className="text-brand-dark mt-4 text-3xl font-bold">3</p>
              <p className="mt-1 text-sm text-gray-600">
                Sucursales en Santa Fe
              </p>
            </div>
            <div className="border border-gray-100 bg-white p-6">
              <ShieldCheck className="text-brand-accent h-6 w-6" />
              <p className="text-brand-dark mt-4 text-3xl font-bold">+60</p>
              <p className="mt-1 text-sm text-gray-600">años de experiencia</p>
            </div>
            <div className="border border-gray-100 bg-white p-6">
              <Users className="text-brand-accent h-6 w-6" />
              <p className="text-brand-dark mt-4 text-3xl font-bold">3</p>
              <p className="mt-1 text-sm text-gray-600">
                Generaciones de familia
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <SectionLabel>Historia</SectionLabel>
          <SectionTitle size="md" className="mt-4 max-w-2xl">
            Nuestra trayectoria
          </SectionTitle>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm leading-relaxed text-gray-600">
              Hace 60 años Organizacion Guadalupe de Fregona y Sales inicio su
              actividad aseguradora, vocacion que aun hoy perdura y continua
              vigente a traves de 2 nuevas generaciones.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Hoy, Guadalupe Broker S.R.L. inicia una nueva etapa acorde a los
              nuevos sistemas de comercializacion de seguros, innovacion,
              avances tecnologicos y nuevas coberturas del mercado asegurador.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Nuestro objetivo es la satisfaccion de nuestros clientes, gracias
              a la funcionalidad, servicios y atencion que nuestra organizacion
              brinda a todos sus asociados.
            </p>
          </div>

          <div className="mt-12 space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="bg-brand-accent z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white">
                    {i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="h-full w-px bg-gray-200" />
                  )}
                </div>
                <div className="pt-0.5">
                  <span className="text-brand-purple text-[10px] font-bold tracking-wider uppercase">
                    {item.year}
                  </span>
                  <h3 className="text-brand-dark mt-0.5 text-sm font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <SectionLabel>Valores</SectionLabel>
          <SectionTitle size="md" className="mt-4 max-w-2xl">
            Por que elegirnos
          </SectionTitle>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="border border-gray-100 bg-white p-6">
                  <div className="bg-brand-accent-soft flex h-10 w-10 items-center justify-center">
                    <Icon className="text-brand-accent h-5 w-5" />
                  </div>
                  <h3 className="text-brand-dark mt-4 text-sm font-bold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <SectionLabel>Sucursales</SectionLabel>
          <SectionTitle size="md" className="mt-4 max-w-2xl">
            Donde encontrarnos
          </SectionTitle>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {BRANCHES.map((b, i) => (
              <BranchCard key={i} branch={b} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-[1140px] px-6">
          <p className="mb-6 text-center text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
            Aseguradoras que nos respaldan
          </p>
          <InsurerBadges />
        </div>
      </section>
    </>
  );
}
