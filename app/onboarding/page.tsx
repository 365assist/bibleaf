import SimpleOnboarding from "@/components/onboarding/simple-onboarding"
import { SEOHead } from "@/components/seo-head"

export default function OnboardingPage() {
  return (
    <>
      <SEOHead
        title="Get Started with BibleAF - Personalize Your Experience"
        description="Set up your personalized Bible study experience with BibleAF. Choose your preferences and discover powerful features."
        canonical="/onboarding"
      />
      <SimpleOnboarding />
    </>
  )
}
