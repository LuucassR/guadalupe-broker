import { SITE_CONFIG } from "@/constants/site"
import { MessageCircle } from "lucide-react"

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-br from-brand-rose to-brand-violet py-20 md:py-24">
      <div className="mx-auto max-w-[1140px] px-6 text-center">
        <h2 className="text-[clamp(28px,3.5vw,32px)] font-bold text-white">
          ¿Necesitás cotizar un seguro?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/80">
          Escribinos por WhatsApp y te respondemos en minutos.
        </p>
        <div className="mt-8">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-brand-rose transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" />
            Escribinos ahora
          </a>
        </div>
      </div>
    </section>
  )
}
