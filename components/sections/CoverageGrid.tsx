import Link from "next/link"
import { SITE_CONFIG, COVERAGES } from "@/constants/site"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"

export default function CoverageGrid() {
  return (
    <section className="bg-bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-2">
          <SectionLabel>Coberturas</SectionLabel>
        </div>
        <SectionTitle>Encontrá el seguro que necesitás</SectionTitle>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {COVERAGES.map((item) => (
            <Link
              key={item.slug}
              href={`/coberturas/${item.slug}`}
              className="group rounded-xl border border-border bg-white p-5 transition-all hover:border-brand-rose hover:shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: item.bg }}
              >
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-white"
          >
            Consultá sin cargo
          </Link>
        </div>
      </div>
    </section>
  )
}
