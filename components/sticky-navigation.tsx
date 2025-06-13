"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function StickyNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

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
      setIsSearchOpen(false)
    }
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/bible", label: "Bible" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                      isActive(route.href) ? "text-blue-600" : "text-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-700 font-bold text-xl">Bible</span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 rounded-lg shadow-md font-bold">
              AF
            </span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <NavigationMenuLink
                  href={route.href}
                  className={isActive(route.href) ? "text-blue-600 bg-blue-50" : ""}
                >
                  {route.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search Bible verses..."
                className="w-[200px] pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <X
                className="absolute right-2 top-2.5 h-4 w-4 cursor-pointer opacity-70"
                onClick={() => setIsSearchOpen(false)}
              />
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>

          <Link href="/auth/signup">
            <Button size="sm" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
