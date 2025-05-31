"use client"

import { useState, useEffect } from "react"
import { AuthService, type User } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Heart, Settings, Crown, Calendar, TrendingUp, MessageCircle, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import DailyVerse from "@/components/daily-verse"
import AIBibleSearch from "@/components/ai-bible-search"
import LifeGuidance from "@/components/life-guidance"
import SavedVersesManager from "@/components/saved-verses-manager"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchCount, setSearchCount] = useState(0)
  const [searchLimit, setSearchLimit] = useState(5) // Default to free tier limit
  const [isLoadingUsage, setIsLoadingUsage] = useState(false)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        console.log("Loading dashboard...")
        const currentUser = AuthService.getCurrentUser()
        console.log("Current user:", currentUser)

        if (!currentUser) {
          console.log("No user found, redirecting to login")
          window.location.href = "/auth/login"
          return
        }

        setUser(currentUser)

        // Initialize search count from user data
        setSearchCount(currentUser.subscription.searchesUsedToday || 0)
        setSearchLimit(getSearchLimitNumber(currentUser.subscription.tier))

        // Fetch the latest usage data
        await fetchUsageData(currentUser.id)
      } catch (error) {
        console.error("Error loading dashboard:", error)
        // Fallback: redirect to login if there's an error
        window.location.href = "/auth/login"
      }

      // Check if there's an activeTab in the URL
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get("activeTab")
      if (tabParam) {
        setActiveTab(tabParam)
      }
    }

    loadDashboard()
  }, [])

  useEffect(() => {
    // Set a timeout to redirect if loading takes too long
    const timeout = setTimeout(() => {
      if (!user) {
        console.log("Dashboard loading timeout, redirecting to login")
        window.location.href = "/auth/login"
      }
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeout)
  }, [user])

  // Function to fetch latest usage data
  const fetchUsageData = async (userId: string) => {
    setIsLoadingUsage(true)
    try {
      const response = await fetch(`/api/usage/track?userId=${userId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()

      if (data.usage) {
        setSearchCount(data.usage.searches || 0)
        setSearchLimit(data.usage.limit || getSearchLimitNumber(user?.subscription.tier || "free"))

        // Update the local user object with the latest count
        setUser((prev) => {
          if (!prev) return null
          return {
            ...prev,
            subscription: {
              ...prev.subscription,
              searchesUsedToday: data.usage.searches || 0,
            },
          }
        })
      }
    } catch (error) {
      console.error("Error fetching usage data:", error)
      // Fallback to user data if API fails
      if (user) {
        setSearchCount(user.subscription.searchesUsedToday || 0)
        setSearchLimit(getSearchLimitNumber(user.subscription.tier))
      }
    } finally {
      setIsLoadingUsage(false)
    }
  }

  // Function to handle search completion
  const handleSearchComplete = async () => {
    console.log("Search completed, updating count")
    if (!user) return

    try {
      // Increment local count immediately for UI feedback
      setSearchCount((prev) => prev + 1)

      // Update user object
      setUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            searchesUsedToday: (prev.subscription.searchesUsedToday || 0) + 1,
          },
        }
      })

      // Track the usage on the server
      const response = await fetch("/api/usage/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          type: "search",
        }),
      })

      if (!response.ok) {
        console.error("Failed to track usage:", await response.text())
      }

      // Fetch latest data from server to ensure accuracy
      await fetchUsageData(user.id)
    } catch (error) {
      console.error("Error tracking search:", error)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    window.location.href = "/auth/login"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Loading Dashboard...</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Please wait while we prepare your Bible dashboard</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              If this takes too long, please{" "}
              <a href="/auth/login" className="text-amber-600 hover:underline font-medium">
                sign in again
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown size={12} className="mr-1" />
            Premium
          </Badge>
        )
      case "basic":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <TrendingUp size={12} className="mr-1" />
            Basic
          </Badge>
        )
      case "annual":
        return (
          <Badge className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white">
            <Crown size={12} className="mr-1" />
            Annual
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            Free
          </Badge>
        )
    }
  }

  const getSearchLimitNumber = (tier: string): number => {
    switch (tier) {
      case "premium":
      case "annual":
        return Number.POSITIVE_INFINITY
      case "basic":
        return 20
      default:
        return 5
    }
  }

  const getSearchLimitDisplay = (tier: string): string => {
    switch (tier) {
      case "premium":
      case "annual":
        return "Unlimited"
      case "basic":
        return "20 per day"
      default:
        return "5 per day"
    }
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    // Handle saving verse to user's collection
    console.log("Saving verse:", verse)
    // This would typically call an API to save the verse
  }

  // Calculate search usage percentage for progress bar
  const getSearchUsagePercentage = () => {
    if (searchLimit === Number.POSITIVE_INFINITY) return 0
    return Math.min(100, (searchCount / searchLimit) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

      <div className="relative container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-2xl">
                <span className="text-amber-600">Bible</span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
                  AF
                </span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 dark:text-gray-400">Continue your spiritual journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getTierBadge(user.subscription.tier)}
              <Link href="/settings">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Continue your spiritual journey</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Search className="text-amber-600" size={16} />
                      AI Searches Today
                    </p>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                      {searchLimit === Number.POSITIVE_INFINITY ? "Unlimited" : `${searchCount}/${searchLimit}`}
                    </span>
                  </div>

                  {/* Progress bar for search usage */}
                  {searchLimit !== Number.POSITIVE_INFINITY && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          getSearchUsagePercentage() > 80
                            ? "bg-red-500"
                            : getSearchUsagePercentage() > 50
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${getSearchUsagePercentage()}%` }}
                      ></div>
                    </div>
                  )}

                  {searchLimit !== Number.POSITIVE_INFINITY && searchCount >= searchLimit && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Limit reached!{" "}
                      <Link href="/pricing" className="underline">
                        Upgrade
                      </Link>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subscription</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                      {user.subscription.tier}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {user.preferences.verseCategories?.length || 0} Selected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "search", label: "AI Search", icon: Search },
            { id: "guidance", label: "Life Guidance", icon: MessageCircle },
            { id: "saved", label: "Saved Verses", icon: Heart },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Calendar className="text-amber-600" />
                    Daily Verse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyVerse userId={user.id} />
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <TrendingUp className="text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    variant="outline"
                    onClick={() => setActiveTab("search")}
                  >
                    <Search size={16} className="mr-2" />
                    Search Bible with AI
                  </Button>
                  <Button
                    className="w-full justify-start border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    variant="outline"
                    onClick={() => setActiveTab("guidance")}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Get Life Guidance
                  </Button>
                  <Button
                    className="w-full justify-start border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    variant="outline"
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart size={16} className="mr-2" />
                    View Saved Verses
                  </Button>
                  {user.subscription.tier === "free" && (
                    <Link href="/pricing" className="block">
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Crown size={16} className="mr-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              {/* Traditional Bible Reading Image */}
              <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Where Tradition Meets Innovation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Experience the timeless wisdom of Scripture enhanced by modern AI technology. Our platform
                        respects the sacred nature of God's Word while making it more accessible than ever.
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1 text-amber-600">
                          <Search size={14} />
                          AI-Powered Search
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <MessageCircle size={14} />
                          Personal Guidance
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <Heart size={14} />
                          Save & Reflect
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full md:w-80">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-xl opacity-20"></div>
                      <Image
                        src="/images/hand-bible-pages.png"
                        alt="Traditional Bible reading"
                        width={320}
                        height={240}
                        className="relative w-full h-auto rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "search" && (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <Search className="text-amber-600" />
                  AI Bible Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIBibleSearch userId={user.id} onSearchComplete={handleSearchComplete} />
              </CardContent>
            </Card>
          )}

          {activeTab === "guidance" && (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <MessageCircle className="text-green-600" />
                  Life Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LifeGuidance
                  userId={user.id}
                  onSaveVerse={handleSaveVerse}
                  onGuidanceComplete={handleSearchComplete}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === "saved" && (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-amber-200 dark:border-amber-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <Heart className="text-red-600" />
                  Saved Verses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SavedVersesManager userId={user.id} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upgrade Prompt for Free Users */}
        {user.subscription.tier === "free" && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Unlock Premium Features
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get unlimited AI searches, advanced guidance, and exclusive content
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1 text-purple-600">
                      <Search size={14} />
                      Unlimited AI Searches
                    </span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <MessageCircle size={14} />
                      Advanced Guidance
                    </span>
                    <span className="flex items-center gap-1 text-purple-600">
                      <Heart size={14} />
                      Unlimited Saved Verses
                    </span>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Crown size={16} className="mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
