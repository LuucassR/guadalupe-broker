import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { COVERAGES, COVERAGE_DETAILS, REQUIRED_DOCS, HOW_TO_HIRE, COVERAGE_FAQ_MAP, SITE_CONFIG } from "@/constants/site"
import { CheckCircle, ArrowLeft, MessageCircle, ArrowRight, FileText, ClipboardList, HelpCircle } from "lucide-react"
import {
  Car, Home, HeartPulse, Store, Shield, Truck, Heart, Scale,
} from "lucide-react"
import Cotizador from "@/components/shared/Cotizador"
import FaqAccordion from "@/components/shared/FaqAccordion"

interface Props {
  params: Promise<{ slug: string }>
}

const ICON_MAP: Record<string, typeof Car> = {
  Car, Home, HeartPulse, Store, Shield, Truck, Heart, Scale,
}

export async function generateStaticParams() {
  return COVERAGES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const coverage = COVERAGES.find((c) => c.slug === slug)
  if (!coverage) return {}
  return { title: `${coverage.name} | Guadalupe Broker` }
}

export default async function CoverageDetailPage({ params }: Props) {
  const { slug } = await params
  const coverage = COVERAGES.find((c) => c.slug === slug)
  if (!coverage) notFound()

  const detail = COVERAGE_DETAILS[slug]
  const docs = REQUIRED_DOCS[slug]
  const faqs = COVERAGE_FAQ_MAP[slug]
  const Icon = ICON_MAP[coverage.icon || "Shield"]

  return (
    <>
      <section className="bg-brand-dark pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <Link
            href="/coberturas"
            prefetch={true}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las coberturas
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-rose/20">
              <Icon className="h-6 w-6 text-brand-rose" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-rose">
                Cobertura
              </span>
              <h1 className="mt-1 text-[clamp(28px,4vw,42px)] font-bold leading-[1.05] tracking-tight text-white">
                {coverage.name}
              </h1>
            </div>
          </div>
          {detail && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
              {detail.desc}
            </p>
          )}
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-brand-rose px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            Cotizar {coverage.name.toLowerCase()}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {detail && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[1140px] px-6">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle className="h-5 w-5 text-brand-rose" />
              <h2 className="text-lg font-bold text-brand-dark">
                Beneficios incluidos
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {detail.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-rose" />
                  <p className="text-sm leading-relaxed text-gray-600">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="h-5 w-5 text-brand-rose" />
            <h2 className="text-lg font-bold text-brand-dark">
              Como contratar
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {HOW_TO_HIRE.map((step) => (
              <div
                key={step.step}
                className="rounded-xl bg-white p-6 ring-1 ring-gray-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-rose/10 text-xs font-bold text-brand-rose">
                  {step.step}
                </span>
                <h3 className="mt-4 text-sm font-bold text-brand-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {docs && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[1140px] px-6">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-5 w-5 text-brand-rose" />
              <h2 className="text-lg font-bold text-brand-dark">
                Documentacion necesaria
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {docs.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100"
                >
                  <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                  <p className="text-sm text-gray-600">{doc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-5 w-5 text-brand-rose" />
            <h2 className="text-lg font-bold text-brand-dark">
              Preguntas frecuentes
            </h2>
          </div>
          {faqs ? (
            <FaqAccordion items={faqs} />
          ) : (
            <p className="text-sm text-gray-400">
              Consultanos por WhatsApp para resolver todas tus dudas.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Cotizador
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark">
            Cotiza {coverage.name.toLowerCase()} en 3 pasos
          </h2>
          <div className="mt-8">
            <Cotizador />
          </div>
        </div>
      </section>
    </>
  )
}
