import { BookOpen } from "lucide-react"

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-4">
          <BookOpen className="text-amber-600 animate-pulse" size={32} />
          <span className="text-amber-600">Bible</span>
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg">AF</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400">Preparing your spiritual journey...</p>
      </div>
    </div>
  )
}
