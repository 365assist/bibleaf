"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("search")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [guidanceInput, setGuidanceInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setIsLoggedIn(!!user)
  }, [])

  // Demo search results for different queries
  const getDemoSearchResults = (query: string) => {
    const results = {
      "overcoming fear": [
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          relevance: 98,
          context: "God's promise of presence and strength in times of fear",
        },
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          relevance: 95,
          context: "Comfort and protection in difficult times",
        },
      ],
      forgiveness: [
        {
          reference: "Ephesians 4:32",
          text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          relevance: 97,
          context: "The call to forgive others as God has forgiven us",
        },
        {
          reference: "Matthew 6:14-15",
          text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you.",
          relevance: 94,
          context: "The importance of forgiveness in our relationship with God",
        },
      ],
      strength: [
        {
          reference: "Philippians 4:13",
          text: "I can do all this through him who gives me strength.",
          relevance: 99,
          context: "Strength and capability through Christ",
        },
        {
          reference: "Isaiah 40:31",
          text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
          relevance: 96,
          context: "Renewed strength through hope in God",
        },
      ],
    }

    const key = Object.keys(results).find((k) => query.toLowerCase().includes(k))
    return key ? results[key as keyof typeof results] : results["strength"]
  }

  // Demo guidance response
  const getDemoGuidance = (situation: string) => {
    if (situation.toLowerCase().includes("forgiv")) {
      return {
        guidance:
          "Forgiveness is one of the most challenging yet transformative aspects of the Christian faith. When someone has hurt us deeply, our natural response is often anger, resentment, or a desire for justice. However, God calls us to a higher standard - to forgive as we have been forgiven.\n\nRemember that forgiveness doesn't mean excusing the wrong or pretending it didn't happen. It means releasing the burden of resentment and choosing to trust God with justice.",
        verses: [
          {
            reference: "Ephesians 4:32",
            text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
          },
        ],
        steps: [
          "Pray for the person who hurt you, even if it feels difficult at first",
          "Write down your feelings in a journal and bring them to God in prayer",
          "Seek wise counsel from a trusted pastor or Christian friend",
        ],
      }
    }

    return {
      guidance:
        "Life's challenges can feel overwhelming, but remember that you're not alone in this journey. God sees your situation and cares deeply about what you're experiencing.\n\nThe Bible reminds us that God works all things together for good for those who love Him. Even in difficult times, He is present with you, offering strength, wisdom, and peace.",
      verses: [
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        },
      ],
      steps: [
        "Spend time in prayer, honestly sharing your feelings with God",
        "Read and meditate on relevant Bible passages",
        "Seek wise counsel from trusted Christian friends or mentors",
      ],
    }
  }

  // Simulate typing effect
  const simulateTyping = (text: string, callback: (text: string) => void) => {
    setIsTyping(true)
    let currentText = ""
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index]
        callback(currentText)
        index++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 30)
  }

  const handleDemoSearch = (query: string) => {
    setSearchQuery(query)
    // Simulate AI processing
    setTimeout(() => {
      // Results would appear here in the demo
    }, 1000)
  }

  const handleDemoGuidance = (situation: string) => {
    setGuidanceInput(situation)
    // Simulate AI processing
    setTimeout(() => {
      // Guidance would appear here in the demo
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="divine-light-card rounded-2xl p-8 shadow-lg max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500">
          BibleAF
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Experience the Bible like never before with AI-powered insights, daily verses, and life guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
