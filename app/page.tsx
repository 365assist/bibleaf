"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  MessageSquare,
  Volume2,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle,
  Quote,
} from "lucide-react"
import { OnboardingTour } from "@/components/onboarding-tour"
import { EmailSubscription } from "@/components/email-subscription"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is new (you can implement this logic)
    const isNewUser = !localStorage.getItem("hasVisited")
    if (isNewUser) {
      setShowOnboarding(true)
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  const features = [
    {
      icon: <Search className="w-8 h-8 text-warm-600" />,
      title: "AI-Powered Search",
      description: "Find verses by topic, emotion, or life situation with intelligent context understanding",
      image: "/images/ai-bible-robot.png",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-warm-600" />,
      title: "Daily Devotionals",
      description: "Personalized Scripture and insights delivered fresh each morning",
      image: "/images/hand-bible-pages.png",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-warm-600" />,
      title: "Biblical Guidance",
      description: "Get wisdom for life's challenges through AI-powered biblical counseling",
      image: "/images/ai-jesus-teaching-children.png",
    },
    {
      icon: <Volume2 className="w-8 h-8 text-warm-600" />,
      title: "Audio Scripture",
      description: "Listen to beautifully narrated Bible passages with natural voices",
      image: "/images/divine-sunset-mountains.png",
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Youth Pastor",
      content:
        "BibleAF has revolutionized how I prepare sermons. The AI insights are incredibly deep and theologically sound.",
      rating: 5,
    },
    {
      name: "David L.",
      role: "Seminary Student",
      content: "The cross-reference feature and original language tools have made my studies so much more efficient.",
      rating: 5,
    },
    {
      name: "Maria R.",
      role: "Small Group Leader",
      content:
        "My group loves the conversational guidance feature. It's like having a biblical counselor available 24/7.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "1M+", label: "Verses Searched" },
    { number: "25,000+", label: "Guidance Sessions" },
    { number: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-warm-50 via-white to-warm-100 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/divine-light-background.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-warm-100 text-warm-800 border-warm-300 hover:bg-warm-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Bible Study
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-warm-900 leading-tight">
                  Discover Scripture with <span className="gradient-warm-text">AI Intelligence</span>
                </h1>
                <p className="text-xl text-warm-700 leading-relaxed">
                  Experience the Bible like never before with AI-powered search, personalized devotionals, and biblical
                  guidance that meets you where you are.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="refined-button text-lg px-8 py-4" asChild>
                  <Link href="/auth/signup">
                    Start Your Journey Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-warm-300 text-warm-700 hover:bg-warm-50"
                  asChild
                >
                  <Link href="/dashboard">
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-warm-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/ai-jesus-teaching-children.png"
                  alt="AI-powered biblical learning - Modern technology enhancing traditional Scripture study"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-warm-50 border-y border-warm-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-warm-900 mb-2">{stat.number}</div>
                <div className="text-warm-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-warm-900 mb-6">
              Everything You Need for <span className="gradient-warm-text">Deeper Study</span>
            </h2>
            <p className="text-xl text-warm-700 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with timeless wisdom to transform your Bible
              study experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {features.map((feature, index) => (
              <div key={index} className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Card className="refined-card border-warm-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-warm-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-warm-900">{feature.title}</h3>
                        <p className="text-warm-700 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-warm-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-warm-900 mb-6">
              Loved by <span className="gradient-warm-text">Believers Worldwide</span>
            </h2>
            <p className="text-xl text-warm-700">See how BibleAF is transforming Bible study for thousands of users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="refined-card border-warm-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-warm-300" />
                    <p className="text-warm-700 leading-relaxed">{testimonial.content}</p>
                    <div className="pt-4 border-t border-warm-200">
                      <div className="font-semibold text-warm-900">{testimonial.name}</div>
                      <div className="text-sm text-warm-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-warm-900 mb-4">Stay Connected with Daily Inspiration</h2>
            <p className="text-xl text-warm-700">
              Get personalized Bible verses and AI insights delivered to your inbox
            </p>
          </div>
          <EmailSubscription />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-warm-100 to-warm-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-warm-900">
              Ready to Transform Your <span className="gradient-warm-text">Bible Study?</span>
            </h2>
            <p className="text-xl text-warm-700">
              Join thousands of believers who are discovering deeper meaning in Scripture with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="refined-button text-lg px-8 py-4" asChild>
                <Link href="/auth/signup">
                  Get Started Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-warm-300 text-warm-700 hover:bg-warm-50"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Tour */}
      {mounted && showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}
    </div>
  )
}
