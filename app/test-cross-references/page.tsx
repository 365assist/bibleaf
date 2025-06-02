"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Search,
  Heart,
  Star,
  Lightbulb,
  Shield,
  Crown,
  Zap,
  Globe,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import CrossReferenceExplorer from "@/components/cross-reference-explorer"

interface TestVerse {
  reference: string
  text: string
  theme: string
  description: string
  icon: React.ComponentType<any>
  color: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  testamentFocus: "Old" | "New" | "Both"
}

interface ThemeCategory {
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  verses: TestVerse[]
}

export default function CrossReferenceTestPage() {
  const [selectedVerse, setSelectedVerse] = useState<TestVerse | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("salvation")
  const [savedVerses, setSavedVerses] = useState<Array<{ reference: string; text: string }>>([])

  // Test verses organized by themes
  const themeCategories: ThemeCategory[] = [
    {
      name: "Salvation & Grace",
      description: "Core gospel truths and God's saving grace",
      icon: Heart,
      color: "text-red-600",
      verses: [
        {
          reference: "John 3:16",
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          theme: "God's Love",
          description: "The most famous verse about God's love and salvation",
          icon: Heart,
          color: "text-red-600",
          difficulty: "Beginner",
          testamentFocus: "New",
        },
        {
          reference: "Ephesians 2:8-9",
          text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.",
          theme: "Grace",
          description: "Salvation by grace through faith, not works",
          icon: Star,
          color: "text-amber-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "Romans 3:23",
          text: "For all have sinned and fall short of the glory of God.",
          theme: "Sin",
          description: "Universal need for salvation",
          icon: Shield,
          color: "text-orange-600",
          difficulty: "Beginner",
          testamentFocus: "New",
        },
        {
          reference: "Isaiah 53:5",
          text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
          theme: "Messianic Prophecy",
          description: "Prophetic description of Christ's sacrifice",
          icon: Crown,
          color: "text-purple-600",
          difficulty: "Advanced",
          testamentFocus: "Old",
        },
      ],
    },
    {
      name: "Faith & Trust",
      description: "Verses about faith, trust, and believing God",
      icon: Shield,
      color: "text-blue-600",
      verses: [
        {
          reference: "Hebrews 11:1",
          text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
          theme: "Faith Definition",
          description: "The biblical definition of faith",
          icon: Shield,
          color: "text-blue-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "Proverbs 3:5-6",
          text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          theme: "Trust",
          description: "Complete trust and dependence on God",
          icon: BookOpen,
          color: "text-green-600",
          difficulty: "Beginner",
          testamentFocus: "Old",
        },
        {
          reference: "Romans 10:17",
          text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.",
          theme: "Faith Source",
          description: "How faith is developed through God's Word",
          icon: Search,
          color: "text-indigo-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "James 2:17",
          text: "In the same way, faith by itself, if it is not accompanied by action, is dead.",
          theme: "Faith and Works",
          description: "The relationship between faith and actions",
          icon: Zap,
          color: "text-yellow-600",
          difficulty: "Advanced",
          testamentFocus: "New",
        },
      ],
    },
    {
      name: "God's Character",
      description: "Verses revealing who God is and His attributes",
      icon: Crown,
      color: "text-purple-600",
      verses: [
        {
          reference: "1 John 4:8",
          text: "Whoever does not love does not know God, because God is love.",
          theme: "God's Love",
          description: "God's essential nature as love",
          icon: Heart,
          color: "text-red-600",
          difficulty: "Beginner",
          testamentFocus: "New",
        },
        {
          reference: "Psalm 139:7-10",
          text: "Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there.",
          theme: "God's Omnipresence",
          description: "God's presence everywhere",
          icon: Globe,
          color: "text-blue-600",
          difficulty: "Intermediate",
          testamentFocus: "Old",
        },
        {
          reference: "Isaiah 55:8-9",
          text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.",
          theme: "God's Wisdom",
          description: "God's infinite wisdom beyond human understanding",
          icon: Lightbulb,
          color: "text-yellow-600",
          difficulty: "Advanced",
          testamentFocus: "Old",
        },
        {
          reference: "Malachi 3:6",
          text: "I the Lord do not change. So you, the descendants of Jacob, are not destroyed.",
          theme: "God's Immutability",
          description: "God's unchanging nature",
          icon: Shield,
          color: "text-green-600",
          difficulty: "Advanced",
          testamentFocus: "Old",
        },
      ],
    },
    {
      name: "Christian Living",
      description: "Practical guidance for daily Christian life",
      icon: Users,
      color: "text-green-600",
      verses: [
        {
          reference: "Philippians 4:13",
          text: "I can do all this through him who gives me strength.",
          theme: "Strength",
          description: "Finding strength through Christ",
          icon: Zap,
          color: "text-orange-600",
          difficulty: "Beginner",
          testamentFocus: "New",
        },
        {
          reference: "Matthew 6:33",
          text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
          theme: "Priorities",
          description: "Putting God first in life",
          icon: Crown,
          color: "text-purple-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "Galatians 5:22-23",
          text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
          theme: "Fruit of the Spirit",
          description: "Character qualities of a Spirit-filled life",
          icon: Heart,
          color: "text-red-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "Romans 12:2",
          text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
          theme: "Transformation",
          description: "Being transformed by God's truth",
          icon: Lightbulb,
          color: "text-blue-600",
          difficulty: "Advanced",
          testamentFocus: "New",
        },
      ],
    },
    {
      name: "Hope & Comfort",
      description: "Verses that bring comfort and hope in difficult times",
      icon: Star,
      color: "text-amber-600",
      verses: [
        {
          reference: "Romans 8:28",
          text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
          theme: "God's Sovereignty",
          description: "God working all things for good",
          icon: Shield,
          color: "text-green-600",
          difficulty: "Intermediate",
          testamentFocus: "New",
        },
        {
          reference: "Jeremiah 29:11",
          text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
          theme: "God's Plans",
          description: "God's good plans for our future",
          icon: Star,
          color: "text-blue-600",
          difficulty: "Beginner",
          testamentFocus: "Old",
        },
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          theme: "God's Presence",
          description: "Comfort in God's presence during trials",
          icon: Shield,
          color: "text-purple-600",
          difficulty: "Beginner",
          testamentFocus: "Old",
        },
        {
          reference: "2 Corinthians 1:3-4",
          text: "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.",
          theme: "Comfort",
          description: "God's comfort that we can share with others",
          icon: Heart,
          color: "text-red-600",
          difficulty: "Advanced",
          testamentFocus: "New",
        },
      ],
    },
  ]

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    setSavedVerses((prev) => {
      const exists = prev.some((v) => v.reference === verse.reference)
      if (exists) return prev
      return [...prev, verse]
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "Intermediate":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Advanced":
        return "bg-rose-100 text-rose-700 border-rose-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTestamentColor = (testament: string) => {
    switch (testament) {
      case "Old":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "New":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Both":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen divine-light-bg">
      <div className="divine-light-overlay min-h-screen">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Divine Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-6 biblical-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold divine-text mb-4">Cross-Reference Explorer</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Discover the beautiful tapestry of Scripture as verses connect across themes, testaments, and divine
              truths
            </p>
            <div className="flex justify-center gap-6 text-lg">
              <div className="flex items-center gap-2 px-4 py-2 divine-light-card rounded-full">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-700">
                  {themeCategories.reduce((total, cat) => total + cat.verses.length, 0)} Sacred Verses
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 divine-light-card rounded-full">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-700">{themeCategories.length} Divine Themes</span>
              </div>
              {savedVerses.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 divine-light-card rounded-full">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-700">{savedVerses.length} Treasured</span>
                </div>
              )}
            </div>
          </div>

          {selectedVerse ? (
            // Cross-Reference Explorer View
            <div className="space-y-8">
              <Card className="divine-light-card border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <selectedVerse.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl divine-text mb-2">{selectedVerse.reference}</CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{selectedVerse.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(selectedVerse.difficulty)} variant="outline">
                        {selectedVerse.difficulty}
                      </Badge>
                      <Badge className={getTestamentColor(selectedVerse.testamentFocus)} variant="outline">
                        {selectedVerse.testamentFocus} Testament
                      </Badge>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVerse(null)}
                        className="divine-button text-white border-0"
                      >
                        ← Back to Explore
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <CrossReferenceExplorer
                reference={selectedVerse.reference}
                initialText={selectedVerse.text}
                onSaveVerse={handleSaveVerse}
              />
            </div>
          ) : (
            // Test Selection View
            <div className="space-y-8">
              {/* Divine Category Tabs */}
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-16 divine-light-card border-0 p-2">
                  {themeCategories.map((category) => (
                    <TabsTrigger
                      key={category.name.toLowerCase().replace(/\s+/g, "")}
                      value={category.name.toLowerCase().replace(/\s+/g, "")}
                      className="flex flex-col items-center gap-2 h-12 data-[state=active]:divine-button data-[state=active]:text-white"
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm font-medium hidden sm:block">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {themeCategories.map((category) => (
                  <TabsContent
                    key={category.name.toLowerCase().replace(/\s+/g, "")}
                    value={category.name.toLowerCase().replace(/\s+/g, "")}
                    className="mt-8"
                  >
                    {/* Category Header */}
                    <Card className="divine-light-card border-0 shadow-lg mb-8">
                      <CardHeader className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 mx-auto biblical-glow">
                          <category.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl divine-text mb-3">{category.name}</CardTitle>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                          {category.description}
                        </p>
                      </CardHeader>
                    </Card>

                    {/* Verse Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {category.verses.map((verse, index) => (
                        <Card
                          key={index}
                          className="divine-light-card border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                          onClick={() => setSelectedVerse(verse)}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:biblical-glow transition-all">
                                  <verse.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl text-blue-700 dark:text-blue-400 mb-1">
                                    {verse.reference}
                                  </CardTitle>
                                  <p className="text-sm font-medium text-amber-600">{verse.theme}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge className={getDifficultyColor(verse.difficulty)} variant="outline">
                                  {verse.difficulty}
                                </Badge>
                                <Badge className={getTestamentColor(verse.testamentFocus)} variant="outline">
                                  {verse.testamentFocus}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="verse-card p-6 rounded-lg mb-6">
                              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium italic">
                                "{verse.text}"
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600 dark:text-gray-400">{verse.description}</p>
                              <Button className="divine-button text-white border-0 flex items-center gap-2 group-hover:shadow-lg transition-all">
                                Explore Connections
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Divine Instructions */}
              <Card className="divine-light-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl divine-text">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                    How to Explore Cross-References
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 text-lg">Choose a Sacred Verse</h4>
                      <p className="text-blue-700 dark:text-blue-300">
                        Select any verse from the divine themes above. Each represents different spiritual truths and
                        study levels.
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <h4 className="font-bold text-green-800 dark:text-green-200 mb-3 text-lg">
                        Discover Connections
                      </h4>
                      <p className="text-green-700 dark:text-green-300">
                        See how Scripture connects through parallel themes, explanations, prophecies, and divine
                        fulfillments.
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3 text-lg">Multiple Views</h4>
                      <p className="text-purple-700 dark:text-purple-300">
                        Switch between List View, Thematic Groups, and Network View to see different divine
                        perspectives.
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">4</span>
                      </div>
                      <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-3 text-lg">Filter & Focus</h4>
                      <p className="text-orange-700 dark:text-orange-300">
                        Use divine filters by testament, relationship type, and relevance to focus on specific
                        connections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Verses */}
              {savedVerses.length > 0 && (
                <Card className="divine-light-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl divine-text">
                      <Heart className="w-6 h-6 text-red-600" />
                      Treasured Verses ({savedVerses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedVerses.map((verse, index) => (
                        <div key={index} className="verse-card p-4 rounded-lg flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">{verse.reference}</h4>
                            <p className="text-gray-700 dark:text-gray-300 line-clamp-2 italic">"{verse.text}"</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const testVerse = themeCategories
                                .flatMap((cat) => cat.verses)
                                .find((v) => v.reference === verse.reference)
                              if (testVerse) setSelectedVerse(testVerse)
                            }}
                            className="ml-4 divine-button text-white border-0"
                          >
                            Explore
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Start Guide */}
              <Card className="divine-light-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl divine-text text-center">Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 biblical-glow">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold mb-3 text-emerald-800 dark:text-emerald-200 text-lg">
                        For New Believers
                      </h4>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                        Start with beloved verses to see how cross-references illuminate God's truth
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">• John 3:16 (God's Love)</div>
                        <div className="font-medium">• Psalm 23:4 (Divine Comfort)</div>
                        <div className="font-medium">• Philippians 4:13 (Strength)</div>
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4 biblical-glow">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold mb-3 text-amber-800 dark:text-amber-200 text-lg">
                        For Growing Christians
                      </h4>
                      <p className="text-amber-700 dark:text-amber-300 mb-4">
                        Explore thematic connections and deeper theological concepts
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">• Ephesians 2:8-9 (Grace)</div>
                        <div className="font-medium">• Hebrews 11:1 (Faith)</div>
                        <div className="font-medium">• Romans 8:28 (Sovereignty)</div>
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4 biblical-glow">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold mb-3 text-rose-800 dark:text-rose-200 text-lg">For Bible Students</h4>
                      <p className="text-rose-700 dark:text-rose-300 mb-4">
                        Discover complex theological connections and prophetic fulfillments
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">• Isaiah 53:5 (Messianic)</div>
                        <div className="font-medium">• James 2:17 (Faith & Works)</div>
                        <div className="font-medium">• Romans 12:2 (Transformation)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
