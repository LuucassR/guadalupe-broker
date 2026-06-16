import type { Metadata } from "next"
import SectionLabel from "@/components/shared/SectionLabel"
import SectionTitle from "@/components/shared/SectionTitle"

export const metadata: Metadata = {
  title: "Clientes | Guadalupe Broker",
}

export default function ClientesPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionLabel>Clientes</SectionLabel>
        <SectionTitle>Lo que dicen nuestros clientes</SectionTitle>
      </div>
    </div>
  )
}
