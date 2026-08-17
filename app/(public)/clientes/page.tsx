import type { Metadata } from "next";
import { REVIEWS } from "@/constants/site";
import { Star } from "lucide-react";
import AdvisorCta from "@/components/shared/AdvisorCta";
import PageHero from "@/components/shared/PageHero";
import SectionLabel from "@/components/shared/SectionLabel";
import SectionTitle from "@/components/shared/SectionTitle";
import GoogleRatingCard from "@/components/shared/GoogleRatingCard";

export const metadata: Metadata = {
  title: "Clientes | Guadalupe Broker",
};

export default function ClientesPage() {
  return (
    <>
      <PageHero
        eyebrow="Clientes"
        title="Lo que dicen nuestros clientes"
        description="La confianza se construye con los años. Estas son las opiniones de quienes confian en nosotros."
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="mb-12">
            <GoogleRatingCard />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="flex flex-col border border-gray-100 bg-white p-6"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-gray-600">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="bg-brand-accent-soft text-brand-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                    {review.initials}
                  </div>
                  <p className="text-brand-dark text-sm font-semibold">
                    {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[600px] px-6">
          <SectionLabel>Hablemos</SectionLabel>
          <SectionTitle size="md" className="mt-4">
            Queres ser nuestro proximo cliente?
          </SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Contanos que necesitas y te asesoramos sin costo.
          </p>
          <div className="mt-8">
            <AdvisorCta />
          </div>
        </div>
      </section>
    </>
  );
}
