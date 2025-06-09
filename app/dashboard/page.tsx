import ComprehensiveBibleSearch from "@/components/comprehensive-bible-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BibleAF Dashboard</h1>
          <p className="text-lg text-gray-600">Your AI-powered Bible study companion</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bible Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-gray-500">Available translations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Verses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">31,000+</div>
              <p className="text-xs text-gray-500">Searchable verses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Active</div>
              <p className="text-xs text-gray-500">
                <Badge variant="secondary" className="text-xs">
                  Enhanced
                </Badge>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Bible Search */}
        <section className="mb-12">
          <ComprehensiveBibleSearch />
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📖 Daily Verse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Get your personalized daily Bible verse with AI insights</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🤖 AI Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Ask questions and receive biblical guidance powered by AI</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔊 Text-to-Speech</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Listen to Bible verses with high-quality voice synthesis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
