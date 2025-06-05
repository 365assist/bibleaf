"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Heart, Volume2, Sparkles, ArrowRight } from "lucide-react"

export default function SimpleOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState({
    translation: "KJV",
    interests: [] as string[],
    notifications: true,
  })

  const steps = [
    {
      title: "Welcome to BibleAF!",
      description: "Let's personalize your spiritual journey",
      content: (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 font-bold text-3xl mb-4">
            <BookOpen className="text-amber-600" size={32} />
            <span className="text-amber-600">Bible</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg">AF</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover God's word with AI-powered insights, personalized guidance, and daily inspiration.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Search className="text-amber-600 mb-2" size={24} />
              <h3 className="font-semibold">Smart Search</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find verses by meaning</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Heart className="text-amber-600 mb-2" size={24} />
              <h3 className="font-semibold">Daily Wisdom</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personalized verses</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Sparkles className="text-amber-600 mb-2" size={24} />
              <h3 className="font-semibold">AI Guidance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spiritual insights</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Volume2 className="text-amber-600 mb-2" size={24} />
              <h3 className="font-semibold">Audio Bible</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Listen anywhere</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Bible Translation",
      description: "Select your preferred translation",
      content: (
        <div className="space-y-4">
          {["KJV", "NIV", "ESV", "NLT", "NASB"].map((translation) => (
            <button
              key={translation}
              onClick={() => setPreferences({ ...preferences, translation })}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                preferences.translation === translation
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
              }`}
            >
              <div className="font-semibold">{translation}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translation === "KJV" && "King James Version - Traditional English"}
                {translation === "NIV" && "New International Version - Modern English"}
                {translation === "ESV" && "English Standard Version - Literal accuracy"}
                {translation === "NLT" && "New Living Translation - Easy to understand"}
                {translation === "NASB" && "New American Standard Bible - Word-for-word"}
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What interests you?",
      description: "Select topics you'd like to explore",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            "Prayer",
            "Faith",
            "Love",
            "Hope",
            "Wisdom",
            "Peace",
            "Strength",
            "Forgiveness",
            "Guidance",
            "Comfort",
            "Joy",
            "Healing",
          ].map((interest) => (
            <button
              key={interest}
              onClick={() => {
                const newInterests = preferences.interests.includes(interest)
                  ? preferences.interests.filter((i) => i !== interest)
                  : [...preferences.interests, interest]
                setPreferences({ ...preferences, interests: newInterests })
              }}
              className={`p-3 rounded-lg border-2 transition-colors ${
                preferences.interests.includes(interest)
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                  : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    const user = AuthService.getCurrentUser()
    if (user) {
      AuthService.updateUser({
        preferences: {
          ...user.preferences,
          onboardingComplete: true,
          verseCategories: preferences.interests,
          notifications: preferences.notifications,
        },
      })

      // Store preferences in localStorage for quick access
      localStorage.setItem("bibleaf_preferred_translation", preferences.translation)
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} className="bg-amber-500 hover:bg-amber-600">
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
