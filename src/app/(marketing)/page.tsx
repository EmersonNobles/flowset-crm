import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Pricing } from "@/components/marketing/pricing"
import { CtaFinal } from "@/components/marketing/cta-final"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CtaFinal />
    </>
  )
}
