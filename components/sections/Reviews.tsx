import { SITE_CONFIG, REVIEWS } from "@/constants/site"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"
import { Star } from "lucide-react"

export default function Reviews() {
  return (
    <section className="bg-bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-2 text-center">
          <SectionLabel>Testimonios</SectionLabel>
        </div>
        <div className="mb-12 text-center">
          <SectionTitle>Lo que dicen nuestros clientes</SectionTitle>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-xl border border-border bg-white p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed italic text-text-secondary">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-rose to-brand-violet text-[11px] font-bold text-white">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {review.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    Cliente de Guadalupe Broker
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={SITE_CONFIG.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-rose transition-colors hover:text-brand-violet"
          >
            Ver todas las opiniones en Google &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
