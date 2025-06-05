"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface UserPreferencesProps {
  userId: string
}

export function UserPreferences({ userId }: UserPreferencesProps) {
  const [bibleTranslation, setBibleTranslation] = useState("KJV")
  const [enableDailyVerse, setEnableDailyVerse] = useState(true)
  const [enableTTS, setEnableTTS] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSavePreferences = async () => {
    setIsSaving(true)

    // Simulate saving preferences
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would save to a database
    // await saveUserPreferences(userId, { bibleTranslation, enableDailyVerse, enableTTS })

    setIsSaving(false)
    toast({
      title: "Preferences saved",
      description: "Your Bible study preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bible Study Preferences</CardTitle>
        <CardDescription>Customize your Bible study experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="translation">Preferred Bible Translation</Label>
          <Select value={bibleTranslation} onValueChange={setBibleTranslation}>
            <SelectTrigger id="translation" className="w-full">
              <SelectValue placeholder="Select translation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KJV">King James Version (KJV)</SelectItem>
              <SelectItem value="NIV">New International Version (NIV)</SelectItem>
              <SelectItem value="ESV">English Standard Version (ESV)</SelectItem>
              <SelectItem value="NASB">New American Standard Bible (NASB)</SelectItem>
              <SelectItem value="NLT">New Living Translation (NLT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="daily-verse">Daily Verse Notifications</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive a daily verse with AI commentary</p>
          </div>
          <Switch id="daily-verse" checked={enableDailyVerse} onCheckedChange={setEnableDailyVerse} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tts">Text-to-Speech</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable audio reading of Bible verses</p>
          </div>
          <Switch id="tts" checked={enableTTS} onCheckedChange={setEnableTTS} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreferences} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
