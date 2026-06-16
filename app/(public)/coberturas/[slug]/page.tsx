import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { COVERAGES } from "@/constants/site"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return COVERAGES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const coverage = COVERAGES.find((c) => c.slug === slug)
  if (!coverage) return {}
  return { title: `${coverage.name} | Guadalupe Broker` }
}

export default async function CoverageDetailPage({ params }: Props) {
  const { slug } = await params
  const coverage = COVERAGES.find((c) => c.slug === slug)
  if (!coverage) notFound()

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <h1 className="text-[clamp(36px,5vw,52px)] font-extrabold -tracking-[0.03em]">
          {coverage.name}
        </h1>
      </div>
    </div>
  )
}
