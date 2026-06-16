import type { Metadata } from "next"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"

export const metadata: Metadata = {
  title: "Nosotros | Guadalupe Broker",
}

export default function NosotrosPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionLabel>Nosotros</SectionLabel>
        <SectionTitle>Más de 60 años protegiendo Santa Fe</SectionTitle>
      </div>
    </div>
  )
}
