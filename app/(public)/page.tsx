import Hero from "@/components/sections/Hero"
import Stats from "@/components/sections/Stats"
import CoverageGrid from "@/components/sections/CoverageGrid"
import InsurerStrip from "@/components/sections/InsurerStrip"
import WhyUs from "@/components/sections/WhyUs"
import Reviews from "@/components/sections/Reviews"
import CtaBanner from "@/components/sections/CtaBanner"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <CoverageGrid />
      <InsurerStrip />
      <WhyUs />
      <Reviews />
      <CtaBanner />
    </>
  )
}
