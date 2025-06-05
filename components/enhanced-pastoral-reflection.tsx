"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  BookOpen,
  Lightbulb,
  Users,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Shield,
  Cross,
  Compass,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EmotionalSupport } from "@/components/emotional-support"

interface EnhancedPastoralReflectionProps {
  verse?: {
    reference: string
    text: string
    book: string
    chapter: number
    verse: number
  }
  topic?: string
  userEmotion?: string
  userSituation?: string
  className?: string
}

interface ReflectionSection {
  title: string
  content: string
  icon: React.ReactNode
  type: "theological" | "pastoral" | "practical" | "emotional" | "historical"
  priority: number
}

interface PastoralInsight {
  category: string
  insight: string
  application: string
  prayer?: string
}

export function EnhancedPastoralReflection({
  verse,
  topic,
  userEmotion,
  userSituation,
  className,
}: EnhancedPastoralReflectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["pastoral"])
  const [showEmotionalSupport, setShowEmotionalSupport] = useState(false)
  const [pastoralInsights, setPastoralInsights] = useState<PastoralInsight[]>([])

  useEffect(() => {
    // Auto-expand emotional support for certain situations
    if (userEmotion && isEmotionalCrisisDetected(userEmotion, userSituation)) {
      setShowEmotionalSupport(true)
      setExpandedSections((prev) => [...prev, "emotional"])
    }

    // Generate contextual pastoral insights
    setPastoralInsights(generatePastoralInsights(verse, topic, userEmotion, userSituation))
  }, [verse, topic, userEmotion, userSituation])

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((s) => s !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  const reflections = generateEnhancedReflections(verse, topic, userEmotion, userSituation)
  const sortedReflections = reflections.sort((a, b) => a.priority - b.priority)

  if (reflections.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Crisis Detection Alert */}
      {isEmotionalCrisisDetected(userEmotion, userSituation) && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <Phone className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-medium text-red-800 dark:text-red-200">
              I notice you may be going through a difficult time. You're not alone.
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              If you're in crisis: <strong>Call 988</strong> (Suicide Prevention) or <strong>911</strong> for
              emergencies.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmotionalSupport(true)}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Heart className="h-4 w-4 mr-2" />
              Get Emotional Support
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Pastoral Insights Overview */}
      {pastoralInsights.length > 0 && (
        <Card className="divine-light-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cross className="h-5 w-5 text-primary" />
              Pastoral Insight
            </CardTitle>
            <p className="text-sm text-muted-foreground">God's heart for you in this moment</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastoralInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg">
                <Badge variant="outline" className="mb-2">
                  {insight.category}
                </Badge>
                <p className="font-medium text-amber-900 dark:text-amber-100 mb-2">{insight.insight}</p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">{insight.application}</p>
                {insight.prayer && (
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
                    <p className="text-xs italic text-amber-700 dark:text-amber-300">Prayer: {insight.prayer}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Reflection Sections */}
      <Card className="divine-light-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Pastoral Reflection & Guidance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Spiritual insights and practical wisdom for your faith journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedReflections.map((reflection, index) => (
            <div key={index} className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto hover:bg-accent/50"
                onClick={() => toggleSection(reflection.title)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-md bg-primary/10">{reflection.icon}</div>
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
                <div className="pl-6 pr-2 py-3 bg-accent/20 rounded-lg">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {reflection.content.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {index < sortedReflections.length - 1 && <Separator className="my-3" />}
            </div>
          ))}

          {/* Scripture Foundation */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">Remember God's Faithfulness</p>
                <p className="text-sm italic text-blue-800 dark:text-blue-200">
                  "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in
                  righteousness, so that the servant of God may be thoroughly equipped for every good work." - 2 Timothy
                  3:16-17
                </p>
              </div>
            </div>
          </div>

          {/* Action Steps */}
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Compass className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100 mb-2">Steps Forward</p>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Take time to pray and reflect on this truth</li>
                  <li>• Share this insight with a trusted friend or mentor</li>
                  <li>• Look for ways to apply this wisdom in your daily life</li>
                  <li>• Consider how God might be speaking to you through His Word</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotional Support Component */}
      {showEmotionalSupport && <EmotionalSupport emotion={userEmotion} situation={userSituation} className="mt-6" />}

      {/* Support Actions */}
      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900 dark:text-purple-100">Need Additional Support?</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEmotionalSupport(!showEmotionalSupport)}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Emotional Support
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <a href="/contact">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Pastor
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
    case "emotional":
      return "destructive"
    case "historical":
      return "secondary"
    default:
      return "default"
  }
}

function isEmotionalCrisisDetected(emotion?: string, situation?: string): boolean {
  if (!emotion && !situation) return false

  const crisisKeywords = [
    "suicide",
    "suicidal",
    "kill myself",
    "end it all",
    "hopeless",
    "self-harm",
    "hurt myself",
    "can't go on",
    "want to die",
    "better off dead",
    "overwhelming",
    "can't handle",
    "breaking point",
    "desperate",
    "alone",
  ]

  const text = `${emotion || ""} ${situation || ""}`.toLowerCase()
  return crisisKeywords.some((keyword) => text.includes(keyword))
}

function generatePastoralInsights(
  verse?: any,
  topic?: string,
  emotion?: string,
  situation?: string,
): PastoralInsight[] {
  const insights: PastoralInsight[] = []

  // Context-based insights
  if (emotion?.toLowerCase().includes("anxious") || situation?.toLowerCase().includes("worry")) {
    insights.push({
      category: "Peace & Comfort",
      insight: "God sees your anxiety and invites you to cast all your cares upon Him.",
      application:
        "Remember that worry doesn't change tomorrow, but it does steal today's peace. God is sovereign over your circumstances.",
      prayer: "Lord, help me trust in Your perfect timing and sovereign care over my life.",
    })
  }

  if (emotion?.toLowerCase().includes("lonely") || situation?.toLowerCase().includes("isolated")) {
    insights.push({
      category: "Divine Presence",
      insight: "You are never truly alone - God promises to never leave nor forsake you.",
      application: "Even in your loneliest moments, the Holy Spirit is your Comforter and constant companion.",
      prayer: "Father, help me feel Your presence and find community with fellow believers.",
    })
  }

  if (emotion?.toLowerCase().includes("grief") || situation?.toLowerCase().includes("loss")) {
    insights.push({
      category: "Comfort in Sorrow",
      insight: "God is close to the brokenhearted and saves those who are crushed in spirit.",
      application: "Grief is love with nowhere to go. God holds both your tears and your memories with tender care.",
      prayer: "Comforting God, hold me in my sorrow and help me find hope in Your promises.",
    })
  }

  return insights
}

function generateEnhancedReflections(
  verse?: any,
  topic?: string,
  emotion?: string,
  situation?: string,
): ReflectionSection[] {
  const reflections: ReflectionSection[] = []

  // Pastoral Application (highest priority for emotional situations)
  reflections.push({
    title: "Pastoral Heart",
    type: "pastoral",
    icon: <Heart className="h-4 w-4 text-rose-500" />,
    priority: emotion || situation ? 1 : 2,
    content: generatePastoralContent(verse, topic, emotion, situation),
  })

  // Theological Foundation
  reflections.push({
    title: "Theological Foundation",
    type: "theological",
    icon: <BookOpen className="h-4 w-4 text-blue-500" />,
    priority: 2,
    content: generateTheologicalContent(verse, topic),
  })

  // Emotional Support (when needed)
  if (emotion || situation) {
    reflections.push({
      title: "Emotional Care",
      type: "emotional",
      icon: <Shield className="h-4 w-4 text-purple-500" />,
      priority: 1,
      content: generateEmotionalContent(emotion, situation),
    })
  }

  // Practical Application
  reflections.push({
    title: "Living It Out",
    type: "practical",
    icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    priority: 3,
    content: generatePracticalContent(verse, topic, emotion, situation),
  })

  // Community Connection
  reflections.push({
    title: "Community & Fellowship",
    type: "historical",
    icon: <Users className="h-4 w-4 text-green-500" />,
    priority: 4,
    content: generateCommunityContent(verse, topic),
  })

  return reflections
}

function generatePastoralContent(verse?: any, topic?: string, emotion?: string, situation?: string): string {
  if (emotion || situation) {
    return `As your pastor, I want you to know that God sees exactly where you are right now. Your feelings are valid, your struggles are real, and your pain matters to Him. 

The beautiful truth is that God doesn't wait for us to have it all together before He meets us. He comes to us in our mess, in our questions, in our darkest moments. This is the heart of the Gospel - that while we were still struggling, Christ came for us.

Whatever you're facing today, remember that you are deeply loved, not because of your performance or your feelings, but because you are God's beloved child. Let this truth anchor you when everything else feels uncertain.`
  }

  return `This passage reveals the tender heart of our loving Father. As your pastor, I'm reminded that God's Word isn't just ancient text - it's living and active, speaking directly into our lives today.

When we read Scripture, we're not just gaining information; we're encountering the very heart of God. He speaks to us through His Word with the same love and care that a good shepherd has for his sheep.

Take time to sit with this truth. Let it wash over you. God is speaking to you personally through these words, offering guidance, comfort, and hope for your journey.`
}

function generateTheologicalContent(verse?: any, topic?: string): string {
  return `This passage reveals fundamental truths about God's character and His relationship with humanity. In the original context, these words were given to God's people as both instruction and encouragement.

The theological foundation here reminds us that God is both transcendent (above and beyond us) and immanent (intimately involved in our lives). This beautiful tension means that the God who created the universe also knows the number of hairs on your head.

Understanding the historical and cultural context helps us see how these timeless truths apply to our modern lives, bridging the gap between ancient wisdom and contemporary faith.`
}

function generateEmotionalContent(emotion?: string, situation?: string): string {
  return `Your emotions are a gift from God - they're part of how He created you in His image. It's okay to feel what you're feeling right now. Even Jesus experienced the full range of human emotions: joy, sorrow, anger, and compassion.

God doesn't ask you to suppress your feelings or pretend everything is fine. Instead, He invites you to bring your authentic self before Him. The Psalms are full of raw, honest emotions - from despair to elation, from anger to worship.

Remember that feelings are temporary visitors, not permanent residents. While you honor what you're experiencing, also remember that your identity and worth are anchored in Christ's unchanging love for you, not in the shifting sands of emotion.

If you're struggling significantly, please consider reaching out to a counselor or trusted friend. God often works through others to bring healing and support.`
}

function generatePracticalContent(verse?: any, topic?: string, emotion?: string, situation?: string): string {
  return `Faith is meant to be lived out in the everyday moments of life. Here are some practical ways to apply this truth:

**Daily Practice:** Set aside time each day to reflect on this truth. It might be during your morning coffee, lunch break, or evening walk. Let God's Word shape your thoughts and responses.

**Relationship Application:** Consider how this wisdom affects your relationships with family, friends, and colleagues. How can you extend grace, love, and understanding based on what you've learned?

**Decision Making:** When facing choices, filter them through the lens of this biblical truth. Ask yourself: "How does this align with what God is teaching me?"

**Service Opportunities:** Look for ways to serve others with the comfort and wisdom you've received. Often, God uses our own experiences to help us minister to others facing similar challenges.

Remember, spiritual growth is a process, not a destination. Be patient with yourself as you learn to apply God's truth in practical ways.`
}

function generateCommunityContent(verse?: any, topic?: string): string {
  return `Faith was never meant to be a solo journey. From the very beginning, God designed us for community, for relationship, for mutual encouragement and support.

Consider sharing this insight with someone in your life - a family member, friend, or fellow believer. Sometimes the act of articulating what God is teaching us helps solidify the truth in our own hearts.

Look for opportunities to encourage others with what you've learned. Your testimony of God's faithfulness can be a powerful source of hope for someone who is struggling.

If you're not currently part of a faith community, consider finding a local church where you can grow alongside other believers. The body of Christ is designed to function together, each part supporting and strengthening the others.

Remember, we're all on this journey together, learning to follow Jesus one step at a time. You have something valuable to contribute to the community of faith, just as others have gifts to share with you.`
}
