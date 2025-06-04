"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [preferences, setPreferences] = useState({
    dailyVerse: true,
    weeklyInsights: true,
    monthlyNewsletter: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubscribed(true)
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive your first daily verse tomorrow morning.",
      })
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <Card className="max-w-md mx-auto bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Welcome to the BibleAF Community!
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm">
            Check your email for a confirmation message. Your first daily verse will arrive tomorrow morning.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <Mail className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Daily Inspiration</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized Bible verses and AI insights delivered to your inbox
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
              aria-label="Email address for subscription"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Subscription Preferences:</p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dailyVerse"
                  checked={preferences.dailyVerse}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, dailyVerse: checked as boolean }))}
                />
                <label htmlFor="dailyVerse" className="text-sm">
                  Daily Bible verse with AI insights
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weeklyInsights"
                  checked={preferences.weeklyInsights}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, weeklyInsights: checked as boolean }))
                  }
                />
                <label htmlFor="weeklyInsights" className="text-sm">
                  Weekly spiritual insights and guidance
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthlyNewsletter"
                  checked={preferences.monthlyNewsletter}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, monthlyNewsletter: checked as boolean }))
                  }
                />
                <label htmlFor="monthlyNewsletter" className="text-sm">
                  Monthly newsletter with community updates
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Daily Inspiration"
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  )
}
