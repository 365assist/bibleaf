"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, BookOpen, Lightbulb, Users, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface PastoralReflectionProps {
  verse?: {
    reference: string
    text: string
    book: string
    chapter: number
    verse: number
  }
  topic?: string
  className?: string
}

interface ReflectionSection {
  title: string
  content: string
  icon: React.ReactNode
  type: "theological" | "pastoral" | "practical" | "historical"
}

export function PastoralReflection({ verse, topic, className }: PastoralReflectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["theological"])

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((s) => s !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  // Generate reflections based on verse or topic
  const generateReflections = (): ReflectionSection[] => {
    if (verse) {
      return generateVerseReflections(verse)
    } else if (topic) {
      return generateTopicReflections(topic)
    }
    return []
  }

  const reflections = generateReflections()

  if (reflections.length === 0) {
    return null
  }

  return (
    <Card className={cn("divine-light-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Pastoral Reflection
        </CardTitle>
        <p className="text-sm text-muted-foreground">Spiritual insights and practical wisdom for your faith journey</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {reflections.map((reflection, index) => (
          <div key={index} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection(reflection.title)}
            >
              <div className="flex items-center gap-2">
                {reflection.icon}
                <span className="font-medium">{reflection.title}</span>
                <Badge variant={getBadgeVariant(reflection.type)} className="text-xs">
                  {reflection.type}
                </Badge>
              </div>
              {expandedSections.includes(reflection.title) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {expandedSections.includes(reflection.title) && (
              <div className="pl-6 pr-2">
                <p className="text-sm leading-relaxed text-muted-foreground">{reflection.content}</p>
              </div>
            )}

            {index < reflections.length - 1 && <Separator className="my-3" />}
          </div>
        ))}

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm italic text-amber-800 dark:text-amber-200">
            "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in
            righteousness, so that the servant of God may be thoroughly equipped for every good work." - 2 Timothy
            3:16-17
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getBadgeVariant(type: string) {
  switch (type) {
    case "theological":
      return "default"
    case "pastoral":
      return "secondary"
    case "practical":
      return "outline"
    case "historical":
      return "destructive"
    default:
      return "default"
  }
}

function generateVerseReflections(verse: any): ReflectionSection[] {
  const reflections: ReflectionSection[] = []

  // Theological Insight
  reflections.push({
    title: "Theological Insight",
    type: "theological",
    icon: <BookOpen className="h-4 w-4" />,
    content: getTheologicalInsight(verse),
  })

  // Pastoral Application
  reflections.push({
    title: "Pastoral Application",
    type: "pastoral",
    icon: <Heart className="h-4 w-4" />,
    content: getPastoralApplication(verse),
  })

  // Practical Wisdom
  reflections.push({
    title: "Practical Wisdom",
    type: "practical",
    icon: <Lightbulb className="h-4 w-4" />,
    content: getPracticalWisdom(verse),
  })

  // Community Connection
  reflections.push({
    title: "Community Connection",
    type: "historical",
    icon: <Users className="h-4 w-4" />,
    content: getCommunityConnection(verse),
  })

  return reflections
}

function generateTopicReflections(topic: string): ReflectionSection[] {
  const reflections: ReflectionSection[] = []

  // Theological Foundation
  reflections.push({
    title: "Theological Foundation",
    type: "theological",
    icon: <BookOpen className="h-4 w-4" />,
    content: getTopicTheology(topic),
  })

  // Pastoral Care
  reflections.push({
    title: "Pastoral Care",
    type: "pastoral",
    icon: <Heart className="h-4 w-4" />,
    content: getTopicPastoralCare(topic),
  })

  // Living It Out
  reflections.push({
    title: "Living It Out",
    type: "practical",
    icon: <Lightbulb className="h-4 w-4" />,
    content: getTopicPractical(topic),
  })

  return reflections
}

function getTheologicalInsight(verse: any): string {
  // This would ideally be powered by a theological database or AI
  const insights = {
    John: "This passage reveals the heart of God's love and the nature of salvation through Christ.",
    Psalm:
      "The Psalms express the full range of human emotion in relationship with God, showing us how to bring our authentic selves before the Lord.",
    Romans: "Paul's letter to the Romans systematically explains the gospel and our justification by faith alone.",
    Matthew: "Matthew's Gospel emphasizes Jesus as the fulfillment of Old Testament prophecy and the promised Messiah.",
    Genesis:
      "Genesis reveals God as Creator and establishes foundational truths about humanity's relationship with God.",
    Proverbs: "The wisdom literature teaches us practical godliness and how to live in alignment with God's design.",
    default: "This passage reveals important truths about God's character and His relationship with humanity.",
  }

  return insights[verse.book] || insights.default
}

function getPastoralApplication(verse: any): string {
  const applications = {
    comfort:
      "In times of difficulty, this verse reminds us that God is our refuge and strength. He invites us to cast our anxieties upon Him because He cares for us deeply.",
    guidance:
      "When facing decisions, we can trust that God will direct our paths as we acknowledge Him in all our ways. His wisdom surpasses our understanding.",
    hope: "This passage offers hope to those who feel discouraged. God's promises are sure, and His faithfulness endures through every season of life.",
    love: "God's love is not based on our performance but on His character. We can rest in His unconditional love and extend that same love to others.",
    default:
      "This verse speaks to the heart of our relationship with God and offers practical guidance for Christian living.",
  }

  // Simple topic detection based on verse content
  const verseText = verse.text.toLowerCase()
  if (verseText.includes("comfort") || verseText.includes("peace") || verseText.includes("fear")) {
    return applications.comfort
  } else if (verseText.includes("love") || verseText.includes("beloved")) {
    return applications.love
  } else if (verseText.includes("hope") || verseText.includes("future")) {
    return applications.hope
  } else if (verseText.includes("way") || verseText.includes("path") || verseText.includes("guide")) {
    return applications.guidance
  }

  return applications.default
}

function getPracticalWisdom(verse: any): string {
  return "Consider how this truth can be lived out in your daily relationships, work, and decisions. Ask yourself: How does this verse challenge me to grow? What specific action can I take this week to apply this wisdom? How can I share this truth with others who might need encouragement?"
}

function getCommunityConnection(verse: any): string {
  return "The Christian faith is meant to be lived in community. Consider discussing this verse with fellow believers, sharing how God is speaking to you through His Word. Look for opportunities to encourage others with this truth and to be encouraged by their insights as well."
}

function getTopicTheology(topic: string): string {
  const theologies = {
    comfort:
      "God is described throughout Scripture as our Comforter, the God of all comfort who comforts us in all our troubles. This comfort flows from His sovereign love and His intimate knowledge of our needs.",
    love: "God's love is the foundation of all reality. It is unconditional, sacrificial, and eternal. Through Christ, we experience the fullness of God's love and are called to love others in the same way.",
    hope: "Biblical hope is not wishful thinking but confident expectation based on God's promises. Our hope is anchored in Christ's resurrection and the assurance of eternal life with God.",
    peace:
      "True peace comes from being reconciled to God through Christ. This peace surpasses understanding and guards our hearts and minds, even in the midst of life's storms.",
    default:
      "Scripture reveals God's character and His desire for relationship with humanity. Every topic in the Bible ultimately points us back to God's love and His plan of redemption.",
  }

  return theologies[topic.toLowerCase()] || theologies.default
}

function getTopicPastoralCare(topic: string): string {
  const care = {
    comfort:
      "If you're going through a difficult time, know that your pain is seen and understood by God. He doesn't promise to remove all suffering, but He promises to be with you through it. Seek support from your faith community and don't hesitate to reach out for help.",
    love: "You are deeply loved by God, not because of what you do, but because of who you are - His beloved child. This love is the source of your identity and worth. Let this truth transform how you see yourself and others.",
    hope: "When circumstances feel overwhelming, remember that your hope is not in changing situations but in an unchanging God. He is working all things together for good, even when we can't see it.",
    peace:
      "Peace is available to you right now, not as an absence of problems but as the presence of God in the midst of them. Take time to be still and know that He is God.",
    default:
      "God meets you exactly where you are today. He knows your struggles, your questions, and your needs. You are not alone in your journey of faith.",
  }

  return care[topic.toLowerCase()] || care.default
}

function getTopicPractical(topic: string): string {
  const practical = {
    comfort:
      "Practice bringing your worries to God in prayer. Create a gratitude journal to remember His faithfulness. Reach out to comfort others who are struggling, as you have been comforted.",
    love: "Show love through practical acts of service. Forgive those who have hurt you. Speak words of affirmation and encouragement to those around you.",
    hope: "Share your testimony of God's faithfulness with others. Look for ways to be a source of hope in your community. Practice patience as you wait on God's timing.",
    peace:
      "Establish regular times of prayer and meditation. Practice deep breathing while focusing on God's presence. Choose to trust God's sovereignty in uncertain situations.",
    default:
      "Look for specific ways to apply this biblical truth in your relationships, work, and daily decisions. Ask God to show you how to live out His Word authentically.",
  }

  return practical[topic.toLowerCase()] || practical.default
}
