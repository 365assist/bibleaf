"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, Sun, Moon, Book, Heart, User, Home, Info, DollarSign, Mail } from "lucide-react"
import { AuthService } from "@/lib/auth"

export function StickyNavigation() {
  const { theme, setTheme } = "next-themes"
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const user = AuthService.getCurrentUser()
    setIsLoggedIn(!!user)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: Book },
    { href: "/about", label: "About", icon: Info },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-warm-200 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-warm-500 focus:ring-offset-2 rounded-md"
            aria-label="BibleAF - Go to homepage"
          >
            <span className="text-warm-700">Bible</span>
            <span className="bg-gradient-to-r from-warm-600 to-warm-700 text-white px-2 py-1 rounded-lg shadow-md">
              AF
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-warm-700 hover:text-warm-900">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-warm-100/50 to-warm-200/50 p-6 no-underline outline-none focus:shadow-md"
                            href="/dashboard"
                          >
                            <Book className="h-6 w-6 text-warm-600" />
                            <div className="mb-2 mt-4 text-lg font-medium text-warm-900">AI Bible Study</div>
                            <p className="text-sm leading-tight text-warm-600">
                              Experience Scripture with intelligent search and AI-powered insights.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/dashboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-warm-50 hover:text-warm-900 focus:bg-warm-50 focus:text-warm-900"
                        >
                          <div className="text-sm font-medium leading-none text-warm-900">Daily Verses</div>
                          <p className="line-clamp-2 text-sm leading-snug text-warm-600">
                            Personalized daily Scripture with AI insights
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/dashboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-warm-50 hover:text-warm-900 focus:bg-warm-50 focus:text-warm-900"
                        >
                          <div className="text-sm font-medium leading-none text-warm-900">Life Guidance</div>
                          <p className="line-clamp-2 text-sm leading-snug text-warm-600">
                            Biblical wisdom for life's challenges
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navigationItems.slice(2).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-warm-50 hover:text-warm-900 focus:bg-warm-50 focus:text-warm-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                          pathname === item.href ? "bg-warm-50 text-warm-900" : "text-warm-700"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full" role="search">
              <Input
                type="search"
                placeholder="Search Bible verses, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-warm-300 focus:ring-warm-500 focus:border-warm-500"
                aria-label="Search Bible verses and topics"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warm-500"
                aria-hidden="true"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 p-0 text-warm-600 hover:text-warm-900 hover:bg-warm-50"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-warm-700 hover:text-warm-900 hover:bg-warm-50"
                  >
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-warm-700 hover:text-warm-900 hover:bg-warm-50"
                  >
                    <Link href="/saved-verses">
                      <Heart className="h-4 w-4 mr-2" />
                      Saved
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-warm-700 hover:text-warm-900 hover:bg-warm-50"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="refined-button">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-9 w-9 p-0 text-warm-600 hover:text-warm-900 hover:bg-warm-50"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-warm-200">
                <SheetHeader>
                  <SheetTitle className="text-warm-900">Navigation</SheetTitle>
                  <SheetDescription className="text-warm-600">Access all BibleAF features and pages</SheetDescription>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="mt-6">
                  <form onSubmit={handleSearch} className="relative" role="search">
                    <Input
                      type="search"
                      placeholder="Search Bible verses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-warm-300 focus:ring-warm-500 focus:border-warm-500"
                      aria-label="Search Bible verses and topics"
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warm-500"
                      aria-hidden="true"
                    />
                  </form>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="mt-6 space-y-2" role="navigation" aria-label="Mobile navigation">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-50 hover:text-warm-900 ${
                        pathname === item.href ? "bg-warm-50 text-warm-900" : "text-warm-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth */}
                <div className="mt-6 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-warm-300 text-warm-700 hover:bg-warm-50"
                        asChild
                      >
                        <Link href="/dashboard">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-warm-300 text-warm-700 hover:bg-warm-50"
                        asChild
                      >
                        <Link href="/saved-verses">
                          <Heart className="h-4 w-4 mr-2" />
                          Saved Verses
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-warm-300 text-warm-700 hover:bg-warm-50"
                        asChild
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button className="w-full refined-button" asChild>
                        <Link href="/auth/signup">Sign Up Free</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
