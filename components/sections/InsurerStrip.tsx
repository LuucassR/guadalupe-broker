import { INSURERS } from "@/constants/site"

export default function InsurerStrip() {
  return (
    <section className="bg-bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <p className="mb-8 text-center text-sm text-text-secondary">
          Trabajamos con las mejores compañías del mercado
        </p>

        <div className="flex flex-wrap justify-center gap-3 overflow-x-auto">
          {INSURERS.map((name) => (
            <span
              key={name}
              className="inline-flex shrink-0 items-center rounded-full border border-border bg-bg-muted px-5 py-2 text-sm text-text-primary"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
