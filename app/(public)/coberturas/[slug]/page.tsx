import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  COVERAGES,
  COVERAGE_DETAILS,
  REQUIRED_DOCS,
  HOW_TO_HIRE,
  COVERAGE_FAQ_MAP,
  SITE_CONFIG,
} from "@/constants/site";
import {
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  ArrowRight,
  FileText,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
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
import Cotizador from "@/components/shared/Cotizador";
import AdvisorCta from "@/components/shared/AdvisorCta";
import FaqAccordion from "@/components/shared/FaqAccordion";
import PageHero from "@/components/shared/PageHero";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";

interface Props {
  params: Promise<{ slug: string }>;
}

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

export async function generateStaticParams() {
  return COVERAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coverage = COVERAGES.find((c) => c.slug === slug);
  if (!coverage) return {};
  return { title: `${coverage.name} | Guadalupe Broker` };
}

export default async function CoverageDetailPage({ params }: Props) {
  const { slug } = await params;
  const coverage = COVERAGES.find((c) => c.slug === slug);
  if (!coverage) notFound();

  const detail = COVERAGE_DETAILS[slug];
  const docs = REQUIRED_DOCS[slug];
  const faqs = COVERAGE_FAQ_MAP[slug];
  const Icon = ICON_MAP[coverage.icon || "Shield"];

  return (
    <>
      <PageHero
        eyebrow="Cobertura"
        title={coverage.name}
        description={detail?.desc}
        image={coverage.image}
        icon={<Icon className="text-brand-purple h-6 w-6" />}
        backLink={
          <Link
            href="/coberturas"
            prefetch={true}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las coberturas
          </Link>
        }
      >
        <a
          href={SITE_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-purple hover:bg-brand-purple-hover mt-6 inline-flex animate-[fade-up_0.6s_ease-out_both] items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white transition-colors [animation-delay:240ms]"
        >
          <MessageCircle className="h-4 w-4" />
          Cotizar {coverage.name.toLowerCase()}
          <ArrowRight className="h-4 w-4" />
        </a>
      </PageHero>

      {detail && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[1140px] px-6">
            <div className="mb-8 flex items-center gap-3">
              <CheckCircle className="text-brand-accent h-5 w-5" />
              <h2 className="text-brand-dark text-lg font-bold">
                Beneficios incluidos
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {detail.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-gray-100 bg-white p-4"
                >
                  <CheckCircle className="text-brand-accent mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm leading-relaxed text-gray-600">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="mb-8 flex items-center gap-3">
            <ClipboardList className="text-brand-accent h-5 w-5" />
            <h2 className="text-brand-dark text-lg font-bold">
              Como contratar
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {HOW_TO_HIRE.map((step) => (
              <div
                key={step.step}
                className="border border-gray-100 bg-white p-6"
              >
                <span className="bg-brand-accent-soft text-brand-accent flex h-7 w-7 items-center justify-center text-xs font-bold">
                  {step.step}
                </span>
                <h3 className="text-brand-dark mt-4 text-sm font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
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
            <div className="mb-8 flex items-center gap-3">
              <FileText className="text-brand-accent h-5 w-5" />
              <h2 className="text-brand-dark text-lg font-bold">
                Documentacion necesaria
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {docs.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-gray-100 bg-white p-4"
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
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="text-brand-accent h-5 w-5" />
            <h2 className="text-brand-dark text-lg font-bold">
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
          {slug === "automotor" ? (
            <>
              <SectionLabel>Cotizador</SectionLabel>
              <SectionTitle size="md" className="mt-4">
                Cotiza {coverage.name.toLowerCase()} en simples pasos
              </SectionTitle>
              <div className="mt-8">
                <Cotizador />
              </div>
            </>
          ) : (
            <>
              <SectionLabel>Cotizador</SectionLabel>
              <SectionTitle size="md" className="mt-4">
                Cotiza {coverage.name.toLowerCase()}
              </SectionTitle>
              <div className="mt-8">
                <AdvisorCta coverageName={coverage.name} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
