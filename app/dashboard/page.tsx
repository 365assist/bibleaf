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
    }
  }

  const loadUserStats = async () => {
    // Simulate loading user stats
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
    // Redirect to search results
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
      href: "/ai-study",
      color: "bg-purple-500",
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Audio Bible",
      description: "Listen to scripture with natural voices",
      href: "/tts-enhanced-demo",
      color: "bg-blue-500",
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      title: "Study Plans",
      description: "Structured reading and study guides",
      href: "/study-plans",
      color: "bg-green-500",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "Connect with other believers",
      href: "/community",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to BibleAF
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Your AI-powered companion for Bible study and spiritual growth
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="h-4 w-4 mr-1" />
                Premium
              </Badge>
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>

          {/* Quick Search */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search the entire Bible... (e.g., 'love your enemies', 'faith hope love')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleQuickSearch()}
                      className="pl-10 h-12 text-lg border-0 bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <Button onClick={handleQuickSearch} size="lg" className="h-12 px-8">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
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
                      className="text-xs hover:bg-blue-50"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Verses</p>
                  <p className="text-2xl font-bold">{stats.totalVerses.toLocaleString()}</p>
                </div>
                <Book className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Translations</p>
                  <p className="text-2xl font-bold">{stats.totalTranslations}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Study Streak</p>
                  <p className="text-2xl font-bold">{stats.studyStreak} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Searches Today</p>
                  <p className="text-2xl font-bold">{stats.searchesToday}</p>
                </div>
                <Search className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Saved Verses</p>
                  <p className="text-2xl font-bold">{stats.favoriteVerses}</p>
                </div>
                <Heart className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">AI Insights</p>
                  <p className="text-2xl font-bold">{stats.aiInsights}</p>
                </div>
                <Sparkles className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Verse */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Clock className="h-5 w-5" />
                  Verse of the Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyVerse ? (
                  <div className="space-y-4">
                    <blockquote className="text-lg italic text-amber-900 leading-relaxed">
                      "{dailyVerse.text}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.verse} ({dailyVerse.translation})
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Featured Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuredFeatures.map((feature, index) => (
                    <Link key={index} href={feature.href}>
                      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform`}
                            >
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Advanced Bible Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="simple" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="ai">AI Search</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simple" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Translation</label>
                        <Select defaultValue="kjv">
                          <SelectTrigger>
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
                        <label className="text-sm font-medium mb-2 block">Testament</label>
                        <Select defaultValue="both">
                          <SelectTrigger>
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
                    <Button className="w-full" asChild>
                      <Link href="/bible">
                        <Search className="h-4 w-4 mr-2" />
                        Open Advanced Search
                      </Link>
                    </Button>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Search across multiple translations, filter by books, and use advanced operators.
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/bible?mode=advanced">
                        <Target className="h-4 w-4 mr-2" />
                        Advanced Search
                      </Link>
                    </Button>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ask questions in natural language and get AI-powered Bible verse recommendations.
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/ai-search">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/random-verse">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Random Verse
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/reading-plan">
                    <Book className="h-4 w-4 mr-2" />
                    Reading Plan
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/prayer-requests">
                    <Heart className="h-4 w-4 mr-2" />
                    Prayer Requests
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/study-notes">
                    <Bookmark className="h-4 w-4 mr-2" />
                    My Study Notes
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Searched for "love" in KJV</span>
                    <span className="text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Saved John 3:16</span>
                    <span className="text-muted-foreground ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Completed daily reading</span>
                    <span className="text-muted-foreground ml-auto">2d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">First Search</p>
                      <p className="text-xs text-muted-foreground">Completed your first Bible search</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Book className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Daily Reader</p>
                      <p className="text-xs text-muted-foreground">Read for 7 consecutive days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
