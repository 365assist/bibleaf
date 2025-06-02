"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Book, Heart, Zap, Users, Star, Moon, Sun } from "lucide-react"
import InteractiveDemo from "@/components/interactive-demo"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = AuthService.getCurrentUser()
    setIsLoggedIn(!!user)
  }, [])

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-amber-600" />,
      title: "AI-Powered Search",
      description:
        "Find relevant Bible verses instantly with intelligent AI search that understands context and meaning.",
    },
    {
      icon: <Book className="h-8 w-8 text-amber-600" />,
      title: "Daily Verses",
      description: "Receive personalized daily verses with AI-generated insights tailored to your spiritual journey.",
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-600" />,
      title: "Life Guidance",
      description: "Get biblical wisdom and guidance for life's challenges through AI-powered spiritual counseling.",
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: "Text-to-Speech",
      description: "Listen to scripture with high-quality AI voices for a more immersive experience.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      text: "BibleAF has transformed my daily devotions. The AI insights are incredibly meaningful.",
      rating: 5,
    },
    {
      name: "David L.",
      text: "Finding relevant verses for my situations has never been easier. Amazing technology!",
      rating: 5,
    },
    {
      name: "Maria R.",
      text: "The daily verses with AI commentary have deepened my understanding of Scripture.",
      rating: 5,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header with Theme Toggle */}
      <header className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <span className="text-amber-600">Bible</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
              AF
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle - Available to all users */}
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center p-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950" />

        <div className="relative z-10 divine-light-card rounded-2xl p-8 shadow-2xl max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500">
                BibleAF
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
                Experience the Bible like never before with AI-powered insights, daily verses, and life guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold px-8 py-3"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 px-8 py-3"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/ai-bible-robot.png"
                alt="AI-powered Bible study with robot reading Holy Bible"
                width={400}
                height={500}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/divine-sunset-mountains.png)",
          }}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-transparent to-amber-900/30" />

        {/* Content */}
        <div className="relative z-10">
          <InteractiveDemo />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Powerful Features for Modern Bible Study
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Combine the timeless wisdom of Scripture with cutting-edge AI technology for a deeper spiritual
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional Meets Modern Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/hand-bible-pages.png"
                alt="Hand turning pages of Holy Bible in warm lighting"
                width={500}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Where Tradition Meets Innovation
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                We honor the sacred tradition of Bible study while embracing modern technology to make Scripture more
                accessible and meaningful than ever before.
              </p>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-amber-600 mr-3" />
                  Join thousands of believers worldwide
                </li>
                <li className="flex items-center">
                  <Book className="h-5 w-5 text-amber-600 mr-3" />
                  Access the complete Bible with AI insights
                </li>
                <li className="flex items-center">
                  <Heart className="h-5 w-5 text-amber-600 mr-3" />
                  Personalized spiritual guidance
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-amber-600 mr-3" />
                  Instant answers to your spiritual questions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover how BibleAF is transforming spiritual journeys worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900 dark:text-white">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Your Bible Study?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of believers who are discovering deeper meaning in Scripture with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
            BibleAF
          </h3>
          <p className="text-gray-400 mb-6">AI-powered Bible study for the modern believer</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <Link href="/pricing" className="hover:text-amber-400 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
              Login
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
            <p>&copy; 2024 BibleAF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
