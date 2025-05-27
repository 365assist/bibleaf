"use client"

import dynamic from 'next/dynamic'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Sun, Moon, Search, Book, Compass, Heart, User } from "lucide-react"

// Dynamically import AuthService with ssr: false to prevent server-side evaluation
const DynamicAuthProvider = dynamic(
  () => import('@/components/auth-provider').then((mod) => mod.AuthProvider),
  { ssr: false }
)

export default function ClientDashboardPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("search")
  const [user, setUser] = useState<any>(null)

  return (
    <DynamicAuthProvider setUser={setUser}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
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
              <Link href="/dashboard/profile" className="p-2 rounded-full hover:bg-muted">
                <User size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-6">
                {/* User Welcome */}
                <div className="bg-background rounded-lg border prayer-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="font-semibold">Welcome, {user?.name || "Friend"}</h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "This is the day that the Lord has made; let us rejoice and be glad in it." — Psalm 118:24
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Current Plan:</span>
                    <span className="font-medium">{user?.subscription?.tier || "Free"}</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="bg-background rounded-lg border prayer-card overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={() => setActiveTab("search")}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-md ${
                        activeTab === "search" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <Search size={18} />
                      <span>Bible Search</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("guidance")}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-md ${
                        activeTab === "guidance" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <Compass size={18} />
                      <span>Life Guidance</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("study")}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-md ${
                        activeTab === "study" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <Book size={18} />
                      <span>Bible Reader</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("verses")}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-md ${
                        activeTab === "verses" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <Heart size={18} />
                      <span>My Verses</span>
                    </button>
                  </div>
                </nav>

                {/* Usage Limits */}
                <div className="bg-background rounded-lg border prayer-card overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Daily Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Bible Searches</span>
                          <span className="text-sm font-medium">3 / 5</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Life Guidance</span>
                          <span className="text-sm font-medium">1 / 3</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "33%" }}></div>
                        </div>
                      </div>
                      <div className="pt-3 text-sm">
                        <p className="text-muted-foreground">
                          You're on the Free plan with limited daily usage.
                        </p>
                        <button className="text-secondary hover:text-secondary/80 text-sm mt-1">
                          Upgrade for unlimited access →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              <div className="bg-background rounded-lg border prayer-card overflow-hidden">
                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "search" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Bible Search</h2>
                      <p className="text-muted-foreground">
                        Search the Bible with natural language to find relevant verses and passages.
                      </p>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          type="text"
                          placeholder="What does the Bible say about..."
                          className="w-full pl-10 pr-4 py-3 border rounded-md"
                        />
                      </div>
                      <button className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 scripture-button">
                        Search
                      </button>
                      <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-3">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80">
                            Love
                          </button>
                          <button className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80">
                            Faith
                          </button>
                          <button className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80">
                            Hope
                          </button>
                          <button className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80">
                            Forgiveness
                          </button>
                          <button className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80">
                            Peace
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "guidance" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Life Guidance</h2>
                      <p className="text-muted-foreground">
                        Receive personalized spiritual guidance based on your situation.
                      </p>
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe your situation</label>
                        <textarea
                          placeholder="I'm struggling with..."
                          className="w-full p-3 border rounded-md h-32"
                        ></textarea>
                      </div>
                      <button className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 scripture-button">
                        Get Guidance
                      </button>
                      <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-3">Common Topics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button className="text-left p-3 bg-muted rounded-md text-sm hover:bg-muted/80">
                            Dealing with anxiety and worry
                          </button>
                          <button className="text-left p-3 bg-muted rounded-md text-sm hover:bg-muted/80">
                            Finding purpose and meaning
                          </button>
                          <button className="text-left p-3 bg-muted rounded-md text-sm hover:bg-muted/80">
                            Healing from past hurts
                          </button>
                          <button className="text-left p-3 bg-muted rounded-md text-sm hover:bg-muted/80">
                            Making difficult decisions
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "study" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Bible Reader</h2>
                      <p className="text-muted-foreground">
                        Read, study, and reflect on God's Word.
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <select className="px-3 py-2 border rounded-md bg-background">
                            <option>Genesis</option>
                            <option>Exodus</option>
                            <option>Leviticus</option>
                            {/* More books would be here */}
                            <option>John</option>
                            <option>Revelation</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 border rounded-md hover:bg-muted">
                            <span className="sr-only">Previous Chapter</span>
                            &larr;
                          </button>
                          <span className="text-sm">Chapter 1</span>
                          <button className="p-2 border rounded-md hover:bg-muted">
                            <span className="sr-only">Next Chapter</span>
                            &rarr;
                          </button>
                        </div>
                        <div>
                          <select className="px-3 py-2 border rounded-md bg-background">
                            <option>NIV</option>
                            <option>KJV</option>
                            <option>ESV</option>
                            <option>NKJV</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t">
                        <p className="verse">
                          <span className="font-bold">1</span> In the beginning God created the heavens and the earth.
                        </p>
                        <p className="verse">
                          <span className="font-bold">2</span> Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
                        </p>
                        <p className="verse">
                          <span className="font-bold">3</span> And God said, "Let there be light," and there was light.
                        </p>
                        <p className="verse">
                          <span className="font-bold">4</span> God saw that the light was good, and he separated the light from the darkness.
                        </p>
                        <p className="verse">
                          <span className="font-bold">5</span> God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "verses" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">My Saved Verses</h2>
                      <p className="text-muted-foreground">
                        Your personal collection of saved verses and notes.
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <input
                            type="text"
                            placeholder="Search your verses..."
                            className="px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <select className="px-3 py-2 border rounded-md bg-background">
                            <option>All Tags</option>
                            <option>Favorite</option>
                            <option>Hope</option>
                            <option>Peace</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t">
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">John 3:16</h3>
                            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">Favorite</span>
                          </div>
                          <p className="mb-3">
                            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Added: May 20, 2025</span>
                            <div className="flex gap-2">
                              <button className="hover:text-foreground">Edit</button>
                              <button className="hover:text-foreground">Share</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">Philippians 4:13</h3>
                            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">Strength</span>
                          </div>
                          <p className="mb-3">
                            "I can do all this through him who gives me strength."
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Added: May 18, 2025</span>
                            <div className="flex gap-2">
                              <button className="hover:text-foreground">Edit</button>
                              <button className="hover:text-foreground">Share</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">Psalm 23:1-3</h3>
                            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">Peace</span>
                          </div>
                          <p className="mb-3">
                            "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Added: May 15, 2025</span>
                            <div className="flex gap-2">
                              <button className="hover:text-foreground">Edit</button>
                              <button className="hover:text-foreground">Share</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Image 
                  src="/christian-logo.png" 
                  alt="BibleAF Logo" 
                  width={24} 
                  height={24} 
                />
                <span className="text-sm">BibleAF</span>
              </div>
              <div className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} BibleAF. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DynamicAuthProvider>
  )
}
