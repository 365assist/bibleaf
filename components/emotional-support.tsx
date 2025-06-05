"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Phone, MessageCircle, Users, ExternalLink, Shield, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmotionalSupportProps {
  emotion?: string
  situation?: string
  className?: string
}

interface SupportResource {
  title: string
  description: string
  type: "crisis" | "counseling" | "community" | "scripture"
  contact?: string
  website?: string
  available24h?: boolean
}

interface ComfortMessage {
  text: string
  reference?: string
  category: "immediate" | "hope" | "strength" | "peace"
}

export function EmotionalSupport({ emotion, situation, className }: EmotionalSupportProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("immediate")
  const [showResources, setShowResources] = useState(false)

  const comfortMessages = getComfortMessages(emotion, situation)
  const supportResources = getSupportResources(emotion, situation)
  const isCrisisDetected = detectCrisis(emotion, situation)

  useEffect(() => {
    if (isCrisisDetected) {
      setShowResources(true)
    }
  }, [isCrisisDetected])

  const categories = [
    { id: "immediate", label: "Immediate Comfort", icon: Heart },
    { id: "hope", label: "Hope & Future", icon: Lightbulb },
    { id: "strength", label: "Strength & Courage", icon: Shield },
    { id: "peace", label: "Peace & Rest", icon: MessageCircle },
  ]

  const filteredMessages = comfortMessages.filter((msg) => msg.category === selectedCategory)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Crisis Alert */}
      {isCrisisDetected && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <Phone className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">
              If you're in crisis or having thoughts of self-harm, please reach out for immediate help:
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>National Suicide Prevention Lifeline:</strong> 988 (24/7)
              </p>
              <p>
                <strong>Crisis Text Line:</strong> Text HOME to 741741
              </p>
              <p>
                <strong>Emergency:</strong> Call 911
              </p>
            </div>
            <p className="text-xs">You are not alone. Professional help is available.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Comfort Messages */}
      <Card className="divine-light-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Words of Comfort
          </CardTitle>
          <p className="text-sm text-muted-foreground">God sees your heart and meets you in your need</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-3 w-3" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          <Separator />

          {/* Comfort Messages */}
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <div key={index} className="comfort-message">
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.reference && <p className="text-xs text-primary font-medium mt-2">- {message.reference}</p>}
              </div>
            ))}
          </div>

          {/* Show Resources Button */}
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => setShowResources(!showResources)} className="w-full">
              <Users className="h-4 w-4 mr-2" />
              {showResources ? "Hide" : "Show"} Support Resources
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Resources */}
      {showResources && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Support Resources
            </CardTitle>
            <p className="text-sm text-muted-foreground">Professional help and community support options</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportResources.map((resource, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{resource.title}</h4>
                  <div className="flex gap-1">
                    <Badge variant={getResourceBadgeVariant(resource.type)}>{resource.type}</Badge>
                    {resource.available24h && (
                      <Badge variant="secondary" className="text-xs">
                        24/7
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <div className="flex gap-2">
                  {resource.contact && (
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      {resource.contact}
                    </Button>
                  )}
                  {resource.website && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={resource.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Remember:</strong> Seeking help is a sign of strength, not weakness. God often works through
                counselors, doctors, and caring communities to bring healing and hope.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getResourceBadgeVariant(type: string) {
  switch (type) {
    case "crisis":
      return "destructive"
    case "counseling":
      return "default"
    case "community":
      return "secondary"
    case "scripture":
      return "outline"
    default:
      return "default"
  }
}

function detectCrisis(emotion?: string, situation?: string): boolean {
  const crisisKeywords = [
    "suicide",
    "suicidal",
    "kill myself",
    "end it all",
    "no point",
    "hopeless",
    "self-harm",
    "hurt myself",
    "can't go on",
    "want to die",
    "better off dead",
  ]

  const text = `${emotion || ""} ${situation || ""}`.toLowerCase()
  return crisisKeywords.some((keyword) => text.includes(keyword))
}

function getComfortMessages(emotion?: string, situation?: string): ComfortMessage[] {
  const messages: ComfortMessage[] = []

  // Immediate comfort messages
  messages.push(
    {
      text: "You are seen, you are known, and you are deeply loved by God. Your pain matters to Him, and He is with you in this moment.",
      category: "immediate",
    },
    {
      text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
      reference: "Psalm 34:18",
      category: "immediate",
    },
    {
      text: "Cast all your anxiety on him because he cares for you.",
      reference: "1 Peter 5:7",
      category: "immediate",
    },
  )

  // Hope messages
  messages.push(
    {
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      reference: "Jeremiah 29:11",
      category: "hope",
    },
    {
      text: "Weeping may stay for the night, but rejoicing comes in the morning.",
      reference: "Psalm 30:5",
      category: "hope",
    },
    {
      text: "God is making all things new, including your story. This chapter is not the end.",
      category: "hope",
    },
  )

  // Strength messages
  messages.push(
    {
      text: "I can do all this through him who gives me strength.",
      reference: "Philippians 4:13",
      category: "strength",
    },
    {
      text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
      reference: "Zephaniah 3:17",
      category: "strength",
    },
    {
      text: "You are stronger than you know because God's strength is made perfect in your weakness.",
      category: "strength",
    },
  )

  // Peace messages
  messages.push(
    {
      text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
      reference: "John 14:27",
      category: "peace",
    },
    {
      text: "Come to me, all you who are weary and burdened, and I will give you rest.",
      reference: "Matthew 11:28",
      category: "peace",
    },
    {
      text: "Be still and know that I am God. In the quiet, His presence brings peace that surpasses understanding.",
      category: "peace",
    },
  )

  return messages
}

function getSupportResources(emotion?: string, situation?: string): SupportResource[] {
  const resources: SupportResource[] = []

  // Crisis resources
  resources.push(
    {
      title: "National Suicide Prevention Lifeline",
      description: "Free and confidential emotional support for people in suicidal crisis or emotional distress.",
      type: "crisis",
      contact: "988",
      website: "https://suicidepreventionlifeline.org",
      available24h: true,
    },
    {
      title: "Crisis Text Line",
      description: "Free, 24/7 support for those in crisis. Text with a trained crisis counselor.",
      type: "crisis",
      contact: "Text HOME to 741741",
      website: "https://crisistextline.org",
      available24h: true,
    },
  )

  // Counseling resources
  resources.push(
    {
      title: "Psychology Today Therapist Directory",
      description: "Find licensed therapists, counselors, and mental health professionals in your area.",
      type: "counseling",
      website: "https://psychologytoday.com",
    },
    {
      title: "Christian Counseling Services",
      description: "Faith-based counseling that integrates biblical principles with professional therapy.",
      type: "counseling",
      website: "https://aacc.net",
    },
  )

  // Community resources
  resources.push(
    {
      title: "Local Church Support Groups",
      description: "Many churches offer support groups for grief, addiction, anxiety, and other life challenges.",
      type: "community",
    },
    {
      title: "NAMI Support Groups",
      description: "National Alliance on Mental Illness offers peer support groups and educational programs.",
      type: "community",
      website: "https://nami.org",
    },
  )

  // Scripture resources
  resources.push(
    {
      title: "Bible Verses for Comfort",
      description: "Curated collection of scriptures for times of difficulty, organized by topic.",
      type: "scripture",
      website: "/topics/comfort",
    },
    {
      title: "Daily Devotionals",
      description: "Regular spiritual encouragement and biblical wisdom for your daily journey.",
      type: "scripture",
      website: "/daily-verse",
    },
  )

  return resources
}
