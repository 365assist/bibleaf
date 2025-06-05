"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/lib/onboarding-context"
import { Book, Heart, Brain } from "lucide-react"

export default function WelcomeStep() {
  const { setCurrentStep } = useOnboarding()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 font-bold text-3xl mb-2">
          <span className="text-amber-600">Bible</span>
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
            AF
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Your Spiritual Journey</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Let's set up your personalized Bible experience in just a few steps
        </p>
      </div>

      <div className="relative w-full h-64 mb-8">
        <Image
          src="/images/ai-jesus-teaching-children.png"
          alt="Jesus teaching with modern technology"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Brain className="h-10 w-10 text-amber-600 mb-2" />
          <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Discover deeper meaning in Scripture</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Book className="h-10 w-10 text-amber-600 mb-2" />
          <h3 className="font-semibold mb-1">Personalized Study</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tailored to your spiritual interests</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Heart className="h-10 w-10 text-amber-600 mb-2" />
          <h3 className="font-semibold mb-1">Daily Guidance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Spiritual wisdom for your daily life</p>
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep("preferences")}
        className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white px-8 py-6 text-lg"
      >
        Begin Your Journey
      </Button>
    </div>
  )
}
