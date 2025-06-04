"use client"

import type React from "react"

import { useState, useEffect, Suspense, lazy } from "react"
import Link from "next/link"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, Book, Heart, Zap, Users, Star, Search, ArrowRight, CheckCircle } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"
import { EmailSubscription } from "@/components/email-subscription"
import { OnboardingTour } from "@/components/onboarding-tour"
import { AIDisclaimer } from "@/components/ai-disclaimer"
import { useToast } from "@/hooks/use-toast"

// Lazy load heavy components
const InteractiveDemo = lazy(() => import("@/components/interactive-demo"))

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const user = AuthService.getCurrentUser()
    setIsLoggedIn(!!user)

    // Show onboarding for new users
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding && !user) {
      setShowOnboarding(true)
    }
  }, [])

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "AI-Powered Search",
      description:
        "Find relevant Bible verses instantly with intelligent AI search that understands context and meaning.",
      benefits: ["Contextual understanding", "Instant results", "Multiple translations"],
    },
    {
      icon: <Book className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Daily Verses",
      description: "Receive personalized daily verses with AI-generated insights tailored to your spiritual journey.",
      benefits: ["Personalized content", "Daily insights", "Growth tracking"],
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Life Guidance",
      description: "Get biblical wisdom and guidance for life's challenges through AI-powered spiritual counseling.",
      benefits: ["Biblical wisdom", "Life application", "Practical steps"],
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Text-to-Speech",
      description: "Listen to scripture with high-quality AI voices for a more immersive experience.",
      benefits: ["Multiple voices", "Offline listening", "Speed control"],
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Youth Pastor",
      text: "BibleAF has transformed my daily devotions. The AI insights are incredibly meaningful and help me prepare better sermons.",
      rating: 5,
      verified: true,
    },
    {
      name: "David L.",
      role: "Seminary Student",
      text: "Finding relevant verses for my research has never been easier. The contextual search is a game-changer for biblical studies.",
      rating: 5,
      verified: true,
    },
    {
      name: "Maria R.",
      role: "Small Group Leader",
      text: "The daily verses with AI commentary have deepened my understanding of Scripture and enriched our group discussions.",
      rating: 5,
      verified: true,
    },
  ]

  const stats = [
    { number: "50K+", label: "Active Users", description: "Believers worldwide" },
    { number: "1M+", label: "Verses Searched", description: "AI-powered searches" },
    { number: "100K+", label: "Daily Insights", description: "Generated monthly" },
    { number: "99.9%", label: "Uptime", description: "Reliable service" },
  ]

  return (
    <>
      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section
          className="relative flex min-h-screen items-center justify-center p-4 text-center overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950" />

          <div className="relative z-10 divine-light-card rounded-2xl p-8 shadow-2xl max-w-6xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div>
                  <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-800">
                    ✨ AI-Powered Bible Study
                  </Badge>
                  <h1
                    id="hero-heading"
                    className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500"
                  >
                    BibleAF
                  </h1>
                  <p className="text-xl lg:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    Experience the Bible like never before with AI-powered insights, daily verses, and life guidance.
                  </p>
                </div>

                {/* Quick Search */}
                <form onSubmit={handleQuickSearch} className="flex gap-2 max-w-md" role="search">
                  <Input
                    type="search"
                    placeholder="Search 'love', 'hope', 'strength'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    aria-label="Quick Bible search"
                  />
                  <Button type="submit" size="icon" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold px-8 py-4 text-lg"
                    asChild
                  >
                    <Link href="/auth/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 px-8 py-4 text-lg"
                    asChild
                  >
                    <Link href="#demo">Try Demo</Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>50K+ users</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/images/ai-bible-robot.png"
                  alt="AI-powered Bible study assistant reading Holy Bible with divine light"
                  width={500}
                  height={600}
                  className="rounded-lg shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Floating elements for visual appeal */}
                <div className="absolute -top-4 -right-4 bg-amber-100 dark:bg-amber-900 rounded-full p-3 shadow-lg animate-bounce">
                  <Book className="h-6 w-6 text-amber-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-100 dark:bg-blue-900 rounded-full p-3 shadow-lg animate-pulse">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="stats-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="stats-heading" className="sr-only">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="relative py-20 px-4 overflow-hidden scroll-mt-16" aria-labelledby="demo-heading">
          <div className="absolute inset-0">
            <OptimizedImage
              src="/images/divine-sunset-mountains.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              quality={75}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-transparent to-amber-900/30" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 id="demo-heading" className="text-4xl font-bold mb-4 text-white">
                Experience AI-Powered Bible Study
              </h2>
              <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
                Try our intelligent search and guidance features right now - no signup required
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              }
            >
              <InteractiveDemo />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="features-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Powerful Features for Modern Bible Study
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Combine the timeless wisdom of Scripture with cutting-edge AI technology for a deeper spiritual
                experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Traditional Meets Modern Section */}
        <section
          className="py-20 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950"
          aria-labelledby="tradition-heading"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <OptimizedImage
                  src="/images/hand-bible-pages.png"
                  alt="Hands gently turning pages of an open Holy Bible in warm, reverent lighting"
                  width={600}
                  height={700}
                  className="rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 100vw, 600px"
                  quality={90}
                />
              </div>

              <div className="order-1 lg:order-2">
                <h2 id="tradition-heading" className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Where Tradition Meets Innovation
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  We honor the sacred tradition of Bible study while embracing modern technology to make Scripture more
                  accessible and meaningful than ever before.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Users, text: "Join 50,000+ believers worldwide", color: "text-blue-600" },
                    { icon: Book, text: "Complete Bible with AI insights", color: "text-green-600" },
                    { icon: Heart, text: "Personalized spiritual guidance", color: "text-red-600" },
                    { icon: Zap, text: "Instant answers to spiritual questions", color: "text-amber-600" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/about">
                    Learn Our Story
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900" aria-labelledby="testimonials-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover how BibleAF is transforming spiritual journeys worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex" aria-label={`${testimonial.rating} out of 5 stars`}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <footer>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    </footer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Email Subscription Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Stay Connected with Daily Inspiration
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Receive personalized Bible verses, AI insights, and spiritual guidance delivered to your inbox every day.
            </p>
            <EmailSubscription />
          </div>
        </section>

        {/* AI Disclaimer Section */}
        <section className="py-12 px-4 bg-amber-50 dark:bg-amber-950/20">
          <div className="max-w-4xl mx-auto">
            <AIDisclaimer />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-yellow-500" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Bible Study?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of believers who are discovering deeper meaning in Scripture with AI-powered insights and
              personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-8 py-4 text-lg"
                asChild
              >
                <Link href="/auth/signup">
                  Start Your Journey Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg"
                asChild
              >
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </div>

            <div className="mt-8 text-amber-100 text-sm">
              <p>✓ Free forever plan available • ✓ No credit card required • ✓ Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 text-white" role="contentinfo">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
                  BibleAF
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  AI-powered Bible study for the modern believer. Experience Scripture with intelligent insights and
                  personalized guidance.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <nav>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                        AI Search
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                        Daily Verses
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                        Life Guidance
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                        Text-to-Speech
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <nav>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <Link href="/about" className="hover:text-amber-400 transition-colors">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-amber-400 transition-colors">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Account</h4>
                <nav>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="hover:text-amber-400 transition-colors">
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="hover:text-amber-400 transition-colors">
                        Settings
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
              <p>&copy; 2024 BibleAF. All rights reserved. Built with ❤️ for the body of Christ.</p>
              <p className="mt-2 text-sm">
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
                {" • "}
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
                {" • "}
                <Link href="/accessibility" className="hover:text-amber-400 transition-colors">
                  Accessibility
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={() => {
            setShowOnboarding(false)
            localStorage.setItem("hasSeenOnboarding", "true")
          }}
        />
      )}
    </>
  )
}
