"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Sun, Moon, ArrowRight } from "lucide-react"

export default function ClientHomePage() {
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Image 
              src="/christian-logo.png" 
              alt="BibleAF Logo" 
              width={36} 
              height={36} 
              className="mr-1"
            />
            <span className="text-primary">Bible</span>
            <span className="bg-secondary text-secondary-foreground px-1 rounded">AF</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 scripture-button"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="/background-image.jpg" 
            alt="Background" 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your AI-Powered <span className="text-primary">Bible</span> Companion
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Discover deeper insights, find guidance, and explore the Word of God with the help of advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center scripture-button"
                >
                  Get Started Free
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3 rounded-md border hover:bg-muted text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-background rounded-lg border shadow-lg p-6 prayer-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-lg font-bold">✝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Verse</h3>
                    <p className="text-sm text-muted-foreground">May 25, 2025</p>
                  </div>
                </div>
                <blockquote className="italic mb-4 text-lg">
                  "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
                </blockquote>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Jeremiah 29:11</span>
                  <button className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                    Share <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore the Word with Divine Guidance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              BibleAF combines the timeless wisdom of scripture with modern AI technology to deepen your spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-xl font-bold">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Bible Search</h3>
              <p className="text-muted-foreground mb-4">
                Ask questions in natural language and receive relevant verses and passages from the Bible.
              </p>
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                Try it now <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-xl font-bold">🧭</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Life Guidance System</h3>
              <p className="text-muted-foreground mb-4">
                Receive personalized spiritual guidance based on your specific life situations and challenges.
              </p>
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                Get guidance <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="text-xl font-bold">📖</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Bible Reader</h3>
              <p className="text-muted-foreground mb-4">
                Study the Bible with verse tracking, bookmarking, and personalized insights to deepen your understanding.
              </p>
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                Start reading <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Testimonials from the Faithful</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from believers who have deepened their spiritual journey with BibleAF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg font-bold">M</span>
                </div>
                <div>
                  <h3 className="font-semibold">Michael T.</h3>
                  <p className="text-sm text-muted-foreground">Church Elder</p>
                </div>
              </div>
              <blockquote className="italic mb-4">
                "BibleAF has transformed my daily devotional time. The AI-powered search helps me find exactly what I need from scripture when counseling church members."
              </blockquote>
              <div className="flex text-yellow-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold">Sarah K.</h3>
                  <p className="text-sm text-muted-foreground">Youth Pastor</p>
                </div>
              </div>
              <blockquote className="italic mb-4">
                "The Life Guidance feature has been incredible for helping our youth group members navigate difficult questions and find biblical wisdom for modern challenges."
              </blockquote>
              <div className="flex text-yellow-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            <div className="bg-background rounded-lg border p-6 prayer-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg font-bold">J</span>
                </div>
                <div>
                  <h3 className="font-semibold">James R.</h3>
                  <p className="text-sm text-muted-foreground">Bible Study Leader</p>
                </div>
              </div>
              <blockquote className="italic mb-4">
                "As someone who leads weekly Bible studies, the insights and connections BibleAF provides have added incredible depth to our discussions and personal reflections."
              </blockquote>
              <div className="flex text-yellow-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-background rounded-lg border p-8 md:p-12 prayer-card">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Begin Your Spiritual Journey Today</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of believers who are deepening their faith with BibleAF. Start for free and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-center scripture-button"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/login"
                  className="px-6 py-3 rounded-md border hover:bg-muted text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to receive daily verses, spiritual insights, and updates from BibleAF.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-md border"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 scripture-button"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Image 
                  src="/christian-logo.png" 
                  alt="BibleAF Logo" 
                  width={36} 
                  height={36} 
                  className="mr-1"
                />
                <span className="text-primary">Bible</span>
                <span className="bg-secondary text-secondary-foreground px-1 rounded">AF</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Your AI-powered Bible companion for spiritual guidance and study.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Bible Search</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Life Guidance</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Bible Reader</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Daily Verses</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Verse Collections</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Devotionals</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Study Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Church Resources</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">API for Developers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BibleAF. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <select className="text-sm border rounded-md px-2 py-1 bg-background">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
