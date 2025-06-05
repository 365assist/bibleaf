"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "@/lib/onboarding-context"
import { ArrowLeft, ArrowRight } from "lucide-react"

const BIBLE_TRANSLATIONS = [
  { value: "KJV", label: "King James Version (KJV)" },
  { value: "NIV", label: "New International Version (NIV)" },
  { value: "ESV", label: "English Standard Version (ESV)" },
  { value: "NKJV", label: "New King James Version (NKJV)" },
  { value: "NLT", label: "New Living Translation (NLT)" },
  { value: "NASB", label: "New American Standard Bible (NASB)" },
]

const TOPIC_INTERESTS = [
  { id: "faith", label: "Faith & Belief" },
  { id: "prayer", label: "Prayer & Meditation" },
  { id: "wisdom", label: "Wisdom & Knowledge" },
  { id: "family", label: "Family & Relationships" },
  { id: "healing", label: "Healing & Comfort" },
  { id: "guidance", label: "Guidance & Direction" },
  { id: "worship", label: "Worship & Praise" },
  { id: "prophecy", label: "Prophecy & End Times" },
]

export default function PreferencesStep() {
  const { setCurrentStep, userPreferences, updatePreferences } = useOnboarding()
  const [selectedTopics, setSelectedTopics] = useState<string[]>(userPreferences.topicInterests)

  // Update context when topics change
  useEffect(() => {
    updatePreferences({ topicInterests: selectedTopics })
  }, [selectedTopics, updatePreferences])

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-2">Personalize Your Experience</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Let us know your preferences to customize your Bible study experience
      </p>

      <div className="space-y-8">
        {/* Preferred Bible Translation */}
        <div>
          <Label htmlFor="translation" className="text-lg font-medium mb-2 block">
            Preferred Bible Translation
          </Label>
          <Select
            value={userPreferences.preferredTranslation}
            onValueChange={(value) => updatePreferences({ preferredTranslation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a translation" />
            </SelectTrigger>
            <SelectContent>
              {BIBLE_TRANSLATIONS.map((translation) => (
                <SelectItem key={translation.value} value={translation.value}>
                  {translation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reading Goal */}
        <div>
          <Label className="text-lg font-medium mb-2 block">Reading Goal</Label>
          <RadioGroup
            value={userPreferences.readingGoal}
            onValueChange={(value) => updatePreferences({ readingGoal: value as any })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily reading (chapters or verses each day)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly study (deeper exploration on weekends)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual">Casual reading (no specific schedule)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Topic Interests */}
        <div>
          <Label className="text-lg font-medium mb-2 block">Topics of Interest (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2">
            {TOPIC_INTERESTS.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-2">
                <Checkbox
                  id={topic.id}
                  checked={selectedTopics.includes(topic.id)}
                  onCheckedChange={() => handleTopicToggle(topic.id)}
                />
                <Label htmlFor={topic.id}>{topic.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={userPreferences.notificationsEnabled}
              onCheckedChange={(checked) => updatePreferences({ notificationsEnabled: !!checked })}
            />
            <Label htmlFor="notifications">Enable daily verse notifications</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep("welcome")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={() => setCurrentStep("features")}
          className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white flex items-center gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
