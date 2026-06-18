import type { Metadata } from "next"
import Image from "next/image"
import { BRANCHES } from "@/constants/site"
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Users,
  Target,
  Clock,
  Heart,
  Sparkles,
  MessageCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import InsurerBadges from "@/components/shared/InsurerBadges"

export const metadata: Metadata = {
  title: "Nosotros | Guadalupe Broker",
}

const TIMELINE = [
  {
    year: "1960",
    title: "Fundacion",
    desc: "Organizacion Guadalupe de Fregona y Sales inicio su actividad aseguradora, vocacion que aun hoy perdura y continua vigente.",
  },
  {
    year: "1985",
    title: "Segunda generacion",
    desc: "La siguiente generacion se suma al proyecto, expandiendo la cartera de clientes y las companias con las que trabajamos.",
  },
  {
    year: "2005",
    title: "Nueva sucursal",
    desc: "Abrimos nuestra segunda sucursal en 25 de Mayo 2868 para brindar mejor atencion a una clientela en crecimiento.",
  },
  {
    year: "2020",
    title: "Tercera generacion",
    desc: "La tercera generacion se incorpora al negocio familiar, digitalizando procesos sin perder la calidez que nos caracteriza.",
  },
  {
    year: "Hoy",
    title: "Guadalupe Broker S.R.L.",
    desc: "Iniciamos una nueva etapa acorde a los nuevos sistemas de comercializacion de seguros, innovacion y avances tecnologicos.",
  },
]

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
]

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1920&q=80"
            alt=""
            className="h-full w-full object-cover opacity-30"
            fill
            priority
          />
          <div className="absolute inset-0 bg-brand-dark/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Nosotros
          </span>
          <h1 className="mt-4 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.05] tracking-tight text-white max-w-3xl">
            Mas de 60 anos protegiendo Santa Fe
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            Somos un corredor de seguros independiente con historia familiar.
            Trabajamos para vos, no para las aseguradoras.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-100">
              <Building2 className="h-6 w-6 text-brand-rose" />
              <p className="mt-4 text-3xl font-bold text-brand-dark">3</p>
              <p className="mt-1 text-sm text-gray-500">
                Sucursales en Santa Fe
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-100">
              <ShieldCheck className="h-6 w-6 text-brand-rose" />
              <p className="mt-4 text-3xl font-bold text-brand-dark">+60</p>
              <p className="mt-1 text-sm text-gray-500">
                Anos de experiencia
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-100">
              <Users className="h-6 w-6 text-brand-rose" />
              <p className="mt-4 text-3xl font-bold text-brand-dark">3</p>
              <p className="mt-1 text-sm text-gray-500">
                Generaciones de familia
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Historia
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-2xl">
            Nuestra trayectoria
          </h2>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm leading-relaxed text-gray-600">
              Hace 60 anos Organizacion Guadalupe de Fregona y Sales inicio su
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
                  <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-rose text-[9px] font-bold text-white">
                    {i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="h-full w-px bg-gray-200" />
                  )}
                </div>
                <div className="pt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-rose">
                    {item.year}
                  </span>
                  <h3 className="mt-0.5 text-sm font-bold text-brand-dark">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-gray-500">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Valores
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-2xl">
            Por que elegirnos
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="rounded-xl bg-white p-6 ring-1 ring-gray-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-rose/10">
                    <Icon className="h-5 w-5 text-brand-rose" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-brand-dark">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {v.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Sucursales
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark max-w-2xl">
            Donde encontrarnos
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {BRANCHES.map((b, i) => {
              const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(b.address)}`
              const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(b.address)}&output=embed`
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-100"
                >
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa - ${b.address}`}
                    />
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Sucursal {i + 1}
                    </p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark transition-colors hover:text-brand-rose"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-rose" />
                      {b.address}
                      <ExternalLink className="h-3 w-3 text-gray-300" />
                    </a>
                    <div className="mt-4 space-y-2">
                      {b.phones.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p}`}
                          className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-rose"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {p}
                        </a>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`https://wa.me/${b.cell}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp/10 px-3 py-2 text-xs font-semibold text-whatsapp transition-all hover:bg-whatsapp/20"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Como llegar
                      </a>
                    </div>
                    <a
                      href={`mailto:${b.email}`}
                      className="mt-3 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-rose"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {b.email}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-[1140px] px-6">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Aseguradoras que nos respaldan
          </p>
          <InsurerBadges />
        </div>
      </section>
    </>
  )
}
