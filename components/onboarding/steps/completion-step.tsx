"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/lib/onboarding-context"
import { CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"

export default function CompletionStep() {
  const { completeOnboarding, userPreferences } = useOnboarding()
  const router = useRouter()

  // Trigger confetti effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d97706", "#fbbf24", "#f59e0b"],
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleComplete = () => {
    completeOnboarding()
    router.push("/dashboard")
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
      <CheckCircle className="h-20 w-20 text-amber-600 mb-6" />

      <h1 className="text-4xl font-bold mb-4">You're All Set!</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Your personalized Bible experience is ready. Begin your spiritual journey with BibleAF.
      </p>

      <div className="relative w-full h-64 mb-8">
        <Image
          src="/images/divine-light-background.png"
          alt="Divine light shining through clouds"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4">Your Preferences Summary</h2>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div>
            <p className="font-medium">Preferred Translation:</p>
            <p className="text-gray-600 dark:text-gray-400">{userPreferences.preferredTranslation}</p>
          </div>
          <div>
            <p className="font-medium">Reading Goal:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {userPreferences.readingGoal === "daily"
                ? "Daily reading"
                : userPreferences.readingGoal === "weekly"
                  ? "Weekly study"
                  : "Casual reading"}
            </p>
          </div>
          <div>
            <p className="font-medium">Notifications:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {userPreferences.notificationsEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div>
            <p className="font-medium">Topics of Interest:</p>
            <p className="text-gray-600 dark:text-gray-400">
              {userPreferences.topicInterests.length > 0 ? userPreferences.topicInterests.join(", ") : "None selected"}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleComplete}
        className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white px-8 py-6 text-lg"
      >
        Start Your Journey
      </Button>
    </div>
  )
}
