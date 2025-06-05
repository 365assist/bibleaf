"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DailyVerse from "@/components/daily-verse-with-tts"
import AIBibleSearch from "@/components/ai-bible-search"
import LifeGuidance from "@/components/life-guidance"
import SavedVersesManager from "@/components/saved-verses-manager"
import ConversationalGuidance from "@/components/conversational-guidance"
import CrossReferenceExplorer from "@/components/cross-reference-explorer"
import { SEOHead } from "@/components/seo-head"
import { AIDisclaimer } from "@/components/ai-disclaimer"
import SubscriptionModal from "@/components/subscription/subscription-modal"
import { useToast } from "@/hooks/use-toast"
import {
  Book,
  Search,
  Heart,
  Settings,
  LogOut,
  Sunrise,
  MessageCircle,
  Network,
  Sparkles,
  Shield,
  Compass,
  Star,
} from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setIsLoading(false)

    // Set personalized greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 17) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [router])

  const handleLogout = () => {
    AuthService.logout()
    toast({
      title: "May God's peace be with you",
      description: "You have been safely logged out. Come back anytime for spiritual nourishment.",
    })
    router.push("/")
  }

  const handleSaveVerse = (verse: { reference: string; text: string }) => {
    toast({
      title: "Verse saved to your heart",
      description: `${verse.reference} has been added to your collection of treasured scriptures.`,
    })
  }

  // Get the correct user ID for components
  const getUserId = () => {
    if (!user) return ""
    return user.id || user.uid || user.email || "anonymous"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl animate-pulse">
            <Star className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-amber-800 dark:text-amber-300 font-medium">Preparing your spiritual sanctuary...</p>
          <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
            "Be still and know that I am God" - Psalm 46:10
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Spiritual Sanctuary | BibleAF - Your Digital Place of Worship"
        description="Enter your personal spiritual sanctuary with AI-powered Bible study, divine guidance, and soul-nourishing scripture exploration."
        canonical="/dashboard"
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        {/* Heavenly Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-48 h-48 bg-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Debug Info for Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              <strong>Debug Info:</strong> User ID: {getUserId()}, User Object: {JSON.stringify(user, null, 2)}
            </div>
          )}

          {/* Inspirational Header */}
          <header className="mb-8 text-center">
            <div className="divine-light-card rounded-2xl p-8 shadow-2xl mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mr-4">
                  <Sunrise className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    {greeting}, {user?.name || user?.displayName || "Beloved Child of God"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">Welcome to your spiritual sanctuary</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-2">
                  "Your word is a lamp for my feet, a light on my path."
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">— Psalm 119:105</p>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Personalize Experience
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Depart in Peace
                </Button>
              </div>
            </div>
          </header>

          {/* Enhanced Spiritual Navigation */}
          <Tabs defaultValue="daily" className="space-y-6">
            <div className="divine-light-card rounded-xl p-2 shadow-lg">
              <TabsList className="grid w-full grid-cols-6 bg-transparent">
                <TabsTrigger
                  value="daily"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Sunrise className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Daily Bread</span>
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Seek & Find</span>
                </TabsTrigger>
                <TabsTrigger
                  value="guidance"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Compass className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Divine Guidance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="conversation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Heart to Heart</span>
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Network className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Connections</span>
                </TabsTrigger>
                <TabsTrigger
                  value="treasures"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Heart Treasures</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Daily Spiritual Nourishment */}
            <TabsContent value="daily" className="space-y-6">
              <Card className="divine-light-card border-amber-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mb-4">
                    <Sunrise className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    Daily Spiritual Nourishment
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Receive your daily portion of divine wisdom, lovingly prepared for your spiritual journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DailyVerse userId={getUserId()} onSaveVerse={handleSaveVerse} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                  <AIDisclaimer />
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Seek and Find - Enhanced Bible Search */}
            <TabsContent value="search" className="space-y-6">
              <Card className="divine-light-card border-blue-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Seek and You Shall Find
                  </CardTitle>
                  <CardDescription className="text-lg">
                    "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
                    - Matthew 7:7
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIBibleSearch userId={getUserId()} onSaveVerse={handleSaveVerse} />
                </CardContent>
                <CardFooter>
                  <AIDisclaimer />
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Divine Guidance - Life Counseling */}
            <TabsContent value="guidance" className="space-y-6">
              <Card className="divine-light-card border-green-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-4">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    Divine Guidance & Comfort
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Bring your burdens, questions, and seeking heart. Find biblical wisdom for life's journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LifeGuidance userId={getUserId()} onSaveVerse={handleSaveVerse} />
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 italic">
                      "Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Heart to Heart Conversations */}
            <TabsContent value="conversation" className="space-y-6">
              <Card className="divine-light-card border-purple-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                    Heart to Heart Conversations
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Engage in deeper spiritual dialogue and receive personalized biblical counseling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConversationalGuidance userId={getUserId()} onSaveVerse={handleSaveVerse} />
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-400 italic">
                      "The Lord your God is with you, the Mighty Warrior who saves." - Zephaniah 3:17
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Scripture Connections */}
            <TabsContent value="connections" className="space-y-6">
              <Card className="divine-light-card border-indigo-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                    Scripture Connections
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Discover the beautiful tapestry of God's Word through cross-references and thematic connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CrossReferenceExplorer reference="John 3:16" onSaveVerse={handleSaveVerse} />
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="text-sm text-indigo-700 dark:text-indigo-400 italic">
                      "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in
                      righteousness." - 2 Timothy 3:16
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Heart Treasures - Saved Verses */}
            <TabsContent value="treasures" className="space-y-6">
              <Card className="divine-light-card border-red-200 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    Treasures of the Heart
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Your personal collection of meaningful scriptures that speak to your soul
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SavedVersesManager userId={getUserId()} />
                </CardContent>
                <CardFooter>
                  <div className="w-full text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400 italic">
                      "Store up for yourselves treasures in heaven, where moths and vermin do not destroy." - Matthew
                      6:20
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Spiritual Growth Invitation */}
          <Card className="mt-8 divine-light-card border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/50 dark:to-yellow-900/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-amber-700 dark:text-amber-400">
                Deepen Your Spiritual Journey
              </CardTitle>
              <CardDescription className="text-lg">
                Unlock unlimited divine insights and premium spiritual tools to enrich your walk with God
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Join thousands of believers who have discovered deeper meaning in Scripture through our premium
                spiritual companion. Experience unlimited AI-powered insights, audio Scripture readings, and
                personalized spiritual growth plans.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">Unlimited Guidance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No limits on AI spiritual counseling</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Book className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">Audio Scripture</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Listen to God's Word with beautiful voices</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">Growth Plans</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Personalized spiritual development</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-center">
              <Button
                className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsSubscriptionModalOpen(true)}
              >
                Begin Your Premium Journey
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan="free"
        userId={getUserId()}
      />
    </>
  )
}
