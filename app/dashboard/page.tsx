"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Book,
  Sparkles,
  Heart,
  TrendingUp,
  Clock,
  Bookmark,
  Volume2,
  Brain,
  Globe,
  Star,
  Zap,
  Users,
  Award,
  Target,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DashboardStats {
  totalVerses: number
  totalTranslations: number
  searchesToday: number
  favoriteVerses: number
  studyStreak: number
  aiInsights: number
}

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  translation: string
  bookName: string
}

export default function EnhancedDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalVerses: 311020,
    totalTranslations: 10,
    searchesToday: 0,
    favoriteVerses: 0,
    studyStreak: 1,
    aiInsights: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDailyVerse()
    loadUserStats()
  }, [])

  const loadDailyVerse = async () => {
    try {
      const response = await fetch("/api/bible/daily-verse")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDailyVerse(data.verse)
        }
      }
    } catch (error) {
      console.error("Error loading daily verse:", error)
      // Fallback verse
      setDailyVerse({
        book: "Psalm",
        chapter: 119,
        verse: 105,
        text: "Your word is a lamp for my feet, a light on my path.",
        translation: "NIV",
        bookName: "Psalm",
      })
    }
  }

  const loadUserStats = async () => {
    setStats({
      totalVerses: 311020,
      totalTranslations: 10,
      searchesToday: Math.floor(Math.random() * 20),
      favoriteVerses: Math.floor(Math.random() * 50),
      studyStreak: Math.floor(Math.random() * 30) + 1,
      aiInsights: Math.floor(Math.random() * 100),
    })
  }

  const handleQuickSearch = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    window.location.href = `/bible?q=${encodeURIComponent(searchQuery)}`
  }

  const quickSearchTerms = [
    "love",
    "faith",
    "hope",
    "peace",
    "joy",
    "strength",
    "wisdom",
    "grace",
    "salvation",
    "forgiveness",
    "prayer",
    "trust",
  ]

  const featuredFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Bible Study",
      description: "Get personalized insights and explanations",
      href: "/test-search-ui",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      image: "/images/ai-bible-robot.png",
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Audio Bible",
      description: "Listen to scripture with natural voices",
      href: "/tts-enhanced-demo",
      color: "bg-gradient-to-br from-amber-600 to-orange-600",
      image: "/images/hand-bible-pages.png",
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      title: "Study Plans",
      description: "Structured reading and study guides",
      href: "/test-comprehensive",
      color: "bg-gradient-to-br from-orange-500 to-amber-500",
      image: "/images/ai-jesus-teaching-children.png",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "Connect with other believers",
      href: "/about",
      color: "bg-gradient-to-br from-amber-400 to-yellow-500",
      image: "/images/divine-sunset-mountains.png",
    },
  ]

  return (
    <div className="min-h-screen divine-light-bg">
      <div className="divine-light-overlay">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header with Background Image */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Image
                src="/images/divine-light-background.png"
                alt="Divine light background"
                fill
                className="object-cover opacity-20"
                priority
              />
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                    Welcome to BibleAF
                  </h1>
                  <p className="text-lg text-amber-800 dark:text-amber-300 mt-2">
                    Your AI-powered companion for Bible study and spiritual growth
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Premium
                  </Badge>
                  <Button className="divine-button" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                </div>
              </div>

              {/* Quick Search */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5" />
                        <Input
                          placeholder="Search the entire Bible... (e.g., 'love your enemies', 'faith hope love')"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleQuickSearch()}
                          className="pl-10 h-12 text-lg border-amber-200 dark:border-amber-800 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <Button onClick={handleQuickSearch} size="lg" className="divine-button h-12 px-8">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickSearchTerms.map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery(term)
                            setTimeout(() => handleQuickSearch(), 100)
                          }}
                          className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Total Verses</p>
                    <p className="text-2xl font-bold">{stats.totalVerses.toLocaleString()}</p>
                  </div>
                  <Book className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Translations</p>
                    <p className="text-2xl font-bold">{stats.totalTranslations}</p>
                  </div>
                  <Globe className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Study Streak</p>
                    <p className="text-2xl font-bold">{stats.studyStreak} days</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Searches Today</p>
                    <p className="text-2xl font-bold">{stats.searchesToday}</p>
                  </div>
                  <Search className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Saved Verses</p>
                    <p className="text-2xl font-bold">{stats.favoriteVerses}</p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-700 to-orange-800 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">AI Insights</p>
                    <p className="text-2xl font-bold">{stats.aiInsights}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Verse */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Clock className="h-5 w-5" />
                    Verse of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyVerse ? (
                    <div className="space-y-4">
                      <blockquote className="text-lg italic text-amber-900 dark:text-amber-200 leading-relaxed">
                        "{dailyVerse.text}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.verse} ({dailyVerse.translation})
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Volume2 className="h-4 w-4 mr-1" />
                            Listen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <div className="h-4 bg-amber-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Features */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Sparkles className="h-5 w-5" />
                    Featured Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {featuredFeatures.map((feature, index) => (
                      <Link key={index} href={feature.href}>
                        <Card className="divine-light-card hover:shadow-xl transition-all duration-200 cursor-pointer group border-amber-200 dark:border-amber-800">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div
                                  className={`p-2 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform shadow-lg`}
                                >
                                  {feature.icon}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                  <Image
                                    src={feature.image || "/placeholder.svg"}
                                    alt={feature.title}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1 text-amber-800 dark:text-amber-300">
                                  {feature.title}
                                </h3>
                                <p className="text-sm text-amber-700 dark:text-amber-400">{feature.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Search */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Target className="h-5 w-5" />
                    Advanced Bible Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="simple" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-amber-50 dark:bg-amber-900/20">
                      <TabsTrigger
                        value="simple"
                        className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
                      >
                        Simple
                      </TabsTrigger>
                      <TabsTrigger
                        value="advanced"
                        className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
                      >
                        Advanced
                      </TabsTrigger>
                      <TabsTrigger
                        value="ai"
                        className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
                      >
                        AI Search
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="simple" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block text-amber-800 dark:text-amber-300">
                            Translation
                          </label>
                          <Select defaultValue="kjv">
                            <SelectTrigger className="border-amber-300 focus:border-amber-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kjv">King James Version</SelectItem>
                              <SelectItem value="niv">New International Version</SelectItem>
                              <SelectItem value="esv">English Standard Version</SelectItem>
                              <SelectItem value="nlt">New Living Translation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block text-amber-800 dark:text-amber-300">
                            Testament
                          </label>
                          <Select defaultValue="both">
                            <SelectTrigger className="border-amber-300 focus:border-amber-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="both">Both Testaments</SelectItem>
                              <SelectItem value="old">Old Testament</SelectItem>
                              <SelectItem value="new">New Testament</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full divine-button" asChild>
                        <Link href="/bible">
                          <Search className="h-4 w-4 mr-2" />
                          Open Advanced Search
                        </Link>
                      </Button>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Search across multiple translations, filter by books, and use advanced operators.
                      </p>
                      <Button className="w-full divine-button" asChild>
                        <Link href="/bible?mode=advanced">
                          <Target className="h-4 w-4 mr-2" />
                          Advanced Search
                        </Link>
                      </Button>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-4">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Ask questions in natural language and get AI-powered Bible verse recommendations.
                      </p>
                      <Button className="w-full divine-button" asChild>
                        <Link href="/test-search-ui">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Bible Search
                        </Link>
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Lightbulb className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/test-comprehensive">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Random Verse
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/bible">
                      <Book className="h-4 w-4 mr-2" />
                      Reading Plan
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/contact">
                      <Heart className="h-4 w-4 mr-2" />
                      Prayer Requests
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/test-full-bible">
                      <Bookmark className="h-4 w-4 mr-2" />
                      My Study Notes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-800 dark:text-amber-300">Searched for "love" in KJV</span>
                      <span className="text-amber-600 dark:text-amber-400 ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-amber-800 dark:text-amber-300">Saved John 3:16</span>
                      <span className="text-amber-600 dark:text-amber-400 ml-auto">1d ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-amber-800 dark:text-amber-300">Completed daily reading</span>
                      <span className="text-amber-600 dark:text-amber-400 ml-auto">2d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="divine-light-card border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-amber-800 dark:text-amber-300">First Search</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Completed your first Bible search</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Book className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-amber-800 dark:text-amber-300">Daily Reader</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">Read for 7 consecutive days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
