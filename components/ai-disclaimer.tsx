"use client"

import { AlertTriangle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AIDisclaimerProps {
  onFeedback?: () => void
}

export function AIDisclaimer({ onFeedback }: AIDisclaimerProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              <strong>Important:</strong> BibleAF's AI responses are for educational purposes and spiritual
              encouragement. Always verify insights with Scripture and consult trusted pastors or mentors for important
              life decisions. The Holy Spirit, not AI, is your ultimate guide for spiritual understanding.
            </p>
            {onFeedback && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFeedback}
                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Provide Feedback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
