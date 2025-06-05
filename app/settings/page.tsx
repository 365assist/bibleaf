"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPreferences } from "@/components/user-preferences"
import { SEOHead } from "@/components/seo-head"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Settings | BibleAF - AI-Powered Bible Study"
        description="Customize your BibleAF experience with personalized settings and preferences."
        canonical="/settings"
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-amber-600">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your BibleAF experience</p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <UserPreferences userId={user?.uid} />
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-gray-600 dark:text-gray-400">Free Plan</p>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Upgrade to Premium</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
