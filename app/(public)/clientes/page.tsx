import type { Metadata } from "next"
import Link from "next/link"
import { REVIEWS, SITE_CONFIG } from "@/constants/site"
import { Star, MessageCircle, ExternalLink } from "lucide-react"
import Cotizador from "@/components/shared/Cotizador"

export const metadata: Metadata = {
  title: "Clientes | Guadalupe Broker",
}

export default function ClientesPage() {
  return (
    <>
      <section className="bg-brand-dark pt-32 pb-16 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Clientes
          </span>
          <h1 className="mt-4 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.05] tracking-tight text-white max-w-3xl">
            Lo que dicen nuestros clientes
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
            La confianza se construye con los anos. Estas son las opiniones de
            quienes confian en nosotros.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-6 text-center">
            <div className="mb-2 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-3xl font-bold text-brand-dark">4.9</p>
            <p className="mt-1 text-sm text-gray-500">
              Calificacion general en Google
            </p>
            <Link
              href={SITE_CONFIG.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              prefetch={true}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-rose transition-colors hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver opiniones en Google
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl bg-white p-6 ring-1 ring-gray-100"
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                    {review.initials}
                  </div>
                  <p className="text-sm font-semibold text-brand-dark">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose">
            Cotizador
          </span>
          <h2 className="mt-4 text-[clamp(22px,3vw,28px)] font-bold leading-[1.08] tracking-tight text-brand-dark">
            Queres ser nuestro proximo cliente?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Cotiza tu seguro en 3 pasos y te enviamos la mejor opcion.
          </p>
          <div className="mt-8">
            <Cotizador />
          </div>
        </div>
      </section>
    </>
  )
}
