"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/lib/onboarding-context"
import { ArrowLeft, ArrowRight, Search, Book, MessageSquare, Headphones, Check } from "lucide-react"

const features = [
  {
    id: "search",
    title: "AI-Powered Search",
    description:
      "Find relevant Bible verses by asking questions in natural language. Our AI understands context and meaning.",
    icon: <Search className="h-8 w-8 text-amber-600" />,
    image: "/images/ai-bible-robot.png",
  },
  {
    id: "daily",
    title: "Daily Verses",
    description: "Receive personalized daily verses with AI-generated insights tailored to your spiritual journey.",
    icon: <Book className="h-8 w-8 text-amber-600" />,
    image: "/images/divine-light-background.png",
  },
  {
    id: "guidance",
    title: "Life Guidance",
    description:
      "Get biblical wisdom for life's challenges through AI-powered spiritual counseling based on Scripture.",
    icon: <MessageSquare className="h-8 w-8 text-amber-600" />,
    image: "/images/divine-sunset-mountains.png",
  },
  {
    id: "audio",
    title: "Text-to-Speech",
    description: "Listen to Scripture with high-quality AI voices for an immersive audio experience.",
    icon: <Headphones className="h-8 w-8 text-amber-600" />,
    image: "/images/hand-bible-pages.png",
  },
]

export default function FeaturesStep() {
  const { setCurrentStep } = useOnboarding()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [completedFeatures, setCompletedFeatures] = useState<string[]>([])

  const handleNext = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1)
      setCompletedFeatures([...completedFeatures, features[currentFeature].id])
    } else {
      setCurrentStep("subscription")
    }
  }

  const handlePrevious = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1)
    } else {
      setCurrentStep("preferences")
    }
  }

  const feature = features[currentFeature]

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Discover Key Features</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Let's explore the powerful tools that will enhance your Bible study
        </p>

        <div className="flex mb-8">
          {features.map((f, index) => (
            <div
              key={f.id}
              className={`flex-1 h-1 mx-1 rounded-full ${
                completedFeatures.includes(f.id)
                  ? "bg-amber-600"
                  : index === currentFeature
                    ? "bg-amber-400"
                    : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {feature.icon}
              <h2 className="text-2xl font-bold">{feature.title}</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">How to use this feature:</h3>
              <ul className="space-y-2">
                {feature.id === "search" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Type questions like "What does the Bible say about love?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Ask for specific topics: "Find verses about forgiveness"</span>
                    </li>
                  </>
                )}
                {feature.id === "daily" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Check your dashboard each day for a new verse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Save favorites to your personal collection</span>
                    </li>
                  </>
                )}
                {feature.id === "guidance" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Ask questions like "How can I find peace during difficult times?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Get Scripture-based guidance for personal challenges</span>
                    </li>
                  </>
                )}
                {feature.id === "audio" && (
                  <>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Click the audio icon on any verse to listen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Choose from multiple voice options in settings</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="relative h-64 md:h-80">
            <Image
              src={feature.image || "/placeholder.svg"}
              alt={feature.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white flex items-center gap-2"
          >
            {currentFeature < features.length - 1 ? (
              <>
                Next Feature <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
