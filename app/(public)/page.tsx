import Hero from "@/components/sections/Hero"
import BentoGrid from "@/components/sections/BentoGrid"
import MarqueeStrip from "@/components/sections/MarqueeStrip"
import PinnedShowcase from "@/components/sections/PinnedShowcase"
import Testimonials from "@/components/sections/Testimonials"
import CtaBanner from "@/components/sections/CtaBanner"

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoGrid />
      <MarqueeStrip />
      <PinnedShowcase />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
