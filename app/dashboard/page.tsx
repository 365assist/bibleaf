"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  Heart,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  Play,
  ChevronRight,
  User,
  Settings,
  Bell,
} from "lucide-react"

import AIBibleSearch from "@/components/ai-bible-search"
import LifeGuidance from "@/components/life-guidance"
import ConversationalGuidance from "@/components/conversational-guidance"
import DailyVerse from "@/components/daily-verse"
import { AuthService } from "@/lib/auth"

interface DashboardStats {
  versesRead: number
  searchesPerformed: number
  guidanceReceived: number
  streakDays: number
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    versesRead: 0,
    searchesPerformed: 0,
    guidanceReceived: 0,
    streakDays: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      loadUserStats()
    }
    setIsLoading(false)
  }, [])

  const loadUserStats = async () => {
    try {
      // Simulate loading user stats
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStats({
        versesRead: 127,
        searchesPerformed: 43,
        guidanceReceived: 18,
        streakDays: 7,
      })
    } catch (error) {
      console.error("Failed to load user stats:", error)
    }
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    console.log("Saving verse:", verse)
    // Implement verse saving logic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-warm-100 flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-warm-600" />
          </div>
          <p className="text-warm-700">Loading your spiritual journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
      {/* Header with subtle background */}
      <div className="relative bg-gradient-to-r from-warm-100 to-warm-200 border-b border-warm-300">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/divine-light-background.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-warm-900">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
              <p className="text-warm-700">Continue your spiritual journey with AI-powered insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-warm-300 text-warm-700 hover:bg-warm-50">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" className="border-warm-300 text-warm-700 hover:bg-warm-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-600">Verses Read</p>
                  <p className="text-2xl font-semibold text-warm-900">{stats.versesRead}</p>
                </div>
                <div className="w-12 h-12 bg-warm-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-warm-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-600">AI Searches</p>
                  <p className="text-2xl font-semibold text-warm-900">{stats.searchesPerformed}</p>
                </div>
                <div className="w-12 h-12 bg-warm-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-warm-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-600">Guidance Sessions</p>
                  <p className="text-2xl font-semibold text-warm-900">{stats.guidanceReceived}</p>
                </div>
                <div className="w-12 h-12 bg-warm-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-warm-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-600">Study Streak</p>
                  <p className="text-2xl font-semibold text-warm-900">{stats.streakDays} days</p>
                </div>
                <div className="w-12 h-12 bg-warm-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warm-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-warm-100 border border-warm-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-warm-900">
              Overview
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:text-warm-900">
              AI Search
            </TabsTrigger>
            <TabsTrigger value="guidance" className="data-[state=active]:bg-white data-[state=active]:text-warm-900">
              Life Guidance
            </TabsTrigger>
            <TabsTrigger
              value="conversation"
              className="data-[state=active]:bg-white data-[state=active]:text-warm-900"
            >
              Conversation
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-warm-900">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Daily Verse Section */}
            <Card className="refined-card border-warm-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warm-900">
                  <Calendar className="w-5 h-5 text-warm-600" />
                  Today's Verse
                </CardTitle>
                <CardDescription className="text-warm-600">
                  Your personalized daily Scripture with AI insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DailyVerse userId={user?.id || "guest"} onSaveVerse={handleSaveVerse} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-32">
                    <Image
                      src="/images/ai-bible-robot.png"
                      alt="AI Bible Study"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-warm-900/20 group-hover:bg-warm-900/10 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-warm-900 mb-2">AI Bible Study</h3>
                  <p className="text-sm text-warm-600 mb-4">
                    Search Scripture with intelligent AI that understands context and meaning
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-warm-300 text-warm-700 hover:bg-warm-50"
                    onClick={() => setActiveTab("search")}
                  >
                    Start Searching
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-32">
                    <Image
                      src="/images/hand-bible-pages.png"
                      alt="Audio Bible"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-warm-900/20 group-hover:bg-warm-900/10 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-warm-900 mb-2">Audio Bible</h3>
                  <p className="text-sm text-warm-600 mb-4">
                    Listen to Scripture with high-quality text-to-speech narration
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-warm-300 text-warm-700 hover:bg-warm-50"
                    asChild
                  >
                    <Link href="/bible">
                      <Play className="w-4 h-4 mr-2" />
                      Listen Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-32">
                    <Image
                      src="/images/ai-jesus-teaching-children.png"
                      alt="Study Plans"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-warm-900/20 group-hover:bg-warm-900/10 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-warm-900 mb-2">Study Plans</h3>
                  <p className="text-sm text-warm-600 mb-4">
                    Structured Bible study plans with AI-powered insights and guidance
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-warm-300 text-warm-700 hover:bg-warm-50"
                    asChild
                  >
                    <Link href="/study-plans">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Plans
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="refined-card border-warm-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warm-900">
                  <Clock className="w-5 h-5 text-warm-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg">
                    <div className="w-8 h-8 bg-warm-200 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-warm-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warm-900">Searched for "verses about hope"</p>
                      <p className="text-xs text-warm-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg">
                    <div className="w-8 h-8 bg-warm-200 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-warm-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warm-900">Saved Jeremiah 29:11</p>
                      <p className="text-xs text-warm-600">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg">
                    <div className="w-8 h-8 bg-warm-200 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-warm-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warm-900">Received guidance on relationships</p>
                      <p className="text-xs text-warm-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <AIBibleSearch
              userId={user?.id || "guest"}
              onSaveVerse={handleSaveVerse}
              onSearchComplete={() => console.log("Search completed")}
            />
          </TabsContent>

          <TabsContent value="guidance">
            <LifeGuidance
              userId={user?.id || "guest"}
              onSaveVerse={handleSaveVerse}
              onGuidanceComplete={() => console.log("Guidance completed")}
            />
          </TabsContent>

          <TabsContent value="conversation">
            <ConversationalGuidance
              userId={user?.id || "guest"}
              onSaveVerse={handleSaveVerse}
              onGuidanceComplete={() => console.log("Conversation completed")}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="refined-card border-warm-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warm-900">
                  <User className="w-5 h-5 text-warm-600" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-warm-900">Display Name</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                      defaultValue={user?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-warm-900">Email</label>
                    <input
                      type="email"
                      className="w-full mt-1 px-3 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-warm-900">Preferred Bible Translation</label>
                    <select className="w-full mt-1 px-3 py-2 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-500 focus:border-warm-500">
                      <option value="NIV">NIV</option>
                      <option value="ESV">ESV</option>
                      <option value="KJV">KJV</option>
                      <option value="NASB">NASB</option>
                    </select>
                  </div>
                  <Button className="refined-button">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
