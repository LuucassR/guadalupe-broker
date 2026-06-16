import type { Metadata } from "next"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"

export const metadata: Metadata = {
  title: "FAQ | Guadalupe Broker",
}

export default function FAQPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Preguntas frecuentes</SectionTitle>
      </div>
    </div>
  )
}
