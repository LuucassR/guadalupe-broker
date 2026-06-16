import { WHY_US } from "@/constants/site"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"
import { Target, Zap, Handshake, MapPin } from "lucide-react"

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target className="h-5 w-5 text-brand-rose" />,
  zap: <Zap className="h-5 w-5 text-brand-rose" />,
  handshake: <Handshake className="h-5 w-5 text-brand-rose" />,
  "map-pin": <MapPin className="h-5 w-5 text-brand-rose" />,
}

export default function WhyUs() {
  return (
    <section className="bg-bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-2 text-center">
          <SectionLabel>Por qué elegirnos</SectionLabel>
        </div>
        <div className="mb-12 text-center">
          <SectionTitle>Más que una corredora de seguros</SectionTitle>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {WHY_US.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(200,75,140,0.15)] bg-[#FFF3F8]">
                {ICON_MAP[item.icon]}
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
