"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Book, Heart, Zap, ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react"

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  const steps = [
    {
      title: "Welcome to BibleAF! ✨",
      description:
        "Discover how AI can transform your Bible study experience with intelligent insights and personalized guidance.",
      icon: <Sparkles className="h-8 w-8 text-amber-600" />,
      features: [
        "AI-powered verse search",
        "Daily personalized devotionals",
        "Biblical life guidance",
        "Text-to-speech Scripture reading",
      ],
    },
    {
      title: "Smart Bible Search 🔍",
      description:
        "Find exactly what you're looking for with our intelligent search that understands context and meaning.",
      icon: <Search className="h-8 w-8 text-blue-600" />,
      features: [
        "Search by topic, emotion, or situation",
        "Contextual verse recommendations",
        "Multiple Bible translations",
        "Cross-reference exploration",
      ],
    },
    {
      title: "Daily Spiritual Growth 📖",
      description: "Receive personalized daily verses and AI-generated insights tailored to your spiritual journey.",
      icon: <Book className="h-8 w-8 text-green-600" />,
      features: ["Personalized daily verses", "AI-powered commentary", "Progress tracking", "Reflection prompts"],
    },
    {
      title: "Biblical Life Guidance ❤️",
      description: "Get wisdom and guidance for life's challenges through AI-powered biblical counseling.",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      features: [
        "Situation-specific guidance",
        "Relevant Scripture passages",
        "Practical application steps",
        "Prayer suggestions",
      ],
    },
    {
      title: "Enhanced Experience ⚡",
      description: "Enjoy additional features that make Bible study more accessible and engaging.",
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      features: ["Text-to-speech narration", "Offline access", "Verse saving & organization", "Community features"],
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsOpen(false)
    onComplete()
  }

  const currentStepData = steps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto" aria-labelledby="onboarding-title">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle id="onboarding-title" className="text-xl font-bold">
              {currentStepData.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="h-8 w-8 p-0"
              aria-label="Close onboarding tour"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentStep + 1}
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-label={`Onboarding progress: step ${currentStep + 1} of ${steps.length}`}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="flex justify-center mb-6">{currentStepData.icon}</div>

          <DialogDescription className="text-center mb-6 text-base leading-relaxed">
            {currentStepData.description}
          </DialogDescription>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-lg">Key Features:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentStepData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-amber-600 rounded-full" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-amber-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <Button onClick={handleNext} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {currentStep === steps.length - 1 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
              🎉 Ready to begin your AI-powered Bible study journey?
              <br />
              <strong>Sign up now</strong> to unlock all features!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
