import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNavigation } from "@/components/main-navigation"
import { Search, Heart, MessageCircle, Sparkles, Users, Shield, ArrowRight, Gift, Star, Play } from "lucide-react"

// Generate static metadata for better SEO
export const metadata: Metadata = {
  title: "BibleAF - AI-Powered Bible Study & Spiritual Guidance",
  description:
    "Experience Scripture like never before with AI-powered insights, daily devotionals, spiritual guidance, and pastoral support. Join thousands discovering deeper faith through intelligent Bible study.",
  keywords: [
    "Bible study",
    "AI Bible",
    "spiritual guidance",
    "daily devotionals",
    "Christian app",
    "biblical insights",
    "scripture search",
    "faith journey",
    "pastoral care",
    "Bible verses",
  ],
  openGraph: {
    title: "BibleAF - AI-Powered Bible Study & Spiritual Guidance",
    description: "Experience Scripture like never before with AI-powered insights and spiritual guidance",
    type: "website",
    images: [
      {
        url: "/images/divine-light-background.png",
        width: 1200,
        height: 630,
        alt: "BibleAF - AI-Powered Bible Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BibleAF - AI-Powered Bible Study",
    description: "Experience Scripture with AI-powered insights and spiritual guidance",
  },
}

// Main features data for better maintainability
const mainFeatures = [
  {
    title: "AI-Powered Bible Search",
    description:
      "Find exactly what you're looking for with intelligent Scripture search that understands context and meaning",
    icon: Search,
    href: "/dashboard",
    color: "from-blue-500 to-blue-600",
    badge: "Smart Search",
  },
  {
    title: "Daily Verse & Devotional",
    description: "Start each day with personally curated verses and AI-generated reflections for spiritual growth",
    icon: Gift,
    href: "/daily-verse",
    color: "from-amber-500 to-orange-500",
    badge: "Daily Inspiration",
  },
  {
    title: "Life Guidance",
    description: "Receive biblical wisdom and pastoral guidance for life's decisions and challenges",
    icon: Heart,
    href: "/guidance",
    color: "from-green-500 to-emerald-500",
    badge: "Divine Wisdom",
  },
  {
    title: "Heart to Heart",
    description: "Experience compassionate spiritual conversations for emotional support and encouragement",
    icon: MessageCircle,
    href: "/heart-to-heart",
    color: "from-purple-500 to-violet-500",
    badge: "Pastoral Care",
  },
]

const testimonials = [
  {
    name: "Sarah M.",
    role: "Youth Pastor",
    content:
      "BibleAF has transformed how I prepare sermons. The AI insights help me find connections I never saw before.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "Seminary Student",
    content: "The theological depth combined with practical application makes this indispensable for my studies.",
    rating: 5,
  },
  {
    name: "Maria R.",
    role: "Working Mother",
    content: "Finally, a Bible app that understands my questions and provides comfort when I need it most.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
      <MainNavigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 dark:from-amber-400/5 dark:to-orange-400/5" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Bible Study
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent leading-tight">
              Experience Scripture
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">Like Never Before</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover deeper meaning in God's Word with AI-powered insights, personalized devotionals, and
              compassionate spiritual guidance for your faith journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6 divine-button">
                <Link href="/dashboard">
                  <Search className="h-5 w-5 mr-2" />
                  Start Exploring Scripture
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                Theologically Sound
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                10,000+ Users
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                4.9/5 Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Spiritual Growth</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deepen your relationship with God and understand His Word
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="divine-light-card group hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="secondary" className="mb-2 w-fit mx-auto">
                      {feature.badge}
                    </Badge>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link href={feature.href}>
                        Explore <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Faith Communities</h2>
            <p className="text-xl text-muted-foreground">
              See how BibleAF is transforming Bible study and spiritual growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="divine-light-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Spiritual Journey Today</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who are discovering deeper meaning in Scripture with AI-powered insights and pastoral
              guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-2xl">Bible</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-2xl">AF</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                AI-powered Bible study for deeper spiritual understanding and growth. Experience Scripture with
                intelligent insights and pastoral care.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                Theologically reviewed and pastorally guided
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Bible Search
                  </Link>
                </li>
                <li>
                  <Link href="/daily-verse" className="hover:text-white transition-colors">
                    Daily Verse
                  </Link>
                </li>
                <li>
                  <Link href="/guidance" className="hover:text-white transition-colors">
                    Life Guidance
                  </Link>
                </li>
                <li>
                  <Link href="/heart-to-heart" className="hover:text-white transition-colors">
                    Heart to Heart
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BibleAF. Sharing God's Word with AI-powered insights.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
